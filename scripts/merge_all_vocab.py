import json
import os

from generate_vocab_core import vocab_seed
from expand_vocab import expanded_words

merged = {**vocab_seed, **expanded_words}

# Update definitions in vocab_seed if expanded_words has a simpler definition
for k, v in expanded_words.items():
    merged[k] = v

with open('src/data/vocab_core.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Curated Core Vocabulary Database (Simple English Senses)\n * Built for instant 0ms offline lookups with crystal-clear human-grade definitions.\n */\n\n')
    f.write('const SUBZ_VOCAB_CORE = ' + json.dumps(merged, indent=2, ensure_ascii=False) + ';\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_VOCAB_CORE = SUBZ_VOCAB_CORE;\n}\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n  module.exports = { SUBZ_VOCAB_CORE };\n}\n')

print(f"Total merged core words: {len(merged)}")
print("semantic definition:", merged.get("semantic", {}).get("definition"))
