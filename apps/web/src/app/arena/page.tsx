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
import { WinProbability } from '@/components/arena/win-probability';
import { cn } from '@/lib/utils';

type ArenaTab = 'pve' | 'pvp' | 'history';

interface BattleHistoryEntry {
  id: number;
  opponent: string;
  result: 'win' | 'loss';
  reward: number;
  date: string;
  mode: 'pve' | 'pvp';
}

interface PvPLobby {
  id: number;
  creator: string;
  betAmount: number;
  petLevel: number;
  createdAt: string;
}

// Mock data
const mockBattleHistory: BattleHistoryEntry[] = [
  { id: 1, opponent: 'Shadow Wolf', result: 'win', reward: 150, date: '2 hours ago', mode: 'pve' },
  { id: 2, opponent: 'CryptoKing', result: 'loss', reward: 0, date: '5 hours ago', mode: 'pvp' },
  { id: 3, opponent: 'Fire Drake', result: 'win', reward: 200, date: '1 day ago', mode: 'pve' },
  { id: 4, opponent: 'NightRider', result: 'win', reward: 500, date: '2 days ago', mode: 'pvp' },
  { id: 5, opponent: 'Ice Golem', result: 'loss', reward: 0, date: '3 days ago', mode: 'pve' },
];

const mockPvPLobbies: PvPLobby[] = [
  { id: 1, creator: 'CryptoKing', betAmount: 500, petLevel: 12, createdAt: '2 min ago' },
  { id: 2, creator: 'StarDuster', betAmount: 1000, petLevel: 15, createdAt: '5 min ago' },
  { id: 3, creator: 'MoonWalker', betAmount: 250, petLevel: 8, createdAt: '10 min ago' },
];

