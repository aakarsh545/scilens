/**
 * Level calculation utilities for gamification
 * Formula: XP for level N = 100 × 2^(N-1)
 * This creates exponential progression:
 * - Level 1 → 2: 100 XP needed (100 total)
 * - Level 2 → 3: 200 XP needed (300 total)
 * - Level 3 → 4: 400 XP needed (700 total)
 * - Level 4 → 5: 800 XP needed (1500 total)
 */

/**
 * Calculate the current level based on total XP
 * Uses exponential progression: XP for level N = 100 × 2^(N-1)
 */
export const calculateLevel = (xp: number): number => {
  if (xp < 100) return 1;

  let level = 1;
  let xpNeeded = 100;
  let totalXP = 0;

  while (totalXP + xpNeeded <= xp) {
    totalXP += xpNeeded;
    level++;
    xpNeeded *= 2; // Double the XP needed for each level
  }

  return level;
};

/**
 * Calculate the total XP required to reach a specific level
 * Returns the cumulative XP needed
 */
export const getTotalXpForLevel = (targetLevel: number): number => {
  if (targetLevel <= 1) return 0;

  let totalXp = 0;
  let xpForLevel = 100;

  for (let i = 1; i < targetLevel; i++) {
    totalXp += xpForLevel;
    xpForLevel *= 2;
  }

  return totalXp;
};

/**
 * Calculate the XP needed to go from current level to next level
 * Returns the incremental XP required for the next level
 */
export const getXpForNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
  const totalXpForNextLevel = getTotalXpForLevel(currentLevel + 1);

  return totalXpForNextLevel - totalXpForCurrentLevel;
};

/**
 * Calculate progress percentage to next level (0-100)
 */
export const getProgressToNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
  const totalXpForNextLevel = getTotalXpForLevel(currentLevel + 1);

  const xpInCurrentLevel = currentXp - totalXpForCurrentLevel;
  const xpNeededForNextLevel = totalXpForNextLevel - totalXpForCurrentLevel;

  if (xpNeededForNextLevel === 0) return 100;

  return (xpInCurrentLevel / xpNeededForNextLevel) * 100;
};

/**
 * Calculate remaining XP needed to reach next level
 */
export const getXpRemainingToNextLevel = (currentXp: number): number => {
  const currentLevel = calculateLevel(currentXp);
  const totalXpForCurrentLevel = getTotalXpForLevel(currentLevel);
  const totalXpForNextLevel = getTotalXpForLevel(currentLevel + 1);

  return totalXpForNextLevel - currentXp;
};

/**
 * Check if a level up occurred between two XP values
 */
export const didLevelUp = (oldXp: number, newXp: number): boolean => {
  return calculateLevel(oldXp) < calculateLevel(newXp);
};
