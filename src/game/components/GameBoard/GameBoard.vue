<script setup lang="ts">
import { computed, type CSSProperties } from 'vue';
import { animationDurations, boardLayout } from '@/game/config';
import type { GameBoardEmits, GameBoardProps } from '@/game/components/GameBoard/types';

defineOptions({
  inheritAttrs: false,
});

const props = defineProps<GameBoardProps>();
const emit = defineEmits<GameBoardEmits>();

const boardStyle: CSSProperties = {
  '--game-board-width': `${boardLayout.width}px`,
  '--game-board-height': `${boardLayout.height}px`,
  '--game-board-item-size': `${boardLayout.itemSize}px`,
  '--game-board-item-exit': `${animationDurations.itemExit}ms`,
};

const displayedItems = computed(() => props.items.map((item) => ({
  ...item,
  className: props.collectingEmojis.has(item.emoji) ? 'GameBoard__item_leaving' : undefined,
  disabled: props.locked || props.collectingEmojis.has(item.emoji),
  style: {
    left: `${item.x}px`,
    top: `${item.y}px`,
    zIndex: item.isTarget ? 2 : 1,
    '--game-board-item-rotation': `${item.rotation}deg`,
    '--game-board-item-scale': item.scale,
    '--game-board-item-saturation': item.saturation,
    '--game-board-item-brightness': item.brightness,
  },
})));
</script>

<template>
  <section
    v-bind="$attrs"
    class="GameBoard"
    :style="boardStyle"
    aria-label="Игровое поле с потерянными вещами"
  >
    <button
      v-for="item in displayedItems"
      :key="item.emoji"
      class="GameBoard__item"
      :class="item.className"
      :style="item.style"
      type="button"
      :aria-label="item.name"
      :disabled="item.disabled"
      @click="() => emit('findItem', item.emoji)"
    >
      <span
        class="GameBoard__emoji"
        aria-hidden="true"
      >{{ item.emoji }}</span>
    </button>

    <Teleport to="body">
      <div
        v-if="props.rescued"
        class="GameBoard__ending"
      >
        <div class="GameBoard__endingContent">
          <p class="GameBoard__endingLabel">История с хорошим концом</p>

          <h2 class="GameBoard__endingTitle">Ещё один человек спасён</h2>

          <slot />
        </div>
      </div>
    </Teleport>
  </section>
</template>

<style scoped>
.GameBoard {
  position: relative;
  isolation: isolate;
  width: var(--game-board-width);
  height: var(--game-board-height);
  overflow: hidden;
  border-radius: 24px;
  animation: level-appear 360ms ease-out both;
}

.GameBoard__item {
  position: absolute;
  display: grid;
  width: var(--game-board-item-size);
  height: var(--game-board-item-size);
  padding: 0;
  place-items: center;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
  transform: translate(-50%, -50%) rotate(var(--game-board-item-rotation)) scale(var(--game-board-item-scale));
  -webkit-tap-highlight-color: transparent;
}

.GameBoard__emoji {
  display: block;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 42px;
  line-height: 1;
  filter:
    saturate(var(--game-board-item-saturation))
    brightness(var(--game-board-item-brightness))
    drop-shadow(0 4px 3px #00000033);
}

.GameBoard__item:enabled:hover .GameBoard__emoji {
  transform: scale(1.06);
  transition: transform 150ms ease-out;
}

.GameBoard__item:focus-visible {
  outline: 2px solid #c2d5b0;
  outline-offset: 2px;
}

.GameBoard__item_leaving {
  pointer-events: none;
  animation: item-disappear var(--game-board-item-exit) ease-in both;
}

.GameBoard__ending {
  position: fixed;
  z-index: 3;
  display: grid;
  overflow: auto;
  padding: 32px;
  place-items: center;
  background: #151a27d9;
  inset: 0;
  animation: ending-appear 300ms ease-out both;
}

.GameBoard__endingContent {
  text-align: center;
}

.GameBoard__endingLabel {
  margin: 0 0 12px;
  color: #b7c9a8;
  font-size: 12px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.GameBoard__endingTitle {
  margin: 0 0 28px;
  color: #f0eee7;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 32px;
  font-weight: 400;
}

@keyframes item-disappear {
  to {
    opacity: 0;
    transform:
      translate(-50%, -75%)
      rotate(var(--game-board-item-rotation))
      scale(calc(var(--game-board-item-scale) * 0.3));
  }
}

@keyframes level-appear {
  from {
    opacity: 0;
    transform: translateY(8px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes ending-appear {
  from {
    opacity: 0;
  }

  to {
    opacity: 1;
  }
}

@media (prefers-reduced-motion: reduce) {
  .GameBoard,
  .GameBoard__item_leaving,
  .GameBoard__ending {
    animation-duration: 1ms;
  }

  .GameBoard__item:enabled:hover .GameBoard__emoji {
    transition: none;
  }
}
</style>
