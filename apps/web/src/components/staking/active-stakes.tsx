'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { cn } from '@/lib/utils';

type VaultStatus = 'active' | 'unlocking' | 'claimable';

interface StakingVault {
  id: number;
  amount: number;
  apy: number;
  durationDays: number;
  stakedAt: Date;
  unlocksAt: Date;
  status: VaultStatus;
  claimedAt?: Date;
}

interface ActiveStakesProps {
  vaults?: StakingVault[];
  onClaim?: (vaultId: number) => Promise<void>;
  isClaimLoading?: number | null;
}

function getTimeRemaining(unlocksAt: Date): { days: number; hours: number; minutes: number; percentage: number; isUnlocked: boolean } {
  const now = new Date();
  const diff = unlocksAt.getTime() - now.getTime();

  if (diff <= 0) {
    return { days: 0, hours: 0, minutes: 0, percentage: 100, isUnlocked: true };
  }

  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));

  return { days, hours, minutes, percentage: 0, isUnlocked: false };
}

function calculateProgress(stakedAt: Date, unlocksAt: Date): number {
  const now = new Date();
  const total = unlocksAt.getTime() - stakedAt.getTime();
  const elapsed = now.getTime() - stakedAt.getTime();
  return Math.min(Math.max((elapsed / total) * 100, 0), 100);
}

function calculateReward(amount: number, apy: number, days: number): number {
  return amount * (apy / 100) * (days / 365);
}

function StatusBadge({ status }: { status: VaultStatus }) {
  const styles: Record<VaultStatus, { bg: string; text: string; label: string }> = {
    active: { bg: 'bg-blue-500/20', text: 'text-blue-400', label: 'Active' },
    unlocking: { bg: 'bg-amber-500/20', text: 'text-amber-400', label: 'Unlocking' },
    claimable: { bg: 'bg-green-500/20', text: 'text-green-400', label: 'Claimable' },
  };

  const style = styles[status];

  return (
    <span className={cn('px-2 py-1 rounded-full text-xs font-medium', style.bg, style.text)}>
      {style.label}
    </span>
  );
}

function VaultCard({
  vault,
  onClaim,
  isClaimLoading,
}: {
  vault: StakingVault;
  onClaim?: (vaultId: number) => Promise<void>;
  isClaimLoading?: boolean;
}) {
  const timeRemaining = getTimeRemaining(vault.unlocksAt);
  const progress = calculateProgress(vault.stakedAt, vault.unlocksAt);
  const reward = calculateReward(vault.amount, vault.apy, vault.durationDays);
  const isClaimable = timeRemaining.isUnlocked && vault.status !== 'claimable';

  const actualStatus: VaultStatus = timeRemaining.isUnlocked ? 'claimable' : vault.status;

  return (
    <div
      className={cn(
        'p-4 rounded-xl border transition-all duration-200',
        actualStatus === 'claimable'
          ? 'bg-green-500/10 border-green-500/30'
          : 'bg-white/5 border-white/10 hover:border-white/20'
      )}
    >
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-cyan-400 to-blue-600 flex items-center justify-center">
            <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <div>
            <p className="text-sm font-medium text-white">{vault.amount.toLocaleString()} ASTER</p>
            <p className="text-xs text-slate-400">{vault.durationDays} day vault</p>
          </div>
        </div>
        <StatusBadge status={actualStatus} />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-2 gap-3 mb-4">
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-slate-400 mb-1">APY Rate</p>
          <p className="text-sm font-semibold text-purple-400">{vault.apy}%</p>
        </div>
        <div className="p-3 rounded-lg bg-white/5">
          <p className="text-xs text-slate-400 mb-1">Claimable Rewards</p>
          <p className="text-sm font-semibold text-amber-400">+{reward.toFixed(2)} ASTER</p>
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400">Progress</span>
          {timeRemaining.isUnlocked ? (
            <span className="text-xs text-green-400 font-medium">Unlocked!</span>
          ) : (
            <span className="text-xs text-slate-400">
              {timeRemaining.days}d {timeRemaining.hours}h {timeRemaining.minutes}m remaining
            </span>
          )}
        </div>
        <div className="h-2 bg-white/10 rounded-full overflow-hidden">
          <div
            className={cn(
              'h-full rounded-full transition-all duration-1000',
              timeRemaining.isUnlocked
                ? 'bg-gradient-to-r from-green-400 to-emerald-500'
                : 'bg-gradient-to-r from-cyan-400 to-blue-500'
            )}
            style={{ width: `${progress}%` }}
          />
        </div>
      </div>

      {/* Unlock Date */}
      <div className="flex items-center justify-between mb-4">
        <span className="text-xs text-slate-400">Unlock Date</span>
        <span className="text-xs text-white">
          {vault.unlocksAt.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>

      {/* Claim Button */}
      {timeRemaining.isUnlocked && (
        <CyberButton
          variant="gold"
          size="md"
          className="w-full"
          disabled={isClaimLoading}
          onClick={() => onClaim?.(vault.id)}
        >
          {isClaimLoading ? (
            <span className="flex items-center gap-2">
              <svg className="animate-spin h-4 w-4" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Claiming...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
              </svg>
              Claim {(vault.amount + reward).toFixed(2)} ASTER
            </span>
          )}
        </CyberButton>
      )}
    </div>
  );
}

export function ActiveStakes({
  vaults = [],
  onClaim,
  isClaimLoading = null,
}: ActiveStakesProps) {
  const activeVaults = vaults.filter((v) => v.status === 'active' || v.status === 'unlocking' || v.status === 'claimable');

  return (
    <GlassCard className="p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-white flex items-center gap-2">
          <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
          </svg>
          Active Stakes
        </h2>
        <span className="text-xs text-slate-400 bg-white/5 px-2 py-1 rounded-full">
          {activeVaults.length} vault{activeVaults.length !== 1 ? 's' : ''}
        </span>
      </div>

      {activeVaults.length === 0 ? (
        <div className="text-center py-12">
          <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/5 flex items-center justify-center">
            <svg className="w-8 h-8 text-slate-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4" />
            </svg>
          </div>
          <p className="text-slate-400 mb-2">No active stakes</p>
          <p className="text-xs text-slate-500">Stake your ASTER tokens to start earning rewards</p>
        </div>
      ) : (
        <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
          {activeVaults.map((vault) => (
            <VaultCard
              key={vault.id}
              vault={vault}
              onClaim={onClaim}
              isClaimLoading={isClaimLoading === vault.id}
            />
          ))}
        </div>
      )}
    </GlassCard>
  );
}

export default ActiveStakes;
