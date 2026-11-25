/**
 * Shape of a language pack. Every user-facing string lives here so UI
 * components never contain literal copy. Add a new language by creating
 * `src/locales/<code>.ts` that satisfies `Locale` and registering it in
 * `src/locales/index.ts`.
 */
export interface SceneCopy {
  /** Small eyebrow label above the title, e.g. "Xizmat 01" */
  eyebrow: string;
  /** Profession name – the visually dominant word on the scene */
  title: string;
  /** One or two short sentences */
  description: string;
  /** Key services – 4 items read best */
  services: string[];
  /** Optional closing line under the services list */
  note?: string;
}

export interface Locale {
  code: 'uz' | 'ru';
  label: string;
  htmlLang: string;
  meta: { title: string; description: string };
  nav: { home: string; services: string; about: string; contact: string };
  header: { call: string; menu: string; close: string };
  loader: { loading: string; ready: string; noWebGL: string };
  hero: {
    eyebrow: string;
    title: string;
    subtitle: string;
    description: string;
    cta: string;
    secondary: string;
    scrollHint: string;
  };
  scenes: Record<string, SceneCopy>;
  indicator: { of: string; professions: string };
  cta: {
    eyebrow: string;
    title: string;
    text: string;
    button: string;
    tagline: string;
    hours: string;
  };
  about: {
    eyebrow: string;
    title: string;
    text: string;
    howTitle: string;
    steps: { title: string; text: string }[];
  };
  contact: {
    eyebrow: string;
    title: string;
    phone: string;
    email: string;
    address: string;
    hours: string;
    social: string;
    legal: string;
    notProvided: string;
  };
  footer: { rights: string; madeIn: string; language: string };
  errors: { modelFailed: string; retry: string };
}
