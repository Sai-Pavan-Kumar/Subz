/**
 * Subz — YouTube Subtitle Observer & Scanner Engine
 * Monitors YouTube's caption container, parses subtitle cues in real-time,
 * filters words against CEFR levels and Oxford 3000 whitelist,
 * and attaches interactive Word Card triggers.
 */

const SubzState = {
  settings: {
    enabled: true,
    level: 'intermediate',
    highlightColor: 'amber',
    autoPause: true,
    autoPronounce: false
  },
  knownWords: new Set(),
  processedNodes: new WeakSet()
};

const SubzEngine = {
  observer: null,

  async init() {
    console.log('[Subz] Initializing subtitle observer on YouTube...');

    // 1. Load user settings & known words whitelist from storage
    await this.loadState();

    // 2. Initialize keyboard shortcuts
    if (typeof SubzShortcuts !== 'undefined') {
      SubzShortcuts.init();
    }

    // 3. Listen for runtime storage updates (popup dropdown changes)
    chrome.storage.onChanged.addListener((changes, area) => {
      if (area === 'local') {
        if (changes.subz_settings) {
          SubzState.settings = changes.subz_settings.newValue;
          this.applyTheme(SubzState.settings.highlightColor);
        }
        if (changes.subz_known_words) {
          SubzState.knownWords = new Set(changes.subz_known_words.newValue || []);
        }
      }
    });

    this.applyTheme(SubzState.settings.highlightColor);

    // 4. Listen for context menu lookups ("Search with Subz")
    chrome.runtime.onMessage.addListener((message) => {
      if (message.type === 'SHOW_WORD_CARD' && message.word) {
        const video = document.querySelector('video') || document.body;
        if (typeof SubzCardManager !== 'undefined') {
          SubzCardManager.show(message.word.trim().toLowerCase(), video, null);
        }
      }
    });

    // 5. Start watching for YouTube caption container
    this.startSubtitleObserver();
  },

  async loadState() {
    try {
      const data = await chrome.storage.local.get(['subz_settings', 'subz_known_words']);
      if (data.subz_settings) {
        SubzState.settings = data.subz_settings;
      }
      if (data.subz_known_words) {
        SubzState.knownWords = new Set(data.subz_known_words);
      }
    } catch (err) {
      console.warn('[Subz] Error reading storage:', err);
    }
  },

  applyTheme(color = 'amber') {
    document.body.classList.remove('subz-theme-amber', 'subz-theme-cyan', 'subz-theme-emerald', 'subz-theme-rose');
    document.body.classList.add(`subz-theme-${color}`);
  },

  /**
   * Monitor DOM for YouTube caption container and active segments
   */
  startSubtitleObserver() {
    if (this.observer) this.observer.disconnect();

    this.observer = new MutationObserver((mutations) => {
      if (!SubzState.settings.enabled) return;

      for (const mutation of mutations) {
        // Look for added caption segments
        if (mutation.type === 'childList') {
          for (const node of mutation.addedNodes) {
            if (node.nodeType === Node.ELEMENT_NODE) {
              if (node.classList && node.classList.contains('ytp-caption-segment')) {
                this.processCaptionSegment(node);
              } else {
                // Check descendants for caption segments
                const segments = node.querySelectorAll ? node.querySelectorAll('.ytp-caption-segment') : [];
                segments.forEach(seg => this.processCaptionSegment(seg));
              }
            }
          }
        } else if (mutation.type === 'characterData') {
          const parent = mutation.target.parentElement;
          if (parent && parent.classList.contains('ytp-caption-segment')) {
            this.processCaptionSegment(parent);
          }
        }
      }
    });

    // Observe document body with subtree to catch dynamic video player initialization
    this.observer.observe(document.body, {
      childList: true,
      subtree: true,
      characterData: true
    });

    // Also scan any already rendered caption segments
    document.querySelectorAll('.ytp-caption-segment').forEach(seg => {
      this.processCaptionSegment(seg);
    });
  },

  /**
   * Process a single subtitle segment element
   */
  processCaptionSegment(segmentEl) {
    if (!segmentEl || SubzState.processedNodes.has(segmentEl)) return;
    if (segmentEl.querySelector('.subz-word-highlight')) return; // Already formatted

    const text = segmentEl.textContent || '';
    if (!text.trim()) return;

    SubzState.processedNodes.add(segmentEl);

    const fullSentence = text.trim();
    // Tokenize text into words and delimiters while preserving layout
    const tokens = text.split(/(\s+|[.,!?;:"()\[\]{}]+)/);
    const fragment = document.createDocumentFragment();

    tokens.forEach((token, index) => {
      const cleanWord = token.trim().toLowerCase().replace(/[^a-z'-]/g, '');

      // 1. Filter out Proper Nouns & Brands (e.g. YouTube, Gemini, Apple, MKBHD)
      if (this.isProperNoun(token, index, tokens)) {
        fragment.appendChild(document.createTextNode(token));
        return;
      }

      // 2. Filter against vocabulary criteria
      if (cleanWord.length > 2 && this.shouldHighlightWord(cleanWord)) {
        // Speculative prefetch so definition lookup is 0ms instant on click
        if (typeof SubzDictionaryAPI !== 'undefined' && SubzDictionaryAPI.prefetch) {
          SubzDictionaryAPI.prefetch(cleanWord);
        }

        const span = document.createElement('span');
        span.className = 'subz-word-highlight';
        span.dataset.word = cleanWord;
        span.textContent = token;

        // Click / tap triggers Word Card
        span.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (typeof SubzCardManager !== 'undefined') {
            SubzCardManager.show(cleanWord, span, fullSentence);
          }
        });

        fragment.appendChild(span);
      } else if (cleanWord.length > 1) {
        // 3. Unhighlighted word: Make it clickable on demand (subtle dotted hover)
        const plainSpan = document.createElement('span');
        plainSpan.className = 'subz-word-plain';
        plainSpan.dataset.word = cleanWord;
        plainSpan.textContent = token;

        plainSpan.addEventListener('click', (e) => {
          e.stopPropagation();
          e.preventDefault();
          if (typeof SubzCardManager !== 'undefined') {
            SubzCardManager.show(cleanWord, plainSpan, fullSentence);
          }
        });

        fragment.appendChild(plainSpan);
      } else {
        fragment.appendChild(document.createTextNode(token));
      }
    });

    segmentEl.innerHTML = '';
    segmentEl.appendChild(fragment);
  },

  /**
   * Detect proper nouns, brand names, and platform acronyms
   */
  isProperNoun(token, index, tokens) {
    const raw = token.trim();
    if (!raw) return false;

    // Mixed case / CamelCase (e.g. YouTube, iPhone, ChatGPT, PlayStation)
    if (/[a-z][A-Z]/.test(raw)) return true;

    // All-caps acronyms / brand abbreviations (e.g. AI, GPU, MKBHD, USB, CC)
    if (/^[A-Z0-9]{2,}$/.test(raw)) return true;

    // Capitalized word in the middle of a sentence (e.g. "ask Gemini to", "look through YouTube")
    if (/^[A-Z][a-z]+$/.test(raw)) {
      let isSentenceStart = true;
      for (let i = index - 1; i >= 0; i--) {
        const prev = tokens[i].trim();
        if (prev.length > 0) {
          isSentenceStart = /[.?!]$/.test(prev);
          break;
        }
      }
      if (!isSentenceStart) {
        return true; // Mid-sentence capitalized word is a Proper Noun (Brand/Name/Entity)
      }
    }

    return false;
  },

  /**
   * Determine if a word should be highlighted based on CEFR level and whitelist
   */
  shouldHighlightWord(word) {
    if (!word || word.length < 3) return false;

    // 1. Whitelist check: 14,650+ common everyday words and their inflections are NEVER highlighted
    if (typeof SUBZ_COMMON_WORDS !== 'undefined') {
      if (SUBZ_COMMON_WORDS.has(word)) return false;
      const stripped = word.replace(/'/g, '');
      if (SUBZ_COMMON_WORDS.has(stripped)) return false;

      if (typeof SubzLemmatizer !== 'undefined') {
        const commonRoot = SubzLemmatizer.findRoot(word, SUBZ_COMMON_WORDS) || SubzLemmatizer.findRoot(stripped, SUBZ_COMMON_WORDS);
        if (commonRoot) return false;
      }
    }

    // 2. User's personalized known words whitelist
    if (SubzState.knownWords.has(word)) {
      return false;
    }

    const targetLevel = SubzState.settings.level || 'intermediate';

    // 3. Match against curated vocabulary core (exact match or lemmatized root)
    let vocabEntry = null;
    if (typeof SUBZ_VOCAB_CORE !== 'undefined') {
      if (SUBZ_VOCAB_CORE[word]) {
        vocabEntry = SUBZ_VOCAB_CORE[word];
      } else if (typeof SubzLemmatizer !== 'undefined') {
        const vocabRoot = SubzLemmatizer.findRoot(word, SUBZ_VOCAB_CORE);
        if (vocabRoot && SUBZ_VOCAB_CORE[vocabRoot]) {
          vocabEntry = SUBZ_VOCAB_CORE[vocabRoot];
        }
      }
    }

    if (vocabEntry) {
      const entryLevel = (vocabEntry.level || 'intermediate').toLowerCase();
      if (targetLevel === 'learner') {
        return true;
      } else if (targetLevel === 'intermediate') {
        return entryLevel === 'intermediate' || entryLevel === 'advanced';
      } else if (targetLevel === 'advanced') {
        return entryLevel === 'advanced';
      }
    }

    // 4. Genuine Uncommon / Advanced English words
    // If a word is NOT in the 14,650 everyday words whitelist and NOT a proper noun:
    if (/^[a-z]+$/.test(word)) {
      if (targetLevel === 'learner' && word.length >= 5) {
        return true;
      }
      if (targetLevel === 'intermediate' && word.length >= 6) {
        return true;
      }
      if (targetLevel === 'advanced' && word.length >= 8) {
        return true;
      }
    }

    return false;
  }
};

// Start Subz engine on page load
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', () => SubzEngine.init());
} else {
  SubzEngine.init();
}
