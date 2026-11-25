import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { LAST_INDEX, SCENES, SCROLL_PER_SCENE_VH, TIMING } from '@/data/scenes';
import { progress } from '@/store/progress';

gsap.registerPlugin(ScrollTrigger);

export interface StageTimelineHandle {
  trigger: ScrollTrigger;
  timeline: gsap.core.Timeline;
  /** Document scroll offset at which scene `i` is centred */
  offsetForScene: (i: number) => number;
  kill: () => void;
}

interface BuildOptions {
  stage: HTMLElement;
  layers: HTMLElement[];
  reducedMotion: boolean;
}

const { HOLD, EXIT_END } = TIMING;

/**
 * Builds the master scroll timeline. Timeline time == progress value `p`
 * (0 → LAST_INDEX), so every scene's choreography is authored in "scene
 * units" and stays in sync with the 3D stage, which reads the same `p`.
 */
export function buildStageTimeline({ stage, layers, reducedMotion }: BuildOptions): StageTimelineHandle {
  const root = document.documentElement;
  const tl = gsap.timeline({ paused: true, defaults: { ease: 'none' } });
  const vh = () => window.innerHeight;
  const unit = () => (vh() * SCROLL_PER_SCENE_VH) / 100;

  // Make the timeline exactly LAST_INDEX long.
  tl.to({}, { duration: LAST_INDEX }, 0);

  SCENES.forEach((scene, i) => {
    const layer = layers[i];
    if (!layer) return;
    const items = Array.from(layer.querySelectorAll<HTMLElement>('[data-anim]'));
    const isFirst = i === 0;
    const isLast = i === LAST_INDEX;

    // --- theme colours (CSS variables on <html>) ---
    if (!isFirst) {
      tl.to(
        root,
        {
          '--bg': scene.theme.bg,
          '--ink': scene.theme.ink,
          '--muted': scene.theme.muted,
          '--accent': scene.theme.accent,
          duration: 0.3,
        },
        i - 0.5,
      );
    }

    // --- layer enter ---
    if (!isFirst) {
      tl.set(layer, { autoAlpha: 1 }, i - 0.5);
      tl.fromTo(
        items,
        { y: reducedMotion ? 0 : 56, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.3, stagger: 0.028, ease: 'power3.out' },
        i - 0.46,
      );
    }

    // --- layer exit ---
    if (!isLast) {
      tl.fromTo(
        items,
        { y: 0, opacity: 1 },
        { y: reducedMotion ? 0 : -44, opacity: 0, duration: 0.26, stagger: 0.02, ease: 'power2.in', immediateRender: false },
        i + HOLD,
      );
      tl.set(layer, { autoAlpha: 0 }, i + EXIT_END);
    }
  });

  const trigger = ScrollTrigger.create({
    trigger: stage,
    start: 'top top',
    end: () => `+=${unit() * LAST_INDEX}`,
    pin: true,
    pinSpacing: true,
    anticipatePin: 1,
    scrub: reducedMotion ? true : 0.6,
    animation: tl,
    invalidateOnRefresh: true,
    onUpdate: (self) => progress.set(self.progress * LAST_INDEX),
    onRefresh: (self) => progress.set(self.progress * LAST_INDEX),
  });

  // Snap theme attribute for the header / logo tile.
  const applyMode = (index: number) => {
    const clamped = Math.min(Math.max(index, 0), LAST_INDEX);
    root.dataset.theme = SCENES[clamped].theme.mode;
  };
  applyMode(progress.sceneIndex);
  const unsubscribe = progress.subscribe(applyMode);

  return {
    trigger,
    timeline: tl,
    offsetForScene: (i) => trigger.start + unit() * Math.min(Math.max(i, 0), LAST_INDEX),
    kill: () => {
      unsubscribe();
      trigger.kill();
      tl.kill();
    },
  };
}

/** Reveal animation for the hero on first load (independent of scroll). */
export function playHeroIntro(layer: HTMLElement, reducedMotion: boolean) {
  const items = Array.from(layer.querySelectorAll<HTMLElement>('[data-anim]'));
  if (reducedMotion) {
    gsap.set(items, { y: 0, opacity: 1 });
    return gsap.timeline();
  }
  return gsap.timeline({ delay: 0.15 }).fromTo(
    items,
    { y: 48, opacity: 0 },
    { y: 0, opacity: 1, duration: 1.1, ease: 'power3.out', stagger: 0.09 },
  );
}

/** Puts the hero copy in its hidden pre-intro state. */
export function prepareHeroIntro(layer: HTMLElement) {
  gsap.set(layer.querySelectorAll('[data-anim]'), { opacity: 0 });
}
