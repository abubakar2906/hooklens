import Link from 'next/link';
import { ExternalLink, Activity, TrendingUp } from 'lucide-react';
import { ProviderBadge } from './provider-badge';
import { cn, formatDate } from '@/lib/utils';
import type { Endpoint } from '@/types';

interface EndpointCardProps {
  endpoint: Endpoint;
  delay?: number;
}

export function EndpointCard({ endpoint, delay = 0 }: EndpointCardProps) {
  const successRate = endpoint.success_rate ?? 0;
  const hasData = endpoint.total_events > 0;

  return (
    <div
      className="group bg-[#111111] border border-[#1e1e1e] rounded-xl p-5 hover:border-[#2a2a2a] hover:bg-[#141414] transition-all duration-300 animate-fade-in-up"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-4">
        <div className="min-w-0 flex-1">
          <ProviderBadge type={endpoint.provider_type} className="mb-2" />
          <div className="flex items-center gap-2">
            <p className="text-white text-sm font-mono truncate">{endpoint.url}</p>
            <a
              href={endpoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[#444444] hover:text-white transition-colors flex-shrink-0"
              title="Open URL"
            >
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-[#444444] text-xs mt-1 font-mono">
            {endpoint.id.slice(0, 18)}…
          </p>
        </div>

        <div className={cn(
          'w-2.5 h-2.5 rounded-full flex-shrink-0 mt-1',
          hasData
            ? successRate >= 90 ? 'bg-green-400 animate-status-glow-green' : 'bg-amber-400 animate-pulse-dot'
            : 'bg-zinc-600'
        )} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4">
        <div className="bg-[#0d0d0d] rounded-lg p-2.5 text-center border border-[#1a1a1a]">
          <p className="text-white font-semibold text-base leading-none">{endpoint.total_events}</p>
          <p className="text-[#555555] text-[10px] mt-1 uppercase tracking-wider">Total</p>
        </div>
        <div className="bg-[#0d0d0d] rounded-lg p-2.5 text-center border border-[#1a1a1a]">
          <p className="text-white font-semibold text-base leading-none">{endpoint.events_today}</p>
          <p className="text-[#555555] text-[10px] mt-1 uppercase tracking-wider">Today</p>
        </div>
        <div className="bg-[#0d0d0d] rounded-lg p-2.5 text-center border border-[#1a1a1a]">
          <p className={cn(
            'font-semibold text-base leading-none',
            hasData
              ? successRate >= 90 ? 'text-green-400' : successRate >= 70 ? 'text-amber-400' : 'text-red-400'
              : 'text-[#444444]'
          )}>
            {hasData ? `${successRate}%` : '—'}
          </p>
          <p className="text-[#555555] text-[10px] mt-1 uppercase tracking-wider">Rate</p>
        </div>
      </div>

      {/* Success rate bar */}
      {hasData && (
        <div className="mb-4">
          <div className="w-full bg-[#1a1a1a] rounded-full h-1">
            <div
              className={cn(
                'h-1 rounded-full transition-all duration-700',
                successRate >= 90 ? 'bg-green-500' : successRate >= 70 ? 'bg-amber-500' : 'bg-red-500'
              )}
              style={{ width: `${Math.max(successRate, 2)}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between">
        <p className="text-[#444444] text-xs">Added {formatDate(endpoint.created_at)}</p>
        <Link
          href={`/connections/${endpoint.id}`}
          className="text-xs text-blue-500 hover:text-blue-400 transition-colors flex items-center gap-1 opacity-0 group-hover:opacity-100"
        >
          <Activity className="w-3 h-3" />
          View events
        </Link>
      </div>

      {/* Webhook URL hint */}
      <div className="mt-3 pt-3 border-t border-[#1a1a1a]">
        <p className="text-[#3a3a3a] text-[10px] font-mono uppercase tracking-wider mb-1">Ingest URL</p>
        <p className="text-[#444444] text-xs font-mono truncate">
          {typeof window !== 'undefined' ? window.location.origin.replace('3001', '3000') : 'http://localhost:3000'}/webhooks/{endpoint.id}
        </p>
      </div>
    </div>
  );
}
