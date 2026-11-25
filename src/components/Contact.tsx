import { useLanguage } from '@/i18n/LanguageProvider';
import { CALL_HREF, COMPANY, telHref } from '@/data/company';

/**
 * Official contact information. Every field is driven by `data/company.ts`;
 * fields that are not provided yet render a neutral placeholder instead of
 * invented data.
 */
export function Contact() {
  const { t, lang } = useLanguage();
  const c = t.contact;

  const Field = ({ label, children, placeholder }: { label: string; children?: React.ReactNode; placeholder?: boolean }) => (
    <div className="contact-field">
      <dt>{label}</dt>
      <dd className={placeholder ? 'is-placeholder' : undefined}>{placeholder ? c.notProvided : children}</dd>
    </div>
  );

  return (
    <section className="section section--navy" id="contact" data-section="contact">
      <div className="section__grid">
        <div className="section__head">
          <p className="eyebrow">{c.eyebrow}</p>
          <h2 className="display section__title">{c.title}</h2>
          <a className="contact-number" href={CALL_HREF}>
            {COMPANY.shortNumber}
            <small>{c.phone}</small>
          </a>
        </div>
        <div className="section__body">
          <dl className="contact-grid">
            <Field label={c.phone} placeholder={COMPANY.phones.length === 0}>
              <ul className="phone-list">
                {COMPANY.phones.map((p) => (
                  <li key={p.number}>
                    <a href={telHref(p.number)}>{p.number}</a>
                    <span>{p.label[lang]}</span>
                  </li>
                ))}
              </ul>
            </Field>
            <Field label={c.email} placeholder={!COMPANY.email}>
              <a href={`mailto:${COMPANY.email}`}>{COMPANY.email}</a>
            </Field>
            <Field label={c.address} placeholder={!COMPANY.address}>
              {COMPANY.address?.[lang]}
            </Field>
            <Field label={c.hours} placeholder={!COMPANY.hours}>
              {COMPANY.hours?.[lang]}
            </Field>
            <Field label={c.social} placeholder={COMPANY.social.length === 0}>
              <div className="social">
                {COMPANY.social.map((s) => (
                  <a key={s.platform} href={s.url} target="_blank" rel="noopener noreferrer">
                    {s.label}
                  </a>
                ))}
              </div>
            </Field>
            <Field label={c.legal} placeholder={!COMPANY.legal}>
              {COMPANY.legal?.[lang]}
            </Field>
          </dl>
        </div>
      </div>
    </section>
  );
}
