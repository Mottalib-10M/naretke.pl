/**
 * Moteur de calcul du salaire net polonais 2026 — fonctions pures, aucun appel réseau.
 * Tous les taux, seuils et montants viennent de `data/params-2026.json` (RECETTE §4, §17.4) :
 * aucune valeur légale n'est écrite ici en dur.
 *
 * Arrondis appliqués comme sur une liste de paie : cotisations au grosz, base imposable et
 * zaliczka PIT à la złoty entière (Ordynacja podatkowa, art. 63 § 1).
 */
import P from '../../data/params-2026.json';

export const PARAMS = P;
const r2 = (x: number) => Math.round((x + Number.EPSILON) * 100) / 100;
const r0 = (x: number) => Math.round(x);
const pos = (x: number) => (x > 0 ? x : 0);

export type Kup = 'standard' | 'raised';

/* ------------------------------------------------------------------------- *
 * Umowa o pracę — mois par mois sur l'année
 * ------------------------------------------------------------------------- */
export interface UopInput {
  /** Brut mensuel (ou brut de chaque mois si `months` est fourni). */
  gross: number;
  /** Bruts des douze mois, pour une prime ou un salaire variable. */
  months?: number[];
  kup?: Kup;
  /** PIT-2 déposé : la zaliczka est réduite de 1/12 de la kwota zmniejszająca. */
  pit2?: boolean;
  /** Moins de 26 ans : ulga dla młodych jusqu'au plafond annuel de revenus exonérés. */
  under26?: boolean;
  /** Participation au PPK. */
  ppk?: boolean;
  /** Taux salarié PPK (fraction), base + supplémentaire. Défaut : taux de base. */
  ppkEmployeeRate?: number;
  /** Taux employeur PPK (fraction). Défaut : taux de base. */
  ppkEmployerRate?: number;
  /** Part du brut rémunérant des droits d'auteur (0 à 1) : koszty autorskie 50 %. */
  authorsShare?: number;
  /** Cotisation accident du travail de l'employeur (fraction). Défaut : taux de base. */
  wypadkowaRate?: number;
}

export interface UopMonth {
  month: number;
  gross: number;
  emerytalna: number; rentowa: number; chorobowa: number; social: number;
  health: number;
  kup: number;
  exempt: number;
  taxBase: number;
  pit: number;
  ppkEmployee: number; ppkEmployer: number;
  net: number;
  /** Base imposable cumulée depuis janvier, après ce mois. */
  cumTaxBase: number;
  /** Le mois a été (au moins en partie) imposé à 32 %. */
  secondBracket: boolean;
  /** Le plafond annuel des cotisations retraite et invalidité a joué ce mois-ci. */
  capped: boolean;
  /** Coût employeur. */
  er: { emerytalna: number; rentowa: number; wypadkowa: number; fp: number; fgsp: number; ppk: number; total: number; cost: number };
}

export interface UopYear { months: UopMonth[]; total: Omit<UopMonth, 'month' | 'cumTaxBase' | 'secondBracket' | 'capped' | 'er'> & { cost: number; erTotal: number }; }

const Z = P.zus;
const T = P.pit;
const H = P.health;

/** Santé du salarié et du zleceniobiorca, avec le plafond « zaliczka 2021 » (art. 83 ust. 1, 2a, 2b). */
export function healthCapped(gross: number, social: number, kup: number, reducing = true): number {
  const h = r2(pos(gross - social) * H.employee_rate);
  const cap = r2(pos(r0(pos(gross - social - kup)) * H.cap_2021_rate - (reducing ? H.cap_2021_reducing_month : 0)));
  return Math.min(h, cap);
}

