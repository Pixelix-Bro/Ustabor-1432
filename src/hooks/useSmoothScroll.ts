import { useEffect } from 'react';
import Lenis from 'lenis';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { prefersReducedMotionNow } from './useMedia';

gsap.registerPlugin(ScrollTrigger);

let lenisInstance: Lenis | null = null;
export const getLenis = () => lenisInstance;

/**
 * Lenis smooth scrolling wired into GSAP's ticker so ScrollTrigger and the
 * 3D stage share one clock. Disabled for reduced-motion users.
 */
export function useSmoothScroll(enabled: boolean) {
  useEffect(() => {
    if (!enabled || prefersReducedMotionNow()) return;
    const lenis = new Lenis({
      lerp: 0.09,
      wheelMultiplier: 0.95,
      touchMultiplier: 1.3,
      smoothWheel: true,
    });
    lenisInstance = lenis;
    if (document.body.classList.contains('is-loading')) lenis.stop();
    lenis.on('scroll', ScrollTrigger.update);
    const tick = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    return () => {
      gsap.ticker.remove(tick);
      lenis.destroy();
      lenisInstance = null;
    };
  }, [enabled]);
}

/** Scrolls to an absolute document offset (Lenis if available, native otherwise). */
export function scrollToY(y: number, immediate = false) {
  if (lenisInstance) {
    lenisInstance.scrollTo(y, { immediate, duration: 1.4, easing: (t) => 1 - Math.pow(1 - t, 3) });
  } else {
    window.scrollTo({ top: y, behavior: immediate || prefersReducedMotionNow() ? 'auto' : 'smooth' });
  }
}
