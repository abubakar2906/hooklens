'use client';

import { useEffect, useState, useCallback } from 'react';
import { api } from '@/lib/api';
import { EndpointCard } from '@/components/endpoint-card';
import { NewEndpointDialog } from '@/components/new-endpoint-dialog';
import { cn } from '@/lib/utils';
import type { Endpoint } from '@/types';

// Custom Minimal Icons
function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5C9.09101 3.5 10.0913 3.8885 10.875 4.5377" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 2V4.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
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

export default function ConnectionsPage() {
  const [endpoints, setEndpoints] = useState<Endpoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const data = await api.getEndpoints();
      setEndpoints(data);
    } catch {
      setEndpoints([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  return (
    <div className="p-6 max-w-[1280px] mx-auto font-sans pb-24">
      {/* Page header */}
      <div className="flex items-center justify-between mb-8 animate-fade-in-up">
        <div>
          <h2 className="text-ink font-semibold text-[16px] tracking-tight">Connections</h2>
          <p className="text-ink-subtle text-[13px] mt-1">
            {endpoints.length} webhook destination{endpoints.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => load()}
            disabled={loading}
            className="flex items-center gap-1.5 text-[13px] text-ink-subtle hover:text-ink px-3 py-1.5 rounded-md border border-hairline bg-surface-1 hover:bg-surface-2 hover:border-hairline-strong transition-colors disabled:opacity-50 cursor-pointer"
          >
            <IconRefresh className={cn('w-3.5 h-3.5', loading && 'animate-spin')} />
            Refresh
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-[13px] font-medium transition-colors cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            New Connection
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-shimmer rounded-lg bg-surface-1 border border-hairline" />
          ))}
        </div>
      ) : endpoints.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-[400px] bg-background border border-hairline rounded-lg text-center animate-fade-in">
          <div className="w-12 h-12 rounded-full border border-hairline flex items-center justify-center mb-4">
            <IconNetwork className="w-5 h-5 text-ink-tertiary" />
          </div>
          <p className="text-ink text-[15px] font-medium">No connections yet</p>
          <p className="text-ink-subtle text-[13px] mt-1.5 max-w-sm leading-relaxed">
            Register your first webhook destination to start receiving and forwarding events from Paystack, Flutterwave, or Monnify.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-6 flex items-center gap-1.5 px-4 py-2 rounded-md bg-primary hover:bg-primary-hover text-primary-foreground text-[13px] font-medium transition-colors cursor-pointer"
          >
            <IconPlus className="w-4 h-4" />
            New Connection
          </button>
        </div>
      ) : (
        <>
          {/* Provider summary row */}
          <div className="flex items-center gap-3 mb-6 flex-wrap">
            {(['paystack', 'flutterwave', 'monnify', 'generic'] as const).map((p) => {
              const count = endpoints.filter((e) => e.provider_type === p).length;
              if (count === 0) return null;
              return (
                <div key={p} className="flex items-center gap-2 text-[12px] font-medium text-ink-subtle bg-surface-1 border border-hairline rounded-md px-3 py-1.5">
                  <span className={cn(
                    'w-1.5 h-1.5 rounded-full',
                    p === 'paystack' ? 'bg-[#27a644]' :
                    p === 'flutterwave' ? 'bg-[#f59e0b]' :
                    p === 'monnify' ? 'bg-[#8b5cf6]' :
                    'bg-ink-tertiary'
                  )} />
                  {p.charAt(0).toUpperCase() + p.slice(1)}: <span className="text-ink ml-0.5">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {endpoints.map((ep, idx) => (
              <EndpointCard key={ep.id} endpoint={ep} delay={idx * 60} />
            ))}
          </div>
        </>
      )}

      {/* Provider guide */}
      <div className="mt-12 bg-surface-1 border border-hairline rounded-lg p-6 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        <h3 className="text-ink text-[14px] font-semibold tracking-tight mb-2">Webhook Ingest URLs</h3>
        <p className="text-ink-subtle text-[13px] mb-5 leading-relaxed max-w-2xl">
          Point your provider's webhook settings to the URL below (replace{' '}
          <span className="text-ink font-mono">{'{id}'}</span> with your connection ID):
        </p>
        <div className="bg-background border border-hairline rounded-md px-4 py-3 font-mono text-[13px] text-ink flex items-center select-all cursor-text">
          {typeof window !== 'undefined' ? window.location.origin.replace('3001', '3000') : 'http://localhost:3000'}/webhooks/<span className="text-ink-tertiary ml-1">{'{connection-id}'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          {[
            { name: 'Paystack', color: 'text-[#27a644]', desc: 'Set under Settings → API Keys & Webhooks' },
            { name: 'Flutterwave', color: 'text-[#f59e0b]', desc: 'Set under Settings → Webhooks' },
            { name: 'Monnify', color: 'text-[#8b5cf6]', desc: 'Set under Settings → Webhook Notifications' },
          ].map(({ name, color, desc }) => (
            <div key={name} className="bg-background border border-hairline rounded-md p-4">
              <p className={cn('text-[13px] font-semibold mb-1.5', color)}>{name}</p>
              <p className="text-ink-subtle text-[12px] leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </div>

      <NewEndpointDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onCreated={load}
      />
    </div>
  );
}
