/**
 * Mutable, render-free store for the scroll-driven storytelling progress.
 *
 * `p` is a continuous value whose integer part is the active scene index
 * (0 = hero … 5 = last profession, 6 = CTA). ScrollTrigger writes to it, the
 * 3D loop reads it every frame, and UI chrome (progress indicator, header)
 * subscribes to the coarse `sceneIndex` only – so React never re-renders on
 * scroll.
 */

type Listener = (index: number, p: number) => void;

class ProgressStore {
  /** raw progress written by ScrollTrigger */
  p = 0;
  /** smoothed progress consumed by the 3D scene */
  smooth = 0;
  /** pointer parallax, normalised -1..1 */
  pointer = { x: 0, y: 0 };
  /** scene index derived from p (rounded) */
  sceneIndex = 0;
  /** true once the hero model is rendered and the intro has run */
  ready = false;

  private listeners = new Set<Listener>();

  set(p: number) {
    this.p = p;
    const idx = Math.round(p);
    if (idx !== this.sceneIndex) {
      this.sceneIndex = idx;
      this.listeners.forEach((l) => l(idx, p));
    }
  }

  subscribe(l: Listener) {
    this.listeners.add(l);
    return () => this.listeners.delete(l);
  }
}

export const progress = new ProgressStore();

/** Scroll helper registered by the Stage once its ScrollTrigger exists. */
export const navigation: {
  scrollToScene: (index: number) => void;
  scrollToElement: (id: string) => void;
} = {
  scrollToScene: () => {},
  scrollToElement: () => {},
};
