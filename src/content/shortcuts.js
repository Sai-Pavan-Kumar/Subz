/**
 * Subz — Keyboard Navigation Shortcuts
 * Handles hands-free subtitle and video navigation:
 * - 'A': Replay current scene (Rewind 5s)
 * - 'S': Inspect current highlighted word / open Word Card
 * - 'D': Skip ahead 3s / next subtitle
 * - 'Escape' / 'Space': Dismiss Word Card & resume
 */

const SubzShortcuts = {
  init() {
    window.addEventListener('keydown', (e) => this.handleKeyDown(e), true);
  },

  handleKeyDown(e) {
    // 1. Never intercept when user is typing in search, comments, or inputs
    const activeEl = document.activeElement;
    if (activeEl && (
      activeEl.tagName === 'INPUT' ||
      activeEl.tagName === 'TEXTAREA' ||
      activeEl.isContentEditable ||
      activeEl.getAttribute('role') === 'textbox'
    )) {
      return;
    }

    const video = document.querySelector('video');

    // 2. Handle Escape: Close Word Card and resume
    if (e.key === 'Escape') {
      if (SubzCardManager && SubzCardManager.currentCard) {
        SubzCardManager.hide();
        if (video) video.play();
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }

    // 3. Handle Space: If Word Card is open, dismiss and resume
    if (e.code === 'Space') {
      if (SubzCardManager && SubzCardManager.currentCard) {
        SubzCardManager.hide();
        if (video) video.play();
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }

    // Don't intercept shortcuts if extension is disabled
    if (typeof SubzState !== 'undefined' && !SubzState.settings.enabled) {
      return;
    }

    // 4. 'A' key: Replay current scene (Rewind 5s)
    if (e.code === 'KeyA') {
      if (video) {
        video.currentTime = Math.max(0, video.currentTime - 5);
        video.play();
        if (SubzCardManager) SubzCardManager.hide();
        this._showHUD('⏮️ Replayed 5s');
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }

    // 5. 'S' key: Pause and open Word Card for the first visible highlighted word
    if (e.code === 'KeyS') {
      const firstHighlight = document.querySelector('.subz-word-highlight');
      if (firstHighlight) {
        firstHighlight.click();
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }

    // 6. 'D' key: Skip ahead 3 seconds
    if (e.code === 'KeyD') {
      if (video) {
        video.currentTime = Math.min(video.duration || 999999, video.currentTime + 3);
        if (SubzCardManager) SubzCardManager.hide();
        this._showHUD('⏭️ Forward 3s');
        e.stopPropagation();
        e.preventDefault();
      }
      return;
    }
  },

  /**
   * Subtle, clean HUD notification when using keyboard shortcuts
   */
  _showHUD(message) {
    let hud = document.getElementById('subz-shortcut-hud');
    if (!hud) {
      hud = document.createElement('div');
      hud.id = 'subz-shortcut-hud';
      hud.style.cssText = `
        position: fixed !important;
        bottom: 72px !important;
        left: 50% !important;
        transform: translateX(-50%) !important;
        background-color: rgba(15, 23, 42, 0.85) !important;
        color: #FFFFFF !important;
        padding: 6px 14px !important;
        border-radius: 20px !important;
        font-family: -apple-system, sans-serif !important;
        font-size: 12px !important;
        font-weight: 600 !important;
        z-index: 2147483640 !important;
        pointer-events: none !important;
        transition: opacity 0.2s ease !important;
      `;
      document.body.appendChild(hud);
    }

    hud.innerText = message;
    hud.style.opacity = '1';

    clearTimeout(this._hudTimer);
    this._hudTimer = setTimeout(() => {
      hud.style.opacity = '0';
    }, 1200);
  }
};

if (typeof window !== 'undefined') {
  window.SubzShortcuts = SubzShortcuts;
}
