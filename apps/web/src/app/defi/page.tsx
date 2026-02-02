'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const defiProtocols = [
  { name: 'Staking Vault', tvl: '$2.4M', apy: '12%', icon: '🔐', status: 'live' },
  { name: 'Liquidity Pool', tvl: '$1.8M', apy: '24%', icon: '💧', status: 'live' },
  { name: 'Yield Farm', tvl: '$890K', apy: '35%', icon: '🌾', status: 'live' },
  { name: 'Lending Protocol', tvl: '$560K', apy: '8%', icon: '🏦', status: 'coming_soon' },
];

export default function DefiPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);

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
      <Sidebar activePath="/defi" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">DeFi Dashboard</h1>
            <p className="text-slate-400">Explore decentralized finance opportunities</p>
          </div>

          {/* TVL Banner */}
          <div className="glass-panel p-6 mb-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Value Locked</p>
                <p className="text-4xl font-bold text-gradient-cyber">$5.65M</p>
              </div>
              <div className="flex gap-6">
                <div className="text-center">
                  <p className="text-2xl font-bold text-white">4</p>
                  <p className="text-sm text-slate-400">Protocols</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-green-400">+18.5%</p>
                  <p className="text-sm text-slate-400">24h Change</p>
                </div>
                <div className="text-center">
                  <p className="text-2xl font-bold text-cyan-400">1,247</p>
                  <p className="text-sm text-slate-400">Active Users</p>
                </div>
              </div>
            </div>
          </div>

          {/* Protocols Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {defiProtocols.map((protocol) => (
              <div key={protocol.name} className="glass-card p-6">
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <span className="text-3xl">{protocol.icon}</span>
                    <div>
                      <h3 className="text-lg font-semibold text-white">{protocol.name}</h3>
                      {protocol.status === 'coming_soon' ? (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400">Coming Soon</span>
                      ) : (
                        <span className="text-xs px-2 py-0.5 rounded-full bg-green-500/20 text-green-400">Live</span>
                      )}
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-green-400">{protocol.apy}</p>
                    <p className="text-xs text-slate-400">APY</p>
                  </div>
                </div>
                <div className="flex items-center justify-between pt-4 border-t border-white/10">
                  <div>
                    <p className="text-sm text-slate-400">Total Value Locked</p>
                    <p className="text-lg font-semibold text-white">{protocol.tvl}</p>
                  </div>
                  <button
                    className={protocol.status === 'live' ? 'btn-cyber' : 'btn-ghost opacity-50 cursor-not-allowed'}
                    disabled={protocol.status !== 'live'}
                  >
                    {protocol.status === 'live' ? 'Enter' : 'Soon'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Your Positions */}
          <div className="glass-panel p-6">
            <h2 className="text-xl font-semibold text-white mb-4">Your Positions</h2>
            <div className="text-center py-8 text-slate-500">
              <svg className="w-12 h-12 mx-auto mb-3 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p>No active positions</p>
              <p className="text-sm">Start earning by entering a protocol above</p>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
