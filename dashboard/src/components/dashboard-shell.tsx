'use client';

import { useState } from 'react';
import { usePathname } from 'next/navigation';
import { Sidebar } from './sidebar';
import { TopBar } from './top-bar';

const NO_SHELL_ROUTES = ['/'];

export function DashboardShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const isShellless = NO_SHELL_ROUTES.includes(pathname);
  
  const [isCollapsed, setIsCollapsed] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  if (isShellless) {
    return <>{children}</>;
  }

  return (
    <div className="flex h-screen overflow-hidden bg-background text-ink font-sans relative">
      <Sidebar 
        isCollapsed={isCollapsed}
        onToggleCollapse={() => setIsCollapsed(!isCollapsed)}
        isMobileOpen={isMobileOpen} 
        onCloseMobile={() => setIsMobileOpen(false)} 
      />
      <div className="flex flex-1 flex-col overflow-hidden min-w-0">
        <TopBar 
          onToggleMobile={() => setIsMobileOpen(true)} 
        />
        <main className="flex-1 overflow-y-auto">
          {children}
        </main>
      </div>
    </div>
  );
}
