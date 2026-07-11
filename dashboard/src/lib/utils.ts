import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import type { EventStatus, ProviderType } from '@/types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// How long ago a timestamp was, e.g. "3s ago", "2m ago", "4h ago"
export function timeAgo(dateStr: string): string {
  const seconds = Math.floor((Date.now() - new Date(dateStr).getTime()) / 1000);
  if (seconds < 60) return `${seconds}s ago`;
  if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
  if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
  return `${Math.floor(seconds / 86400)}d ago`;
}

// Short formatted date for tables
export function formatDate(dateStr: string): string {
  return new Intl.DateTimeFormat('en-GB', {
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).format(new Date(dateStr));
}

// Pull the event name from the payload — providers differ in which field they use
export function getEventName(payload: Record<string, unknown>): string {
  for (const key of ['event', 'type', 'eventType', 'event_type']) {
    if (typeof payload[key] === 'string') return payload[key] as string;
  }
  return 'webhook.received';
}

// Truncated ID for display, e.g. "evt_a1b2c3d4"
export function shortId(id: string): string {
  return `evt_${id.replace(/-/g, '').slice(0, 8)}`;
}

// Tailwind classes for each status badge variant
export function statusVariant(status: EventStatus): string {
  return {
    success: 'bg-green-500/10  text-green-400  border-green-500/20',
    failed: 'bg-red-500/10    text-red-400    border-red-500/20',
    retrying: 'bg-amber-500/10  text-amber-400  border-amber-500/20',
    pending: 'bg-zinc-500/10   text-zinc-400   border-zinc-500/20',
  }[status];
}

// Human-readable provider label
export function providerLabel(type: ProviderType): string {
  return {
    paystack: 'Paystack',
    flutterwave: 'Flutterwave',
    monnify: 'Monnify',
    generic: 'Generic',
  }[type];
}

// Tailwind color classes for each provider
export function providerColor(type: ProviderType): {
  bg: string; text: string; border: string; dot: string;
} {
  return {
    paystack: {
      bg: 'bg-emerald-500/10',
      text: 'text-emerald-400',
      border: 'border-emerald-500/25',
      dot: 'bg-emerald-400',
    },
    flutterwave: {
      bg: 'bg-orange-500/10',
      text: 'text-orange-400',
      border: 'border-orange-500/25',
      dot: 'bg-orange-400',
    },
    monnify: {
      bg: 'bg-violet-500/10',
      text: 'text-violet-400',
      border: 'border-violet-500/25',
      dot: 'bg-violet-400',
    },
    generic: {
      bg: 'bg-zinc-500/10',
      text: 'text-zinc-400',
      border: 'border-zinc-500/25',
      dot: 'bg-zinc-400',
    },
  }[type];
}

// Format duration in ms nicely
export function formatDuration(ms: number | null): string {
  if (ms === null) return '—';
  if (ms < 1000) return `${ms}ms`;
  return `${(ms / 1000).toFixed(1)}s`;
}

// HTTP status code color
export function statusCodeColor(code: number | null): string {
  if (code === null) return 'text-zinc-500';
  if (code >= 200 && code < 300) return 'text-green-400';
  if (code >= 400 && code < 500) return 'text-amber-400';
  return 'text-red-400';
}