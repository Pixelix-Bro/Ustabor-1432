import { useCallback, useEffect, useMemo, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useT } from '@/i18n/LanguageProvider';
import { useIsMobile, useIsTablet, useReducedMotion } from '@/hooks/useMedia';
import { getLenis, useSmoothScroll } from '@/hooks/useSmoothScroll';
import { supportsWebGL } from '@/utils/webgl';
import { Header } from '@/components/Header';
import { Loader } from '@/components/Loader';
import { Stage } from '@/components/Stage';
import { About } from '@/components/About';
import { Contact } from '@/components/Contact';
import { Footer } from '@/components/Footer';

export default function App() {
  const t = useT();
  const isMobile = useIsMobile();
  const isTablet = useIsTablet();
  const reducedMotion = useReducedMotion();
  const webgl = useMemo(
    () => supportsWebGL() && !(import.meta.env.DEV && new URLSearchParams(window.location.search).has('static')),
    [],
  );
  const [ready, setReady] = useState(!webgl);

  useSmoothScroll(webgl);

  const handleReady = useCallback(() => setReady(true), []);

  // Lock scrolling while loading; start at the top on reload.
  useEffect(() => {
    if ('scrollRestoration' in window.history) window.history.scrollRestoration = 'manual';
    window.scrollTo(0, 0);
  }, []);
  useEffect(() => {
    document.body.classList.toggle('is-loading', !ready);
    const lenis = getLenis();
    if (!lenis) return;
    if (ready) lenis.start();
    else lenis.stop();
  }, [ready]);

  // Header theme for the sections below the stage.
  useEffect(() => {
    const root = document.documentElement;
    const emit = (name: 'stage' | 'about' | 'contact') =>
      window.dispatchEvent(new CustomEvent('ustabor:section', { detail: name }));
    const triggers = Array.from(document.querySelectorAll<HTMLElement>('[data-section]')).map((el) =>
      ScrollTrigger.create({
        trigger: el,
        start: 'top 40px',
        end: 'bottom 40px',
        onToggle: (self) => {
          if (self.isActive) {
            root.dataset.theme = el.classList.contains('section--paper') ? 'light' : 'dark';
            emit(el.dataset.section as 'about' | 'contact');
          } else if (self.direction === -1 && el.dataset.section === 'about') {
            root.dataset.theme = 'dark';
            emit('stage');
          }
        },
      }),
    );
    return () => triggers.forEach((tr) => tr.kill());
  }, [webgl]);

  return (
    <>
      {webgl && <Loader done={ready} />}
      <Header />
      <main>
        <Stage isMobile={isMobile} isTablet={isTablet} reducedMotion={reducedMotion} webgl={webgl} onReady={handleReady} />
        <About />
        <Contact />
      </main>
      <Footer />
      {!webgl && <div className="fallback-notice" role="status">{t.loader.noWebGL}</div>}
    </>
  );
}
