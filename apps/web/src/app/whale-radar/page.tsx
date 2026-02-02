'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const whaleAlerts = [
  { id: 1, type: 'buy', wallet: '0x1a2b...3c4d', amount: '2,500,000', token: 'ASTER', value: '$1.12M', time: '5 min ago' },
  { id: 2, type: 'sell', wallet: '0x5e6f...7g8h', amount: '890,000', token: 'ASTER', value: '$400K', time: '12 min ago' },
  { id: 3, type: 'transfer', wallet: '0x9i0j...1k2l', amount: '5,000,000', token: 'ASTER', value: '$2.25M', time: '28 min ago' },
  { id: 4, type: 'buy', wallet: '0x3m4n...5o6p', amount: '1,200,000', token: 'ASTER', value: '$540K', time: '45 min ago' },
  { id: 5, type: 'sell', wallet: '0x7q8r...9s0t', amount: '3,400,000', token: 'ASTER', value: '$1.53M', time: '1 hour ago' },
];

const topWallets = [
  { rank: 1, wallet: '0xabc1...def2', balance: '45.2M', percentage: 4.52, change: '+2.3%' },
  { rank: 2, wallet: '0xbcd2...efg3', balance: '38.7M', percentage: 3.87, change: '-1.1%' },
  { rank: 3, wallet: '0xcde3...fgh4', balance: '32.1M', percentage: 3.21, change: '+0.5%' },
  { rank: 4, wallet: '0xdef4...ghi5', balance: '28.9M', percentage: 2.89, change: '0%' },
  { rank: 5, wallet: '0xefg5...hij6', balance: '25.4M', percentage: 2.54, change: '+5.2%' },
];

export default function WhaleRadarPage() {
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
      <Sidebar activePath="/whale-radar" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">🐋 Whale Radar</h1>
            <p className="text-slate-400">Track large wallet movements in real-time</p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">24h Volume</p>
              <p className="text-xl font-bold text-white">$12.4M</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Whale Buys</p>
              <p className="text-xl font-bold text-green-400">$8.2M</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Whale Sells</p>
              <p className="text-xl font-bold text-red-400">$4.2M</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Net Flow</p>
              <p className="text-xl font-bold text-cyan-400">+$4.0M</p>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Live Alerts */}
            <div className="glass-panel p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-white">Live Whale Alerts</h2>
                <span className="flex items-center gap-2 text-xs text-green-400">
                  <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse" />
                  Live
                </span>
              </div>
              <div className="space-y-3">
                {whaleAlerts.map((alert) => (
                  <div key={alert.id} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        alert.type === 'buy' ? 'bg-green-500/20 text-green-400' :
                        alert.type === 'sell' ? 'bg-red-500/20 text-red-400' :
                        'bg-blue-500/20 text-blue-400'
                      }`}>
                        {alert.type === 'buy' ? '↑' : alert.type === 'sell' ? '↓' : '→'}
                      </div>
                      <div>
                        <p className="text-white font-medium capitalize">{alert.type}</p>
                        <p className="text-xs text-slate-400 font-mono">{alert.wallet}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{alert.amount} {alert.token}</p>
                      <p className="text-xs text-slate-500">{alert.value} • {alert.time}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Top Wallets */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Top Whale Wallets</h2>
              <div className="space-y-3">
                {topWallets.map((wallet) => (
                  <div key={wallet.rank} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <span className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold ${
                        wallet.rank === 1 ? 'bg-amber-500/20 text-amber-400' :
                        wallet.rank === 2 ? 'bg-slate-400/20 text-slate-300' :
                        wallet.rank === 3 ? 'bg-orange-500/20 text-orange-400' :
                        'bg-white/10 text-slate-400'
                      }`}>
                        {wallet.rank}
                      </span>
                      <p className="font-mono text-white">{wallet.wallet}</p>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{wallet.balance} ASTER</p>
                      <p className={`text-xs ${
                        wallet.change.startsWith('+') ? 'text-green-400' :
                        wallet.change.startsWith('-') ? 'text-red-400' :
                        'text-slate-400'
                      }`}>
                        {wallet.percentage}% supply • {wallet.change}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Alert Settings */}
          <div className="glass-panel p-6 mt-6">
            <h2 className="text-lg font-semibold text-white mb-4">Alert Settings</h2>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2">
                <input type="checkbox" id="alert-buy" className="w-4 h-4" defaultChecked />
                <label htmlFor="alert-buy" className="text-slate-400">Large Buys</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="alert-sell" className="w-4 h-4" defaultChecked />
                <label htmlFor="alert-sell" className="text-slate-400">Large Sells</label>
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="alert-transfer" className="w-4 h-4" defaultChecked />
                <label htmlFor="alert-transfer" className="text-slate-400">Whale Transfers</label>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-slate-400">Minimum:</span>
                <select className="glass-input py-1 px-3 w-32">
                  <option>$100K</option>
                  <option>$500K</option>
                  <option>$1M</option>
                </select>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
