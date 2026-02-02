'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const memes = [
  { id: 1, title: 'When ASTER moons', author: 'crypto_memer', likes: 234, comments: 45 },
  { id: 2, title: 'HODLers be like', author: 'diamond_hands', likes: 567, comments: 89 },
  { id: 3, title: 'Me checking charts at 3am', author: 'degen_trader', likes: 890, comments: 123 },
  { id: 4, title: 'Trust the process', author: 'bag_holder', likes: 345, comments: 56 },
  { id: 5, title: 'Buy high sell low', author: 'smooth_brain', likes: 678, comments: 78 },
  { id: 6, title: 'This is fine', author: 'market_panic', likes: 456, comments: 67 },
];

export default function MemesPage() {
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
      <Sidebar activePath="/memes" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Meme Gallery</h1>
              <p className="text-slate-400">The best crypto memes from our community</p>
            </div>
            <button className="btn-cyber">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Submit Meme
            </button>
          </div>

          {/* Meme Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {memes.map((meme) => (
              <div key={meme.id} className="glass-card overflow-hidden">
                <div className="h-64 bg-gradient-to-br from-purple-900/30 to-cyan-900/30 flex items-center justify-center">
                  <span className="text-6xl">😂</span>
                </div>
                <div className="p-5">
                  <h3 className="text-lg font-semibold text-white mb-1">{meme.title}</h3>
                  <p className="text-sm text-slate-400 mb-4">by @{meme.author}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex gap-4">
                      <button className="flex items-center gap-1 text-slate-400 hover:text-red-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                        </svg>
                        <span>{meme.likes}</span>
                      </button>
                      <button className="flex items-center gap-1 text-slate-400 hover:text-cyan-400 transition-colors">
                        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                        </svg>
                        <span>{meme.comments}</span>
                      </button>
                    </div>
                    <button className="text-slate-400 hover:text-white transition-colors">
                      <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Load More */}
          <div className="text-center mt-8">
            <button className="btn-ghost">Load More Memes</button>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
