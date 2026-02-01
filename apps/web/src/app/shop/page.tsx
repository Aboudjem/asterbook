'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Layout components
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// UI components
import { GlassCard } from '@/components/ui/glass-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { cn } from '@/lib/utils';

type ShopCategory = 'all' | 'borders' | 'effects' | 'capsules' | 'boosts' | 'premium';

interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  category: Exclude<ShopCategory, 'all'>;
  rarity: 'common' | 'uncommon' | 'rare' | 'epic' | 'legendary';
  imageUrl?: string;
  isNew?: boolean;
  discount?: number;
}

const shopItems: ShopItem[] = [
  // Borders
  { id: 'b1', name: 'Neon Glow', description: 'Bright neon border effect', price: 1500, category: 'borders', rarity: 'uncommon' },
  { id: 'b2', name: 'Fire Ring', description: 'Animated fire border', price: 2000, category: 'borders', rarity: 'rare', isNew: true },
  { id: 'b3', name: 'Ice Crystal', description: 'Frozen crystal border', price: 2000, category: 'borders', rarity: 'rare' },
  { id: 'b4', name: 'Galaxy Swirl', description: 'Cosmic galaxy border', price: 3500, category: 'borders', rarity: 'epic' },
  { id: 'b5', name: 'Cosmic Legendary', description: 'Ultimate animated border', price: 10000, category: 'borders', rarity: 'legendary' },

  // Effects
  { id: 'e1', name: 'Glitch Effect', description: 'Cyberpunk glitch animation', price: 2000, category: 'effects', rarity: 'rare' },
  { id: 'e2', name: 'Matrix Rain', description: 'Digital matrix effect', price: 2500, category: 'effects', rarity: 'rare' },
  { id: 'e3', name: 'Thunder Strike', description: 'Electric thunder effect', price: 3000, category: 'effects', rarity: 'epic', isNew: true },
  { id: 'e4', name: 'Hologram', description: 'Futuristic hologram effect', price: 7500, category: 'effects', rarity: 'epic' },
  { id: 'e5', name: 'Royal Crown', description: 'Majestic royal effect', price: 10000, category: 'effects', rarity: 'legendary' },

  // Capsules
  { id: 'c1', name: 'Common Capsule', description: 'Contains common items', price: 500, category: 'capsules', rarity: 'common' },
  { id: 'c2', name: 'Rare Capsule', description: 'Contains rare items', price: 2000, category: 'capsules', rarity: 'rare' },
  { id: 'c3', name: 'Epic Capsule', description: 'Contains epic items', price: 5000, category: 'capsules', rarity: 'epic', discount: 20 },
  { id: 'c4', name: 'Legendary Capsule', description: 'Contains legendary items', price: 15000, category: 'capsules', rarity: 'legendary' },

  // Boosts
  { id: 'bo1', name: 'XP Boost (1h)', description: '2x XP for 1 hour', price: 200, category: 'boosts', rarity: 'common' },
  { id: 'bo2', name: 'XP Boost (24h)', description: '2x XP for 24 hours', price: 1000, category: 'boosts', rarity: 'uncommon' },
  { id: 'bo3', name: 'Stardust Boost', description: '1.5x Stardust earnings', price: 1500, category: 'boosts', rarity: 'rare' },
  { id: 'bo4', name: 'Lucky Charm', description: 'Increased drop rates', price: 3000, category: 'boosts', rarity: 'epic', isNew: true },

  // Premium
  { id: 'p1', name: 'Premium Pass (Month)', description: 'All premium features for 30 days', price: 5000, category: 'premium', rarity: 'epic' },
  { id: 'p2', name: 'Premium Pass (Year)', description: 'All premium features for 365 days', price: 40000, category: 'premium', rarity: 'legendary', discount: 30 },
];

const rarityColors: Record<ShopItem['rarity'], { bg: string; text: string; border: string }> = {
  common: { bg: 'bg-slate-500/20', text: 'text-slate-400', border: 'border-slate-500/30' },
  uncommon: { bg: 'bg-green-500/20', text: 'text-green-400', border: 'border-green-500/30' },
  rare: { bg: 'bg-blue-500/20', text: 'text-blue-400', border: 'border-blue-500/30' },
  epic: { bg: 'bg-purple-500/20', text: 'text-purple-400', border: 'border-purple-500/30' },
  legendary: { bg: 'bg-amber-500/20', text: 'text-amber-400', border: 'border-amber-500/30' },
};

