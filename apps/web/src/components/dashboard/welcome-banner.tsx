'use client';

import { GlassCard } from '@/components/ui/glass-card';
import { cn } from '@/lib/utils';

interface WelcomeBannerProps {
  username: string;
  stardustBalance?: number;
  onlineTime?: string;
}

export function WelcomeBanner({
  username,
  stardustBalance = 0,
  onlineTime = '0h 0m',
}: WelcomeBannerProps) {
  return (
    <GlassCard
      hover={false}
      className={cn(
        'relative overflow-hidden p-6',
        'bg-gradient-to-r from-glass-card to-transparent'
      )}
    >
      {/* Gradient accent bar */}
      <div
        className="absolute top-0 left-0 right-0 h-1"
        style={{
          background: 'linear-gradient(90deg, #00f3ff 0%, #3b82f6 50%, #8b5cf6 100%)',
        }}
      />

      {/* Pulse animation overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          background:
            'radial-gradient(circle at 80% 50%, rgba(0, 243, 255, 0.15) 0%, transparent 50%)',
          animation: 'pulse 4s ease-in-out infinite',
        }}
      />

      <div className="relative z-10 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Greeting */}
        <div>
          <h1 className="text-2xl md:text-3xl font-bold text-white mb-1">
            Welcome back,{' '}
            <span className="bg-gradient-to-r from-cyan-400 to-blue-500 bg-clip-text text-transparent">
              {username}
            </span>
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Ready for your next adventure?
          </p>
        </div>

        {/* Quick Stats */}
        <div className="flex items-center gap-6">
          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(245, 158, 11, 0.2) 0%, rgba(245, 158, 11, 0.05) 100%)',
                border: '1px solid rgba(245, 158, 11, 0.3)',
              }}
            >
              <span className="text-lg">&#10024;</span>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Stardust</p>
              <p className="text-lg font-bold text-amber-400">
                {stardustBalance.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="w-px h-10 bg-white/10" />

          <div className="flex items-center gap-2">
            <div
              className="w-10 h-10 rounded-lg flex items-center justify-center"
              style={{
                background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.2) 0%, rgba(34, 197, 94, 0.05) 100%)',
                border: '1px solid rgba(34, 197, 94, 0.3)',
              }}
            >
              <svg className="w-5 h-5 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <div>
              <p className="text-xs text-slate-400 uppercase tracking-wider">Online</p>
              <p className="text-lg font-bold text-green-400">{onlineTime}</p>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes pulse {
          0%, 100% {
            opacity: 0.1;
            transform: scale(1);
          }
          50% {
            opacity: 0.25;
            transform: scale(1.05);
          }
        }
      `}</style>
    </GlassCard>
  );
}

export default WelcomeBanner;
