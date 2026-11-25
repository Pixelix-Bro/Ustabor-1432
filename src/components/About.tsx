import { useT } from '@/i18n/LanguageProvider';

const pad = (n: number) => String(n).padStart(2, '0');

/** "Biz haqimizda" – platform description and how it works. No invented facts. */
export function About() {
  const t = useT();
  return (
    <section className="section section--paper" id="about" data-section="about">
      <div className="section__grid">
        <div className="section__head">
          <p className="eyebrow">{t.about.eyebrow}</p>
          <h2 className="display section__title">{t.about.title}</h2>
        </div>
        <div className="section__body">
          <p className="section__text">{t.about.text}</p>
          <div>
            <p className="steps__head" style={{ paddingBottom: 18 }}>
              {t.about.howTitle}
            </p>
            <ol className="steps">
              {t.about.steps.map((step, i) => (
                <li className="steps__item" key={i}>
                  <span className="steps__num">{pad(i + 1)}</span>
                  <h3 className="steps__title">{step.title}</h3>
                  <p className="steps__text">{step.text}</p>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
