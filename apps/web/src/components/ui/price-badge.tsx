'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type Currency = 'stardust' | 'aster';

export interface PriceBadgeProps extends HTMLAttributes<HTMLDivElement> {
  amount: number | string;
  currency?: Currency;
  animated?: boolean;
}

const currencyConfig: Record<Currency, { symbol: string; color: string; icon: string }> = {
  stardust: {
    symbol: 'SD',
    color: 'text-stardust',
    icon: 'star', // Unicode star
  },
  aster: {
    symbol: 'AST',
    color: 'text-aster-cyan',
    icon: 'sparkles', // Unicode sparkles
  },
};

// SVG icons for currencies
function StardustIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 2L14.09 8.26L21 9.27L16.5 13.14L17.82 20L12 16.77L6.18 20L7.5 13.14L3 9.27L9.91 8.26L12 2Z" />
    </svg>
  );
}

function AsterIcon({ className }: { className?: string }) {
  return (
    <svg
      className={className}
      viewBox="0 0 24 24"
      fill="currentColor"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path d="M12 3L14.5 8.5L20 9.5L16 13.5L17 19L12 16.5L7 19L8 13.5L4 9.5L9.5 8.5L12 3Z" />
      <circle cx="12" cy="12" r="3" fill="currentColor" opacity="0.5" />
    </svg>
  );
}

export function PriceBadge({
  amount,
  currency = 'stardust',
  animated = false,
  className,
  ...props
}: PriceBadgeProps) {
  const config = currencyConfig[currency];

  // Format amount with commas
  const formattedAmount =
    typeof amount === 'number' ? amount.toLocaleString() : amount;

  return (
    <div
      className={cn(
        'inline-flex items-center gap-1.5',
        'px-3 py-1.5 rounded-full',
        'bg-glass-card backdrop-blur-sm',
        'border border-glass-border',
        className
      )}
      {...props}
    >
      {/* Currency icon */}
      <span className={cn('flex-shrink-0', config.color)}>
        {currency === 'stardust' ? (
          <StardustIcon className="w-4 h-4" />
        ) : (
          <AsterIcon className="w-4 h-4" />
        )}
      </span>

      {/* Amount */}
      <span
        className={cn(
          'font-semibold text-sm tabular-nums',
          animated
            ? [
                'bg-gradient-to-r',
                currency === 'stardust'
                  ? 'from-amber-300 via-yellow-500 to-amber-300'
                  : 'from-aster-cyan via-blue-400 to-aster-cyan',
                'bg-[length:200%_auto]',
                'bg-clip-text text-transparent',
                'animate-gradient-spin',
              ]
            : config.color
        )}
      >
        {formattedAmount}
      </span>

      {/* Currency symbol */}
      <span className="text-xs text-slate-400 uppercase">{config.symbol}</span>
    </div>
  );
}
