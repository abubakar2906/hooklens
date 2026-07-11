'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import { RefreshCw } from 'lucide-react';
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

export function TopBar() {
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
    <header className="h-[56px] border-b border-[#181818] flex items-center px-5 gap-4 flex-shrink-0 bg-[#0a0a0a]">

      {/* Page title */}
      <div className="flex items-center gap-2">
        <h1 className="text-white font-semibold text-[15px]">{pageTitle}</h1>
      </div>

      <div className="flex-1" />

      {/* Server status */}
      <button
        onClick={check}
        title="Check server status"
        className={cn(
          'flex items-center gap-2 bg-[#111111] border border-[#1e1e1e] rounded-full px-3 py-1.5 transition-all hover:border-[#2a2a2a]',
        )}
      >
        {checking ? (
          <RefreshCw className="w-3 h-3 text-[#555555] animate-spin" />
        ) : (
          <span
            className={cn(
              'w-2 h-2 rounded-full flex-shrink-0 transition-colors',
              isLive
                ? 'bg-green-400 animate-status-glow-green'
                : 'bg-[#333333]'
            )}
          />
        )}
        <span className={cn(
          'text-xs font-medium transition-colors',
          isLive ? 'text-green-400' : 'text-[#444444]'
        )}>
          {isLive ? 'Connected' : 'Offline'}
        </span>
      </button>
    </header>
  );
}