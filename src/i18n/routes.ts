import { makeRouter, type RouteDef } from './routes-core';
export const LOCALES = ['pl', 'en'] as const;
export type Locale = (typeof LOCALES)[number];
export const DEFAULT_LOCALE: Locale = 'pl';
/** Montants des pages « par montant » : chacun porte un seuil propre (RECETTE §6.2, lib/amount-angles.ts). */
export const AMOUNTS = [5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 20000, 25000] as const;
const R = (id: string, pl: string, en: string, noindex = false): RouteDef<Locale> => ({ id, paths: { pl: `/pl/${pl}`, en: `/en/${en}` }, ...(noindex ? { noindex: true } : {}) });
export const ROUTES: RouteDef<Locale>[] = [
  R('home', '', ''),
  // Kalkulatory (strony-narzędzia)
  R('zlecenie', 'kalkulator-umowa-zlecenie/', 'mandate-contract-calculator/'),
  R('dzielo', 'kalkulator-umowa-o-dzielo/', 'specific-work-contract-calculator/'),
  R('b2b', 'kalkulator-b2b/', 'b2b-calculator/'),
  R('nettobrutto', 'kalkulator-netto-brutto/', 'net-to-gross-calculator/'),
  R('employer', 'koszt-pracodawcy/', 'employer-cost-calculator/'),
  R('compare', 'b2b-czy-umowa-o-prace/', 'b2b-vs-employment-contract/'),
  R('annual', 'wynagrodzenie-roczne/', 'annual-salary-calculator/'),
  R('hourly', 'kalkulator-stawki-godzinowej/', 'hourly-wage-calculator/'),
  R('overtime', 'kalkulator-nadgodzin/', 'overtime-pay-calculator/'),
  R('sick', 'kalkulator-chorobowego/', 'sick-pay-calculator/'),
  R('ppk', 'kalkulator-ppk/', 'ppk-calculator/'),
  R('bonus', 'premia-netto/', 'bonus-net-calculator/'),
  // Poradniki
  R('minimum', 'placa-minimalna/', 'minimum-wage-poland/'),
  R('average', 'przecietne-wynagrodzenie/', 'average-salary-poland/'),
  R('zus', 'skladki-zus/', 'zus-contributions/'),
  R('health', 'skladka-zdrowotna/', 'health-insurance-contribution/'),
  R('brackets', 'progi-podatkowe/', 'income-tax-brackets/'),
  R('allowance', 'kwota-wolna-od-podatku/', 'tax-free-allowance/'),
  R('kup', 'koszty-uzyskania-przychodu/', 'deductible-employment-costs/'),
  R('youth', 'ulga-dla-mlodych/', 'youth-tax-relief/'),
  R('cap', 'limit-30-krotnosci/', 'zus-contribution-cap/'),
  R('ryczalt', 'ryczalt-ewidencjonowany/', 'lump-sum-tax-ryczalt/'),
  R('liniowy', 'podatek-liniowy/', 'flat-tax-poland/'),
  R('zusb2b', 'zus-przedsiebiorcy/', 'zus-for-self-employed/'),
  R('authors', 'koszty-autorskie/', 'creative-work-costs/'),
  R('student', 'umowa-zlecenie-student/', 'student-mandate-contract/'),
  R('pit2', 'pit-2/', 'pit-2-form/'),
  R('zlecdzielo', 'umowa-zlecenie-czy-o-dzielo/', 'mandate-vs-specific-work-contract/'),
  // Strony „ile netto z X brutto”
  ...AMOUNTS.map((a) => R(`amount-${a}`, `${a}-brutto-ile-netto/`, `${a}-pln-gross-to-net/`)),
  // Strony serwisowe
  R('method', 'metodologia/', 'methodology/'),
  R('faq', 'faq/', 'faq/'),
  R('glossary', 'slownik/', 'glossary/', true),
  R('widget', 'widget/', 'widget/', true),
  R('about', 'o-nas/', 'about/', true),
  R('contact', 'kontakt/', 'contact/', true),
  R('editorial', 'polityka-redakcyjna/', 'editorial-policy/', true),
  R('privacy', 'polityka-prywatnosci/', 'privacy/', true),
  R('terms', 'regulamin/', 'terms/', true),
  R('cookies', 'cookies/', 'cookies/', true),
];
export const { NOINDEX_PATHS, route, altPaths } = makeRouter(LOCALES, ROUTES);
