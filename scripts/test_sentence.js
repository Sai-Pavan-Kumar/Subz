const { SUBZ_COMMON_WORDS } = require('../src/data/common_words.js');
const { SUBZ_VOCAB_CORE } = require('../src/data/vocab_core.js');

function isProperNoun(token, index, tokens) {
  const raw = token.trim();
  if (!raw) return false;
  if (/[a-z][A-Z]/.test(raw)) return true;
  if (/^[A-Z0-9]{2,}$/.test(raw)) return true;
  if (/^[A-Z][a-z]+$/.test(raw)) {
    let isSentenceStart = true;
    for (let i = index - 1; i >= 0; i--) {
      const prev = tokens[i].trim();
      if (prev.length > 0) {
        isSentenceStart = /[.?!]$/.test(prev);
        break;
      }
    }
    if (!isSentenceStart) return true;
  }
  return false;
}

function shouldHighlight(word) {
  if (SUBZ_COMMON_WORDS.has(word)) return false;
  if (SUBZ_VOCAB_CORE[word]) return true;
  return false;
}

const sentence = 'just because whenever I ask Gemini to look through YouTube videos for semantic things';
const tokens = sentence.split(/(\s+|[.,!?;:"()]+)/);

console.log('Testing Sentence:', sentence);
tokens.forEach((t, idx) => {
  const clean = t.trim().toLowerCase().replace(/[^a-z'-]/g, '');
  if (!clean) return;
  const isPN = isProperNoun(t, idx, tokens);
  const sh = shouldHighlight(clean);
  const willHighlight = !isPN && sh;
  if (willHighlight || ['whenever', 'gemini', 'youtube', 'semantic'].includes(clean)) {
    console.log(`Word: "${t}" -> ProperNoun: ${isPN} | InCore: ${sh} | Highlighted: ${willHighlight}`);
  }
});