export function uopYear(inp: UopInput): UopYear {
  const grosses = inp.months ?? Array.from({ length: 12 }, () => inp.gross);
  const kupM = inp.kup === 'raised' ? T.kup_employee_raised_month : T.kup_employee_month;
  const reduceM = inp.pit2 === false ? 0 : T.tax_reducing_amount_year / 12;
  const ppkE = inp.ppk ? (inp.ppkEmployeeRate ?? P.ppk.employee_basic) : 0;
  const ppkR = inp.ppk ? (inp.ppkEmployerRate ?? P.ppk.employer_basic) : 0;
  const wyp = inp.wypadkowaRate ?? Z.wypadkowa_basic;
  const auth = Math.min(1, Math.max(0, inp.authorsShare ?? 0));
  const cap = Z.annual_cap;
  let cumBase = 0, cumCapBase = 0, cumExempt = 0, cumAuthorsKup = 0, cumTaxBase = 0;
  const months: UopMonth[] = [];
  grosses.forEach((g, i) => {
    // Plafond annuel (30-krotność) : emerytalna et rentowa ne portent que sur la part sous le plafond.
    const capBase = Math.min(g, pos(cap - cumCapBase));
    cumCapBase += capBase;
    const capped = capBase < g;
    const emerytalna = r2(capBase * Z.emerytalna_employee);
    const rentowa = r2(capBase * Z.rentowa_employee);
    const chorobowa = r2(g * Z.chorobowa_employee);
    const social = r2(emerytalna + rentowa + chorobowa);
    const ppkEmployee = r2(g * ppkE);
    const ppkEmployer = r2(g * ppkR);
    // Revenu imposable du mois : brut + versement employeur PPK (revenu du salarié, ustawa o PPK art. 26 ; PIT art. 12).
    const income = g + ppkEmployer;
    // Ulga dla młodych : revenu exonéré jusqu'au plafond annuel (PIT art. 21 ust. 1 pkt 148).
    const exempt = inp.under26 ? Math.min(income, pos(T.youth_exempt_limit - cumExempt)) : 0;
    cumExempt += exempt;
    const taxable = income - exempt;
    const share = income > 0 ? taxable / income : 0;
    // Cotisations sociales déductibles au prorata de la part imposable (PIT art. 26 ust. 1 pkt 2).
    const socialDed = social * share;
    // Koszty autorskie 50 % sur la part « droits d'auteur », plafonnés sur l'année (PIT art. 22 ust. 9).
    const authGross = taxable * auth;
    const authKup = Math.min(pos((authGross - socialDed * auth) * T.kup_authors_rate), pos(T.kup_authors_limit - cumAuthorsKup));
    cumAuthorsKup += authKup;
    const stdKup = auth < 1 ? Math.min(kupM, pos(taxable - authGross)) : 0;
    const kup = r2(stdKup + authKup);
    const taxBase = r0(pos(taxable - socialDed - kup));
    // Santé 9 % sur le brut diminué des cotisations sociales, plafonnée à la zaliczka calculée selon les
    // règles PIT au 31.12.2021 (17 % moins 43,76 zł), comme si le revenu n'était pas exonéré
    // (ustawa o świadczeniach art. 83 ust. 1, 2a et 2b). Ne joue que pour de très petits salaires.
    const health = healthCapped(g, social, inp.kup === 'raised' ? T.kup_employee_raised_month : T.kup_employee_month);
    const prev = cumTaxBase;
    cumTaxBase += taxBase;
    const inFirst = Math.min(taxBase, pos(T.threshold - prev));
    const inSecond = taxBase - inFirst;
    const pitRaw = inFirst * T.rate_low + inSecond * T.rate_high - (taxable > 0 ? reduceM : 0);
    const pit = r0(pos(pitRaw));
    const net = r2(g - social - health - pit - ppkEmployee);
    const erEm = r2(capBase * Z.emerytalna_employer);
    const erRe = r2(capBase * Z.rentowa_employer);
    const erWy = r2(g * wyp);
    // Fundusz Pracy + Fundusz Solidarnościowy (ustawa budżetowa 2026, art. 25–26).
    // FP, FS et FGŚP ont pour assiette celle de l'emerytalna/rentowa, donc plafonnée (ustawa budżetowa 2026 art. 25–27).
    const erFp = r2(capBase * (Z.fp + Z.fs));
    const erFg = r2(capBase * Z.fgsp);
    const erTotal = r2(erEm + erRe + erWy + erFp + erFg + ppkEmployer);
    months.push({ month: i + 1, gross: g, emerytalna, rentowa, chorobowa, social, health, kup, exempt: r2(exempt), taxBase, pit, ppkEmployee, ppkEmployer, net, cumTaxBase, secondBracket: inSecond > 0, capped,
      er: { emerytalna: erEm, rentowa: erRe, wypadkowa: erWy, fp: erFp, fgsp: erFg, ppk: ppkEmployer, total: erTotal, cost: r2(g + erTotal) } });
  });
  const sum = (k: keyof UopMonth) => r2(months.reduce((s, m) => s + (m[k] as number), 0));
  return { months, total: { gross: sum('gross'), emerytalna: sum('emerytalna'), rentowa: sum('rentowa'), chorobowa: sum('chorobowa'), social: sum('social'), health: sum('health'), kup: sum('kup'), exempt: sum('exempt'), taxBase: sum('taxBase'), pit: sum('pit'), ppkEmployee: sum('ppkEmployee'), ppkEmployer: sum('ppkEmployer'), net: sum('net'),
    erTotal: r2(months.reduce((s, m) => s + m.er.total, 0)), cost: r2(months.reduce((s, m) => s + m.er.cost, 0)) } };
}

