# Subz 🎯

> **Master English while watching YouTube.**  
> A zero-latency, pure light-mode Chrome Extension (Manifest V3) that intelligently highlights uncommon English vocabulary in real-time subtitles, delivers instant context-aware definitions, and helps you build a lasting vocabulary notebook without breaking your watching flow.

---

## ✨ Features

- **🎯 Contextual Subtitle Highlighting:**
  - Evaluates on-screen subtitles against a strict Oxford 3000 / CEFR common-word whitelist.
  - Automatically identifies uncommon, high-yield vocabulary (`dissect`, `nuance`, `meticulous`, `pragmatic`, `semantic`, etc.).
  - Distinguishes sentence-initial common words from proper nouns and tech brand entities (e.g. MKBHD, iPhone, ChatGPT).

- **⚡ Zero-Latency Definition Engine:**
  - **Speculative Background Prefetching:** Pre-fetches definitions while you read the subtitle line, achieving 0ms perceived latency when clicking.
  - **Built-in Offline Core Dictionary (`SUBZ_VOCAB_CORE`):** High-frequency B2/C1/C2 words resolve instantly offline with phonetics, parts of speech, and beginner-accessible explanations.
  - **Fail-safe Lemmatizer:** Resolves plurals, past tense, and inflections (`nuances` → `nuance`, `dissecting` → `dissect`) seamlessly.

- **🃏 Minimalist Word Card Popover:**
  - Designed with Apple x Google minimalism (pure light mode `#FFFFFF`, subtle multi-layer drop shadows, `Plus Jakarta Sans` typography).
  - Displays word pronunciation pills (`1.0x` and `0.75x` slow speed), part-of-speech badges, and the exact quote from the scene (`IN THIS SCENE`).
  - Native YouTube player integration for instant **Resume ▶** and **Replay 5s ↺** without player desync.

- **📓 Vocabulary Notebook & Daily Habit:**
  - One-click word bookmarking with date and sentence context.
  - Track your daily goal (e.g. 5 words/day) with an animated progress bar and streak counter.
  - Export your saved words anytime to a clean, formatted `.txt` study sheet.
  - Quick Word Lookup inside the popup or via context menu right-click.

---

## 🚀 Installation & Getting Started

### Load Unpacked in Google Chrome:

1. Clone or download this repository:
   ```bash
   git clone https://github.com/Sai-Pavan-Kumar/Subz.git
   ```
2. Open Google Chrome and navigate to `chrome://extensions/`.
3. In the top-right corner, enable **Developer mode**.
4. Click **Load unpacked** in the top-left toolbar.
5. Select the `subz` directory containing `manifest.json`.
6. Open any English YouTube video with subtitles enabled (e.g., tech reviews, podcasts, documentaries) and enjoy learning!

---

## 📂 Project Structure

```text
subz/
├── manifest.json              # Chrome Manifest V3 configuration
├── icons/                     # Extension branding icons (16, 32, 48, 128px)
├── src/
│   ├── background/
│   │   └── service_worker.js  # Background script for CSP-bypassing dictionary lookups
│   ├── content/
│   │   ├── card_manager.js    # Word Card popup, audio player, & YouTube player integration
│   │   ├── content.js         # Subtitle DOM observer, tokenization, & highlight injector
│   │   ├── content.css        # Word Card styles & subtitle highlight styles
│   │   └── shortcuts.js       # Keyboard shortcuts & playback listeners
│   ├── data/
│   │   ├── common_words.js    # Common words whitelist (~10,000 words + common inflections)
│   │   ├── vocab_core.js      # Built-in offline rich vocabulary dictionary
│   │   ├── lemmatizer.js      # Stemming and root-word resolution engine
│   │   └── dictionary_api.js  # 3-tier lookup engine (memory, core, & background API)
│   └── popup/
│       ├── popup.html         # Settings dashboard & Quick Search UI
│       ├── popup.css          # Plus Jakarta Sans light-mode styles
│       └── popup.js           # Settings controller, daily goal tracking, & .txt exporter
├── scripts/                   # Vocabulary generation & dataset expansion utilities
└── tests/
    └── comprehensive_test_suite.js  # Automated 101-test edge case verification suite
```

---

## 🧪 Testing

Run the automated test suite to verify word filtering, lemmatization, and dictionary resolutions:

```bash
node tests/comprehensive_test_suite.js
```
*(101/101 tests passing)*

---

## 📜 License

MIT License. Crafted for English learners worldwide.
