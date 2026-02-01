'use client';

import { useState, useMemo } from 'react';
import { GlassCard } from '@/components/ui/glass-card';
import { CyberButton } from '@/components/ui/cyber-button';
import { cn } from '@/lib/utils';

interface DurationOption {
  days: number;
  apy: number;
  label: string;
}

interface StakeFormProps {
  availableBalance?: number;
  onStake?: (amount: number, durationDays: number) => Promise<void>;
  isLoading?: boolean;
}

const DURATION_OPTIONS: DurationOption[] = [
  { days: 7, apy: 5, label: '7 Days' },
  { days: 30, apy: 12, label: '30 Days' },
  { days: 90, apy: 25, label: '90 Days' },
];

export function StakeForm({
  availableBalance = 0,
  onStake,
  isLoading = false,
}: StakeFormProps) {
  const [amount, setAmount] = useState<string>('');
  const [selectedDuration, setSelectedDuration] = useState<DurationOption>(DURATION_OPTIONS[1]);

  const numericAmount = parseFloat(amount) || 0;

  const estimatedReward = useMemo(() => {
    if (!numericAmount || !selectedDuration) return 0;
    return numericAmount * (selectedDuration.apy / 100) * (selectedDuration.days / 365);
  }, [numericAmount, selectedDuration]);

  const handleMaxClick = () => {
    setAmount(availableBalance.toString());
  };

  const handleAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value === '' || /^\d*\.?\d*$/.test(value)) {
      setAmount(value);
    }
  };

  const handleStake = async () => {
    if (onStake && numericAmount > 0 && numericAmount <= availableBalance) {
      await onStake(numericAmount, selectedDuration.days);
      setAmount('');
    }
  };

  const isValid = numericAmount > 0 && numericAmount <= availableBalance;

  return (
    <GlassCard className="p-6">
      <h2 className="text-lg font-semibold text-white mb-6 flex items-center gap-2">
        <svg className="w-5 h-5 text-cyan-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        Stake ASTER
      </h2>

      {/* Available Balance */}
      <div className="mb-6 p-3 rounded-lg bg-white/5 border border-white/10">
        <div className="flex items-center justify-between">
          <span className="text-sm text-slate-400">Available Balance</span>
          <span className="text-sm font-medium text-white">
            {availableBalance.toLocaleString()} ASTER
          </span>
        </div>
      </div>

      {/* Amount Input */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-2">Amount to Stake</label>
        <div className="relative">
          <input
            type="text"
            value={amount}
            onChange={handleAmountChange}
            placeholder="0.00"
            className={cn(
              'w-full px-4 py-3 pr-20 rounded-xl',
              'bg-white/5 border border-white/10',
              'text-white text-lg font-medium placeholder-slate-500',
              'focus:outline-none focus:border-cyan-400/50 focus:ring-2 focus:ring-cyan-400/20',
              'transition-all duration-200'
            )}
          />
          <button
            onClick={handleMaxClick}
            className="absolute right-2 top-1/2 -translate-y-1/2 px-3 py-1.5 text-xs font-medium text-cyan-400 hover:text-cyan-300 bg-cyan-400/10 hover:bg-cyan-400/20 rounded-lg transition-all"
          >
            MAX
          </button>
        </div>
        {numericAmount > availableBalance && (
          <p className="mt-2 text-xs text-red-400">Insufficient balance</p>
        )}
      </div>

      {/* Duration Selection */}
      <div className="mb-6">
        <label className="block text-sm text-slate-400 mb-3">Lock Duration</label>
        <div className="grid grid-cols-3 gap-3">
          {DURATION_OPTIONS.map((option) => (
            <button
              key={option.days}
              onClick={() => setSelectedDuration(option)}
              className={cn(
                'p-4 rounded-xl border transition-all duration-200',
                'flex flex-col items-center gap-1',
                selectedDuration.days === option.days
                  ? 'bg-cyan-400/10 border-cyan-400/50 shadow-[0_0_20px_rgba(0,243,255,0.15)]'
                  : 'bg-white/5 border-white/10 hover:border-white/20 hover:bg-white/10'
              )}
            >
              <span className={cn(
                'text-sm font-medium',
                selectedDuration.days === option.days ? 'text-cyan-400' : 'text-white'
              )}>
                {option.label}
              </span>
              <span className={cn(
                'text-lg font-bold',
                selectedDuration.days === option.days ? 'text-cyan-400' : 'text-slate-300'
              )}>
                {option.apy}%
              </span>
              <span className="text-xs text-slate-500">APY</span>
            </button>
          ))}
        </div>
      </div>

      {/* Estimated Rewards */}
      <div className="mb-6 p-4 rounded-xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/20">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 text-amber-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v13m0-13V6a2 2 0 112 2h-2zm0 0V5.5A2.5 2.5 0 109.5 8H12zm-7 4h14M5 12a2 2 0 110-4h14a2 2 0 110 4M5 12v7a2 2 0 002 2h10a2 2 0 002-2v-7" />
            </svg>
            <span className="text-sm text-slate-300">Estimated Rewards</span>
          </div>
          <span className="text-lg font-bold text-amber-400">
            +{estimatedReward.toLocaleString(undefined, { maximumFractionDigits: 2 })} ASTER
          </span>
        </div>
        <p className="mt-2 text-xs text-slate-400">
          After {selectedDuration.days} days at {selectedDuration.apy}% APY
        </p>
      </div>

      {/* Summary */}
      {numericAmount > 0 && (
        <div className="mb-6 space-y-2 text-sm">
          <div className="flex justify-between text-slate-400">
            <span>You will stake</span>
            <span className="text-white">{numericAmount.toLocaleString()} ASTER</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>Lock period</span>
            <span className="text-white">{selectedDuration.days} days</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>APY</span>
            <span className="text-cyan-400">{selectedDuration.apy}%</span>
          </div>
          <div className="flex justify-between text-slate-400">
            <span>You will receive</span>
            <span className="text-amber-400 font-medium">
              ~{(numericAmount + estimatedReward).toLocaleString(undefined, { maximumFractionDigits: 2 })} ASTER
            </span>
          </div>
        </div>
      )}

      {/* Stake Button */}
      <CyberButton
        variant="primary"
        size="lg"
        className="w-full"
        disabled={!isValid || isLoading}
        onClick={handleStake}
      >
        {isLoading ? (
          <span className="flex items-center gap-2">
            <svg className="animate-spin h-5 w-5" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
            Staking...
          </span>
        ) : (
          <span className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            Stake Now
          </span>
        )}
      </CyberButton>

      {/* Info */}
      <p className="mt-4 text-xs text-center text-slate-500">
        Your tokens will be locked for the selected duration. Rewards are calculated and distributed upon unlock.
      </p>
    </GlassCard>
  );
}

export default StakeForm;
