'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const networks = [
  { id: 'eth', name: 'Ethereum', icon: 'Ξ', color: '#627EEA' },
  { id: 'bsc', name: 'BNB Chain', icon: 'B', color: '#F3BA2F' },
  { id: 'polygon', name: 'Polygon', icon: 'P', color: '#8247E5' },
  { id: 'arbitrum', name: 'Arbitrum', icon: 'A', color: '#28A0F0' },
];

export default function BridgePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [fromNetwork, setFromNetwork] = useState('eth');
  const [toNetwork, setToNetwork] = useState('bsc');
  const [amount, setAmount] = useState('');

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

  const handleSwapNetworks = () => {
    const temp = fromNetwork;
    setFromNetwork(toNetwork);
    setToNetwork(temp);
  };

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header user={{ username: session.user?.name || 'User', avatar: session.user?.image || undefined }} />
      <Sidebar activePath="/bridge" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Token Bridge</h1>
            <p className="text-slate-400">Transfer tokens across different blockchain networks</p>
          </div>

          <div className="max-w-xl mx-auto">
            <div className="glass-panel p-6">
              {/* From Network */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">From</label>
                <div className="flex gap-3">
                  <select
                    value={fromNetwork}
                    onChange={(e) => setFromNetwork(e.target.value)}
                    className="flex-1 glass-input"
                  >
                    {networks.map((n) => (
                      <option key={n.id} value={n.id}>{n.name}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Swap Button */}
              <div className="flex justify-center -my-2 relative z-10">
                <button
                  onClick={handleSwapNetworks}
                  className="w-10 h-10 rounded-full bg-slate-800 border border-slate-600 flex items-center justify-center text-cyan-400 hover:bg-slate-700 transition-colors"
                >
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16V4m0 0L3 8m4-4l4 4m6 0v12m0 0l4-4m-4 4l-4-4" />
                  </svg>
                </button>
              </div>

              {/* To Network */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">To</label>
                <select
                  value={toNetwork}
                  onChange={(e) => setToNetwork(e.target.value)}
                  className="w-full glass-input"
                >
                  {networks.map((n) => (
                    <option key={n.id} value={n.id}>{n.name}</option>
                  ))}
                </select>
              </div>

              {/* Amount */}
              <div className="mb-6">
                <label className="block text-sm text-slate-400 mb-2">Amount</label>
                <div className="relative">
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                    placeholder="0.00"
                    className="w-full glass-input pr-20"
                  />
                  <span className="absolute right-4 top-1/2 -translate-y-1/2 text-cyan-400 font-medium">ASTER</span>
                </div>
                <p className="text-sm text-slate-500 mt-1">Balance: 12,450 ASTER</p>
              </div>

              {/* Fee Info */}
              <div className="p-4 rounded-lg bg-white/5 mb-6">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Bridge Fee</span>
                  <span className="text-white">0.1%</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-slate-400">Estimated Time</span>
                  <span className="text-white">~5 minutes</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-slate-400">You will receive</span>
                  <span className="text-cyan-400">{amount ? (parseFloat(amount) * 0.999).toFixed(2) : '0.00'} ASTER</span>
                </div>
              </div>

              {/* Bridge Button */}
              <button className="w-full btn-cyber">
                Bridge Tokens
              </button>
            </div>

            {/* Recent Transfers */}
            <div className="glass-panel p-6 mt-6">
              <h2 className="text-lg font-semibold text-white mb-4">Recent Transfers</h2>
              <div className="text-center text-slate-500 py-8">
                <p>No recent transfers</p>
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