/** Un mois type (janvier : ni deuxième tranche, ni plafond). */
export function uop(inp: UopInput): UopMonth { return uopYear({ ...inp, months: [inp.gross] }).months[0]; }

/** Brut nécessaire pour un net mensuel visé (mois type), par dichotomie sur le moteur. */
export function grossForNet(net: number, inp: Omit<UopInput, 'gross'> = {}): number {
  if (net <= 0) return 0;
  let lo = net, hi = net * 3;
  while (uop({ ...inp, gross: hi }).net < net) hi *= 1.5;
  for (let k = 0; k < 60; k++) { const mid = (lo + hi) / 2; if (uop({ ...inp, gross: mid }).net < net) lo = mid; else hi = mid; }
  return r2(hi);
}

/* ------------------------------------------------------------------------- *
 * Umowa zlecenie
 * ------------------------------------------------------------------------- */
export interface ZlecenieInput {
  gross: number;
  /** Étudiant ou élève de moins de 26 ans : ni ZUS ni santé (ustawa systemowa art. 6 ust. 4). */
  student?: boolean;
  /** Moins de 26 ans : ulga dla młodych (exonération PIT). */
  under26?: boolean;
  /** Cotisation maladie volontaire. */
  sickness?: boolean;
  /** Aucune cotisation sociale due (autre titre d'assurance au moins égal au salaire minimum, etc.). */
  noZus?: boolean;
  pit2?: boolean;
  authorsShare?: number;
}
export interface ContractResult { gross: number; emerytalna: number; rentowa: number; chorobowa: number; social: number; health: number; kup: number; taxBase: number; pit: number; net: number; flat: boolean; employerCost: number; erSocial: number }

export function zlecenie(inp: ZlecenieInput): ContractResult {
  const g = inp.gross;
  const zus = !(inp.student || inp.noZus);
  const emerytalna = zus ? r2(g * Z.emerytalna_employee) : 0;
  const rentowa = zus ? r2(g * Z.rentowa_employee) : 0;
  const chorobowa = zus && inp.sickness ? r2(g * Z.chorobowa_employee) : 0;
  const social = r2(emerytalna + rentowa + chorobowa);
  // Santé : due dès que le contrat est assujetti à l'assurance santé (pas pour l'étudiant de moins de 26 ans).
  // Zlecenie : en 2021 le payeur n'appliquait pas la réduction mensuelle ; un contrat ≤ 200 zł à impôt
  // forfaitaire prend la santé entière (art. 83 ust. 3 pkt 6).
  const health = inp.student ? 0 : g <= T.flat_small_contract_limit ? r2(pos(g - social) * H.employee_rate) : healthCapped(g, social, r2((g - social) * T.kup_contract_rate), false);
  // FP, FS et FGŚP ne sont dus que si la rémunération atteint au moins le salaire minimum.
  const erSocial = zus ? r2(g * (Z.emerytalna_employer + Z.rentowa_employer + Z.wypadkowa_basic) + (g >= P.minimum_wage.monthly ? g * (Z.fp + Z.fs + Z.fgsp) : 0)) : 0;
  const auth = Math.min(1, Math.max(0, inp.authorsShare ?? 0));
  if (inp.under26 || inp.student) {
    // Ulga dla młodych (art. 21 ust. 1 pkt 148) : aucun PIT jusqu'au plafond annuel.
    return { gross: g, emerytalna, rentowa, chorobowa, social, health, kup: 0, taxBase: 0, pit: 0, net: r2(g - social - health), flat: false, employerCost: r2(g + erSocial), erSocial };
  }
  // Petit contrat (≤ 200 zł) avec un non-salarié : impôt forfaitaire 12 % sur le brut (art. 30 ust. 1 pkt 5a).
  if (g <= T.flat_small_contract_limit) {
    const pit = r0(g * T.rate_low);
    return { gross: g, emerytalna, rentowa, chorobowa, social, health, kup: 0, taxBase: r0(g), pit, net: r2(g - social - health - pit), flat: true, employerCost: r2(g + erSocial), erSocial };
  }
  const kup = r2((g - social) * (1 - auth) * T.kup_contract_rate + (g - social) * auth * T.kup_authors_rate);
  const taxBase = r0(pos(g - social - kup));
  const pit = r0(pos(taxBase * T.rate_low - (inp.pit2 ? T.tax_reducing_amount_year / 12 : 0)));
  return { gross: g, emerytalna, rentowa, chorobowa, social, health, kup, taxBase, pit, net: r2(g - social - health - pit), flat: false, employerCost: r2(g + erSocial), erSocial };
}

