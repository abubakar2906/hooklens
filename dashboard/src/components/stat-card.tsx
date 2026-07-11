import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: 'blue' | 'green' | 'red' | 'amber' | 'violet';
  delay?: number;
}

const ACCENT_COLORS = {
  blue: {
    icon: 'text-blue-400 bg-blue-500/10 border-blue-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(59,130,246,0.08)]',
  },
  green: {
    icon: 'text-green-400 bg-green-500/10 border-green-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(34,197,94,0.08)]',
  },
  red: {
    icon: 'text-red-400 bg-red-500/10 border-red-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(239,68,68,0.08)]',
  },
  amber: {
    icon: 'text-amber-400 bg-amber-500/10 border-amber-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(245,158,11,0.08)]',
  },
  violet: {
    icon: 'text-violet-400 bg-violet-500/10 border-violet-500/20',
    glow: 'group-hover:shadow-[0_0_20px_rgba(139,92,246,0.08)]',
  },
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = 'blue',
  delay = 0,
}: StatCardProps) {
  const colors = ACCENT_COLORS[accent];

  return (
    <div
      className={cn(
        'group relative bg-[#111111] border border-[#1e1e1e] rounded-xl p-5',
        'transition-all duration-300',
        'hover:border-[#2a2a2a] hover:bg-[#141414]',
        colors.glow,
        'animate-fade-in-up'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-start justify-between mb-3">
        <p className="text-[#666666] text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className={cn('w-8 h-8 rounded-lg border flex items-center justify-center flex-shrink-0', colors.icon)}>
          {icon}
        </div>
      </div>
      <p className="text-[28px] font-bold text-white leading-none tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-1.5 text-xs text-[#555555]">{sub}</p>}
    </div>
  );
}
