'use client';
import { useState } from 'react';
import Link from 'next/link';
import { ProviderBadge } from './provider-badge';
import { cn, formatDate } from '@/lib/utils';
import type { Endpoint } from '@/types';

// Custom Minimal Icons
function IconExternal({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.5 8.5V12C12.5 12.5523 12.0523 13 11.5 13H4C3.44772 13 3 12.5523 3 12V4.5C3 3.94772 3.44772 3.5 4 3.5H7.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M9 3H13V7" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M12.5 3.5L7 9" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconActivity({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2 8H4.5L6.5 3L9.5 13L11.5 8H14" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

interface EndpointCardProps {
  endpoint: Endpoint;
  delay?: number;
}

export function EndpointCard({ endpoint, delay = 0 }: EndpointCardProps) {
  const successRate = endpoint.success_rate ?? 0;
  const hasData = endpoint.total_events > 0;
  const [copied, setCopied] = useState(false);

  const baseUrl =
    typeof window !== 'undefined'
      ? window.location.origin.replace('3001', '3000')
      : 'http://localhost:3000';

  const ingestUrl = `${baseUrl}/webhooks/${endpoint.id}`;

  async function handleCopy() {
    await navigator.clipboard.writeText(ingestUrl);
    setCopied(true);

    setTimeout(() => {
      setCopied(false)
    }, 2000);
  }


  return (
    <div
      className="group bg-surface-1 border border-hairline rounded-lg p-5 hover:border-hairline-strong hover:bg-surface-2 transition-all duration-300 animate-fade-in-up flex flex-col font-sans"
      style={{ animationDelay: `${delay}ms`, animationFillMode: 'both' }}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-3 mb-5">
        <div className="min-w-0 flex-1">
          <ProviderBadge type={endpoint.provider_type} className="mb-3" />
          <div className="flex items-center gap-2">
            <p className="text-ink text-[13px] font-mono truncate">{endpoint.url}</p>
            <a
              href={endpoint.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-ink-subtle hover:text-ink transition-colors flex-shrink-0"
              title="Open URL"
            >
              <IconExternal className="w-3.5 h-3.5" />
            </a>
          </div>
          <p className="text-ink-subtle text-[12px] mt-1 font-mono">
            {endpoint.id.slice(0, 18)}…
          </p>
        </div>

        <div className={cn(
          'w-2 h-2 rounded-full flex-shrink-0 mt-1.5',
          hasData
            ? successRate >= 90 ? 'bg-[#27a644]' : 'bg-destructive'
            : 'bg-ink-tertiary'
        )} />
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-3 gap-3 mb-4 mt-auto">
        <div className="bg-background rounded-md p-2.5 text-center border border-hairline">
          <p className="text-ink font-semibold text-[15px] leading-none">{endpoint.total_events}</p>
          <p className="text-ink-subtle text-[10px] mt-1.5 uppercase tracking-[0.05em]">Total</p>
        </div>
        <div className="bg-background rounded-md p-2.5 text-center border border-hairline">
          <p className="text-ink font-semibold text-[15px] leading-none">{endpoint.events_today}</p>
          <p className="text-ink-subtle text-[10px] mt-1.5 uppercase tracking-[0.05em]">Today</p>
        </div>
        <div className="bg-background rounded-md p-2.5 text-center border border-hairline">
          <p className={cn(
            'font-semibold text-[15px] leading-none',
            hasData
              ? successRate >= 90 ? 'text-[#27a644]' : 'text-destructive'
              : 'text-ink-tertiary'
          )}>
            {hasData ? `${successRate}%` : '—'}
          </p>
          <p className="text-ink-subtle text-[10px] mt-1.5 uppercase tracking-[0.05em]">Rate</p>
        </div>
      </div>

      {/* Success rate bar */}
      {hasData && (
        <div className="mb-5">
          <div className="w-full bg-surface-2 rounded-full h-[2px]">
            <div
              className={cn(
                'h-[2px] rounded-full transition-all duration-700',
                successRate >= 90 ? 'bg-[#27a644]' : 'bg-destructive'
              )}
              style={{ width: `${Math.max(successRate, 2)}%` }}
            />
          </div>
        </div>
      )}

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-hairline pt-4 mt-1">
        <p className="text-ink-tertiary text-[11px]">Added {formatDate(endpoint.created_at)}</p>
        <Link
          href={`/events?endpoint_id=${endpoint.id}`}
          className="text-[12px] font-medium text-ink-subtle hover:text-ink transition-colors flex items-center gap-1.5"
        >
          <IconActivity className="w-3.5 h-3.5" />
          View events
        </Link>
      </div>

      {/* Webhook URL hint */}
      <div className="mt-4 bg-background border border-hairline rounded-md p-3">
        <p className="text-ink-tertiary text-[10px] font-semibold uppercase tracking-wider mb-1.5">
          Ingest URL
        </p>

        <div className="flex items-center gap-2">
          <p className="text-ink-subtle text-[11px] font-mono truncate flex-1">
            {ingestUrl}
          </p>

          <button
            type="button"
            onClick={handleCopy}
            className="text-[11px] text-ink-subtle hover:text-ink border border-hairline rounded px-2 py-1"
          >
            {copied ? 'Copied' : 'Copy'}
          </button>
        </div>
      </div>
    </div>
  );
}
