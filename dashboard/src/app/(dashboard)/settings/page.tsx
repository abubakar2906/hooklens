export default function SettingsPage() {
  return (
    <div className="p-6 max-w-[800px] mx-auto animate-fade-in-up">
      <div className="mb-6">
        <h2 className="text-white font-semibold text-base">Settings</h2>
        <p className="text-[#555555] text-xs mt-0.5">Configure your HookLens instance</p>
      </div>

      <div className="bg-[#111111] border border-[#1e1e1e] rounded-xl p-6 space-y-5">
        <div>
          <label className="text-xs text-[#666666] uppercase tracking-wider font-medium block mb-2">Backend API URL</label>
          <div className="flex items-center gap-3">
            <input
              type="text"
              defaultValue="http://localhost:3000"
              readOnly
              className="flex-1 bg-[#0d0d0d] border border-[#1e1e1e] rounded-lg px-3 py-2.5 text-sm text-[#888888] font-mono focus:outline-none"
            />
            <span className="text-[10px] text-[#444444] bg-[#0d0d0d] border border-[#1e1e1e] px-2 py-1 rounded-md">Read-only</span>
          </div>
          <p className="text-[#444444] text-xs mt-1.5">Set NEXT_PUBLIC_API_URL in .env.local to change</p>
        </div>

        <div className="border-t border-[#1a1a1a] pt-5">
          <label className="text-xs text-[#666666] uppercase tracking-wider font-medium block mb-2">Supported Providers</label>
          <div className="flex gap-2 flex-wrap">
            {[
              { name: 'Paystack', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
              { name: 'Flutterwave', color: 'text-orange-400 bg-orange-500/10 border-orange-500/20' },
              { name: 'Monnify', color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
              { name: 'Generic', color: 'text-zinc-400 bg-zinc-500/10 border-zinc-500/20' },
            ].map(({ name, color }) => (
              <span key={name} className={`text-xs px-3 py-1 rounded-full border ${color}`}>{name}</span>
            ))}
          </div>
        </div>

        <div className="border-t border-[#1a1a1a] pt-5">
          <label className="text-xs text-[#666666] uppercase tracking-wider font-medium block mb-2">Version</label>
          <p className="text-sm text-[#888888] font-mono">hooklens v0.1.0 — self-hosted</p>
        </div>
      </div>
    </div>
  );
}
