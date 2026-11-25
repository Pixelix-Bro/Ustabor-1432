import { uz } from './uz';
import { ru } from './ru';
import type { Locale } from './types';

export type LanguageCode = Locale['code'];

export const locales: Record<LanguageCode, Locale> = { uz, ru };
export const DEFAULT_LANGUAGE: LanguageCode = 'uz';
export const LANGUAGE_ORDER: LanguageCode[] = ['uz', 'ru'];
export const STORAGE_KEY = 'ustabor.lang';

export type { Locale, SceneCopy } from './types';
