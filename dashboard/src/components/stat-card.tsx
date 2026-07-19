import { cn } from '@/lib/utils';
import type { ReactNode } from 'react';

interface StatCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  accent?: 'primary' | 'success' | 'danger' | 'neutral';
  delay?: number;
}

const ACCENT_STYLES = {
  primary: 'text-[var(--primary)]',
  success: 'text-[#27a644]', // semantic success
  danger: 'text-destructive',
  neutral: 'text-ink-subtle',
};

export function StatCard({
  label,
  value,
  sub,
  icon,
  accent = 'neutral',
  delay = 0,
}: StatCardProps) {
  const iconColor = ACCENT_STYLES[accent];

  return (
    <div
      className={cn(
        'group relative bg-surface-1 border border-hairline rounded-lg p-5 font-sans',
        'transition-colors duration-200',
        'hover:border-hairline-strong',
        'animate-fade-in-up'
      )}
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      <div className="flex items-center justify-between mb-3">
        <p className="text-ink-subtle text-[11px] font-semibold uppercase tracking-[0.05em]">{label}</p>
        <div className={cn('w-6 h-6 flex items-center justify-center', iconColor)}>
          {icon}
        </div>
      </div>
      <p className="text-[28px] font-semibold text-ink leading-none tracking-tight">
        {value}
      </p>
      {sub && <p className="mt-2 text-[12px] text-ink-tertiary font-medium">{sub}</p>}
    </div>
  );
}
