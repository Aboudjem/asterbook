'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const expeditions = [
  { id: 'forest', name: 'Mystic Forest', duration: '1 hour', rewards: '50-100 ✦', difficulty: 'Easy', risk: 5 },
  { id: 'cave', name: 'Crystal Cave', duration: '3 hours', rewards: '150-300 ✦', difficulty: 'Medium', risk: 15 },
  { id: 'volcano', name: 'Dragon Volcano', duration: '6 hours', rewards: '400-800 ✦', difficulty: 'Hard', risk: 25 },
  { id: 'void', name: 'The Void', duration: '12 hours', rewards: '1000-2500 ✦', difficulty: 'Extreme', risk: 40 },
];

export default function PetAdventurePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [pet] = useState({
    name: 'Blaze',
    level: 7,
    stage: 'adult',
    hunger: 85,
    isOnExpedition: false,
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
      <Sidebar activePath="/pet-adventure" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Pet Adventure</h1>
            <p className="text-slate-400">Send your pet on expeditions to earn rewards</p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Pet Status */}
            <div className="lg:col-span-1">
              <div className="glass-panel p-6">
                <h2 className="text-lg font-semibold text-white mb-4">Your Pet</h2>
                <div className="text-center mb-6">
                  <div className="w-32 h-32 mx-auto rounded-full bg-gradient-to-br from-amber-500/20 to-orange-600/20 flex items-center justify-center mb-4">
                    <span className="text-6xl">🐉</span>
                  </div>
                  <h3 className="text-xl font-bold text-white">{pet.name}</h3>
                  <p className="text-slate-400">Level {pet.level} • {pet.stage}</p>
                </div>

                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Hunger</span>
                      <span className="text-white">{pet.hunger}%</span>
                    </div>
                    <div className="h-2 rounded-full bg-white/10">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-green-400 to-emerald-500"
                        style={{ width: `${pet.hunger}%` }}
                      />
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-slate-400">Status</span>
                      <span className={pet.isOnExpedition ? 'text-amber-400' : 'text-green-400'}>
                        {pet.isOnExpedition ? 'On Expedition' : 'Ready'}
                      </span>
                    </div>
                  </div>
                </div>

                <button className="w-full btn-ghost mt-4">Feed Pet (10 ✦)</button>
              </div>

              {/* Adventure Stats */}
              <div className="glass-panel p-6 mt-6">
                <h2 className="text-lg font-semibold text-white mb-4">Adventure Stats</h2>
                <div className="space-y-3">
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Expeditions</span>
                    <span className="text-white">42</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Success Rate</span>
                    <span className="text-green-400">87%</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">Total Earnings</span>
                    <span className="text-amber-400">12,450 ✦</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Expeditions */}
            <div className="lg:col-span-2">
              <h2 className="text-lg font-semibold text-white mb-4">Available Expeditions</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {expeditions.map((exp) => (
                  <div key={exp.id} className="glass-card p-5">
                    <div className="flex items-start justify-between mb-3">
                      <h3 className="text-lg font-semibold text-white">{exp.name}</h3>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        exp.difficulty === 'Easy' ? 'bg-green-500/20 text-green-400' :
                        exp.difficulty === 'Medium' ? 'bg-amber-500/20 text-amber-400' :
                        exp.difficulty === 'Hard' ? 'bg-orange-500/20 text-orange-400' :
                        'bg-red-500/20 text-red-400'
                      }`}>
                        {exp.difficulty}
                      </span>
                    </div>

                    <div className="space-y-2 mb-4">
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Duration</span>
                        <span className="text-white">{exp.duration}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Rewards</span>
                        <span className="text-amber-400">{exp.rewards}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-slate-400">Failure Risk</span>
                        <span className="text-red-400">{exp.risk}%</span>
                      </div>
                    </div>

                    <button
                      className="w-full btn-cyber"
                      disabled={pet.isOnExpedition || pet.hunger < 20}
                    >
                      Start Expedition
                    </button>
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
