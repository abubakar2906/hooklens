'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, RefreshCw, Network } from 'lucide-react';
import { api } from '@/lib/api';
import { EndpointCard } from '@/components/endpoint-card';
import { NewEndpointDialog } from '@/components/new-endpoint-dialog';
import type { Endpoint } from '@/types';

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
    <div className="p-6 max-w-[1100px] mx-auto">

      {/* Page header */}
      <div className="flex items-center justify-between mb-6 animate-fade-in-up">
        <div>
          <h2 className="text-white font-semibold text-base">Connections</h2>
          <p className="text-[#555555] text-xs mt-0.5">
            {endpoints.length} webhook destination{endpoints.length !== 1 ? 's' : ''} registered
          </p>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => load()}
            disabled={loading}
            className="flex items-center gap-1.5 text-xs text-[#555555] hover:text-white px-3 py-2 rounded-lg border border-[#1e1e1e] hover:border-[#2a2a2a] transition-all disabled:opacity-50"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setDialogOpen(true)}
            className="flex items-center gap-2 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Connection
          </button>
        </div>
      </div>

      {/* Content */}
      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-64 animate-shimmer rounded-xl" />
          ))}
        </div>
      ) : endpoints.length === 0 ? (
        <div className="flex flex-col items-center justify-center h-64 bg-[#0d0d0d] border border-[#1a1a1a] border-dashed rounded-2xl text-center animate-fade-in">
          <div className="w-14 h-14 rounded-2xl bg-[#141414] border border-[#1e1e1e] flex items-center justify-center mb-4">
            <Network className="w-6 h-6 text-[#333333]" />
          </div>
          <p className="text-white text-sm font-medium">No connections yet</p>
          <p className="text-[#444444] text-xs mt-1 max-w-xs">
            Register your first webhook destination to start receiving and forwarding events from Paystack, Flutterwave, or Monnify.
          </p>
          <button
            onClick={() => setDialogOpen(true)}
            className="mt-5 flex items-center gap-2 px-5 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-sm font-medium transition-all"
          >
            <Plus className="w-4 h-4" />
            New Connection
          </button>
        </div>
      ) : (
        <>
          {/* Provider summary row */}
          <div className="flex items-center gap-3 mb-5 flex-wrap">
            {(['paystack', 'flutterwave', 'monnify', 'generic'] as const).map((p) => {
              const count = endpoints.filter((e) => e.provider_type === p).length;
              if (count === 0) return null;
              return (
                <div key={p} className="flex items-center gap-1.5 text-xs text-[#555555] bg-[#111111] border border-[#1e1e1e] rounded-full px-3 py-1">
                  <span className={
                    p === 'paystack' ? 'w-1.5 h-1.5 rounded-full bg-emerald-400' :
                      p === 'flutterwave' ? 'w-1.5 h-1.5 rounded-full bg-orange-400' :
                        p === 'monnify' ? 'w-1.5 h-1.5 rounded-full bg-violet-400' :
                          'w-1.5 h-1.5 rounded-full bg-zinc-400'
                  } />
                  {p.charAt(0).toUpperCase() + p.slice(1)}: <span className="text-white ml-0.5">{count}</span>
                </div>
              );
            })}
          </div>

          {/* Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {endpoints.map((ep, idx) => (
              <EndpointCard key={ep.id} endpoint={ep} delay={idx * 60} />
            ))}
          </div>
        </>
      )}

      {/* Provider guide */}
      <div className="mt-8 bg-[#0d0d0d] border border-[#181818] rounded-xl p-5 animate-fade-in-up" style={{ animationDelay: '300ms', animationFillMode: 'both' }}>
        <h3 className="text-white text-sm font-semibold mb-3">Webhook Ingest URLs</h3>
        <p className="text-[#555555] text-xs mb-4 leading-relaxed">
          Point your provider's webhook settings to the URL below (replace{' '}
          <span className="text-[#777777] font-mono">{'{id}'}</span> with your connection ID):
        </p>
        <div className="bg-[#0a0a0a] border border-[#1a1a1a] rounded-lg px-4 py-3 font-mono text-xs text-blue-400">
          http://localhost:3000/webhooks/<span className="text-[#555555]">{'{connection-id}'}</span>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
          {[
            { name: 'Paystack', color: 'text-emerald-400', desc: 'Set under Settings → API Keys & Webhooks' },
            { name: 'Flutterwave', color: 'text-orange-400', desc: 'Set under Settings → Webhooks' },
            { name: 'Monnify', color: 'text-violet-400', desc: 'Set under Settings → Webhook Notifications' },
          ].map(({ name, color, desc }) => (
            <div key={name} className="bg-[#111111] border border-[#1a1a1a] rounded-lg p-3">
              <p className={`text-xs font-semibold mb-1 ${color}`}>{name}</p>
              <p className="text-[#444444] text-[11px] leading-snug">{desc}</p>
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
