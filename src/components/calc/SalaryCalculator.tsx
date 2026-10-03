/**
 * Calculateur principal : brut → net pour les quatre contrats polonais (umowa o pracę, zlecenie,
 * o dzieło, B2B), calculé par `lib/engine/pl.ts`. Premier rendu = valeurs par défaut du build
 * (RECETTE §17.5) ; les paramètres d'un lien partagé ne sont lus qu'après hydratation.
 */
import { useEffect, useMemo, useState } from 'react';
import NumberField from '../ui/NumberField';
import SelectField from '../ui/SelectField';
import Toggle from '../ui/Toggle';
import StackedBar from '../ui/StackedBar';
import { uop, uopYear, zlecenie, dzielo, b2b, PARAMS, type B2bForm, type B2bZus } from '../../lib/engine/pl';
import { formatMoney, pct } from '../../lib/format';
import { readParams, num, str, updateURL } from '../../lib/url-state';

export type Contract = 'uop' | 'zlecenie' | 'dzielo' | 'b2b';
interface Props { lang?: 'pl' | 'en'; contract?: Contract; defaultGross?: number; lockContract?: boolean; compact?: boolean; methodHref?: string }

const T = (l: string, pl: string, en: string) => (l === 'en' ? en : pl);
const Z = PARAMS.zus;
const YES = (l: string) => [{ value: '0', label: T(l, 'Nie', 'No') }, { value: '1', label: T(l, 'Tak', 'Yes') }];

