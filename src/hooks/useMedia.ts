import { useEffect, useState } from 'react';

function subscribeMedia(query: string, cb: (matches: boolean) => void) {
  const mq = window.matchMedia(query);
  const handler = (e: MediaQueryListEvent) => cb(e.matches);
  mq.addEventListener('change', handler);
  return () => mq.removeEventListener('change', handler);
}

export function useMediaQuery(query: string): boolean {
  const [matches, setMatches] = useState(() =>
    typeof window === 'undefined' ? false : window.matchMedia(query).matches,
  );
  useEffect(() => subscribeMedia(query, setMatches), [query]);
  return matches;
}

export const MOBILE_QUERY = '(max-width: 767px)';
export const TABLET_QUERY = '(max-width: 1023px)';
export const REDUCED_MOTION_QUERY = '(prefers-reduced-motion: reduce)';

export const useIsMobile = () => useMediaQuery(MOBILE_QUERY);
export const useIsTablet = () => useMediaQuery(TABLET_QUERY);
export const useReducedMotion = () => useMediaQuery(REDUCED_MOTION_QUERY);

/** Synchronous helpers for non-React code (GSAP setup etc.) */
export const isMobileNow = () => window.matchMedia(MOBILE_QUERY).matches;
export const prefersReducedMotionNow = () => window.matchMedia(REDUCED_MOTION_QUERY).matches;
