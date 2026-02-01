'use client';

import { GlassCard } from '@/components/ui/glass-card';

interface StatItem {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: {
    value: number;
    isPositive: boolean;
  };
  color: string;
}

interface PortfolioCardProps {
  totalBalance?: number;
  stakingAmount?: number;
  petLevel?: number;
  arenaWins?: number;
}

export function PortfolioCard({
  totalBalance = 0,
  stakingAmount = 0,
  petLevel = 1,
  arenaWins = 0,
}: PortfolioCardProps) {
  const stats: StatItem[] = [
    {
      label: 'Total Balance',
      value: `$${totalBalance.toLocaleString()}`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
          />
        </svg>
      ),
      trend: { value: 12.5, isPositive: true },
      color: 'cyan',
    },
    {
      label: 'Staking',
      value: `${stakingAmount.toLocaleString()} ASTER`,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
          />
        </svg>
      ),
      trend: { value: 8.2, isPositive: true },
      color: 'purple',
    },
    {
      label: 'Pet Level',
      value: petLevel,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z"
          />
        </svg>
      ),
      color: 'amber',
    },
    {
      label: 'Arena Wins',
      value: arenaWins,
      icon: (
        <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z"
          />
        </svg>
      ),
      trend: { value: 3, isPositive: true },
      color: 'green',
    },
  ];

  const getColorClasses = (color: string) => {
    const colors: Record<string, { bg: string; border: string; text: string; glow: string }> = {
      cyan: {
        bg: 'rgba(0, 243, 255, 0.1)',
        border: 'rgba(0, 243, 255, 0.3)',
        text: 'text-cyan-400',
        glow: 'rgba(0, 243, 255, 0.2)',
      },
      purple: {
        bg: 'rgba(139, 92, 246, 0.1)',
        border: 'rgba(139, 92, 246, 0.3)',
        text: 'text-purple-400',
        glow: 'rgba(139, 92, 246, 0.2)',
      },
      amber: {
        bg: 'rgba(245, 158, 11, 0.1)',
        border: 'rgba(245, 158, 11, 0.3)',
        text: 'text-amber-400',
        glow: 'rgba(245, 158, 11, 0.2)',
      },
      green: {
        bg: 'rgba(34, 197, 94, 0.1)',
        border: 'rgba(34, 197, 94, 0.3)',
        text: 'text-green-400',
        glow: 'rgba(34, 197, 94, 0.2)',
      },
    };
    return colors[color] || colors.cyan;
  };

  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-white">Portfolio Overview</h2>
        <button className="text-xs text-slate-400 hover:text-cyan-400 transition-colors">
          View Details
        </button>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {stats.map((stat, index) => {
          const colorClasses = getColorClasses(stat.color);
          return (
            <div
              key={index}
              className="p-4 rounded-xl transition-all duration-200 hover:scale-[1.02]"
              style={{
                background: colorClasses.bg,
                border: `1px solid ${colorClasses.border}`,
                boxShadow: `0 4px 20px ${colorClasses.glow}`,
              }}
            >
              <div className="flex items-center gap-2 mb-2">
                <span className={colorClasses.text}>{stat.icon}</span>
                <span className="text-xs text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </span>
              </div>

              <div className="flex items-end justify-between">
                <p className={`text-xl font-bold ${colorClasses.text}`}>
                  {stat.value}
                </p>

                {stat.trend && (
                  <div
                    className={`flex items-center gap-1 text-xs ${
                      stat.trend.isPositive ? 'text-green-400' : 'text-red-400'
                    }`}
                  >
                    <svg
                      className={`w-3 h-3 ${!stat.trend.isPositive && 'rotate-180'}`}
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M5 10l7-7m0 0l7 7m-7-7v18"
                      />
                    </svg>
                    <span>{stat.trend.value}%</span>
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </GlassCard>
  );
}

export default PortfolioCard;
