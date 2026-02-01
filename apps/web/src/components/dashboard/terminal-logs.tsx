'use client';

import { useEffect, useState } from 'react';

interface LogEntry {
  id: string;
  timestamp: string;
  message: string;
  type: 'success' | 'info' | 'warning' | 'error';
}

const initialLogs: LogEntry[] = [
  { id: '1', timestamp: '12:34:56', message: 'System initialized successfully', type: 'success' },
  { id: '2', timestamp: '12:34:57', message: 'Connected to Asterbook Network', type: 'success' },
  { id: '3', timestamp: '12:34:58', message: 'Loading user profile...', type: 'info' },
  { id: '4', timestamp: '12:34:59', message: 'Pet status synchronized', type: 'success' },
  { id: '5', timestamp: '12:35:00', message: 'Staking rewards calculated: +12.5 ASTER', type: 'info' },
  { id: '6', timestamp: '12:35:01', message: 'Arena matchmaking ready', type: 'success' },
];

const newLogMessages = [
  { message: 'Block #1,234,567 validated', type: 'success' as const },
  { message: 'New whale alert detected', type: 'info' as const },
  { message: 'Price update: ASTER +2.3%', type: 'info' as const },
  { message: 'Quest progress saved', type: 'success' as const },
  { message: 'Network latency: 45ms', type: 'info' as const },
  { message: 'Pet hunger decreased by 5', type: 'warning' as const },
  { message: 'Expedition completed', type: 'success' as const },
  { message: 'Daily reward available', type: 'info' as const },
];

const typeColors = {
  success: {
    dot: 'bg-green-400',
    text: 'text-green-400',
  },
  info: {
    dot: 'bg-cyan-400',
    text: 'text-cyan-400',
  },
  warning: {
    dot: 'bg-amber-400',
    text: 'text-amber-400',
  },
  error: {
    dot: 'bg-red-400',
    text: 'text-red-400',
  },
};

export function TerminalLogs() {
  const [logs, setLogs] = useState<LogEntry[]>(initialLogs);

  // Add new logs periodically
  useEffect(() => {
    const interval = setInterval(() => {
      const randomLog = newLogMessages[Math.floor(Math.random() * newLogMessages.length)];
      const now = new Date();
      const timestamp = now.toTimeString().split(' ')[0];

      setLogs((prev) => {
        const newLogs = [
          ...prev,
          {
            id: Date.now().toString(),
            timestamp,
            message: randomLog.message,
            type: randomLog.type,
          },
        ];
        // Keep only last 10 logs
        return newLogs.slice(-10);
      });
    }, 4000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div
      className="rounded-xl overflow-hidden"
      style={{
        background: 'rgba(0, 0, 0, 0.6)',
        border: '1px solid rgba(255, 255, 255, 0.08)',
      }}
    >
      {/* Terminal Header */}
      <div
        className="flex items-center gap-2 px-4 py-2"
        style={{
          background: 'rgba(30, 41, 59, 0.5)',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
        }}
      >
        <div className="flex items-center gap-1.5">
          <div className="w-3 h-3 rounded-full bg-red-500/80" />
          <div className="w-3 h-3 rounded-full bg-amber-500/80" />
          <div className="w-3 h-3 rounded-full bg-green-500/80" />
        </div>
        <span className="text-xs text-slate-400 ml-2 font-mono">asterbook-terminal</span>
      </div>

      {/* Terminal Content */}
      <div className="p-4 h-64 overflow-y-auto custom-scrollbar">
        <div className="space-y-1.5">
          {logs.map((log, index) => {
            const colors = typeColors[log.type];
            return (
              <div
                key={log.id}
                className="flex items-start gap-3 font-mono text-xs"
                style={{
                  animation: index === logs.length - 1 ? 'slideIn 0.2s ease-out' : undefined,
                }}
              >
                {/* Status Dot */}
                <div className="flex items-center gap-2 flex-shrink-0 mt-0.5">
                  <div
                    className={`w-2 h-2 rounded-full ${colors.dot}`}
                    style={{
                      boxShadow: `0 0 6px ${
                        log.type === 'success'
                          ? 'rgba(34, 197, 94, 0.5)'
                          : log.type === 'info'
                          ? 'rgba(0, 243, 255, 0.5)'
                          : log.type === 'warning'
                          ? 'rgba(245, 158, 11, 0.5)'
                          : 'rgba(239, 68, 68, 0.5)'
                      }`,
                    }}
                  />
                </div>

                {/* Timestamp */}
                <span className="text-slate-500 flex-shrink-0">[{log.timestamp}]</span>

                {/* Message */}
                <span className={colors.text}>{log.message}</span>
              </div>
            );
          })}
        </div>

        {/* Blinking cursor */}
        <div className="flex items-center gap-2 mt-2 font-mono text-xs">
          <span className="text-green-400">$</span>
          <span className="w-2 h-4 bg-green-400 animate-pulse" />
        </div>
      </div>

      <style jsx>{`
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateY(-5px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }

        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }

        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(0, 0, 0, 0.3);
        }

        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(100, 116, 139, 0.5);
          border-radius: 3px;
        }

        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(100, 116, 139, 0.7);
        }
      `}</style>
    </div>
  );
}

export default TerminalLogs;
