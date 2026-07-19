'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useEffect } from 'react';

// Minimal Inline SVG Icons mimicking Linear's fine-line aesthetic
function IconOverview({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="2" stroke="currentColor" strokeWidth="1.2" />
      <path d="M2.5 7.5H13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconEvents({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="8" cy="8" r="5.5" stroke="currentColor" strokeWidth="1.2" strokeDasharray="2 2" />
      <circle cx="8" cy="8" r="1.5" fill="currentColor" />
    </svg>
  );
}

function IconConnections({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M5 8H11" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="3" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <circle cx="13" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

function IconSettings({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M3.5 8H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="5" cy="8" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 12H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="11" cy="12" r="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M3.5 4H12.5" stroke="currentColor" strokeWidth="1.2" strokeLinecap="round" />
      <circle cx="8" cy="4" r="1.5" stroke="currentColor" strokeWidth="1.2" />
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

function IconPanelLeft({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect x="2.5" y="2.5" width="11" height="11" rx="1.5" stroke="currentColor" strokeWidth="1.2" />
      <path d="M6 2.5V13.5" stroke="currentColor" strokeWidth="1.2" />
    </svg>
  );
}

const SECTIONS = [
  {
    title: 'Monitor',
    items: [
      { href: '/dashboard', label: 'Overview', icon: IconOverview },
      { href: '/events', label: 'Events', icon: IconEvents },
    ],
  },
  {
    title: 'Manage',
    items: [
      { href: '/connections', label: 'Connections', icon: IconConnections },
    ],
  },
];

function HookLensLogo() {
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" xmlns="http://www.w3.org/2000/svg" className="flex-shrink-0">
      <circle cx="10" cy="10" r="8" stroke="var(--primary)" strokeWidth="1.5" />
      <circle cx="10" cy="10" r="3.5" fill="var(--primary)" />
      <path d="M10 3 L10 6.5 M10 13.5 L10 17 M3 10 L6.5 10 M13.5 10 L17 10" stroke="var(--primary)" strokeWidth="1.2" strokeLinecap="round" />
    </svg>
  );
}

interface SidebarProps {
  isCollapsed: boolean;
  onToggleCollapse: () => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export function Sidebar({ isCollapsed, onToggleCollapse, isMobileOpen, onCloseMobile }: SidebarProps) {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  // Close mobile sidebar on route change
  useEffect(() => {
    onCloseMobile();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname]);

  const content = (
    <aside className={cn(
      "flex flex-col border-r bg-surface-1 border-hairline font-sans h-full transition-all duration-300 overflow-hidden",
      isCollapsed ? "w-[68px]" : "w-[240px]"
    )}>
      
      {/* Workspace Switcher / Logo & Controls */}
      <div className={cn(
        "flex items-center h-[56px] flex-shrink-0 border-b border-transparent transition-colors",
        isCollapsed ? "flex-col justify-center gap-4 py-4 h-auto" : "px-5 justify-between"
      )}>
        <Link href="/dashboard" className={cn("flex items-center gap-3 cursor-pointer", isCollapsed && "justify-center")}>
          <HookLensLogo />
          {!isCollapsed && (
            <div className="flex flex-col">
              <span className="text-ink font-semibold text-[14px] tracking-tight leading-tight hover:text-white transition-colors">HookLens</span>
            </div>
          )}
        </Link>
        
        {/* Toggle / Close Buttons */}
        <div className="flex items-center">
          {/* Mobile close button inside sidebar header */}
          {!isCollapsed && (
            <button onClick={onCloseMobile} className="md:hidden p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors">
              <IconX className="w-4 h-4" />
            </button>
          )}
          {/* Desktop collapse toggle */}
          <button 
            onClick={onToggleCollapse} 
            className="hidden md:flex p-1.5 rounded-md text-ink-subtle hover:text-ink hover:bg-surface-2 transition-colors"
            title={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
          >
            <IconPanelLeft className={cn("w-4 h-4 transition-transform", isCollapsed && "rotate-180")} />
          </button>
        </div>
      </div>

      {/* Navigation */}
      <div className={cn("flex-1 py-4 overflow-y-auto", isCollapsed ? "px-2" : "px-3")}>
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-6">
            {!isCollapsed && (
              <p className="text-ink-subtle text-[11px] font-semibold uppercase tracking-[0.05em] px-3 mb-2">
                {section.title}
              </p>
            )}
            <nav className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  title={isCollapsed ? label : undefined}
                  className={cn(
                    'flex items-center rounded-md text-[13px] transition-all duration-100',
                    isCollapsed ? 'justify-center p-2.5 mx-auto w-10' : 'gap-2.5 px-3 py-1.5',
                    isActive(href)
                      ? 'bg-surface-2 text-ink font-medium'
                      : 'text-ink-subtle hover:bg-surface-2 hover:text-ink'
                  )}
                >
                  <Icon className={cn(
                    'h-4 w-4 flex-shrink-0',
                    isActive(href) ? 'text-ink' : 'text-ink-subtle'
                  )} />
                  {!isCollapsed && label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom section */}
      <div className={cn("pb-4", isCollapsed ? "px-2" : "px-3")}>
        <Link
          href="/settings"
          title={isCollapsed ? "Settings" : undefined}
          className={cn(
            'flex items-center rounded-md text-[13px] transition-all duration-100',
            isCollapsed ? 'justify-center p-2.5 mx-auto w-10' : 'gap-2.5 px-3 py-1.5',
            isActive('/settings')
              ? 'bg-surface-2 text-ink font-medium'
              : 'text-ink-subtle hover:bg-surface-2 hover:text-ink'
          )}
        >
          <IconSettings className={cn('h-4 w-4 flex-shrink-0', isActive('/settings') ? 'text-ink' : 'text-ink-subtle')} />
          {!isCollapsed && "Settings"}
        </Link>
        
        {/* User Profile Footer */}
        <div className={cn(
          "mt-4 flex items-center cursor-pointer hover:bg-surface-2 rounded-md transition-colors",
          isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2"
        )}>
          <div className="w-6 h-6 rounded-full bg-[#1e2025] border border-hairline flex items-center justify-center flex-shrink-0">
            <span className="text-ink-muted text-[10px] font-medium">HL</span>
          </div>
          {!isCollapsed && (
            <div className="min-w-0">
              <p className="text-ink text-[13px] font-medium truncate leading-tight">Admin</p>
            </div>
          )}
        </div>
      </div>
    </aside>
  );

  return (
    <>
      {/* Desktop Sidebar (static) */}
      <div className="hidden md:block h-full">
        {content}
      </div>

      {/* Mobile Sidebar (overlay) */}
      <div className={cn(
        "fixed inset-0 z-50 md:hidden transition-all duration-300",
        isMobileOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
      )}>
        {/* Backdrop */}
        <div 
          className="absolute inset-0 bg-[#010102]/80 backdrop-blur-sm"
          onClick={onCloseMobile}
        />
        {/* Drawer */}
        <div className={cn(
          "absolute inset-y-0 left-0 w-[240px] transform transition-transform duration-300",
          isMobileOpen ? "translate-x-0" : "-translate-x-full"
        )}>
          {content}
        </div>
      </div>
    </>
  );
}