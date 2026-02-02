'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

interface ApiKey {
  id: string;
  name: string;
  key: string;
  status: 'active' | 'revoked';
  createdAt: string;
  lastUsed: string;
  usageCount: number;
}

export default function DeveloperPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [apiKeys] = useState<ApiKey[]>([
    {
      id: '1',
      name: 'Production Key',
      key: 'ask_live_xxxx...xxxx',
      status: 'active',
      createdAt: '2024-01-15',
      lastUsed: '2 hours ago',
      usageCount: 1247,
    },
    {
      id: '2',
      name: 'Test Key',
      key: 'ask_test_yyyy...yyyy',
      status: 'active',
      createdAt: '2024-01-20',
      lastUsed: '1 day ago',
      usageCount: 89,
    },
  ]);

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
      <Sidebar activePath="/developer" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Developer Hub</h1>
            <p className="text-slate-400">Build integrations with the Asterbook API</p>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">API Calls Today</p>
              <p className="text-2xl font-bold text-white">1,336</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Active Keys</p>
              <p className="text-2xl font-bold text-cyan-400">2</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">Rate Limit</p>
              <p className="text-2xl font-bold text-white">1000/min</p>
            </div>
            <div className="glass-panel p-6">
              <p className="text-sm text-slate-400 mb-1">API Status</p>
              <p className="text-2xl font-bold text-green-400">Operational</p>
            </div>
          </div>

          {/* API Keys Section */}
          <div className="glass-panel p-6 mb-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-white">API Keys</h2>
              <button className="btn-cyber">
                <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
                Create New Key
              </button>
            </div>

            <div className="space-y-4">
              {apiKeys.map((key) => (
                <div key={key.id} className="p-4 rounded-lg bg-white/5 border border-white/10">
                  <div className="flex items-start justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <p className="font-semibold text-white">{key.name}</p>
                        <span className={`px-2 py-0.5 text-xs rounded-full ${
                          key.status === 'active' ? 'bg-green-500/20 text-green-400' : 'bg-red-500/20 text-red-400'
                        }`}>
                          {key.status}
                        </span>
                      </div>
                      <p className="text-sm text-slate-400 font-mono">{key.key}</p>
                    </div>
                    <div className="flex gap-2">
                      <button className="btn-ghost text-sm px-3 py-1">Copy</button>
                      <button className="btn-ghost text-sm px-3 py-1 text-red-400 border-red-500/30 hover:bg-red-500/10">Revoke</button>
                    </div>
                  </div>
                  <div className="flex gap-6 mt-3 text-sm text-slate-500">
                    <span>Created: {key.createdAt}</span>
                    <span>Last used: {key.lastUsed}</span>
                    <span>Calls: {key.usageCount.toLocaleString()}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Documentation */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-cyan-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">API Documentation</h3>
              </div>
              <p className="text-slate-400 mb-4">Complete reference for all API endpoints, parameters, and response formats.</p>
              <button className="btn-ghost w-full">View Docs</button>
            </div>

            <div className="glass-card p-6">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-lg bg-purple-500/20 flex items-center justify-center">
                  <svg className="w-5 h-5 text-purple-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
                  </svg>
                </div>
                <h3 className="text-lg font-semibold text-white">Code Examples</h3>
              </div>
              <p className="text-slate-400 mb-4">Ready-to-use code snippets in JavaScript, Python, and more.</p>
              <button className="btn-ghost w-full">View Examples</button>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
