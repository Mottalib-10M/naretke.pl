/**
 * Valeurs citables dans les textes, toujours tirées des paramètres ou du moteur et formatées dans la
 * langue de la page (RECETTE §4, §17.4) : une page n'écrit jamais « 4 806 zł » en dur, elle écrit
 * {F.minWage}. `facts(lang)` rend des chaînes prêtes à insérer.
 */
import { PARAMS as P, uop } from './engine/pl';
import { formatMoney, formatDecimal, pct } from './format';

export function facts(lang: 'pl' | 'en') {
  const m = (x: number, d = 0) => formatMoney(x, d, lang);
  const minNet = uop({ gross: P.minimum_wage.monthly }).net;
  return {
    year: P.year,
    retrieved: P.retrieved_at,
    minWage: m(P.minimum_wage.monthly),
    minHourly: m(P.minimum_wage.hourly, 2),
    minNet: m(minNet),
    avgForecast: m(P.average_wage.forecast_2026),
    avgQ4: m(P.average_wage.q4_2025_with_profits, 2),
    cap: m(P.zus.annual_cap),
    capMonthly: m(P.zus.annual_cap / 12),
    emerytalnaEe: pct(P.zus.emerytalna_employee, lang), emerytalnaEr: pct(P.zus.emerytalna_employer, lang), emerytalnaTotal: pct(P.zus.emerytalna_employee + P.zus.emerytalna_employer, lang),
    rentowaEe: pct(P.zus.rentowa_employee, lang), rentowaEr: pct(P.zus.rentowa_employer, lang), rentowaTotal: pct(P.zus.rentowa_employee + P.zus.rentowa_employer, lang),
    chorobowa: pct(P.zus.chorobowa_employee, lang),
    socialEe: pct(P.zus.emerytalna_employee + P.zus.rentowa_employee + P.zus.chorobowa_employee, lang),
    wypadkowa: pct(P.zus.wypadkowa_basic, lang), wypadkowaMin: pct(P.zus.wypadkowa_min, lang), wypadkowaMax: pct(P.zus.wypadkowa_max, lang),
    fp: pct(P.zus.fp, lang), fs: pct(P.zus.fs, lang), fpfs: pct(P.zus.fp + P.zus.fs, lang), fgsp: pct(P.zus.fgsp, lang),
    health: pct(P.health.employee_rate, lang),
    pitLow: pct(P.pit.rate_low, lang), pitHigh: pct(P.pit.rate_high, lang), threshold: m(P.pit.threshold),
    freeAmount: m(P.pit.free_amount), reducingYear: m(P.pit.tax_reducing_amount_year), reducingMonth: m(P.pit.tax_reducing_amount_year / 12),
    kup: m(P.pit.kup_employee_month), kupYear: m(P.pit.kup_employee_year), kupRaised: m(P.pit.kup_employee_raised_month), kupRaisedYear: m(P.pit.kup_employee_raised_year),
    kupMulti: m(P.pit.kup_multi_year), kupMultiRaised: m(P.pit.kup_multi_raised_year),
    kupContract: pct(P.pit.kup_contract_rate, lang), kupAuthors: pct(P.pit.kup_authors_rate, lang), kupAuthorsLimit: m(P.pit.kup_authors_limit),
    smallContract: m(P.pit.flat_small_contract_limit), youthLimit: m(P.pit.youth_exempt_limit),
    solidarity: pct(P.pit.solidarity_rate, lang), solidarityThreshold: m(P.pit.solidarity_threshold),
    ppkEe: pct(P.ppk.employee_basic, lang), ppkEeMin: pct(P.ppk.employee_min, lang), ppkEeExtra: pct(P.ppk.employee_extra_max, lang), ppkEr: pct(P.ppk.employer_basic, lang), ppkErExtra: pct(P.ppk.employer_extra_max, lang),
    ppkLowIncome: m(P.ppk.low_income_multiple * P.minimum_wage.monthly, 2), ppkWelcome: m(P.ppk.state_welcome), ppkAnnual: m(P.ppk.state_annual),
    b2bBaseFull: m(P.b2b.zus_base_full), b2bBasePref: m(P.b2b.zus_base_preferential, 2),
    b2bZusFull: m(P.b2b.zus_month_full, 2), b2bZusFullNoSick: m(P.b2b.zus_month_full_no_sickness, 2),
    b2bZusPref: m(P.b2b.zus_month_preferential, 2), b2bZusPrefNoSick: m(P.b2b.zus_month_preferential_no_sickness, 2),
    liniowy: pct(P.b2b.liniowy_rate, lang), healthLiniowy: pct(P.b2b.health.liniowy_rate, lang), healthMin: m(P.b2b.health.minimum_monthly, 2), healthMinJan: m(P.b2b.health.minimum_monthly_january, 2),
    liniowyLimit: m(P.b2b.health.liniowy_deduction_limit),
    ryczaltBand1: m(P.b2b.health.ryczalt_bands[0].monthly, 2), ryczaltBand2: m(P.b2b.health.ryczalt_bands[1].monthly, 2), ryczaltBand3: m(P.b2b.health.ryczalt_bands[2].monthly, 2),
    ryczaltLimit1: m(P.b2b.health.ryczalt_bands[0].revenue_up_to), ryczaltLimit2: m(P.b2b.health.ryczalt_bands[1].revenue_up_to),
    sickRate: pct(P.sickness.rate_standard, lang), sickReduction: pct(P.sickness.base_reduction, lang), sickDays: String(P.sickness.employer_days), sickDays50: String(P.sickness.employer_days_50plus),
    ot50: pct(P.overtime.supplement_50, lang), ot100: pct(P.overtime.supplement_100, lang),
    dec: (x: number, d = 2) => formatDecimal(x, d, lang),
    money: m,
  };
}
export type Facts = ReturnType<typeof facts>;
/** Source officielle du fichier de paramètres, prête pour la liste « Źródła / Sources ». */
export function src(key: keyof typeof P.sources, lang: 'pl' | 'en') { const s = P.sources[key]; return { name: s.label[lang], url: s.url }; }
