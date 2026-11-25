import { useT } from '@/i18n/LanguageProvider';

interface LoaderProps {
  done: boolean;
}

/** Minimal preloader shown until the hero character is on screen. */
export function Loader({ done }: LoaderProps) {
  const t = useT();
  return (
    <div className={`loader${done ? ' is-done' : ''}`} role="status" aria-live="polite" aria-hidden={done}>
      <div className="loader__inner">
        <img className="loader__mark" src="/brand/logo-mark.png" alt="UstaBor" width="72" height="57" />
        <div className="loader__bar" aria-hidden="true">
          <i />
        </div>
        <div className="loader__label">
          <span>{done ? t.loader.ready : t.loader.loading}</span>
        </div>
      </div>
    </div>
  );
}
