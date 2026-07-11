'use client';

import { useEffect, useState, useCallback, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { RefreshCw, ArrowRight, RotateCcw, Search } from 'lucide-react';
import { api } from '@/lib/api';
import { EventStatusBadge } from '@/components/event-status-badge';
import { ProviderBadge } from '@/components/provider-badge';
import { cn, formatDate, shortId, formatDuration } from '@/lib/utils';
import type { WebhookEvent } from '@/types';

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
    <div className="flex flex-col h-full">
      {/* Sub-header */}
      <div className="border-b border-[#181818] bg-[#0d0d0d] px-5 py-3 flex items-center gap-3 flex-wrap">
        <div className="flex items-center gap-0.5">
          {TABS.map((tab) => {
            const count = tab.value === 'all' ? events.length : events.filter((e) => e.display_status === tab.value).length;
            return (
              <button
                key={tab.value}
                onClick={() => changeTab(tab.value)}
                className={cn(
                  'flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-medium transition-all',
                  status === tab.value
                    ? 'bg-[#1e1e1e] text-white border border-[#2a2a2a]'
                    : 'text-[#555555] hover:text-[#aaaaaa] hover:bg-[#141414]'
                )}
              >
                {tab.label}
                {count > 0 && (
                  <span className={cn(
                    'text-[10px] px-1.5 py-0.5 rounded-full min-w-[18px] text-center',
                    status === tab.value
                      ? tab.value === 'failed' ? 'bg-red-500/20 text-red-400'
                        : tab.value === 'success' ? 'bg-green-500/20 text-green-400'
                          : 'bg-[#2a2a2a] text-[#888888]'
                      : 'bg-[#1a1a1a] text-[#444444]'
                  )}>
                    {count}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        <div className="flex-1 min-w-[140px] max-w-xs">
          <div className="relative">
            <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-[#444444]" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search…"
              className="w-full bg-[#111111] border border-[#1e1e1e] rounded-lg pl-8 pr-3 py-1.5 text-xs text-white placeholder:text-[#444444] focus:outline-none focus:border-[#2a2a2a] transition-colors"
            />
          </div>
        </div>

        <button
          onClick={() => load(status, true)}
          disabled={refreshing}
          className="flex items-center gap-1.5 text-xs text-[#555555] hover:text-white px-3 py-1.5 rounded-md border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all disabled:opacity-50 ml-auto"
        >
          <RefreshCw className={cn('w-3.5 h-3.5', refreshing && 'animate-spin')} />
          Refresh
        </button>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto">
        {loading ? (
          <div className="space-y-0">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-3.5 border-b border-[#131313]">
                <div className="w-20 h-5 animate-shimmer rounded" />
                <div className="w-16 h-5 animate-shimmer rounded" />
                <div className="flex-1 h-4 animate-shimmer rounded" />
                <div className="w-24 h-4 animate-shimmer rounded" />
                <div className="w-16 h-4 animate-shimmer rounded" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-64 text-center px-4">
            <div className="w-12 h-12 rounded-full bg-[#141414] flex items-center justify-center mb-3">
              <RotateCcw className="w-5 h-5 text-[#333333]" />
            </div>
            <p className="text-[#555555] text-sm">No events found</p>
            <p className="text-[#333333] text-xs mt-1">
              {search ? 'Try a different search term' : 'Events will appear here when received'}
            </p>
          </div>
        ) : (
          <>
            {/* Table header */}
            <div className="flex items-center gap-4 px-5 py-2 border-b border-[#141414] bg-[#0d0d0d] sticky top-0">
              <span className="w-[90px] text-[10px] text-[#3a3a3a] uppercase tracking-wider flex-shrink-0">Status</span>
              <span className="w-[90px] text-[10px] text-[#3a3a3a] uppercase tracking-wider flex-shrink-0">ID</span>
              <span className="w-[85px] text-[10px] text-[#3a3a3a] uppercase tracking-wider flex-shrink-0">Provider</span>
              <span className="flex-1 text-[10px] text-[#3a3a3a] uppercase tracking-wider min-w-0">Destination</span>
              <span className="w-[55px] text-[10px] text-[#3a3a3a] uppercase tracking-wider text-right flex-shrink-0">Tries</span>
              <span className="w-[65px] text-[10px] text-[#3a3a3a] uppercase tracking-wider text-right flex-shrink-0">Latency</span>
              <span className="w-[110px] text-[10px] text-[#3a3a3a] uppercase tracking-wider text-right flex-shrink-0">When</span>
              <span className="w-4 flex-shrink-0" />
            </div>

            <div className="divide-y divide-[#0f0f0f]">
              {filtered.map((event, idx) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#0f0f0f] transition-colors group animate-fade-in"
                  style={{ animationDelay: `${Math.min(idx * 20, 300)}ms`, animationFillMode: 'both' }}
                >
                  <div className="w-[90px] flex-shrink-0">
                    <EventStatusBadge status={event.display_status} />
                  </div>
                  <span className="w-[90px] text-xs text-[#666666] font-mono flex-shrink-0 truncate">
                    {shortId(event.id)}
                  </span>
                  <div className="w-[85px] flex-shrink-0">
                    <ProviderBadge type={event.provider_type} showDot={false} />
                  </div>
                  <span className="flex-1 text-xs text-[#555555] font-mono truncate min-w-0">
                    {event.destination_url}
                  </span>
                  <span className="w-[55px] text-xs text-[#444444] text-right flex-shrink-0">
                    {event.attempt_count}
                  </span>
                  <span className="w-[65px] text-xs text-[#444444] font-mono text-right flex-shrink-0">
                    {formatDuration(event.last_duration_ms)}
                  </span>
                  <span className="w-[110px] text-xs text-[#444444] text-right flex-shrink-0">
                    {formatDate(event.created_at)}
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 text-[#222222] group-hover:text-[#555555] transition-colors flex-shrink-0" />
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
      <div className="flex flex-col h-full">
        <div className="border-b border-[#181818] h-12 animate-shimmer" />
        <div className="flex-1">
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="flex gap-4 px-5 py-3.5 border-b border-[#131313]">
              <div className="w-20 h-5 animate-shimmer rounded" />
              <div className="flex-1 h-4 animate-shimmer rounded" />
            </div>
          ))}
        </div>
      </div>
    }>
      <EventsContent />
    </Suspense>
  );
}
