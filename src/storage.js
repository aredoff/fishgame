import { STORAGE_KEY } from './config.js';

export function loadBestScore() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    const n = parseInt(raw, 10);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  } catch {
    return 0;
  }
}

export function saveBestScore(score) {
  try {
    localStorage.setItem(STORAGE_KEY, String(Math.floor(score)));
  } catch {
    /* ignore */
  }
}
