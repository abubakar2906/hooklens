'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft,
  RotateCcw,
  ExternalLink,
  Cpu,
  Clock,
  Hash,
  Network,
  Layers,
} from 'lucide-react';
import { api } from '@/lib/api';
import { EventStatusBadge } from '@/components/event-status-badge';
import { ProviderBadge } from '@/components/provider-badge';
import { PayloadViewer } from '@/components/payload-viewer';
import { DeliveryTimeline } from '@/components/delivery-timeline';
import { cn, formatDate, shortId } from '@/lib/utils';
import type { EventDetail } from '@/types';

export default function EventDetailPage() {
  const { id } = useParams<{ id: string }>();
  const router = useRouter();
  const [event, setEvent] = useState<EventDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [replaying, setReplaying] = useState(false);
  const [replayMsg, setReplayMsg] = useState('');
  const [activeTab, setActiveTab] = useState<'payload' | 'headers' | 'deliveries'>('payload');

  useEffect(() => {
    api.getEvent(id)
      .then(setEvent)
      .catch(() => setEvent(null))
      .finally(() => setLoading(false));
  }, [id]);

  const replay = async () => {
    if (!event) return;
    setReplaying(true);
    setReplayMsg('');
    try {
      const r = await api.replayEvent(id);
      setReplayMsg(r.message);
      // Refresh after a moment
      setTimeout(() => {
        api.getEvent(id).then(setEvent).catch(() => null);
      }, 800);
    } catch (err) {
      setReplayMsg(err instanceof Error ? err.message : 'Replay failed');
    } finally {
      setReplaying(false);
    }
  };

  if (loading) {
    return (
      <div className="p-6 space-y-4">
        <div className="w-48 h-6 animate-shimmer rounded" />
        <div className="grid grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-20 animate-shimmer rounded-xl" />)}
        </div>
        <div className="h-64 animate-shimmer rounded-xl" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="flex flex-col items-center justify-center h-64">
        <p className="text-[#555555] text-sm">Event not found</p>
        <Link href="/events" className="mt-3 text-blue-500 text-sm hover:text-blue-400">
          ← Back to Events
        </Link>
      </div>
    );
  }

  const canReplay = event.display_status !== 'pending' && event.display_status !== 'retrying';

  return (
    <div className="p-6 max-w-[1100px] mx-auto space-y-5 animate-fade-in-up">

      {/* Back + title */}
      <div className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <Link
            href="/events"
            className="w-8 h-8 rounded-lg bg-[#111111] border border-[#1e1e1e] flex items-center justify-center text-[#555555] hover:text-white hover:border-[#2a2a2a] transition-all"
          >
            <ArrowLeft className="w-4 h-4" />
          </Link>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-white font-semibold text-base font-mono">{shortId(event.id)}</h2>
              <EventStatusBadge status={event.display_status} />
              <ProviderBadge type={event.provider_type} />
            </div>
            <p className="text-[#444444] text-xs mt-0.5 font-mono">{event.id}</p>
          </div>
        </div>

        {/* Replay */}
        <div className="flex flex-col items-end gap-1">
          <button
            onClick={replay}
            disabled={!canReplay || replaying}
            title={!canReplay ? 'Event is already queued' : 'Re-queue this event for delivery'}
            className={cn(
              'flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-all',
              canReplay
                ? 'bg-blue-600 hover:bg-blue-500 text-white disabled:opacity-60 disabled:cursor-not-allowed'
                : 'bg-[#1a1a1a] text-[#444444] cursor-not-allowed border border-[#222222]'
            )}
          >
            <RotateCcw className={cn('w-3.5 h-3.5', replaying && 'animate-spin')} />
            {replaying ? 'Queuing…' : 'Replay'}
          </button>
          {replayMsg && (
            <p className="text-xs text-green-400">{replayMsg}</p>
          )}
        </div>
      </div>

      {/* Meta cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {[
          { label: 'Created', value: formatDate(event.created_at), icon: Clock },
          { label: 'Attempts', value: String(event.deliveries.length), icon: Hash },
          {
            label: 'Destination',
            value: event.destination_url,
            icon: Network,
            mono: true,
            link: event.destination_url,
          },
          { label: 'Endpoint', value: event.endpoint_id.slice(0, 14) + '…', icon: Layers, mono: true },
        ].map(({ label, value, icon: Icon, mono, link }) => (
          <div key={label} className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-3.5">
            <div className="flex items-center gap-1.5 mb-1.5">
              <Icon className="w-3.5 h-3.5 text-[#444444]" />
              <span className="text-[10px] text-[#444444] uppercase tracking-wider">{label}</span>
            </div>
            {link ? (
              <a
                href={link}
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-blue-400 hover:text-blue-300 font-mono truncate block flex items-center gap-1"
              >
                <span className="truncate">{value}</span>
                <ExternalLink className="w-3 h-3 flex-shrink-0" />
              </a>
            ) : (
              <p className={cn('text-xs text-white truncate', mono && 'font-mono')}>{value}</p>
            )}
          </div>
        ))}
      </div>

      {/* AI Diagnosis */}
      {event.diagnosis && (
        <div className="bg-violet-500/5 border border-violet-500/20 rounded-xl p-5 animate-fade-in">
          <div className="flex items-center gap-2 mb-3">
            <div className="w-6 h-6 rounded-md bg-violet-500/15 border border-violet-500/25 flex items-center justify-center">
              <Cpu className="w-3.5 h-3.5 text-violet-400" />
            </div>
            <span className="text-violet-400 text-sm font-semibold">AI Diagnosis</span>
            <span className="text-[#444444] text-xs ml-auto">{formatDate(event.diagnosis.created_at)}</span>
          </div>
          <p className="text-[#aaaaaa] text-sm leading-relaxed">{event.diagnosis.analysis}</p>
        </div>
      )}

      {/* Tabs */}
      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl overflow-hidden">
        <div className="flex items-center border-b border-[#1a1a1a] bg-[#0d0d0d]">
          {(['payload', 'headers', 'deliveries'] as const).map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-5 py-3 text-sm font-medium capitalize border-b-2 transition-all',
                activeTab === tab
                  ? 'text-white border-blue-500'
                  : 'text-[#555555] border-transparent hover:text-[#aaaaaa]'
              )}
            >
              {tab}
              {tab === 'deliveries' && event.deliveries.length > 0 && (
                <span className="ml-1.5 text-xs text-[#444444] bg-[#1a1a1a] px-1.5 py-0.5 rounded-full">
                  {event.deliveries.length}
                </span>
              )}
            </button>
          ))}
        </div>

        <div className="p-5">
          {activeTab === 'payload' && (
            <PayloadViewer payload={event.payload} title="payload.json" />
          )}
          {activeTab === 'headers' && (
            <PayloadViewer payload={event.headers as Record<string, unknown>} title="headers.json" />
          )}
          {activeTab === 'deliveries' && (
            <DeliveryTimeline deliveries={event.deliveries} />
          )}
        </div>
      </div>
    </div>
  );
}
