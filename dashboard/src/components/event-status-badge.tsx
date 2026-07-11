import { cn, statusVariant } from '@/lib/utils';
import type { EventStatus } from '@/types';

const STATUS_LABELS: Record<EventStatus, string> = {
  success: 'Success',
  failed: 'Failed',
  retrying: 'Retrying',
  pending: 'Pending',
};

const STATUS_DOTS: Record<EventStatus, string> = {
  success: 'bg-green-400 animate-status-glow-green',
  failed: 'bg-red-400',
  retrying: 'bg-amber-400 animate-pulse-dot',
  pending: 'bg-zinc-500',
};

interface EventStatusBadgeProps {
  status: EventStatus;
  className?: string;
}

export function EventStatusBadge({ status, className }: EventStatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
        statusVariant(status),
        className
      )}
    >
      <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', STATUS_DOTS[status])} />
      {STATUS_LABELS[status]}
    </span>
  );
}
