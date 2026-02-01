'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState, useMemo } from 'react';

// Layout components
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// Gaming components
import { GameCard, GameCardProps, GameCategory } from '@/components/gaming/game-card';
import { FeaturedBanner } from '@/components/gaming/featured-banner';
import { CategoryFilter, FilterCategory } from '@/components/gaming/category-filter';

// Mock games data
const mockGames: GameCardProps[] = [
  {
    id: '1',
    title: 'Pet Arena',
    description: 'Battle your pets against AI or other players for rewards',
    imageUrl: undefined,
    category: 'betting',
    status: 'live',
    playersOnline: 1247,
  },
  {
    id: '2',
    title: 'Stardust Slots',
    description: 'Try your luck with cosmic slot machines',
    imageUrl: undefined,
    category: 'arcade',
    status: 'live',
    playersOnline: 892,
  },
  {
    id: '3',
    title: 'Crypto Chess',
    description: 'Strategic chess with blockchain-verified moves',
    imageUrl: undefined,
    category: 'strategy',
    status: 'coming_soon',
  },
  {
    id: '4',
    title: 'Lucky Wheel',
    description: 'Spin the wheel daily for free rewards',
    imageUrl: undefined,
    category: 'arcade',
    status: 'live',
    playersOnline: 456,
  },
  {
    id: '5',
    title: 'Dragon Dice',
    description: 'High-stakes dice game with multipliers',
    imageUrl: undefined,
    category: 'betting',
    status: 'new',
    playersOnline: 234,
  },
  {
    id: '6',
    title: 'Yield Quest',
    description: 'Stake your tokens and embark on yield farming adventures',
    imageUrl: undefined,
    category: 'staking',
    status: 'live',
    playersOnline: 1567,
  },
  {
    id: '7',
    title: 'Premium Poker',
    description: 'Exclusive poker tables for premium members',
    imageUrl: undefined,
    category: 'premium',
    status: 'live',
    playersOnline: 89,
  },
  {
    id: '8',
    title: 'Galaxy Wars',
    description: 'Strategic space conquest game',
    imageUrl: undefined,
    category: 'strategy',
    status: 'maintenance',
  },
  {
    id: '9',
    title: 'Treasure Hunt',
    description: 'Find hidden treasures and earn NFTs',
    imageUrl: undefined,
    category: 'arcade',
    status: 'coming_soon',
  },
  {
    id: '10',
    title: 'Coin Flip',
    description: 'Simple 50/50 coin flip betting',
    imageUrl: undefined,
    category: 'betting',
    status: 'live',
    playersOnline: 678,
  },
  {
    id: '11',
    title: 'LP Staking Pro',
    description: 'Advanced liquidity pool staking with boosted rewards',
    imageUrl: undefined,
    category: 'staking',
    status: 'new',
    playersOnline: 432,
  },
  {
    id: '12',
    title: 'VIP Blackjack',
    description: 'Exclusive blackjack tables with high limits',
    imageUrl: undefined,
    category: 'premium',
    status: 'coming_soon',
  },
];

const featuredGame = {
  title: 'Pet Arena Championship',
  description: 'Join the ultimate pet battle tournament! Compete against players worldwide for massive Stardust rewards and exclusive NFT trophies.',
  imageUrl: undefined,
  category: 'betting' as GameCategory,
  status: 'live' as const,
  playersOnline: 3421,
};

export default function GamingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState<FilterCategory>('all');

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Filter games based on selected category
  const filteredGames = useMemo(() => {
    if (activeCategory === 'all') {
      return mockGames;
    }
    return mockGames.filter((game) => game.category === activeCategory);
  }, [activeCategory]);

  // Show loading while checking auth
  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const handlePlayGame = (gameId: string) => {
    console.log('Playing game:', gameId);
    // Navigate to game or open game modal
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header
        user={{
          username: session.user?.username || session.user?.name || 'User',
          avatar: session.user?.image || undefined,
        }}
      />
      <Sidebar
        activePath="/gaming"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        <div className="max-w-[1600px] mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Gaming Hub</h1>
            <p className="text-slate-400">Play games, earn rewards, and have fun</p>
          </div>

          {/* Featured Game Banner */}
          <div className="mb-8">
            <FeaturedBanner
              title={featuredGame.title}
              description={featuredGame.description}
              imageUrl={featuredGame.imageUrl}
              category={featuredGame.category}
              status={featuredGame.status}
              playersOnline={featuredGame.playersOnline}
              onPlay={() => handlePlayGame('featured')}
            />
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <CategoryFilter
              activeCategory={activeCategory}
              onChange={setActiveCategory}
            />
          </div>

          {/* Games Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredGames.map((game) => (
              <GameCard
                key={game.id}
                {...game}
                onClick={() => handlePlayGame(game.id)}
              />
            ))}
          </div>

          {/* Empty State */}
          {filteredGames.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 4a2 2 0 114 0v1a1 1 0 001 1h3a1 1 0 011 1v3a1 1 0 01-1 1h-1a2 2 0 100 4h1a1 1 0 011 1v3a1 1 0 01-1 1h-3a1 1 0 01-1-1v-1a2 2 0 10-4 0v1a1 1 0 01-1 1H7a1 1 0 01-1-1v-3a1 1 0 00-1-1H4a2 2 0 110-4h1a1 1 0 001-1V7a1 1 0 011-1h3a1 1 0 001-1V4z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-2">No games found in this category</p>
              <p className="text-sm text-slate-500">Try selecting a different category</p>
            </div>
          )}

          {/* Stats Row */}
          <div className="mt-12 grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-cyan-400">12</p>
              <p className="text-sm text-slate-400">Total Games</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-green-400">7</p>
              <p className="text-sm text-slate-400">Live Now</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-purple-400">8.2K</p>
              <p className="text-sm text-slate-400">Players Online</p>
            </div>
            <div className="p-4 rounded-xl bg-white/5 border border-white/10 text-center">
              <p className="text-2xl font-bold text-amber-400">2</p>
              <p className="text-sm text-slate-400">Coming Soon</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1023px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
