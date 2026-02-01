import { rankingTiers, gameConfig } from '@asterbook/config';

/**
 * Calculate win probability for arena battles
 */
export function calculateWinProbability(petStage: number, petHunger: number): number {
  const { arena } = gameConfig;
  let chance = arena.baseWinChance;

  // Stage bonus: +10% per stage above 1
  if (petStage > 1) {
    chance += (petStage - 1) * arena.stageBonus;
  }

  // Hunger penalty: if hunger < 50, reduce chance
  if (petHunger < arena.hungerPenaltyThreshold) {
    const deficit = arena.hungerPenaltyThreshold - petHunger;
    const penalty = deficit * arena.hungerPenaltyFactor;
    chance -= penalty;
  }

  // Clamp between 10% and 90%
  return Math.max(arena.minWinChance, Math.min(arena.maxWinChance, chance));
}

/**
 * Calculate arena battle result
 */
export function calculateBattleResult(betAmount: number, winChance: number): {
  isWin: boolean;
  roll: number;
  fee: number;
  reward: number;
} {
  const roll = Math.random();
  const isWin = roll <= winChance;
  const fee = betAmount * gameConfig.arena.feePercent;

  let reward = 0;
  if (isWin) {
    const grossReward = betAmount * 2;
    reward = grossReward - fee;
  }

  return { isWin, roll, fee, reward };
}

/**
 * Get user rank based on stardust coins
 */
export function getUserRank(stardustCoins: number) {
  let rank: (typeof rankingTiers)[number] = rankingTiers[0]!;
  for (const tier of rankingTiers) {
    if (stardustCoins >= tier.minCoins) {
      rank = tier;
    } else {
      break;
    }
  }
  return rank;
}

/**
 * Calculate pet hunger after time elapsed
 */
export function calculateHungerDecay(currentHunger: number, lastFedAt: Date): number {
  const now = new Date();
  const diffHours = (now.getTime() - lastFedAt.getTime()) / (1000 * 60 * 60);

  if (diffHours < 1) return currentHunger;

  const decay = Math.floor(diffHours * gameConfig.pet.hungerDecayPerHour);
  return Math.max(0, currentHunger - decay);
}

/**
 * Check if pet can evolve
 */
export function canPetEvolve(stage: number, evolutionProgress: number): boolean {
  if (stage >= gameConfig.pet.maxStage) return false;
  return evolutionProgress >= gameConfig.pet.evolutionThreshold * stage;
}

/**
 * Get pet status text based on hunger
 */
export function getPetStatusText(hunger: number): string {
  if (hunger > 80) return 'Happy & Full';
  if (hunger > 50) return 'Feeling Okay';
  if (hunger > 20) return 'Hungry...';
  return 'Starving!';
}

/**
 * Get pet emoji based on stage
 */
export function getPetEmoji(stage: number): string {
  switch (stage) {
    case 1: return '🥚';
    case 2: return '🐲';
    case 3: return '🐉';
    default: return '🥚';
  }
}

/**
 * Generate current quest batch ID
 */
export function getCurrentBatchId(): string {
  const now = new Date();
  const block = Math.floor(now.getHours() / gameConfig.quests.batchDurationHours);
  const dateStr = now.toISOString().split('T')[0];
  return `${dateStr}-block-${block}`;
}

/**
 * Calculate staking rewards
 */
export function calculateStakingRewards(
  amount: number,
  apy: number,
  durationDays: number
): number {
  const dailyRate = apy / 365 / 100;
  return amount * dailyRate * durationDays;
}

/**
 * Generate a secure random string
 */
export function generateSecureToken(length: number = 32): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomValues = new Uint8Array(length);
  crypto.getRandomValues(randomValues);
  for (let i = 0; i < length; i++) {
    const val = randomValues[i];
    if (val !== undefined) {
      result += chars[val % chars.length];
    }
  }
  return result;
}

/**
 * Format number with commas
 */
export function formatNumber(num: number): string {
  return num.toLocaleString('en-US');
}

/**
 * Validate email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate username format (alphanumeric, 3-20 chars)
 */
export function isValidUsername(username: string): boolean {
  const usernameRegex = /^[a-zA-Z0-9_]{3,20}$/;
  return usernameRegex.test(username);
}

/**
 * Sanitize user input to prevent XSS
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}

/**
 * Sleep utility for async operations
 */
export function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
