'use client';

import { cn } from '@/lib/utils';
import { ButtonHTMLAttributes, forwardRef } from 'react';

type Variant = 'primary' | 'secondary' | 'gold';
type Size = 'sm' | 'md' | 'lg';

export interface CyberButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: Variant;
  size?: Size;
}

const variantStyles: Record<Variant, string> = {
  primary: cn(
    'bg-gradient-to-br from-aster-cyan to-aster-blue',
    'hover:shadow-glow-cyan',
    'text-white'
  ),
  secondary: cn(
    'bg-gradient-to-br from-aster-blue to-blue-700',
    'hover:shadow-glow-blue',
    'text-white'
  ),
  gold: cn(
    'bg-gradient-to-br from-amber-400 to-aster-gold',
    'hover:shadow-glow-gold',
    'text-slate-900 font-semibold'
  ),
};

const sizeStyles: Record<Size, string> = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export const CyberButton = forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = 'primary', size = 'md', children, disabled, ...props }, ref) => {
    return (
      <button
        ref={ref}
        disabled={disabled}
        className={cn(
          // Base styles
          'relative inline-flex items-center justify-center',
          'rounded-lg font-medium',
          'transition-all duration-200 ease-out',
          'focus:outline-none focus:ring-2 focus:ring-aster-cyan/50 focus:ring-offset-2 focus:ring-offset-slate-900',
          // Active state
          'active:scale-[0.98]',
          // Disabled state
          disabled && 'opacity-50 cursor-not-allowed pointer-events-none',
          // Variant styles
          variantStyles[variant],
          // Size styles
          sizeStyles[size],
          className
        )}
        {...props}
      >
        {children}
      </button>
    );
  }
);

CyberButton.displayName = 'CyberButton';
