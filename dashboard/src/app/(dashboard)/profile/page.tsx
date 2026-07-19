import { currentUser } from '@clerk/nextjs/server';

export default async function ProfilePage() {
  const user = await currentUser();
  const email = user?.emailAddresses[0]?.emailAddress || 'admin@hooklens.com';
  const name = user?.firstName ? `${user.firstName} ${user.lastName || ''}` : 'Admin';
  
  return (
    <div className="p-6 max-w-[800px] mx-auto animate-fade-in-up font-sans">
      <div className="mb-6">
        <h2 className="text-ink font-semibold text-[16px] tracking-tight">Profile & Workspace</h2>
        <p className="text-ink-subtle text-[13px] mt-1">Manage your account and workspace information</p>
      </div>

      <div className="bg-surface-1 border border-hairline rounded-lg p-6 space-y-6">
        <div>
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-3">User Profile</label>
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full bg-surface-2 border border-hairline-strong flex items-center justify-center flex-shrink-0">
               <span className="text-ink text-[20px] font-medium">{name.charAt(0)}</span>
            </div>
            <div>
              <p className="text-[14px] text-ink font-medium">{name}</p>
              <p className="text-[13px] text-ink-subtle mt-0.5">{email}</p>
            </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-6">
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-3">Workspace Details</label>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
             <div className="bg-surface-2 border border-hairline p-4 rounded-md">
                <p className="text-[12px] text-ink-subtle font-medium mb-1">Workspace ID</p>
                <p className="text-[13px] text-ink font-mono">{user?.id || 'ws_default_123'}</p>
             </div>
             <div className="bg-surface-2 border border-hairline p-4 rounded-md">
                <p className="text-[12px] text-ink-subtle font-medium mb-1">Plan</p>
                <div className="flex items-center gap-2 mt-1">
                   <p className="text-[13px] text-ink font-medium">Pro (Self-hosted)</p>
                   <span className="bg-green-500/10 text-green-500 text-[10px] font-medium px-2 py-0.5 rounded-full border border-green-500/20">Active</span>
                </div>
             </div>
          </div>
        </div>

        <div className="border-t border-hairline pt-6">
          <label className="text-[11px] text-ink-subtle uppercase tracking-[0.05em] font-semibold block mb-3">Site Information</label>
          <div className="space-y-4">
             <div>
               <p className="text-[12px] text-ink-subtle font-medium mb-1">Project Name</p>
               <input
                 type="text"
                 defaultValue="HookLens Primary"
                 readOnly
                 className="w-full max-w-sm bg-surface-2 border border-hairline rounded-md px-3 py-2 text-[13px] text-ink-muted focus:outline-none"
               />
             </div>
             <div>
               <p className="text-[12px] text-ink-subtle font-medium mb-1">Ingestion Domain</p>
               <input
                 type="text"
                 defaultValue={process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000'}
                 readOnly
                 className="w-full max-w-sm bg-surface-2 border border-hairline rounded-md px-3 py-2 text-[13px] text-ink-muted font-mono focus:outline-none"
               />
               <p className="text-[11px] text-ink-tertiary mt-1">This is the base URL where your webhooks are received.</p>
             </div>
          </div>
        </div>
      </div>
    </div>
  );
}
