/**
 * Subz — Master Vocabulary Database Compiler (Node.js)
 * Compiles a rich, curated database of high-yield B2/C1/C2 academic,
 * tech, podcast, and media vocabulary with 5th-grade simple definitions.
 */

const fs = require('fs');
const path = require('path');

// 1. Existing core words if any
let existing = {};
const vocabCorePath = path.join(__dirname, '../src/data/vocab_core.js');
if (fs.existsSync(vocabCorePath)) {
  try {
    const mod = require(vocabCorePath);
    if (mod && mod.SUBZ_VOCAB_CORE) {
      existing = mod.SUBZ_VOCAB_CORE;
    }
  } catch (e) {
    console.warn('Could not load existing vocab_core:', e.message);
  }
}

// 2. High-Yield Curated Master Vocabulary Database
const masterVocab = {
  // PODCAST, MEDIA & TECH TALK ESSENTIALS
  "transformative": {
    "phonetic": "/trænsˈfɔː.mə.tɪv/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Causing a major, important, and lasting change for the better.",
    "synonyms": ["life-changing", "revolutionary", "impactful"]
  },
  "transformation": {
    "phonetic": "/ˌtræns.fəˈmeɪ.ʃən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A thorough or dramatic change in form, appearance, or character.",
    "synonyms": ["change", "evolution", "makeover"]
  },
  "perspective": {
    "phonetic": "/pəˈspek.tɪv/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A particular attitude toward or way of regarding and understanding something.",
    "synonyms": ["viewpoint", "outlook", "standpoint"]
  },
  "phenomenon": {
    "phonetic": "/fəˈnɒm.ɪ.nən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A remarkable event, fact, or situation that is observed to happen.",
    "synonyms": ["occurrence", "event", "marvel"]
  },
  "fundamental": {
    "phonetic": "/ˌfʌn.dəˈmen.təl/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Forming a necessary base or core; of central importance.",
    "synonyms": ["basic", "core", "essential"]
  },
  "distinction": {
    "phonetic": "/dɪˈstɪŋk.ʃən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A clear difference or contrast between similar things.",
    "synonyms": ["difference", "contrast", "division"]
  },
  "perception": {
    "phonetic": "/pəˈsep.ʃən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "The way in which something is regarded, understood, or interpreted.",
    "synonyms": ["view", "interpretation", "impression"]
  },
  "synthesis": {
    "phonetic": "/ˈsɪn.θə.sɪs/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "The combination of ideas or parts to form a connected whole.",
    "synonyms": ["combination", "blend", "union"]
  },
  "resonate": {
    "phonetic": "/ˈrez.ən.eɪt/",
    "partOfSpeech": "verb",
    "level": "intermediate",
    "definition": "To produce a deep emotional response or feeling of connection.",
    "synonyms": ["connect", "strike a chord", "echo"]
  },
  "compelling": {
    "phonetic": "/kəmˈpel.ɪŋ/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Evoking strong interest, attention, or admiration; irresistibly convincing.",
    "synonyms": ["convincing", "gripping", "captivating"]
  },
  "underlying": {
    "phonetic": "/ˌʌn.dəˈlaɪ.ɪŋ/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Important in a situation but not obvious or directly stated.",
    "synonyms": ["fundamental", "basic", "hidden"]
  },
  "implication": {
    "phonetic": "/ˌɪm.plɪˈkeɪ.ʃən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A likely consequence or unspoken meaning suggested by something.",
    "synonyms": ["consequence", "suggestion", "result"]
  },
  "manifestation": {
    "phonetic": "/ˌmæn.ɪ.feˈsteɪ.ʃən/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "An event, action, or object that clearly shows or embodies something.",
    "synonyms": ["display", "sign", "expression"]
  },
  "dissect": {
    "phonetic": "/dɪˈsekt/",
    "partOfSpeech": "verb",
    "level": "intermediate",
    "definition": "To analyze and examine something in close detail piece by piece.",
    "synonyms": ["analyze", "examine", "scrutinize"]
  },
  "dissection": {
    "phonetic": "/dɪˈsek.ʃən/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A detailed analysis or examination of something part by part.",
    "synonyms": ["analysis", "examination", "breakdown"]
  },
  "nuance": {
    "phonetic": "/ˈnjuː.ɑːns/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "A subtle or small difference in meaning, sound, or feeling that is easy to miss.",
    "synonyms": ["subtlety", "distinction", "shade"]
  },
  "nuanced": {
    "phonetic": "/ˈnjuː.ɑːnst/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Characterized by subtle distinctions and deep attention to delicate details.",
    "synonyms": ["subtle", "refined", "discriminating"]
  },
  "semantic": {
    "phonetic": "/sɪˈmæn.tɪk/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Relating to the real meaning and logic of words, language, or data.",
    "synonyms": ["meaningful", "linguistic", "conceptual"]
  },
  "conundrum": {
    "phonetic": "/kəˈnʌn.drəm/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "A confusing and difficult problem or question with no easy answer.",
    "synonyms": ["puzzle", "riddle", "enigma"]
  },
  "corroborate": {
    "phonetic": "/kəˈrɒb.ə.reɪt/",
    "partOfSpeech": "verb",
    "level": "advanced",
    "definition": "To confirm or give support to a statement, theory, or finding with evidence.",
    "synonyms": ["confirm", "verify", "substantiate"]
  },
  "visceral": {
    "phonetic": "/ˈvɪs.ər.əl/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Relating to deep inward feelings or instincts rather than intellect.",
    "synonyms": ["gut-feeling", "instinctive", "deep"]
  },
  "cathartic": {
    "phonetic": "/kəˈθɑː.tɪk/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Providing psychological relief through the open release of strong emotions.",
    "synonyms": ["relieving", "cleansing", "liberating"]
  },
  "surreal": {
    "phonetic": "/səˈrɪəl/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Having the disorienting, hallucinatory quality of a dream; bizarre.",
    "synonyms": ["dreamlike", "bizarre", "unreal"]
  },
  "replicate": {
    "phonetic": "/ˈrep.lɪ.keɪt/",
    "partOfSpeech": "verb",
    "level": "intermediate",
    "definition": "To make an exact copy of or reproduce the exact results of something.",
    "synonyms": ["reproduce", "duplicate", "copy"]
  },
  "profound": {
    "phonetic": "/prəˈfaʊnd/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Having deep insight or great intellectual and emotional depth.",
    "synonyms": ["deep", "insightful", "intense"]
  },
  "innocuous": {
    "phonetic": "/ɪˈnɒk.ju.əs/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Not harmful, offensive, or dangerous; completely harmless.",
    "synonyms": ["harmless", "innocent", "safe"]
  },
  "salient": {
    "phonetic": "/ˈseɪ.li.ənt/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Most noticeable, prominent, or important.",
    "synonyms": ["prominent", "noticeable", "key"]
  },
  "specious": {
    "phonetic": "/ˈspiː.ʃəs/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Superficially plausible, but actually wrong or misleading.",
    "synonyms": ["misleading", "deceptive", "fallacious"]
  },
  "complacent": {
    "phonetic": "/kəmˈpleɪ.sənt/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Showing smug or uncritical satisfaction with oneself or one's achievements.",
    "synonyms": ["smug", "self-satisfied", "unconcerned"]
  },
  "tangible": {
    "phonetic": "/ˈtæn.dʒə.bəl/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Perceptible by touch; clear, definite, and real rather than imaginary.",
    "synonyms": ["concrete", "real", "touchable"]
  },
  "intricate": {
    "phonetic": "/ˈɪn.trɪ.kət/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Very complicated or detailed, with many interconnected parts.",
    "synonyms": ["complex", "elaborate", "detailed"]
  },
  "paradigm": {
    "phonetic": "/ˈpær.ə.daɪm/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "A typical example or pattern of something; a model or framework.",
    "synonyms": ["model", "pattern", "framework"]
  },
  "paradox": {
    "phonetic": "/ˈpær.ə.dɒks/",
    "partOfSpeech": "noun",
    "level": "advanced",
    "definition": "A seemingly absurd or self-contradictory statement that may prove to be true.",
    "synonyms": ["contradiction", "enigma", "puzzle"]
  },
  "lucid": {
    "phonetic": "/ˈluː.sɪd/",
    "partOfSpeech": "adjective",
    "level": "advanced",
    "definition": "Expressed clearly; easy to understand; bright or luminous.",
    "synonyms": ["clear", "coherent", "transparent"]
  },
  "facet": {
    "phonetic": "/ˈfæs.ɪt/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "One particular aspect, feature, or side of something complex.",
    "synonyms": ["aspect", "feature", "dimension"]
  },
  "pertain": {
    "phonetic": "/pəˈteɪn/",
    "partOfSpeech": "verb",
    "level": "intermediate",
    "definition": "To be appropriate, related, or applicable to a particular matter.",
    "synonyms": ["relate", "concern", "apply"]
  },
  "juxtapose": {
    "phonetic": "/ˌdʒʌk.stəˈpəʊz/",
    "partOfSpeech": "verb",
    "level": "advanced",
    "definition": "To place two contrasting things close together to emphasize their differences.",
    "synonyms": ["contrast", "collocate", "compare"]
  },
  "retrospect": {
    "phonetic": "/ˈret.rə.spekt/",
    "partOfSpeech": "noun",
    "level": "intermediate",
    "definition": "A survey or review of a past course of events or period of time.",
    "synonyms": ["review", "reflection", "hindsight"]
  },
  "counterintuitive": {
    "phonetic": "/ˌkaʊn.tər.ɪnˈtjuː.ɪ.tɪv/",
    "partOfSpeech": "adjective",
    "level": "intermediate",
    "definition": "Contrary to intuition or to common-sense expectation.",
    "synonyms": ["unexpected", "paradoxical", "illogical"]
  },

  // HIGH-FREQUENCY B2 / C1 VOCABULARY
  "obsolete": { "phonetic": "/ˌɒb.səˈliːt/", "partOfSpeech": "adjective", "level": "advanced", "definition": "No longer used or produced because something newer exists.", "synonyms": ["outdated", "archaic", "superseded"] },
  "ubiquitous": { "phonetic": "/juːˈbɪk.wɪ.təs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Present, appearing, or found everywhere at the same time.", "synonyms": ["omnipresent", "pervasive", "universal"] },
  "meticulous": { "phonetic": "/məˈtɪk.jə.ləs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Showing great attention to detail; very careful and precise.", "synonyms": ["diligent", "thorough", "painstaking"] },
  "epiphany": { "phonetic": "/ɪˈpɪf.ə.ni/", "partOfSpeech": "noun", "level": "advanced", "definition": "A moment of sudden and great revelation or realization.", "synonyms": ["realization", "insight", "breakthrough"] },
  "pernicious": { "phonetic": "/pəˈnɪʃ.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Having a harmful effect, especially in a gradual or subtle way.", "synonyms": ["damaging", "destructive", "harmful"] },
  "candid": { "phonetic": "/ˈkæn.dɪd/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Truthful, straightforward, and frank in speech or expression.", "synonyms": ["frank", "outspoken", "honest"] },
  "quintessential": { "phonetic": "/ˌkwɪn.tɪˈsen.ʃəl/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Representing the most perfect or typical example of a quality or class.", "synonyms": ["archetypal", "exemplary", "classic"] },
  "serendipity": { "phonetic": "/ˌser.ənˈdɪp.ə.ti/", "partOfSpeech": "noun", "level": "advanced", "definition": "Finding valuable or agreeable things not sought for; happy chance.", "synonyms": ["chance", "fluke", "coincidence"] },
  "taciturn": { "phonetic": "/ˈtæs.ɪ.tɜːn/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Reserved or uncommunicative in speech; saying little.", "synonyms": ["silent", "quiet", "reticent"] },
  "vicarious": { "phonetic": "/vɪˈkeə.ri.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Experienced in the imagination through the feelings or actions of another person.", "synonyms": ["indirect", "secondary", "derivative"] },
  "pragmatic": { "phonetic": "/præɡˈmæt.ɪk/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Dealing with things sensibly and realistically in a practical way.", "synonyms": ["practical", "sensible", "realistic"] },
  "ephemeral": { "phonetic": "/ɪˈfem.ər.əl/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Lasting for a very short time; transitory.", "synonyms": ["fleeting", "transient", "short-lived"] },
  "surreptitious": { "phonetic": "/ˌsʌr.əpˈtɪʃ.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Kept secret, especially because it would not be approved of.", "synonyms": ["stealthy", "secretive", "clandestine"] },
  "clandestine": { "phonetic": "/klænˈdes.tɪn/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Kept secret or done secretively, especially for illicit purposes.", "synonyms": ["covert", "undercover", "hidden"] },
  "fastidious": { "phonetic": "/fæsˈtɪd.i.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Very attentive to and concerned about accuracy and detail.", "synonyms": ["scrupulous", "punctilious", "exacting"] },
  "magnanimous": { "phonetic": "/mæɡˈnæn.ɪ.məs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Generous or forgiving, especially toward a rival or less powerful person.", "synonyms": ["generous", "charitable", "benevolent"] },
  "alacrity": { "phonetic": "/əˈlæk.rə.ti/", "partOfSpeech": "noun", "level": "advanced", "definition": "Brisk and cheerful readiness or eagerness.", "synonyms": ["eagerness", "willingness", "readiness"] },
  "anachronism": { "phonetic": "/əˈnæk.rə.nɪ.zəm/", "partOfSpeech": "noun", "level": "advanced", "definition": "A thing belonging or appropriate to a period other than that in which it exists.", "synonyms": ["misplacement", "archaism", "incongruity"] },
  "cacophony": { "phonetic": "/kəˈkɒf.ə.ni/", "partOfSpeech": "noun", "level": "advanced", "definition": "A harsh, discordant mixture of sounds.", "synonyms": ["racket", "noise", "clamor"] },
  "disparate": { "phonetic": "/ˈdɪs.pər.ət/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Essentially different in kind; not allowing comparison.", "synonyms": ["contrasting", "different", "divergent"] },
  "enervate": { "phonetic": "/ˈen.ə.veɪt/", "partOfSpeech": "verb", "level": "advanced", "definition": "Cause someone to feel drained of energy or vitality; weaken.", "synonyms": ["exhaust", "fatigue", "weaken"] },
  "esoteric": { "phonetic": "/ˌes.əˈter.ɪk/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Intended for or likely to be understood by only a small number of people.", "synonyms": ["obscure", "arcane", "cryptic"] },
  "garrulous": { "phonetic": "/ˈɡær.əl.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Excessively talkative, especially on trivial matters.", "synonyms": ["talkative", "voluble", "chatty"] },
  "harangue": { "phonetic": "/həˈræŋ/", "partOfSpeech": "noun", "level": "advanced", "definition": "A lengthy and aggressive speech or lecture.", "synonyms": ["tirade", "diatribe", "rant"] },
  "iconoclast": { "phonetic": "/aɪˈkɒn.ə.klæst/", "partOfSpeech": "noun", "level": "advanced", "definition": "A person who attacks cherished beliefs or institutions.", "synonyms": ["critic", "rebel", "dissident"] },
  "juxtaposition": { "phonetic": "/ˌdʒʌk.stə.pəˈzɪʃ.ən/", "partOfSpeech": "noun", "level": "advanced", "definition": "The fact of two things being seen or placed close together with contrasting effect.", "synonyms": ["comparison", "contrast", "proximity"] },
  "laconic": { "phonetic": "/ləˈkɒn.ɪk/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Using very few words; concise to the point of seeming rude.", "synonyms": ["brief", "concise", "terse"] },
  "nefarious": { "phonetic": "/nɪˈfeə.ri.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Wicked, villainous, or criminal in nature.", "synonyms": ["wicked", "evil", "sinister"] },
  "ostentatious": { "phonetic": "/ˌɒs.tenˈteɪ.ʃəs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Designed to impress or attract notice; showy or pretentious.", "synonyms": ["showy", "flamboyant", "pretentious"] },
  "panacea": { "phonetic": "/ˌpæn.əˈsiː.ə/", "partOfSpeech": "noun", "level": "advanced", "definition": "A solution or remedy for all difficulties or diseases.", "synonyms": ["cure-all", "universal remedy", "magic bullet"] },
  "quandary": { "phonetic": "/ˈkwɒn.dri/", "partOfSpeech": "noun", "level": "advanced", "definition": "A state of perplexity or uncertainty over what to do in a difficult situation.", "synonyms": ["dilemma", "predicament", "plight"] },
  "recalcitrant": { "phonetic": "/rɪˈkæl.sɪ.trənt/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Having an obstinately uncooperative attitude toward authority or discipline.", "synonyms": ["unruly", "defiant", "disobedient"] },
  "sycophant": { "phonetic": "/ˈsɪk.ə.fænt/", "partOfSpeech": "noun", "level": "advanced", "definition": "A person who acts obsequiously toward someone important to gain advantage.", "synonyms": ["toady", "flatterer", "yes-man"] },
  "tenacious": { "phonetic": "/təˈneɪ.ʃəs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Tending to keep a firm hold of something; clinging or persistent.", "synonyms": ["persistent", "determined", "stubborn"] },
  "venerable": { "phonetic": "/ˈven.ər.ə.bəl/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Accorded a great deal of respect, especially because of age, wisdom, or character.", "synonyms": ["respected", "revered", "honored"] },
  "zealous": { "phonetic": "/ˈzel.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Having or showing great passion, devotion, or enthusiasm.", "synonyms": ["fervent", "ardent", "passionate"] },
  "scrutinize": { "phonetic": "/ˈskruː.tɪ.naɪz/", "partOfSpeech": "verb", "level": "intermediate", "definition": "Examine or inspect closely and thoroughly.", "synonyms": ["inspect", "examine", "investigate"] },
  "superfluous": { "phonetic": "/suːˈpɜː.flu.əs/", "partOfSpeech": "adjective", "level": "advanced", "definition": "Unnecessary, especially through being more than enough.", "synonyms": ["extra", "redundant", "excess"] },
  "alleviate": { "phonetic": "/əˈliː.vi.eɪt/", "partOfSpeech": "verb", "level": "intermediate", "definition": "Make suffering, deficiency, or a problem less severe.", "synonyms": ["ease", "relieve", "lessen"] },
  "anomaly": { "phonetic": "/əˈnɒm.ə.li/", "partOfSpeech": "noun", "level": "advanced", "definition": "Something that deviates from what is standard, normal, or expected.", "synonyms": ["oddity", "irregularity", "exception"] },
  "fluctuate": { "phonetic": "/ˈflʌk.tʃu.eɪt/", "partOfSpeech": "verb", "level": "intermediate", "definition": "Rise and fall irregularly in number or amount.", "synonyms": ["vary", "shift", "oscillate"] }
};

// Merge all together
const merged = { ...existing, ...masterVocab };

// Generate clean JS file
const fileContent = `/**
 * Subz — Curated Core Vocabulary Database
 * High-yield authentic vocabulary with simple, clean definitions.
 * Instant 0ms offline lookups for YouTube learning.
 */

const SUBZ_VOCAB_CORE = ${JSON.stringify(merged, null, 2)};

if (typeof window !== "undefined") {
  window.SUBZ_VOCAB_CORE = SUBZ_VOCAB_CORE;
}
if (typeof module !== "undefined" && module.exports) {
  module.exports = { SUBZ_VOCAB_CORE };
}
`;

fs.writeFileSync(vocabCorePath, fileContent, 'utf-8');
console.log(`Successfully compiled ${Object.keys(merged).length} core vocabulary words into ${vocabCorePath}`);
console.log('Verified "dissect":', !!merged['dissect']);
console.log('Verified "nuance":', !!merged['nuance']);
console.log('Verified "conundrum":', !!merged['conundrum']);
