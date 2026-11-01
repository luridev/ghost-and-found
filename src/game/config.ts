export const boardLayout = {
  width: 1000,
  height: 600,
  padding: 24,
  itemSize: 64,
  maxRotation: 60,
  verticalExponent: 0.4,
};

export const itemScales = {
  target: { min: 0.7, max: 1.5 },
  distraction: { min: 0.5, max: 1.5 },
  largeDistraction: { min: 1.5, max: 2.3 },
  largeDistractionChance: 0.2,
};

export const itemFilters = {
  saturation: { min: 0.3, max: 0.75 },
  brightness: { min: 0.5, max: 0.85 },
};

export const levelLimits = {
  minTargets: 3,
  maxTargets: 5,
  minDistractions: 35,
  maxDistractions: 65,
};

export const animationDurations = {
  itemExit: 240,
  rescue: 720,
};

export const savedCountStorageKey = 'ghost-and-found.saved-count';
