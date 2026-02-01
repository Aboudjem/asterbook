'use client';

import { cn } from '@/lib/utils';
import { HTMLAttributes, ReactNode } from 'react';

export interface Tab {
  id: string;
  label: string;
  icon?: ReactNode;
}

export interface ModernTabsProps extends Omit<HTMLAttributes<HTMLDivElement>, 'onChange'> {
  tabs: Tab[];
  activeTab: string;
  onChange: (tabId: string) => void;
}

export function ModernTabs({
  tabs,
  activeTab,
  onChange,
  className,
  ...props
}: ModernTabsProps) {
  return (
    <div
      className={cn(
        // Glass container
        'inline-flex items-center gap-1 p-1',
        'bg-glass-base backdrop-blur-glass',
        'rounded-xl border border-glass-border',
        className
      )}
      role="tablist"
      {...props}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;

        return (
          <button
            key={tab.id}
            role="tab"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={cn(
              // Base tab styles
              'relative px-4 py-2 rounded-lg',
              'flex items-center gap-2',
              'text-sm font-medium',
              'transition-all duration-[220ms] ease-out',
              'focus:outline-none focus-visible:ring-2 focus-visible:ring-aster-cyan/50',
              // Active state
              isActive
                ? [
                    'bg-gradient-to-br from-aster-cyan/20 to-aster-blue/20',
                    'text-white',
                    // Underline glow
                    'after:absolute after:bottom-0 after:left-2 after:right-2',
                    'after:h-0.5 after:rounded-full',
                    'after:bg-gradient-to-r after:from-aster-cyan after:to-aster-blue',
                    'after:shadow-[0_0_8px_rgba(0,243,255,0.5)]',
                  ]
                : [
                    'text-slate-400',
                    'hover:text-slate-200',
                    'hover:bg-white/5',
                  ]
            )}
          >
            {tab.icon && (
              <span className={cn('w-4 h-4', isActive ? 'text-aster-cyan' : 'text-current')}>
                {tab.icon}
              </span>
            )}
            <span>{tab.label}</span>
          </button>
        );
      })}
    </div>
  );
}
