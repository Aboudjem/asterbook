'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export interface GlassCardProps extends HTMLAttributes<HTMLDivElement> {
  hover?: boolean;
  children: React.ReactNode;
}

export const GlassCard = forwardRef<HTMLDivElement, GlassCardProps>(
  ({ className, children, hover = true, ...props }, ref) => {
    return (
      <div
        ref={ref}
        className={cn(
          // Base glass morphism styles
          'relative rounded-glass',
          'bg-glass-card backdrop-blur-glass',
          'border border-glass-border',
          'shadow-glass',
          // Hover effect
          hover && [
            'transition-all duration-300 ease-out',
            'hover:-translate-y-1',
            'hover:shadow-[0_12px_40px_rgba(0,0,0,0.45)]',
            'hover:border-white/12',
          ],
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

GlassCard.displayName = 'GlassCard';
