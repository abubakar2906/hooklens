'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { api } from '@/lib/api';
import { EventStatusBadge } from '@/components/event-status-badge';
import { ProviderBadge } from '@/components/provider-badge';
import { cn, formatDate, shortId, formatDuration } from '@/lib/utils';
import type { WebhookEvent } from '@/types';

// Minimal Custom Icons
function IconRefresh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5C9.09101 3.5 10.0913 3.8885 10.875 4.5377" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 2V4.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconArrowRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3 8H13M13 8L9.5 4.5M13 8L9.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
function IconSearch({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="7" cy="7" r="4" stroke="currentColor" strokeWidth="1.2" />
      <path d="M10 10L13.5 13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}
function IconEmpty({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2.5 8C2.5 4.96243 4.96243 2.5 8 2.5C11.0376 2.5 13.5 4.96243 13.5 8" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 8V11.5L9.5 13" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M5.5 13H10.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

const TABS = [
  { label: 'All', value: 'all' },
  { label: 'Pending', value: 'pending' },
  { label: 'Retrying', value: 'retrying' },
  { label: 'Failed', value: 'failed' },
  { label: 'Success', value: 'success' },
];

function EventsContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const initialStatus = searchParams.get('status') ?? 'all';

  const [status, setStatus] = useState(initialStatus);
  const [events, setEvents] = useState<WebhookEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [search, setSearch] = useState('');

  const load = useCallback(async (s: string, isRefresh = false) => {
    if (isRefresh) setRefreshing(true);
    else setLoading(true);
    try {
      const data = await api.getEvents(s === 'all' ? undefined : s);
      setEvents(data);
    } catch {
      setEvents([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => { load(status); }, [status, load]);

  const changeTab = (val: string) => {
    setStatus(val);
    router.replace(val === 'all' ? '/events' : `/events?status=${val}`, { scroll: false });
  };

  const filtered = search.trim()
    ? events.filter((e) =>
      e.id.includes(search) ||
      e.destination_url.toLowerCase().includes(search.toLowerCase()) ||
      e.provider_type.includes(search.toLowerCase())
    )
    : events;

  return (
    <div className="flex flex-col h-full font-sans bg-background">
      {/* Sub-header */}
      <div className="border-b border-hairline bg-surface-1 px-5 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const count = tab.value === 'all' ? events.length : events.filter((e) => e.display_status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => changeTab(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-[13px] font-medium transition-colors',
                  status === tab.value
                    ? 'bg-surface-2 text-ink'
                    : 'text-ink-subtle hover:text-ink hover:bg-surface-2'
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    status === tab.value
                      ? tab.value === 'failed' ? 'bg-destructive/10 text-destructive'
                        : tab.value === 'success' ? 'bg-[#27a644]/10 text-[#27a644]'
                          : 'bg-surface-3 text-ink-muted'
                      : 'bg-surface-2 text-ink-tertiary'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-[140px] max-w-xs ml-2">
          <div className="relative">
            <IconSearch className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-ink-tertiary" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search events..."
              className="w-full bg-surface-2 border border-hairline rounded-md pl-8 pr-3 py-1.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-hairline-strong transition-colors"
            />
          </div>
        </div>

        <button
          onClick={() => load(status, true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-[13px] text-ink-subtle hover:text-ink px-3 py-1.5 rounded-md border border-hairline bg-surface-1 hover:bg-surface-2 hover:border-hairline-strong transition-colors disabled:opacity-50 ml-auto cursor-pointer"
        >
          <IconRefresh className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto bg-background">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 border-b border-hairline">
                <div className="w-20 h-5 animate-shimmer rounded bg-surface-2" />
                <div className="w-16 h-5 animate-shimmer rounded bg-surface-2" />
                <div className="flex-1 h-4 animate-shimmer rounded bg-surface-2" />
                <div className="w-24 h-4 animate-shimmer rounded bg-surface-2" />
                <div className="w-16 h-4 animate-shimmer rounded bg-surface-2" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center mb-4">
              <IconEmpty className="w-4 h-4 text-ink-tertiary" />
            </div>
            <p className="text-ink text-[14px] font-medium">No events found</p>
            <p className="text-ink-subtle text-[13px] mt-1">
              {search ? 'Try a different search term' : 'Events will appear here when received'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-2.5 border-b border-hairline bg-surface-1 sticky top-0">
              <span className="w-[90px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider flex-shrink-0">Status</span>
              <span className="w-[90px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider flex-shrink-0">ID</span>
              <span className="w-[85px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider flex-shrink-0">Provider</span>
              <span className="flex-1 text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider min-w-0">Destination</span>
              <span className="w-[55px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider text-right flex-shrink-0">Tries</span>
              <span className="w-[65px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider text-right flex-shrink-0">Latency</span>
              <span className="w-[110px] text-[10px] text-ink-tertiary font-semibold uppercase tracking-wider text-right flex-shrink-0">When</span>
              <span className="w-4 flex-shrink-0" />
            </div>

            <div className="divide-y divide-hairline">
              {filtered.map((event, idx) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-surface-2 transition-colors group animate-fade-in"
                  style={{ animationDelay: `${Math.min(idx * 20, 300)}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-[90px] flex-shrink-0">
                    <EventStatusBadge status={event.display_status} />
                  </div>
                  <span className="w-[90px] text-[12px] text-ink-muted font-mono flex-shrink-0 truncate">
                    {shortId(event.id)}
                  </span>
                  <div className="w-[85px] flex-shrink-0">
                    <ProviderBadge type={event.provider_type} showDot={false} />
                  </div>
                  <span className="flex-1 text-[12px] text-ink-subtle font-mono truncate min-w-0">
                    {event.destination_url}
                  </span>
                  <span className="w-[55px] text-[12px] text-ink-muted text-right flex-shrink-0">
                    {event.attempt_count}
                  </span>
                  <span className="w-[65px] text-[12px] text-ink-muted font-mono text-right flex-shrink-0">
                    {formatDuration(event.last_duration_ms)}
                  </span>
                  <span className="w-[110px] text-[12px] text-ink-muted text-right flex-shrink-0">
                    {formatDate(event.created_at)}
                  </span>
                  <IconArrowRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-ink-muted transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

export default function EventsPage() {
  return (
    <Suspense fallback={
      <div className="flex flex-col h-full bg-background">
        <div className="border-b border-hairline bg-surface-1 h-12 animate-shimmer" />
        <div className="flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-4 border-b border-hairline">
              <div className="w-20 h-5 animate-shimmer rounded bg-surface-2" />
              <div className="flex-1 h-4 animate-shimmer rounded bg-surface-2" />
            </div>
          ))}
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
