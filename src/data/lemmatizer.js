/**
 * Subz — English Lemmatizer & Inflection Resolver
 * Generates candidate root words for plurals, past tense, continuous, and adverbs.
 * Enables zero-latency matching of inflected forms like 'nuances' -> 'nuance',
 * 'dissecting' -> 'dissect', 'meticulously' -> 'meticulous'.
 */

const SubzLemmatizer = {
  getCandidates(word) {
    if (!word || word.length < 3) return [word];
    const w = word.trim().toLowerCase();
    const candidates = [w];

    // 1. Plural / 3rd Person: -ies, -es, -s
    if (w.endsWith('ies') && w.length > 4) {
      candidates.push(w.slice(0, -3) + 'y'); // anomalies -> anomaly
    }
    if (w.endsWith('es') && w.length > 3) {
      candidates.push(w.slice(0, -2)); // boxes -> box
      candidates.push(w.slice(0, -1)); // nuances -> nuance
    }
    if (w.endsWith('s') && !w.endsWith('ss') && w.length > 3) {
      candidates.push(w.slice(0, -1)); // dissects -> dissect
    }

    // 2. Past Tense / Participle: -ed, -ied
    if (w.endsWith('ied') && w.length > 4) {
      candidates.push(w.slice(0, -3) + 'y'); // modified -> modify
    }
    if (w.endsWith('ed') && w.length > 4) {
      candidates.push(w.slice(0, -2)); // dissected -> dissect
      candidates.push(w.slice(0, -1)); // allocated -> allocate
      if (w.length > 5 && w[w.length - 3] === w[w.length - 4]) {
        candidates.push(w.slice(0, -3)); // trapped -> trap
      }
    }

    // 3. Continuous: -ing, -ying
    if (w.endsWith('ying') && w.length > 5) {
      candidates.push(w.slice(0, -4) + 'ie'); // tying -> tie
    }
    if (w.endsWith('ing') && w.length > 5) {
      candidates.push(w.slice(0, -3)); // dissecting -> dissect
      candidates.push(w.slice(0, -3) + 'e'); // accommodating -> accommodate
      if (w.length > 6 && w[w.length - 4] === w[w.length - 5]) {
        candidates.push(w.slice(0, -4)); // running -> run
      }
    }

    // 4. Adverbs: -ly, -ily
    if (w.endsWith('ily') && w.length > 4) {
      candidates.push(w.slice(0, -3) + 'y'); // readily -> ready
    }
    if (w.endsWith('ly') && w.length > 4) {
      candidates.push(w.slice(0, -2)); // meticulously -> meticulous
    }

    return [...new Set(candidates)];
  },

  /**
   * Find the matching root word in a Set or Object dictionary
   */
  findRoot(word, dictionary) {
    if (!word || !dictionary) return null;
    const candidates = this.getCandidates(word);
    const isSet = dictionary instanceof Set;

    for (const c of candidates) {
      if (isSet ? dictionary.has(c) : !!dictionary[c]) {
        return c;
      }
    }
    return null;
  }
};

if (typeof window !== 'undefined') {
  window.SubzLemmatizer = SubzLemmatizer;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = { SubzLemmatizer };
}
