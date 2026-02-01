'use client';

import { useState } from 'react';
import { GlassCard } from '@/components/ui/glass-card';

type PetStage = 'egg' | 'baby' | 'adult';

interface PetWidgetProps {
  petName?: string;
  stage?: PetStage;
  hunger?: number; // 0-100
  isOnExpedition?: boolean;
  expeditionTimeLeft?: string;
  onFeed?: () => void;
}

const stageEmojis: Record<PetStage, string> = {
  egg: '🥚',
  baby: '🐲',
  adult: '🐉',
};

const stageLabels: Record<PetStage, string> = {
  egg: 'Egg',
  baby: 'Baby Dragon',
  adult: 'Adult Dragon',
};

export function PetWidget({
  petName = 'Your Pet',
  stage = 'egg',
  hunger = 75,
  isOnExpedition = false,
  expeditionTimeLeft = '2h 30m',
  onFeed,
}: PetWidgetProps) {
  const [isFeeding, setIsFeeding] = useState(false);

  const handleFeed = () => {
    if (isFeeding || isOnExpedition) return;
    setIsFeeding(true);
    onFeed?.();
    setTimeout(() => setIsFeeding(false), 1000);
  };

  // Calculate hunger bar color based on value
  const getHungerColor = () => {
    if (hunger < 30) return 'from-red-500 to-red-400';
    if (hunger < 60) return 'from-orange-500 to-yellow-400';
    return 'from-green-500 to-emerald-400';
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">My Pet</h2>
        <span className="text-xs px-2 py-1 rounded-full bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
          {stageLabels[stage]}
        </span>
      </div>

      {/* Pet Avatar with bouncing animation */}
      <div className="flex flex-col items-center mb-5">
        <div
          className="relative"
          style={{
            animation: isOnExpedition ? 'none' : 'bounce 2s ease-in-out infinite',
          }}
        >
          <div
            className="text-7xl select-none"
            style={{
              filter: isOnExpedition ? 'grayscale(0.5) opacity(0.6)' : 'none',
            }}
          >
            {stageEmojis[stage]}
          </div>

          {/* Glow effect */}
          <div
            className="absolute inset-0 -z-10 blur-2xl rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(0, 243, 255, 0.3) 0%, transparent 70%)',
            }}
          />
        </div>

        <p className="mt-2 text-white font-medium">{petName}</p>
      </div>

      {/* Expedition Status */}
      {isOnExpedition && (
        <div
          className="mb-4 p-3 rounded-lg text-center"
          style={{
            background: 'rgba(139, 92, 246, 0.15)',
            border: '1px solid rgba(139, 92, 246, 0.3)',
          }}
        >
          <p className="text-purple-400 text-sm font-medium flex items-center justify-center gap-2">
            <svg
              className="w-4 h-4 animate-pulse"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M13 10V3L4 14h7v7l9-11h-7z"
              />
            </svg>
            On Expedition
          </p>
          <p className="text-purple-300 text-xs mt-1">
            Returns in: <span className="font-mono">{expeditionTimeLeft}</span>
          </p>
        </div>
      )}

      {/* Hunger Bar */}
      <div className="mb-4">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs text-slate-400 uppercase tracking-wider">Hunger</span>
          <span className="text-xs text-slate-300 font-medium">{hunger}%</span>
        </div>
        <div className="h-3 rounded-full bg-slate-700/50 overflow-hidden">
          <div
            className={`h-full rounded-full bg-gradient-to-r ${getHungerColor()} transition-all duration-500`}
            style={{ width: `${hunger}%` }}
          />
        </div>
      </div>

      {/* Feed Button */}
      <button
        onClick={handleFeed}
        disabled={isFeeding || isOnExpedition}
        className="w-full py-3 rounded-lg font-semibold text-white transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
        style={{
          background: isFeeding
            ? 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)'
            : 'linear-gradient(135deg, #00f3ff 0%, #3b82f6 100%)',
          boxShadow: isFeeding
            ? '0 4px 15px rgba(34, 197, 94, 0.4)'
            : '0 4px 15px rgba(0, 243, 255, 0.3)',
        }}
      >
        {isFeeding ? (
          <span className="flex items-center justify-center gap-2">
            <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Feeding...
          </span>
        ) : isOnExpedition ? (
          'Pet is Away'
        ) : (
          <span className="flex items-center justify-center gap-2">
            <span>🍖</span> Feed Pet
          </span>
        )}
      </button>

      <style jsx>{`
        @keyframes bounce {
          0%,
          100% {
            transform: translateY(0);
          }
          50% {
            transform: translateY(-8px);
          }
        }
      `}</style>
    </GlassCard>
  );
}

export default PetWidget;
