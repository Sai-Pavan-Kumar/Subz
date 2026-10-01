/**
 * Subz — Background Service Worker (Manifest V3)
 * Handles installation lifecycle, settings defaults, and acts as the
 * network proxy for dictionary API lookups (bypassing YouTube's CSP).
 * Includes intelligent definition ranking to pick simple, everyday definitions.
 */

const DEFAULT_SETTINGS = {
  enabled: true,
  level: 'intermediate', // 'learner' (A2/B1), 'intermediate' (B2), 'advanced' (C1/C2)
  highlightColor: 'amber', // 'amber', 'cyan', 'emerald', 'rose'
  autoPause: true,
  autoPronounce: false
};

const getTodayString = () => {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}-${String(now.getDate()).padStart(2, '0')}`;
};

const DEFAULT_STATS = {
  dailyGoal: 5,
  todayDate: getTodayString(),
  todayCount: 0,
  streak: 1
};

function setupContextMenu() {
  if (chrome.contextMenus) {
    chrome.contextMenus.removeAll(() => {
      chrome.contextMenus.create({
        id: 'subz_search_context',
        title: 'Search "%s" with Subz',
        contexts: ['selection']
      });
    });
  }
}

chrome.runtime.onInstalled.addListener(async (details) => {
  setupContextMenu();
  if (details.reason === 'install') {
    console.log('[Subz] First-time install detected. Initializing storage defaults...');
    await chrome.storage.local.set({
      subz_settings: DEFAULT_SETTINGS,
      subz_stats: DEFAULT_STATS,
      subz_saved_words: [],
      subz_known_words: []
    });
  } else if (details.reason === 'update') {
    const current = await chrome.storage.local.get(['subz_settings', 'subz_stats', 'subz_saved_words', 'subz_known_words']);
    await chrome.storage.local.set({
      subz_settings: { ...DEFAULT_SETTINGS, ...(current.subz_settings || {}) },
      subz_stats: { ...DEFAULT_STATS, ...(current.subz_stats || {}) },
      subz_saved_words: current.subz_saved_words || [],
      subz_known_words: current.subz_known_words || []
    });
  }
});

chrome.runtime.onStartup.addListener(() => {
  setupContextMenu();
});

chrome.contextMenus.onClicked.addListener((info, tab) => {
  if (info.menuItemId === 'subz_search_context' && info.selectionText && tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, {
      type: 'SHOW_WORD_CARD',
      word: info.selectionText.trim()
    });
  }
});

/**
 * Handle API lookups in the background to avoid page Content Security Policy (CSP) errors on YouTube
 */
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'LOOKUP_WORD') {
    lookupWordFromBackground(message.word)
      .then(res => sendResponse(res))
      .catch(err => {
        console.error('[Subz Background] Lookup error:', err);
        sendResponse(null);
      });
    return true; // Crucial: Keep message channel open for async response
  }

  if (message.type === 'GET_SETTINGS') {
    chrome.storage.local.get(['subz_settings', 'subz_stats'], (data) => {
      sendResponse(data);
    });
    return true;
  }
});

async function fetchWithTimeout(url, options = {}, timeoutMs = 2500) {
  const controller = new AbortController();
  const id = setTimeout(() => controller.abort(), timeoutMs);
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(id);
    return res;
  } catch (err) {
    clearTimeout(id);
    throw err;
  }
}

async function lookupWordFromBackground(word) {
  if (!word) return null;
  const cleanWord = word.trim().toLowerCase();

  // 1. Check storage cache first (0ms)
  const cacheKey = `subz_cache_${cleanWord}`;
  try {
    const cached = await chrome.storage.local.get(cacheKey);
    if (cached && cached[cacheKey]) {
      return { ...cached[cacheKey], source: 'cache' };
    }
  } catch (err) {
    console.warn('[Subz Background] Storage cache read error:', err);
  }

  // 2. Multi-tier lookup cascade: FreeDictionary -> Datamuse -> Wiktionary
  let result = await tryAllSources(cleanWord);

  // 3. If inflected word failed, try candidate root words (e.g. dissects -> dissect)
  if (!result) {
    const candidates = getLemmatizerCandidates(cleanWord);
    for (const root of candidates) {
      if (root !== cleanWord) {
        result = await tryAllSources(root);
        if (result) {
          result.word = cleanWord;
          result.rootWord = root;
          break;
        }
      }
    }
  }

  // 4. Cache successful result
  if (result) {
    try {
      await chrome.storage.local.set({ [cacheKey]: result });
    } catch (e) {}
  }

  return result;
}

function getLemmatizerCandidates(w) {
  if (!w || w.length < 3) return [w];
  const candidates = [w];
  if (w.endsWith('ies') && w.length > 4) candidates.push(w.slice(0, -3) + 'y');
  if (w.endsWith('es') && w.length > 3) {
    candidates.push(w.slice(0, -2));
    candidates.push(w.slice(0, -1));
  }
  if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) candidates.push(w.slice(0, -1));
  if (w.endsWith('ied') && w.length > 4) candidates.push(w.slice(0, -3) + 'y');
  if (w.endsWith('ed') && w.length > 4) {
    candidates.push(w.slice(0, -2));
    candidates.push(w.slice(0, -1));
  }
  if (w.endsWith('ing') && w.length > 5) {
    candidates.push(w.slice(0, -3));
    candidates.push(w.slice(0, -3) + 'e');
  }
  if (w.endsWith('ly') && w.length > 4) candidates.push(w.slice(0, -2));
  return [...new Set(candidates)];
}

async function tryAllSources(word) {
  // Source A: Free Dictionary API (rich phonetics & audio)
  try {
    const response = await fetchWithTimeout(`https://api.dictionaryapi.dev/api/v2/entries/en/${encodeURIComponent(word)}`, {}, 2500);
    const contentType = response.headers.get('content-type') || '';
    if (response.ok && contentType.includes('application/json')) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0) {
        const entry = data[0];
        let phonetic = entry.phonetic || '';
        if (!phonetic && entry.phonetics && entry.phonetics.length > 0) {
          const p = entry.phonetics.find(item => item.text && item.text.length > 0);
          if (p) phonetic = p.text;
        }

        let audioUrl = '';
        if (entry.phonetics && entry.phonetics.length > 0) {
          const audioItem = entry.phonetics.find(item => item.audio && item.audio.length > 0);
          if (audioItem) audioUrl = audioItem.audio;
        }

        const bestMeaning = selectBestMeaning(word, entry.meanings || []);
        if (bestMeaning && bestMeaning.definition) {
          return {
            word,
            phonetic,
            partOfSpeech: bestMeaning.partOfSpeech,
            level: word.length >= 8 ? 'Advanced' : 'Intermediate',
            definition: bestMeaning.definition,
            synonyms: bestMeaning.synonyms || [],
            audioUrl,
            source: 'free_dictionary'
          };
        }
      }
    }
  } catch (err) {
    // Cloudflare timeout or downtime on FreeDictionary API — continue to Datamuse
  }

  // Source B: Datamuse API (fast, high-availability, concise definitions)
  try {
    const response = await fetchWithTimeout(`https://api.datamuse.com/words?sp=${encodeURIComponent(word)}&md=dp&max=1`, {}, 3000);
    if (response.ok) {
      const data = await response.json();
      if (Array.isArray(data) && data.length > 0 && data[0].defs) {
        for (const raw of data[0].defs) {
          const parts = raw.split('\t');
          const posMap = { n: 'noun', v: 'verb', adj: 'adjective', adv: 'adverb', u: 'word' };
          const pos = posMap[parts[0]] || 'word';
          let def = parts.slice(1).join('\t').replace(/^\s*\([^)]*\)\s*/g, '').trim();
          if (def.length >= 10) {
            return {
              word,
              phonetic: '',
              partOfSpeech: pos,
              level: word.length >= 8 ? 'Advanced' : 'Intermediate',
              definition: def.charAt(0).toUpperCase() + def.slice(1),
              synonyms: [],
              audioUrl: '',
              source: 'datamuse'
            };
          }
        }
      }
    }
  } catch (err) {
    // Continue to Wiktionary
  }

  // Source C: Wiktionary REST API (global encyclopedia CDN)
  try {
    const response = await fetchWithTimeout(`https://en.wiktionary.org/api/rest_v1/page/definition/${encodeURIComponent(word)}`, {
      headers: { 'User-Agent': 'SubzExtension/1.0 (Educational)' }
    }, 3000);
    if (response.ok) {
      const data = await response.json();
      if (data.en && Array.isArray(data.en)) {
        for (const group of data.en) {
          const pos = group.partOfSpeech || 'word';
          if (group.definitions && group.definitions.length > 0) {
            for (const d of group.definitions) {
              const raw = d.definition ? d.definition.replace(/<[^>]+>/g, '').trim() : '';
              const cleaned = raw.replace(/^\s*\([^)]*\)\s*/, '').trim();
              if (cleaned.length >= 10 && !/archaic|obsolete|taxonomy/i.test(cleaned)) {
                return {
                  word,
                  phonetic: '',
                  partOfSpeech: pos,
                  level: word.length >= 8 ? 'Advanced' : 'Intermediate',
                  definition: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
                  synonyms: [],
                  audioUrl: '',
                  source: 'wiktionary'
                };
              }
            }
          }
        }
      }
    }
  } catch (err) {}

  return null;
}

