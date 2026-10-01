# SUBZ — Master Product Specification & Architecture Dossier

> **Document Version:** 1.0.0  
> **Status:** APPROVED & LOCKED FOR BUILD  
> **Date:** October 01, 2026  
> **Author:** Antigravity Elite AI Product Studio & Founder

---

## 1. Executive Summary & Product Vision

### 1.1 The Core Problem
Billions of people watch English movies, TV series, interviews, and YouTube videos to improve their spoken and written English. However, when native speakers use uncommon or advanced words, viewers face a painful dilemma:
1. **Interrupt Immersion:** Switch to a dictionary app or Google, pause the video, search the word, losing the dialogue rhythm and enjoyment.
2. **Ignore & Forget:** Ignore the unfamiliar word, miss the nuanced meaning of the scene, and fail to retain any vocabulary.

### 1.2 The Subz Solution
**Subz** is a lightweight, zero-latency Chrome Extension that seamlessly monitors video subtitles (starting with YouTube), detects medium and advanced vocabulary, gently underlines them in **Subz Amber**, and enables instant **Click-to-Pause** learning. 

Viewers get a clean, Apple-grade, pure Light-Mode Word Card with pronunciation audio, simple English definitions, synonyms, and scene context—without ever breaking their natural entertainment flow.

---

## 2. Brand Identity & Visual Design Tokens

### 2.1 Design Philosophy: Pure Apple-Grade Light Mode
Subz strictly operates in **100% Pure Light Mode**. There is no dark mode. Every surface is high-contrast, clean, and distraction-free.

```
Canvas / Surfaces:       Pure White (#FFFFFF)
Elevated Cards / Panels: Pure White (#FFFFFF) with 1px subtle Slate Border (#E2E8F0)
Primary Brand Color:     Electric Blue (#006CF2)
Accent Highlight Color:  Subz Amber (#D97706 / #F59E0B)
Text Primary:            Slate 900 (#0F172A) — WCAG AAA compliant
Text Secondary / Muted:  Slate 600 (#475569) / Slate 400 (#94A3B8)
Shadows & Elevation:     0 4px 20px -2px rgba(15, 23, 42, 0.08)
Typography:              Inter / -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto
```

### 2.2 Official Logo & Asset Pack
- **Logo Graphic:** 2-line subtitle pill visualization with a centered golden amber focal pill.
- **Background:** Solid Pure White (`#FFFFFF`).
- **Generated Formats:** WebP (Ultra-compressed: 2.6 KB total pack) with PNG fallback for Chrome Web Store validation.
  - `icons/icon16.webp` (236 bytes) & `icon16.png` (318 bytes)
  - `icons/icon32.webp` (396 bytes) & `icon32.png` (613 bytes)
  - `icons/icon48.webp` (572 bytes) & `icon48.png` (1.0 KB)
  - `icons/icon128.webp` (1.4 KB) & `icon128.png` (3.6 KB)

### 2.3 The "Zero AI Fingerprint" & Minimalist Design Manifesto (Strict Rule)
Every screen, popup, card, and interaction must look like it was handcrafted by an obsessed human designer at Apple or Linear. Absolutely zero AI design clichés.

1. **NO Sparkles (✨ / ✦):** Strictly prohibited. Never use sparkle emojis, glittering stars, or "magic wand" motifs.
2. **NO Cheap AI Gradients:** Zero purple-to-pink, rainbow, or neon AI gradients. All backgrounds are pure solid `#FFFFFF` with slate accents.
3. **NO Text Headline Pills:** Do not place trendy, tacky badge pills above titles (e.g., `[✦ AI VOCABULARY ✦]` or `[• SMART EXTENSION •]`). Use clean, authoritative typographic hierarchy.
4. **NO Cheap / Generic Icons:** Every icon must be a custom, ultra-crisp, geometric SVG with consistent 1.5px stroke weight and precise 16x16 / 20x20 bounding boxes. No cartoonish emojis where professional icons belong.
5. **Pure Minimalism (Function-First):** Generous whitespace, razor-sharp 1px hairline borders (`#E2E8F0`), strict 8px spacing rhythm, and clear typography. Every visual element must serve an educational or navigational purpose.

