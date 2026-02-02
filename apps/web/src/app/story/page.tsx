'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const chapters = [
  { id: 1, title: 'The Genesis', status: 'unlocked', progress: 100 },
  { id: 2, title: 'Rise of the Stars', status: 'unlocked', progress: 75 },
  { id: 3, title: 'The Great Migration', status: 'unlocked', progress: 30 },
  { id: 4, title: 'Nebula Wars', status: 'locked', progress: 0 },
  { id: 5, title: 'The Final Frontier', status: 'locked', progress: 0 },
];

export default function StoryPage() {
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
      <Sidebar activePath="/story" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 text-center">
            <h1 className="text-4xl font-bold text-white mb-4">The Asterbook Chronicles</h1>
            <p className="text-xl text-slate-400">Discover the story of the Asterbook universe</p>
          </div>

          {/* Story Progress */}
          <div className="glass-panel p-6 mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-white">Your Journey</h2>
              <span className="text-cyan-400">41% Complete</span>
            </div>
            <div className="h-3 rounded-full bg-white/10">
              <div className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500" style={{ width: '41%' }} />
            </div>
          </div>

          {/* Chapters */}
          <div className="space-y-4">
            {chapters.map((chapter) => (
              <div
                key={chapter.id}
                className={`glass-card p-6 ${chapter.status === 'locked' ? 'opacity-50' : ''}`}
              >
                <div className="flex items-center gap-4">
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center ${
                    chapter.status === 'locked'
                      ? 'bg-slate-700/50'
                      : chapter.progress === 100
                        ? 'bg-green-500/20'
                        : 'bg-cyan-500/20'
                  }`}>
                    {chapter.status === 'locked' ? (
                      <svg className="w-6 h-6 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    ) : chapter.progress === 100 ? (
                      <svg className="w-6 h-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    ) : (
                      <span className="text-cyan-400 font-bold">{chapter.id}</span>
                    )}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        Chapter {chapter.id}: {chapter.title}
                      </h3>
                      {chapter.status !== 'locked' && (
                        <span className="text-sm text-slate-400">{chapter.progress}%</span>
                      )}
                    </div>
                    {chapter.status !== 'locked' && (
                      <div className="h-2 rounded-full bg-white/10">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-cyan-400 to-blue-500"
                          style={{ width: `${chapter.progress}%` }}
                        />
                      </div>
                    )}
                  </div>
                  <button
                    className={chapter.status === 'locked' ? 'btn-ghost opacity-50 cursor-not-allowed' : 'btn-cyber'}
                    disabled={chapter.status === 'locked'}
                  >
                    {chapter.status === 'locked' ? 'Locked' : chapter.progress === 100 ? 'Replay' : 'Continue'}
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Lore Section */}
          <div className="glass-panel p-6 mt-8">
            <h2 className="text-xl font-semibold text-white mb-4">World Lore</h2>
            <p className="text-slate-400 mb-4">
              In the year 3042, humanity discovered the Asterbook - an ancient artifact containing the knowledge of a civilization that spanned galaxies.
              The book revealed the existence of Stardust, a form of cosmic energy that could be harnessed for interstellar travel and communication.
            </p>
            <p className="text-slate-400">
              Your journey begins as a new recruit in the Stellar Corps, tasked with uncovering the mysteries of the Asterbook and protecting
              the galaxy from those who would misuse its power.
            </p>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
