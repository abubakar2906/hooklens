import { api } from '@/lib/api';
import { StatCard } from '@/components/stat-card';
import { EventStatusBadge } from '@/components/event-status-badge';
import { ProviderBadge } from '@/components/provider-badge';
import { formatDate, shortId, formatDuration } from '@/lib/utils';
import Link from 'next/link';
import {
  Activity,
  XCircle,
  CheckCircle2,
  Timer,
  ArrowRight,
  Network,
  AlertTriangle,
} from 'lucide-react';

export const dynamic = 'force-dynamic';

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
    <div className="p-6 max-w-[1200px] mx-auto space-y-7">

      {/* Stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Events Today"
          value={totalCount.toLocaleString()}
          sub="Last 24 hours"
          icon={<Activity className="w-4 h-4" />}
          accent="blue"
          delay={0}
        />
        <StatCard
          label="Failed"
          value={failedCount.toLocaleString()}
          sub={failedCount > 0 ? 'Needs attention' : 'All clear'}
          icon={<XCircle className="w-4 h-4" />}
          accent={failedCount > 0 ? 'red' : 'green'}
          delay={60}
        />
        <StatCard
          label="Success Rate"
          value={stats.success_rate ? `${stats.success_rate}%` : '—'}
          sub={totalCount === 0 ? 'No events yet' : 'Last 24 hours'}
          icon={<CheckCircle2 className="w-4 h-4" />}
          accent={
            !stats.success_rate ? 'blue'
              : parseFloat(stats.success_rate) >= 90 ? 'green'
                : parseFloat(stats.success_rate) >= 70 ? 'amber'
                  : 'red'
          }
          delay={120}
        />
        <StatCard
          label="Avg Latency"
          value={formatDuration(stats.avg_latency_ms ? parseInt(stats.avg_latency_ms, 10) : null)}
          sub="Delivery round-trip"
          icon={<Timer className="w-4 h-4" />}
          accent="violet"
          delay={180}
        />
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Recent events — spans 2/3 */}
        <div className="lg:col-span-2 bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Activity className="w-4 h-4 text-[#444444]" />
              <h2 className="text-white text-sm font-semibold">Recent Events</h2>
              {totalCount > 0 && (
                <span className="text-xs text-[#444444] bg-[#1a1a1a] px-2 py-0.5 rounded-full">
                  {totalCount} today
                </span>
              )}
            </div>
            <Link
              href="/events"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              View all <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {recentEvents.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <div className="w-12 h-12 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3">
                <Activity className="w-5 h-5 text-[#333333]" />
              </div>
              <p className="text-[#444444] text-sm">No events yet</p>
              <p className="text-[#333333] text-xs mt-1">Webhooks will appear here when received</p>
            </div>
          ) : (
            <div className="divide-y divide-[#141414]">
              {recentEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/events/${event.id}`}
                  className="flex items-center gap-4 px-5 py-3 hover:bg-[#141414] transition-colors group"
                >
                  <EventStatusBadge status={event.display_status} className="flex-shrink-0" />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-white font-mono">{shortId(event.id)}</span>
                      <ProviderBadge type={event.provider_type} showDot={false} className="py-0" />
                    </div>
                    <p className="text-[#555555] text-xs truncate mt-0.5">{event.destination_url}</p>
                  </div>
                  <div className="text-right flex-shrink-0">
                    <p className="text-[#444444] text-xs">{formatDate(event.created_at)}</p>
                    {event.attempt_count > 0 && (
                      <p className="text-[#333333] text-[10px] mt-0.5">{event.attempt_count} attempt{event.attempt_count !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                  <ArrowRight className="w-3.5 h-3.5 text-[#333333] group-hover:text-[#555555] transition-colors flex-shrink-0" />
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Endpoint summary — 1/3 */}
        <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden animate-fade-in-up" style={{ animationDelay: '240ms', animationFillMode: 'both' }}>
          <div className="flex items-center justify-between px-5 py-3.5 border-b border-[#1a1a1a]">
            <div className="flex items-center gap-2">
              <Network className="w-4 h-4 text-[#444444]" />
              <h2 className="text-white text-sm font-semibold">Connections</h2>
            </div>
            <Link
              href="/connections"
              className="flex items-center gap-1 text-xs text-blue-500 hover:text-blue-400 transition-colors"
            >
              Manage <ArrowRight className="w-3 h-3" />
            </Link>
          </div>

          {endpoints.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-12 text-center px-4">
              <div className="w-10 h-10 rounded-full bg-[#1a1a1a] flex items-center justify-center mb-3">
                <Network className="w-4 h-4 text-[#333333]" />
              </div>
              <p className="text-[#444444] text-sm">No connections</p>
              <p className="text-[#333333] text-xs mt-1">Add your first endpoint</p>
              <Link
                href="/connections"
                className="mt-3 text-xs text-blue-500 hover:text-blue-400 transition-colors"
              >
                + New Connection
              </Link>
            </div>
          ) : (
            <div className="divide-y divide-[#141414]">
              {endpoints.slice(0, 6).map((ep) => {
                const rate = ep.success_rate ?? 0;
                const hasData = ep.total_events > 0;
                return (
                  <div key={ep.id} className="px-5 py-3">
                    <div className="flex items-center justify-between mb-1.5">
                      <ProviderBadge type={ep.provider_type} />
                      <span className={
                        !hasData ? 'text-[#444444] text-xs' :
                          rate >= 90 ? 'text-green-400 text-xs' :
                            rate >= 70 ? 'text-amber-400 text-xs' : 'text-red-400 text-xs'
                      }>
                        {hasData ? `${rate}%` : '—'}
                      </span>
                    </div>
                    <p className="text-[#555555] text-xs font-mono truncate">{ep.url}</p>
                    {hasData && (
                      <div className="mt-2 w-full bg-[#1a1a1a] rounded-full h-0.5">
                        <div
                          className={rate >= 90 ? 'bg-green-500 h-0.5 rounded-full' : rate >= 70 ? 'bg-amber-500 h-0.5 rounded-full' : 'bg-red-500 h-0.5 rounded-full'}
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
        <div className="flex items-center gap-4 bg-red-500/5 border border-red-500/15 rounded-xl px-5 py-4 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
          <div className="w-8 h-8 rounded-lg bg-red-500/10 border border-red-500/20 flex items-center justify-center flex-shrink-0">
            <AlertTriangle className="w-4 h-4 text-red-400" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-white text-sm font-medium">
              {failedCount} event{failedCount !== 1 ? 's' : ''} failed in the last 24 hours
            </p>
            <p className="text-[#666666] text-xs mt-0.5">
              Check the Events page to inspect payloads and replay failures
            </p>
          </div>
          <Link
            href="/events?status=failed"
            className="flex-shrink-0 px-4 py-2 rounded-lg bg-red-500/10 border border-red-500/20 text-red-400 text-sm hover:bg-red-500/20 transition-all"
          >
            Inspect →
          </Link>
        </div>
      )}
    </div>
  );
}
