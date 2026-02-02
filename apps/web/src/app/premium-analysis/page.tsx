'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const features = [
  { icon: '📊', title: 'Advanced Charts', description: 'Professional trading charts with 50+ indicators' },
  { icon: '🔔', title: 'Smart Alerts', description: 'Real-time price and whale movement alerts' },
  { icon: '🤖', title: 'AI Predictions', description: 'Machine learning price predictions' },
  { icon: '📈', title: 'Portfolio Tracking', description: 'Detailed portfolio analytics and reporting' },
  { icon: '🔒', title: 'Priority Support', description: '24/7 dedicated support channel' },
  { icon: '💎', title: 'Exclusive Features', description: 'Early access to new features' },
];

export default function PremiumAnalysisPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isPremium] = useState(false);

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

  if (!isPremium) {
    return (
      <div className="min-h-screen">
        <AnimatedBackground />
        <Header user={{ username: session.user?.name || 'User', avatar: session.user?.image || undefined }} />
        <Sidebar activePath="/premium-analysis" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

        <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
          <div className="max-w-4xl mx-auto text-center py-12">
            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-amber-400 to-orange-500 flex items-center justify-center mx-auto mb-6">
              <span className="text-5xl">👑</span>
            </div>
            <h1 className="text-4xl font-bold text-white mb-4">Premium Analysis</h1>
            <p className="text-xl text-slate-400 mb-8 max-w-2xl mx-auto">
              Unlock advanced analytics tools and exclusive insights to supercharge your trading
            </p>

            {/* Features Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
              {features.map((feature, i) => (
                <div key={i} className="glass-panel p-6 text-left">
                  <span className="text-3xl mb-3 block">{feature.icon}</span>
                  <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
                  <p className="text-sm text-slate-400">{feature.description}</p>
                </div>
              ))}
            </div>

            {/* Pricing */}
            <div className="glass-panel p-8 max-w-md mx-auto">
              <h2 className="text-2xl font-bold text-white mb-2">Go Premium</h2>
              <div className="flex items-baseline justify-center gap-1 mb-4">
                <span className="text-5xl font-bold text-gradient-gold">$19.99</span>
                <span className="text-slate-400">/month</span>
              </div>
              <p className="text-slate-400 mb-6">Cancel anytime. 7-day free trial.</p>
              <button className="w-full btn-aster text-lg py-4">
                Start Free Trial
              </button>
              <p className="text-xs text-slate-500 mt-4">
                Or pay with ASTER tokens and get 20% off
              </p>
            </div>
          </div>
        </main>

        <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header user={{ username: session.user?.name || 'User', avatar: session.user?.image || undefined }} />
      <Sidebar activePath="/premium-analysis" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6">
            <div className="flex items-center gap-2 mb-2">
              <h1 className="text-3xl font-bold text-white">Premium Analysis</h1>
              <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400">PRO</span>
            </div>
            <p className="text-slate-400">Advanced analytics and insights for serious traders</p>
          </div>

          {/* Premium content would go here */}
          <div className="glass-panel p-8 text-center">
            <p className="text-slate-400">Premium analytics dashboard loading...</p>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
