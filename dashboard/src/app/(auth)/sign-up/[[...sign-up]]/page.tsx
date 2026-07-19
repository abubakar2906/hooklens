import { SignUp } from '@clerk/nextjs';
import HideClerkBadge from '@/components/hide-clerk-badge';

export default function SignUpPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black p-4 relative overflow-hidden">
      <HideClerkBadge />
      {/* Ultra-subtle background glow */}
      <div className="absolute top-0 left-0 w-full h-full bg-black pointer-events-none" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1200px] h-[800px] bg-white/[0.02] rounded-full blur-[120px] pointer-events-none" />
      
      {/* Subdued Back to Home Button */}
      <div className="absolute top-6 left-6 z-20">
        <a href="/" className="text-zinc-500 hover:text-white text-[13px] flex items-center gap-1.5 transition-colors font-medium">
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="m15 18-6-6 6-6"/></svg>
          Home
        </a>
      </div>

      <div className="relative z-10 w-full max-w-[400px] flex flex-col items-center gap-8 mt-4">
        {/* Proportional HookLens Logo without drop shadow */}
        <div className="w-10 h-10 bg-[#010102] rounded-[10px] border border-[#23252a] flex items-center justify-center">
          <svg width="22" height="22" viewBox="0 0 20 20" fill="none">
            <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
            <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
          </svg>
        </div>
        <div className="w-full">
          <SignUp path="/sign-up" routing="path" signInUrl="/sign-in" forceRedirectUrl="/onboarding" />
        </div>
      </div>
    </div>
  );
}
