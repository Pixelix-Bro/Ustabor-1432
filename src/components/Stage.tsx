import { useCallback, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { SCENES, STORY_SCENES } from '@/data/scenes';
import { useLanguage } from '@/i18n/LanguageProvider';
import { navigation, progress } from '@/store/progress';
import { Experience } from '@/three/Experience';
import { buildStageTimeline, playHeroIntro, prepareHeroIntro, type StageTimelineHandle } from '@/animation/stageTimeline';
import { scrollToY } from '@/hooks/useSmoothScroll';
import { HeroLayer } from './layers/HeroLayer';
import { SceneLayer } from './layers/SceneLayer';
import { CtaLayer } from './layers/CtaLayer';
import { ProgressIndicator } from './ProgressIndicator';

interface StageProps {
  isMobile: boolean;
  isTablet: boolean;
  reducedMotion: boolean;
  webgl: boolean;
  onReady: () => void;
}

/**
 * The pinned storytelling stage: the 3D canvas plus one DOM layer per scene.
 * Scroll progress drives both through a single GSAP timeline.
 */
export function Stage({ isMobile, isTablet, reducedMotion, webgl, onReady }: StageProps) {
  const { lang } = useLanguage();
  const stageRef = useRef<HTMLElement>(null);
  const layerRefs = useRef<(HTMLDivElement | null)[]>([]);
  const handle = useRef<StageTimelineHandle | null>(null);
  const [heroReady, setHeroReady] = useState(!webgl);
  const introPlayed = useRef(false);

  const setLayerRef = (i: number) => (el: HTMLDivElement | null) => {
    layerRefs.current[i] = el;
  };

  // Hide hero copy until the intro runs (WebGL mode only)
  useLayoutEffect(() => {
    const hero = layerRefs.current[0];
    if (hero && webgl && !introPlayed.current) prepareHeroIntro(hero);
  }, [webgl]);

  // Build the scroll timeline once. The DOM structure of every layer is
  // identical in all languages, so a language switch never needs a rebuild
  // (rebuilding would drop the pin spacer and throw the scroll position).
  useLayoutEffect(() => {
    if (!webgl) return;
    const stage = stageRef.current;
    if (!stage) return;
    const layers = layerRefs.current.filter(Boolean) as HTMLElement[];
    handle.current?.kill();
    const h = buildStageTimeline({ stage, layers, reducedMotion });
    handle.current = h;
    // jump the scrubbed timeline straight to the current position
    h.timeline.progress(h.trigger.progress);
    navigation.scrollToScene = (i) => scrollToY(h.offsetForScene(i));
    navigation.scrollToElement = (id) => {
      const el = document.getElementById(id);
      if (!el) return;
      scrollToY(el.getBoundingClientRect().top + window.scrollY);
    };
    ScrollTrigger.refresh();
    return () => {
      h.kill();
      handle.current = null;
    };
  }, [webgl, reducedMotion]);

  // Translated copy can change section heights below the stage: re-measure
  // triggers without touching the pin or the scroll position.
  useEffect(() => {
    if (!webgl) return;
    const id = window.requestAnimationFrame(() => ScrollTrigger.refresh());
    return () => window.cancelAnimationFrame(id);
  }, [lang, webgl]);

  // Static (no WebGL) navigation
  useEffect(() => {
    if (webgl) return;
    navigation.scrollToScene = (i) => {
      const el = layerRefs.current[i];
      if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
    };
    navigation.scrollToElement = (id) => {
      const el = document.getElementById(id);
      if (el) scrollToY(el.getBoundingClientRect().top + window.scrollY);
    };
  }, [webgl]);

  const handleHeroReady = useCallback(() => {
    setHeroReady(true);
    progress.ready = true;
    onReady();
    const hero = layerRefs.current[0];
    if (hero && !introPlayed.current) {
      introPlayed.current = true;
      // let the loader fade before the copy rises; if the visitor has already
      // scrolled away, hand control straight to the scroll timeline instead.
      window.setTimeout(() => {
        if (progress.p > 0.08) {
          handle.current?.timeline.invalidate();
          return;
        }
        playHeroIntro(hero, reducedMotion);
      }, 350);
    }
  }, [onReady, reducedMotion]);

  let storyNumber = 0;

  return (
    <section ref={stageRef} className={`stage${webgl ? '' : ' stage--static'}`} id="top">
      {webgl && (
        <>
          <div className="stage__glow" aria-hidden="true" />
          <div className={`stage__canvas-wrap${heroReady ? ' is-visible' : ''}`}>
            <Experience isMobile={isMobile} isTablet={isTablet} reducedMotion={reducedMotion} onHeroReady={handleHeroReady} />
          </div>
        </>
      )}

      <div className="stage__layers">
        {SCENES.map((scene, i) => {
          if (scene.kind === 'hero') return <HeroLayer key={scene.id} ref={setLayerRef(i)} staticMode={!webgl} />;
          if (scene.kind === 'cta') return <CtaLayer key={scene.id} ref={setLayerRef(i)} index={i} staticMode={!webgl} />;
          storyNumber += 1;
          return <SceneLayer key={scene.id} ref={setLayerRef(i)} scene={scene} index={i} number={storyNumber} staticMode={!webgl} />;
        })}
      </div>

      {webgl && <ProgressIndicator />}
      {!webgl && <span className="visually-hidden">{STORY_SCENES.length}</span>}
    </section>
  );
}
