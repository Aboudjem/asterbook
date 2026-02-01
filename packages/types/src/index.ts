// User Types
export interface User {
  id: number;
  username: string;
  email: string;
  avatar?: string;
  profileBanner?: string;
  bio?: string;
  socialDiscord?: string;
  socialTwitter?: string;
  socialPortfolio?: string;
  wallet?: string;
  isPremium: boolean;
  premiumExpiresAt?: Date;
  stardustCoins: number;
  totalOnlineTime: number;
  lastSeen?: Date;
  isFrozen: boolean;
  createdAt: Date;
}

export interface UserPet {
  id: number;
  userId: number;
  petType: string;
  stage: 1 | 2 | 3;
  hunger: number;
  evolutionProgress: number;
  rarity?: string;
  element?: string;
  expeditionStatus?: 'idle' | 'exploring' | 'returning';
  expeditionEnd?: Date;
  lastFed: Date;
  createdAt: Date;
}

// Arena Types
export interface ArenaBattle {
  id: number;
  userId: number;
  petId: number;
  betAmount: number;
  feeAmount: number;
  winChance: number;
  result: 'win' | 'loss';
  rewardAmount: number;
  createdAt: Date;
}

export interface ArenaLobby {
  id: number;
  creatorId: number;
  joinerId?: number;
  betAmount: number;
  status: 'waiting' | 'matched' | 'completed' | 'cancelled';
  winnerId?: number;
  createdAt: Date;
}

// Staking Types
export interface StakingVault {
  id: number;
  userId: number;
  amount: number;
  apy: number;
  durationDays: number;
  status: 'active' | 'completed' | 'withdrawn';
  stakedAt: Date;
  unlocksAt: Date;
}

// Shop Types
export interface ShopItem {
  id: number;
  name: string;
  description?: string;
  price: number;
  imageUrl?: string;
  category: 'banner' | 'border' | 'name_effect' | 'consumable';
  isAnimated: boolean;
  minRankLevel: number;
}

export interface UserInventory {
  id: number;
  userId: number;
  itemId: number;
  acquiredAt: Date;
}

// Quest Types
export type QuestType =
  | 'visit_whale'
  | 'check_profile'
  | 'visit_defi'
  | 'click_buy'
  | 'open_tools'
  | 'read_story'
  | 'visit_market'
  | 'visit_gaming'
  | 'visit_analytics'
  | 'visit_asterial'
  | 'visit_bridge'
  | 'visit_clash'
  | 'visit_devhub'
  | 'visit_explorer'
  | 'visit_intelligence'
  | 'visit_lending'
  | 'visit_memes'
  | 'visit_premium'
  | 'visit_world';

export interface DailyQuest {
  id: number;
  userId: number;
  questType: QuestType;
  description: string;
  targetCount: number;
  currentProgress: number;
  rewardAmount: number;
  status: 'active' | 'completed';
  dateAssigned: Date;
  batchId: string;
}

// Marketplace Types
export interface MarketplaceComponent {
  id: number;
  userId: number;
  title: string;
  description?: string;
  price: number;
  category?: string;
  codeSnippet?: string;
  demoHtml?: string;
  demoCss?: string;
  demoJs?: string;
  createdAt: Date;
}

export interface MarketplacePurchase {
  id: number;
  buyerId: number;
  componentId: number;
  pricePaid: number;
  licenseKey: string;
  purchasedAt: Date;
}

// Developer API Types
export interface ApiKey {
  id: number;
  userId: number;
  apiKey: string;
  apiKeyHash: string;
  name: string;
  status: 'active' | 'revoked';
  createdAt: Date;
  lastUsedAt?: Date;
}

export interface ApiUsage {
  id: number;
  apiKeyId: number;
  endpoint: string;
  method: string;
  cost: number;
  createdAt: Date;
}

// Security Types
export interface SentinelSnapshot {
  userId: number;
  lastBalance: number;
  lastCheckTime: Date;
}

export interface SentinelAlert {
  id: number;
  userId: number;
  ruleName: 'HIGH_VELOCITY' | 'BALANCE_OVERFLOW';
  details: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  createdAt: Date;
}

// Chat Types
export interface ChatConversation {
  id: number;
  type: 'direct' | 'group';
  createdAt: Date;
}

export interface ChatParticipant {
  id: number;
  conversationId: number;
  userId: number;
  joinedAt: Date;
}

export interface ChatMessage {
  id: number;
  conversationId: number;
  senderId: number;
  message: string;
  createdAt: Date;
}

// Auth Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  accessToken: string;
  user: Omit<User, 'password'>;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

// Game Constants
export const PET_CONSTANTS = {
  MAX_HUNGER: 100,
  HUNGER_DECAY_PER_HOUR: 5,
  FEED_AMOUNT: 20,
  EVOLUTION_THRESHOLD: 100,
  HUNGER_COST_PER_FIGHT: 5,
} as const;

export const ARENA_CONSTANTS = {
  BASE_WIN_CHANCE: 0.5,
  HUNGER_PENALTY_THRESHOLD: 50,
  HUNGER_PENALTY_FACTOR: 0.005,
  STAGE_BONUS: 0.1,
  FEE_PERCENT: 0.05,
} as const;

export const SENTINEL_CONSTANTS = {
  MAX_GAIN_PER_MINUTE: 10000,
  MAX_BALANCE: 1_000_000_000,
} as const;
