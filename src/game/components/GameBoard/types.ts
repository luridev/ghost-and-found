import type { PlacedItem } from '@/game/types';

export type GameBoardProps = {
  items: Array<PlacedItem>;
  collectingEmojis: ReadonlySet<string>;
  locked: boolean;
  rescued: boolean;
};

export type GameBoardEmits = {
  findItem: [emoji: string];
};
