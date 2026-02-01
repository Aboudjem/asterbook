'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Layout components
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// Dashboard widgets
import { WelcomeBanner } from '@/components/dashboard/welcome-banner';
import { PortfolioCard } from '@/components/dashboard/portfolio-card';
import { PetWidget } from '@/components/dashboard/pet-widget';
import { MarketTicker } from '@/components/dashboard/market-ticker';
import { WhaleAlerts } from '@/components/dashboard/whale-alerts';
import { TerminalLogs } from '@/components/dashboard/terminal-logs';

interface UserData {
  username: string;
  avatar?: string;
  stardustBalance: number;
  onlineTime: string;
  totalBalance: number;
  stakingAmount: number;
  petLevel: number;
  arenaWins: number;
  pet: {
    name: string;
    stage: 'egg' | 'baby' | 'adult';
    hunger: number;
    isOnExpedition: boolean;
    expeditionTimeLeft?: string;
  };
}

// Skeleton components for loading states
function WelcomeBannerSkeleton() {
  return (
    <div className="rounded-xl p-6 animate-pulse" style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="h-8 w-64 bg-slate-700/50 rounded mb-2" />
          <div className="h-4 w-48 bg-slate-700/30 rounded" />
        </div>
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50" />
            <div>
              <div className="h-3 w-12 bg-slate-700/30 rounded mb-1" />
              <div className="h-5 w-16 bg-slate-700/50 rounded" />
            </div>
          </div>
          <div className="w-px h-10 bg-white/10" />
          <div className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-slate-700/50" />
            <div>
              <div className="h-3 w-12 bg-slate-700/30 rounded mb-1" />
              <div className="h-5 w-16 bg-slate-700/50 rounded" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function PortfolioCardSkeleton() {
  return (
    <div className="rounded-xl p-5 animate-pulse" style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-40 bg-slate-700/50 rounded" />
        <div className="h-4 w-20 bg-slate-700/30 rounded" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="p-4 rounded-xl bg-slate-700/30">
            <div className="flex items-center gap-2 mb-2">
              <div className="w-5 h-5 rounded bg-slate-700/50" />
              <div className="h-3 w-16 bg-slate-700/50 rounded" />
            </div>
            <div className="h-6 w-24 bg-slate-700/50 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function PetWidgetSkeleton() {
  return (
    <div className="rounded-xl p-5 animate-pulse" style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-20 bg-slate-700/50 rounded" />
        <div className="h-5 w-24 bg-slate-700/30 rounded-full" />
      </div>
      <div className="flex flex-col items-center mb-5">
        <div className="w-20 h-20 rounded-full bg-slate-700/50 mb-2" />
        <div className="h-5 w-24 bg-slate-700/50 rounded" />
      </div>
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <div className="h-3 w-12 bg-slate-700/30 rounded" />
          <div className="h-3 w-8 bg-slate-700/30 rounded" />
        </div>
        <div className="h-3 w-full bg-slate-700/30 rounded-full" />
      </div>
      <div className="h-12 w-full bg-slate-700/50 rounded-lg" />
    </div>
  );
}

function MarketTickerSkeleton() {
  return (
    <div className="rounded-xl py-3 px-6 animate-pulse" style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex items-center gap-8">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-5 w-14 bg-slate-700/50 rounded" />
            <div className="h-4 w-16 bg-slate-700/30 rounded" />
            <div className="h-4 w-12 bg-slate-700/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

function WidgetSkeleton({ title }: { title: string }) {
  return (
    <div className="rounded-xl p-5 h-80 animate-pulse" style={{ background: 'rgba(2, 6, 23, 0.65)', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div className="flex items-center justify-between mb-4">
        <div className="h-6 w-32 bg-slate-700/50 rounded" />
        <div className="h-4 w-12 bg-slate-700/30 rounded" />
      </div>
      <div className="space-y-3">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="flex items-center gap-3 p-3 rounded-lg bg-slate-700/20">
            <div className="w-8 h-8 rounded-lg bg-slate-700/50" />
            <div className="flex-1">
              <div className="h-4 w-24 bg-slate-700/50 rounded mb-1" />
              <div className="h-3 w-32 bg-slate-700/30 rounded" />
            </div>
            <div className="h-3 w-12 bg-slate-700/30 rounded" />
          </div>
        ))}
      </div>
    </div>
  );
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [userData, setUserData] = useState<UserData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Fetch user data
  useEffect(() => {
    async function fetchUserData() {
      if (status !== 'authenticated' || !session) return;

      try {
        // Simulated API call - replace with actual API endpoint
        // const response = await fetch('/api/user/dashboard');
        // const data = await response.json();

        // Mock data for now
        await new Promise((resolve) => setTimeout(resolve, 1000)); // Simulate network delay

        setUserData({
          username: session.user?.username || session.user?.name || 'Adventurer',
          avatar: session.user?.image || undefined,
          stardustBalance: 12450,
          onlineTime: '2h 34m',
          totalBalance: 4827.52,
          stakingAmount: 15000,
          petLevel: 7,
          arenaWins: 42,
          pet: {
            name: 'Blaze',
            stage: 'baby',
            hunger: 72,
            isOnExpedition: false,
            expeditionTimeLeft: undefined,
          },
        });
      } catch (error) {
        console.error('Failed to fetch user data:', error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchUserData();
  }, [status, session]);

  // Handle pet feeding
  const handleFeedPet = async () => {
    if (!userData) return;

    try {
      // API call to feed pet
      // await fetch('/api/pet/feed', { method: 'POST' });

      // Optimistic update
      setUserData({
        ...userData,
        pet: {
          ...userData.pet,
          hunger: Math.min(100, userData.pet.hunger + 20),
        },
      });
    } catch (error) {
      console.error('Failed to feed pet:', error);
    }
  };

  // Show full-screen loading while checking authentication
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

  // Don't render if not authenticated
  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      {/* Animated Background */}
      <AnimatedBackground />

      {/* Header */}
      <Header
        user={{
          username: userData?.username || session.user?.username || session.user?.name || 'User',
          avatar: userData?.avatar || session.user?.image || undefined,
        }}
      />

      {/* Sidebar */}
      <Sidebar
        activePath="/dashboard"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      {/* Main Content */}
      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{
          marginLeft: sidebarCollapsed ? '80px' : '260px',
        }}
      >
        <div className="max-w-[1600px] mx-auto">
          {/* Grid Layout - 12 columns */}
          <div className="grid grid-cols-12 gap-4 lg:gap-6">
            {/* Row 1: Welcome Banner - Full Width */}
            <div className="col-span-12">
              {isLoading ? (
                <WelcomeBannerSkeleton />
              ) : (
                <WelcomeBanner
                  username={userData?.username || 'Adventurer'}
                  stardustBalance={userData?.stardustBalance || 0}
                  onlineTime={userData?.onlineTime || '0h 0m'}
                />
              )}
            </div>

            {/* Row 2: Portfolio Card (2/3) + Pet Widget (1/3) */}
            <div className="col-span-12 lg:col-span-8">
              {isLoading ? (
                <PortfolioCardSkeleton />
              ) : (
                <PortfolioCard
                  totalBalance={userData?.totalBalance || 0}
                  stakingAmount={userData?.stakingAmount || 0}
                  petLevel={userData?.petLevel || 1}
                  arenaWins={userData?.arenaWins || 0}
                />
              )}
            </div>

            <div className="col-span-12 lg:col-span-4">
              {isLoading ? (
                <PetWidgetSkeleton />
              ) : (
                <PetWidget
                  petName={userData?.pet.name || 'Your Pet'}
                  stage={userData?.pet.stage || 'egg'}
                  hunger={userData?.pet.hunger || 50}
                  isOnExpedition={userData?.pet.isOnExpedition || false}
                  expeditionTimeLeft={userData?.pet.expeditionTimeLeft}
                  onFeed={handleFeedPet}
                />
              )}
            </div>

            {/* Row 3: Market Ticker - Full Width */}
            <div className="col-span-12">
              {isLoading ? <MarketTickerSkeleton /> : <MarketTicker />}
            </div>

            {/* Row 4: Whale Alerts (1/2) + Terminal Logs (1/2) */}
            <div className="col-span-12 lg:col-span-6">
              {isLoading ? <WidgetSkeleton title="Whale Alerts" /> : <WhaleAlerts />}
            </div>

            <div className="col-span-12 lg:col-span-6">
              {isLoading ? <WidgetSkeleton title="Terminal Logs" /> : <TerminalLogs />}
            </div>
          </div>
        </div>
      </main>

      {/* Responsive adjustments for mobile sidebar */}
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
