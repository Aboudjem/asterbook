'use client';

import { cn } from '@/lib/utils';
import { GameCategory } from './game-card';

export type FilterCategory = 'all' | GameCategory;

export interface CategoryFilterProps {
  activeCategory: FilterCategory;
  onChange: (category: FilterCategory) => void;
}

interface FilterOption {
  id: FilterCategory;
  label: string;
  icon: React.ReactNode;
}

const filterOptions: FilterOption[] = [
  {
    id: 'all',
    label: 'All Games',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
        />
      </svg>
    ),
  },
  {
    id: 'arcade',
    label: 'Arcade',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M15 5v2m0 4v2m0 4v2M5 5a2 2 0 00-2 2v3a2 2 0 110 4v3a2 2 0 002 2h14a2 2 0 002-2v-3a2 2 0 110-4V7a2 2 0 00-2-2H5z"
        />
      </svg>
    ),
  },
  {
    id: 'betting',
    label: 'Betting',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
        />
      </svg>
    ),
  },
  {
    id: 'strategy',
    label: 'Strategy',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M9 3v2m6-2v2M9 19v2m6-2v2M5 9H3m2 6H3m18-6h-2m2 6h-2M7 19h10a2 2 0 002-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10a2 2 0 002 2zM9 9h6v6H9V9z"
        />
      </svg>
    ),
  },
  {
    id: 'premium',
    label: 'Premium',
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth={2}
          d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
        />
      </svg>
    ),
  },
];

export function CategoryFilter({ activeCategory, onChange }: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {filterOptions.map((option) => {
        const isActive = option.id === activeCategory;

        return (
          <button
            key={option.id}
            onClick={() => onChange(option.id)}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-2 rounded-full',
              'text-sm font-medium',
              'transition-all duration-200 ease-out',
              'border',
              isActive
                ? [
                    'bg-gradient-to-r from-aster-cyan/20 to-aster-blue/20',
                    'border-aster-cyan/40',
                    'text-white',
                    'shadow-glow-cyan',
                  ]
                : [
                    'bg-glass-base',
                    'border-glass-border',
                    'text-slate-400',
                    'hover:text-white',
                    'hover:bg-white/5',
                    'hover:border-white/15',
                  ]
            )}
          >
            <span className={cn(isActive ? 'text-aster-cyan' : 'text-current')}>
              {option.icon}
            </span>
            <span>{option.label}</span>
          </button>
        );
      })}
    </div>
  );
}

export default CategoryFilter;
