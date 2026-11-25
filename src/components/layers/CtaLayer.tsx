import { forwardRef } from 'react';
import { useT } from '@/i18n/LanguageProvider';
import { CALL_HREF, COMPANY } from '@/data/company';
import { PhoneIcon } from '../Icons';

interface CtaLayerProps {
  index: number;
  staticMode?: boolean;
}

/** Final scene – 1432 as the hero of the composition. */
export const CtaLayer = forwardRef<HTMLDivElement, CtaLayerProps>(function CtaLayer({ index, staticMode }, ref) {
  const t = useT();
  return (
    <div
      ref={ref}
      className={`layer layer--cta${staticMode ? ' layer--static-theme-dark' : ''}`}
      data-layer={index}
      style={staticMode ? { background: '#0b1430' } : undefined}
    >
      <div className="cta-glow" aria-hidden="true" />
      <p className="eyebrow" data-anim>
        {t.cta.eyebrow}
      </p>
      <a className="cta-number" href={CALL_HREF} data-anim aria-label={t.cta.button}>
        {COMPANY.shortNumber}
      </a>
      <h2 className="display cta-title" data-anim>
        {t.cta.title}
      </h2>
      <p className="cta-text" data-anim>
        {t.cta.text}
      </p>
      <div className="cta-actions" data-anim>
        <a className="btn btn--primary btn--lg" href={CALL_HREF}>
          <PhoneIcon className="btn__icon" />
          {t.cta.button}
        </a>
      </div>
      <p className="cta-tagline" data-anim>
        {t.cta.tagline}
      </p>
    </div>
  );
});
