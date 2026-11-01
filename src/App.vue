<script setup lang="ts">
import { computed, ref, watch, type CSSProperties } from 'vue';
import { backgrounds } from '@/assets/backgrounds/config';
import GameBoard from '@/game/components/GameBoard/GameBoard.vue';
import { animationDurations, boardLayout } from '@/game/config';
import { useGame } from '@/game/useGame';

defineOptions({
  inheritAttrs: false,
});

const {
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
} = useGame();

const background = ref('');

watch(levelId, () => {
  const alternatives = backgrounds.filter((url) => url !== background.value);
  const choices = alternatives.length > 0 ? alternatives : backgrounds;

  background.value = choices[Math.floor(Math.random() * choices.length)];
}, { immediate: true });

const appStyle = computed<CSSProperties>(() => ({
  '--app-width': `${boardLayout.width}px`,
  '--app-rescue-duration': `${animationDurations.rescue}ms`,
  '--app-background': `url("${background.value}")`,
}));

const characterEmoji = computed(() => isRescued.value ? level.value.character.emoji : '👻');
const characterLabel = computed(() => isRescued.value ? level.value.character.name : 'Призрак');

const characterClass = computed(() => ({
  App__character_rescuing: phase.value === 'rescuing',
  App__character_rescued: isRescued.value,
}));

const message = computed(() => {
  if (phase.value === 'rescuing') {
    return 'Кажется, я что-то вспоминаю…';
  }

  return isRescued.value ? level.value.thanks : level.value.request;
});
</script>

<template>
  <main
    v-bind="$attrs"
    class="App"
    :style="appStyle"
  >
    <header class="App__header">
      <div class="App__headerContent">
        <div>
          <h1 class="App__title">Ghost <span class="App__ampersand">&amp;</span> Found</h1>

          <p class="App__subtitle">У каждой потерянной вещи есть своя история</p>
        </div>

        <div class="App__counters">
          <p
            class="App__counter"
            aria-live="polite"
            aria-atomic="true"
          >
            <span class="App__counterLabel">Уже спасено:</span>

            <strong class="App__savedCount">{{ savedCount }}</strong>
          </p>

          <p
            class="App__counter"
            aria-live="polite"
            aria-atomic="true"
          >
            <span class="App__counterLabel">Найдено:</span>

            <strong>{{ foundCount }} <span class="App__counterDivider">/ {{ targetCount }}</span></strong>
          </p>
        </div>
      </div>
    </header>

    <div class="App__content">
      <GameBoard
        :key="levelId"
        :items="visibleItems"
        :collecting-emojis="collectingEmojis"
        :locked="isBoardLocked"
        :rescued="isRescued"
        @find-item="collectItem"
      >
        <button
          class="App__next"
          type="button"
          @click="startNextLevel"
        >
          Спасти следующего <span aria-hidden="true">→</span>
        </button>
      </GameBoard>

      <section
        class="App__mission"
        aria-label="Просьба о помощи и список вещей"
      >
        <div class="App__visitor">
          <span
            class="App__character"
            :class="characterClass"
            role="img"
            :aria-label="characterLabel"
          >{{ characterEmoji }}</span>

          <p
            class="App__speech"
            role="status"
          >{{ message }}</p>
        </div>

        <div class="App__wanted">
          <h2 class="App__wantedTitle">Нужно найти</h2>

          <ul
            v-if="remainingTargets.length"
            class="App__targetList"
            aria-label="Потерянные вещи"
          >
            <li
              v-for="item in remainingTargets"
              :key="item.emoji"
              class="App__target"
              :title="item.name"
            >
              <span
                role="img"
                :aria-label="item.name"
              >{{ item.emoji }}</span>
            </li>
          </ul>

          <p
            v-else
            class="App__allFound"
          >Все вещи на месте</p>
        </div>
      </section>
    </div>
  </main>
</template>

