/**
 * Subz — Word Card Manager (Apple x Google Minimalist Edition)
 * Pure light mode, responsive, high-framerate micro-interactions.
 * Integrates directly with YouTube's native #movie_player for flawless pause/resume/seek.
 */

const SubzCardManager = {
  currentCard: null,
  activeWord: null,

  /**
   * Resume video playback reliably across YouTube's player states
   */
  _resumeVideo() {
    try {
      // 1. YouTube native API (most reliable)
      const player = document.querySelector('#movie_player');
      if (player && typeof player.playVideo === 'function') {
        player.playVideo();
      }

      // 2. Standard HTML5 video element fallback
      const video = document.querySelector('video');
      if (video && video.paused) {
        const p = video.play();
        if (p && typeof p.catch === 'function') {
          p.catch(() => {
            // 3. Fallback: Dispatch YouTube play/pause shortcut ('k')
            const ev = new KeyboardEvent('keydown', { key: 'k', code: 'KeyK', keyCode: 75, which: 75, bubbles: true });
            document.dispatchEvent(ev);
          });
        }
      }
    } catch (err) {
      console.warn('[Subz] Error resuming video:', err);
    }
  },

  /**
   * Pause video playback reliably
   */
  _pauseVideo() {
    try {
      const player = document.querySelector('#movie_player');
      if (player && typeof player.pauseVideo === 'function') {
        player.pauseVideo();
      } else {
        const video = document.querySelector('video');
        if (video) video.pause();
      }
    } catch (err) {
      console.warn('[Subz] Error pausing video:', err);
    }
  },

  /**
   * Rewind scene by specified seconds and resume
   */
  _replayScene(seconds = 5) {
    try {
      const player = document.querySelector('#movie_player');
      const video = document.querySelector('video');
      if (player && typeof player.getCurrentTime === 'function' && typeof player.seekTo === 'function') {
        const t = Math.max(0, player.getCurrentTime() - seconds);
        player.seekTo(t, true);
        if (typeof player.playVideo === 'function') {
          player.playVideo();
        }
      } else if (video) {
        video.currentTime = Math.max(0, video.currentTime - seconds);
        video.play().catch(() => {});
      }
    } catch (err) {
      console.warn('[Subz] Error replaying scene:', err);
    }
  },

  /**
   * Present the Word Card for a target word element
   */
  async show(word, targetElement, contextSentence) {
    if (!word || !targetElement) return;

    // 1. Remove any active card
    this.hide();

    // 2. Pause video immediately if autoPause is enabled
    if (SubzState.settings.autoPause) {
      this._pauseVideo();
    }

    const cleanWord = word.trim().toLowerCase();
    this.activeWord = cleanWord;

    // 3. Render Card Skeleton with Apple-grade typography & tactile controls
    const card = document.createElement('div');
    card.id = 'subz-word-card';

    const formattedTitle = cleanWord.charAt(0).toUpperCase() + cleanWord.slice(1);

    card.innerHTML = `
      <div class="subz-card-header">
        <div class="subz-word-title-row">
          <h3 class="subz-card-word">${this._escapeHTML(formattedTitle)}</h3>
          <span class="subz-card-pos" id="subz-pos-tag" style="display: none;"></span>
          <span class="subz-card-badge" id="subz-level-badge">Loading...</span>
        </div>
        <button class="subz-btn-save" id="subz-save-btn" title="Save to vocabulary notebook" disabled>
          <svg class="subz-star-icon" width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon>
          </svg>
          <span id="subz-save-label">Save</span>
        </button>
      </div>

      <div class="subz-card-audio-bar">
        <span class="subz-card-phonetic" id="subz-phonetic-text"></span>
        <div class="subz-audio-group">
          <button class="subz-audio-pill" id="subz-audio-normal" title="Normal pronunciation (1.0x)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
              <path d="M15.54 8.46a5 5 0 0 1 0 7.07"></path>
            </svg>
            1.0x
          </button>
          <button class="subz-audio-pill" id="subz-audio-slow" title="Slow pronunciation (0.75x)">
            <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
              <circle cx="12" cy="12" r="10"></circle>
              <polyline points="12 6 12 12 16 14"></polyline>
            </svg>
            0.75x
          </button>
        </div>
      </div>

      <div class="subz-card-definition" id="subz-def-text">
        <div class="subz-def-loading">Fetching definition...</div>
      </div>

      <div class="subz-card-synonyms" id="subz-syn-container" style="display: none;">
        <span class="subz-syn-label">Synonyms:</span>
        <span id="subz-syn-text"></span>
      </div>

      ${contextSentence ? `
        <div class="subz-card-context">
          <div class="subz-context-header">IN THIS SCENE</div>
          <div class="subz-context-text">"${this._escapeHTML(contextSentence.trim())}"</div>
        </div>
      ` : ''}

      <div class="subz-card-footer">
        <button class="subz-btn-replay" id="subz-btn-replay" title="Rewind 5 seconds & play scene">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
            <polyline points="1 4 1 10 7 10"></polyline>
            <path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10"></path>
          </svg>
          Replay 5s
        </button>
        <button class="subz-btn-know" id="subz-btn-know" title="Never highlight this word again">
          I know this
        </button>
        <button class="subz-btn-resume" id="subz-btn-resume" title="Resume video playback">
          Resume
          <svg width="11" height="11" viewBox="0 0 24 24" fill="currentColor">
            <polygon points="5 3 19 12 5 21 5 3"></polygon>
          </svg>
        </button>
      </div>
    `;

    // Mount to the highest active container (handles fullscreen and standard players)
    const container = document.fullscreenElement || document.querySelector('#movie_player') || document.body;
    container.appendChild(card);
    this.currentCard = card;

    // Position card relative to container
    this._positionCard(card, targetElement, container);

    // Bind speech buttons
    this._bindAudioButtons(card, cleanWord);

    // Bind footer controls
    this._bindBasicControls(card, cleanWord);

    // 4. Resolve definition via Memory Cache / Core Dictionary / Background Proxy
    let entry = null;
    try {
      entry = await SubzDictionaryAPI.lookup(cleanWord);
    } catch (err) {
      console.warn('[Subz] Lookup error:', err);
    }

    // 5. Update Card with resolved data
    if (!this.currentCard || this.activeWord !== cleanWord) return;

    const levelBadge = card.querySelector('#subz-level-badge');
    const posTag = card.querySelector('#subz-pos-tag');
    const phoneticText = card.querySelector('#subz-phonetic-text');
    const defText = card.querySelector('#subz-def-text');
    const synContainer = card.querySelector('#subz-syn-container');
    const synText = card.querySelector('#subz-syn-text');
    const saveBtn = card.querySelector('#subz-save-btn');
    const saveLabel = card.querySelector('#subz-save-label');

    if (entry && entry.definition) {
      const isAdvanced = (entry.level || '').toLowerCase() === 'advanced';
      if (levelBadge) {
        levelBadge.innerText = entry.level || 'Vocabulary';
        levelBadge.className = `subz-card-badge ${isAdvanced ? 'subz-badge-advanced' : 'subz-badge-intermediate'}`;
      }

      if (posTag && entry.partOfSpeech) {
        posTag.innerText = entry.partOfSpeech;
        posTag.style.display = 'inline-block';
      }

      if (phoneticText) {
        if (entry.phonetic && entry.rootWord && entry.rootWord !== cleanWord) {
          phoneticText.innerText = `${entry.phonetic} (root: ${entry.rootWord})`;
        } else if (entry.phonetic) {
          phoneticText.innerText = entry.phonetic;
        } else if (entry.rootWord && entry.rootWord !== cleanWord) {
          phoneticText.innerText = `(root: ${entry.rootWord})`;
        } else {
          phoneticText.innerText = '';
        }
      }

      if (defText) {
        defText.innerText = entry.definition;
      }

      if (entry.synonyms && entry.synonyms.length > 0) {
        if (synContainer && synText) {
          synContainer.style.display = 'block';
          synText.innerText = entry.synonyms.join(', ');
        }
      }

      // Check if already saved
      const savedWords = await this._getSavedWords();
      const isSaved = savedWords.some(item => item.word.toLowerCase() === cleanWord);

      if (saveBtn) {
        saveBtn.disabled = false;
        saveBtn.classList.toggle('subz-saved', isSaved);
        if (saveLabel) saveLabel.innerText = isSaved ? 'Saved' : 'Save';

        saveBtn.onclick = async (e) => {
          e.stopPropagation();
          const nowSaved = await this._toggleSaveWord(entry, contextSentence);
          saveBtn.classList.toggle('subz-saved', nowSaved);
          if (saveLabel) saveLabel.innerText = nowSaved ? 'Saved' : 'Save';
        };
      }

      // Auto-pronounce if enabled
      if (SubzState.settings.autoPronounce) {
        this.playAudio(cleanWord, 1.0);
      }
    } else {
      if (levelBadge) levelBadge.innerText = 'Word Note';
      if (phoneticText) phoneticText.innerText = '';
      if (defText) {
        defText.innerHTML = `
          <div style="color: #475569; font-size: 13px;">
            Definition not found in quick dictionary.<br>
            <a href="https://www.google.com/search?q=define+${encodeURIComponent(cleanWord)}" target="_blank" style="color: #006CF2; text-decoration: underline; font-weight: 600; display: inline-block; margin-top: 6px;">
              Search "${cleanWord}" on Google ↗
            </a>
          </div>
        `;
      }
    }

    // Reposition in case height changed
    this._positionCard(card, targetElement, container);
  },

  /**
   * Hide and remove the active Word Card
   */
  hide() {
    if (this.currentCard && this.currentCard.parentNode) {
      this.currentCard.parentNode.removeChild(this.currentCard);
    }
    this.currentCard = null;
    this.activeWord = null;
  },

  /**
   * Play speech pronunciation using native Web Speech API (offline, zero lag)
   */
  playAudio(word, rate = 1.0) {
    if (!('speechSynthesis' in window)) return;
    window.speechSynthesis.cancel();

    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    utterance.rate = rate;
    utterance.pitch = 1.0;
    window.speechSynthesis.speak(utterance);
  },

  /**
   * Calculate position avoiding viewport and player overflow
   */
  _positionCard(card, targetElement, container) {
    const targetRect = targetElement.getBoundingClientRect();
    const cardRect = card.getBoundingClientRect();

    let top = 0;
    let left = 0;

    if (container === document.body) {
      top = targetRect.top - cardRect.height - 12;
      left = targetRect.left + (targetRect.width / 2) - (cardRect.width / 2);

      if (top < 12) {
        top = targetRect.bottom + 12;
      }
      if (left < 12) left = 12;
      if (left + cardRect.width > window.innerWidth - 12) {
        left = window.innerWidth - cardRect.width - 12;
      }
    } else {
      const containerRect = container.getBoundingClientRect();
      top = (targetRect.top - containerRect.top) - cardRect.height - 12;
      left = (targetRect.left - containerRect.left) + (targetRect.width / 2) - (cardRect.width / 2);

      if (top < 12) {
        top = (targetRect.bottom - containerRect.top) + 12;
      }
      if (left < 12) left = 12;
      if (left + cardRect.width > containerRect.width - 12) {
        left = containerRect.width - cardRect.width - 12;
      }
    }

    card.style.top = `${Math.round(top)}px`;
    card.style.left = `${Math.round(left)}px`;
  },

  _bindAudioButtons(card, word) {
    const normalAudioBtn = card.querySelector('#subz-audio-normal');
    if (normalAudioBtn) {
      normalAudioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playAudio(word, 1.0);
      };
    }

    const slowAudioBtn = card.querySelector('#subz-audio-slow');
    if (slowAudioBtn) {
      slowAudioBtn.onclick = (e) => {
        e.stopPropagation();
        this.playAudio(word, 0.72);
      };
    }
  },

  _bindBasicControls(card, word) {
    // Replay Scene (Rewind 5s & Resume)
    const replayBtn = card.querySelector('#subz-btn-replay');
    if (replayBtn) {
      replayBtn.onclick = (e) => {
        e.stopPropagation();
        this._replayScene(5);
        this.hide();
      };
    }

    // Resume Video Playback
    const resumeBtn = card.querySelector('#subz-btn-resume');
    if (resumeBtn) {
      resumeBtn.onclick = (e) => {
        e.stopPropagation();
        this._resumeVideo();
        this.hide();
      };
    }

    // "I already know this" Whitelist
    const knowBtn = card.querySelector('#subz-btn-know');
    if (knowBtn) {
      knowBtn.onclick = async (e) => {
        e.stopPropagation();
        await this._markWordAsKnown(word);
        this.hide();
      };
    }

    // Outside click dismiss
    const handleOutsideClick = (e) => {
      if (this.currentCard && !this.currentCard.contains(e.target) && !e.target.classList.contains('subz-word-highlight')) {
        this.hide();
        document.removeEventListener('mousedown', handleOutsideClick);
      }
    };
    setTimeout(() => {
      document.addEventListener('mousedown', handleOutsideClick);
    }, 60);
  },

  async _toggleSaveWord(entry, contextSentence) {
    const data = await chrome.storage.local.get(['subz_saved_words', 'subz_stats']);
    let list = data.subz_saved_words || [];
    let stats = data.subz_stats || { dailyGoal: 5, todayCount: 0, streak: 1 };

    const index = list.findIndex(item => item.word.toLowerCase() === entry.word.toLowerCase());
    let isNowSaved = false;

    if (index >= 0) {
      list.splice(index, 1);
      isNowSaved = false;
    } else {
      list.unshift({
        word: entry.word,
        phonetic: entry.phonetic || '',
        partOfSpeech: entry.partOfSpeech || 'word',
        level: entry.level || 'Intermediate',
        definition: entry.definition || '',
        synonyms: entry.synonyms || [],
        context: contextSentence || '',
        dateAdded: new Date().toISOString()
      });
      isNowSaved = true;
      stats.todayCount = (stats.todayCount || 0) + 1;
    }

    await chrome.storage.local.set({
      subz_saved_words: list,
      subz_stats: stats
    });

    return isNowSaved;
  },

  async _markWordAsKnown(word) {
    const cleanWord = word.trim().toLowerCase();
    const data = await chrome.storage.local.get(['subz_known_words']);
    const known = new Set(data.subz_known_words || []);
    known.add(cleanWord);

    await chrome.storage.local.set({ subz_known_words: Array.from(known) });
    SubzState.knownWords.add(cleanWord);

    document.querySelectorAll(`span.subz-word-highlight[data-word="${cleanWord}"]`).forEach(span => {
      const parent = span.parentNode;
      if (parent) {
        parent.replaceChild(document.createTextNode(span.textContent), span);
        parent.normalize();
      }
    });
  },

  async _getSavedWords() {
    const data = await chrome.storage.local.get(['subz_saved_words']);
    return data.subz_saved_words || [];
  },

  _escapeHTML(str) {
    if (!str) return '';
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      "'": '&#39;',
      '"': '&quot;'
    }[tag] || tag));
  }
};

if (typeof window !== 'undefined') {
  window.SubzCardManager = SubzCardManager;
}
