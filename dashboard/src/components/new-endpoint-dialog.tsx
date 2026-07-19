'use client';

import { useState } from 'react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

// Custom Minimal Icons
function IconPlus({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M8 3.5V12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconX({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M4.5 4.5L11.5 11.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M4.5 11.5L11.5 4.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 font-sans">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-[#010102]/80 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative w-full max-w-lg bg-surface-1 border border-hairline rounded-xl shadow-2xl animate-fade-in-up">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-hairline bg-surface-1 rounded-t-xl">
          <div>
            <h2 className="text-ink font-semibold text-[15px] tracking-tight">New Connection</h2>
            <p className="text-ink-subtle text-[12px] mt-1">Register a webhook destination endpoint</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-md flex items-center justify-center text-ink-tertiary hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
          >
            <IconX className="w-4 h-4" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Provider selector */}
          <div>
            <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
              Provider
            </label>
            <div className="grid grid-cols-2 gap-3">
              {PROVIDERS.map((p) => (
                <button
                  key={p.value}
                  type="button"
                  onClick={() => setProvider(p.value)}
                  className={cn(
                    'text-left p-4 rounded-md border transition-all',
                    provider === p.value
                      ? 'border-ring bg-primary/10 text-ink'
                      : 'border-hairline bg-background text-ink-subtle hover:border-hairline-strong hover:text-ink'
                  )}
                >
                  <div className="font-semibold text-[13px]">{p.label}</div>
                  <div className="text-[11px] mt-1 opacity-80 leading-snug">{p.desc}</div>
                </button>
              ))}
            </div>
          </div>

          {/* Destination URL */}
          <div>
            <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
              Destination URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              placeholder="https://your-app.com/webhooks/handler"
              className="w-full bg-background border border-hairline rounded-md px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all font-mono"
            />
          </div>

          {/* Secret (conditional) */}
          {needsSecret && (
            <div>
              <label className="text-[11px] text-ink-subtle font-semibold uppercase tracking-[0.05em] block mb-3">
                Webhook Secret
              </label>
              <input
                type="password"
                value={secret}
                onChange={(e) => setSecret(e.target.value)}
                placeholder="Your provider webhook secret key"
                className="w-full bg-background border border-hairline rounded-md px-3.5 py-2.5 text-[13px] text-ink placeholder:text-ink-tertiary focus:outline-none focus:border-ring focus:ring-1 focus:ring-ring/50 transition-all font-mono"
              />
              <p className="text-ink-tertiary text-[11px] mt-2">
                Used for HMAC signature verification of incoming webhooks
              </p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-destructive/10 border border-destructive/20 rounded-md px-4 py-3 text-[13px] font-medium text-destructive">
              {error}
            </div>
          )}

          {/* Actions */}
          <div className="flex items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 py-2.5 rounded-md border border-hairline text-[13px] font-medium text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 py-2.5 rounded-md bg-primary hover:bg-primary-hover disabled:opacity-50 disabled:cursor-not-allowed text-primary-foreground text-[13px] font-medium transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <IconPlus className="w-4 h-4" />
              {loading ? 'Creating…' : 'Create Connection'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
