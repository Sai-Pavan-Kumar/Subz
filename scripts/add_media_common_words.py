import os

extra = [
    'podcast', 'podcasts', 'podcasting',
    'streamer', 'streamers', 'livestream', 'livestreams', 'livestreaming',
    'vlog', 'vlogs', 'vlogger', 'vloggers',
    'wifi', 'girlfriend', 'boyfriend',
    'subscribers', 'notifications', 'algorithm', 'playlist', 'playlists',
    'creators', 'timestamps', 'merch', 'patreon', 'discord',
    'sponsor', 'sponsors', 'sponsored', 'sponsorship',
    'yep', 'nope', 'yeah', 'okay', 'alright', 'gonna', 'wanna', 'gotta', 'kinda', 'sorta', 'dunno',
    'intro', 'outro', 'thumbnail', 'thumbnails', 'channel', 'channels'
]

with open('src/data/common_words.js', 'r', encoding='utf-8') as f:
    content = f.read()

start = content.find('new Set([')
end = content.find(']);', start)
raw = content[start + 9:end]
existing = set([w.strip().strip('"').strip("'") for w in raw.split(',') if w.strip()])

for w in extra:
    existing.add(w.lower())

sorted_words = sorted(list(existing))

with open('src/data/common_words.js', 'w', encoding='utf-8') as f:
    f.write('/**\n * Subz — Comprehensive Common Words Whitelist\n * Everyday vocabulary & platforms that are NEVER highlighted.\n */\n\n')
    f.write('const SUBZ_COMMON_WORDS = new Set([\n')
    for i in range(0, len(sorted_words), 10):
        batch = sorted_words[i:i+10]
        f.write('  ' + ', '.join([f'"{w}"' for w in batch]) + ',\n')
    f.write(']);\n\n')
    f.write('if (typeof window !== "undefined") {\n  window.SUBZ_COMMON_WORDS = SUBZ_COMMON_WORDS;\n}\n')
    f.write('if (typeof module !== "undefined" && module.exports) {\n  module.exports = { SUBZ_COMMON_WORDS };\n}\n')

print(f"Updated SUBZ_COMMON_WORDS count: {len(sorted_words)}")
