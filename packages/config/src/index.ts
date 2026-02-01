// Game Configuration
export const gameConfig = {
  pet: {
    maxHunger: 100,
    hungerDecayPerHour: 5,
    feedAmount: 20,
    evolutionThreshold: 100,
    hungerCostPerFight: 5,
    maxStage: 3,
  },
  arena: {
    baseWinChance: 0.5,
    hungerPenaltyThreshold: 50,
    hungerPenaltyFactor: 0.005,
    stageBonus: 0.1,
    feePercent: 0.05,
    minWinChance: 0.1,
    maxWinChance: 0.9,
  },
  sentinel: {
    maxGainPerMinute: 10000,
    maxBalance: 1_000_000_000,
  },
  quests: {
    questsPerBatch: 6,
    batchDurationHours: 6,
  },
  staking: {
    defaultApy: 12,
    minStakeDays: 7,
    maxStakeDays: 365,
  },
  lootbox: {
    capsuleCost: 2000,
    rewards: {
      common: { chance: 60, amount: 500 },
      rare: { chance: 30, amount: 3000 },
      legendary: { chance: 10, amount: 10000 },
    },
  },
} as const;

// Ranking System (15 tiers)
export const rankingTiers = [
  { level: 1, name: 'Novice', minCoins: 0, color: '#9CA3AF' },
  { level: 2, name: 'Apprentice', minCoins: 1000, color: '#6B7280' },
  { level: 3, name: 'Journeyman', minCoins: 5000, color: '#4B5563' },
  { level: 4, name: 'Adept', minCoins: 15000, color: '#22C55E' },
  { level: 5, name: 'Expert', minCoins: 35000, color: '#16A34A' },
  { level: 6, name: 'Master', minCoins: 75000, color: '#3B82F6' },
  { level: 7, name: 'Grandmaster', minCoins: 150000, color: '#2563EB' },
  { level: 8, name: 'Champion', minCoins: 300000, color: '#8B5CF6' },
  { level: 9, name: 'Hero', minCoins: 500000, color: '#7C3AED' },
  { level: 10, name: 'Legend', minCoins: 1000000, color: '#F59E0B' },
  { level: 11, name: 'Mythic', minCoins: 2500000, color: '#D97706' },
  { level: 12, name: 'Immortal', minCoins: 5000000, color: '#EF4444' },
  { level: 13, name: 'Divine', minCoins: 10000000, color: '#DC2626' },
  { level: 14, name: 'Celestial', minCoins: 25000000, color: '#EC4899' },
  { level: 15, name: 'Ascendant', minCoins: 50000000, color: '#F472B6' },
] as const;

// Quest Types Configuration
export const questTypes = [
  { type: 'visit_whale', desc: 'Visit Whale Radar', reward: 50 },
  { type: 'check_profile', desc: 'Check your Profile', reward: 30 },
  { type: 'visit_defi', desc: 'Explore DeFi Page', reward: 40 },
  { type: 'click_buy', desc: 'Check "Buy ASTER"', reward: 60 },
  { type: 'open_tools', desc: 'Open Tools Section', reward: 30 },
  { type: 'read_story', desc: 'Read "Our Story"', reward: 40 },
  { type: 'visit_market', desc: 'Visit NFT Market', reward: 50 },
  { type: 'visit_gaming', desc: 'Check Gaming', reward: 40 },
  { type: 'visit_analytics', desc: 'Check Analytics', reward: 45 },
  { type: 'visit_asterial', desc: 'Visit Asterial', reward: 50 },
  { type: 'visit_bridge', desc: 'Check Bridge', reward: 55 },
  { type: 'visit_clash', desc: 'Visit Clash', reward: 45 },
  { type: 'visit_devhub', desc: 'Dev Hub Check', reward: 35 },
  { type: 'visit_explorer', desc: 'View Explorer', reward: 30 },
  { type: 'visit_intelligence', desc: 'Check Intelligence', reward: 50 },
  { type: 'visit_lending', desc: 'Visit Lending', reward: 45 },
  { type: 'visit_memes', desc: 'View Memes', reward: 25 },
  { type: 'visit_premium', desc: 'Premium Analysis', reward: 60 },
  { type: 'visit_world', desc: 'World Node Check', reward: 50 },
] as const;

// Blockchain Configuration
export const chainConfig = {
  bsc: {
    chainId: 56,
    name: 'BNB Smart Chain',
    rpcUrl: 'https://bsc-dataseed.binance.org/',
    explorerUrl: 'https://bscscan.com',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18,
    },
  },
  bscTestnet: {
    chainId: 97,
    name: 'BNB Smart Chain Testnet',
    rpcUrl: 'https://data-seed-prebsc-1-s1.binance.org:8545/',
    explorerUrl: 'https://testnet.bscscan.com',
    nativeCurrency: {
      name: 'tBNB',
      symbol: 'tBNB',
      decimals: 18,
    },
  },
} as const;

// API Rate Limits
export const apiRateLimits = {
  public: {
    windowMs: 60 * 1000, // 1 minute
    maxRequests: 60,
  },
  authenticated: {
    windowMs: 60 * 1000,
    maxRequests: 120,
  },
  developer: {
    windowMs: 60 * 1000,
    maxRequests: 300,
  },
} as const;

export type RankingTier = (typeof rankingTiers)[number];
export type QuestTypeConfig = (typeof questTypes)[number];
export type ChainConfig = (typeof chainConfig)[keyof typeof chainConfig];
