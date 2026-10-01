import urllib.request
import json
import os

print("[Subz Engine] Generating Full Common Words Whitelist...")

url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english.txt'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        all_words = resp.read().decode('utf-8').splitlines()
except Exception as e:
    print("Fetch error:", e)
    all_words = []

# Take the top 4,500 everyday words (A1-B1)
# These words are standard conversation and should NEVER be highlighted
top_common = set([w.strip().lower() for w in all_words[:4500] if len(w.strip()) > 1])

# Generate common inflections (-s, -ed, -ing, -ly) for common base words
inflections = set()
for w in list(top_common)[:2500]:
    inflections.add(w + 's')
    inflections.add(w + 'es')
    inflections.add(w + 'ed')
    inflections.add(w + 'ing')
    if w.endswith('e'):
        inflections.add(w[:-1] + 'ing')
        inflections.add(w[:-1] + 'ed')

all_common = sorted(list(top_common.union(inflections)))

print(f"Total whitelisted everyday words + inflections: {len(all_common)}")
print(f"Checking 'change': {'change' in all_common}")
print(f"Checking 'changed': {'changed' in all_common}")
print(f"Checking 'remember': {'remember' in all_common}")
print(f"Checking 'remembered': {'remembered' in all_common}")
print(f"Checking 'operate': {'operate' in all_common}")
print(f"Checking 'operating': {'operating' in all_common}")

with open('src/data/common_words.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Comprehensive Common Words Whitelist (Top 4500 + Inflections)\n * Everyday vocabulary that is NEVER highlighted.\n */\n\n')
    f.write('const SUBZ_COMMON_WORDS = new Set([\n')
    for i in range(0, len(all_common), 10):
        batch = all_common[i:i+10]
        f.write('  ' + ', '.join([f'"{w}"' for w in batch]) + ',\n')
    f.write(']);\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_COMMON_WORDS = SUBZ_COMMON_WORDS;\n}\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n  module.exports = { SUBZ_COMMON_WORDS };\n}\n')

print("Saved to src/data/common_words.js successfully.")
