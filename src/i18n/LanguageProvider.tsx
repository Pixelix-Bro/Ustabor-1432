import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';
import { DEFAULT_LANGUAGE, STORAGE_KEY, locales, type LanguageCode, type Locale } from '@/locales';

interface LanguageContextValue {
  lang: LanguageCode;
  t: Locale;
  setLang: (code: LanguageCode) => void;
}

const LanguageContext = createContext<LanguageContextValue | null>(null);

/**
 * Reads the persisted language. First visit → Uzbek. The browser language is
 * deliberately ignored: the product is Uzbek-first and Russian is opt-in.
 */
function readStoredLanguage(): LanguageCode {
  try {
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored && stored in locales) return stored as LanguageCode;
  } catch {
    /* storage unavailable (private mode etc.) */
  }
  return DEFAULT_LANGUAGE;
}

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<LanguageCode>(() =>
    typeof window === 'undefined' ? DEFAULT_LANGUAGE : readStoredLanguage(),
  );

  const setLang = useCallback((code: LanguageCode) => {
    setLangState(code);
    try {
      window.localStorage.setItem(STORAGE_KEY, code);
    } catch {
      /* ignore */
    }
  }, []);

  const t = locales[lang];

  // Keep <html lang> and document metadata in sync without reloading.
  useEffect(() => {
    document.documentElement.lang = t.htmlLang;
    document.title = t.meta.title;
    const meta = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (meta) meta.content = t.meta.description;
  }, [t]);

  const value = useMemo(() => ({ lang, t, setLang }), [lang, t, setLang]);
  return <LanguageContext.Provider value={value}>{children}</LanguageContext.Provider>;
}

export function useLanguage(): LanguageContextValue {
  const ctx = useContext(LanguageContext);
  if (!ctx) throw new Error('useLanguage must be used inside <LanguageProvider>');
  return ctx;
}

/** Convenience hook: returns the active language pack. */
export function useT(): Locale {
  return useLanguage().t;
}
