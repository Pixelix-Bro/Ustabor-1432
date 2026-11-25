import { forwardRef } from 'react';
import { useT } from '@/i18n/LanguageProvider';
import { CALL_HREF } from '@/data/company';
import { navigation } from '@/store/progress';
import { PhoneIcon } from '../Icons';

interface HeroLayerProps {
  staticMode?: boolean;
}

/**
 * Scene 0 – the first impression. Title on the left, supporting copy and
 * actions bottom-right, the 3D craftsman in between.
 */
export const HeroLayer = forwardRef<HTMLDivElement, HeroLayerProps>(function HeroLayer({ staticMode }, ref) {
  const t = useT();
  const [first, ...rest] = t.hero.title.split(' ');
  return (
    <div ref={ref} className="layer layer--hero" data-layer="0" id="home">
      <p className="eyebrow hero-eyebrow" data-anim>
        {t.hero.eyebrow}
      </p>

      <h1 className="display hero-title">
        <span data-anim>{first}</span>
        <span data-anim className="hero-title__accent">{rest.join(' ')}</span>
      </h1>

      {staticMode && <img className="fallback-logo" src="/brand/logo-full.png" alt="UstaBor 1432" />}

      <div className="hero-side">
        <p className="hero-subtitle" data-anim>
          {t.hero.subtitle}
        </p>
        <p className="lede" data-anim>
          {t.hero.description}
        </p>
        <div className="hero-actions" data-anim>
          <a className="btn btn--primary" href={CALL_HREF}>
            <PhoneIcon className="btn__icon" />
            {t.hero.cta}
          </a>
          <button type="button" className="btn btn--ghost" onClick={() => navigation.scrollToScene(1)}>
            {t.hero.secondary}
          </button>
        </div>
      </div>

      {!staticMode && (
        <div className="scroll-hint" data-anim aria-hidden="true">
          <span>{t.hero.scrollHint}</span>
          <i />
        </div>
      )}
    </div>
  );
});
