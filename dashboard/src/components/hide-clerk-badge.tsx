'use client';

import { useEffect } from 'react';

export default function HideClerkBadge() {
  useEffect(() => {
    // Aggressively scan and destroy the Clerk dev mode badge
    const interval = setInterval(() => {
      const elements = document.querySelectorAll('div');
      elements.forEach((el) => {
        if (
          el.innerText === 'Development mode' || 
          el.innerText === 'Secured by Clerk' ||
          el.textContent === 'Development mode' ||
          el.textContent === 'Secured by Clerk'
        ) {
          // Hide the element
          el.style.display = 'none';
          el.style.opacity = '0';
          el.style.visibility = 'hidden';
          
          // Also try to hide its direct parent if it's a wrapper container
          if (el.parentElement) {
            el.parentElement.style.display = 'none';
          }
        }
      });
    }, 50);

    return () => clearInterval(interval);
  }, []);

  return null;
}
