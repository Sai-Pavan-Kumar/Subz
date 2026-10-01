/**
 * Subz — Dictionary API Client
 * Seamlessly checks in-memory core vocabulary first (0ms),
 * and proxies external lookups via the background service worker
 * to bypass YouTube's Content Security Policy (CSP).
 */

const SubzMemoryCache = new Map();

const SubzDictionaryAPI = {
  /**
   * Pre-fetches a word in the background so by the time user clicks it, it's 0ms instant.
   */
  prefetch(word) {
    if (!word) return;
    const cleanWord = word.trim().toLowerCase();
    if (cleanWord.length < 3) return;

    if (SubzMemoryCache.has(cleanWord)) return;
    if (typeof SUBZ_VOCAB_CORE !== 'undefined') {
      if (SUBZ_VOCAB_CORE[cleanWord]) return;
      if (typeof SubzLemmatizer !== 'undefined' && SubzLemmatizer.findRoot(cleanWord, SUBZ_VOCAB_CORE)) return;
    }

    this.lookup(cleanWord).then(res => {
      if (res) SubzMemoryCache.set(cleanWord, res);
    }).catch(() => {});
  },

  /**
   * Look up a word from memory or via background proxy.
   * @param {string} word - Normalized lowercase word
   * @returns {Promise<Object|null>} Unified Subz Word Object
   */
  async lookup(word) {
    if (!word) return null;
    const cleanWord = word.trim().toLowerCase();

    // 0. Check session memory cache (0ms instant)
    if (SubzMemoryCache.has(cleanWord)) {
      return SubzMemoryCache.get(cleanWord);
    }

    // 1. Instant 0ms in-memory lookup (exact match or lemmatized root)
    if (typeof SUBZ_VOCAB_CORE !== 'undefined') {
      if (SUBZ_VOCAB_CORE[cleanWord]) {
        const item = {
          word: cleanWord,
          ...SUBZ_VOCAB_CORE[cleanWord],
          source: 'core'
        };
        SubzMemoryCache.set(cleanWord, item);
        return item;
      }
      
      if (typeof SubzLemmatizer !== 'undefined') {
        const foundRoot = SubzLemmatizer.findRoot(cleanWord, SUBZ_VOCAB_CORE);
        if (foundRoot && SUBZ_VOCAB_CORE[foundRoot]) {
          const item = {
            word: cleanWord,
            rootWord: foundRoot,
            ...SUBZ_VOCAB_CORE[foundRoot],
            source: 'core'
          };
          SubzMemoryCache.set(cleanWord, item);
          return item;
        }
      }
    }

    // 2. Proxy request via background service worker (avoids page CSP restrictions)
    return new Promise((resolve) => {
      try {
        chrome.runtime.sendMessage({ type: 'LOOKUP_WORD', word: cleanWord }, (response) => {
          if (chrome.runtime.lastError) {
            console.warn('[Subz] Background lookup message error:', chrome.runtime.lastError);
            resolve(null);
          } else {
            if (response) SubzMemoryCache.set(cleanWord, response);
            resolve(response || null);
          }
        });
      } catch (err) {
        console.error('[Subz] Failed to contact background worker:', err);
        resolve(null);
      }
    });
  }
};

if (typeof window !== 'undefined') {
  window.SubzDictionaryAPI = SubzDictionaryAPI;
}
