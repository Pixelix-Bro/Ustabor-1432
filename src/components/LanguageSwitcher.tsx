import { Fragment } from 'react';
import { useLanguage } from '@/i18n/LanguageProvider';
import { LANGUAGE_ORDER, locales } from '@/locales';

/** O’Z | RU – instant switch, no reload, scroll position preserved. */
export function LanguageSwitcher({ className = '' }: { className?: string }) {
  const { lang, setLang, t } = useLanguage();
  return (
    <div className={`lang ${className}`} role="group" aria-label={t.footer.language}>
      {LANGUAGE_ORDER.map((code, i) => (
        <Fragment key={code}>
          {i > 0 && <span className="lang__sep" aria-hidden="true">|</span>}
          <button
            type="button"
            className="lang__btn"
            aria-pressed={lang === code}
            lang={locales[code].htmlLang}
            onClick={() => setLang(code)}
          >
            {locales[code].label}
          </button>
        </Fragment>
      ))}
    </div>
  );
}
