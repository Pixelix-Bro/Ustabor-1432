import type { DecalSpec } from '@/three/useBrandDecal';

/**
 * Storytelling scene configuration.
 *
 * Every scene is fully data-driven: swap a model, retune its placement or
 * change its theme here without touching the 3D or UI code. Copy (titles,
 * services…) lives in `src/locales/*` under `scenes[<copyKey>]`.
 *
 * Coordinate system for model placement: the loaded model is normalised so
 * that its feet sit at y = 0, it is centred on x/z and its height is exactly
 * 1 unit. `scale` therefore reads as "character height in scene units".
 */

export interface SceneTheme {
  /** Page / stage background */
  bg: string;
  /** Primary text colour */
  ink: string;
  /** Secondary text colour */
  muted: string;
  /** Accent colour (numbers, rules, highlights) */
  accent: string;
  /** Soft floor glow under the character (3D) */
  glow: string;
  /** 'light' | 'dark' – lets the header / logo adapt */
  mode: 'light' | 'dark';
  /** Hemisphere / key light tint for the 3D stage */
  keyLight: string;
  fillLight: string;
}

export interface ModelPlacement {
  /** Character height in scene units */
  scale: number;
  /** Offset applied after normalisation, in scene units */
  position: [number, number, number];
  /** Y rotation (radians) so the character faces the camera nicely */
  rotationY: number;
  /** Tablet overrides (768–1023px) */
  tablet?: Partial<Pick<ModelPlacement, 'scale' | 'position' | 'rotationY'>>;
  /** Mobile overrides (<768px) */
  mobile?: Partial<Pick<ModelPlacement, 'scale' | 'position' | 'rotationY'>>;
}

export interface SceneConfig {
  id: string;
  /** Key into `locale.scenes` (for story scenes) */
  copyKey?: string;
  kind: 'hero' | 'story' | 'cta';
  /** Public path of the optimised GLB (undefined → empty stage) */
  model?: string;
  placement?: ModelPlacement;
  /** Direction the character leaves towards (-1 left, +1 right). Default -1 */
  exitDirection?: -1 | 1;
  /** Side the character arrives from (-1 left, +1 right). Default +1 */
  enterDirection?: -1 | 1;
  /** Which embedded animation clip to play (index) – optional */
  animationIndex?: number;
  /** Per-scene text layout variant */
  layout?: 'title-left' | 'title-right';
  /** UstaBor badge projected onto the clothing (normalised character space) */
  decal?: DecalSpec;
  theme: SceneTheme;
}

export const THEMES = {
  paper: {
    bg: '#F5F1EA',
    ink: '#101B3F',
    muted: '#5B627A',
    accent: '#F2A900',
    glow: '#FFE6A8',
    mode: 'light',
    keyLight: '#FFF6E5',
    fillLight: '#DCE6FF',
  },
  sand: {
    bg: '#F1EBE0',
    ink: '#101B3F',
    muted: '#5E6174',
    accent: '#E89E00',
    glow: '#FFD98A',
    mode: 'light',
    keyLight: '#FFF1D6',
    fillLight: '#D8E4FF',
  },
  mist: {
    bg: '#E9EDF3',
    ink: '#0F1A3E',
    muted: '#596280',
    accent: '#F2A900',
    glow: '#CFE0FF',
    mode: 'light',
    keyLight: '#F4F7FF',
    fillLight: '#FFE9C2',
  },
  amber: {
    bg: '#F6E7C6',
    ink: '#14204A',
    muted: '#6A5D3F',
    accent: '#C97E00',
    glow: '#FFD063',
    mode: 'light',
    keyLight: '#FFF2D4',
    fillLight: '#FFE1A1',
  },
  slate: {
    bg: '#243667',
    ink: '#FFFFFF',
    muted: '#B9C3E3',
    accent: '#FFC233',
    glow: '#3C5AA6',
    mode: 'dark',
    keyLight: '#FFF4E0',
    fillLight: '#6E8AD8',
  },
  navy: {
    bg: '#131F47',
    ink: '#FFFFFF',
    muted: '#AEB8DA',
    accent: '#FFC233',
    glow: '#2B3F85',
    mode: 'dark',
    keyLight: '#FFEFCF',
    fillLight: '#5D78CC',
  },
  midnight: {
    bg: '#0B1430',
    ink: '#FFFFFF',
    muted: '#9AA6CC',
    accent: '#FFC233',
    glow: '#1F2E6B',
    mode: 'dark',
    keyLight: '#FFE9B8',
    fillLight: '#4D66B8',
  },
} as const satisfies Record<string, SceneTheme>;

