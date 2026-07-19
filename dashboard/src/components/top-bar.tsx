'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';

const API = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000';

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': 'Overview',
  '/events': 'Events',
  '/connections': 'Connections',
  '/settings': 'Settings',
};

function getPageTitle(pathname: string): string {
  if (PAGE_TITLES[pathname]) return PAGE_TITLES[pathname];
  if (pathname.startsWith('/events/')) return 'Event Detail';
  if (pathname.startsWith('/connections/')) return 'Connection Detail';
  return 'HookLens';
}

function IconRefresh({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M12.5 8C12.5 10.4853 10.4853 12.5 8 12.5C5.51472 12.5 3.5 10.4853 3.5 8C3.5 5.51472 5.51472 3.5 8 3.5C9.09101 3.5 10.0913 3.8885 10.875 4.5377" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
      <path d="M11 2V4.5H8.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function IconMenu({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M2.5 4.5H13.5M2.5 8H13.5M2.5 11.5H13.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface TopBarProps {
  onToggleMobile: () => void;
}

export function TopBar({ onToggleMobile }: TopBarProps) {
  const pathname = usePathname();
  const [isLive, setIsLive] = useState(false);
  const [checking, setChecking] = useState(false);

  const check = async () => {
    setChecking(true);
    try {
      const res = await fetch(`${API}/health`, { signal: AbortSignal.timeout(3000) });
      setIsLive(res.ok);
    } catch {
      setIsLive(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    check();
    const id = setInterval(check, 15_000);
    return () => clearInterval(id);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const pageTitle = getPageTitle(pathname);

  return (
    <header className="h-[56px] border-b border-hairline flex items-center px-4 md:px-6 gap-3 flex-shrink-0 bg-background font-sans">
      
      {/* Mobile Menu Toggle */}
      <button 
        onClick={onToggleMobile}
        className="md:hidden w-8 h-8 flex items-center justify-center text-ink-subtle hover:text-ink hover:bg-surface-2 rounded-md transition-colors"
        aria-label="Toggle mobile menu"
      >
        <IconMenu className="w-4 h-4" />
      </button>

      {/* Page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-ink font-semibold text-[14px]">{pageTitle}</h1>
      </div>

      <div className="flex-1" />

      {/* Server status */}
      <button
        onClick={check}
        title="Check server status"
        className={cn(
          'flex items-center gap-2 bg-surface-1 border border-hairline rounded-md px-2.5 py-1 transition-colors hover:bg-surface-2 hover:border-hairline-strong cursor-pointer',
        )}
      >
        {checking ? (
          <IconRefresh className="w-3.5 h-3.5 text-ink-subtle animate-spin" />
        ) : (
          <span
            className={cn(
              'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
              isLive
                ? 'bg-[#27a644]' // semantic success
                : 'bg-[#62666d]' // ink-tertiary
            )}
          />
        )}
        <span className={cn(
          'hidden sm:inline text-[12px] font-medium transition-colors',
          isLive ? 'text-ink-muted' : 'text-ink-tertiary'
        )}>
          {isLive ? 'Connected' : 'Offline'}
        </span>
      </button>
    </header>
  );
}