<style scoped>
.App {
  min-height: 100vh;
  padding-bottom: 24px;
  background-color: #141720;
  background-image: linear-gradient(#0e111b33, #0e111b59), var(--app-background);
  background-repeat: no-repeat;
  background-position: center;
  background-size: cover;
}

.App__content {
  width: var(--app-width);
  margin: 0 auto;
}

.App__header {
  margin-bottom: 26px;
  padding: 24px;
  background: #141720b3;
}

.App__headerContent {
  display: flex;
  width: var(--app-width);
  margin: 0 auto;
  padding: 0 20px;
  align-items: center;
  justify-content: space-between;
  gap: 24px;
}

.App__title {
  margin: 0;
  color: #f0eee7;
  font-family: Georgia, 'Times New Roman', serif;
  font-size: 36px;
  font-weight: 400;
  letter-spacing: -0.04em;
  line-height: 1.2;
}

.App__ampersand {
  color: #b7c9a8;
  font-style: italic;
}

.App__subtitle {
  margin: 8px 0 0;
  color: #9b9fac;
  font-size: 13px;
}

.App__counters {
  display: flex;
  gap: 28px;
}

.App__counter {
  display: flex;
  margin: 0;
  align-items: center;
  gap: 10px;
  font-size: 23px;
  font-variant-numeric: tabular-nums;
}

.App__counterLabel {
  color: #aeb2c0;
  font-size: 13px;
}

.App__savedCount {
  color: #c2d5b0;
}

.App__counterDivider {
  color: #8b91a3;
  font-size: 17px;
  font-weight: 400;
}

.App__mission {
  display: flex;
  margin-top: 24px;
  padding: 16px 20px;
  align-items: center;
  justify-content: space-between;
  gap: 36px;
}

.App__visitor {
  display: flex;
  width: 540px;
  align-items: center;
  gap: 20px;
}

.App__character {
  display: grid;
  width: 90px;
  height: 96px;
  flex: 0 0 auto;
  place-items: center;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 70px;
  line-height: 1;
  filter: drop-shadow(0 6px 16px #bbb4e01f);
}

.App__character_rescuing {
  animation: ghost-rescue var(--app-rescue-duration) ease-in-out both;
}

.App__character_rescued {
  animation: human-appear 360ms ease-out both;
}

.App__speech {
  position: relative;
  display: flex;
  min-height: 82px;
  margin: 0;
  padding: 16px 20px;
  flex: 1;
  align-items: center;
  border: 1px solid #353746;
  border-radius: 18px;
  background: #20232fd9;
  color: #dddde5;
  font-size: 15px;
  line-height: 1.6;
}

.App__speech::before {
  position: absolute;
  top: 30px;
  left: -6px;
  width: 10px;
  height: 10px;
  border-bottom: 1px solid #353746;
  border-left: 1px solid #353746;
  background: #20232fd9;
  content: '';
  transform: rotate(45deg);
}

.App__wanted {
  min-width: 360px;
}

.App__wantedTitle {
  margin: 0 0 10px;
  color: #aeb2c0;
  font-size: 11px;
  font-weight: 500;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.App__targetList {
  display: flex;
  min-height: 60px;
  margin: 0;
  padding: 0;
  gap: 10px;
  list-style: none;
}

.App__target {
  display: grid;
  width: 60px;
  height: 60px;
  place-items: center;
  border: 1px solid #3b3f4a;
  border-radius: 14px;
  background: #242833d9;
  font-family: 'Apple Color Emoji', 'Segoe UI Emoji', 'Noto Color Emoji', sans-serif;
  font-size: 32px;
  line-height: 1;
}

.App__allFound {
  display: flex;
  min-height: 60px;
  margin: 0;
  align-items: center;
  color: #c2d5b0;
  font-size: 15px;
}

.App__next {
  display: inline-flex;
  min-height: 52px;
  padding: 14px 24px;
  align-items: center;
  gap: 24px;
  border: 1px solid #d3dfc8;
  border-radius: 12px;
  background: #c1d2b2;
  color: #222d26;
  font: inherit;
  font-weight: 600;
  cursor: pointer;
}

.App__next:hover {
  background: #d0dfc3;
}

.App__next:focus-visible {
  outline: 2px solid #f0eee7;
  outline-offset: 5px;
}

@keyframes ghost-rescue {
  40% {
    filter: brightness(1.5) drop-shadow(0 0 22px #c2d5b0);
    transform: translateY(-8px) scale(1.1);
  }

  100% {
    opacity: 0;
    filter: brightness(2) drop-shadow(0 0 30px #c2d5b0);
    transform: translateY(-12px) scale(0.7);
  }
}

@keyframes human-appear {
  from {
    opacity: 0;
    transform: scale(0.7);
  }

  to {
    opacity: 1;
    transform: scale(1);
  }
}

@media (prefers-reduced-motion: reduce) {
  .App__character_rescuing,
  .App__character_rescued {
    animation: none;
  }
}
</style>