/* ------------------------------------------------------------------------- *
 * Umowa o dzieło
 * ------------------------------------------------------------------------- */
export interface DzieloInput { gross: number; authors?: boolean; pit2?: boolean }
export function dzielo(inp: DzieloInput): ContractResult {
  const g = inp.gross;
  if (g <= T.flat_small_contract_limit) {
    const pit = r0(g * T.rate_low);
    return { gross: g, emerytalna: 0, rentowa: 0, chorobowa: 0, social: 0, health: 0, kup: 0, taxBase: r0(g), pit, net: r2(g - pit), flat: true, employerCost: g, erSocial: 0 };
  }
  const kup = r2(g * (inp.authors ? T.kup_authors_rate : T.kup_contract_rate));
  const taxBase = r0(pos(g - kup));
  const pit = r0(pos(taxBase * T.rate_low - (inp.pit2 ? T.tax_reducing_amount_year / 12 : 0)));
  return { gross: g, emerytalna: 0, rentowa: 0, chorobowa: 0, social: 0, health: 0, kup, taxBase, pit, net: r2(g - pit), flat: false, employerCost: g, erSocial: 0 };
}

/* ------------------------------------------------------------------------- *
 * B2B (jednoosobowa działalność gospodarcza) — moyenne mensuelle d'une année
 * ------------------------------------------------------------------------- */
export type B2bForm = 'skala' | 'liniowy' | 'ryczalt';
export type B2bZus = 'full' | 'preferential' | 'start';
export interface B2bInput {
  /** Chiffre d'affaires mensuel net de TVA. */
  revenue: number;
  /** Charges mensuelles déductibles (sans effet au ryczałt). */
  costs?: number;
  form: B2bForm;
  /** Taux du ryczałt (fraction), selon l'activité. */
  ryczaltRate?: number;
  zus?: B2bZus;
  sickness?: boolean;
}
export interface B2bResult {
  revenue: number; costs: number; social: number; fp: number; health: number; healthDeducted: number; taxBase: number; tax: number; net: number;
  /** Détail mensuel des cotisations sociales. */
  zus: { emerytalna: number; rentowa: number; chorobowa: number; wypadkowa: number; fp: number; base: number };
}

export function b2bZusMonth(kind: B2bZus = 'full', sickness = false) {
  if (kind === 'start') return { emerytalna: 0, rentowa: 0, chorobowa: 0, wypadkowa: 0, fp: 0, base: 0 };
  const base = kind === 'full' ? P.b2b.zus_base_full : P.b2b.zus_base_preferential;
  const emerytalna = r2(base * (Z.emerytalna_employee + Z.emerytalna_employer));
  const rentowa = r2(base * (Z.rentowa_employee + Z.rentowa_employer));
  const chorobowa = sickness ? r2(base * Z.chorobowa_employee) : 0;
  const wypadkowa = r2(base * Z.wypadkowa_basic);
  // Fundusz Pracy : pas dû sur la base préférentielle (moins que le salaire minimum).
  const fp = kind === 'full' ? r2(base * (Z.fp + Z.fs)) : 0;
  return { emerytalna, rentowa, chorobowa, wypadkowa, fp, base };
}

/** Taux de santé, minimum et plafond de déduction selon la forme d'imposition (montants annuels). */
function b2bHealthYear(form: B2bForm, revenueY: number, healthIncomeY: number): number {
  const H = P.b2b.health;
  if (form === 'ryczalt') {
    const band = H.ryczalt_bands.find((b) => revenueY <= b.revenue_up_to) ?? H.ryczalt_bands[H.ryczalt_bands.length - 1];
    return r2(band.monthly * 12);
  }
  const rate = form === 'liniowy' ? H.liniowy_rate : H.skala_rate;
  return r2(Math.max(pos(healthIncomeY) * rate, H.minimum_monthly * 12));
}

