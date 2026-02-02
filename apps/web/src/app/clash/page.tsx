'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const activeMatches = [
  { id: 1, player1: 'StarLord42', player2: 'CosmicDragon', bet: 500, status: 'live' },
  { id: 2, player1: 'NebulaKing', player2: 'VoidWalker', bet: 1000, status: 'live' },
  { id: 3, player1: 'AsterMaster', player2: 'GalaxyRider', bet: 250, status: 'waiting' },
];

const leaderboard = [
  { rank: 1, player: 'CosmicDragon', wins: 156, losses: 23, winRate: 87, earnings: 45200 },
  { rank: 2, player: 'StarLord42', wins: 134, losses: 31, winRate: 81, earnings: 38400 },
  { rank: 3, player: 'NebulaKing', wins: 98, losses: 27, winRate: 78, earnings: 29100 },
  { rank: 4, player: 'VoidWalker', wins: 87, losses: 34, winRate: 72, earnings: 21500 },
  { rank: 5, player: 'GalaxyRider', wins: 76, losses: 29, winRate: 72, earnings: 18900 },
];

export default function ClashPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [betAmount, setBetAmount] = useState('100');

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A14]">
        <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!session) return null;

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header user={{ username: session.user?.name || 'User', avatar: session.user?.image || undefined }} />
      <Sidebar activePath="/clash" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">⚔️ PvP Clash</h1>
            <p className="text-slate-400">Battle other players for Stardust rewards</p>
          </div>

          {/* Quick Match */}
          <div className="glass-panel p-6 mb-8">
            <div className="flex flex-col md:flex-row items-center justify-between gap-6">
              <div>
                <h2 className="text-xl font-semibold text-white mb-2">Quick Match</h2>
                <p className="text-slate-400">Find an opponent and battle for glory</p>
              </div>
              <div className="flex items-center gap-4">
                <div>
                  <label className="block text-sm text-slate-400 mb-1">Bet Amount</label>
                  <div className="flex items-center gap-2">
                    <input
                      type="number"
                      value={betAmount}
                      onChange={(e) => setBetAmount(e.target.value)}
                      className="glass-input w-32"
                    />
                    <span className="text-amber-400">✦</span>
                  </div>
                </div>
                <button className="btn-cyber mt-5">Find Match</button>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Active Matches */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Active Matches</h2>
                <span className="text-xs text-green-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  {activeMatches.filter(m => m.status === 'live').length} Live
                </span>
              </div>
              <div className="space-y-3">
                {activeMatches.map((match) => (
                  <div key={match.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center gap-4">
                        <span className="text-white font-medium">{match.player1}</span>
                        <span className="text-slate-500">vs</span>
                        <span className="text-white font-medium">{match.player2}</span>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        match.status === 'live' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {match.status === 'live' ? 'Live' : 'Waiting'}
                      </span>
                    </div>
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-amber-400">{match.bet} ✦ pot</span>
                      <button className="text-cyan-400 hover:underline">Spectate</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Leaderboard */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Leaderboard</h2>
              <div className="space-y-2">
                {leaderboard.map((player) => (
                  <div key={player.rank} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        player.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                        player.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                        player.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-white/10 text-slate-400'
                      }`}>
                        {player.rank}
                      </span>
                      <span className="text-white font-medium">{player.player}</span>
                    </div>
                    <div className="flex items-center gap-4 text-sm">
                      <span className="text-green-400">{player.wins}W</span>
                      <span className="text-red-400">{player.losses}L</span>
                      <span className="text-slate-400">{player.winRate}%</span>
                      <span className="text-amber-400">{player.earnings.toLocaleString()} ✦</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Your Stats */}
          <div className="glass-panel p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Your Stats</h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="text-center">
                <p className="text-2xl font-bold text-white">42</p>
                <p className="text-sm text-slate-400">Matches</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-green-400">31</p>
                <p className="text-sm text-slate-400">Wins</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-red-400">11</p>
                <p className="text-sm text-slate-400">Losses</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-cyan-400">74%</p>
                <p className="text-sm text-slate-400">Win Rate</p>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-amber-400">8,450</p>
                <p className="text-sm text-slate-400">Earnings ✦</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
