export type GameItem = {
  emoji: string;
  name: string;
};

export type PlacedItem = GameItem & {
  x: number;
  y: number;
  rotation: number;
  scale: number;
  saturation: number;
  brightness: number;
  isTarget: boolean;
};

export type Character = {
  emoji: string;
  name: string;
};

export type Level = {
  character: Character;
  request: string;
  thanks: string;
  targets: Array<GameItem>;
  items: Array<PlacedItem>;
};

export type GamePhase = 'searching' | 'rescuing' | 'rescued';