const categoryIcons: Record<ShopCategory, React.ReactNode> = {
  all: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
    </svg>
  ),
  borders: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
    </svg>
  ),
  effects: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
    </svg>
  ),
  capsules: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 7l-8-4-8 4m16 0l-8 4m8-4v10l-8 4m0-10L4 7m8 4v10M4 7v10l8 4" />
    </svg>
  ),
  boosts: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  premium: (
    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
    </svg>
  ),
};

export default function ShopPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState<ShopCategory>('all');
  const [stardustBalance] = useState(12450);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const filteredItems = activeCategory === 'all'
    ? shopItems
    : shopItems.filter((item) => item.category === activeCategory);

  const handlePurchase = (item: ShopItem) => {
    console.log('Purchasing:', item.name);
    // Purchase logic here
  };

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

  const categories: { id: ShopCategory; label: string }[] = [
    { id: 'all', label: 'All Items' },
    { id: 'borders', label: 'Borders' },
    { id: 'effects', label: 'Effects' },
    { id: 'capsules', label: 'Capsules' },
    { id: 'boosts', label: 'Boosts' },
    { id: 'premium', label: 'Premium' },
  ];

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
        activePath="/shop"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        <div className="max-w-[1600px] mx-auto">
          {/* Header Section */}
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Shop</h1>
              <p className="text-slate-400">Customize your profile with unique items</p>
            </div>

            {/* Stardust Balance */}
            <GlassCard className="px-6 py-4 flex items-center gap-4" hover={false}>
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-amber-400 to-amber-600 flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div>
                <p className="text-sm text-slate-400">Your Balance</p>
                <p className="text-2xl font-bold text-amber-400">{stardustBalance.toLocaleString()} SD</p>
              </div>
            </GlassCard>
          </div>

          {/* Category Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200',
                  activeCategory === category.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                )}
              >
                {categoryIcons[category.id]}
                <span>{category.label}</span>
              </button>
            ))}
          </div>

          {/* Items Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredItems.map((item) => {
              const rarity = rarityColors[item.rarity];
              const discountedPrice = item.discount
                ? Math.floor(item.price * (1 - item.discount / 100))
                : item.price;
              const canAfford = stardustBalance >= discountedPrice;

              return (
                <GlassCard key={item.id} className="overflow-hidden">
                  {/* Item Preview */}
                  <div className={cn(
                    'aspect-square flex items-center justify-center relative',
                    rarity.bg
                  )}>
                    {/* Category Icon */}
                    <div className={cn('w-16 h-16 rounded-2xl flex items-center justify-center', rarity.bg, rarity.border, 'border')}>
                      {categoryIcons[item.category]}
                    </div>

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex gap-2">
                      {item.isNew && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                          NEW
                        </span>
                      )}
                      {item.discount && (
                        <span className="px-2 py-1 rounded-full text-xs font-medium bg-red-500/20 text-red-400 border border-red-500/30">
                          -{item.discount}%
                        </span>
                      )}
                    </div>

                    {/* Rarity Badge */}
                    <div className="absolute top-3 right-3">
                      <span className={cn(
                        'px-2 py-1 rounded-full text-xs font-medium capitalize',
                        rarity.bg, rarity.text, rarity.border, 'border'
                      )}>
                        {item.rarity}
                      </span>
                    </div>
                  </div>

                  {/* Item Info */}
                  <div className="p-4">
                    <h3 className="text-lg font-semibold text-white mb-1">{item.name}</h3>
                    <p className="text-sm text-slate-400 mb-4 line-clamp-2">{item.description}</p>

                    {/* Price */}
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        {item.discount ? (
                          <>
                            <span className="text-lg font-bold text-amber-400">{discountedPrice.toLocaleString()} SD</span>
                            <span className="text-sm text-slate-500 line-through">{item.price.toLocaleString()}</span>
                          </>
                        ) : (
                          <span className="text-lg font-bold text-amber-400">{item.price.toLocaleString()} SD</span>
                        )}
                      </div>
                    </div>

                    {/* Purchase Button */}
                    <CyberButton
                      variant={canAfford ? 'primary' : 'secondary'}
                      size="sm"
                      className="w-full"
                      disabled={!canAfford}
                      onClick={() => handlePurchase(item)}
                    >
                      {canAfford ? 'Purchase' : 'Not Enough SD'}
                    </CyberButton>
                  </div>
                </GlassCard>
              );
            })}
          </div>

          {/* Empty State */}
          {filteredItems.length === 0 && (
            <div className="flex flex-col items-center justify-center py-16">
              <div className="w-20 h-20 rounded-2xl bg-white/5 flex items-center justify-center mb-4">
                <svg className="w-10 h-10 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                </svg>
              </div>
              <p className="text-slate-400 mb-2">No items found</p>
              <p className="text-sm text-slate-500">Try selecting a different category</p>
            </div>
          )}
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
