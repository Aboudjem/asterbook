'use client';

import { GlassCard } from '@/components/ui/glass-card';

interface WhaleAlert {
  id: string;
  address: string;
  amount: number;
  token: string;
  type: 'buy' | 'sell' | 'transfer';
  timeAgo: string;
}

const mockAlerts: WhaleAlert[] = [
  { id: '1', address: '0x742d35Cc6634C0532925a3b844Bc9e7595f1aEf2', amount: 125000, token: 'ASTER', type: 'buy', timeAgo: '2m ago' },
  { id: '2', address: '0x9F8F72aA9304c8B593d555F12eF6589cC3A579A2', amount: 85000, token: 'ASTER', type: 'sell', timeAgo: '5m ago' },
  { id: '3', address: '0x3F5CE5FBFe3E9af3971dD833D26bA9b5C936f0bE', amount: 250000, token: 'ASTER', type: 'transfer', timeAgo: '8m ago' },
  { id: '4', address: '0x6B175474E89094C44Da98b954EesdfhA3B1', amount: 175000, token: 'ASTER', type: 'buy', timeAgo: '12m ago' },
  { id: '5', address: '0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984', amount: 95000, token: 'ASTER', type: 'sell', timeAgo: '15m ago' },
];

function truncateAddress(address: string): string {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

const typeConfig = {
  buy: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
      </svg>
    ),
    color: 'text-green-400',
    bg: 'rgba(34, 197, 94, 0.1)',
    border: 'rgba(34, 197, 94, 0.2)',
  },
  sell: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
      </svg>
    ),
    color: 'text-red-400',
    bg: 'rgba(239, 68, 68, 0.1)',
    border: 'rgba(239, 68, 68, 0.2)',
  },
  transfer: {
    icon: (
      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4" />
      </svg>
    ),
    color: 'text-cyan-400',
    bg: 'rgba(0, 243, 255, 0.1)',
    border: 'rgba(0, 243, 255, 0.2)',
  },
};

export function WhaleAlerts() {
  return (
    <GlassCard className="p-5">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <span className="text-xl">🐋</span>
          <h2 className="text-lg font-semibold text-white">Whale Alerts</h2>
        </div>
        <span className="text-xs text-slate-400">Live</span>
      </div>

      <div className="space-y-3">
        {mockAlerts.map((alert, index) => {
          const config = typeConfig[alert.type];
          return (
            <div
              key={alert.id}
              className="flex items-center gap-3 p-3 rounded-lg transition-all duration-200 hover:bg-white/5"
              style={{
                animation: `fadeIn 0.3s ease-out ${index * 0.1}s both`,
              }}
            >
              {/* Type Icon */}
              <div
                className={`w-8 h-8 rounded-lg flex items-center justify-center ${config.color}`}
                style={{
                  background: config.bg,
                  border: `1px solid ${config.border}`,
                }}
              >
                {config.icon}
              </div>

              {/* Address & Amount */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2">
                  <span className="text-slate-300 font-mono text-sm">
                    {truncateAddress(alert.address)}
                  </span>
                  <button
                    className="text-slate-500 hover:text-slate-300 transition-colors"
                    onClick={() => navigator.clipboard.writeText(alert.address)}
                    title="Copy address"
                  >
                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
                      />
                    </svg>
                  </button>
                </div>
                <p className={`text-sm font-semibold ${config.color}`}>
                  {alert.type === 'sell' ? '-' : '+'}{alert.amount.toLocaleString()} {alert.token}
                </p>
              </div>

              {/* Time */}
              <span className="text-xs text-slate-500">{alert.timeAgo}</span>
            </div>
          );
        })}
      </div>

      <style jsx>{`
        @keyframes fadeIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
      `}</style>
    </GlassCard>
  );
}

export default WhaleAlerts;
