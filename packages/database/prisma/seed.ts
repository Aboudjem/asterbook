import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting seed...');

  // Clear existing data (order matters for foreign keys)
  try {
    await prisma.chatMessage.deleteMany();
    await prisma.chatParticipant.deleteMany();
    await prisma.chatRoom.deleteMany();
  } catch { /* tables may not exist */ }

  try {
    await prisma.sentinelAlert.deleteMany();
    await prisma.sentinelSnapshot.deleteMany();
    await prisma.apiUsage.deleteMany();
    await prisma.apiKey.deleteMany();
    await prisma.marketplacePurchase.deleteMany();
    await prisma.marketplaceComponent.deleteMany();
    await prisma.dailyQuest.deleteMany();
    await prisma.stakingVault.deleteMany();
    await prisma.arenaBattle.deleteMany();
    await prisma.arenaLobby.deleteMany();
    await prisma.userInventory.deleteMany();
    await prisma.userPet.deleteMany();
    await prisma.userBalance.deleteMany();
    await prisma.asterPredictionVote.deleteMany();
    await prisma.userPromoUsage.deleteMany();
    await prisma.user.deleteMany();
    await prisma.shopItem.deleteMany();
    await prisma.promoCode.deleteMany();
  } catch { /* tables may not exist */ }

  console.log('🗑️ Cleared existing data');

  // Hash passwords
  const testPassword = await bcrypt.hash('testpassword123', 12);
  const adminPassword = await bcrypt.hash('admin123', 12);

  // Create test users
  const users = await Promise.all([
    prisma.user.create({
      data: {
        username: 'admin',
        email: 'admin@asterbook.com',
        password: adminPassword,
        isPremium: true,
        stardustCoins: BigInt(100000),
        totalOnlineTime: BigInt(360000), // 100 hours
        avatar: '/assets/images/avatars/admin.png',
        bio: 'Asterbook Administrator',
        balance: { create: { balance: 50000 } },
        pet: {
          create: {
            petType: 'dragon_adult',
            stage: 3,
            hunger: 85,
            evolutionProgress: 100,
            rarity: 'legendary',
            element: 'fire',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'testuser',
        email: 'test@asterbook.com',
        password: testPassword,
        isPremium: true,
        stardustCoins: BigInt(12450),
        totalOnlineTime: BigInt(9240), // ~2.5 hours
        avatar: '/assets/images/avatars/default.png',
        bio: 'Just exploring the cosmos!',
        balance: { create: { balance: 4827.52 } },
        pet: {
          create: {
            petType: 'dragon_baby',
            stage: 2,
            hunger: 72,
            evolutionProgress: 45,
            rarity: 'rare',
            element: 'ice',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'whale_hunter',
        email: 'whale@asterbook.com',
        password: testPassword,
        isPremium: true,
        stardustCoins: BigInt(500000),
        totalOnlineTime: BigInt(720000), // 200 hours
        wallet: '0x742d35Cc6634C0532925a3b844Bc9e7595f8fE',
        bio: 'Chasing the big fish 🐋',
        balance: { create: { balance: 250000 } },
        pet: {
          create: {
            petType: 'dragon_adult',
            stage: 3,
            hunger: 95,
            evolutionProgress: 100,
            rarity: 'mythic',
            element: 'void',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'crypto_kid',
        email: 'crypto@asterbook.com',
        password: testPassword,
        isPremium: false,
        stardustCoins: BigInt(2500),
        totalOnlineTime: BigInt(3600),
        bio: 'New to crypto, learning every day!',
        balance: { create: { balance: 1000 } },
        pet: {
          create: {
            petType: 'dragon_egg',
            stage: 1,
            hunger: 50,
            evolutionProgress: 10,
            rarity: 'common',
            element: 'earth',
          },
        },
      },
    }),
    prisma.user.create({
      data: {
        username: 'defi_queen',
        email: 'defi@asterbook.com',
        password: testPassword,
        isPremium: true,
        stardustCoins: BigInt(75000),
        totalOnlineTime: BigInt(180000),
        wallet: '0x8ba1f109551bD432803012645Hac136Ddc82',
        bio: 'DeFi enthusiast | Yield farmer | WAGMI',
        balance: { create: { balance: 85000 } },
        pet: {
          create: {
            petType: 'dragon_baby',
            stage: 2,
            hunger: 60,
            evolutionProgress: 75,
            rarity: 'epic',
            element: 'lightning',
          },
        },
      },
    }),
  ]);

  console.log(`👥 Created ${users.length} users`);

  // Create shop items
  const shopItems = await prisma.shopItem.createMany({
    data: [
      // Banners
      { name: 'Cosmic Nebula Banner', description: 'A stunning animated nebula background', price: 500, category: 'banner', imageUrl: '/assets/images/banners/cosmic.png', isAnimated: true },
      { name: 'Golden Dragon Banner', description: 'Show off your legendary status', price: 1000, category: 'banner', imageUrl: '/assets/images/banners/dragon.png', isAnimated: true, minRankLevel: 5 },
      { name: 'Ocean Waves Banner', description: 'Peaceful animated ocean', price: 300, category: 'banner', imageUrl: '/assets/images/banners/ocean.png', isAnimated: true },

      // Borders
      { name: 'Fire Border', description: 'Burning flames around your avatar', price: 250, category: 'border', imageUrl: '/assets/images/borders/fire.png', isAnimated: true },
      { name: 'Crystal Border', description: 'Elegant crystal frame', price: 150, category: 'border', imageUrl: '/assets/images/borders/crystal.png', isAnimated: false },
      { name: 'Rainbow Border', description: 'Colorful shifting rainbow', price: 400, category: 'border', imageUrl: '/assets/images/borders/rainbow.png', isAnimated: true },

      // Name Effects
      { name: 'Glowing Text', description: 'Your name glows softly', price: 200, category: 'name_effect', imageUrl: '/assets/images/effects/glow.png', isAnimated: true },
      { name: 'Rainbow Text', description: 'Color-shifting rainbow name', price: 350, category: 'name_effect', imageUrl: '/assets/images/effects/rainbow.png', isAnimated: true },
      { name: 'Fire Text', description: 'Burning letters', price: 450, category: 'name_effect', imageUrl: '/assets/images/effects/fire.png', isAnimated: true, minRankLevel: 3 },

      // Pet Food
      { name: 'Basic Pet Food', description: 'Restores 20 hunger', price: 50, category: 'pet_food', imageUrl: '/assets/images/items/food_basic.png', isAnimated: false },
      { name: 'Premium Pet Food', description: 'Restores 50 hunger', price: 100, category: 'pet_food', imageUrl: '/assets/images/items/food_premium.png', isAnimated: false },
      { name: 'Golden Pet Food', description: 'Restores 100 hunger + XP boost', price: 250, category: 'pet_food', imageUrl: '/assets/images/items/food_golden.png', isAnimated: true },
    ],
  });

  console.log(`🛒 Created ${shopItems.count} shop items`);

  // Create staking vaults for testuser
  const testUser = users[1];
  await prisma.stakingVault.createMany({
    data: [
      {
        userId: testUser.id,
        amount: 5000,
        apy: 12,
        durationDays: 30,
        startTime: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // 7 days ago
        endTime: new Date(Date.now() + 23 * 24 * 60 * 60 * 1000), // 23 days from now
        status: 'active',
      },
      {
        userId: testUser.id,
        amount: 10000,
        apy: 25,
        durationDays: 90,
        startTime: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000),
        endTime: new Date(Date.now() + 60 * 24 * 60 * 60 * 1000),
        status: 'active',
      },
    ],
  });

  console.log('📈 Created staking vaults');

  // Create daily quests
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  await prisma.dailyQuest.createMany({
    data: [
      {
        userId: testUser.id,
        questType: 'arena_battle',
        description: 'Win 3 arena battles',
        targetCount: 3,
        currentProgress: 1,
        rewardAmount: 100,
        status: 'active',
        dateAssigned: today,
        batchId: `${today.toISOString().split('T')[0]}-batch1`,
      },
      {
        userId: testUser.id,
        questType: 'feed_pet',
        description: 'Feed your pet 2 times',
        targetCount: 2,
        currentProgress: 2,
        rewardAmount: 50,
        status: 'completed',
        dateAssigned: today,
        batchId: `${today.toISOString().split('T')[0]}-batch1`,
      },
      {
        userId: testUser.id,
        questType: 'staking',
        description: 'Create a staking vault',
        targetCount: 1,
        currentProgress: 0,
        rewardAmount: 75,
        status: 'active',
        dateAssigned: today,
        batchId: `${today.toISOString().split('T')[0]}-batch1`,
      },
    ],
  });

  console.log('📋 Created daily quests');

  // Create arena battles history
  const testUserPet = await prisma.userPet.findUnique({ where: { userId: testUser.id } });
  if (testUserPet) {
    await prisma.arenaBattle.createMany({
      data: [
        {
          userId: testUser.id,
          petId: testUserPet.id,
          betAmount: 100,
          feeAmount: 5,
          winChance: 65.5,
          result: 'win',
          rewardAmount: 190,
          createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
        },
        {
          userId: testUser.id,
          petId: testUserPet.id,
          betAmount: 200,
          feeAmount: 10,
          winChance: 55.0,
          result: 'lose',
          rewardAmount: 0,
          createdAt: new Date(Date.now() - 4 * 60 * 60 * 1000),
        },
        {
          userId: testUser.id,
          petId: testUserPet.id,
          betAmount: 150,
          feeAmount: 7.5,
          winChance: 70.2,
          result: 'win',
          rewardAmount: 285,
          createdAt: new Date(Date.now() - 6 * 60 * 60 * 1000),
        },
      ],
    });
  }

  console.log('⚔️ Created arena battle history');

  // Create marketplace components
  await prisma.marketplaceComponent.createMany({
    data: [
      {
        userId: users[0].id,
        title: 'Glassmorphism Card Component',
        description: 'Beautiful frosted glass card with hover effects',
        price: 150,
        category: 'ui',
        codeSnippet: '.glass-card { backdrop-filter: blur(10px); background: rgba(255,255,255,0.1); }',
        demoHtml: '<div class="glass-card">Content</div>',
        demoCss: '.glass-card { padding: 20px; border-radius: 16px; }',
      },
      {
        userId: users[2].id,
        title: 'Animated Price Ticker',
        description: 'Real-time crypto price ticker with animations',
        price: 300,
        category: 'widget',
        codeSnippet: 'const ticker = new PriceTicker({symbols: ["BTC", "ETH"]});',
      },
      {
        userId: users[4].id,
        title: 'DeFi Yield Calculator',
        description: 'Calculate APY and compound interest',
        price: 200,
        category: 'tool',
        codeSnippet: 'function calculateAPY(principal, rate, time) { return principal * Math.pow(1 + rate/100, time); }',
      },
    ],
  });

  console.log('🏪 Created marketplace components');

  // Create promo codes
  await prisma.promoCode.createMany({
    data: [
      {
        code: 'WELCOME2024',
        rewardType: 'stardust',
        rewardAmount: 500,
        maxUses: 1000,
        currentUses: 127,
        expiresAt: new Date(Date.now() + 90 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'PREMIUM50',
        rewardType: 'premium_days',
        rewardAmount: 7,
        maxUses: 500,
        currentUses: 89,
        expiresAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
        isActive: true,
      },
      {
        code: 'ARENA100',
        rewardType: 'stardust',
        rewardAmount: 100,
        maxUses: null,
        currentUses: 342,
        expiresAt: null,
        isActive: true,
      },
    ],
  });

  console.log('🎁 Created promo codes');

  console.log('✅ Seed completed successfully!');
  console.log('');
  console.log('Test accounts:');
  console.log('  📧 test@asterbook.com / testpassword123');
  console.log('  📧 admin@asterbook.com / admin123');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