---

## 3. Product Features & Detailed Specifications

### 3.1 100% Global English (Zero Regional Lock-in)
Subz is strictly designed for the **1.5 Billion global English learners** worldwide (Latin America, Europe, East Asia, Middle East, India). All definitions, pronunciations, and explanations are written in clear, natural, everyday English.

---

### 3.2 In-Video Subtitle Highlight Engine

```text
┌─────────────────────────────────────────────────────────────────┐
│                                                                 │
│                      [ YouTube Video Playing ]                  │
│                                                                 │
│         "This ancient strategy has become completely obsolete"  │
│                                                      ════════   │  <-- Subz Amber Underline
└─────────────────────────────────────────────────────────────────┘
```

1. **Subtle Underline Indicator:** Non-intrusive 2px dashed/solid underline under target words. Subtitle text remains 100% readable.
2. **Click-to-Pause Trigger:** Hovering changes cursor to pointer. Clicking the word instantly:
   - Pauses the video automatically at that exact millisecond.
   - Computes floating popover coordinates directly above or below the clicked word.
   - Displays the **Word Card**.

---

### 3.3 The Word Card (Floating Popover)

```text
┌─────────────────────────────────────────────────────────────┐
│  OBSOLETE                                          ⭐ Save  │
│  /ˌɒb.səˈliːt/  🔊 [Normal]  🐢 [Slow]                      │
│  adjective • Advanced                                       │
│  ─────────────────────────────────────────────────────────  │
│  📖 Meaning:                                                │
│  No longer used or produced because something newer exists. │
│                                                             │
│  🔄 Synonyms:                                               │
│  Outdated, archaic, out-of-date                             │
│                                                             │
│  🎬 In this scene:                                          │
│  "...this strategy has become completely obsolete."         │
│                                                             │
│  [ ⏮️ Replay Scene ]                  [ ▶️ Resume Video ]    │
└─────────────────────────────────────────────────────────────┘
```

#### Detailed Element Breakdown:
* **Word & IPA Phonetics:** Word in bold uppercase + International Phonetic Alphabet representation.
* **Grammar Badge:** Part of speech (`[adjective]`, `[noun]`, `[verb]`) + Difficulty level tag (`Advanced`).
* **Dual Audio Pronunciation:**
  * 🔊 **Normal:** Crisp, native British/American pronunciation.
  * 🐢 **Slow (0.75x):** Syllable-by-syllable paced audio for tough words.
* **Simple Definition:** 1-2 short sentences in 5th-grade vocabulary.
* **Synonyms:** 2-3 everyday alternative words to anchor mental connections.
* **In-Scene Context:** Exact sentence captured from the active subtitle cue.
* **Action Buttons:**
  * ⭐ **Save Word:** Adds to personal vocabulary collection.
  * 🔁 **Replay Scene (⏮️ 5s):** Rewinds video by 5 seconds and resumes playback, letting the user hear the actor pronounce the dialogue in context.
  * ▶️ **Resume Video:** Resumes playback and closes the card. (Also triggered by pressing `Space` or clicking outside).
  * ✕ **"I already know this":** Permanently whitelists the word so it is never highlighted again.

---

### 3.4 Keyboard Shortcut Navigation (Hands-Free Mode)

Power users can navigate subtitles and vocabulary without lifting hands to touch the mouse:
- **`A` Key:** Replay current sentence / jump back to previous subtitle cue.
- **`S` Key:** Pause video and open Word Card for the first highlighted word in view.
- **`D` Key:** Skip forward to the next subtitle cue.
- **`Spacebar`:** Universal Resume / Pause.

---

### 3.5 Extension Toolbar Dashboard (`popup.html`)

A clean, light-mode control panel accessible from the browser toolbar:

