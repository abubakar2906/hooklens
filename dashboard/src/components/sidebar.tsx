'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, Radio, Network, Settings } from 'lucide-react';
import { cn } from '@/lib/utils';

const SECTIONS = [
  {
    title: 'Monitor',
    items: [
      { href: '/dashboard', label: 'Overview', icon: LayoutDashboard },
      { href: '/events', label: 'Events', icon: Radio },
    ],
  },
  {
    title: 'Manage',
    items: [
      { href: '/connections', label: 'Connections', icon: Network },
    ],
  },
];

function HookLensLogo() {
  return (
    <svg viewBox="0 0 20 20" className="w-4 h-4 fill-white" xmlns="http://www.w3.org/2000/svg">
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M10 2a8 8 0 100 16A8 8 0 0010 2zm0 3a1 1 0 011 1v2.586l1.707 1.707a1 1 0 01-1.414 1.414L9.586 9.999a1 1 0 01-.293-.707V6a1 1 0 011-1z"
      />
    </svg>
  );
}

export function Sidebar() {
  const pathname = usePathname();

  const isActive = (href: string) => pathname === href || pathname.startsWith(href + '/');

  return (
    <aside className="w-[220px] flex-shrink-0 flex flex-col border-r border-[#181818] bg-[#0d0d0d]">

      {/* Logo */}
      <div className="flex items-center gap-2.5 px-4 h-[56px] border-b border-[#181818] flex-shrink-0">
        <div className="w-7 h-7 rounded-lg bg-gradient-to-br from-blue-500 to-blue-700 flex items-center justify-center flex-shrink-0 shadow-[0_0_12px_rgba(59,130,246,0.3)]">
          <HookLensLogo />
        </div>
        <div>
          <span className="text-white font-semibold text-[13px] tracking-tight">HookLens</span>
          <div className="flex items-center gap-1 mt-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
            <span className="text-[10px] text-[#444444]">self-hosted</span>
          </div>
        </div>
      </div>

      {/* Navigation */}
      <div className="flex-1 px-2 py-3 overflow-y-auto">
        {SECTIONS.map((section) => (
          <div key={section.title} className="mb-4">
            <p className="text-[#333333] text-[10px] font-semibold uppercase tracking-[0.1em] px-2 mb-1.5">
              {section.title}
            </p>
            <nav className="space-y-0.5">
              {section.items.map(({ href, label, icon: Icon }) => (
                <Link
                  key={href}
                  href={href}
                  className={cn(
                    'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all duration-150',
                    isActive(href)
                      ? 'bg-[#1a1a1a] text-white border border-[#252525]'
                      : 'text-[#555555] hover:bg-[#141414] hover:text-[#aaaaaa]'
                  )}
                >
                  <Icon className={cn(
                    'h-3.5 w-3.5 flex-shrink-0',
                    isActive(href) ? 'text-blue-400' : ''
                  )} />
                  {label}
                </Link>
              ))}
            </nav>
          </div>
        ))}
      </div>

      {/* Bottom */}
      <div className="px-2 pb-3 border-t border-[#181818] pt-2 space-y-0.5">
        <Link
          href="/settings"
          className={cn(
            'flex items-center gap-2.5 px-2.5 py-2 rounded-md text-[13px] transition-all',
            isActive('/settings')
              ? 'bg-[#1a1a1a] text-white border border-[#252525]'
              : 'text-[#444444] hover:bg-[#141414] hover:text-white'
          )}
        >
          <Settings className={cn('h-3.5 w-3.5 flex-shrink-0', isActive('/settings') ? 'text-blue-400' : '')} />
          Settings
        </Link>

        {/* User */}
        <div className="flex items-center gap-2.5 px-2.5 py-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-gradient-to-br from-blue-600 to-violet-600 flex items-center justify-center flex-shrink-0">
            <span className="text-white text-[10px] font-bold">HL</span>
          </div>
          <div className="min-w-0">
            <p className="text-[#888888] text-xs font-medium truncate">HookLens</p>
            <p className="text-[#444444] text-[10px] truncate">Open Source</p>
          </div>
        </div>
      </div>
    </aside>
  );
}