'use client';

import { useEffect, useState } from 'react';

interface TickerItem {
  symbol: string;
  name: string;
  price: number;
  change: number;
}

const mockTickerData: TickerItem[] = [
  { symbol: 'ASTER', name: 'Asterbook', price: 0.0847, change: 5.23 },
  { symbol: 'BNB', name: 'BNB', price: 612.45, change: -1.12 },
  { symbol: 'ETH', name: 'Ethereum', price: 3247.89, change: 2.78 },
  { symbol: 'BTC', name: 'Bitcoin', price: 97523.45, change: 0.95 },
  { symbol: 'SOL', name: 'Solana', price: 189.32, change: -2.45 },
  { symbol: 'DOGE', name: 'Dogecoin', price: 0.1234, change: 8.67 },
];

export function MarketTicker() {
  const [tickerData, setTickerData] = useState<TickerItem[]>(mockTickerData);

  // Simulate price updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTickerData((prev) =>
        prev.map((item) => ({
          ...item,
          price: item.price * (1 + (Math.random() * 0.002 - 0.001)),
          change: item.change + (Math.random() * 0.4 - 0.2),
        }))
      );
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Duplicate items for seamless loop
  const duplicatedData = [...tickerData, ...tickerData];

  return (
    <div
      className="relative overflow-hidden rounded-xl"
      style={{
        background: 'rgba(2, 6, 23, 0.65)',
        backdropFilter: 'blur(16px)',
        WebkitBackdropFilter: 'blur(16px)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Gradient fade edges */}
      <div
        className="absolute left-0 top-0 bottom-0 w-16 z-10"
        style={{
          background: 'linear-gradient(90deg, rgba(2, 6, 23, 0.95), transparent)',
        }}
      />
      <div
        className="absolute right-0 top-0 bottom-0 w-16 z-10"
        style={{
          background: 'linear-gradient(-90deg, rgba(2, 6, 23, 0.95), transparent)',
        }}
      />

      {/* Scrolling container */}
      <div className="flex animate-marquee py-3">
        {duplicatedData.map((item, index) => (
          <div
            key={`${item.symbol}-${index}`}
            className="flex items-center gap-3 px-6 whitespace-nowrap"
          >
            <span className="text-white font-semibold">{item.symbol}</span>
            <span className="text-slate-400 text-sm">${item.price.toFixed(2)}</span>
            <span
              className={`text-sm font-medium flex items-center gap-1 ${
                item.change >= 0 ? 'text-green-400' : 'text-red-400'
              }`}
            >
              <svg
                className={`w-3 h-3 ${item.change < 0 && 'rotate-180'}`}
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
              {Math.abs(item.change).toFixed(2)}%
            </span>

            {/* Separator */}
            <div className="w-px h-4 bg-white/10 ml-2" />
          </div>
        ))}
      </div>

      <style jsx>{`
        @keyframes marquee {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }

        .animate-marquee {
          animation: marquee 30s linear infinite;
        }

        .animate-marquee:hover {
          animation-play-state: paused;
        }
      `}</style>
    </div>
  );
}

export default MarketTicker;
