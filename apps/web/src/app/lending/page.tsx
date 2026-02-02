'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const lendingPools = [
  { asset: 'ASTER', icon: '✦', supplyApy: 5.2, borrowApy: 8.5, totalSupply: '$1.2M', totalBorrow: '$450K', available: '$750K' },
  { asset: 'ETH', icon: 'Ξ', supplyApy: 3.8, borrowApy: 6.2, totalSupply: '$2.8M', totalBorrow: '$890K', available: '$1.91M' },
  { asset: 'USDC', icon: '$', supplyApy: 4.5, borrowApy: 7.0, totalSupply: '$4.5M', totalBorrow: '$2.1M', available: '$2.4M' },
  { asset: 'BNB', icon: 'B', supplyApy: 4.1, borrowApy: 6.8, totalSupply: '$890K', totalBorrow: '$320K', available: '$570K' },
];

export default function LendingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTab, setActiveTab] = useState<'supply' | 'borrow'>('supply');

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
      <Sidebar activePath="/lending" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Lending Protocol</h1>
            <p className="text-slate-400">Supply assets to earn interest or borrow against collateral</p>
          </div>

          {/* Stats Banner */}
          <div className="glass-panel p-6 mb-8">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Supply</p>
                <p className="text-2xl font-bold text-white">$9.39M</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Total Borrow</p>
                <p className="text-2xl font-bold text-white">$3.76M</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Utilization Rate</p>
                <p className="text-2xl font-bold text-cyan-400">40.04%</p>
              </div>
              <div>
                <p className="text-sm text-slate-400 mb-1">Your Position</p>
                <p className="text-2xl font-bold text-amber-400">$0.00</p>
              </div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex gap-2 mb-6">
            <button
              onClick={() => setActiveTab('supply')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'supply'
                  ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                  : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
              }`}
            >
              Supply Markets
            </button>
            <button
              onClick={() => setActiveTab('borrow')}
              className={`px-6 py-2 rounded-lg font-medium transition-all ${
                activeTab === 'borrow'
                  ? 'bg-purple-500/20 text-purple-400 border border-purple-500/50'
                  : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
              }`}
            >
              Borrow Markets
            </button>
          </div>

          {/* Markets Table */}
          <div className="glass-panel overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-white/10">
                    <th className="text-left p-4 text-sm font-medium text-slate-400">Asset</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">
                      {activeTab === 'supply' ? 'Supply APY' : 'Borrow APY'}
                    </th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Total Supply</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Available</th>
                    <th className="text-right p-4 text-sm font-medium text-slate-400">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lendingPools.map((pool) => (
                    <tr key={pool.asset} className="border-b border-white/5 hover:bg-white/5">
                      <td className="p-4">
                        <div className="flex items-center gap-3">
                          <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center text-lg">
                            {pool.icon}
                          </div>
                          <span className="font-medium text-white">{pool.asset}</span>
                        </div>
                      </td>
                      <td className="p-4 text-right">
                        <span className={`font-semibold ${activeTab === 'supply' ? 'text-green-400' : 'text-amber-400'}`}>
                          {activeTab === 'supply' ? pool.supplyApy : pool.borrowApy}%
                        </span>
                      </td>
                      <td className="p-4 text-right text-white">{pool.totalSupply}</td>
                      <td className="p-4 text-right text-slate-400">{pool.available}</td>
                      <td className="p-4 text-right">
                        <button className={activeTab === 'supply' ? 'btn-cyber text-sm px-4 py-2' : 'btn-ghost text-sm px-4 py-2'}>
                          {activeTab === 'supply' ? 'Supply' : 'Borrow'}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Info Box */}
          <div className="glass-panel p-6 mt-6">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-amber-500/20 flex items-center justify-center text-amber-400 flex-shrink-0">
                ⚠️
              </div>
              <div>
                <h3 className="text-white font-semibold mb-1">Lending & Borrowing Risks</h3>
                <p className="text-sm text-slate-400">
                  Borrowing involves risk of liquidation if your collateral value drops below the required threshold.
                  Always maintain a healthy collateral ratio and monitor market conditions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
