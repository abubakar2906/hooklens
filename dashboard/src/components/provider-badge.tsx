import { cn, providerColor, providerLabel } from '@/lib/utils';
import type { ProviderType } from '@/types';

interface ProviderBadgeProps {
  type: ProviderType;
  className?: string;
  showDot?: boolean;
}

export function ProviderBadge({ type, className, showDot = true }: ProviderBadgeProps) {
  const colors = providerColor(type);
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md text-xs font-medium border',
        colors.bg,
        colors.text,
        colors.border,
        className
      )}
    >
      {showDot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', colors.dot)} />
      )}
      {providerLabel(type)}
    </span>
  );
}
