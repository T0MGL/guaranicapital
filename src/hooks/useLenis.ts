import { useEffect } from 'react';
import Lenis from 'lenis';

let lenisInstance: Lenis | null = null;

export const getLenis = () => lenisInstance;

export const scrollToSection = (
  target: string | HTMLElement,
  offset = 0,
) => {
  const element =
    typeof target === 'string' ? document.getElementById(target) : target;
  if (!element) return;

  const lenis = lenisInstance;
  if (lenis) {
    lenis.scrollTo(element, { offset, duration: 1.2 });
    return;
  }

  // Fallback when Lenis is not yet mounted (SSR, early click)
  const absolute =
    element.getBoundingClientRect().top + window.pageYOffset + offset;
  window.scrollTo({ top: absolute, behavior: 'smooth' });
};

export const useLenis = () => {
  useEffect(() => {
    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: 'vertical',
      gestureOrientation: 'vertical',
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
      infinite: false,
    });

    lenisInstance = lenis;

    let rafId = 0;
    function raf(time: number) {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    }
    rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
      lenisInstance = null;
    };
  }, []);
};
