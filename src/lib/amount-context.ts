/** Contexte chiffré d'une page « par montant » : tout vient du moteur, formaté dans la langue. */
import { uop, uopYear, zlecenie, dzielo, b2b, capMonth, PARAMS as P } from './engine/pl';
import { formatMoney, pct } from './format';
import { facts, type Facts } from './facts';

const MONTHS = {
  pl: ['styczeń', 'luty', 'marzec', 'kwiecień', 'maj', 'czerwiec', 'lipiec', 'sierpień', 'wrzesień', 'październik', 'listopad', 'grudzień'],
  en: ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
};
export interface AmountCtx {
  F: Facts; lang: 'pl' | 'en'; amount: number;
  gross: string; net: string; social: string; health: string; pit: string; cost: string; erTotal: string;
  netYear: string; netDec: string; netJan: string; pitYear: string;
  bracketMonth: string | null; capMonth: string | null;
  zlecNet: string; dzieloNet: string; b2bLinNet: string; b2bRyczNet: string; b2bSkalaNet: string;
  netU26: string; netPpk: string; netRaised: string; netNoPit2: string;
  ratioMin: string; ratioAvg: string; netShare: string;
  raw: { net: number; netYear: number; cost: number; zlecNet: number; dzieloNet: number; b2bLinNet: number; b2bRyczNet: number };
  $: (x: number) => string;
}
export function amountCtx(amount: number, lang: 'pl' | 'en'): AmountCtx {
  const $ = (x: number) => formatMoney(x, 0, lang);
  const m = uop({ gross: amount }); const y = uopYear({ gross: amount });
  const bm = y.months.find((x) => x.secondBracket)?.month ?? null; const cm = capMonth(amount);
  const z = zlecenie({ gross: amount }), d = dzielo({ gross: amount });
  const bl = b2b({ revenue: amount, form: 'liniowy' }), br = b2b({ revenue: amount, form: 'ryczalt', ryczaltRate: P.b2b.ryczalt_rates[0].rate }), bs = b2b({ revenue: amount, form: 'skala' });
  return {
    F: facts(lang), lang, amount,
    gross: $(amount), net: $(m.net), social: $(m.social), health: $(m.health), pit: $(m.pit), cost: $(m.er.cost), erTotal: $(m.er.total),
    netYear: $(y.total.net), netDec: $(y.months[11].net), netJan: $(y.months[0].net), pitYear: $(y.total.pit),
    bracketMonth: bm ? MONTHS[lang][bm - 1] : null, capMonth: cm ? MONTHS[lang][cm - 1] : null,
    zlecNet: $(z.net), dzieloNet: $(d.net), b2bLinNet: $(bl.net), b2bRyczNet: $(br.net), b2bSkalaNet: $(bs.net),
    netU26: $(uop({ gross: amount, under26: true }).net), netPpk: $(uop({ gross: amount, ppk: true }).net), netRaised: $(uop({ gross: amount, kup: 'raised' }).net), netNoPit2: $(uop({ gross: amount, pit2: false }).net),
    ratioMin: pct(amount / P.minimum_wage.monthly - 1, lang), ratioAvg: pct(amount / P.average_wage.forecast_2026, lang), netShare: pct(m.net / amount, lang),
    raw: { net: m.net, netYear: y.total.net, cost: m.er.cost, zlecNet: z.net, dzieloNet: d.net, b2bLinNet: bl.net, b2bRyczNet: br.net },
    $,
  };
}