export const SCENES: SceneConfig[] = [
  {
    id: 'hero',
    kind: 'hero',
    model: '/models/pointing-worker.glb',
    placement: {
      scale: 1.88,
      position: [0.3, 0, 0],
      rotationY: -0.15,
      tablet: { scale: 1.65, position: [0.05, 0, 0] },
      mobile: { scale: 1.15, position: [0.08, -0.1, 0] },
    },
    theme: THEMES.paper,
  },
  {
    id: 'carpenter',
    copyKey: 'carpenter',
    kind: 'story',
    model: '/models/trainee-worker.glb',
    placement: {
      scale: 1.85,
      position: [0, 0, 0],
      rotationY: 0.2,
      tablet: { scale: 1.7, position: [0, 0, 0] },
      mobile: { scale: 1.4, position: [0, -0.12, 0] },
    },
    layout: 'title-left',
    theme: THEMES.sand,
  },
  {
    id: 'plumber',
    copyKey: 'plumber',
    kind: 'story',
    model: '/models/overalls-worker.glb',
    placement: {
      scale: 1.85,
      position: [0, 0, 0],
      rotationY: -0.15,
      tablet: { scale: 1.7, position: [0, 0, 0] },
      mobile: { scale: 1.4, position: [0, -0.12, 0] },
    },
    layout: 'title-right',
    theme: THEMES.mist,
  },
  {
    id: 'electrician',
    copyKey: 'electrician',
    kind: 'story',
    model: '/models/oilfield-worker.glb',
    placement: {
      scale: 1.85,
      position: [0, 0, 0],
      rotationY: 0.25,
      tablet: { scale: 1.7, position: [0, 0, 0] },
      mobile: { scale: 1.4, position: [0, -0.12, 0] },
    },
    layout: 'title-left',
    theme: THEMES.amber,
  },
  {
    id: 'renovator',
    copyKey: 'renovator',
    kind: 'story',
    model: '/models/safety-worker.glb',
    placement: {
      scale: 1.85,
      position: [0, 0, 0],
      rotationY: -0.2,
      tablet: { scale: 1.7, position: [0, 0, 0] },
      mobile: { scale: 1.4, position: [0, -0.12, 0] },
    },
    layout: 'title-right',
    theme: THEMES.slate,
  },
  {
    id: 'welder',
    copyKey: 'welder',
    kind: 'story',
    model: '/models/welder.glb',
    placement: {
      // the welder comes with his cart, so the whole group is kept smaller
      scale: 1.6,
      position: [0.1, 0, -0.2],
      // the source scene faces away from the camera
      rotationY: Math.PI + 0.35,
      tablet: { scale: 1.45, position: [0.05, 0, -0.2] },
      mobile: { scale: 1.2, position: [0.05, -0.12, -0.2] },
    },
    layout: 'title-left',
    theme: THEMES.navy,
  },
  {
    id: 'cta',
    kind: 'cta',
    theme: THEMES.midnight,
  },
];

export const STORY_SCENES = SCENES.filter((s) => s.kind === 'story');
export const SCENE_COUNT = SCENES.length;
export const LAST_INDEX = SCENES.length - 1;

/**
 * Timing windows (in "scene units" of the global progress value p, where the
 * integer part is the scene index). A character is:
 *   entering  for t ∈ [-ENTER_START, -HOLD]
 *   holding   for t ∈ [-HOLD, HOLD]
 *   exiting   for t ∈ [HOLD, EXIT_END]
 * with t = p - sceneIndex.
 */
export const TIMING = {
  HOLD: 0.22,
  EXIT_END: 0.56,
  ENTER_START: 0.56,
} as const;

/** Scroll distance per scene, in viewport heights. */
export const SCROLL_PER_SCENE_VH = 100;

/** Camera defaults – tuned for a 1.85-unit tall character. */
export const CAMERA = {
  position: [0, 1.05, 4.6] as [number, number, number],
  target: [0, 0.92, 0] as [number, number, number],
  fov: 30,
  mobile: {
    position: [0, 0.9, 4.4] as [number, number, number],
    target: [0, 0.74, 0] as [number, number, number],
    fov: 30,
  },
};
