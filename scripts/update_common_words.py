import os

# Additional essential everyday words, grammar conjunctions, tech brands, and function words
extra_common_words = [
    # Conjunctions & Adverbs
    "whenever", "wherever", "whatever", "whoever", "whomever", "whichever", "however",
    "meanwhile", "furthermore", "moreover", "nevertheless", "nonetheless", "anyway",
    "anywhere", "everywhere", "somewhere", "nowhere", "somehow", "everything",
    "everyone", "everybody", "something", "someone", "somebody", "nothing", "nobody",
    "anything", "anyone", "anybody", "already", "almost", "always", "sometimes",
    "together", "without", "within", "throughout", "besides", "instead", "whereas",
    "likewise", "otherwise", "therefore", "afterwards", "beforehand", "further",
    
    # Common tech words, platforms, and names frequently in YouTube dialogue
    "youtube", "youtuber", "google", "gemini", "apple", "iphone", "ipad", "android",
    "samsung", "microsoft", "windows", "mac", "macbook", "twitter", "instagram",
    "tiktok", "meta", "facebook", "amazon", "netflix", "spotify", "chatgpt", "openai",
    "chrome", "pixel", "intel", "nvidia", "amd", "qualcomm", "tesla", "uber",
    "bluetooth", "wireless", "battery", "camera", "screen", "display", "speaker",
    "video", "videos", "audio", "button", "buttons", "device", "devices", "laptop",
    "phone", "phones", "smartphone", "smartphones", "tablet", "tablets", "computer",
    "gadget", "gadgets", "hardware", "software", "app", "apps", "update", "updates",
    "version", "feature", "features", "setting", "settings", "review", "reviews",
    "click", "clicks", "clicked", "clicking", "tap", "taps", "tapped", "tapping",
    "swipe", "scroll", "download", "upload", "install", "stream", "streaming"
]

with open('src/data/common_words.js', 'r', encoding='utf-8') as f:
    content = f.read()

# Read existing set
start = content.find('new Set([')
if start != -1:
    end = content.find(']);', start)
    raw_array = content[start + 9:end]
    existing = set([w.strip().strip('"').strip("'") for w in raw_array.split(',') if w.strip()])
    print(f"Existing common words: {len(existing)}")

    # Merge
    for w in extra_common_words:
        existing.add(w.lower())
    
    sorted_words = sorted(list(existing))
    print(f"Updated common words count: {len(sorted_words)}")
    print("Checking 'whenever':", 'whenever' in sorted_words)
    print("Checking 'youtube':", 'youtube' in sorted_words)
    print("Checking 'gemini':", 'gemini' in sorted_words)

    with open('src/data/common_words.js', 'w', encoding='utf-8') as f_out:
        f_out.write('/**\n * Subz — Comprehensive Common Words Whitelist\n * Everyday vocabulary & platforms that are NEVER highlighted.\n */\n\n')
        f_out.write('const SUBZ_COMMON_WORDS = new Set([\n')
        for i in range(0, len(sorted_words), 10):
            batch = sorted_words[i:i+10]
            f_out.write('  ' + ', '.join([f'"{w}"' for w in batch]) + ',\n')
        f_out.write(']);\n\n')
        f_out.write('if (typeof window !== "undefined") {\n  window.SUBZ_COMMON_WORDS = SUBZ_COMMON_WORDS;\n}\n')
        f_out.write('if (typeof module !== "undefined" && module.exports) {\n  module.exports = { SUBZ_COMMON_WORDS };\n}\n')

print("Updated src/data/common_words.js successfully.")
