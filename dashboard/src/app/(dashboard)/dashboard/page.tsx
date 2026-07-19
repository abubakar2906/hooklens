import { api } from '@/lib/api';
import { StatCard } from '@/components/stat-card';
import { EventStatusBadge } from '@/components/event-status-badge';
import { ProviderBadge } from '@/components/provider-badge';
import { formatDate, shortId, formatDuration } from '@/lib/utils';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

function IconActivity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 8H4.5L6.5 3L9.5 13L11.5 8H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCheck({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M5 8L7 10L11 5.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconTimer({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8.5" r="5.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M8 5.5V8.5L9.5 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M6 2H10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconCross({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="6" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 6L10 10M10 6L6 10" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

function IconNetwork({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 4V12M8 12H4M8 12H12" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="3" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="4" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="12" cy="13" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconAlert({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 2.5L14 13H2L8 2.5Z" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M8 7V10M8 11.5H8.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
    </svg>
  );
}

export default async function OverviewPage() {
  const [stats, events, endpoints] = await Promise.all([
    api.getStats().catch(() => ({
      events_today: '0',
      failed_today: '0',
      success_rate: null,
      avg_latency_ms: null,
    })),
    api.getEvents().catch(() => []),
    api.getEndpoints().catch(() => []),
  ]);

  const recentEvents = events.slice(0, 8);
  const failedCount = parseInt(stats.failed_today, 10);
  const totalCount = parseInt(stats.events_today, 10);

  return (
    <div className="p-6 max-w-[1280px] mx-auto space-y-8 font-sans pb-24">
      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Events Today"
          value={totalCount.toLocaleString()}
          sub="Last 24 hours"
          icon={<IconActivity className="w-4 h-4" />}
          accent="primary"
          delay={0}
        />
        <StatCard
          label="Failed"
          value={failedCount.toLocaleString()}
          sub={failedCount > 0 ? 'Needs attention' : 'All clear'}
          icon={<IconCross className="w-4 h-4" />}
          accent={failedCount > 0 ? 'danger' : 'success'}
          delay={60}
        />
        <StatCard
          label="Success Rate"
          value={stats.success_rate ? `${stats.success_rate}%` : '—'}
          sub={totalCount === 0 ? 'No events yet' : 'Last 24 hours'}
          icon={<IconCheck className="w-4 h-4" />}
          accent={
            !stats.success_rate ? 'neutral'
              : parseFloat(stats.success_rate) >= 90 ? 'success'
                : 'danger'
          }
          delay={120}
        />
        <StatCard
          label="Avg Latency"
          value={formatDuration(stats.avg_latency_ms ? parseInt(stats.avg_latency_ms, 10) : null)}
          sub="Delivery round-trip"
          icon={<IconTimer className="w-4 h-4" />}
          accent="neutral"
          delay={180}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Recent events */}
        <div className="lg:col-span-2 bg-surface-1 border border-hairline rounded-lg overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-hairline bg-surface-1">
            <div className="flex items-center gap-2">
              <IconActivity className="w-3.5 h-3.5 text-ink-subtle" />
              <h2 className="text-ink text-[13px] font-semibold tracking-tight">Recent Events</h2>
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1.5 text-[12px] font-medium text-ink-subtle hover:text-ink transition-colors"
            >
              View all <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-20 text-center">
              <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center mb-4">
                <IconActivity className="w-4 h-4 text-ink-tertiary" />
              </div>
              <p className="text-ink text-[14px] font-medium">No events yet</p>
              <p className="text-ink-subtle text-[13px] mt-1">Webhooks will appear here when received</p>
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-surface-2 transition-colors group"
                >
                  <EventStatusBadge status={event.display_status} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[12px] text-ink font-mono">{shortId(event.id)}</span>
                      <ProviderBadge type={event.provider_type} showDot={false} className="py-0" />
                    </div>
                    <p className="text-ink-subtle text-[12px] truncate mt-0.5">{event.destination_url}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-ink-muted text-[12px]">{formatDate(event.created_at)}</p>
                    {event.attempt_count > 0 && (
                      <p className="text-ink-tertiary text-[11px] mt-0.5">{event.attempt_count} attempt{event.attempt_count !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                  <IconArrowRight className="w-3.5 h-3.5 text-ink-tertiary group-hover:text-ink-muted transition-colors flex-shrink-0 ml-2" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Connections Summary */}
        <div className="bg-surface-1 border border-hairline rounded-lg overflow-hidden animate-fade-in-up flex flex-col" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between px-5 py-3 border-b border-hairline bg-surface-1">
            <div className="flex items-center gap-2">
              <IconNetwork className="w-3.5 h-3.5 text-ink-subtle" />
              <h2 className="text-ink text-[13px] font-semibold tracking-tight">Connections</h2>
            </div>
            <Link
              href="/connections"
              className="flex items-center gap-1.5 text-[12px] font-medium text-ink-subtle hover:text-ink transition-colors"
            >
              Manage <IconArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {endpoints.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-10 h-10 rounded-full border border-hairline flex items-center justify-center mb-4">
                <IconNetwork className="w-4 h-4 text-ink-tertiary" />
              </div>
              <p className="text-ink text-[14px] font-medium">No connections</p>
              <p className="text-ink-subtle text-[13px] mt-1 mb-4">Add your first endpoint</p>
              <Link
                href="/connections"
                className="text-[13px] font-medium text-primary hover:text-primary-hover transition-colors"
              >
                + New Connection
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-hairline">
              {endpoints.slice(0, 6).map((ep) => {
                const rate = ep.success_rate ?? 0;
                const hasData = ep.total_events > 0;
                return (
                  <div key={ep.id} className="px-5 py-4">
                    <div className="flex items-center justify-between mb-2">
                      <ProviderBadge type={ep.provider_type} />
                      <span className={
                        !hasData ? 'text-ink-tertiary text-[11px] font-medium' :
                          rate >= 90 ? 'text-[#27a644] text-[11px] font-medium' :
                            'text-destructive text-[11px] font-medium'
                      }>
                        {hasData ? `${rate}%` : '—'}
                      </span>
                    </div>
                    <p className="text-ink-muted text-[12px] font-mono truncate">{ep.url}</p>
                    {hasData && (
                      <div className="mt-2.5 w-full bg-surface-2 rounded-full h-[2px]">
                        <div
                          className={rate >= 90 ? 'bg-[#27a644] h-[2px] rounded-full' : 'bg-destructive h-[2px] rounded-full'}
                          style={{ width: `${Math.max(rate, 2)}%` }}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {/* Failed events alert */}
      {failedCount > 0 && (
        <div className="flex items-center gap-4 bg-[#141010] border border-[#3a1a1a] rounded-lg px-5 py-4 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-center flex-shrink-0">
            <IconAlert className="w-5 h-5 text-destructive" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-ink text-[14px] font-medium">
              {failedCount} event{failedCount !== 1 ? 's' : ''} failed in the last 24 hours
            </p>
            <p className="text-ink-subtle text-[13px] mt-0.5">
              Check the Events page to inspect payloads and replay failures.
            </p>
          </div>
          <Link
            href="/events?status=failed"
            className="flex-shrink-0 px-3 py-1.5 rounded-md bg-surface-2 border border-hairline text-[13px] font-medium text-ink hover:bg-surface-3 transition-colors flex items-center gap-1.5"
          >
            Inspect <IconArrowRight className="w-3 h-3" />
          </Link>
        </div>
      )}
    </div>
  );
}
