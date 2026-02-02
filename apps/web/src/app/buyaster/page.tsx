'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

const paymentMethods = [
  { id: 'card', name: 'Credit/Debit Card', icon: '💳' },
  { id: 'crypto', name: 'Cryptocurrency', icon: '₿' },
  { id: 'bank', name: 'Bank Transfer', icon: '🏦' },
];

const packages = [
  { amount: 1000, bonus: 0, price: 10 },
  { amount: 5000, bonus: 5, price: 47.50 },
  { amount: 10000, bonus: 10, price: 90 },
  { amount: 50000, bonus: 15, price: 425 },
];

export default function BuyAsterPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [selectedPackage, setSelectedPackage] = useState(packages[1]);
  const [paymentMethod, setPaymentMethod] = useState('card');

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
      <Sidebar activePath="/buyaster" collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed(!sidebarCollapsed)} />

      <main className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300" style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}>
        <div className="max-w-[1600px] mx-auto">
          <div className="mb-6 text-center">
            <h1 className="text-3xl font-bold text-white mb-2">Buy ASTER Tokens</h1>
            <p className="text-slate-400">Purchase ASTER tokens to unlock premium features and rewards</p>
          </div>

          {/* Package Selection */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {packages.map((pkg) => (
              <button
                key={pkg.amount}
                onClick={() => setSelectedPackage(pkg)}
                className={`glass-panel p-6 text-left transition-all ${
                  selectedPackage.amount === pkg.amount
                    ? 'ring-2 ring-cyan-400 bg-cyan-500/10'
                    : 'hover:bg-white/5'
                }`}
              >
                <div className="flex items-center justify-between mb-4">
                  <span className="text-2xl font-bold text-white">{pkg.amount.toLocaleString()}</span>
                  {pkg.bonus > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-amber-500/20 text-amber-400">
                      +{pkg.bonus}% BONUS
                    </span>
                  )}
                </div>
                <p className="text-cyan-400 text-sm mb-1">ASTER Tokens</p>
                <p className="text-2xl font-bold text-white">${pkg.price}</p>
                {pkg.bonus > 0 && (
                  <p className="text-sm text-green-400 mt-2">
                    Get {Math.floor(pkg.amount * (1 + pkg.bonus / 100)).toLocaleString()} total!
                  </p>
                )}
              </button>
            ))}
          </div>

          <div className="max-w-xl mx-auto">
            {/* Payment Method */}
            <div className="glass-panel p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Payment Method</h2>
              <div className="space-y-3">
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={`w-full flex items-center gap-4 p-4 rounded-lg transition-all ${
                      paymentMethod === method.id
                        ? 'bg-cyan-500/20 border border-cyan-500/50'
                        : 'bg-white/5 border border-transparent hover:bg-white/10'
                    }`}
                  >
                    <span className="text-2xl">{method.icon}</span>
                    <span className="text-white font-medium">{method.name}</span>
                    {paymentMethod === method.id && (
                      <svg className="w-5 h-5 text-cyan-400 ml-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Order Summary */}
            <div className="glass-panel p-6 mb-6">
              <h2 className="text-lg font-semibold text-white mb-4">Order Summary</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-slate-400">Base Amount</span>
                  <span className="text-white">{selectedPackage.amount.toLocaleString()} ASTER</span>
                </div>
                {selectedPackage.bonus > 0 && (
                  <div className="flex justify-between">
                    <span className="text-slate-400">Bonus ({selectedPackage.bonus}%)</span>
                    <span className="text-green-400">+{Math.floor(selectedPackage.amount * selectedPackage.bonus / 100).toLocaleString()} ASTER</span>
                  </div>
                )}
                <div className="border-t border-white/10 pt-3 flex justify-between">
                  <span className="text-white font-semibold">Total Tokens</span>
                  <span className="text-cyan-400 font-bold">
                    {Math.floor(selectedPackage.amount * (1 + selectedPackage.bonus / 100)).toLocaleString()} ASTER
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-white font-semibold">Price</span>
                  <span className="text-white font-bold">${selectedPackage.price}</span>
                </div>
              </div>
            </div>

            {/* Purchase Button */}
            <button className="w-full btn-aster text-lg py-4">
              Complete Purchase
            </button>
          </div>
        </div>
      </main>

      <style jsx>{`@media (max-width: 1023px) { main { margin-left: 0 !important; } }`}</style>
    </div>
  );
}
