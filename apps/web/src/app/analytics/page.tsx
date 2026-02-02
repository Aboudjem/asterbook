'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

interface AnalyticsData {
  portfolioValue: number;
  portfolioChange: number;
  tradingVolume: number;
  profitLoss: number;
  activePositions: number;
}

export default function AnalyticsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [analyticsData] = useState<AnalyticsData>({
    portfolioValue: 48275.42,
    portfolioChange: 12.5,
    tradingVolume: 152340,
    profitLoss: 5420.18,
    activePositions: 8,
  });

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
      <Sidebar activePath="/analytics" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Analytics Dashboard</h1>
            <p className="text-slate-400">Track your portfolio performance and trading metrics</p>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Portfolio Value</p>
              <p className="text-2xl font-bold text-white">${analyticsData.portfolioValue.toLocaleString()}</p>
              <p className={`text-sm ${analyticsData.portfolioChange >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analyticsData.portfolioChange >= 0 ? '+' : ''}{analyticsData.portfolioChange}% this week
              </p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Trading Volume</p>
              <p className="text-2xl font-bold text-white">${analyticsData.tradingVolume.toLocaleString()}</p>
              <p className="text-sm text-slate-500">24h volume</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Profit/Loss</p>
              <p className={`text-2xl font-bold ${analyticsData.profitLoss >= 0 ? 'text-green-400' : 'text-red-400'}`}>
                {analyticsData.profitLoss >= 0 ? '+' : ''}${analyticsData.profitLoss.toLocaleString()}
              </p>
              <p className="text-sm text-slate-500">All time</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Active Positions</p>
              <p className="text-2xl font-bold text-cyan-400">{analyticsData.activePositions}</p>
              <p className="text-sm text-slate-500">Open trades</p>
            </div>
          </div>

          {/* Chart Placeholder */}
          <div className="glass-panel p-6 mb-8">
            <h2 className="text-xl font-semibold text-white mb-4">Portfolio Performance</h2>
            <div className="h-80 flex items-center justify-center text-slate-500 border border-dashed border-slate-700 rounded-xl">
              <div className="text-center">
                <svg className="w-12 h-12 mx-auto mb-2 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
                </svg>
                <p>Chart visualization coming soon</p>
              </div>
            </div>
          </div>

          {/* Recent Activity */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
            <div className="space-y-3">
              {[
                { type: 'buy', asset: 'ASTER', amount: '1,000', price: '$0.45', time: '2 hours ago' },
                { type: 'sell', asset: 'ETH', amount: '0.5', price: '$1,850', time: '5 hours ago' },
                { type: 'stake', asset: 'ASTER', amount: '5,000', apy: '12%', time: '1 day ago' },
              ].map((activity, i) => (
                <div key={i} className="flex items-center justify-between p-4 rounded-lg bg-white/5">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                      activity.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                      activity.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                      'bg-cyan-500/20 text-cyan-400'
                    }`}>
                      {activity.type === 'buy' ? '↑' : activity.type === 'sell' ? '↓' : '◈'}
                    </div>
                    <div>
                      <p className="font-medium text-white capitalize">{activity.type} {activity.asset}</p>
                      <p className="text-sm text-slate-400">{activity.amount} {activity.asset}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-white">{activity.price || `${activity.apy} APY`}</p>
                    <p className="text-sm text-slate-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
