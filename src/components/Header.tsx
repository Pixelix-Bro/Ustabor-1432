import { useCallback, useEffect, useState } from 'react';
import { useT } from '@/i18n/LanguageProvider';
import { CALL_HREF, COMPANY } from '@/data/company';
import { navigation } from '@/store/progress';
import { useSceneIndex } from '@/hooks/useSceneIndex';
import { STORY_SCENES } from '@/data/scenes';
import { LanguageSwitcher } from './LanguageSwitcher';
import { PhoneIcon } from './Icons';

interface NavItem {
  key: 'home' | 'services' | 'about' | 'contact';
  go: () => void;
}

export function Header() {
  const t = useT();
  const [open, setOpen] = useState(false);
  const sceneIndex = useSceneIndex();
  const [section, setSection] = useState<'stage' | 'about' | 'contact'>('stage');

  // Which nav item is "active": stage scenes → home/services, below → about/contact
  useEffect(() => {
    const onSection = (e: Event) => setSection((e as CustomEvent<'stage' | 'about' | 'contact'>).detail);
    window.addEventListener('ustabor:section', onSection);
    return () => window.removeEventListener('ustabor:section', onSection);
  }, []);

  const active: NavItem['key'] =
    section === 'about' ? 'about' : section === 'contact' ? 'contact' : sceneIndex >= 1 && sceneIndex <= STORY_SCENES.length ? 'services' : 'home';

  const items: NavItem[] = [
    { key: 'home', go: () => navigation.scrollToScene(0) },
    { key: 'services', go: () => navigation.scrollToScene(1) },
    { key: 'about', go: () => navigation.scrollToElement('about') },
    { key: 'contact', go: () => navigation.scrollToElement('contact') },
  ];

  const handleNav = useCallback((go: () => void) => {
    setOpen(false);
    // let the menu close before scrolling so Lenis isn't locked
    window.setTimeout(go, open ? 120 : 0);
  }, [open]);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <header className="header">
        <a className="logo" href="#top" aria-label={COMPANY.brandName} onClick={(e) => { e.preventDefault(); handleNav(items[0].go); }}>
          <span className="logo__tile">
            <img className="logo__mark" src="/brand/logo-mark.png" alt="" width="36" height="28" />
          </span>
          <span className="logo__word">
            Usta<em>Bor</em>
          </span>
        </a>

        <nav className="nav" aria-label="Main">
          {items.map((item) => (
            <a
              key={item.key}
              href={`#${item.key}`}
              className={`nav__link${active === item.key ? ' is-active' : ''}`}
              onClick={(e) => { e.preventDefault(); handleNav(item.go); }}
            >
              {t.nav[item.key]}
            </a>
          ))}
        </nav>

        <div className="header__right">
          <LanguageSwitcher />
          <a className="call-pill" href={CALL_HREF} aria-label={t.hero.cta}>
            <PhoneIcon />
            {COMPANY.shortNumber}
          </a>
          <button
            type="button"
            className="burger"
            aria-expanded={open}
            aria-controls="mobile-menu"
            aria-label={open ? t.header.close : t.header.menu}
            onClick={() => setOpen((v) => !v)}
          >
            <span />
          </button>
        </div>
      </header>

      <div id="mobile-menu" className={`menu${open ? ' is-open' : ''}`} aria-hidden={!open}>
        {items.map((item) => (
          <a key={item.key} href={`#${item.key}`} className="menu__link" onClick={(e) => { e.preventDefault(); handleNav(item.go); }}>
            {t.nav[item.key]}
          </a>
        ))}
        <div className="menu__footer">
          <LanguageSwitcher />
          <a className="btn btn--primary" href={CALL_HREF}>
            <PhoneIcon className="btn__icon" />
            {t.hero.cta}
          </a>
        </div>
      </div>
    </>
  );
}
