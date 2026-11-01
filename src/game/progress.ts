import { savedCountStorageKey } from '@/game/config';

export function loadSavedCount(): number {
  try {
    const stored = window.localStorage.getItem(savedCountStorageKey);

    if (stored === null || !/^(0|[1-9]\d*)$/.test(stored)) {
      return 0;
    }

    const count = Number(stored);

    return Number.isSafeInteger(count) && count < Number.MAX_SAFE_INTEGER ? count : 0;
  } catch {
    return 0;
  }
}

export function saveSavedCount(count: number): void {
  try {
    window.localStorage.setItem(savedCountStorageKey, String(count));
  } catch {
    // Storage can be unavailable; the current session should remain playable.
  }
}
