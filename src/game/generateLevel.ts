import { boardLayout, itemFilters, itemScales, levelLimits } from '@/game/config';
import { characters, items, requests, thanks } from '@/game/data';
import type { Level } from '@/game/types';

function randomInteger(min: number, max: number): number {
  return min + Math.floor(Math.random() * (max - min + 1));
}

function randomFloat(min: number, max: number): number {
  return min + Math.random() * (max - min);
}

function shuffle<T>(values: ReadonlyArray<T>): Array<T> {
  const shuffled = [...values];

  for (let index = shuffled.length - 1; index > 0; index -= 1) {
    const otherIndex = randomInteger(0, index);

    [shuffled[index], shuffled[otherIndex]] = [shuffled[otherIndex], shuffled[index]];
  }

  return shuffled;
}

export function generateLevel(): Level {
  const targetCount = randomInteger(levelLimits.minTargets, levelLimits.maxTargets);
  const distractionCount = randomInteger(levelLimits.minDistractions, levelLimits.maxDistractions);
  const selected = shuffle(items).slice(0, targetCount + distractionCount);

  const placedItems = selected.map((item, index) => {
    const isTarget = index < targetCount;
    let scaleRange = itemScales.target;

    if (!isTarget) {
      scaleRange = Math.random() < itemScales.largeDistractionChance
        ? itemScales.largeDistraction
        : itemScales.distraction;
    }

    const scale = randomFloat(scaleRange.min, scaleRange.max);
    const rotation = randomInteger(-boardLayout.maxRotation, boardLayout.maxRotation);
    const radians = rotation * Math.PI / 180;
    const halfSize = boardLayout.itemSize * scale / 2;
    // Keep the rotated, scaled button inside the board, with room for focus and shadows.
    const inset = boardLayout.padding + halfSize * (Math.abs(Math.cos(radians)) + Math.abs(Math.sin(radians)));

    return {
      ...item,
      x: randomFloat(inset, boardLayout.width - inset),
      y: inset + Math.random() ** boardLayout.verticalExponent * (boardLayout.height - inset * 2),
      rotation,
      scale,
      saturation: randomFloat(itemFilters.saturation.min, itemFilters.saturation.max),
      brightness: randomFloat(itemFilters.brightness.min, itemFilters.brightness.max),
      isTarget,
    };
  });

  return {
    character: characters[randomInteger(0, characters.length - 1)],
    request: requests[randomInteger(0, requests.length - 1)],
    thanks: thanks[randomInteger(0, thanks.length - 1)],
    targets: selected.slice(0, targetCount),
    items: shuffle(placedItems),
  };
}
