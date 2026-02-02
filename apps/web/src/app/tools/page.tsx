'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const tools = [
  { id: 'converter', name: 'Token Converter', description: 'Convert between different cryptocurrencies', icon: '🔄' },
  { id: 'calculator', name: 'Profit Calculator', description: 'Calculate potential profits and losses', icon: '🧮' },
  { id: 'gas', name: 'Gas Tracker', description: 'Real-time gas prices across networks', icon: '⛽' },
  { id: 'impermanent', name: 'IL Calculator', description: 'Calculate impermanent loss for LP positions', icon: '📉' },
  { id: 'apy', name: 'APY Calculator', description: 'Compare APY vs APR for investments', icon: '📊' },
  { id: 'hash', name: 'Hash Generator', description: 'Generate and verify cryptographic hashes', icon: '🔐' },
];

export default function ToolsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [converterAmount, setConverterAmount] = useState('');

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
      <Sidebar activePath="/tools" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Utility Tools</h1>
            <p className="text-slate-400">Helpful tools for crypto traders and investors</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Tool Selection */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-4">
                <h2 className="text-lg font-semibold text-white mb-4">Select Tool</h2>
                <div className="space-y-2">
                  {tools.map((tool) => (
                    <button
                      key={tool.id}
                      onClick={() => setActiveTool(tool.id)}
                      className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all text-left ${
                        activeTool === tool.id
                          ? 'bg-cyan-500/20 border border-cyan-500/50'
                          : 'bg-white/5 border border-transparent hover:bg-white/10'
                      }`}
                    >
                      <span className="text-2xl">{tool.icon}</span>
                      <div>
                        <p className="font-medium text-white">{tool.name}</p>
                        <p className="text-xs text-slate-400">{tool.description}</p>
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Tool Content */}
            <div className="lg:col-span-2">
              <div className="glass-panel p-6 min-h-[400px]">
                {!activeTool ? (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <span className="text-4xl block mb-3">🛠️</span>
                      <p>Select a tool from the list to get started</p>
                    </div>
                  </div>
                ) : activeTool === 'converter' ? (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Token Converter</h2>
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">From</label>
                        <div className="flex gap-3">
                          <input
                            type="number"
                            value={converterAmount}
                            onChange={(e) => setConverterAmount(e.target.value)}
                            placeholder="0.00"
                            className="flex-1 glass-input"
                          />
                          <select className="glass-input w-32">
                            <option>ASTER</option>
                            <option>ETH</option>
                            <option>BNB</option>
                            <option>USDC</option>
                          </select>
                        </div>
                      </div>
                      <div className="flex justify-center">
                        <button className="w-10 h-10 rounded-full bg-slate-800 flex items-center justify-center text-cyan-400">
                          ↕
                        </button>
                      </div>
                      <div>
                        <label className="block text-sm text-slate-400 mb-2">To</label>
                        <div className="flex gap-3">
                          <input
                            type="text"
                            value={converterAmount ? (parseFloat(converterAmount) * 0.45).toFixed(2) : ''}
                            readOnly
                            placeholder="0.00"
                            className="flex-1 glass-input"
                          />
                          <select className="glass-input w-32">
                            <option>USDC</option>
                            <option>ETH</option>
                            <option>BNB</option>
                            <option>ASTER</option>
                          </select>
                        </div>
                      </div>
                      <div className="p-4 rounded-lg bg-white/5 mt-6">
                        <p className="text-sm text-slate-400">1 ASTER = 0.45 USDC</p>
                      </div>
                    </div>
                  </div>
                ) : activeTool === 'gas' ? (
                  <div>
                    <h2 className="text-xl font-semibold text-white mb-6">Gas Tracker</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="p-4 rounded-lg bg-green-500/10 text-center">
                        <p className="text-sm text-slate-400 mb-1">Low</p>
                        <p className="text-2xl font-bold text-green-400">25 Gwei</p>
                        <p className="text-xs text-slate-500">~10 min</p>
                      </div>
                      <div className="p-4 rounded-lg bg-amber-500/10 text-center">
                        <p className="text-sm text-slate-400 mb-1">Average</p>
                        <p className="text-2xl font-bold text-amber-400">32 Gwei</p>
                        <p className="text-xs text-slate-500">~3 min</p>
                      </div>
                      <div className="p-4 rounded-lg bg-red-500/10 text-center">
                        <p className="text-sm text-slate-400 mb-1">Fast</p>
                        <p className="text-2xl font-bold text-red-400">45 Gwei</p>
                        <p className="text-xs text-slate-500">~30 sec</p>
                      </div>
                    </div>
                    <p className="text-center text-slate-500 text-sm mt-4">Last updated: Just now</p>
                  </div>
                ) : (
                  <div className="h-full flex items-center justify-center text-slate-400">
                    <div className="text-center">
                      <span className="text-4xl block mb-3">{tools.find(t => t.id === activeTool)?.icon}</span>
                      <p>{tools.find(t => t.id === activeTool)?.name} coming soon</p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
