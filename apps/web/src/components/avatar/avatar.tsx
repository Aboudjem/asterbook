'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef, useState } from 'react';

export type AvatarSize = 'xs' | 'sm' | 'md' | 'lg' | 'xl';

export interface AvatarProps extends Omit<HTMLAttributes<HTMLDivElement>, 'children'> {
  /** Image source URL */
  src?: string | null;
  /** Alt text for the image */
  alt?: string;
  /** Size of the avatar */
  size?: AvatarSize;
  /** Show online status indicator */
  online?: boolean;
  /** Fallback initials when no image is provided */
  fallback?: string;
}

const sizeConfig: Record<AvatarSize, { container: string; text: string; status: string }> = {
  xs: {
    container: 'w-6 h-6',
    text: 'text-[10px]',
    status: 'w-1.5 h-1.5 border',
  },
  sm: {
    container: 'w-8 h-8',
    text: 'text-xs',
    status: 'w-2 h-2 border',
  },
  md: {
    container: 'w-12 h-12',
    text: 'text-sm',
    status: 'w-2.5 h-2.5 border-2',
  },
  lg: {
    container: 'w-16 h-16',
    text: 'text-base',
    status: 'w-3 h-3 border-2',
  },
  xl: {
    container: 'w-24 h-24',
    text: 'text-xl',
    status: 'w-4 h-4 border-2',
  },
};

export const Avatar = forwardRef<HTMLDivElement, AvatarProps>(
  ({ src, alt = 'Avatar', size = 'md', online, fallback, className, ...props }, ref) => {
    const [imgError, setImgError] = useState(false);
    const config = sizeConfig[size];
    const showFallback = !src || imgError;

    // Generate initials from fallback or alt
    const initials = fallback || alt.split(' ').map(word => word[0]).join('').toUpperCase().slice(0, 2);

    return (
      <div
        ref={ref}
        className={cn(
          'relative inline-flex items-center justify-center',
          'rounded-full overflow-hidden',
          'bg-slate-700',
          config.container,
          className
        )}
        {...props}
      >
        {showFallback ? (
          <span
            className={cn(
              'font-semibold text-slate-300 select-none',
              config.text
            )}
          >
            {initials}
          </span>
        ) : (
          <img
            src={src!}
            alt={alt}
            className="w-full h-full object-cover"
            onError={() => setImgError(true)}
          />
        )}

        {/* Online status indicator */}
        {online !== undefined && (
          <span
            className={cn(
              'absolute bottom-0 right-0',
              'rounded-full border-slate-900',
              config.status,
              online ? 'bg-emerald-500' : 'bg-slate-500'
            )}
          />
        )}
      </div>
    );
  }
);

Avatar.displayName = 'Avatar';
