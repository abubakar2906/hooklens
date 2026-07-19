export default function SettingsPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto animate-fade-in-up font-sans">
      <div className="mb-6">
        <h2 className="text-ink font-semibold text-[16px] tracking-tight">Settings</h2>
        <p className="text-ink-subtle text-[13px] mt-1">Configure your HookLens instance</p>
      </div>

      <div className="bg-surface-1 border border-hairline rounded-lg p-6 space-y-6">
        <div>
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-2.5">Backend API URL</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              defaultValue="http://localhost:3000"
              readOnly
              className="flex-1 bg-surface-2 border border-hairline rounded-md px-3 py-2 text-[13px] text-ink-muted font-mono focus:outline-none"
            />
            <span className="text-[10px] text-ink-tertiary font-medium bg-background border border-hairline px-2 py-1 rounded-md">Read-only</span>
          </div>
          <p className="text-ink-tertiary text-[12px] mt-2">Set <span className="font-mono text-[11px]">NEXT_PUBLIC_API_URL</span> in .env.local to change</p>
        </div>

        <div className="border-t border-hairline pt-6">
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-3">Supported Providers</label>
          <div className="flex gap-2.5 flex-wrap">
            {[
              { name: 'Paystack', color: 'text-[#27a644] bg-[#27a644]/10 border-[#27a644]/20' },
              { name: 'Flutterwave', color: 'text-[#f59e0b] bg-[#f59e0b]/10 border-[#f59e0b]/20' },
              { name: 'Monnify', color: 'text-[#8b5cf6] bg-[#8b5cf6]/10 border-[#8b5cf6]/20' },
              { name: 'Generic', color: 'text-ink-muted bg-surface-2 border-hairline-strong' },
            ].map(({ name, color }) => (
              <span key={name} className={`text-[12px] font-medium px-3 py-1 rounded-full border ${color}`}>{name}</span>
            ))}
          </div>
        </div>

        <div className="border-t border-hairline pt-6">
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-2">Version</label>
          <p className="text-[13px] text-ink-muted font-mono">hooklens v0.1.0 — self-hosted</p>
        </div>
      </div>
    </div>
  );
}