export default function ArenaPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<ArenaTab>('pve');
  const [betAmount, setBetAmount] = useState<string>('100');
  const [isLoading, setIsLoading] = useState(false);

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  const handleBetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*$/.test(value)) {
      setBetAmount(value);
    }
  };

  const handleFight = async () => {
    setIsLoading(true);
    // Simulate fight
    await new Promise((resolve) => setTimeout(resolve, 2000));
    setIsLoading(false);
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

  const tabs: { id: ArenaTab; label: string; icon: React.ReactNode }[] = [
    {
      id: 'pve',
      label: 'PvE Battle',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
        </svg>
      ),
    },
    {
      id: 'pvp',
      label: 'PvP Arena',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
        </svg>
      ),
    },
    {
      id: 'history',
      label: 'Battle History',
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
        </svg>
      ),
    },
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
        activePath="/arena"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Arena</h1>
            <p className="text-slate-400">Battle with your pet and earn rewards</p>
          </div>

          {/* Tabs */}
          <div className="flex flex-wrap gap-2 mb-6">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 rounded-xl font-medium transition-all duration-200',
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-cyan-500/20 to-blue-500/20 text-cyan-400 border border-cyan-500/30'
                    : 'bg-white/5 text-slate-400 border border-white/10 hover:text-white hover:bg-white/10'
                )}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* PvE Tab */}
          {activeTab === 'pve' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Battle Setup */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  Battle Setup
                </h2>

                {/* Bet Amount */}
                <div className="mb-6">
                  <label className="block text-sm text-slate-400 mb-2">Bet Amount (Stardust)</label>
                  <div className="relative">
                    <input
                      type="text"
                      value={betAmount}
                      onChange={handleBetChange}
                      placeholder="100"
                      className={cn(
                        'w-full px-4 py-3 rounded-xl',
                        'bg-white/5 border border-white/10',
                        'text-white text-lg font-medium placeholder-slate-500',
                        'focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20',
                        'transition-all duration-200'
                      )}
                    />
                    <div className="absolute right-3 top-1/2 -translate-y-1/2 flex gap-2">
                      {[100, 500, 1000].map((amount) => (
                        <button
                          key={amount}
                          onClick={() => setBetAmount(amount.toString())}
                          className="px-2 py-1 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg transition-all"
                        >
                          {amount}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Potential Rewards */}
                <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-slate-300">Potential Win</span>
                    <span className="text-lg font-bold text-amber-400">
                      +{Math.floor(Number(betAmount) * 1.5)} Stardust
                    </span>
                  </div>
                </div>

                {/* Fight Button */}
                <CyberButton
                  variant="primary"
                  size="lg"
                  className="w-full"
                  onClick={handleFight}
                  disabled={isLoading || !betAmount}
                >
                  {isLoading ? (
                    <span className="flex items-center gap-2">
                      <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                      </svg>
                      Fighting...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      Start Battle
                    </span>
                  )}
                </CyberButton>
              </GlassCard>

              {/* Pet Display & Win Probability */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                  Your Fighter
                </h2>

                {/* Pet Preview */}
                <div className="flex flex-col items-center mb-6">
                  <div className="w-32 h-32 rounded-2xl bg-gradient-to-br from-purple-500/20 to-pink-500/20 border border-purple-500/30 flex items-center justify-center mb-4">
                    <svg className="w-16 h-16 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                    </svg>
                  </div>
                  <p className="text-white font-semibold">Blaze</p>
                  <p className="text-sm text-slate-400">Level 7 - Baby Dragon</p>
                </div>

                {/* Stats */}
                <div className="grid grid-cols-2 gap-3 mb-6">
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <p className="text-xs text-slate-400 mb-1">Attack</p>
                    <p className="text-lg font-bold text-red-400">145</p>
                  </div>
                  <div className="p-3 rounded-lg bg-white/5 text-center">
                    <p className="text-xs text-slate-400 mb-1">Defense</p>
                    <p className="text-lg font-bold text-blue-400">120</p>
                  </div>
                </div>

                {/* Win Probability */}
                <div className="flex justify-center">
                  <WinProbability probability={0.68} size="lg" />
                </div>
              </GlassCard>
            </div>
          )}

          {/* PvP Tab */}
          {activeTab === 'pvp' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Create Lobby */}
              <GlassCard className="p-6">
                <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                  Create Lobby
                </h2>

                <div className="mb-4">
                  <label className="block text-sm text-slate-400 mb-2">Bet Amount</label>
                  <input
                    type="text"
                    value={betAmount}
                    onChange={handleBetChange}
                    placeholder="500"
                    className="w-full px-4 py-3 rounded-xl bg-white/5 border border-white/10 text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400/50"
                  />
                </div>

                <CyberButton variant="primary" className="w-full">
                  Create Battle
                </CyberButton>
              </GlassCard>

              {/* Lobby List */}
              <div className="lg:col-span-2">
                <GlassCard className="p-6">
                  <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                    <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    Open Lobbies
                  </h2>

                  <div className="space-y-3">
                    {mockPvPLobbies.map((lobby) => (
                      <div
                        key={lobby.id}
                        className="flex items-center justify-between p-4 rounded-xl bg-white/5 border border-white/10 hover:border-cyan-500/30 transition-colors"
                      >
                        <div className="flex items-center gap-4">
                          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
                            <span className="text-white text-sm font-bold">{lobby.creator[0]}</span>
                          </div>
                          <div>
                            <p className="text-white font-medium">{lobby.creator}</p>
                            <p className="text-xs text-slate-400">Level {lobby.petLevel} Pet</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-amber-400 font-bold">{lobby.betAmount} SD</p>
                          <p className="text-xs text-slate-500">{lobby.createdAt}</p>
                        </div>
                        <CyberButton variant="secondary" size="sm">
                          Join
                        </CyberButton>
                      </div>
                    ))}
                  </div>
                </GlassCard>
              </div>
            </div>
          )}

          {/* History Tab */}
          {activeTab === 'history' && (
            <GlassCard className="p-6">
              <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
                <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                Battle History
              </h2>

              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-white/10">
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Opponent</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Mode</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Result</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Reward</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-slate-400">Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {mockBattleHistory.map((battle) => (
                      <tr key={battle.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                        <td className="py-3 px-4">
                          <span className="text-white font-medium">{battle.opponent}</span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            battle.mode === 'pve'
                              ? 'bg-blue-500/20 text-blue-400'
                              : 'bg-purple-500/20 text-purple-400'
                          )}>
                            {battle.mode.toUpperCase()}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'px-2 py-1 rounded-full text-xs font-medium',
                            battle.result === 'win'
                              ? 'bg-green-500/20 text-green-400'
                              : 'bg-red-500/20 text-red-400'
                          )}>
                            {battle.result === 'win' ? 'Victory' : 'Defeat'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className={cn(
                            'font-medium',
                            battle.reward > 0 ? 'text-amber-400' : 'text-slate-500'
                          )}>
                            {battle.reward > 0 ? `+${battle.reward} SD` : '-'}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-slate-400 text-sm">{battle.date}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </GlassCard>
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
