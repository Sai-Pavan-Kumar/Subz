import json
import os

print("[Subz Engine] Generating High-Yield Vocabulary with Simple English Definitions...")

# Load existing core words
existing = {}
if os.path.exists('src/data/vocab_core.js'):
    try:
        with open('src/data/vocab_core.js', 'r', encoding='utf-8') as f:
            content = f.read()
            # Extract JSON part
            start = content.find('{')
            end = content.rfind('}')
            if start != -1 and end != -1:
                existing = json.loads(content[start:end+1])
    except Exception as e:
        print("Note: Starting fresh for core vocab expansion:", e)

# Add curated words with simple, crystal-clear, 5th-grade English definitions
expanded_words = {
    # High-frequency words found in Tech, Reviews (MKBHD, Podcasts, Interviews, Movies)
    "semantic": {
        "phonetic": "/sɪˈmæn.tɪk/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Relating to the real meaning and logic of words, language, or data (not just their raw form).",
        "synonyms": ["meaningful", "linguistic", "conceptual"]
    },
    "aesthetic": {
        "phonetic": "/esˈθet.ɪk/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Concerned with beauty, visual style, or artistic appearance.",
        "synonyms": ["artistic", "visual", "stylish"]
    },
    "nuance": {
        "phonetic": "/ˈnjuː.ɑːns/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A subtle or small difference in meaning, sound, or feeling that is easy to miss.",
        "synonyms": ["subtlety", "distinction", "shade"]
    },
    "paradigm": {
        "phonetic": "/ˈpær.ə.daɪm/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A typical example, pattern, or model of how something is done.",
        "synonyms": ["model", "pattern", "standard"]
    },
    "dynamic": {
        "phonetic": "/daɪˈnæm.ɪk/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Constantly changing, active, or full of energy and new ideas.",
        "synonyms": ["energetic", "changing", "active"]
    },
    "frictionless": {
        "phonetic": "/ˈfrɪk.ʃən.ləs/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Smooth and effortless, with no difficulty, delay, or resistance.",
        "synonyms": ["effortless", "smooth", "seamless"]
    },
    "intuitive": {
        "phonetic": "/ɪnˈtjuː.ɪ.tɪv/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Easy to understand or use naturally, without needing instructions or special training.",
        "synonyms": ["instinctive", "user-friendly", "natural"]
    },
    "benchmark": {
        "phonetic": "/ˈbentʃ.mɑːk/",
        "partOfSpeech": "noun",
        "level": "intermediate",
        "definition": "A standard point of reference against which other things can be compared or measured.",
        "synonyms": ["standard", "criterion", "gauge"]
    },
    "algorithm": {
        "phonetic": "/ˈæl.ɡə.rɪ.ðəm/",
        "partOfSpeech": "noun",
        "level": "intermediate",
        "definition": "A set of step-by-step rules or instructions given to a computer to solve a problem.",
        "synonyms": ["formula", "procedure", "process"]
    },
    "consensus": {
        "phonetic": "/kənˈsen.səs/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A general agreement reached by everyone in a group.",
        "synonyms": ["agreement", "harmony", "unity"]
    },
    "dichotomy": {
        "phonetic": "/daɪˈkɒt.ə.mi/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A division or contrast between two completely opposite or different things.",
        "synonyms": ["division", "contrast", "difference"]
    },
    "catalyst": {
        "phonetic": "/ˈkæt.əl.ɪst/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A person or thing that causes a significant change or event to happen quickly.",
        "synonyms": ["spark", "stimulus", "trigger"]
    },
    "discrepancy": {
        "phonetic": "/dɪˈskrep.ən.si/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A noticeable difference or lack of agreement between two facts that should match.",
        "synonyms": ["difference", "inconsistency", "mismatch"]
    },
    "subtle": {
        "phonetic": "/ˈsʌt.əl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Clever and understated; not loud, bright, or immediately obvious.",
        "synonyms": ["delicate", "understated", "faint"]
    },
    "cohesive": {
        "phonetic": "/kəʊˈhiː.sɪv/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Forming a united, connected, and logical whole.",
        "synonyms": ["unified", "connected", "integrated"]
    },
    "compromise": {
        "phonetic": "/ˈkɒm.prə.maɪz/",
        "partOfSpeech": "noun",
        "level": "intermediate",
        "definition": "An agreement where both sides give up a little bit of what they wanted.",
        "synonyms": ["settlement", "agreement", "deal"]
    },
    "anomaly": {
        "phonetic": "/əˈnɒm.ə.li/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "Something unusual, unexpected, or different from what is normal.",
        "synonyms": ["oddity", "irregularity", "exception"]
    },
    "lucid": {
        "phonetic": "/ˈluː.sɪd/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Expressed clearly and easy to understand; clear-headed.",
        "synonyms": ["clear", "transparent", "coherent"]
    },
    "quintessential": {
        "phonetic": "/ˌkwɪn.tɪˈsen.ʃəl/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "The most perfect, pure, or typical example of something.",
        "synonyms": ["classic", "typical", "ideal"]
    },
    "tenuous": {
        "phonetic": "/ˈten.ju.əs/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Very weak, doubtful, or slight; not well-supported.",
        "synonyms": ["fragile", "shaky", "flimsy"]
    },
    "formidable": {
        "phonetic": "/fɔːˈmɪd.ə.bəl/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Inspiring respect or fear by being powerfully large, strong, or difficult.",
        "synonyms": ["intimidating", "powerful", "impressive"]
    },
    "pragmatic": {
        "phonetic": "/præɡˈmæt.ɪk/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Thinking about what actually works in the real world rather than just theories.",
        "synonyms": ["practical", "realistic", "sensible"]
    },
    "comprehensive": {
        "phonetic": "/ˌkɒm.prɪˈhen.sɪv/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Complete and thorough; covering all important parts and details.",
        "synonyms": ["thorough", "complete", "full"]
    },
    "meticulous": {
        "phonetic": "/məˈtɪk.jə.ləs/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Extremely careful, thorough, and paying great attention to tiny details.",
        "synonyms": ["precise", "detailed", "careful"]
    },
    "obsolete": {
        "phonetic": "/ˌɒb.səˈliːt/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "No longer used or produced because something newer and better replaced it.",
        "synonyms": ["outdated", "archaic", "superseded"]
    },
    "ubiquitous": {
        "phonetic": "/juːˈbɪk.wɪ.təs/",
        "partOfSpeech": "adjective",
        "level": "advanced",
        "definition": "Present, found, or seen everywhere you look.",
        "synonyms": ["omnipresent", "everywhere", "pervasive"]
    },
    "epiphany": {
        "phonetic": "/ɪˈpɪf.ə.ni/",
        "partOfSpeech": "noun",
        "level": "advanced",
        "definition": "A sudden moment when you finally realize or understand something deeply.",
        "synonyms": ["realization", "insight", "breakthrough"]
    },
    "reluctant": {
        "phonetic": "/rɪˈlʌk.tənt/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Hesitant or unwilling to do something.",
        "synonyms": ["hesitant", "unwilling", "slow"]
    },
    "consequence": {
        "phonetic": "/ˈkɒn.sɪ.kwəns/",
        "partOfSpeech": "noun",
        "level": "intermediate",
        "definition": "The result or outcome of an action or event.",
        "synonyms": ["result", "effect", "outcome"]
    },
    "crucial": {
        "phonetic": "/ˈkruː.ʃəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Extremely important or necessary for success.",
        "synonyms": ["critical", "vital", "essential"]
    },
    "ambiguous": {
        "phonetic": "/æmˈbɪɡ.ju.əs/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Having more than one possible meaning; unclear or confusing.",
        "synonyms": ["unclear", "vague", "doubtful"]
    },
    "inevitable": {
        "phonetic": "/ɪnˈev.ɪ.tə.bəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Certain to happen; impossible to avoid or stop.",
        "synonyms": ["unavoidable", "inescapable", "sure"]
    },
    "feasible": {
        "phonetic": "/ˈfiː.zə.bəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Possible and practical to do successfully.",
        "synonyms": ["workable", "practical", "achievable"]
    },
    "scrutinize": {
        "phonetic": "/ˈskruː.tɪ.naɪz/",
        "partOfSpeech": "verb",
        "level": "intermediate",
        "definition": "To examine or inspect someone or something very closely and critically.",
        "synonyms": ["inspect", "examine", "investigate"]
    },
    "vulnerable": {
        "phonetic": "/ˈvʌl.nər.ə.bəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Open to physical or emotional harm; easily hurt or attacked.",
        "synonyms": ["exposed", "defenseless", "fragile"]
    },
    "mitigate": {
        "phonetic": "/ˈmɪt.ɪ.ɡeɪt/",
        "partOfSpeech": "verb",
        "level": "intermediate",
        "definition": "To make something bad or painful less severe, serious, or harmful.",
        "synonyms": ["reduce", "lessen", "ease"]
    },
    "notorious": {
        "phonetic": "/nəʊˈtɔː.ri.əs/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Widely known, especially for something bad or disgraceful.",
        "synonyms": ["infamous", "disreputable", "scandalous"]
    },
    "plausible": {
        "phonetic": "/ˈplɔː.zə.bəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Sounding reasonable, believable, or likely to be true.",
        "synonyms": ["believable", "credible", "likely"]
    },
    "tangible": {
        "phonetic": "/ˈtæn.dʒə.bəl/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Real and definite; something you can touch or clearly perceive.",
        "synonyms": ["concrete", "real", "touchable"]
    },
    "unprecedented": {
        "phonetic": "/ʌnˈpres.ɪ.den.tɪd/",
        "partOfSpeech": "adjective",
        "level": "intermediate",
        "definition": "Never having happened or existed before.",
        "synonyms": ["unmatched", "unheard-of", "novel"]
    }
}

# Merge existing with expanded words
combined = {**existing, **expanded_words}

with open('src/data/vocab_core.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Curated Core Vocabulary Database (Simple English Senses)\n * Built for instant 0ms offline lookups with crystal-clear human-grade definitions.\n */\n\n')
    f.write('const SUBZ_VOCAB_CORE = ' + json.dumps(combined, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_VOCAB_CORE = SUBZ_VOCAB_CORE;\n}\n')

print(f"Total curated offline core words: {len(combined)}")
print("Verified 'semantic' in core:", "semantic" in combined)
