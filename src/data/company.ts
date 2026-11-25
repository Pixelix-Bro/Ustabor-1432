/**
 * Official company information.
 *
 * Nothing here is invented: every value was supplied by UstaBor. Fields set
 * to `null` / empty are not provided yet and the UI shows a neutral
 * "information coming soon" state for them.
 */

export interface Localised {
  uz: string;
  ru: string;
}

export interface PhoneEntry {
  /** Display form, e.g. '+998 77 715 1432' */
  number: string;
  /** What the line is for */
  label: Localised;
}

export interface SocialLink {
  platform: 'telegram' | 'instagram' | 'facebook' | 'youtube' | 'tiktok';
  label: string;
  url: string;
}

export interface CompanyInfo {
  brandName: string;
  shortNumber: string;
  phones: PhoneEntry[];
  email: string | null;
  address: Localised | null;
  hours: Localised | null;
  website: string | null;
  social: SocialLink[];
  legal: Localised | null;
  foundedYear: number | null;
}

export const COMPANY: CompanyInfo = {
  brandName: 'UstaBor',
  shortNumber: '1432',
  phones: [
    {
      number: '+998 77 715 1432',
      label: { uz: 'O’zbekiston bo’ylab', ru: 'По всему Узбекистану' },
    },
    {
      number: '+998 77 506 70 01',
      label: { uz: 'Reklama va hamkorlik uchun', ru: 'Реклама и сотрудничество' },
    },
  ],
  email: null,
  address: {
    uz: 'Namangan shahri, Ozod mahalla fuqarolar yig’ini, Sanoat ko’chasi, 334',
    ru: 'Наманган, махаллинский сход граждан Озод, улица Саноат, 334',
  },
  hours: null,
  website: null,
  social: [
    { platform: 'telegram', label: 'Telegram', url: 'https://t.me/ustabor_1432' },
    { platform: 'instagram', label: 'Instagram', url: 'https://www.instagram.com/ustabor__1432' },
    { platform: 'youtube', label: 'YouTube', url: 'https://youtube.com/@million_gacha' },
  ],
  legal: null,
  foundedYear: null,
};

/** tel: href for the short number */
export const CALL_HREF = `tel:${COMPANY.shortNumber}`;

/** tel: href for a display number ('+998 77 715 1432' → 'tel:+998777151432') */
export const telHref = (display: string) => `tel:${display.replace(/[^\d+]/g, '')}`;
