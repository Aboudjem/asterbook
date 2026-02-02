'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const aiTools = [
  { id: 'sentiment', name: 'Market Sentiment', description: 'AI-powered analysis of market mood and trends', icon: '🧠', status: 'live' },
  { id: 'prediction', name: 'Price Prediction', description: 'Machine learning price forecasts', icon: '📈', status: 'live' },
  { id: 'signals', name: 'Trading Signals', description: 'Automated buy/sell signal generation', icon: '⚡', status: 'premium' },
  { id: 'news', name: 'News Analysis', description: 'Real-time crypto news sentiment scoring', icon: '📰', status: 'live' },
  { id: 'whale', name: 'Whale Tracker', description: 'Track large wallet movements', icon: '🐋', status: 'live' },
  { id: 'portfolio', name: 'Portfolio Optimizer', description: 'AI-driven portfolio rebalancing suggestions', icon: '💼', status: 'coming_soon' },
];

export default function IntelligencePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedTool, setSelectedTool] = useState<string | null>(null);

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
      <Sidebar activePath="/intelligence" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">AI Intelligence</h1>
            <p className="text-slate-400">Advanced AI tools for smarter trading decisions</p>
          </div>

          {/* AI Tools Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {aiTools.map((tool) => (
              <button
                key={tool.id}
                onClick={() => setSelectedTool(tool.id)}
                disabled={tool.status === 'coming_soon'}
                className={`glass-card p-6 text-left transition-all ${
                  selectedTool === tool.id ? 'ring-2 ring-cyan-400' : ''
                } ${tool.status === 'coming_soon' ? 'opacity-50 cursor-not-allowed' : 'hover:bg-white/10'}`}
              >
                <div className="flex items-start justify-between mb-4">
                  <span className="text-4xl">{tool.icon}</span>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    tool.status === 'live' ? 'bg-green-500/20 text-green-400' :
                    tool.status === 'premium' ? 'bg-amber-500/20 text-amber-400' :
                    'bg-slate-500/20 text-slate-400'
                  }`}>
                    {tool.status === 'live' ? 'Live' : tool.status === 'premium' ? 'Premium' : 'Coming Soon'}
                  </span>
                </div>
                <h3 className="text-lg font-semibold text-white mb-2">{tool.name}</h3>
                <p className="text-sm text-slate-400">{tool.description}</p>
              </button>
            ))}
          </div>

          {/* Selected Tool Panel */}
          {selectedTool && (
            <div className="glass-panel p-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {aiTools.find(t => t.id === selectedTool)?.name}
              </h2>

              {selectedTool === 'sentiment' && (
                <div>
                  <div className="grid grid-cols-3 gap-4 mb-6">
                    <div className="p-4 rounded-lg bg-green-500/10 text-center">
                      <p className="text-3xl font-bold text-green-400">68%</p>
                      <p className="text-sm text-slate-400">Bullish</p>
                    </div>
                    <div className="p-4 rounded-lg bg-slate-500/10 text-center">
                      <p className="text-3xl font-bold text-slate-400">15%</p>
                      <p className="text-sm text-slate-400">Neutral</p>
                    </div>
                    <div className="p-4 rounded-lg bg-red-500/10 text-center">
                      <p className="text-3xl font-bold text-red-400">17%</p>
                      <p className="text-sm text-slate-400">Bearish</p>
                    </div>
                  </div>
                  <p className="text-slate-400">Market sentiment is currently <span className="text-green-400 font-semibold">bullish</span> based on social media analysis, news sentiment, and on-chain metrics.</p>
                </div>
              )}

              {selectedTool === 'prediction' && (
                <div className="text-center py-8">
                  <p className="text-slate-400 mb-4">Enter a token to see AI price predictions</p>
                  <div className="flex gap-3 max-w-md mx-auto">
                    <input type="text" placeholder="Token symbol (e.g., ASTER)" className="flex-1 glass-input" />
                    <button className="btn-cyber">Predict</button>
                  </div>
                </div>
              )}

              {selectedTool === 'signals' && (
                <div className="text-center py-8">
                  <div className="w-16 h-16 rounded-full bg-amber-500/20 flex items-center justify-center mx-auto mb-4">
                    <span className="text-2xl">👑</span>
                  </div>
                  <p className="text-white font-semibold mb-2">Premium Feature</p>
                  <p className="text-slate-400 mb-4">Upgrade to access automated trading signals</p>
                  <button className="btn-aster">Upgrade to Premium</button>
                </div>
              )}

              {(selectedTool === 'news' || selectedTool === 'whale') && (
                <div className="text-center py-8 text-slate-400">
                  <p>Loading {aiTools.find(t => t.id === selectedTool)?.name}...</p>
                </div>
              )}
            </div>
          )}
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
