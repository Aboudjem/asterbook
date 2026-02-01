'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes } from 'react';

type Status = 'online' | 'offline' | 'warning' | 'error';

export interface StatusIndicatorProps extends HTMLAttributes<HTMLDivElement> {
  status: Status;
  label?: string;
  pulse?: boolean;
}

const statusColors: Record<Status, { dot: string; text: string }> = {
  online: {
    dot: 'bg-emerald-500',
    text: 'text-emerald-400',
  },
  offline: {
    dot: 'bg-slate-500',
    text: 'text-slate-400',
  },
  warning: {
    dot: 'bg-amber-500',
    text: 'text-amber-400',
  },
  error: {
    dot: 'bg-red-500',
    text: 'text-red-400',
  },
};

export function StatusIndicator({
  status,
  label,
  pulse = status === 'online',
  className,
  ...props
}: StatusIndicatorProps) {
  const colors = statusColors[status];

  return (
    <div
      className={cn('inline-flex items-center gap-2', className)}
      {...props}
    >
      {/* Status dot */}
      <span className="relative flex h-2.5 w-2.5">
        {/* Pulse animation ring */}
        {pulse && (
          <span
            className={cn(
              'absolute inline-flex h-full w-full rounded-full opacity-75',
              colors.dot,
              'animate-ping'
            )}
          />
        )}
        {/* Solid dot */}
        <span
          className={cn(
            'relative inline-flex h-2.5 w-2.5 rounded-full',
            colors.dot
          )}
        />
      </span>

      {/* Optional label */}
      {label && (
        <span className={cn('text-sm font-medium capitalize', colors.text)}>
          {label}
        </span>
      )}
    </div>
  );
}
