'use client';

import { cn } from '@/lib/utils';

interface WinProbabilityProps {
  probability: number; // 0-1
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export function WinProbability({ probability, size = 'md', showLabel = true }: WinProbabilityProps) {
  const percentage = Math.round(probability * 100);

  // Color based on probability
  const getColor = () => {
    if (percentage < 40) return { stroke: '#ef4444', glow: 'rgba(239, 68, 68, 0.5)' }; // red
    if (percentage < 60) return { stroke: '#eab308', glow: 'rgba(234, 179, 8, 0.5)' }; // yellow
    return { stroke: '#22c55e', glow: 'rgba(34, 197, 94, 0.5)' }; // green
  };

  const color = getColor();

  const sizeConfig = {
    sm: { dimension: 60, strokeWidth: 4, fontSize: 'text-sm' },
    md: { dimension: 80, strokeWidth: 5, fontSize: 'text-lg' },
    lg: { dimension: 100, strokeWidth: 6, fontSize: 'text-xl' },
  };

  const { dimension, strokeWidth, fontSize } = sizeConfig[size];
  const radius = (dimension - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (probability * circumference);

  return (
    <div className="flex flex-col items-center gap-2">
      <div className="relative" style={{ width: dimension, height: dimension }}>
        {/* Background circle */}
        <svg
          width={dimension}
          height={dimension}
          className="transform -rotate-90"
        >
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke="rgba(255, 255, 255, 0.1)"
            strokeWidth={strokeWidth}
          />
          <circle
            cx={dimension / 2}
            cy={dimension / 2}
            r={radius}
            fill="transparent"
            stroke={color.stroke}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            style={{
              filter: `drop-shadow(0 0 6px ${color.glow})`,
              transition: 'stroke-dashoffset 0.5s ease-out, stroke 0.3s ease',
            }}
          />
        </svg>

        {/* Percentage text */}
        <div className="absolute inset-0 flex items-center justify-center">
          <span
            className={cn('font-bold', fontSize)}
            style={{ color: color.stroke }}
          >
            {percentage}%
          </span>
        </div>
      </div>

      {showLabel && (
        <span className="text-xs text-slate-400">Win Chance</span>
      )}
    </div>
  );
}
