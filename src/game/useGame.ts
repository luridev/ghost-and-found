import { computed, onScopeDispose, ref, shallowRef } from 'vue';
import { animationDurations } from '@/game/config';
import { generateLevel } from '@/game/generateLevel';
import { loadSavedCount, saveSavedCount } from '@/game/progress';
import type { GamePhase } from '@/game/types';

export function useGame() {
  const level = shallowRef(generateLevel());
  const levelId = ref(0);
  const phase = ref<GamePhase>('searching');
  const savedCount = ref(loadSavedCount());
  const foundEmojis = ref(new Set<string>());
  const collectingEmojis = ref(new Set<string>());
  const timers = new Set<number>();

  const foundCount = computed(() => foundEmojis.value.size);
  const targetCount = computed(() => level.value.targets.length);
  const remainingTargets = computed(() => level.value.targets.filter((item) => !foundEmojis.value.has(item.emoji)));
  const visibleItems = computed(() => level.value.items.filter((item) => !foundEmojis.value.has(item.emoji)));
  const isRescued = computed(() => phase.value === 'rescued');
  const isBoardLocked = computed(() => phase.value !== 'searching' || foundCount.value + collectingEmojis.value.size === targetCount.value);

  function schedule(action: () => void, duration: number): void {
    const timer = window.setTimeout(() => {
      timers.delete(timer);
      action();
    }, duration);

    timers.add(timer);
  }

  function clearTimers(): void {
    for (const timer of timers) {
      window.clearTimeout(timer);
    }

    timers.clear();
  }

  function collectItem(emoji: string): void {
    if (isBoardLocked.value || foundEmojis.value.has(emoji) || collectingEmojis.value.has(emoji)) {
      return;
    }

    if (!level.value.targets.some((item) => item.emoji === emoji)) {
      return;
    }

    collectingEmojis.value.add(emoji);

    if (foundCount.value + collectingEmojis.value.size === targetCount.value) {
      savedCount.value += 1;
      saveSavedCount(savedCount.value);
    }

    schedule(() => {
      foundEmojis.value.add(emoji);
      collectingEmojis.value.delete(emoji);

      if (foundCount.value !== targetCount.value || phase.value !== 'searching') {
        return;
      }

      phase.value = 'rescuing';

      schedule(() => {
        phase.value = 'rescued';
      }, animationDurations.rescue);
    }, animationDurations.itemExit);
  }

  function startNextLevel(): void {
    if (phase.value !== 'rescued') {
      return;
    }

    clearTimers();
    level.value = generateLevel();
    foundEmojis.value.clear();
    collectingEmojis.value.clear();
    phase.value = 'searching';
    levelId.value += 1;
  }

  onScopeDispose(clearTimers);

  return {
    level,
    levelId,
    phase,
    savedCount,
    foundCount,
    targetCount,
    remainingTargets,
    visibleItems,
    collectingEmojis,
    isRescued,
    isBoardLocked,
    collectItem,
    startNextLevel,
  };
}
