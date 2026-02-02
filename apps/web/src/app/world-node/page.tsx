'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const regions = [
  { id: 'alpha', name: 'Alpha Sector', status: 'active', players: 234, rewards: '1.5x', difficulty: 'Easy' },
  { id: 'beta', name: 'Beta Quadrant', status: 'active', players: 189, rewards: '2x', difficulty: 'Medium' },
  { id: 'gamma', name: 'Gamma Nebula', status: 'active', players: 145, rewards: '3x', difficulty: 'Hard' },
  { id: 'delta', name: 'Delta Void', status: 'locked', players: 0, rewards: '5x', difficulty: 'Extreme' },
];

export default function WorldNodePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedRegion, setSelectedRegion] = useState<string | null>(null);

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
      <Sidebar activePath="/world-node" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">World Node</h1>
            <p className="text-slate-400">Explore the Asterbook universe and conquer new territories</p>
          </div>

          {/* World Map Placeholder */}
          <div className="glass-panel p-6 mb-8">
            <div className="aspect-[16/9] bg-gradient-to-br from-slate-900 to-slate-800 rounded-xl flex items-center justify-center relative overflow-hidden">
              {/* Stars background */}
              <div className="absolute inset-0">
                {Array.from({ length: 50 }).map((_, i) => (
                  <div
                    key={i}
                    className="absolute w-1 h-1 bg-white rounded-full animate-pulse"
                    style={{
                      left: `${Math.random() * 100}%`,
                      top: `${Math.random() * 100}%`,
                      animationDelay: `${Math.random() * 2}s`,
                      opacity: Math.random() * 0.5 + 0.2,
                    }}
                  />
                ))}
              </div>

              {/* Region Nodes */}
              {regions.map((region, i) => (
                <button
                  key={region.id}
                  onClick={() => setSelectedRegion(region.id)}
                  disabled={region.status === 'locked'}
                  className={`absolute w-16 h-16 rounded-full flex items-center justify-center transition-all ${
                    region.status === 'locked'
                      ? 'bg-slate-700/50 cursor-not-allowed'
                      : selectedRegion === region.id
                        ? 'bg-cyan-500/40 ring-4 ring-cyan-400 scale-110'
                        : 'bg-cyan-500/20 hover:bg-cyan-500/30 hover:scale-105'
                  }`}
                  style={{
                    left: `${20 + i * 20}%`,
                    top: `${30 + (i % 2) * 30}%`,
                  }}
                >
                  <span className="text-2xl">{region.status === 'locked' ? '🔒' : '🌟'}</span>
                </button>
              ))}

              <p className="absolute bottom-4 text-slate-500 text-sm">Click on a region to explore</p>
            </div>
          </div>

          {/* Regions List */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {regions.map((region) => (
              <button
                key={region.id}
                onClick={() => setSelectedRegion(region.id)}
                disabled={region.status === 'locked'}
                className={`glass-card p-5 text-left transition-all ${
                  region.status === 'locked' ? 'opacity-50 cursor-not-allowed' : ''
                } ${selectedRegion === region.id ? 'ring-2 ring-cyan-400' : ''}`}
              >
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-lg font-semibold text-white">{region.name}</h3>
                  <span className={`px-2 py-1 text-xs rounded-full ${
                    region.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                    region.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                    region.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                    'bg-red-500/20 text-red-400'
                  }`}>
                    {region.difficulty}
                  </span>
                </div>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Players</span>
                    <span className="text-white">{region.players}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Reward Multiplier</span>
                    <span className="text-amber-400">{region.rewards}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Status</span>
                    <span className={region.status === 'active' ? 'text-green-400' : 'text-slate-500'}>
                      {region.status === 'active' ? 'Active' : 'Locked'}
                    </span>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Selected Region Details */}
          {selectedRegion && regions.find(r => r.id === selectedRegion)?.status === 'active' && (
            <div className="glass-panel p-6 mt-6">
              <h2 className="text-xl font-semibold text-white mb-4">
                {regions.find(r => r.id === selectedRegion)?.name}
              </h2>
              <p className="text-slate-400 mb-6">
                Enter this region to start earning rewards. Complete missions, defeat enemies, and claim territory for bonus Stardust!
              </p>
              <button className="btn-cyber">Enter Region</button>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
