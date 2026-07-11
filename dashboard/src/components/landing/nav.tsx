"use client";

import { useState } from 'react';
import Link from 'next/link';

export default function Nav() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50" style={{ backgroundColor: '#000000', borderBottom: '1px solid #1a1a1a', height: '56px' }}>
      <div className="mx-auto max-w-[1280px] px-6 h-full flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button 
            className="md:hidden flex items-center justify-center" 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            style={{ width: '32px', height: '32px', borderRadius: '6px', backgroundColor: '#111', border: '1px solid #1a1a1a' }}
            aria-label="Toggle mobile menu"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              {mobileMenuOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18"></line>
                  <line x1="6" y1="6" x2="18" y2="18"></line>
                </>
              ) : (
                <>
                  <line x1="3" y1="12" x2="21" y2="12"></line>
                  <line x1="3" y1="6" x2="21" y2="6"></line>
                  <line x1="3" y1="18" x2="21" y2="18"></line>
                </>
              )}
            </svg>
          </button>
          <a href="/" className="flex items-center gap-2.5" aria-label="HookLens home">
            <svg width="18" height="18" viewBox="0 0 20 20" fill="none">
              <circle cx="10" cy="10" r="8" stroke="#5e6ad2" strokeWidth="1.5" />
              <circle cx="10" cy="10" r="3.5" fill="#5e6ad2" />
              <path d="M10 3 L10 6.5 M10 13.5 L10 17 M3 10 L6.5 10 M13.5 10 L17 10" stroke="#5e6ad2" strokeWidth="1.2" strokeLinecap="round" />
            </svg>
            <span style={{ fontSize: '15px', fontWeight: 600, letterSpacing: '-0.2px', color: '#fff' }}>HookLens</span>
          </a>
        </div>
        
        <nav className="hidden md:flex items-center gap-6" aria-label="Primary navigation">
          {[{ label: 'Product', href: '#features' }, { label: 'Docs', href: '/docs' }, { label: 'GitHub', href: 'https://github.com' }].map(({ label, href }) => (
            <a key={label} href={href} className="nav-link">{label}</a>
          ))}
        </nav>
        
        <a href="/waitlist" className="hidden sm:flex" style={{ fontSize: '14px', fontWeight: 500, color: '#000', backgroundColor: '#fff', borderRadius: '8px', padding: '8px 16px' }}>
          Join waitlist
        </a>
      </div>

      {/* Mobile Menu Dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden absolute w-full border-b" style={{ backgroundColor: '#000', borderColor: '#1a1a1a', top: '56px' }}>
          <nav className="flex flex-col px-6 py-4 gap-4">
            {[{ label: 'Product', href: '#features' }, { label: 'Docs', href: '/docs' }, { label: 'GitHub', href: 'https://github.com' }].map(({ label, href }) => (
              <a 
                key={label} 
                href={href} 
                className="nav-link" 
                style={{ fontSize: '15px' }}
                onClick={() => setMobileMenuOpen(false)}
              >
                {label}
              </a>
            ))}
            <div style={{ height: '1px', backgroundColor: '#1a1a1a', margin: '4px 0' }} />
            <a 
              href="/waitlist" 
              style={{ fontSize: '15px', fontWeight: 500, color: '#000', backgroundColor: '#fff', borderRadius: '8px', padding: '10px 16px', textAlign: 'center' }}
            >
              Join waitlist
            </a>
          </nav>
        </div>
      )}
    </header>
  );
}
