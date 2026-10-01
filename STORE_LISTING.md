# Subz — Chrome Web Store Official Launch Package 🚀

This document contains everything you need to copy-paste directly into the **Google Chrome Web Store Developer Console** (`https://chrome.google.com/webstore/devconsole`) for instant submission.

---

## 1. Store Metadata (Copy & Paste)

### 📌 Extension Title (Max 45 chars)
```text
Subz — Learn English from YouTube Subtitles
```

### 📝 Short Summary (Max 132 chars)
```text
Master English while watching YouTube. Smart subtitle vocabulary highlighting, 0ms instant definitions, and your personal notebook.
```

### 🏷️ Category
- **Primary:** `Education`
- **Secondary:** `Productivity`

---

## 2. Detailed Store Description (Copy & Paste)

```markdown
Turn every YouTube video into an effortless English masterclass. 

Subz is a lightweight, pure light-mode extension that intelligently underlines uncommon and advanced English vocabulary in subtitles, displays instant context-aware definitions, and helps you build a personal vocabulary notebook—without ever breaking your watching flow.

Whether you are watching tech reviews, TED Talks, podcasts, interviews, or documentaries, Subz helps you expand your vocabulary naturally in context.

───────────────────────────────
✨ KEY FEATURES
───────────────────────────────

🎯 Smart Subtitle Highlighting
• Automatically evaluates video captions against an Oxford 3000 / CEFR common-word database.
• Underlines uncommon and advanced words (e.g. "dissect", "nuance", "pragmatic", "semantic") in elegant Subz Amber.
• Common conversational words (e.g. "remember", "change", "operate") and brand names (e.g. iPhone, MKBHD, ChatGPT) are never falsely highlighted.

⚡ 0ms Zero-Latency Definition Engine
• Speculative Prefetching: Pre-fetches word definitions in the background while you read the caption segment.
• Built-in Offline Core Dictionary: High-yield B2/C1/C2 words resolve instantly offline with beginner-friendly explanations.
• Intelligent Lemmatizer: Seamlessly resolves plurals, past tense, and inflected forms ("nuances" → "nuance", "dissecting" → "dissect").

🃏 Minimalist Word Card Popover
• Designed with Apple-grade minimalism (pure light mode, distraction-free typography).
• Crisp audio pronunciation with 1.0x and 0.75x slow speeds.
• "IN THIS SCENE" quote box displays the exact dialogue sentence where the word appeared.
• Native YouTube player integration: Click "Resume ▶" or "↺ Replay 5s" to continue watching without player desync.

📓 Personal Vocabulary Notebook & Habit Tracker
• Save any word to your personal notebook with one click.
• Daily Habit Goal: Stay motivated with a daily progress bar and streak counter.
• 1-Click Export: Download your saved words anytime as a clean, formatted .txt study sheet.
• Quick Search: Look up or paste any word inside the popup or via right-click ("Search with Subz").

───────────────────────────────
🔒 PRIVACY & SECURITY FIRST
───────────────────────────────

• 100% Client-Side: Runs entirely in your browser.
• Zero Data Tracking: We never collect passwords, browsing history, or personal data.
• Local Storage: Your saved words, daily streak, and preferences remain strictly on your device.
• Ad-Free & Lightweight: No tracking scripts, no third-party ads.

───────────────────────────────
💡 HOW TO USE
───────────────────────────────

1. Install Subz and pin it to your Chrome toolbar.
2. Open any English YouTube video with subtitles enabled (press "C" on YouTube).
3. Uncommon words are gently underlined.
4. Click any underlined word (or click any normal word on demand) to open the Word Card.
5. Listen to the pronunciation, save the word to your notebook, and hit Resume!

Master English in context. Happy learning with Subz!
```

---

## 3. Chrome Web Store Privacy Disclosures (Mandatory)

When prompted under the **Privacy** tab in the developer console:

### 1. Single Purpose Description
```text
Subz provides contextual English vocabulary learning by highlighting uncommon words in YouTube video subtitles and displaying instant definitions, pronunciation audio, and a personal vocabulary notebook.
```

### 2. Permission Justifications
- **`storage`**:
  ```text
  Used strictly to store the user's saved vocabulary words, daily goal progress, learning streak, and display preferences locally on their machine.
  ```
- **`activeTab`**:
  ```text
  Used to detect YouTube video player state, render the subtitle word-highlight overlay, and display the interactive Word Card popover.
  ```
- **`contextMenus`**:
  ```text
  Used to provide a right-click "Search with Subz" shortcut so users can quickly look up definitions for highlighted words anywhere on YouTube.
  ```
- **Host Permissions (`*://*.youtube.com/*`, `api.dictionaryapi.dev/*`)**:
  ```text
  Required to monitor subtitle cues on YouTube pages and fetch definitions for uncommon English words not present in the offline core vocabulary.
  ```

### 3. Data Usage Certification
- [x] **No Personal Data Collected**: Subz does not collect, transmit, or monetize any user data.
- [x] **No Advertising**: Subz does not sell user data to data brokers or advertising networks.

---

## 4. 5-Minute Developer Console Upload Guide

1. Visit **Google Chrome Web Store Developer Dashboard**:
   👉 [https://chrome.google.com/webstore/devconsole](https://chrome.google.com/webstore/devconsole)
2. If this is your first time, pay Google's one-time **$5 registration fee**.
3. Click **"New Item"** (top right).
4. Drag and drop the ready production zip:
   `c:\Projects\subz\dist\subz-v1.0.0-production.zip`
5. Fill in the **Store Listing** tab using the metadata and description from Section 1 & 2 above.
6. Under the **Privacy** tab, paste the permission justifications from Section 3.
7. Upload at least 1 screenshot (see `dist/store-assets/` for instructions).
8. Click **"Submit for Review"**! (Review typically takes 24–48 hours).
