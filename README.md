# UstaBor 1432 — interactive 3D website

Uzbek-first, scroll-driven storytelling site for UstaBor: a 3D craftsman stands
in the centre of the screen, the visitor scrolls, and the craftsman and the
service content transform from one profession to the next, ending on the
**1432** call-to-action.

Stack: React 18 · TypeScript · Vite · Three.js · React Three Fiber · Drei ·
GSAP ScrollTrigger · Lenis.

## Commands

```powershell
npm install
```

```powershell
npm run dev
```

```powershell
npm run build
```

```powershell
npm run preview
```

```powershell
npm run models:optimize
```

`npm run dev` starts Vite on http://localhost:5173. `npm run build` type-checks
and writes the production site to `dist/`.

## Project structure

```
public/
  brand/            logo-mark.png, logo-full.png, favicons (derived from source-assets/brand/logo.jpg)
  models/           optimised, web-ready GLBs (3–9 MB each) – the site loads these
source-assets/
  brand/logo.jpg    the original UstaBor logo
  models/*.glb      the original Sketchfab models (25–79 MB each) – never loaded by the site
scripts/
  optimize-models.mjs   turns source-assets/models into public/models
  lib/webp-textures.mjs texture pass used by the optimiser (runs in its own process)
  prepare-brand.mjs     derives the brand PNGs / favicons from the logo
src/
  locales/          uz.ts (default), ru.ts – every user-facing string
  i18n/             LanguageProvider (localStorage persistence, <html lang>, <title>)
  data/scenes.ts    scene configuration: model path, placement, theme, timing
  data/company.ts   official company information (placeholders until provided)
  three/            Experience (canvas), Craftsman (one model), Lighting, CameraRig
  animation/        stageTimeline.ts – GSAP ScrollTrigger choreography
  components/       Header, Stage, layers (Hero / Scene / Cta), About, Contact, Footer…
  store/progress.ts scroll progress shared between GSAP and the 3D loop (no React re-renders)
  styles/global.css design tokens, typography, layout, responsive rules
  lab/ModelLab.tsx  dev-only model inspector: /?lab&model=/models/<file>.glb
```

## How the experience works

* `Stage` is pinned for `SCENES.length - 1` viewport heights. One GSAP timeline
  (`animation/stageTimeline.ts`) is scrubbed by scroll; its time equals the
  progress value `p` whose integer part is the scene index (0 = hero … 5 =
  Payvandchi, 6 = 1432 CTA).
* Every `Craftsman` reads the same `p` each frame and plays its enter / hold /
  exit choreography inside its own window (`TIMING` in `data/scenes.ts`).
  Characters arrive from the right and leave to the left, so they never cross.
* Theme colours (`--bg`, `--ink`, `--muted`, `--accent`) are CSS variables on
  `<html>` tweened by the same timeline; the lights in the 3D stage interpolate
  the same theme values.
* Models load progressively: the hero first (gates the preloader), then each
  next profession as soon as the previous one has rendered.
* If WebGL is unavailable the stage renders as plain stacked sections with the
  logo (preview it in dev with `/?static`). `prefers-reduced-motion` disables
  smooth scrolling, idle motion and reveal offsets.

## Editing content

### Text and languages
All copy lives in `src/locales/uz.ts` and `src/locales/ru.ts`. Add a language
by creating `src/locales/<code>.ts` that satisfies `Locale`, then registering
it in `src/locales/index.ts` (`locales` and `LANGUAGE_ORDER`). Uzbek is the
default; the stored choice is kept in `localStorage` under `ustabor.lang`.

### Company information
`src/data/company.ts` holds phone numbers, e-mail, address, working hours,
social links and legal details. Everything is `null` / empty until the official
data is supplied; the contact section shows a neutral "information coming soon"
placeholder for those fields and never invents facts.

### Scenes and models
`src/data/scenes.ts` is the single source of truth for each scene: the model
path, `placement` (character height, position, rotation, with `tablet` and
`mobile` overrides), the `theme`, the text `layout` variant and the `copyKey`
into the locale files. Replace a profession by changing its `model` path and
copy; add one by appending a scene object and a matching locale entry.

Models used by the site (all from `source-assets/models`):

| Scene | Source model | Web file |
| --- | --- | --- |
| Hero | pointing_construction_worker.glb | pointing-worker.glb |
| Duradgor | construction_worker_in_training.glb | trainee-worker.glb |
| Santexnik | blue_collar_worker_in_overalls.glb | overalls-worker.glb |
| Elektrik | oilfield_worker_portrait.glb | oilfield-worker.glb |
| Ta’mirlash ustasi | industrial_safety_worker_walking.glb | safety-worker.glb |
| Payvandchi | 009_male_worker_welder_06.glb | welder.glb |

Known limitation: the welder scan is built from many disconnected shells, so
mesh simplification cannot reduce it much (≈900k triangles, 8.8 MB). It is
only rendered while its scene is active; swap in a lighter model via
`data/scenes.ts` if low-end mobile performance matters more than that scene.

Two source models are optimised but not used: `pete.glb` (its only embedded
clip is a dance animation) and `worker_male_stylized_clothed.glb` (a T-pose
with no usable animation). Run `npm run models:optimize` to regenerate every
web file, or `node scripts/optimize-models.mjs <name>` for one of them.

### Optional brand badge on the characters
The characters currently wear no logo. A UstaBor 1432 badge
(`public/brand/logo-badge.png`) can be projected onto any character's clothing
by adding a `decal` entry to its scene in `data/scenes.ts`, e.g.
`decal: { x: 0.07, y: 0.72, size: 0.05 }` (`x`/`y` in character space where
1 = full height; optional `facing`, `roll`, `meshMatch`). The projection is
done at runtime by `src/three/useBrandDecal.ts`; check placement in the model
lab.

To drop in a new model: put the GLB in `source-assets/models`, add a row to
`MODELS` in `scripts/optimize-models.mjs`, run the optimiser, inspect it in
`/?lab&model=/models/<file>.glb`, then point a scene at it. Models are
normalised automatically (feet at y = 0, 1 unit tall), so only `scale`,
`position` and `rotationY` need tuning.
# Ustabor-1432
