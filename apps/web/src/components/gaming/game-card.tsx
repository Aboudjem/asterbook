'use client';

import { cn } from '@/lib/utils';
import { GlassCard } from '@/components/ui/glass-card';
import { CyberButton } from '@/components/ui/cyber-button';

export type GameCategory = 'arcade' | 'betting' | 'strategy' | 'premium' | 'staking';
export type GameStatus = 'live' | 'coming_soon' | 'new' | 'maintenance';

export interface GameCardProps {
  id: string;
  title: string;
  description?: string;
  imageUrl?: string;
  category: GameCategory;
  status: GameStatus;
  playersOnline?: number;
  onClick?: () => void;
}

const categoryStyles: Record<GameCategory, { bg: string; text: string; label: string }> = {
  arcade: {
    bg: 'bg-gradient-to-r from-purple-500/20 to-pink-500/20',
    text: 'text-purple-400',
    label: 'Arcade',
  },
  betting: {
    bg: 'bg-gradient-to-r from-amber-500/20 to-orange-500/20',
    text: 'text-amber-400',
    label: 'Betting',
  },
  strategy: {
    bg: 'bg-gradient-to-r from-blue-500/20 to-cyan-500/20',
    text: 'text-blue-400',
    label: 'Strategy',
  },
  premium: {
    bg: 'bg-gradient-to-r from-yellow-400/20 to-amber-500/20',
    text: 'text-yellow-400',
    label: 'Premium',
  },
  staking: {
    bg: 'bg-gradient-to-r from-emerald-500/20 to-teal-500/20',
    text: 'text-emerald-400',
    label: 'Staking',
  },
};

const statusConfig: Record<GameStatus, { color: string; label: string; pulse: boolean }> = {
  live: {
    color: 'bg-emerald-500',
    label: 'Live',
    pulse: true,
  },
  coming_soon: {
    color: 'bg-slate-500',
    label: 'Coming Soon',
    pulse: false,
  },
  new: {
    color: 'bg-aster-cyan',
    label: 'New',
    pulse: true,
  },
  maintenance: {
    color: 'bg-amber-500',
    label: 'Maintenance',
    pulse: false,
  },
};

export function GameCard({
  title,
  description,
  imageUrl,
  category,
  status,
  playersOnline,
  onClick,
}: GameCardProps) {
  const categoryStyle = categoryStyles[category];
  const statusStyle = statusConfig[status];
  const isPlayable = status === 'live' || status === 'new';

  return (
    <GlassCard className="overflow-hidden group">
      {/* Image Preview */}
      <div className="relative aspect-[16/10] bg-slate-800 overflow-hidden">
        {imageUrl ? (
          <img
            src={imageUrl}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-slate-800 to-slate-900">
            <GameIcon category={category} className="w-16 h-16 text-slate-600" />
          </div>
        )}

        {/* Gradient Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-900/90 via-slate-900/30 to-transparent" />

        {/* Status Indicator */}
        <div className="absolute top-3 left-3 flex items-center gap-2">
          <span className="relative flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900/80 backdrop-blur-sm border border-white/10">
            <span className="relative flex h-2 w-2">
              {statusStyle.pulse && (
                <span
                  className={cn(
                    'absolute inline-flex h-full w-full rounded-full opacity-75 animate-ping',
                    statusStyle.color
                  )}
                />
              )}
              <span className={cn('relative inline-flex h-2 w-2 rounded-full', statusStyle.color)} />
            </span>
            <span className="text-xs font-medium text-white">{statusStyle.label}</span>
          </span>
        </div>

        {/* Category Badge */}
        <div className="absolute top-3 right-3">
          <span
            className={cn(
              'px-2.5 py-1 rounded-full text-xs font-medium border border-white/10',
              categoryStyle.bg,
              categoryStyle.text
            )}
          >
            {categoryStyle.label}
          </span>
        </div>

        {/* Players Online */}
        {playersOnline !== undefined && status === 'live' && (
          <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-slate-300 text-xs">
            <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
              />
            </svg>
            <span>{playersOnline.toLocaleString()} playing</span>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="text-lg font-semibold text-white mb-1 group-hover:text-aster-cyan transition-colors">
          {title}
        </h3>
        {description && (
          <p className="text-sm text-slate-400 mb-4 line-clamp-2">{description}</p>
        )}

        {/* Play Button */}
        <CyberButton
          variant={isPlayable ? 'primary' : 'secondary'}
          size="sm"
          className="w-full"
          disabled={!isPlayable}
          onClick={onClick}
        >
          {status === 'coming_soon' ? (
            'Coming Soon'
          ) : status === 'maintenance' ? (
            'Under Maintenance'
          ) : (
            <>
              <svg className="w-4 h-4 mr-2" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z" />
              </svg>
              Play Now
            </>
          )}
        </CyberButton>
      </div>
    </GlassCard>
  );
}

// Game icon component based on category
function GameIcon({ category, className }: { category: GameCategory; className?: string }) {
  switch (category) {
    case 'arcade':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
          />
        </svg>
      );
    case 'betting':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      );
    case 'strategy':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
          />
        </svg>
      );
    case 'premium':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      );
    case 'staking':
      return (
        <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={1.5}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      );
  }
}

export default GameCard;
