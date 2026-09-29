import { useEffect } from 'react';

/**
 * Writes normalized mouse position (-1..1) to CSS vars on <html>.
 * Zero React re-renders — pure GPU-friendly CSS var updates.
 */
export function useParallax() {
  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let raf = 0;
    const onMove = (e: MouseEvent) => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        const x = (e.clientX / window.innerWidth - 0.5) * 2;
        const y = (e.clientY / window.innerHeight - 0.5) * 2;
        document.documentElement.style.setProperty('--mx', x.toFixed(3));
        document.documentElement.style.setProperty('--my', y.toFixed(3));
        raf = 0;
      });
    };

    window.addEventListener('mousemove', onMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', onMove);
      if (raf) cancelAnimationFrame(raf);
    };
  }, []);
}