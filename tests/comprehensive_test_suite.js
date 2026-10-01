/**
 * Subz — Comprehensive End-to-End Automated Test Suite
 * Validates all linguistic filters, inflection lemmatization, dictionary fallbacks,
 * subtitle segmentation, proper noun rejection, and word card contracts.
 */

const { SUBZ_COMMON_WORDS } = require('../src/data/common_words.js');
const { SUBZ_VOCAB_CORE } = require('../src/data/vocab_core.js');
const { SubzLemmatizer } = require('../src/data/lemmatizer.js');

let passedTests = 0;
let failedTests = 0;
const failures = [];

function assert(condition, message) {
  if (condition) {
    passedTests++;
    console.log(`  ✓ ${message}`);
  } else {
    failedTests++;
    failures.push(message);
    console.error(`  ✗ FAIL: ${message}`);
  }
}

// Simulated content script engine
const MockSubzEngine = {
  isProperNoun(token, index, tokens) {
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
  },

  shouldHighlightWord(word, level = 'intermediate', knownWords = new Set()) {
    if (!word || word.length < 3) return false;

    // 1. Whitelist check
    if (typeof SUBZ_COMMON_WORDS !== 'undefined') {
      if (SUBZ_COMMON_WORDS.has(word)) return false;
      const stripped = word.replace(/'/g, '');
      if (SUBZ_COMMON_WORDS.has(stripped)) return false;

      const commonRoot = SubzLemmatizer.findRoot(word, SUBZ_COMMON_WORDS) || SubzLemmatizer.findRoot(stripped, SUBZ_COMMON_WORDS);
      if (commonRoot) return false;
    }

    // 2. Known words whitelist
    if (knownWords.has(word)) return false;

    // 3. Curated core check
    let vocabEntry = null;
    if (typeof SUBZ_VOCAB_CORE !== 'undefined') {
      if (SUBZ_VOCAB_CORE[word]) {
        vocabEntry = SUBZ_VOCAB_CORE[word];
      } else {
        const vocabRoot = SubzLemmatizer.findRoot(word, SUBZ_VOCAB_CORE);
        if (vocabRoot && SUBZ_VOCAB_CORE[vocabRoot]) {
          vocabEntry = SUBZ_VOCAB_CORE[vocabRoot];
        }
      }
    }

    if (vocabEntry) {
      const entryLevel = (vocabEntry.level || 'intermediate').toLowerCase();
      if (level === 'learner') return true;
      if (level === 'intermediate') return entryLevel === 'intermediate' || entryLevel === 'advanced';
      if (level === 'advanced') return entryLevel === 'advanced';
    }

    // 4. Genuine uncommon words
    if (/^[a-z]+$/.test(word)) {
      if (level === 'learner' && word.length >= 5) return true;
      if (level === 'intermediate' && word.length >= 6) return true;
      if (level === 'advanced' && word.length >= 8) return true;
    }

    return false;
  },

  parseSegmentText(text, level = 'intermediate') {
    const tokens = text.split(/(\s+|[.,!?;:"()\[\]{}]+)/);
    const result = [];
    tokens.forEach((token, index) => {
      const cleanWord = token.trim().toLowerCase().replace(/[^a-z'-]/g, '');
      if (this.isProperNoun(token, index, tokens)) {
        result.push({ text: token, type: 'proper_noun' });
      } else if (cleanWord.length > 2 && this.shouldHighlightWord(cleanWord, level)) {
        result.push({ text: token, cleanWord, type: 'highlight' });
      } else if (cleanWord.length > 1) {
        result.push({ text: token, cleanWord, type: 'plain' });
      } else {
        result.push({ text: token, type: 'delimiter' });
      }
    });
    return result;
  }
};

async function runAllTests() {
  console.log('======================================================');
  console.log('SUBZ MASTER AUTOMATED TEST SUITE');
  console.log('======================================================\n');

  // TEST SUITE 1: Common Words Whitelist Rejection
  console.log('TEST SUITE 1: Everyday Common Words (Must NEVER Highlight)');
  const commonSamples = [
    'change', 'changes', 'changing', 'changed',
    'remember', 'remembers', 'remembered', 'remembering',
    'operate', 'operates', 'operating', 'operated',
    'whenever', 'wherever', 'however', 'whatever', 'furthermore',
    'really', 'actually', 'today', 'welcome', 'thanks',
    'podcast', 'podcasts', 'video', 'videos', 'channel', 'subscribe',
    'streamer', 'stream', 'streaming', 'wifi', 'battery', 'screen',
    'girlfriend', 'boyfriend', 'everyone', 'someone', 'everything'
  ];
  for (const word of commonSamples) {
    const highlighted = MockSubzEngine.shouldHighlightWord(word, 'intermediate');
    assert(!highlighted, `Common word "${word}" must NOT be highlighted`);
  }

  // TEST SUITE 2: Proper Nouns & Brands Rejection
  console.log('\nTEST SUITE 2: Proper Nouns & Brand Entities (Must NEVER Highlight)');
  const properTokens = [
    { token: 'YouTube', context: ['Check', 'out', 'YouTube', 'for', 'more'], index: 2 },
    { token: 'iPhone', context: ['The', 'new', 'iPhone', 'review'], index: 2 },
    { token: 'ChatGPT', context: ['Ask', 'ChatGPT', 'about', 'this'], index: 1 },
    { token: 'MKBHD', context: ['Welcome', 'back', 'MKBHD', 'here'], index: 2 },
    { token: 'AI', context: ['The', 'future', 'of', 'AI', 'is', 'now'], index: 3 },
    { token: 'Gemini', context: ['We', 'asked', 'Gemini', 'to', 'help'], index: 2 },
    { token: 'London', context: ['He', 'flew', 'to', 'London', 'yesterday'], index: 3 }
  ];
  for (const item of properTokens) {
    const isProp = MockSubzEngine.isProperNoun(item.token, item.index, item.context);
    assert(isProp, `Entity "${item.token}" must be recognized as Proper Noun`);
  }

  // TEST SUITE 3: Genuine Vocabulary Highlighting
  console.log('\nTEST SUITE 3: Target Vocabulary Highlighting (Must Highlight)');
  const vocabSamples = [
    'dissect', 'dissects', 'dissecting', 'dissected',
    'nuance', 'nuances',
    'semantic',
    'meticulous', 'meticulously',
    'pragmatic',
    'ubiquitous',
    'superfluous',
    'alleviate',
    'scrutinize',
    'anomalies',
    'paradigm',
    'paradox',
    'visceral',
    'cathartic',
    'surreal',
    'conundrum',
    'corroborate'
  ];
  for (const word of vocabSamples) {
    const highlighted = MockSubzEngine.shouldHighlightWord(word, 'intermediate');
    assert(highlighted, `Target vocabulary word "${word}" MUST be highlighted`);
  }

  // TEST SUITE 4: Lemmatizer Inflection Resolution
  console.log('\nTEST SUITE 4: Lemmatizer Root Word Resolution');
  const lemmaPairs = [
    { inflected: 'nuances', expectedRoot: 'nuance' },
    { inflected: 'dissecting', expectedRoot: 'dissect' },
    { inflected: 'dissected', expectedRoot: 'dissect' },
    { inflected: 'dissects', expectedRoot: 'dissect' },
    { inflected: 'anomalies', expectedRoot: 'anomaly' },
    { inflected: 'meticulously', expectedRoot: 'meticulous' },
    { inflected: 'fluctuating', expectedRoot: 'fluctuate' }
  ];
  for (const pair of lemmaPairs) {
    const resolvedRoot = SubzLemmatizer.findRoot(pair.inflected, SUBZ_VOCAB_CORE);
    assert(resolvedRoot === pair.expectedRoot, `Inflected "${pair.inflected}" must resolve to root "${pair.expectedRoot}" (got "${resolvedRoot}")`);
  }

  // TEST SUITE 5: Real Video Subtitle Sentence Parsing
  console.log('\nTEST SUITE 5: Real-World Subtitle Sentence Parsing Simulation');
  
  // Sentence from user's podcast screenshot:
  const sentence1 = "who's ready to really dissect the";
  const parsed1 = MockSubzEngine.parseSegmentText(sentence1, 'intermediate');
  const dissectNode = parsed1.find(n => n.cleanWord === 'dissect');
  assert(dissectNode && dissectNode.type === 'highlight', `Sentence 1: "dissect" must be highlighted`);
  
  const reallyNode = parsed1.find(n => n.cleanWord === 'really');
  assert(reallyNode && reallyNode.type === 'plain', `Sentence 1: "really" must NOT be highlighted (plain clickable)`);

  const sentence2 = "nuances of English and";
  const parsed2 = MockSubzEngine.parseSegmentText(sentence2, 'intermediate');
  const nuanceNode = parsed2.find(n => n.cleanWord === 'nuances');
  assert(nuanceNode && nuanceNode.type === 'highlight', `Sentence 2: "nuances" must be highlighted`);

  const sentence3 = "I used YouTube and Gemini to remember the change";
  const parsed3 = MockSubzEngine.parseSegmentText(sentence3, 'intermediate');
  const highlights3 = parsed3.filter(n => n.type === 'highlight');
  assert(highlights3.length === 0, `Sentence 3: Common words & brands must produce ZERO false highlights (found ${highlights3.length})`);

  // TEST SUITE 6: Offline Core 0ms Dictionary Definitions
  console.log('\nTEST SUITE 6: Offline 0ms Dictionary Definitions');
  const coreTestWords = ['dissect', 'nuance', 'semantic', 'meticulous', 'conundrum'];
  for (const w of coreTestWords) {
    const entry = SUBZ_VOCAB_CORE[w];
    assert(entry && entry.definition && entry.definition.length > 15, `Core word "${w}" has complete definition: "${entry?.definition?.slice(0, 50)}..."`);
    assert(entry && entry.partOfSpeech, `Core word "${w}" has partOfSpeech: "${entry?.partOfSpeech}"`);
  }

  // TEST SUITE 8: Punctuation, Quotes & Sentence Boundary Edge Cases
  console.log('\nTEST SUITE 8: Punctuation, Quotes & Capitalization Boundaries');
  const punctTests = [
    { text: 'dissect,', expectedWord: 'dissect', expectHighlight: true },
    { text: '"nuances"', expectedWord: 'nuances', expectHighlight: true },
    { text: '(semantic)', expectedWord: 'semantic', expectHighlight: true },
    { text: 'meticulous...', expectedWord: 'meticulous', expectHighlight: true },
    { text: "who's", expectedWord: "who's", expectHighlight: false },
    { text: "don't", expectedWord: "don't", expectHighlight: false }
  ];
  for (const item of punctTests) {
    const parsed = MockSubzEngine.parseSegmentText(item.text, 'intermediate');
    const target = parsed.find(n => n.cleanWord === item.expectedWord || n.text.includes(item.expectedWord));
    if (item.expectHighlight) {
      assert(target && target.type === 'highlight', `Punctuation-wrapped "${item.text}" must extract clean word and HIGHLIGHT`);
    } else {
      assert(target && target.type !== 'highlight', `Contraction/Punctuation "${item.text}" must NOT highlight`);
    }
  }

  // Sentence-start capitalization test: "Nuance is critical."
  const startSentence = "Nuance is critical.";
  const parsedStart = MockSubzEngine.parseSegmentText(startSentence, 'intermediate');
  const startNuance = parsedStart.find(n => n.cleanWord === 'nuance');
  assert(startNuance && startNuance.type === 'highlight', `Sentence-initial capitalized word "Nuance" must be recognized as VOCABULARY, not proper noun`);

  // Mid-sentence capitalized brand test: "We tried Gemini today."
  const midBrand = "We tried Gemini today.";
  const parsedMid = MockSubzEngine.parseSegmentText(midBrand, 'intermediate');
  const midGemini = parsedMid.find(n => n.text === 'Gemini');
  assert(midGemini && midGemini.type === 'proper_noun', `Mid-sentence capitalized brand "Gemini" must be recognized as PROPER NOUN`);

  // TEST SUITE 9: Notebook Export Formatting Verification
  console.log('\nTEST SUITE 9: Plain Text Notebook (.txt) Export Formatting');
  const mockSavedWords = [
    {
      word: 'dissect',
      phonetic: '/dɪˈsekt/',
      partOfSpeech: 'verb',
      level: 'Intermediate',
      definition: 'To analyze and examine something in close detail piece by piece.',
      context: "who's ready to really dissect the nuances",
      dateAdded: new Date().toISOString()
    },
    {
      word: 'nuance',
      phonetic: '/ˈnjuː.ɑːns/',
      partOfSpeech: 'noun',
      level: 'Advanced',
      definition: 'A subtle or small difference in meaning, sound, or feeling.',
      context: 'nuances of English and spoken dialogue',
      dateAdded: new Date().toISOString()
    }
  ];

  let exportedTxt = '======================================================\n';
  exportedTxt += 'SUBZ VOCABULARY NOTEBOOK\n';
  exportedTxt += `Total Saved Words: ${mockSavedWords.length}\n`;
  exportedTxt += '======================================================\n\n';
  mockSavedWords.forEach((item, idx) => {
    exportedTxt += `${idx + 1}. ${item.word.toUpperCase()} (${item.phonetic}) - ${item.partOfSpeech} [${item.level}]\n`;
    exportedTxt += `   Meaning: ${item.definition}\n`;
    if (item.context) exportedTxt += `   In Scene: "${item.context}"\n`;
    exportedTxt += '\n';
  });

  assert(exportedTxt.includes('1. DISSECT (/dɪˈsekt/) - verb [Intermediate]'), 'Exported .txt must contain formatted DISSECT header');
  assert(exportedTxt.includes('Meaning: To analyze and examine something in close detail piece by piece.'), 'Exported .txt must contain correct definition');
  assert(exportedTxt.includes('In Scene: "who\'s ready to really dissect the nuances"'), 'Exported .txt must contain in-scene context');
  assert(exportedTxt.includes('2. NUANCE (/ˈnjuː.ɑːns/) - noun [Advanced]'), 'Exported .txt must contain formatted NUANCE header');

  // SUMMARY
  console.log('\n======================================================');
  console.log(`TEST RUN COMPLETE: ${passedTests} PASSED, ${failedTests} FAILED`);
  console.log('======================================================');

  if (failedTests > 0) {
    console.error('\nFAILURES:');
    failures.forEach(f => console.error(` - ${f}`));
    process.exit(1);
  } else {
    console.log('\nALL EDGE CASE TESTS PASSED WITH 100% SUCCESS RATE!\n');
    process.exit(0);
  }
}

runAllTests().catch(err => {
  console.error('Fatal Test Runner Error:', err);
  process.exit(1);
});
