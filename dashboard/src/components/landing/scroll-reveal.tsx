'use client';

import { useEffect, useRef, type ReactNode } from 'react';

interface ScrollRevealProps {
  children: ReactNode;
  delay?: number; // ms stagger delay
  className?: string;
}

// ─── ScrollReveal ──────────────────────────────────────────────────────────────
// Progressive enhancement: elements are visible by default (no SSR flash).
// After JS loads, sets initial hidden state, then reveals on viewport entry.
// Uses IntersectionObserver with a small bottom margin so elements animate
// before they're fully in view, creating a fluid page-scroll feel.

export default function ScrollReveal({ children, delay = 0, className = '' }: ScrollRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el || !('IntersectionObserver' in window)) return;

    // Set initial hidden state after JS mounts (progressive enhancement)
    el.style.opacity = '0';
    el.style.transform = 'translateY(18px)';
    el.style.transition = `opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)`;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setTimeout(() => {
            el.style.opacity = '1';
            el.style.transform = 'translateY(0)';
          }, delay);
          observer.unobserve(el);
        }
      },
      {
        threshold: 0.06,
        rootMargin: '0px 0px -32px 0px', // trigger slightly before edge of viewport
      }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, [delay]);

  return (
    <div ref={ref} className={className}>
      {children}
    </div>
  );
}
