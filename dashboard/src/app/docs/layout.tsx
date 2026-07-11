'use client';

import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { useState } from 'react';

export default function DocsLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const links = [
    { label: 'Introduction', href: '/docs' },
    { label: 'Authentication', href: '/docs/authentication' },
    { label: 'Observability', href: '/docs/observability' },
    { label: 'Resilience', href: '/docs/resilience' },
    { label: 'Reliability', href: '/docs/reliability' },
    { label: 'Visibility', href: '/docs/visibility' },
    { label: 'Development', href: '/docs/development' },
  ];

  return (
    <div style={{ backgroundColor: '#000000', minHeight: '100vh', color: '#fff', fontFeatureSettings: '"ss01"' }}>
      {/* Top Navbar */}
      <header className="sticky top-0 z-50 flex items-center justify-between px-6 border-b" style={{ backgroundColor: '#000000', borderColor: '#1a1a1a', height: '56px' }}>
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden flex items-center justify-center" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#111', border: '1px solid #1a1a1a' }}
            aria-label="Toggle mobile menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="3" y1="12" x2="21" y2="12"></line>
              <line x1="3" y1="6" x2="21" y2="6"></line>
              <line x1="3" y1="18" x2="21" y2="18"></line>
            </svg>
          </button>
          <Link href="/" className="flex items-center gap-2.5" aria-label="HookLens home">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
              <path d="M10 3 L10 6.5 M10 13.5 L10 17 M3 10 L6.5 10 M13.5 10 L17 10" stroke="#5e6ad2" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.2px', color: '#fff' }}>HookLens Docs</span>
          </Link>
        </div>
        <Link href="/waitlist" className="hidden sm:block" style={{ fontSize: '13px', fontWeight: 500, color: '#000', backgroundColor: '#fff', borderRadius: '6px', padding: '6px 12px' }}>
          Get Early Access
        </Link>
      </header>

      <div className="flex mx-auto max-w-[1280px] relative">
        {/* Sidebar */}
        <aside 
          className={`${mobileMenuOpen ? 'flex' : 'hidden'} md:flex flex-col w-[240px] shrink-0 border-r min-h-[calc(100vh-56px)] absolute md:sticky top-[56px] md:top-[56px] z-40`} 
          style={{ borderColor: '#1a1a1a', backgroundColor: '#000', height: mobileMenuOpen ? 'calc(100vh - 56px)' : 'auto' }}
        >
          <nav className="flex flex-col gap-1 p-6 w-full">
            <p style={{ fontSize: '11px', fontWeight: 600, color: '#444', letterSpacing: '0.5px', textTransform: 'uppercase', marginBottom: '12px' }}>
              Features
            </p>
            {links.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.href}
                  href={link.href}
                  style={{
                    fontSize: '14px',
                    color: isActive ? '#fff' : '#666',
                    backgroundColor: isActive ? '#111' : 'transparent',
                    padding: '8px 12px',
                    borderRadius: '6px',
                    transition: 'all 0.2s',
                    fontWeight: isActive ? 500 : 400,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#fff';
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) e.currentTarget.style.color = '#666';
                  }}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  {link.label}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {mobileMenuOpen && (
          <div 
            className="md:hidden fixed inset-0 z-30" 
            style={{ backgroundColor: 'rgba(0,0,0,0.5)', top: '56px' }}
            onClick={() => setMobileMenuOpen(false)}
          />
        )}

        {/* Main Content */}
        <main className="flex-1 p-6 md:p-12 pb-24 overflow-y-auto">
          <div className="max-w-[700px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
