'use client';

import { cn } from '@/lib/utils';
import { CyberButton } from '@/components/ui/cyber-button';
import { GameCategory, GameStatus } from './game-card';

export interface FeaturedBannerProps {
  title: string;
  description: string;
  imageUrl?: string;
  category: GameCategory;
  status: GameStatus;
  playersOnline?: number;
  onPlay?: () => void;
}

const categoryLabels: Record<GameCategory, string> = {
  arcade: 'Arcade',
  betting: 'Betting',
  strategy: 'Strategy',
  premium: 'Premium',
  staking: 'Staking',
};

export function FeaturedBanner({
  title,
  description,
  imageUrl,
  category,
  status,
  playersOnline,
  onPlay,
}: FeaturedBannerProps) {
  const isPlayable = status === 'live' || status === 'new';

  return (
    <div className="relative w-full rounded-2xl overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover"
          />
        ) : (
          <div className="w-full h-full bg-gradient-to-br from-slate-800 via-slate-900 to-aster-deep" />
        )}
      </div>

      {/* Gradient Overlays */}
      <div className="absolute inset-0 bg-gradient-to-r from-slate-900/95 via-slate-900/70 to-transparent" />
      <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-slate-900/20" />

      {/* Animated Glow Effect */}
      <div className="absolute inset-0 overflow-hidden">
        <div
          className={cn(
            'absolute -top-1/2 -left-1/2 w-full h-full',
            'bg-gradient-radial from-aster-cyan/20 to-transparent',
            'animate-pulse-slow',
            'blur-3xl'
          )}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 p-8 md:p-12 lg:p-16 min-h-[300px] md:min-h-[400px] flex flex-col justify-end">
        {/* Featured Badge */}
        <div className="flex items-center gap-3 mb-4">
          <span className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-aster-cyan/20 border border-aster-cyan/30 text-aster-cyan text-xs font-semibold uppercase tracking-wider">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 24 24">
              <path d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
            </svg>
            Featured Game
          </span>
          <span className="px-3 py-1 rounded-full bg-white/10 border border-white/10 text-slate-300 text-xs font-medium">
            {categoryLabels[category]}
          </span>
        </div>

        {/* Title */}
        <h1 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 max-w-xl">
          <span className="bg-gradient-to-r from-white via-slate-100 to-slate-300 bg-clip-text text-transparent">
            {title}
          </span>
        </h1>

        {/* Description */}
        <p className="text-slate-300 text-base md:text-lg mb-6 max-w-xl line-clamp-2">
          {description}
        </p>

        {/* Stats & Actions */}
        <div className="flex flex-wrap items-center gap-4">
          {/* Play Button */}
          <CyberButton
            variant="primary"
            size="lg"
            onClick={onPlay}
            disabled={!isPlayable}
            className="min-w-[160px]"
          >
            <svg className="w-5 h-5 mr-2" fill="currentColor" viewBox="0 0 24 24">
              <path d="M8 5v14l11-7z" />
            </svg>
            Play Now
          </CyberButton>

          {/* Secondary Info */}
          <div className="flex items-center gap-6 text-slate-400">
            {/* Live Indicator */}
            {status === 'live' && (
              <div className="flex items-center gap-2">
                <span className="relative flex h-2.5 w-2.5">
                  <span className="absolute inline-flex h-full w-full rounded-full bg-emerald-500 opacity-75 animate-ping" />
                  <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" />
                </span>
                <span className="text-sm font-medium text-emerald-400">Live Now</span>
              </div>
            )}

            {/* Players Count */}
            {playersOnline !== undefined && (
              <div className="flex items-center gap-2 text-sm">
                <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                  />
                </svg>
                <span>{playersOnline.toLocaleString()} playing now</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Decorative Border */}
      <div className="absolute inset-0 rounded-2xl border border-white/10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-aster-cyan/50 to-transparent" />
    </div>
  );
}

export default FeaturedBanner;
