'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

// Layout components
import { AnimatedBackground } from '@/components/layout/animated-background';
import { Header } from '@/components/layout/header';
import { Sidebar } from '@/components/layout/sidebar';

// Staking components
import { StakingOverview } from '@/components/staking/staking-overview';
import { StakeForm } from '@/components/staking/stake-form';
import { ActiveStakes } from '@/components/staking/active-stakes';

// UI components
import { GlassCard } from '@/components/ui/glass-card';

// Mock vault data
const mockVaults = [
  {
    id: 1,
    amount: 5000,
    apy: 12,
    durationDays: 30,
    stakedAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
    unlocksAt: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
    status: 'active' as const,
  },
  {
    id: 2,
    amount: 10000,
    apy: 25,
    durationDays: 90,
    stakedAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
    unlocksAt: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
    status: 'active' as const,
  },
  {
    id: 3,
    amount: 2500,
    apy: 5,
    durationDays: 7,
    stakedAt: new Date(Date.now() - 8 * 24 * 60 * 60 * 1000), // 8 days ago
    unlocksAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago (claimable)
    status: 'active' as const,
  },
];

export default function StakingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [sidebarCollapsed, setSidebarCollapsed] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const [isStaking, setIsStaking] = useState(false);
  const [claimingVaultId, setClaimingVaultId] = useState<number | null>(null);

  // User staking data
  const [stakingData, setStakingData] = useState({
    availableBalance: 25000,
    totalStaked: 17500,
    totalRewards: 1250.75,
    currentApy: 14.5,
    stakingCapacity: 55,
    vaults: mockVaults,
  });

  // Redirect if unauthenticated
  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    }
  }, [status, router]);

  // Simulate loading
  useEffect(() => {
    if (status === 'authenticated') {
      const timer = setTimeout(() => setIsLoading(false), 800);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleStake = async (amount: number, durationDays: number) => {
    setIsStaking(true);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Calculate APY based on duration
      const apyMap: Record<number, number> = { 7: 5, 30: 12, 90: 25 };
      const apy = apyMap[durationDays] || 12;

      // Add new vault
      const newVault = {
        id: Date.now(),
        amount,
        apy,
        durationDays,
        stakedAt: new Date(),
        unlocksAt: new Date(Date.now() + durationDays * 24 * 60 * 60 * 1000),
        status: 'active' as const,
      };

      setStakingData((prev) => ({
        ...prev,
        availableBalance: prev.availableBalance - amount,
        totalStaked: prev.totalStaked + amount,
        vaults: [...prev.vaults, newVault],
      }));
    } catch (error) {
      console.error('Staking failed:', error);
    } finally {
      setIsStaking(false);
    }
  };

  const handleClaim = async (vaultId: number) => {
    setClaimingVaultId(vaultId);
    try {
      // Simulate API call
      await new Promise((resolve) => setTimeout(resolve, 2000));

      const vault = stakingData.vaults.find((v) => v.id === vaultId);
      if (vault) {
        const reward = vault.amount * (vault.apy / 100) * (vault.durationDays / 365);
        const totalClaim = vault.amount + reward;

        setStakingData((prev) => ({
          ...prev,
          availableBalance: prev.availableBalance + totalClaim,
          totalStaked: prev.totalStaked - vault.amount,
          totalRewards: prev.totalRewards + reward,
          vaults: prev.vaults.filter((v) => v.id !== vaultId),
        }));
      }
    } catch (error) {
      console.error('Claim failed:', error);
    } finally {
      setClaimingVaultId(null);
    }
  };

  // Show loading while checking auth
  if (status === 'loading' || isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#070A14]">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-4 border-cyan-400 border-t-transparent rounded-full animate-spin" />
          <p className="text-slate-400 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  return (
    <div className="min-h-screen">
      <AnimatedBackground />
      <Header
        user={{
          username: session.user?.username || session.user?.name || 'User',
          avatar: session.user?.image || undefined,
        }}
      />
      <Sidebar
        activePath="/staking"
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed(!sidebarCollapsed)}
      />

      <main
        className="pt-20 pb-8 px-4 lg:px-6 transition-all duration-300"
        style={{ marginLeft: sidebarCollapsed ? '80px' : '260px' }}
      >
        <div className="max-w-[1400px] mx-auto">
          {/* Page Title */}
          <div className="mb-6">
            <h1 className="text-3xl font-bold text-white mb-2">Staking</h1>
            <p className="text-slate-400">Stake your ASTER tokens to earn rewards</p>
          </div>

          {/* Two Column Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            {/* Left Column - Overview & Active Stakes */}
            <div className="lg:col-span-7 space-y-6">
              {/* Staking Overview */}
              <StakingOverview
                totalStaked={stakingData.totalStaked}
                totalRewards={stakingData.totalRewards}
                currentApy={stakingData.currentApy}
                stakingCapacity={stakingData.stakingCapacity}
              />

              {/* Active Stakes */}
              <ActiveStakes
                vaults={stakingData.vaults}
                onClaim={handleClaim}
                isClaimLoading={claimingVaultId}
              />
            </div>

            {/* Right Column - Stake Form & Info */}
            <div className="lg:col-span-5 space-y-6">
              {/* Stake Form */}
              <StakeForm
                availableBalance={stakingData.availableBalance}
                onStake={handleStake}
                isLoading={isStaking}
              />

              {/* Staking Info */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4 flex items-center gap-2">
                  <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                  </svg>
                  How Staking Works
                </h3>

                <div className="space-y-4 text-sm">
                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      1
                    </div>
                    <div>
                      <p className="text-white font-medium">Choose Duration</p>
                      <p className="text-slate-400">Longer lock periods offer higher APY rewards</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      2
                    </div>
                    <div>
                      <p className="text-white font-medium">Stake Tokens</p>
                      <p className="text-slate-400">Your tokens are locked in a secure vault</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      3
                    </div>
                    <div>
                      <p className="text-white font-medium">Earn Rewards</p>
                      <p className="text-slate-400">Rewards accumulate daily during the lock period</p>
                    </div>
                  </div>

                  <div className="flex gap-3">
                    <div className="w-6 h-6 rounded-full bg-cyan-400/20 text-cyan-400 flex items-center justify-center flex-shrink-0 text-xs font-bold">
                      4
                    </div>
                    <div>
                      <p className="text-white font-medium">Claim</p>
                      <p className="text-slate-400">Claim principal + rewards when unlock date arrives</p>
                    </div>
                  </div>
                </div>

                <div className="mt-6 p-4 rounded-xl bg-amber-500/10 border border-amber-500/20">
                  <div className="flex items-start gap-3">
                    <svg className="w-5 h-5 text-amber-400 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <div>
                      <p className="text-amber-400 font-medium text-sm">Important</p>
                      <p className="text-slate-400 text-xs mt-1">
                        Tokens are locked for the selected duration and cannot be withdrawn early.
                        Early withdrawal is not supported.
                      </p>
                    </div>
                  </div>
                </div>
              </GlassCard>

              {/* APY Tiers */}
              <GlassCard className="p-6">
                <h3 className="text-lg font-semibold text-white mb-4">APY Tiers</h3>
                <div className="space-y-3">
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-blue-400" />
                      <span className="text-white">7 Days</span>
                    </div>
                    <span className="text-blue-400 font-bold">5% APY</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-purple-400" />
                      <span className="text-white">30 Days</span>
                    </div>
                    <span className="text-purple-400 font-bold">12% APY</span>
                  </div>
                  <div className="flex items-center justify-between p-3 rounded-lg bg-white/5">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 rounded-full bg-amber-400" />
                      <span className="text-white">90 Days</span>
                    </div>
                    <span className="text-amber-400 font-bold">25% APY</span>
                  </div>
                </div>
              </GlassCard>
            </div>
          </div>
        </div>
      </main>

      <style jsx>{`
        @media (max-width: 1023px) {
          main {
            margin-left: 0 !important;
          }
        }
      `}</style>
    </div>
  );
}
