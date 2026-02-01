'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, forwardRef } from 'react';

export type NameEffectType =
  | 'rainbow'
  | 'neon-blue'
  | 'fire'
  | 'glitch'
  | 'gold'
  | 'ghost'
  | 'matrix'
  | 'thunder'
  | 'ice'
  | 'blood'
  | 'cosmic'
  | 'toxic'
  | 'cyberpunk'
  | 'vaporwave'
  | 'stealth'
  | 'magma'
  | 'hologram'
  | 'retro'
  | 'royal'
  | 'shadow';

export interface NameEffectProps extends Omit<HTMLAttributes<HTMLSpanElement>, 'children'> {
  /** The name to display */
  name: string;
  /** The effect type to apply */
  effect?: NameEffectType;
}

export const NameEffect = forwardRef<HTMLSpanElement, NameEffectProps>(
  ({ name, effect = 'rainbow', className, ...props }, ref) => {
    // Map effect type to CSS class
    const effectClass = `name-effect-${effect}`;

    // For glitch effect, we need data-text attribute for the pseudo-elements
    const dataAttributes = effect === 'glitch' ? { 'data-text': name } : {};

    return (
      <span
        ref={ref}
        className={cn(effectClass, className)}
        {...dataAttributes}
        {...props}
      >
        {name}
      </span>
    );
  }
);

NameEffect.displayName = 'NameEffect';