```text
┌─────────────────────────────────────────────────────────┐
│  [Logo] SUBZ                              [ Toggle: ON] │
│  ─────────────────────────────────────────────────────  │
│                                                         │
│  🎯 English Level:                                      │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Intermediate (B2 - Uncommon words)              ▾ │  │
│  └───────────────────────────────────────────────────┘  │
│    • Learner (A2/B1 - Medium & hard words)              │
│    • Intermediate (B2 - Highlight uncommon words)       │
│    • Advanced (C1/C2 - Rare & elite words only)         │
│                                                         │
│  🎨 Highlight Style & Color:                            │
│  ┌───────────────────────────────────────────────────┐  │
│  │ Amber Gold (Default)                            ▾ │  │
│  └───────────────────────────────────────────────────┘  │
│    • Amber Gold (#D97706)                               │
│    • Electric Cyan (#0284C7)                            │
│    • Neon Emerald (#059669)                             │
│    • Coral Rose (#E11D48)                               │
│                                                         │
│  ⚙️ Preferences:                                        │
│  • Auto-Pause on word click                 [  ON  ]    │
│  • Pronounce word automatically             [ OFF  ]    │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  🎯 Today's Goal: 5 Words                               │
│  [████████████░░░░░░░░░░] 3/5 Learned (🔥 4-Day Streak) │
│                                                         │
│  ─────────────────────────────────────────────────────  │
│  📚 Saved Words: 14                                     │
│  🔍 [ Search saved words...                         ]   │
│                                                         │
│  [ 📄 Download as .txt ]            [ 🗑️ Clear List ]   │
└─────────────────────────────────────────────────────────┘
```

#### Settings & Controls:
1. **Master ON/OFF Toggle:** Instant kill switch to enable/disable subtitle hooks.
2. **English Level Dropdown (`<select>`):**
   - *Learner (A2/B1):* Targets medium & difficult words (~12-18 words/video).
   - *Intermediate (B2):* Targets uncommon words (~6-10 words/video) — *Default*.
   - *Advanced (C1/C2):* Targets rare & academic words only (~2-4 words/video).
3. **Highlight Color Dropdown (`<select>`):** Allows color customization (Amber Gold, Electric Cyan, Neon Emerald, Coral Rose).
4. **Behavior Toggles:**
   - Auto-pause when opening word card.
   - Auto-play audio pronunciation on open.
5. **Daily Learning Habit Tracker:**
   - Goal: 5 words/day (customizable).
   - Visual progress bar + Daily learning streak counter.
6. **Vocabulary Search:** Real-time search filter through all saved words.
7. **Export as `.txt`:** Downloads a human-readable text document formatted for instant reading in Notepad, Apple Notes, or WhatsApp.

---

### 3.6 Sample Exported Vocabulary `.txt` File

```text
======================================================
SUBZ VOCABULARY NOTEBOOK
Exported on: 01 October 2026
Total Saved Words: 2
======================================================

1. OBSOLETE (/ˌɒb.səˈliːt/) - adjective [Advanced]
   Meaning: No longer used or produced because something newer exists.
   Synonyms: Outdated, archaic, superseded
   Context: "...this ancient strategy has become completely obsolete."

------------------------------------------------------
2. METICULOUS (/məˈtɪk.jə.ləs/) - adjective [Advanced]
   Meaning: Showing great attention to detail; very careful and precise.
   Synonyms: Diligent, thorough, painstaking
   Context: "She was meticulous about keeping laboratory records."

======================================================
Generated with Subz — Master English While Watching.
```

---

## 4. Technical Architecture & Data Strategy

### 4.1 Hybrid Vocabulary Architecture
Subz employs a dual-layer lookup engine ensuring **instant 0ms response time** combined with **100% dictionary coverage**:

```
[ Active Subtitle Cue ] 
          ↓
[ Tokenizer & Lemmatizer ] (Strips punctuation, handles plurals/conjugations)
          ↓
[ Whitelist Check ] (Is it in Oxford 3000 common words? If yes → Ignore)
          ↓
[ Subz Curated Offline Pack (~5,800 Words, ~450 KB) ]
          ├── MATCH FOUND: Instant 0ms highlight + definition cached
          └── NOT FOUND IN CORE:
                    ↓
        [ Background Async Fallback ]
        (Queries Free Dictionary API & caches in chrome.storage.local)
```

1. **Layer 1: Offline Core Pack (~5,800 Curated Words)**
   - Stored in a compact JSON dictionary inside the extension.
   - Uncompressed size: ~450 KB.
   - Loaded into a hash map in memory upon browser launch.
   - Zero network calls, zero server costs, zero rate limits.
2. **Layer 2: Dynamic Free Dictionary API Fallback**
   - Fallback endpoint: `https://api.dictionaryapi.dev/api/v2/entries/en/{word}`
   - Invoked only when a rare or technical word outside the curated 5,800 is clicked.
   - Results are automatically cached into `chrome.storage.local` to prevent redundant network fetches.

---

### 4.2 YouTube Player Integration Mechanics
- **Target Elements:** Observes YouTube caption container `.ytp-caption-window-container` using `MutationObserver`.
- **Subtitle Segmentation:** When new `.ytp-caption-segment` elements enter the DOM, text is tokenized into word spans without disrupting YouTube's native timing or font styling.
- **Coordinate Projection:** When a highlighted word span is clicked, `getBoundingClientRect()` calculates exact viewport coordinates to float the Word Card with collision detection (ensuring it never overflows off-screen).
- **Playback Control:** Direct hook to `document.querySelector('video')` for immediate, frame-accurate `video.pause()`, `video.play()`, and `video.currentTime -= 5` (Replay).

---

## 5. File System Structure

```text
subz/
├── manifest.json              # Chrome Extension Manifest V3 configuration
├── icons/                     # WebP & PNG icon asset pack
│   ├── icon16.webp / icon16.png
│   ├── icon32.webp / icon32.png
│   ├── icon48.webp / icon48.png
│   └── icon128.webp / icon128.png
├── src/
│   ├── background/
│   │   └── service_worker.js  # Installation, context menus & storage sync
│   ├── content/
│   │   ├── content.js         # Subtitle MutationObserver & YouTube player hook
│   │   ├── content.css        # Subtitle underline & Word Card pure light styles
│   │   ├── card_manager.js    # Word Card DOM renderer, positioning & audio
│   │   └── shortcuts.js       # A, S, D, Space keyboard navigation listeners
│   ├── popup/
│   │   ├── popup.html         # Light-mode dashboard popup
│   │   ├── popup.css          # Apple-clean styling & typography
│   │   └── popup.js           # Settings state, stats, search, & .txt exporter
│   └── data/
│       ├── common_words.json  # Oxford 3000 whitelist (words to ignore)
│       ├── vocab_core.json    # 5,800 curated words with definitions & phonetics
│       └── dictionary_api.js  # Async fallback fetcher & local cache engine
└── SUBZ_SPEC.md               # This master specification document
```

---

## 6. Implementation Milestones

| Milestone | Deliverables | Target Status |
|---|---|---|
| **Phase 1: Foundation** | Project scaffolding, `manifest.json`, icon bindings, core 5,800 word data engine | 🟢 Ready |
| **Phase 2: YouTube Subtitle Hook** | MutationObserver, subtitle word wrapping, level-filtered amber underlines | ⏳ Next |
| **Phase 3: The Word Card** | Floating popover, Web Audio API pronunciation, Replay 5s, Save word | ⏳ Next |
| **Phase 4: Keyboard Shortcuts** | `A`, `S`, `D` hotkeys integration with YouTube player | ⏳ Next |
| **Phase 5: Popup Dashboard** | Level dropdown, color selector, daily streak, `.txt` exporter | ⏳ Next |
| **Phase 6: Verification & QA** | Real YouTube video playback testing, edge cases (captions toggle, ads) | ⏳ Next |

---
*End of Master Product Specification.*
