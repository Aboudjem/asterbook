'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export type BorderType =
  | 'simple'
  | 'luminous'
  | 'gradient'
  | 'gold'
  | 'neon'
  | 'fire'
  | 'ice'
  | 'glitch'
  | 'galaxy'
  | 'toxic'
  | 'rainbow-flow'
  | 'lightning'
  | 'steampunk'
  | 'snake'
  | 'retro'
  | 'cosmic-legendary';

export interface AvatarBorderProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Border effect type */
  border?: BorderType;
  /** Fallback initials when no image is provided */
  fallback?: string;
}

const sizeConfig: Record<AvatarSize, { container: string; text: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px]',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
  },
  md: {
    container: 'w-12 h-12',
    text: 'text-sm',
  },
  lg: {
    container: 'w-16 h-16',
    text: 'text-base',
  },
  xl: {
    container: 'w-24 h-24',
    text: 'text-xl',
  },
};

export const AvatarBorder = forwardRef<HTMLDivElement, AvatarBorderProps>(
  ({ src, alt = 'Avatar', size = 'md', border = 'simple', fallback, className, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const config = sizeConfig[size];
    const showFallback = !src || imgError;

    // Generate initials from fallback or alt
    const initials = fallback || alt.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

    // Map border type to CSS class
    const borderClass = `border-${border}`;

    return (
      <div
        ref={ref}
        className={cn(
          borderClass,
          config.container,
          className
        )}
        {...props}
      >
        {showFallback ? (
          <div
            className={cn(
              'w-full h-full rounded-full',
              'flex items-center justify-center',
              'bg-slate-700 avatar-img'
            )}
          >
            <span
              className={cn(
                'font-semibold text-slate-300 select-none',
                config.text
              )}
            >
              {initials}
            </span>
          </div>
        ) : (
          <img
            src={src!}
            alt={alt}
            className="avatar-img"
            onError={() => setImgError(true)}
          />
        )}
      </div>
    );
  }
);

AvatarBorder.displayName = 'AvatarBorder';

// Re-export types for convenience
export type { BorderType as AvatarBorderType };
