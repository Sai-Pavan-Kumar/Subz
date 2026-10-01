import json
import os

print("[Subz Engine] Building Comprehensive Curated Vocabulary Database...")

from generate_vocab_core import vocab_seed
from expand_vocab import expanded_words
from populate_rich_vocab import rich_vocab

# High-yield podcast, YouTube interview, and video dialogue vocabulary
podcast_and_media_vocab = {
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
    }
}

merged = {}
# Priority: rich_vocab -> vocab_seed -> expanded_words -> podcast_and_media_vocab
for d in [rich_vocab, vocab_seed, expanded_words, podcast_and_media_vocab]:
    for k, v in d.items():
        clean_k = k.strip().lower()
        merged[clean_k] = v

output_path = 'src/data/vocab_core.js'
with open(output_path, 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Curated Core Vocabulary Database\n * High-yield authentic vocabulary with simple, clean definitions.\n * Instant 0ms offline lookups for YouTube learning.\n */\n\n')
    f.write('const SUBZ_VOCAB_CORE = ' + json.dumps(merged, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_VOCAB_CORE = SUBZ_VOCAB_CORE;\n}\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n  module.exports = { SUBZ_VOCAB_CORE };\n}\n')

print(f"Successfully compiled {len(merged)} curated vocabulary words into {output_path}")
print("Verified 'dissect' in core:", "dissect" in merged)
print("Verified 'nuance' in core:", "nuance" in merged)
print("Verified 'semantic' in core:", "semantic" in merged)
