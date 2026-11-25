import type { Locale } from './types';

/**
 * Oʻzbek (lotin) – default language.
 * The typographic apostrophe (’) is used consistently for oʻ / gʻ / taʼ.
 */
export const uz: Locale = {
  code: 'uz',
  label: 'O’Z',
  htmlLang: 'uz',
  meta: {
    title: 'UstaBor 1432 — Usta kerakmi? Bir qo’ng’iroq kifoya',
    description:
      'UstaBor — uy va biznesingiz uchun ishonchli ustalarni topish xizmati. Duradgor, santexnik, elektrik, ta’mirlash ustasi va boshqa mutaxassislar. 1432 ga qo’ng’iroq qiling.',
  },
  nav: {
    home: 'Bosh sahifa',
    services: 'Xizmatlar',
    about: 'Biz haqimizda',
    contact: 'Aloqa',
  },
  header: { call: '1432', menu: 'Menyu', close: 'Yopish' },
  loader: {
    loading: 'Yuklanmoqda',
    ready: 'Tayyor',
    noWebGL: 'Brauzeringiz 3D sahnani qo’llab-quvvatlamaydi. Sayt oddiy rejimda ko’rsatilmoqda.',
  },
  hero: {
    eyebrow: 'Ustalar xizmati · O’zbekiston',
    title: 'Usta kerakmi?',
    subtitle: 'Ishonchli usta — bir qo’ng’iroq narida.',
    description: 'Uy va biznesingiz uchun kerakli mutaxassisni toping.',
    cta: '1432 ga qo’ng’iroq qilish',
    secondary: 'Xizmatlarni ko’rish',
    scrollHint: 'Pastga aylantiring',
  },
  scenes: {
    carpenter: {
      eyebrow: 'Xizmat 01',
      title: 'Duradgor',
      description: 'Yog’och bilan ishlaydigan tajribali ustalar: mebeldan tortib eshik-romgacha.',
      services: ['Mebel yasash', 'Mebel ta’mirlash', 'Eshik va romlar', 'Yog’och buyumlar'],
      note: 'O’lchov, loyiha va o’rnatish — bir usta qo’lida.',
    },
    plumber: {
      eyebrow: 'Xizmat 02',
      title: 'Santexnik',
      description: 'Suv tizimlari, quvurlar va santexnika — tez, toza va kafolat bilan.',
      services: ['Quvurlarni ta’mirlash', 'Santexnika o’rnatish', 'Suv tizimlari', 'Oqishlarni bartaraf etish'],
      note: 'Shoshilinch chaqiruvlar uchun ham usta topamiz.',
    },
    electrician: {
      eyebrow: 'Xizmat 03',
      title: 'Elektrik',
      description: 'Xavfsiz elektr montaj va yoritish tizimlari — uy va ofislar uchun.',
      services: ['Elektr montaj', 'Simlarni almashtirish', 'Yoritish tizimlari', 'Elektr jihozlarini o’rnatish'],
      note: 'Barcha ishlar xavfsizlik talablariga muvofiq bajariladi.',
    },
    renovator: {
      eyebrow: 'Xizmat 04',
      title: 'Ta’mirlash ustasi',
      description: 'Kichik ta’mirdan to’liq pardozlashgacha — uyingizni yangilaydigan usta.',
      services: ['Uy ta’mirlash', 'Pardozlash ishlari', 'Montaj', 'Qurilish ishlari'],
      note: 'Material tanlashda ham maslahat beramiz.',
    },
    welder: {
      eyebrow: 'Xizmat 05',
      title: 'Payvandchi',
      description: 'Metall konstruksiyalar, panjara va darvozalar — mustahkam va aniq ishlangan.',
      services: ['Payvandlash ishlari', 'Panjara va darvozalar', 'Metall konstruksiyalar', 'Boshqa mutaxassislar'],
      note: 'Kerakli usta ro’yxatda yo’qmi? 1432 ga qo’ng’iroq qiling — topamiz.',
    },
  },
  indicator: { of: '/', professions: 'Kasblar' },
  cta: {
    eyebrow: 'Bir qo’ng’iroq kifoya',
    title: 'Usta kerakmi?',
    text: '1432 ga qo’ng’iroq qiling — kerakli ustani topishga yordam beramiz.',
    button: '1432 ga qo’ng’iroq qilish',
    tagline: 'Usta kerak — UstaBor. 1432.',
    hours: 'Qisqa raqam · O’zbekiston bo’ylab',
  },
  about: {
    eyebrow: 'Biz haqimizda',
    title: 'Mijoz va usta o’rtasidagi ishonchli ko’prik',
    text: 'UstaBor — O’zbekiston bo’ylab mijozlarni malakali ustalar va mutaxassislar bilan bog’laydigan xizmat platformasi. Kerakli ustani izlab vaqt yo’qotmang: bir qo’ng’iroq bilan so’rovingizni qoldiring, qolganini biz hal qilamiz.',
    howTitle: 'Qanday ishlaydi',
    steps: [
      { title: 'Qo’ng’iroq qiling', text: '1432 raqamiga qo’ng’iroq qiling va qanday usta kerakligini ayting.' },
      { title: 'Usta tanlanadi', text: 'So’rovingizga mos mutaxassisni tanlab, siz bilan bog’laymiz.' },
      { title: 'Ish bajariladi', text: 'Usta kelishilgan vaqtda keladi va ishni sifatli bajaradi.' },
    ],
  },
  contact: {
    eyebrow: 'Aloqa',
    title: 'Biz bilan bog’laning',
    phone: 'Telefon',
    email: 'Elektron pochta',
    address: 'Manzil',
    hours: 'Ish vaqti',
    social: 'Ijtimoiy tarmoqlar',
    legal: 'Yuridik ma’lumot',
    notProvided: 'Ma’lumot tez orada qo’shiladi',
  },
  footer: {
    rights: 'Barcha huquqlar himoyalangan.',
    madeIn: 'O’zbekistonda ishlab chiqilgan',
    language: 'Til',
  },
  errors: {
    modelFailed: '3D modelni yuklab bo’lmadi.',
    retry: 'Qayta urinish',
  },
};