/**
 * Intelligent Definition Selector:
 * Skips esoteric, archaic, or specialized jargon (e.g. Chinese writing systems)
 * and picks the clearest, most applicable everyday definition.
 */
function selectBestMeaning(word, meanings) {
  if (!meanings || meanings.length === 0) return null;

  // Determine preferred part of speech based on standard morphological suffix
  let preferredPos = 'any';
  if (/ic$|al$|ive$|ous$|ful$|able$|ible$|less$/.test(word)) preferredPos = 'adjective';
  else if (/ly$/.test(word)) preferredPos = 'adverb';
  else if (/tion$|sion$|ment$|ness$|ity$|ism$/.test(word)) preferredPos = 'noun';
  else if (/ize$|ise$|ate$|en$/.test(word)) preferredPos = 'verb';

  let candidates = [];

  for (const m of meanings) {
    const pos = m.partOfSpeech || 'word';
    for (const d of (m.definitions || [])) {
      const rawText = d.definition || '';
      
      // Filter out esoteric, linguistic, or historical jargon
      if (/writing system|phono-semantic|archaic|obsolete|taxonomy|specifically:|heraldry/i.test(rawText)) {
        continue;
      }

      // Clean leading parenthetical contexts like "(software design, of code)"
      const cleaned = rawText.replace(/^\s*\([^)]*\)\s*/, '').trim();

      // Score candidate: match preferred part of speech + prefer concise definitions
      let score = 0;
      if (pos === preferredPos) score += 12;
      if (cleaned.length >= 20 && cleaned.length <= 130) score += 8; // Sweet spot for understandable definitions
      if (d.synonyms && d.synonyms.length > 0) score += 2;

      candidates.push({
        partOfSpeech: pos,
        definition: cleaned.charAt(0).toUpperCase() + cleaned.slice(1),
        synonyms: (d.synonyms && d.synonyms.length > 0 ? d.synonyms : m.synonyms || []).slice(0, 3),
        score
      });
    }
  }

  // Fallback: If all were filtered, take first available cleaned definition
  if (candidates.length === 0) {
    for (const m of meanings) {
      for (const d of (m.definitions || [])) {
        if (d.definition) {
          return {
            partOfSpeech: m.partOfSpeech || 'noun',
            definition: d.definition,
            synonyms: (d.synonyms || m.synonyms || []).slice(0, 3)
          };
        }
      }
    }
    return null;
  }

  candidates.sort((a, b) => b.score - a.score);
  return candidates[0];
}