export function b2b(inp: B2bInput): B2bResult {
  const revY = inp.revenue * 12;
  const costsY = inp.form === 'ryczalt' ? 0 : (inp.costs ?? 0) * 12;
  const z = b2bZusMonth(inp.zus ?? 'full', inp.sickness ?? false);
  const socialY = (z.emerytalna + z.rentowa + z.chorobowa + z.wypadkowa) * 12;
  const fpY = z.fp * 12;
  // Revenu servant à la santé : recettes − charges − cotisations sociales (le Fundusz Pracy est une charge).
  const healthIncomeY = revY - costsY - fpY - socialY;
  const healthY = b2bHealthYear(inp.form, revY, healthIncomeY);
  let taxBaseY = 0, taxY = 0, healthDedY = 0;
  if (inp.form === 'skala') {
    taxBaseY = r0(pos(revY - costsY - fpY - socialY));
    const low = Math.min(taxBaseY, T.threshold), high = pos(taxBaseY - T.threshold);
    taxY = r0(pos(low * T.rate_low + high * T.rate_high - T.tax_reducing_amount_year));
  } else if (inp.form === 'liniowy') {
    healthDedY = Math.min(healthY, P.b2b.health.liniowy_deduction_limit);
    taxBaseY = r0(pos(revY - costsY - fpY - socialY - healthDedY));
    taxY = r0(taxBaseY * P.b2b.liniowy_rate);
  } else {
    healthDedY = r2(healthY * P.b2b.health.ryczalt_deductible_share);
    taxBaseY = r0(pos(revY - socialY - healthDedY));
    taxY = r0(taxBaseY * (inp.ryczaltRate ?? P.b2b.ryczalt_rates[0].rate));
  }
  const netY = revY - costsY - socialY - fpY - healthY - taxY;
  return { revenue: inp.revenue, costs: costsY / 12, social: r2(socialY / 12), fp: r2(fpY / 12), health: r2(healthY / 12), healthDeducted: r2(healthDedY / 12), taxBase: r2(taxBaseY / 12), tax: r2(taxY / 12), net: r2(netY / 12), zus: z };
}

/* ------------------------------------------------------------------------- *
 * Wynagrodzenie chorobowe / zasiłek chorobowy
 * ------------------------------------------------------------------------- */
export interface SickInput { gross: number; days: number; rate?: number }
export function sickPay(inp: SickInput) {
  const S = P.sickness;
  // Base : brut moyen diminué des cotisations sociales du salarié (13,71 %), puis 1/30 par jour.
  const base = r2(inp.gross * (1 - S.base_reduction));
  const daily = r2((base / 30) * (inp.rate ?? S.rate_standard));
  const days = Math.max(0, Math.round(inp.days));
  const benefit = r2(daily * days);
  // Pas de cotisations sociales sur l'indemnité ; santé et PIT restent dus.
  const health = r2(benefit * P.health.employee_rate);
  const lostSalary = r2((inp.gross / 30) * days);
  return { base, daily, days, benefit, health, lostSalary };
}

/* ------------------------------------------------------------------------- *
 * Heures supplémentaires (Kodeks pracy art. 151^1)
 * ------------------------------------------------------------------------- */
export function overtime(inp: { gross: number; hoursInMonth: number; h50: number; h100: number }) {
  const hourly = inp.hoursInMonth > 0 ? inp.gross / inp.hoursInMonth : 0;
  const pay50 = r2(inp.h50 * hourly * (1 + P.overtime.supplement_50));
  const pay100 = r2(inp.h100 * hourly * (1 + P.overtime.supplement_100));
  return { hourly: r2(hourly), pay50, pay100, extra: r2(pay50 + pay100) };
}

/** Plafond annuel atteint : mois (1–12) où le cumul du brut dépasse le plafond, ou null. */
export function capMonth(grossMonthly: number): number | null {
  if (grossMonthly <= 0) return null;
  const m = Math.ceil(Z.annual_cap / grossMonthly);
  return m <= 12 && Z.annual_cap / grossMonthly < 12 ? m : null;
}
/** Premier mois imposé (en partie) à 32 %, pour un salaire constant, ou null. */
export function secondBracketMonth(inp: UopInput): number | null {
  const y = uopYear(inp);
  const m = y.months.find((x) => x.secondBracket);
  return m ? m.month : null;
}