export default function SalaryCalculator({ lang = 'pl', contract = 'uop', defaultGross = 8000, lockContract = false, compact = false, methodHref }: Props) {
  const l = lang;
  const $ = (x: number) => formatMoney(x, 0, l);
  const [c, setC] = useState<Contract>(contract);
  const [gross, setGross] = useState(defaultGross);
  const [costs, setCosts] = useState(0);
  const [kup, setKup] = useState('standard');
  const [pit2, setPit2] = useState('1');
  const [u26, setU26] = useState('0');
  const [ppk, setPpk] = useState('0');
  const [student, setStudent] = useState('0');
  const [sick, setSick] = useState('0');
  const [authors, setAuthors] = useState('0');
  const [form, setForm] = useState<B2bForm>('liniowy');
  const [rate, setRate] = useState(String(PARAMS.b2b.ryczalt_rates[0].rate));
  const [zus, setZus] = useState<B2bZus>('full');
  const [showYear, setShowYear] = useState(false);

  useEffect(() => {
    const u = readParams(window.location.search);
    if (!u.toString()) return;
    if (!lockContract) { const k = str(u, 'k', contract); if (['uop', 'zlecenie', 'dzielo', 'b2b'].includes(k)) setC(k as Contract); }
    setGross(num(u, 'b', defaultGross)); setCosts(num(u, 'c', 0));
    setKup(str(u, 'kup', 'standard')); setPit2(str(u, 'p2', '1')); setU26(str(u, 'u26', '0')); setPpk(str(u, 'ppk', '0'));
    setStudent(str(u, 'st', '0')); setSick(str(u, 'ch', '0')); setAuthors(str(u, 'a', '0'));
    const f = str(u, 'f', 'liniowy'); if (['skala', 'liniowy', 'ryczalt'].includes(f)) setForm(f as B2bForm);
    setRate(str(u, 'r', String(PARAMS.b2b.ryczalt_rates[0].rate)));
    const z = str(u, 'z', 'full'); if (['full', 'preferential', 'start'].includes(z)) setZus(z as B2bZus);
  }, []);
  useEffect(() => { updateURL({ k: lockContract ? undefined : c, b: gross, c: costs || undefined, kup, p2: pit2, u26, ppk, st: student, ch: sick, a: authors, f: form, r: rate, z: zus }); }, [c, gross, costs, kup, pit2, u26, ppk, student, sick, authors, form, rate, zus]);

  const res = useMemo(() => {
    if (c === 'uop') {
      const m = uop({ gross, kup: kup as 'standard' | 'raised', pit2: pit2 === '1', under26: u26 === '1', ppk: ppk === '1', authorsShare: authors === '1' ? 0.5 : 0 });
      return { net: m.net, rows: [[`${T(l, 'Emerytalna', 'Pension')} (${pct(Z.emerytalna_employee, l)})`, m.emerytalna], [`${T(l, 'Rentowa', 'Disability')} (${pct(Z.rentowa_employee, l)})`, m.rentowa], [`${T(l, 'Chorobowa', 'Sickness')} (${pct(Z.chorobowa_employee, l)})`, m.chorobowa], [`${T(l, 'Składka zdrowotna', 'Health contribution')} (${pct(PARAMS.health.employee_rate, l)})`, m.health], [T(l, 'Zaliczka na PIT', 'PIT advance'), m.pit], ...(m.ppkEmployee ? [[T(l, 'PPK (pracownik)', 'PPK (employee)'), m.ppkEmployee]] : [])] as Array<[string, number]>,
        social: m.social, health: m.health, tax: m.pit, other: m.ppkEmployee, cost: m.er.cost, costLabel: T(l, 'Koszt pracodawcy', 'Employer cost') };
    }
    if (c === 'zlecenie') {
      const z = zlecenie({ gross, student: student === '1', under26: u26 === '1', sickness: sick === '1', pit2: pit2 === '1', authorsShare: authors === '1' ? 0.5 : 0 });
      return { net: z.net, rows: [[T(l, 'Emerytalna', 'Pension'), z.emerytalna], [T(l, 'Rentowa', 'Disability'), z.rentowa], [T(l, 'Chorobowa (dobrowolna)', 'Sickness (voluntary)'), z.chorobowa], [T(l, 'Składka zdrowotna', 'Health contribution'), z.health], [z.flat ? `${T(l, 'Podatek zryczałtowany', 'Flat tax')} ${pct(PARAMS.pit.rate_low, l)}` : T(l, 'Zaliczka na PIT', 'PIT advance'), z.pit]] as Array<[string, number]>,
        social: z.social, health: z.health, tax: z.pit, other: 0, cost: z.employerCost, costLabel: T(l, 'Koszt zleceniodawcy', 'Cost to the client') };
    }
    if (c === 'dzielo') {
      const d = dzielo({ gross, authors: authors === '1', pit2: pit2 === '1' });
      return { net: d.net, rows: [[T(l, 'Koszty uzyskania przychodu', 'Deductible costs'), d.kup], [d.flat ? `${T(l, 'Podatek zryczałtowany', 'Flat tax')} ${pct(PARAMS.pit.rate_low, l)}` : T(l, 'Zaliczka na PIT', 'PIT advance'), d.pit]] as Array<[string, number]>,
        social: 0, health: 0, tax: d.pit, other: 0, cost: d.employerCost, costLabel: T(l, 'Koszt zamawiającego', 'Cost to the client') };
    }
    const b = b2b({ revenue: gross, costs, form, ryczaltRate: Number(rate), zus, sickness: sick === '1' });
    return { net: b.net, rows: [[T(l, 'Koszty firmy', 'Business costs'), b.costs], [T(l, 'ZUS społeczny', 'ZUS social'), b.social], [T(l, 'Fundusz Pracy', 'Labour Fund'), b.fp], [T(l, 'Składka zdrowotna', 'Health contribution'), b.health], [T(l, 'Podatek dochodowy', 'Income tax'), b.tax]] as Array<[string, number]>,
      social: b.social + b.fp, health: b.health, tax: b.tax, other: b.costs, cost: gross, costLabel: T(l, 'Faktura netto (bez VAT)', 'Invoice net of VAT') };
  }, [c, gross, costs, kup, pit2, u26, ppk, student, sick, authors, form, rate, zus, l]);

  const year = useMemo(() => (c === 'uop' && showYear ? uopYear({ gross, kup: kup as 'standard' | 'raised', pit2: pit2 === '1', under26: u26 === '1', ppk: ppk === '1', authorsShare: authors === '1' ? 0.5 : 0 }) : null), [c, showYear, gross, kup, pit2, u26, ppk, authors]);
  const others = useMemo(() => ({
    uop: uop({ gross, pit2: true }).net,
    zlecenie: zlecenie({ gross, pit2: true }).net,
    dzielo: dzielo({ gross, pit2: true }).net,
  }), [gross]);

  const tabs: Array<[Contract, string]> = [['uop', T(l, 'Umowa o pracę', 'Employment')], ['zlecenie', T(l, 'Zlecenie', 'Zlecenie')], ['dzielo', T(l, 'O dzieło', 'Dzieło')], ['b2b', 'B2B']];
  const grossLabel = c === 'b2b' ? T(l, 'Przychód miesięcznie (netto, bez VAT)', 'Monthly revenue (net of VAT)') : T(l, 'Wynagrodzenie brutto miesięcznie', 'Monthly gross pay');

  return (
    <div data-chrome data-calculator className="not-prose rounded-xl border border-navy-200 bg-white p-4 sm:p-6">
      {!lockContract && (
        <div role="tablist" aria-label={T(l, 'Rodzaj umowy', 'Contract type')} className="mb-5 grid grid-cols-2 gap-1 rounded-lg border border-navy-300 p-1 sm:grid-cols-4">
          {tabs.map(([k, label]) => <button key={k} type="button" role="tab" aria-selected={c === k} onClick={() => setC(k)} className={`h-11 rounded-md px-2 text-sm font-medium ${c === k ? 'bg-accent-700 text-white' : 'text-navy-700 hover:bg-navy-50'}`}>{label}</button>)}
        </div>
      )}
      <div className={`grid gap-6 ${compact ? '' : 'lg:grid-cols-2'}`}>
        <form className="grid grid-cols-1 gap-x-4 gap-y-3 sm:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <NumberField id="kw-gross" label={grossLabel} value={gross} onChange={setGross} unit="zł" max={2_000_000} lang={l} className="sm:col-span-2" />
          {c === 'uop' && <>
            <SelectField id="kw-kup" label={T(l, 'Koszty uzyskania przychodu', 'Deductible costs')} value={kup} onChange={setKup} options={[{ value: 'standard', label: `${formatMoney(PARAMS.pit.kup_employee_month, 0, l)} ${T(l, '(praca na miejscu)', '(local job)')}` }, { value: 'raised', label: `${formatMoney(PARAMS.pit.kup_employee_raised_month, 0, l)} ${T(l, '(dojazd z innej miejscowości)', '(commuting)')}` }]} />
            <Toggle id="kw-pit2" label={T(l, 'PIT-2 złożony?', 'PIT-2 filed?')} value={pit2} onChange={setPit2} options={YES(l)} />
            <Toggle id="kw-u26" label={T(l, 'Poniżej 26 lat?', 'Under 26?')} value={u26} onChange={setU26} options={YES(l)} />
            <Toggle id="kw-ppk" label={T(l, 'Uczestnik PPK?', 'In PPK?')} value={ppk} onChange={setPpk} options={YES(l)} />
            <Toggle id="kw-auth" label={T(l, 'Połowa pensji jako prawa autorskie?', 'Half the pay as copyright?')} value={authors} onChange={setAuthors} options={YES(l)} />
          </>}
          {c === 'zlecenie' && <>
            <Toggle id="kw-st" label={T(l, 'Student do 26 lat?', 'Student under 26?')} value={student} onChange={setStudent} options={YES(l)} />
            <Toggle id="kw-u26z" label={T(l, 'Poniżej 26 lat?', 'Under 26?')} value={u26} onChange={setU26} options={YES(l)} />
            <Toggle id="kw-ch" label={T(l, 'Dobrowolne chorobowe?', 'Voluntary sickness cover?')} value={sick} onChange={setSick} options={YES(l)} />
            <Toggle id="kw-pit2z" label={T(l, 'PIT-2 złożony?', 'PIT-2 filed?')} value={pit2} onChange={setPit2} options={YES(l)} />
          </>}
          {c === 'dzielo' && <>
            <Toggle id="kw-authd" label={T(l, 'Przeniesienie praw autorskich?', 'Copyright transfer?')} value={authors} onChange={setAuthors} options={YES(l)} />
            <Toggle id="kw-pit2d" label={T(l, 'PIT-2 złożony?', 'PIT-2 filed?')} value={pit2} onChange={setPit2} options={YES(l)} />
          </>}
          {c === 'b2b' && <>
            <SelectField id="kw-form" label={T(l, 'Forma opodatkowania', 'Tax regime')} value={form} onChange={(v) => setForm(v as B2bForm)} options={[{ value: 'liniowy', label: `${T(l, 'Podatek liniowy', 'Flat tax')} ${pct(PARAMS.b2b.liniowy_rate, l)}` }, { value: 'ryczalt', label: T(l, 'Ryczałt ewidencjonowany', 'Lump-sum tax (ryczałt)') }, { value: 'skala', label: `${T(l, 'Skala podatkowa', 'Tax scale')} ${pct(PARAMS.pit.rate_low, l)} / ${pct(PARAMS.pit.rate_high, l)}` }]} />
            {form === 'ryczalt'
              ? <SelectField id="kw-rate" label={T(l, 'Stawka ryczałtu', 'Ryczałt rate')} value={rate} onChange={setRate} options={PARAMS.b2b.ryczalt_rates.map((r) => ({ value: String(r.rate), label: `${pct(r.rate, l)} · ${l === 'en' ? r.label_en : r.label_pl}` }))} />
              : <NumberField id="kw-costs" label={T(l, 'Koszty firmy miesięcznie', 'Monthly business costs')} value={costs} onChange={setCosts} unit="zł" max={2_000_000} lang={l} />}
            <SelectField id="kw-zus" label={T(l, 'ZUS', 'ZUS')} value={zus} onChange={(v) => setZus(v as B2bZus)} options={[{ value: 'full', label: T(l, 'Pełny ZUS', 'Full ZUS') }, { value: 'preferential', label: T(l, 'Preferencyjny (mały ZUS)', 'Preferential (small ZUS)') }, { value: 'start', label: T(l, 'Ulga na start (tylko zdrowotna)', 'Start-up relief (health only)') }]} />
            <Toggle id="kw-chb" label={T(l, 'Dobrowolne chorobowe?', 'Voluntary sickness cover?')} value={sick} onChange={setSick} options={YES(l)} />
          </>}
        </form>
        <div aria-live="polite" className="rounded-lg bg-accent-50 p-4 sm:p-5">
          <p className="text-sm font-medium text-navy-700">{c === 'b2b' ? T(l, 'Na rękę miesięcznie (średnio w roku)', 'Take-home per month (yearly average)') : T(l, 'Wynagrodzenie netto (na rękę)', 'Net pay (take-home)')}</p>
          <p className="tabular-nums mt-1 text-4xl font-bold text-navy-900">{$(res.net)}</p>
          <StackedBar total={Math.max(res.net + res.social + res.health + res.tax + res.other, 1)} ariaPrefix={T(l, 'Podział', 'Split')} segments={[
            { label: T(l, 'Netto', 'Net'), value: res.net, color: '#15803d' },
            { label: 'ZUS', value: res.social, color: '#1e3a8a' },
            { label: T(l, 'Zdrowotna', 'Health'), value: res.health, color: '#0e7490' },
            { label: 'PIT', value: res.tax, color: '#b91c1c' },
            ...(res.other ? [{ label: c === 'b2b' ? T(l, 'Koszty', 'Costs') : 'PPK', value: res.other, color: '#a16207' }] : []),
          ]} />
          <table className="mt-4 w-full text-sm"><tbody className="divide-y divide-navy-200">
            {res.rows.filter(([, v]) => v > 0).map(([k, v]) => <tr key={k}><td className="py-1.5 pr-3 text-navy-700">{k}</td><td className="tabular-nums py-1.5 text-right text-navy-900">−{$(v)}</td></tr>)}
            <tr><td className="py-1.5 pr-3 font-medium text-navy-800">{res.costLabel}</td><td className="tabular-nums py-1.5 text-right font-medium text-navy-900">{$(res.cost)}</td></tr>
          </tbody></table>
          {c !== 'b2b' && <p className="mt-3 text-xs text-navy-600">{T(l, 'Ten sam brutto na innych umowach:', 'Same gross on other contracts:')} {T(l, 'o pracę', 'employment')} {$(others.uop)} · {T(l, 'zlecenie', 'zlecenie')} {$(others.zlecenie)} · {T(l, 'o dzieło', 'dzieło')} {$(others.dzielo)}</p>}
          {methodHref && <p className="mt-2 text-xs text-navy-600"><a className="font-medium text-accent-700 underline" href={methodHref}>{T(l, 'Jak liczymy (metodologia)', 'How we calculate (methodology)')}</a></p>}
        </div>
      </div>
      {c === 'uop' && !compact && (
        <div className="mt-5">
          <button type="button" onClick={() => setShowYear((s) => !s)} aria-expanded={showYear} className="text-sm font-medium text-accent-700 underline">{showYear ? T(l, 'Ukryj rozliczenie miesiąc po miesiącu', 'Hide the month-by-month breakdown') : T(l, 'Pokaż rok miesiąc po miesiącu (drugi próg i limit ZUS)', 'Show the year month by month (second bracket and ZUS cap)')}</button>
          {year && (
            <div className="mt-3 overflow-x-auto"><table className="w-full min-w-[560px] text-sm">
              <thead><tr className="border-b border-navy-300 text-left text-xs uppercase text-navy-600"><th scope="col" className="py-2">{T(l, 'Miesiąc', 'Month')}</th><th scope="col" className="py-2 text-right">ZUS</th><th scope="col" className="py-2 text-right">{T(l, 'Zdrowotna', 'Health')}</th><th scope="col" className="py-2 text-right">PIT</th><th scope="col" className="py-2 text-right">{T(l, 'Netto', 'Net')}</th></tr></thead>
              <tbody className="divide-y divide-navy-100">{year.months.map((m) => <tr key={m.month}><td className="py-1.5">{m.month}{m.secondBracket ? ` · ${pct(PARAMS.pit.rate_high, l)}` : ''}{m.capped ? T(l, ' · limit ZUS', ' · ZUS cap') : ''}</td><td className="tabular-nums py-1.5 text-right">{$(m.social)}</td><td className="tabular-nums py-1.5 text-right">{$(m.health)}</td><td className="tabular-nums py-1.5 text-right">{$(m.pit)}</td><td className="tabular-nums py-1.5 text-right font-medium">{$(m.net)}</td></tr>)}
                <tr className="border-t-2 border-navy-300 font-semibold"><td className="py-1.5">{T(l, 'Rok', 'Year')}</td><td className="tabular-nums py-1.5 text-right">{$(year.total.social)}</td><td className="tabular-nums py-1.5 text-right">{$(year.total.health)}</td><td className="tabular-nums py-1.5 text-right">{$(year.total.pit)}</td><td className="tabular-nums py-1.5 text-right">{$(year.total.net)}</td></tr></tbody>
            </table></div>
          )}
        </div>
      )}
      <p className="mt-4 text-xs text-navy-600">{T(l, 'Stawki 2026 z ZUS i ustawy o PIT · obliczenia w Twojej przeglądarce, nic nie jest wysyłane.', '2026 rates from ZUS and the PIT Act · calculated in your browser, nothing is sent.')}</p>
    </div>
  );
}
