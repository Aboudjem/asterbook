'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const recentBlocks = [
  { number: 18945672, hash: '0x8a3f...4e2d', txns: 234, time: '12 sec ago', validator: '0x1a2b...3c4d' },
  { number: 18945671, hash: '0x7b2e...5f3c', txns: 189, time: '24 sec ago', validator: '0x5e6f...7g8h' },
  { number: 18945670, hash: '0x6c1d...6e4b', txns: 312, time: '36 sec ago', validator: '0x9i0j...1k2l' },
  { number: 18945669, hash: '0x5d0c...7f5a', txns: 167, time: '48 sec ago', validator: '0x3m4n...5o6p' },
];

const recentTxns = [
  { hash: '0xabc1...def2', from: '0x111...222', to: '0x333...444', value: '1.5 ASTER', status: 'success' },
  { hash: '0xbcd2...efg3', from: '0x555...666', to: '0x777...888', value: '0.8 ASTER', status: 'success' },
  { hash: '0xcde3...fgh4', from: '0x999...aaa', to: '0xbbb...ccc', value: '25 ASTER', status: 'pending' },
  { hash: '0xdef4...ghi5', from: '0xddd...eee', to: '0xfff...000', value: '0.2 ASTER', status: 'success' },
];

export default function ExplorerPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

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
      <Sidebar activePath="/explorer" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Blockchain Explorer</h1>
            <p className="text-slate-400">Explore blocks, transactions, and addresses</p>
          </div>

          {/* Search Bar */}
          <div className="glass-panel p-4 mb-8">
            <div className="flex gap-3">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by Address / Txn Hash / Block"
                className="flex-1 glass-input"
              />
              <button className="btn-cyber">Search</button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Latest Block</p>
              <p className="text-xl font-bold text-white">18,945,672</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Total Transactions</p>
              <p className="text-xl font-bold text-white">124.5M</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Avg Block Time</p>
              <p className="text-xl font-bold text-cyan-400">12.3s</p>
            </div>
            <div className="glass-panel p-4 text-center">
              <p className="text-sm text-slate-400 mb-1">Gas Price</p>
              <p className="text-xl font-bold text-amber-400">32 Gwei</p>
            </div>
          </div>

          {/* Recent Data */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Blocks */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Latest Blocks</h2>
              <div className="space-y-3">
                {recentBlocks.map((block) => (
                  <div key={block.number} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center text-cyan-400 font-mono text-sm">
                        Bk
                      </div>
                      <div>
                        <p className="text-cyan-400 font-medium">{block.number.toLocaleString()}</p>
                        <p className="text-xs text-slate-500">{block.time}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white">{block.txns} txns</p>
                      <p className="text-xs text-slate-500 font-mono">{block.validator}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Recent Transactions */}
            <div className="glass-panel p-6">
              <h2 className="text-lg font-semibold text-white mb-4">Latest Transactions</h2>
              <div className="space-y-3">
                {recentTxns.map((txn) => (
                  <div key={txn.hash} className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                        txn.status === 'success' ? 'bg-green-500/20 text-green-400' : 'bg-amber-500/20 text-amber-400'
                      }`}>
                        {txn.status === 'success' ? '✓' : '⏳'}
                      </div>
                      <div>
                        <p className="text-cyan-400 font-mono text-sm">{txn.hash}</p>
                        <p className="text-xs text-slate-500">
                          <span className="font-mono">{txn.from}</span>
                          <span className="mx-1">→</span>
                          <span className="font-mono">{txn.to}</span>
                        </p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-white font-medium">{txn.value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
