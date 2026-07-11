'use client';

import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

const PROVIDERS = [
  { value: 'paystack', label: 'Paystack', desc: 'HMAC-SHA512 signature via x-paystack-signature' },
  { value: 'flutterwave', label: 'Flutterwave', desc: 'HMAC-SHA256 via verif-hash header' },
  { value: 'monnify', label: 'Monnify', desc: 'HMAC-SHA512 via monnify-signature header' },
  { value: 'generic', label: 'Generic', desc: 'No signature verification — raw passthrough' },
];

interface NewEndpointDialogProps {
  open: boolean;
  onClose: () => void;
  onCreated: () => void;
}

export function NewEndpointDialog({ open, onClose, onCreated }: NewEndpointDialogProps) {
  const [url, setUrl] = useState('');
  const [provider, setProvider] = useState('paystack');
  const [secret, setSecret] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const needsSecret = provider !== 'generic';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    if (!url.trim()) return setError('Destination URL is required');
    if (needsSecret && !secret.trim()) return setError('Webhook secret is required for this provider');

    setLoading(true);
    try {
      await api.createEndpoint({
        url: url.trim(),
        provider_type: provider,
        secret: needsSecret ? secret.trim() : undefined,
      });
      setUrl('');
      setSecret('');
      setProvider('paystack');
      onCreated();
      onClose();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to create endpoint');
    } finally {
      setLoading(false);
    }
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-[#111111] border border-[#222222] rounded-2xl shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#1e1e1e]">
          <div>
            <h2 className="text-white font-semibold text-base">New Connection</h2>
            <p className="text-[#555555] text-xs mt-0.5">Register a webhook destination endpoint</p>
          </div>
          <button
            onClick={onClose}
            className="w-7 h-7 rounded-lg flex items-center justify-center text-[#555555] hover:text-white hover:bg-[#1e1e1e] transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          {/* Provider selector */}
          <div>
            <label className="text-xs text-[#777777] font-medium uppercase tracking-wider block mb-2">
              Provider
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  className={cn(
                    'text-left p-3 rounded-lg border transition-all text-sm',
                    provider === p.value
                      ? 'border-blue-500/50 bg-blue-500/10 text-white'
                      : 'border-[#222222] bg-[#0d0d0d] text-[#666666] hover:border-[#333333] hover:text-white'
                  )}
                >
                  <div className="font-medium">{p.label}</div>
                  <div className="text-[10px] mt-0.5 opacity-70 leading-tight">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Destination URL */}
          <div>
            <label className="text-xs text-[#777777] font-medium uppercase tracking-wider block mb-2">
              Destination URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks/handler"
              className="w-full bg-[#0d0d0d] border border-[#222222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444444] focus:outline-none focus:border-blue-500/50 focus:bg-[#0d0f12] transition-all font-mono"
            />
          </div>

          {/* Secret (conditional) */}
          {needsSecret && (
            <div>
              <label className="text-xs text-[#777777] font-medium uppercase tracking-wider block mb-2">
                Webhook Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Your provider webhook secret key"
                className="w-full bg-[#0d0d0d] border border-[#222222] rounded-lg px-3 py-2.5 text-sm text-white placeholder:text-[#444444] focus:outline-none focus:border-blue-500/50 focus:bg-[#0d0f12] transition-all font-mono"
              />
              <p className="text-[#444444] text-xs mt-1.5">
                Used for HMAC signature verification of incoming webhooks
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-red-500/10 border border-red-500/20 rounded-lg px-3 py-2 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-lg border border-[#222222] text-sm text-[#666666] hover:text-white hover:border-[#333333] transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-lg bg-blue-600 hover:bg-blue-500 disabled:opacity-50 disabled:cursor-not-allowed text-white text-sm font-medium transition-all flex items-center justify-center gap-2"
            >
              <Plus className="w-4 h-4" />
              {loading ? 'Creating…' : 'Create Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
