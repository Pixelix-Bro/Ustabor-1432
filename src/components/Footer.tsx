import { useT } from '@/i18n/LanguageProvider';
import { COMPANY } from '@/data/company';
import { navigation } from '@/store/progress';
import { LanguageSwitcher } from './LanguageSwitcher';

export function Footer() {
  const t = useT();
  const year = new Date().getFullYear();
  const links: { label: string; go: () => void }[] = [
    { label: t.nav.home, go: () => navigation.scrollToScene(0) },
    { label: t.nav.services, go: () => navigation.scrollToScene(1) },
    { label: t.nav.about, go: () => navigation.scrollToElement('about') },
    { label: t.nav.contact, go: () => navigation.scrollToElement('contact') },
  ];
  return (
    <footer className="section section--midnight footer" data-section="contact">
      <div className="footer__top">
        <div className="footer__brand">
          <span className="logo__tile">
            <img className="logo__mark" src="/brand/logo-mark.png" alt="" width="36" height="28" />
          </span>
          <div className="footer__brand-text">
            <strong>
              {COMPANY.brandName} {COMPANY.shortNumber}
            </strong>
            <span>{t.cta.hours}</span>
          </div>
        </div>
        <nav className="footer__nav" aria-label="Footer">
          {links.map((l) => (
            <a key={l.label} href="#" onClick={(e) => { e.preventDefault(); l.go(); }}>
              {l.label}
            </a>
          ))}
        </nav>
        <LanguageSwitcher />
      </div>
      <div className="footer__bottom">
        <span>
          © {year} {COMPANY.brandName}. {t.footer.rights}
        </span>
        <span>{t.footer.madeIn}</span>
      </div>
    </footer>
  );
}
