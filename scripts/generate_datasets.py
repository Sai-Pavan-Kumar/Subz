import urllib.request
import json
import os

print("[Subz Engine] Preparing Data Assets...")

# 1. Fetch Google 10k English (Medium/Short)
url = 'https://raw.githubusercontent.com/first20hours/google-10000-english/master/google-10000-english-usa-no-swears-short.txt'
req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
try:
    with urllib.request.urlopen(req, timeout=10) as resp:
        raw_words = resp.read().decode('utf-8').splitlines()
except Exception as e:
    print("Warning: Network fetch failed, using fallback list:", e)
    raw_words = []

# Fallback common words if needed
if len(raw_words) < 500:
    fallback_basics = [
        "the", "be", "to", "of", "and", "a", "in", "that", "have", "i", "it", "for", "not", "on", "with",
        "he", "as", "you", "do", "at", "this", "but", "his", "by", "from", "they", "we", "say", "her",
        "she", "or", "an", "will", "my", "one", "all", "would", "there", "their", "what", "so", "up",
        "out", "if", "about", "who", "get", "which", "go", "me", "when", "make", "can", "like", "time",
        "no", "just", "him", "know", "take", "people", "into", "year", "your", "good", "some", "could",
        "them", "see", "other", "than", "then", "now", "look", "only", "come", "its", "over", "think",
        "also", "back", "after", "use", "two", "how", "our", "work", "first", "well", "way", "even",
        "new", "want", "because", "any", "these", "give", "day", "most", "us"
    ]
    raw_words = fallback_basics + raw_words

# Filter top ~2,200 everyday words (A1-A2 and simple B1)
cleaned_common = sorted(list(set([w.strip().lower() for w in raw_words if len(w.strip()) > 1][:2400])))

os.makedirs('src/data', exist_ok=True)
with open('src/data/common_words.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Oxford 3000 / Top Common English Words Whitelist\n * Words in this list are everyday basic vocabulary and are NEVER highlighted.\n */\n\n')
    f.write('const SUBZ_COMMON_WORDS = new Set([\n')
    for i in range(0, len(cleaned_common), 10):
        batch = cleaned_common[i:i+10]
        f.write('  ' + ', '.join([f'"{w}"' for w in batch]) + ',\n')
    f.write(']);\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_COMMON_WORDS = SUBZ_COMMON_WORDS;\n}\n')

print(f"Generated src/data/common_words.js with {len(cleaned_common)} common words.")
