/**
 * Subz — Popup Dashboard Controller
 * Manages user preferences, daily goal streak, saved words review,
 * and formatted .txt file export.
 */

document.addEventListener('DOMContentLoaded', async () => {
  // Elements
  const toggleEnabled = document.getElementById('toggle-enabled');
  const selectLevel = document.getElementById('select-level');
  const selectColor = document.getElementById('select-color');
  const toggleAutoPause = document.getElementById('toggle-autopause');
  const toggleAutoPronounce = document.getElementById('toggle-autopronounce');

  const goalProgressFill = document.getElementById('goal-progress-fill');
  const goalStatusText = document.getElementById('goal-status-text');
  const streakBadge = document.getElementById('streak-badge');

  const savedCountEl = document.getElementById('saved-count');
  const savedListEl = document.getElementById('saved-list');
  const savedEmptyEl = document.getElementById('saved-empty');
  const searchInput = document.getElementById('search-saved');

  const btnExportTxt = document.getElementById('btn-export-txt');
  const btnClearSaved = document.getElementById('btn-clear-saved');

  // Quick Word Lookup Elements
  const quickSearchInput = document.getElementById('quick-search-input');
  const quickSearchResult = document.getElementById('quick-search-result');
  const quickWordTitle = document.getElementById('quick-word-title');
  const quickWordBadge = document.getElementById('quick-word-badge');
  const quickSaveBtn = document.getElementById('quick-save-btn');
  const quickPhoneticText = document.getElementById('quick-phonetic-text');
  const quickAudioBtn = document.getElementById('quick-audio-btn');
  const quickDefText = document.getElementById('quick-def-text');

  let activeQuickEntry = null;
  let allSavedWords = [];

  // 1. Load initial state from storage
  const data = await chrome.storage.local.get([
    'subz_settings',
    'subz_stats',
    'subz_saved_words'
  ]);

  const settings = data.subz_settings || {
    enabled: true,
    level: 'intermediate',
    highlightColor: 'amber',
    autoPause: true,
    autoPronounce: false
  };

  const stats = data.subz_stats || {
    dailyGoal: 5,
    todayCount: 0,
    streak: 1
  };

  allSavedWords = data.subz_saved_words || [];

  // 2. Populate form controls
  toggleEnabled.checked = settings.enabled !== false;
  selectLevel.value = settings.level || 'intermediate';
  selectColor.value = settings.highlightColor || 'amber';
  toggleAutoPause.checked = settings.autoPause !== false;
  toggleAutoPronounce.checked = settings.autoPronounce === true;

  // 3. Render Daily Goal Progress
  const goal = stats.dailyGoal || 5;
  const count = stats.todayCount || 0;
  const percent = Math.min(100, Math.round((count / goal) * 100));
  goalProgressFill.style.width = `${percent}%`;
  goalStatusText.innerText = `${count} of ${goal} words learned today`;
  streakBadge.innerText = `🔥 ${stats.streak || 1}-Day Streak`;

  // 4. Render Saved Words
  renderSavedList(allSavedWords);

  // 5. Bind Setting Change Listeners
  const saveSettings = async () => {
    const updated = {
      enabled: toggleEnabled.checked,
      level: selectLevel.value,
      highlightColor: selectColor.value,
      autoPause: toggleAutoPause.checked,
      autoPronounce: toggleAutoPronounce.checked
    };
    await chrome.storage.local.set({ subz_settings: updated });
  };

  toggleEnabled.addEventListener('change', saveSettings);
  selectLevel.addEventListener('change', saveSettings);
  selectColor.addEventListener('change', saveSettings);
  toggleAutoPause.addEventListener('change', saveSettings);
  toggleAutoPronounce.addEventListener('change', saveSettings);

  // Quick Word Search Implementation
  async function performQuickLookup(rawWord) {
    const clean = rawWord.trim().toLowerCase().replace(/[^a-z'-]/g, '');
    if (!clean) {
      quickSearchResult.style.display = 'none';
      return;
    }

    quickSearchResult.style.display = 'block';
    quickWordTitle.innerText = clean.toUpperCase();
    quickWordBadge.innerText = 'Searching...';
    quickPhoneticText.innerText = '';
    quickDefText.innerHTML = '<span style="color: #64748B; font-style: italic;">Looking up definition...</span>';

    // 1. Check in-memory core dictionary (0ms)
    let entry = null;
    if (typeof SUBZ_VOCAB_CORE !== 'undefined') {
      if (SUBZ_VOCAB_CORE[clean]) {
        entry = { word: clean, ...SUBZ_VOCAB_CORE[clean] };
      } else if (typeof SubzLemmatizer !== 'undefined') {
        const root = SubzLemmatizer.findRoot(clean, SUBZ_VOCAB_CORE);
        if (root && SUBZ_VOCAB_CORE[root]) {
          entry = { word: clean, rootWord: root, ...SUBZ_VOCAB_CORE[root] };
        }
      }
    }

    if (!entry) {
      entry = await new Promise((resolve) => {
        chrome.runtime.sendMessage({ type: 'LOOKUP_WORD', word: clean }, (res) => {
          resolve(res || null);
        });
      });
    }

    activeQuickEntry = entry;

    if (entry && entry.definition) {
      quickWordTitle.innerText = entry.word.toUpperCase();
      quickWordBadge.innerText = entry.level || 'Vocabulary';
      quickPhoneticText.innerText = entry.phonetic || '';
      quickDefText.innerText = entry.definition;

      // Update save button state
      const isSaved = allSavedWords.some(item => item.word.toLowerCase() === clean);
      quickSaveBtn.innerText = isSaved ? '★ Saved' : '☆ Save';
      quickSaveBtn.classList.toggle('subz-saved', isSaved);
    } else {
      quickWordBadge.innerText = 'Word Note';
      quickDefText.innerHTML = `
        <span style="color: #64748B;">Definition not found in quick dictionary.</span><br>
        <a href="https://www.google.com/search?q=define+${encodeURIComponent(clean)}" target="_blank" style="color: #006CF2; text-decoration: underline; font-weight: 600; display: inline-block; margin-top: 4px;">
          Search "${clean}" on Google ↗
        </a>
      `;
    }
  }

  quickSearchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      performQuickLookup(quickSearchInput.value);
    }
  });

  quickAudioBtn.addEventListener('click', () => {
    if (activeQuickEntry && 'speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const u = new SpeechSynthesisUtterance(activeQuickEntry.word);
      u.lang = 'en-US';
      window.speechSynthesis.speak(u);
    }
  });

  quickSaveBtn.addEventListener('click', async () => {
    if (!activeQuickEntry) return;
    const clean = activeQuickEntry.word.toLowerCase();
    const index = allSavedWords.findIndex(item => item.word.toLowerCase() === clean);

    if (index >= 0) {
      allSavedWords.splice(index, 1);
      quickSaveBtn.innerText = '☆ Save';
      quickSaveBtn.classList.remove('subz-saved');
    } else {
      allSavedWords.unshift({
        word: activeQuickEntry.word,
        phonetic: activeQuickEntry.phonetic || '',
        partOfSpeech: activeQuickEntry.partOfSpeech || 'word',
        level: activeQuickEntry.level || 'Intermediate',
        definition: activeQuickEntry.definition || '',
        synonyms: activeQuickEntry.synonyms || [],
        context: 'Manual search',
        dateAdded: new Date().toISOString()
      });
      quickSaveBtn.innerText = '★ Saved';
      quickSaveBtn.classList.add('subz-saved');
    }

    await chrome.storage.local.set({ subz_saved_words: allSavedWords });
    renderSavedList(allSavedWords);
  });

  // 6. Search Filter
  searchInput.addEventListener('input', (e) => {
    const query = e.target.value.trim().toLowerCase();
    if (!query) {
      renderSavedList(allSavedWords);
    } else {
      const filtered = allSavedWords.filter(item => 
        item.word.toLowerCase().includes(query) ||
        (item.definition && item.definition.toLowerCase().includes(query))
      );
      renderSavedList(filtered);
    }
  });

  // 7. Render Saved Words Function
  function renderSavedList(list) {
    savedCountEl.innerText = allSavedWords.length;
    savedListEl.innerHTML = '';

    if (!list || list.length === 0) {
      savedEmptyEl.style.display = 'block';
      savedListEl.appendChild(savedEmptyEl);
      return;
    }

    savedEmptyEl.style.display = 'none';

    list.forEach(item => {
      const div = document.createElement('div');
      div.className = 'subz-saved-item';
      div.innerHTML = `
        <span class="subz-item-word">${escapeHTML(item.word.toUpperCase())}</span>
        <span class="subz-item-def" title="${escapeHTML(item.definition || '')}">${escapeHTML(item.definition || 'Saved word')}</span>
      `;
      savedListEl.appendChild(div);
    });
  }

  // 8. Download as .txt Action
  btnExportTxt.addEventListener('click', () => {
    if (allSavedWords.length === 0) {
      alert('Your saved vocabulary list is empty. Click the star on word cards while watching videos to save words!');
      return;
    }

    const todayStr = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    let content = '======================================================\n';
    content += 'SUBZ VOCABULARY NOTEBOOK\n';
    content += `Exported on: ${todayStr}\n`;
    content += `Total Saved Words: ${allSavedWords.length}\n`;
    content += '======================================================\n\n';

    allSavedWords.forEach((item, idx) => {
      const phonetic = item.phonetic ? ` (${item.phonetic})` : '';
      const part = item.partOfSpeech ? ` - ${item.partOfSpeech}` : '';
      const level = item.level ? ` [${item.level}]` : '';
      const synonyms = item.synonyms && item.synonyms.length > 0 ? item.synonyms.join(', ') : 'None';

      content += `${idx + 1}. ${item.word.toUpperCase()}${phonetic}${part}${level}\n`;
      content += `   Meaning: ${item.definition || 'N/A'}\n`;
      content += `   Synonyms: ${synonyms}\n`;
      if (item.context) {
        content += `   Context: "${item.context.trim()}"\n`;
      }
      content += '------------------------------------------------------\n';
    });

    content += '\nGenerated with Subz — Master English While Watching.\n';

    // Trigger download
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `subz-vocabulary-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  });

  // 9. Clear Saved List
  btnClearSaved.addEventListener('click', async () => {
    if (allSavedWords.length === 0) return;
    if (confirm('Are you sure you want to clear your saved vocabulary list?')) {
      allSavedWords = [];
      await chrome.storage.local.set({ subz_saved_words: [] });
      renderSavedList([]);
    }
  });

  function escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
});
