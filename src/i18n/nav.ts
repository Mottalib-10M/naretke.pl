import { route, AMOUNTS, type Locale } from './routes';
import { formatNumber } from '../lib/format';
export interface NavLink { href: string; label: string } export interface NavCategory { label: string; links: NavLink[] }
const L: Record<Locale, Record<string, string>> = {
  pl: { home: 'Kalkulator wynagrodzeń', zlecenie: 'Umowa zlecenie', dzielo: 'Umowa o dzieło', b2b: 'Kalkulator B2B', nettobrutto: 'Netto na brutto', employer: 'Koszt pracodawcy', compare: 'B2B czy umowa o pracę', annual: 'Wynagrodzenie roczne, miesiąc po miesiącu', hourly: 'Stawka godzinowa', overtime: 'Nadgodziny', sick: 'Chorobowe (L4)', ppk: 'Kalkulator PPK', bonus: 'Premia netto',
    minimum: 'Płaca minimalna 2026', average: 'Przeciętne wynagrodzenie', zus: 'Składki ZUS', health: 'Składka zdrowotna', brackets: 'Progi podatkowe', allowance: 'Kwota wolna od podatku', kup: 'Koszty uzyskania przychodu', youth: 'Ulga dla młodych', cap: 'Limit 30-krotności ZUS', ryczalt: 'Ryczałt ewidencjonowany', liniowy: 'Podatek liniowy 19 %', zusb2b: 'ZUS przedsiębiorcy', authors: 'Koszty autorskie 50 %', student: 'Zlecenie dla studenta', pit2: 'PIT-2', zlecdzielo: 'Zlecenie czy dzieło',
    method: 'Metodologia', faq: 'FAQ', glossary: 'Słownik', widget: 'Kalkulator na Twoją stronę', about: 'O nas', contact: 'Kontakt', editorial: 'Polityka redakcyjna', privacy: 'Polityka prywatności', terms: 'Regulamin', cookies: 'Cookies' },
  en: { home: 'Polish salary calculator', zlecenie: 'Mandate contract (zlecenie)', dzielo: 'Specific-work contract (dzieło)', b2b: 'B2B calculator', nettobrutto: 'Net to gross', employer: 'Employer cost', compare: 'B2B vs employment contract', annual: 'Annual salary, month by month', hourly: 'Hourly wage', overtime: 'Overtime pay', sick: 'Sick pay (L4)', ppk: 'PPK calculator', bonus: 'Bonus after tax',
    minimum: 'Minimum wage 2026', average: 'Average salary in Poland', zus: 'ZUS contributions', health: 'Health contribution', brackets: 'Income tax brackets', allowance: 'Tax-free allowance', kup: 'Deductible employment costs', youth: 'Youth tax relief', cap: 'ZUS contribution cap', ryczalt: 'Lump-sum tax (ryczałt)', liniowy: 'Flat tax 19 %', zusb2b: 'ZUS for the self-employed', authors: 'Creative work costs 50 %', student: 'Students on zlecenie', pit2: 'PIT-2 form', zlecdzielo: 'Zlecenie or dzieło?',
    method: 'Methodology', faq: 'FAQ', glossary: 'Glossary', widget: 'Embed the calculator', about: 'About', contact: 'Contact', editorial: 'Editorial policy', privacy: 'Privacy', terms: 'Terms', cookies: 'Cookies' },
};
export const label = (id: string, lang: Locale) => L[lang][id] ?? id;
const link = (id: string, lang: Locale): NavLink => ({ href: route(id, lang), label: label(id, lang) });
export const amountLabel = (a: number, lang: Locale) => lang === 'pl' ? `${formatNumber(a, 0, 'pl')} zł brutto` : `PLN ${formatNumber(a, 0, 'en')} gross`;
export function navCategories(lang: Locale): NavCategory[] {
  return [
    { label: lang === 'pl' ? 'Kalkulatory' : 'Calculators', links: ['home', 'zlecenie', 'dzielo', 'b2b', 'nettobrutto', 'employer', 'compare', 'annual', 'hourly', 'overtime', 'sick', 'ppk', 'bonus'].map((i) => link(i, lang)) },
    { label: lang === 'pl' ? 'Poradniki' : 'Guides', links: ['minimum', 'average', 'zus', 'health', 'brackets', 'allowance', 'kup', 'youth', 'cap', 'pit2', 'student', 'zlecdzielo', 'authors', 'zusb2b', 'ryczalt', 'liniowy'].map((i) => link(i, lang)) },
    { label: lang === 'pl' ? 'Ile netto?' : 'By salary', links: AMOUNTS.map((a) => ({ href: route(`amount-${a}`, lang), label: amountLabel(a, lang) })) },
  ];
}
export const navDirect = (lang: Locale): NavLink[] => [link('faq', lang), link('method', lang)];
export const footerColumns = (lang: Locale): NavCategory[] => [...navCategories(lang), { label: lang === 'pl' ? 'Serwis' : 'Site', links: ['about', 'contact', 'editorial', 'method', 'faq', 'glossary', 'widget', 'privacy', 'terms', 'cookies'].map((i) => link(i, lang)) }];
export const popularLinks = (lang: Locale): NavLink[] => AMOUNTS.map((a) => ({ href: route(`amount-${a}`, lang), label: amountLabel(a, lang) }));
