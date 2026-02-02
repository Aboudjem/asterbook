'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const categories = ['All', 'Components', 'Templates', 'Animations', 'Utilities'];

const components = [
  { id: 1, title: 'Glass Card Component', author: 'stellar_dev', price: 150, category: 'Components', downloads: 234 },
  { id: 2, title: 'Animated Button Pack', author: 'motion_master', price: 200, category: 'Animations', downloads: 567 },
  { id: 3, title: 'Dashboard Template', author: 'ui_wizard', price: 500, category: 'Templates', downloads: 123 },
  { id: 4, title: 'Gradient Utilities', author: 'css_ninja', price: 100, category: 'Utilities', downloads: 890 },
  { id: 5, title: 'Data Table Component', author: 'react_pro', price: 250, category: 'Components', downloads: 345 },
  { id: 6, title: 'Loading Spinner Pack', author: 'motion_master', price: 75, category: 'Animations', downloads: 456 },
];

export default function MarketplacePage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');
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

  const filteredComponents = components.filter((c) => {
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    const matchesSearch = c.title.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header user={{ username: session.user?.name || 'User', avatar: session.user?.image || undefined }} />
      <Sidebar activePath="/marketplace" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
            <div>
              <h1 className="text-3xl font-bold text-white mb-2">Code Marketplace</h1>
              <p className="text-slate-400">Buy and sell code components, templates, and utilities</p>
            </div>
            <button className="btn-aster">
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Sell Your Code
            </button>
          </div>

          {/* Search and Filter */}
          <div className="glass-panel p-4 mb-6">
            <div className="flex flex-col md:flex-row gap-4">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search components..."
                className="flex-1 glass-input"
              />
              <div className="flex gap-2 overflow-x-auto pb-2 md:pb-0">
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setActiveCategory(cat)}
                    className={`px-4 py-2 rounded-lg text-sm font-medium whitespace-nowrap transition-all ${
                      activeCategory === cat
                        ? 'bg-cyan-500/20 text-cyan-400 border border-cyan-500/50'
                        : 'bg-white/5 text-slate-400 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Components Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredComponents.map((component) => (
              <div key={component.id} className="glass-card overflow-hidden">
                <div className="h-40 bg-gradient-to-br from-slate-800 to-slate-900 flex items-center justify-center">
                  <span className="text-4xl opacity-30">{ }</span>
                </div>
                <div className="p-5">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-semibold text-white">{component.title}</h3>
                    <span className="px-2 py-1 text-xs rounded-full bg-white/10 text-slate-300">{component.category}</span>
                  </div>
                  <p className="text-sm text-slate-400 mb-4">by {component.author}</p>
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-xl font-bold text-amber-400">{component.price} ✦</p>
                      <p className="text-xs text-slate-500">{component.downloads} downloads</p>
                    </div>
                    <button className="btn-cyber text-sm px-4 py-2">Purchase</button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredComponents.length === 0 && (
            <div className="text-center py-16">
              <p className="text-slate-400">No components found matching your criteria</p>
            </div>
          )}
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
