/** Angles des pages « PLN X gross to net » en anglais (RECETTE §6.2) : un seuil propre par montant, écrit pour
 *  un expatrié qui compare une offre en złoty brut. Toutes les valeurs viennent du moteur (§6.4). */
import type { AngleFn } from './amount-types';
import { uop, uopYear, zlecenie, b2b, sickPay, PARAMS as P } from './engine/pl';
import { pct } from './format';
import { route, AMOUNTS } from '../i18n/routes';

const MON = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
const RY = P.b2b.ryczalt_rates[0].rate;
const PPK_LOW = P.ppk.low_income_multiple * P.minimum_wage.monthly;
const bracketNo = (months: Array<{ secondBracket: boolean; month: number }>) => months.find((m) => m.secondBracket)?.month ?? null;
const ryczNet = (revenue: number) => b2b({ revenue, form: 'ryczalt', ryczaltRate: RY }).net;
const linNet = (revenue: number) => b2b({ revenue, form: 'liniowy' }).net;

/* ------------------------------------------------------------------ 5000 */
const a5000: AngleFn = (c) => {
  const { F, $ } = c;
  const minNet = uop({ gross: P.minimum_wage.monthly }).net;
  const grossGap = c.amount - P.minimum_wage.monthly, netGap = c.raw.net - minNet;
  const ppkMin = uop({ gross: c.amount, ppk: true, ppkEmployeeRate: P.ppk.employee_min }).net;
  const lowPpk = c.amount <= PPK_LOW;
  const youthAll = c.amount * 12 <= P.pit.youth_exempt_limit;
  const youthYear = uopYear({ gross: c.amount, under26: true }).total.net;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net} Take-Home Pay`,
    description: `${c.gross} gross pays ${c.net} net a month in Poland in ${F.year}, only ${$(netGap)} above the minimum wage take-home. PIT-2, PPK and the under-26 relief explained.`,
    h1: `${c.gross} gross to net in Poland (${F.year})`,
    intro: `On a standard employment contract with a PIT-2 form filed, ${c.gross} gross leaves you ${c.net} a month.`,
    resume: `A monthly salary of ${c.gross} gross on a Polish employment contract (umowa o pracę) pays ${c.net} net in ${F.year}, assuming you have filed the PIT-2 form with your employer and live in the town where you work. That is just ${c.ratioMin} above the national minimum wage of ${F.minWage}, and only ${$(netGap)} more in your pocket than the minimum wage take-home of ${F.minNet}. From the gross amount your employer withholds ${c.social} in social security (ZUS), ${c.health} in health insurance and ${c.pit} as an income tax advance. Because the tax line is so small, two paperwork choices matter a lot here: without PIT-2 your pay drops to ${c.netNoPit2}, while an employee under 26 using the youth relief takes home ${c.netU26}. Over twelve months the job pays ${c.netYear}, and it costs the employer ${c.cost} a month once its own contributions are added.`,
    sections: [
      {
        h2: 'Just above the minimum wage: what the gap is worth',
        html: `<p>If you are weighing an offer of ${c.gross} against a minimum wage job, the gross difference is ${$(grossGap)}, but the net difference is ${$(netGap)}. Every extra złoty of gross is shared with ZUS (pension, disability and sickness insurance), the ${F.health} health contribution and the ${F.pitLow} tax rate. Keep that ratio in mind when a recruiter quotes a small raise: what lands on your payslip (pasek wypłaty) is clearly less.</p>
<p>The employer sees the same salary as a higher number: ${c.cost}, because it pays its own share of pension and disability insurance, accident insurance, the Labour Fund with the Solidarity Fund, and the guaranteed benefits fund. The <a href="${route('employer', 'en')}">employer cost calculator</a> breaks it down.</p>`,
      },
      {
        h2: 'PIT-2 and the under-26 relief on a modest salary',
        html: `<p>The PIT-2 form tells your employer to deduct ${F.reducingMonth} a month from your tax advance, which is the monthly share of the ${F.reducingYear} tax-reducing amount. Newcomers to Poland often miss it because HR does not always ask for it. Without it you receive ${c.netNoPit2} each month and get the difference back only after filing the annual return. See the <a href="${route('pit2', 'en')}">PIT-2 form guide</a>.</p>
<p>If you are under 26, the youth relief (ulga dla młodych) exempts up to ${F.youthLimit} of income a year from PIT, whatever your nationality, as long as you are taxed in Poland. Your pay rises to ${c.netU26}; ZUS and health are still deducted. ${youthAll ? `At ${c.gross} a month you stay under the cap all year, for ${$(youthYear)} net in total.` : `The cap runs out before December.`} Details: <a href="${route('youth', 'en')}">youth tax relief</a>.</p>`,
      },
      {
        h2: `PPK pension savings: the ${F.ppkEeMin} option`,
        html: `<p>Most employers enrol staff in PPK, the workplace pension scheme. The default employee contribution is ${F.ppkEe}, which brings your pay to ${c.netPpk}. When your monthly pay from all sources does not exceed ${F.ppkLowIncome} (1.2 times the minimum wage), you may lower it to as little as ${F.ppkEeMin}. ${lowPpk ? `${c.gross} is under that line, so with a single job you could take home ${$(ppkMin)} instead.` : `${c.gross} is above that line.`} The employer still pays its ${F.ppkEr}. Try other rates in the <a href="${route('ppk', 'en')}">PPK calculator</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Is ${c.gross} gross a decent salary in Poland?`, a: `It is ${c.ratioMin} above the ${F.minWage} minimum wage and ${c.ratioAvg} of the ${F.avgForecast} forecast national average, so it sits in the lower part of the pay scale. The take-home is ${c.net} a month with PIT-2. Whether it covers your costs depends heavily on the city and on rent, which this calculator does not include.` },
      { q: `How much does skipping PIT-2 cost me on ${c.gross} gross?`, a: `${F.reducingMonth} a month: you would receive ${c.netNoPit2} instead of ${c.net}. The money is not lost, it comes back as a refund after the annual tax return, but you wait up to a year for it. Filing PIT-2 once with your employer is enough, it stays valid until you withdraw it.` },
      { q: `I am 24 and offered ${c.gross} gross. What do I take home?`, a: `With the youth relief, ${c.netU26} a month, because no income tax advance is withheld. ZUS (${c.social}) and health (${c.health}) are still deducted. ${youthAll ? `Your annual income stays below ${F.youthLimit}, so the relief applies every month.` : `Once income passes ${F.youthLimit}, tax returns.`} It ends on your 26th birthday.` },
      { q: `Can I pay only ${F.ppkEeMin} into PPK on ${c.gross} gross?`, a: `${lowPpk ? `Yes, if your total monthly pay from all sources does not exceed ${F.ppkLowIncome}. Your take-home would then be ${$(ppkMin)} rather than ${c.netPpk} at the standard ${F.ppkEe}.` : `No, because ${c.gross} exceeds ${F.ppkLowIncome}.`} You request the lower rate in writing; the employer's ${F.ppkEr} does not change.` },
    ],
  };
};

/* ------------------------------------------------------------------ 6000 */
const a6000: AngleFn = (c) => {
  const { F, $ } = c;
  const over = c.amount > PPK_LOW;
  const m = uop({ gross: c.amount });
  const mp = uop({ gross: c.amount, ppk: true });
  const raisedGain = uop({ gross: c.amount, kup: 'raised' }).net - c.raw.net;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net}, PPK and Commuting`,
    description: `${c.gross} gross gives ${c.net} net in ${F.year}, or ${c.netPpk} with PPK. Why the ${F.ppkEeMin} PPK option is gone, what commuter costs add and how to read the payslip.`,
    h1: `${c.gross} gross: take-home pay in ${F.year}`,
    intro: `An employment contract at ${c.gross} gross pays ${c.net} net a month with PIT-2 and standard costs.`,
    resume: `At ${c.gross} gross a month on an employment contract you take home ${c.net} in ${F.year}, with the PIT-2 form filed and the standard ${F.kup} employee costs. The salary is ${c.ratioMin} above the minimum wage, and it crosses a line that matters if you are enrolled in PPK, the workplace pension scheme: ${F.ppkLowIncome}, or 1.2 times the minimum wage. ${over ? `Since ${c.gross} is above it, you can no longer cut your own contribution below ${F.ppkEe}, and staying in the scheme reduces your pay to ${c.netPpk}.` : `You are under it, so a reduced contribution is possible.`} If you commute from another town, higher employee costs of ${F.kupRaised} lift your pay to ${c.netRaised}, a gain of only ${$(raisedGain)}. Over a year the job pays ${c.netYear}. The same gross on a mandate contract (umowa zlecenie), without PIT-2 filed with the client, would pay ${c.zlecNet}, and the employer spends ${c.cost} a month on your position.`,
    sections: [
      {
        h2: 'The PPK low-income line, just crossed',
        html: `<p>The PPK act lets a participant lower the basic contribution to ${F.ppkEeMin} only when pay from all sources stays at or below ${F.ppkLowIncome} a month. ${over ? `${c.gross} is ${$(c.amount - PPK_LOW)} above it, so the payroll must take the full ${F.ppkEe}, which is ${$(c.amount * P.ppk.employee_basic)} a month. Among the salaries we cover, this is the first where the reduced rate is off the table.` : ''}</p>
<p>You can stay in and collect the extras, or sign an opt-out declaration. Staying in adds the employer's ${F.ppkEr} (${$(mp.ppkEmployer)} a month), plus a ${F.ppkWelcome} welcome payment and ${F.ppkAnnual} a year from the state. Expats who plan to leave Poland should read the scheme's rules on withdrawals before deciding. Numbers for other rates: <a href="${route('ppk', 'en')}">PPK calculator</a>.</p>`,
      },
      {
        h2: 'Commuter costs: a free but tiny gain',
        html: `<p>Employees who live outside the town where their workplace is located can claim raised deductible costs of ${F.kupRaised} instead of ${F.kup} a month. The extra cost is taxed away at ${F.pitLow}, so the effect on your pay is ${$(raisedGain)} a month, around ${$(raisedGain * 12)} a year. It is not a travel allowance and no money is paid out; it just lowers your taxable base. You only need to give HR a short statement. More in the guide to <a href="${route('kup', 'en')}">deductible employment costs</a>.</p>`,
      },
      {
        h2: `Reading a ${c.gross} payslip line by line`,
        html: `<p>A Polish payslip lists social contributions first: pension (emerytalna) ${$(m.emerytalna)} at ${F.emerytalnaEe}, disability (rentowa) ${$(m.rentowa)} at ${F.rentowaEe} and sickness (chorobowa) ${$(m.chorobowa)} at ${F.chorobowa}, for ${c.social} in total. Health insurance of ${c.health} is calculated on gross minus those contributions and is not tax-deductible. The taxable base is ${$(m.taxBase)}, and the tax advance (zaliczka na PIT) after the ${F.reducingMonth} PIT-2 reduction is ${c.pit}.</p>
<p>If your tax line is ${F.reducingMonth} higher than that, HR probably has no PIT-2 from you. A separate PPK line means the pension deduction is on.</p>`,
      },
    ],
    faqs: [
      { q: `Why can't I lower my PPK contribution on ${c.gross} gross?`, a: `${over ? `The reduced rate, from ${F.ppkEeMin}, is only open to people earning no more than ${F.ppkLowIncome} a month in total, and ${c.gross} is ${$(c.amount - PPK_LOW)} above that.` : `You can, because ${c.gross} is under ${F.ppkLowIncome}.`} Your choice is the full ${F.ppkEe}, which leaves ${c.netPpk} net, or opting out of the scheme altogether with a written declaration.` },
      { q: `I commute from another town. How much more do I get on ${c.gross}?`, a: `${$(raisedGain)} a month, so ${c.netRaised} instead of ${c.net}, roughly ${$(raisedGain * 12)} over a year. The deductible costs rise from ${F.kup} to ${F.kupRaised}, but you only save the ${F.pitLow} tax on the difference. You qualify if you live outside the town of your workplace and tell your employer in writing.` },
      { q: `What does PPK actually take from a ${c.gross} salary?`, a: `Your own ${F.ppkEe} is ${$(c.amount * P.ppk.employee_basic)} a month. Our calculator also treats the employer's contribution as taxable income, so the total drop is ${$(c.raw.net - mp.net)}: from ${c.net} to ${c.netPpk}. In return, ${$(mp.ppkEmployer)} a month from the employer and the state top-ups go into your PPK account.` },
      { q: `How much does a ${c.gross} job with PPK cost the employer?`, a: `${$(mp.er.cost)} a month, against ${c.cost} without PPK. The employer adds its pension and disability share, accident insurance, the Labour Fund with the Solidarity Fund, the guaranteed benefits fund, and with PPK another ${F.ppkEr} of your gross. Useful to know when you negotiate the package rather than the salary alone.` },
    ],
  };
};

/* ------------------------------------------------------------------ 7000 */
const a7000: AngleFn = (c) => {
  const { F, $ } = c;
  const zPit2 = zlecenie({ gross: c.amount, pit2: true }).net;
  const zSick = zlecenie({ gross: c.amount, sickness: true }).net;
  const zBoth = zlecenie({ gross: c.amount, pit2: true, sickness: true }).net;
  const zCost = zlecenie({ gross: c.amount }).employerCost;
  const sick = sickPay({ gross: c.amount, days: 10 });
  const diff = c.raw.net - c.raw.zlecNet;
  return {
    title: `${c.gross} Gross to Net ${F.year}: Employment or Mandate Contract`,
    description: `${c.gross} gross pays ${c.net} on an employment contract and ${c.zlecNet} on umowa zlecenie in ${F.year}. PIT-2, voluntary sickness cover and what the net hides.`,
    h1: `${c.gross} gross: employment contract or zlecenie?`,
    intro: `At ${c.gross} gross an employment contract pays ${c.net} net and a mandate contract ${c.zlecNet}.`,
    resume: `${c.gross} gross on a Polish employment contract (umowa o pracę) pays ${c.net} net in ${F.year}, with PIT-2 filed and standard costs. Many offers at this level come instead as a mandate contract (umowa zlecenie), a civil-law contract common for contractors and agencies. Without PIT-2 and without voluntary sickness insurance it pays ${c.zlecNet}, ${diff >= 0 ? `${$(diff)} less` : `${$(-diff)} more`} than the job. The gap is small because a mandate worker does not pay the sickness contribution and deducts ${F.kupContract} of income after ZUS as costs rather than a flat ${F.kup}. With PIT-2 filed with the client, the mandate pays ${$(zPit2)}; adding voluntary sickness insurance brings it to ${$(zBoth)}. What the net figure leaves out is paid holiday, employer sick pay and a notice period, which only the employment contract gives you. The client pays ${$(zCost)} for the mandate and an employer ${c.cost} for the job.`,
    sections: [
      {
        h2: `The two contracts side by side at ${c.gross}`,
        html: `<ul>
<li><strong>Employment contract:</strong> ${c.net}, sickness insurance (${F.chorobowa}) included.</li>
<li><strong>Mandate, no PIT-2, no sickness cover:</strong> ${c.zlecNet}.</li>
<li><strong>Mandate with PIT-2:</strong> ${$(zPit2)}.</li>
<li><strong>Mandate with PIT-2 and voluntary sickness insurance:</strong> ${$(zBoth)}.</li>
</ul>
<p>${zBoth < c.raw.net ? 'With comparable protection, the mandate comes out slightly behind.' : 'Even with comparable protection the mandate pays a little more here, but without employee rights.'} If you already have a job that applies PIT-2, the ${F.reducingMonth} reduction has to be split between payers or kept with one of them. Run your own figures in the <a href="${route('zlecenie', 'en')}">mandate contract calculator</a>, or compare with a specific-work contract on <a href="${route('zlecdzielo', 'en')}">mandate vs specific-work contract</a>.</p>`,
      },
      {
        h2: 'Voluntary sickness insurance on a mandate',
        html: `<p>On a mandate the ${F.chorobowa} sickness contribution is optional: you join on request. At ${c.gross} it costs ${$(c.raw.zlecNet - zSick)} a month in net pay. Without it there is no sickness benefit from ZUS if you fall ill, and most mandates only pay for work actually done.</p>
<p>Employees pay the contribution automatically, and for up to ${F.sickDays} days of illness a year the employer pays ${F.sickRate} of salary. On ${c.gross} that is ${$(sick.daily)} gross per day, so ten days off sick bring ${$(sick.benefit)} instead of ${$(sick.lostSalary)}. Check other cases in the <a href="${route('sick', 'en')}">sick pay calculator</a>.</p>`,
      },
      {
        h2: 'What a mandate offer at this level does not show',
        html: `<p>An employment contract comes with paid annual leave, a notice period and Labour Code protection. A mandate pays for agreed hours or tasks, with a statutory floor of ${F.minHourly} gross per hour. If a mandate is meant to replace a ${c.gross} job, ask whether the rate accounts for days off, and convert it into an hourly figure before you compare.</p>`,
      },
    ],
    faqs: [
      { q: `Does a mandate contract at ${c.gross} pay more than a job?`, a: `It depends on your declarations. With no PIT-2 and no sickness cover the mandate pays ${c.zlecNet} against ${c.net} on a job. If the client applies PIT-2, the mandate rises to ${$(zPit2)}, ${zPit2 > c.raw.net ? 'which beats the job' : 'still below the job'}. The job, however, adds paid leave, employer sick pay and a notice period.` },
      { q: `What does voluntary sickness insurance cost on a ${c.gross} mandate?`, a: `${F.chorobowa} of the gross, which lowers your net by ${$(c.raw.zlecNet - zSick)} a month, from ${c.zlecNet} to ${$(zSick)} without PIT-2. Part of it comes back through lower tax, since the contribution reduces the taxable base. In exchange you become eligible for sickness benefit from ZUS, which a mandate worker without it does not get.` },
      { q: `How much sick pay would I get on a ${c.gross} employment contract?`, a: `The base is your salary minus ${F.sickReduction} of social contributions, paid at ${F.sickRate}: ${$(sick.daily)} gross per day. Ten days of sick leave pay ${$(sick.benefit)} instead of ${$(sick.lostSalary)}. No social contributions are taken from sick pay, but health insurance and the tax advance still are.` },
      { q: 'Can I file PIT-2 with a client who pays me under a mandate?', a: `Yes. Since 2022 the PIT-2 statement also covers mandate contracts, so the client deducts ${F.reducingMonth} from your tax advance and your net rises from ${c.zlecNet} to ${$(zPit2)}. The reduction can be used by one payer or split between two or three, so with a parallel job you need to choose.` },
    ],
  };
};

/* ------------------------------------------------------------------ 8000 */
const a8000: AngleFn = (c) => {
  const { F, $ } = c;
  const rCost = ryczNet(c.raw.cost), lCost = linNet(c.raw.cost);
  const prev = AMOUNTS[AMOUNTS.indexOf(c.amount as (typeof AMOUNTS)[number]) - 1] ?? c.amount;
  const firstHere = rCost > c.raw.net && ryczNet(uop({ gross: prev }).er.cost) <= uop({ gross: prev }).net;
  let parity = Math.ceil(c.raw.net / 10) * 10; while (ryczNet(parity) < c.raw.net) parity += 10;
  const band2 = c.raw.cost * 12 > P.b2b.health.ryczalt_bands[0].revenue_up_to;
  return {
    title: `${c.gross} Gross to Net ${F.year}: Payroll Salary or B2B Invoice`,
    description: `A ${c.gross} gross job pays ${c.net} net in ${F.year}. Invoicing ${c.cost}, the employer's full cost, leaves ${$(rCost)} on the IT lump-sum tax. Full comparison here.`,
    h1: `${c.gross} gross: employment vs B2B in ${F.year}`,
    intro: `On an employment contract ${c.gross} gross pays ${c.net} net, and the employer spends ${c.cost} on the role.`,
    resume: `${c.gross} gross on an employment contract pays ${c.net} net a month in ${F.year} and costs the employer ${c.cost}. Around this salary, especially in IT, recruiters start offering B2B instead: you register a sole proprietorship (jednoosobowa działalność gospodarcza) and invoice the client. The classic mistake is to accept an invoice equal to the gross salary. Invoicing ${c.gross} net of VAT leaves only ${c.b2bRyczNet} on the ${pct(RY, 'en')} lump-sum tax (ryczałt) for IT, because you pay full ZUS of ${F.b2bZusFull} and a flat health contribution yourself. The fair benchmark is an invoice equal to the employer's cost: then the lump sum leaves ${$(rCost)} and the flat tax ${$(lCost)}, ${rCost > c.raw.net ? 'both above the salaried take-home' : 'still below the salaried take-home'}. ${firstHere ? 'Among the salaries we cover, this is the first where B2B at that invoice beats the job.' : ''} To merely match ${c.net}, you need to invoice about ${$(parity)}. None of this includes paid leave or sick pay.`,
    sections: [
      {
        h2: 'Why an invoice of the same number is a pay cut',
        html: `<p>Gross salary is only part of what an employer spends. On top of ${c.gross} it pays ${c.erTotal} in its own contributions, so the role costs ${c.cost}. A B2B client pays none of that, which is why B2B rates are usually negotiated from the total cost, not from gross.</p>
<p>If someone proposes invoicing ${c.gross}, your income actually falls: from ${c.net} to ${c.b2bRyczNet} on the IT lump sum, because the invoice must cover full social contributions, health and tax. Start-up relief and the income-based small ZUS change this in the first years of business; see <a href="${route('zusb2b', 'en')}">ZUS for the self-employed</a>.</p>`,
      },
      {
        h2: `The ${pct(RY, 'en')} lump sum at an invoice equal to the employer's cost`,
        html: `<p>Invoicing ${c.cost} a month means annual revenue ${band2 ? `above ${F.ryczaltLimit1}, so the lump-sum health contribution is ${F.ryczaltBand2} a month` : `under ${F.ryczaltLimit1}, so the lump-sum health contribution is ${F.ryczaltBand1} a month`}. The lump sum is charged on revenue with no costs, which usually suits someone working from home on their own laptop. The ${F.liniowy} flat tax (liniowy) adds a ${F.healthLiniowy} health contribution on profit, but business costs reduce the tax.</p>
<p>${rCost > lCost ? `With no costs, the lump sum leaves ${$(rCost)} and the flat tax ${$(lCost)}.` : `With no costs, the flat tax leaves ${$(lCost)} and the lump sum ${$(rCost)}.`} The ${pct(RY, 'en')} rate applies to software work; other services have other rates. Try yours in the <a href="${route('b2b', 'en')}">B2B calculator</a>.</p>`,
      },
      {
        h2: 'What you give up when you switch to invoicing',
        html: `<p>On B2B there is no paid holiday and no employer sick pay: a week off is a week without an invoice. ZUS sickness benefit is only available with the voluntary sickness contribution, already included in the ${F.b2bZusFull} figure. Add an accountant, VAT filings and the end of Labour Code protection. A wider comparison is on <a href="${route('compare', 'en')}">B2B vs employment contract</a>.</p>`,
      },
    ],
    faqs: [
      { q: `What B2B invoice matches a ${c.gross} gross salary?`, a: `About ${$(parity)} a month net of VAT on the ${pct(RY, 'en')} IT lump sum, with full ZUS and no start-up relief, leaves the same ${c.net} as the job. That still excludes paid leave and sick days, so build in a margin. Since the employer spends ${c.cost} on the role, an invoice near that figure is a reasonable ask.` },
      { q: `What is left from a ${c.gross} invoice on the IT lump-sum tax?`, a: `${c.b2bRyczNet} a month, after full ZUS of ${F.b2bZusFull} including voluntary sickness cover, the flat health contribution and the ${pct(RY, 'en')} tax. That is less than ${c.net} from a job at the same gross, because a business owner pays contributions that an employer would otherwise share. Start-up or reduced ZUS improves the result.` },
      { q: `Lump sum or flat tax for an invoice worth a ${c.gross} job?`, a: `At an invoice of ${c.cost} with no business costs, ${rCost > lCost ? `the lump sum leaves ${$(rCost)} and the flat tax ${$(lCost)}` : `the flat tax leaves ${$(lCost)} and the lump sum ${$(rCost)}`}. The flat tax pulls ahead once you have real costs such as car leasing, equipment or an office, which the lump sum ignores. Your service category sets the lump-sum rate.` },
      { q: `What does a ${c.gross} gross job cost a Polish employer?`, a: `${c.cost} a month: the ${c.gross} salary plus ${c.erTotal} in employer contributions (pension, disability, accident insurance at ${F.wypadkowa}, Labour and Solidarity Funds at ${F.fpfs} and the guaranteed benefits fund at ${F.fgsp}), without PPK. That figure, not gross, is the right starting point for a B2B rate.` },
    ],
  };
};

/* ------------------------------------------------------------------ 9000 */
const a9000: AngleFn = (c) => {
  const { F, $ } = c;
  const avg = P.average_wage.forecast_2026;
  const avgNet = uop({ gross: avg }).net;
  const below = c.amount < avg;
  const yY = uopYear({ gross: c.amount, under26: true });
  const end = yY.months.find((m) => m.exempt < m.gross)?.month ?? null;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net}, Near the Average`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}, ${c.ratioAvg} of the ${F.avgForecast} forecast average wage. What "earning the national average" means for you in Poland.`,
    h1: `${c.gross} gross and the Polish average wage`,
    intro: `A job at ${c.gross} gross pays ${c.net} net, close to what Poland calls the average salary.`,
    resume: `At ${c.gross} gross on an employment contract you take home ${c.net} a month in ${F.year}, with PIT-2 and standard costs. That is ${c.ratioAvg} of the forecast average wage for ${F.year}, set at ${F.avgForecast} in the budget act and the official notice in Monitor Polski. ${below ? `You are ${$(avg - c.amount)} gross short of it; the average itself pays ${$(avgNet)} net.` : 'You are above it.'} The statistics office GUS reported ${F.avgQ4} for the fourth quarter of 2025, including profit-sharing payouts. So when Poles say someone "earns the national average" (średnia krajowa), they mean roughly this salary. Bear in mind it is an arithmetic mean pulled up by top earners, not what a typical worker gets. The forecast figure also drives two rules that affect expats: the minimum ZUS base for the self-employed and the yearly pension contribution cap. Over twelve months ${c.gross} pays ${c.netYear} net.`,
    sections: [
      {
        h2: 'Which "average" is everyone quoting?',
        html: `<p>You will see two different numbers in Polish media and job ads. One is the quarterly GUS figure (${F.avgQ4} for Q4 2025); the other is the forecast written into the budget act (${F.avgForecast} for ${F.year}). Both are means, so a minority of very high salaries lifts them, and they say little about the person in the middle of the distribution. An offer of ${c.gross} is solid, even if it does not put you above half the workforce.</p>
<p>The averages are gross figures. When you compare a Polish offer with one from home, compare net: ${c.net} here against ${$(avgNet)} at the forecast average. More context in the <a href="${route('average', 'en')}">average salary in Poland</a> guide.</p>`,
      },
      {
        h2: 'Where the official average is actually used',
        html: `<ul>
<li><strong>Self-employed ZUS:</strong> the minimum contribution base is 60 % of the forecast, ${F.b2bBaseFull}, or ${F.b2bZusFull} of contributions a month (<a href="${route('zusb2b', 'en')}">ZUS for the self-employed</a>).</li>
<li><strong>Contribution cap:</strong> thirty times the forecast, ${F.cap}, is the annual ceiling for pension and disability contributions (<a href="${route('cap', 'en')}">ZUS contribution cap</a>).</li>
</ul>
<p>At ${c.gross} the cap is far away, so you pay those contributions all year. Both figures are fixed for the calendar year and do not move when GUS publishes new quarterly data.</p>`,
      },
      {
        h2: 'Under 26: the relief runs out in autumn',
        html: `<p>Young employees taxed in Poland have income up to ${F.youthLimit} a year exempt from PIT. On ${c.gross} that means ${c.netU26} a month, ${end ? `until ${MON[end - 1]}, when the cap is reached and the employer resumes the tax advance; from then on pay returns to ${c.net}` : 'for the whole year'}. Total net with the relief is ${$(yY.total.net)}. Plan for that drop before the end of the year. Rules: <a href="${route('youth', 'en')}">youth tax relief</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Is ${c.gross} gross the average salary in Poland in ${F.year}?`, a: `Almost. The forecast average wage for ${F.year} is ${F.avgForecast}, and ${c.gross} is ${c.ratioAvg} of it. Against the GUS figure for Q4 2025 (${F.avgQ4}) ${c.amount < P.average_wage.q4_2025_with_profits ? 'it is slightly lower' : 'it is even higher'}. Both are arithmetic means, lifted by the highest earners, so many employees earn less.` },
      { q: 'How much is the Polish average wage after tax?', a: `${F.avgForecast} gross on an employment contract pays ${$(avgNet)} net a month, with PIT-2 and standard employee costs, no PPK and no youth relief. Compared with ${c.gross}, the difference in take-home is ${$(avgNet - c.raw.net)} a month. Use net figures, not gross, when comparing with salaries abroad.` },
      { q: `I am under 26 on ${c.gross}. When does my pay drop?`, a: `${end ? `In ${MON[end - 1]}. By then income since January passes ${F.youthLimit} and the employer starts withholding income tax again.` : `It does not drop this year, because income stays under ${F.youthLimit}.`} Until then you get ${c.netU26} a month, afterwards ${c.net}. ZUS and health are deducted throughout, and the relief ends altogether on your 26th birthday, whatever the amount earned by then.` },
      { q: 'Which average sets ZUS for the self-employed this year?', a: `The forecast average of ${F.avgForecast}. The full ZUS base is 60 % of it, ${F.b2bBaseFull}, so social contributions with sickness cover come to ${F.b2bZusFull} a month. On the lump-sum tax, the health contribution is instead tied to the previous year's Q4 average wage.` },
    ],
  };
};

/* ------------------------------------------------------------------ 10000 */
const a10000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const cumBase = y.months[11].cumTaxBase;
  const margin = P.pit.threshold - cumBase;
  let thr = c.amount; while (!uopYear({ gross: thr }).months[11].secondBracket && thr < c.amount * 2) thr += 10;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net}, No ${F.pitHigh} Tax`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}, or ${$(c.amount * 12)} gross a year, yet none of it is taxed at ${F.pitHigh}. How much room is left before the higher band.`,
    h1: `${c.gross} gross to net in ${F.year}${c.bracketMonth ? '' : `, still below the ${F.pitHigh} band`}`,
    intro: `A five-figure salary of ${c.gross} gross means ${c.net} take-home on an employment contract.`,
    resume: `${c.gross} gross pays ${c.net} net a month on a Polish employment contract in ${F.year}, with PIT-2 and standard costs: ${c.netShare} of gross. It is a psychological milestone, five digits on the contract and ${$(c.amount * 12)} gross a year, exactly the size of the ${F.threshold} tax threshold. ${c.bracketMonth ? `Even so, part of your income reaches the higher band in ${c.bracketMonth}.` : `Even so, you pay nothing at the ${F.pitHigh} rate, because the threshold applies to the taxable base, not to gross pay.`} Social contributions of ${c.social} and costs of ${F.kup} come off first, which leaves a yearly base of ${$(cumBase)}, ${$(margin)} below the threshold. All twelve payslips show the same ${c.net}, and tax advances add up to ${c.pitYear}. The higher band would only start touching the December payslip at a salary of about ${$(thr)} gross. The employer spends ${c.cost} a month on the role.`,
    sections: [
      {
        h2: `${$(c.amount * 12)} a year and still no ${F.pitHigh}`,
        html: `<p>Expats arriving from countries with many tax bands often assume a ${$(c.amount * 12)} salary hits the Polish ${F.pitHigh} band in December. Polish law measures the threshold on income after pension, disability and sickness contributions and after employee costs. Contributions take ${c.social} a month, costs ${F.kup}, and that is enough to keep the base under ${F.threshold}.</p>
<p>${c.bracketMonth ? `Here the base crosses it in ${c.bracketMonth}.` : `So your December pay is the same as January's: ${c.netDec}.`} The ${F.health} health contribution does not reduce the base, so it plays no part here. See <a href="${route('brackets', 'en')}">income tax brackets</a>.</p>`,
      },
      {
        h2: 'How much headroom is left',
        html: `<p>The annual taxable base is ${$(cumBase)}, so ${$(margin)} of base is left before the threshold. In salary terms, ${F.pitHigh} would appear in December only at about ${$(thr)} gross a month. A raise up to that level changes nothing about your tax rate.</p>
<p>One-off income eats the headroom: an annual bonus, a "thirteenth salary" or overtime. If such extras exceed ${$(margin)} of base in the year, the last payslip will be lower. Test it in the <a href="${route('bonus', 'en')}">bonus net calculator</a> or see the whole year in the <a href="${route('annual', 'en')}">annual salary calculator</a>.</p>`,
      },
      {
        h2: 'Five digits on paper, four in the bank',
        html: `<p>A ${c.gross} offer sounds like a breakthrough, but the transfer you receive is ${c.net}, still four digits. A five-figure take-home needs a much higher gross, and by then the ${F.pitHigh} band is part of the picture. When an ad simply says "10k", check whether it means gross, net or a B2B invoice.</p>
<p>For comparison, the same amount pays ${c.zlecNet} on a mandate contract without PIT-2 and ${c.dzieloNet} on a specific-work contract (umowa o dzieło). The employment contract wins on protection: paid leave, sick pay and notice. If you know the net you want, work back with the <a href="${route('nettobrutto', 'en')}">net to gross calculator</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Does ${c.gross} gross a month push me into the ${F.pitHigh} band?`, a: `${c.bracketMonth ? `Yes, in ${c.bracketMonth}.` : 'No.'} The ${F.threshold} threshold applies to the taxable base, meaning income after social contributions and employee costs. At ${c.gross} gross that base is ${$(cumBase)} for the year, ${$(margin)} under the threshold. Extra income such as an annual bonus or overtime can change that.` },
      { q: `What monthly salary makes December taxed at ${F.pitHigh}?`, a: `About ${$(thr)} gross a month on a steady employment contract with standard costs and no other income. At that level the running total of taxable base passes ${F.threshold} in the last month of the year and part of December's income is taxed at ${F.pitHigh}. The higher the salary, the earlier in the year it happens.` },
      { q: `How much income tax do I pay in a year on ${c.gross}?`, a: `Your employer withholds tax advances totalling ${c.pitYear} over the year, with PIT-2 filed. On top of that comes health insurance of ${c.health} a month, which is not tax-deductible. Your final tax in the annual return can differ slightly, for example after a child relief or donation deductions.` },
      { q: `What share of ${c.gross} gross reaches my bank account?`, a: `${c.netShare}: ${c.net} a month and ${c.netYear} a year. The rest is social contributions (${c.social}), health (${c.health}) and the tax advance (${c.pit}). The net share falls slowly as pay rises and drops faster only once part of the income lands in the higher band.` },
    ],
  };
};

/* ------------------------------------------------------------------ 12000 */
const a12000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const bm = bracketNo(y.months);
  const excess = Math.max(0, y.months[11].cumTaxBase - P.pit.threshold);
  const extra = excess * (P.pit.rate_high - P.pit.rate_low);
  const jan = y.months[0], dec = y.months[11];
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net}, Lower in ${bm ? MON[bm - 1] : 'Winter'}`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}${bm ? `, but the ${MON[bm - 1]} payslip drops to ${c.netDec}` : ''}. Why it happens, what the higher band costs and the yearly total.`,
    h1: `${c.gross} gross to net: the ${bm ? MON[bm - 1] : 'year-end'} surprise`,
    intro: `For most of the year ${c.gross} gross means ${c.netJan} take-home on an employment contract.`,
    resume: `A salary of ${c.gross} gross pays ${c.netJan} net a month on a Polish employment contract in ${F.year}, with PIT-2 and standard costs. ${c.bracketMonth && bm ? `The exception is ${c.bracketMonth}: the running total of taxable base passes the ${F.threshold} threshold by ${$(excess)}, that excess is taxed at ${F.pitHigh} instead of ${F.pitLow}, and the ${c.bracketMonth} payslip falls to ${c.netDec}, ${$(jan.net - dec.net)} less than usual.` : `The taxable base stays under ${F.threshold}, so every payslip is the same.`} This is the salary level where the higher band stops being theory and shows up on a payslip, though only barely: crossing into ${F.pitHigh} costs ${$(extra)} over the whole year. Annual take-home is ${c.netYear} and tax advances total ${c.pitYear}. The employer spends ${c.cost} a month. Anyone who also gets a bonus will reach the higher band before the final payslip of the year. If you budget monthly, plan the last month separately.`,
    sections: [
      {
        h2: bm ? `${MON[bm - 1]}: the first payslip in the higher band` : 'A full year in the lower band',
        html: `<p>Polish payroll works cumulatively: each month the current taxable base is added to the total since January and checked against ${F.threshold}. On ${c.gross} gross the monthly base is ${$(jan.taxBase)}, and after twelve months the total reaches ${$(dec.cumTaxBase)}. ${bm ? `The threshold falls in ${MON[bm - 1]}, so only that payslip is partly taxed at ${F.pitHigh}: the tax advance rises from ${$(jan.pit)} to ${$(dec.pit)}.` : ''}</p>
<p>It is not a payroll error, and it is not a penalty on the whole salary. The ${F.pitHigh} rate applies only to the part above the threshold. See <a href="${route('brackets', 'en')}">income tax brackets</a>.</p>`,
      },
      {
        h2: 'What crossing the threshold by a few thousand costs',
        html: `<p>The excess above the threshold is ${$(excess)} of base. The rate difference is ${pct(P.pit.rate_high - P.pit.rate_low, 'en')}, so entering the higher band costs you ${$(extra)} for the year. A common myth among newcomers is that all income becomes taxed at ${F.pitHigh}; if that were so, the bill would be many times higher.</p>
<p>Yearly take-home is ${c.netYear}, a little less than twelve times ${c.netJan}. The month-by-month table below and the <a href="${route('annual', 'en')}">annual salary calculator</a> show every payslip.</p>`,
      },
      {
        h2: 'When the higher band comes earlier',
        html: `<p>Any extra income in the year brings the crossing forward: a quarterly bonus, a jubilee award, overtime, or benefits your employer adds to taxable pay. At ${c.gross}, a small extra amount is enough to pull November into the higher band too. Creative-work costs push the other way if part of your job is creative, because they lower the taxable base (<a href="${route('authors', 'en')}">creative work costs</a>).</p>`,
      },
    ],
    faqs: [
      { q: `Why is my December pay lower on ${c.gross} gross?`, a: `${bm ? `Because in ${MON[bm - 1]} your taxable base since January passes ${F.threshold}, and the ${$(excess)} excess is taxed at ${F.pitHigh}. The tax advance rises from ${$(jan.pit)} to ${$(dec.pit)}, so net pay falls from ${c.netJan} to ${c.netDec}.` : 'It is not lower: the base stays under the threshold.'} The count restarts at zero in January.` },
      { q: `How much extra tax does the higher band cost on ${c.gross}?`, a: `${$(extra)} for the whole year: the difference between the ${F.pitHigh} and ${F.pitLow} rates applied to the ${$(excess)} above the threshold. The rest of your income stays taxed at ${F.pitLow}. The figure assumes no other income and no reliefs claimed in the annual return.` },
      { q: `Can I stay out of the higher band on ${c.gross} gross?`, a: `On an ordinary employment contract only slightly. Commuter costs of ${F.kupRaised} lower your yearly base by a few hundred złoty. Creative-work costs of ${F.kupAuthors} do much more, but only for genuine creative work recorded in your contract. With an excess of just ${$(excess)}, even a modest change in the base can keep you under ${F.threshold}.` },
      { q: `What is the annual take-home on ${c.gross} gross?`, a: `${c.netYear} for the year, with PIT-2 and standard costs. Eleven payslips are ${c.netJan} each, and ${bm ? `the ${c.bracketMonth} one is ${c.netDec}` : 'the last one is the same'}. Tax advances add up to ${c.pitYear}. Over the year, the employer spends twelve times ${c.cost} on your role.` },
    ],
  };
};

/* ------------------------------------------------------------------ 15000 */
const a15000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const bm = bracketNo(y.months);
  const yb = uopYear({ gross: c.amount, months: y.months.map((_, i) => (i === 2 ? c.amount * 2 : c.amount)) });
  const bmBonus = bracketNo(yb.months);
  const bonusNet = yb.months[2].net - y.months[2].net;
  const bonusYear = yb.total.net - y.total.net;
  const lCost = linNet(c.raw.cost);
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net}, Then ${c.netDec}`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}, falling to ${c.netDec} from ${bm ? MON[bm - 1] : 'December'}. The ${F.pitHigh} band, bonuses that bring it forward and the B2B flat tax option.`,
    h1: `${c.gross} gross to net: the higher band ${bm && bm >= 9 ? 'in autumn' : bm ? `from ${MON[bm - 1]}` : 'never reached'}`,
    intro: `On an employment contract ${c.gross} gross pays ${c.netJan} until the ${F.pitHigh} rate kicks in.`,
    resume: `${c.gross} gross pays ${c.netJan} net a month on a Polish employment contract in ${F.year}, but only for part of the year. ${c.bracketMonth && bm ? `In ${c.bracketMonth} your taxable base since January passes ${F.threshold}; from then until December, ${12 - bm + 1} payslips are partly or fully taxed at ${F.pitHigh}, and December pay is down to ${c.netDec}.` : 'The higher band does not appear this year.'} Yearly take-home is ${c.netYear}, with tax advances of ${c.pitYear}. At this level every bonus counts twice: it raises income and brings the higher band forward. It is also where a B2B offer deserves a serious look. An invoice equal to the salary leaves ${c.b2bLinNet} on the ${F.liniowy} flat tax and ${c.b2bRyczNet} on the IT lump sum${c.raw.b2bRyczNet > c.raw.net ? ', already more than the job' : ''}. Invoicing the employer's full cost of ${c.cost} lifts the flat-tax result to ${$(lCost)}. Expats with foreign income should note that this page covers Polish salary only.`,
    sections: [
      {
        h2: bm ? `From ${MON[bm - 1]}: ${F.pitHigh} on your pay` : `No ${F.pitHigh} this year`,
        html: `<p>${bm ? `The first ${bm - 1} payslips are ${c.netJan} each. ${MON[bm - 1]} is mixed, and the following ones are fully in the higher band at ${c.netDec}, a drop of ${$(y.months[0].net - y.months[11].net)} a month right before the holidays.` : ''}</p>
<p>In January the count restarts and pay returns to ${c.netJan}. If you change employers mid-year, the new one does not know what you earned before and starts from zero, so the annual return settles the difference, often with extra tax to pay. That catches many people who move to Poland in spring. See <a href="${route('brackets', 'en')}">income tax brackets</a>.</p>`,
      },
      {
        h2: 'A bonus that brings the higher band forward',
        html: `<p>Say your employer pays a bonus equal to one month, ${c.gross} gross, in March. March pay rises by ${$(bonusNet)} net, but the running total reaches the threshold sooner and ${F.pitHigh} starts ${bmBonus && bm && bmBonus < bm ? `in ${MON[bmBonus - 1]} instead of ${MON[bm - 1]}` : bmBonus ? `in ${MON[bmBonus - 1]}` : 'in the same month'}. Across the year the bonus leaves ${$(bonusYear)} net, because part of it is effectively taxed at ${F.pitHigh} even though it was paid in spring.</p>
<p>Before swapping fixed pay for a bonus, compare annual net, not monthly. The <a href="${route('bonus', 'en')}">bonus net calculator</a> does it for you.</p>`,
      },
      {
        h2: `The ${F.liniowy} flat tax starts to make sense`,
        html: `<p>On the flat tax (podatek liniowy) a sole trader pays ${F.liniowy} at any income and never meets a higher band, but loses the tax-reducing amount and pays ${F.healthLiniowy} health on profit. An invoice of ${c.gross} leaves ${c.b2bLinNet}, ${c.raw.b2bLinNet > c.raw.net ? 'more' : 'less'} than the ${c.net} January take-home on a job. Invoicing ${c.cost} lifts it to ${$(lCost)}. With no costs, the ${pct(RY, 'en')} IT lump sum does even better: ${c.b2bRyczNet} on an invoice equal to the salary. Plug in your costs in the <a href="${route('liniowy', 'en')}">flat tax calculator</a>.</p>`,
      },
    ],
    faqs: [
      { q: `From which month is ${c.gross} gross taxed at ${F.pitHigh}?`, a: `${bm ? `From ${MON[bm - 1]}. That month your taxable base since January passes ${F.threshold}, so part of the payslip is taxed at ${F.pitHigh} and the remaining ${12 - bm} payslips in full.` : 'Not this year.'} Extra income such as bonuses or overtime moves that month earlier. Each January the count starts again.` },
      { q: `How much of a one-month bonus do I keep on ${c.gross}?`, a: `If paid in March, your pay that month rises by ${$(bonusNet)}. Over the year you keep ${$(bonusYear)}, because the bonus brings the higher band forward${bmBonus ? ` to ${MON[bmBonus - 1]}` : ''} and part of it is effectively taxed at ${F.pitHigh}. At this salary, judge bonuses on an annual basis.` },
      { q: `Is B2B on the flat tax better than a ${c.gross} job?`, a: `At an invoice equal to the salary: ${c.b2bLinNet} on the flat tax against ${c.net} on the job, ${c.raw.b2bLinNet > c.raw.net ? 'so the flat tax already wins' : 'so the job still wins'}. At an invoice equal to the employer's cost, ${c.cost}, the flat tax leaves ${$(lCost)}. Price in full ZUS, unpaid leave and no employer sick pay.` },
      { q: `What will my December payslip be on ${c.gross} gross?`, a: `${c.netDec}, compared with ${c.netJan} in January. The difference comes from the ${F.pitHigh} rate covering the last months of the year. Social contributions stay the same, because at this salary the annual pension contribution cap is not reached. Net pay returns to the January level next year.` },
    ],
  };
};

/* ------------------------------------------------------------------ 20000 */
const a20000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const bm = bracketNo(y.months);
  const a50 = uopYear({ gross: c.amount, authorsShare: 0.5 }), a80 = uopYear({ gross: c.amount, authorsShare: 0.8 });
  const bm50 = bracketNo(a50.months), bm80 = bracketNo(a80.months);
  const capReached = c.capMonth !== null;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net} and Creative Costs`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}, then ${c.netDec} from ${bm ? MON[bm - 1] : 'December'}. What ${F.kupAuthors} creative-work costs add, and your full monthly cost to the employer.`,
    h1: `${c.gross} gross to net, with creative-work costs (${F.year})`,
    intro: `A ${c.gross} gross job pays ${c.netJan} take-home in the first months of the year.`,
    resume: `${c.gross} gross pays ${c.netJan} net a month on a Polish employment contract in ${F.year}, with PIT-2 and standard costs, but ${bm ? `from ${MON[bm - 1]} pay drops to ${c.netDec}, because income passes the ${F.threshold} threshold and is taxed at ${F.pitHigh}` : 'the whole year stays in the lower band'}. Annual take-home is ${c.netYear}, tax advances ${c.pitYear}, an average of ${$(c.raw.netYear / 12)} a month, which is the figure to budget with. For software developers, designers and other creative staff, the biggest lever here is creative-work costs (koszty autorskie): if half the salary is a fee for transferring copyright, annual take-home rises to ${$(a50.total.net)}${bm50 && bm && bm50 > bm ? ` and the higher band moves from ${MON[bm - 1]} to ${MON[bm50 - 1]}` : ''}. The other side of this salary is its cost: ${c.cost} a month, ${$(y.total.cost)} a year. ${capReached ? `The pension contribution cap is reached in ${c.capMonth}.` : `Gross pay of ${$(c.amount * 12)} a year stays under the ${F.cap} contribution cap, so pension and disability contributions run all year.`}`,
    sections: [
      {
        h2: bm ? `The higher band from ${MON[bm - 1]}` : 'No higher band',
        html: `<p>${bm ? `For ${bm - 1} months you receive ${c.netJan}. The ${c.bracketMonth} payslip is partly taxed at ${F.pitHigh}, and from the next month the whole base is. Net pay falls to ${c.netDec}, ${$(y.months[0].net - y.months[11].net)} a month less, for almost half the year.` : ''}</p>
<p>If you are relocating on this salary and signing a lease, base the rent on the yearly average, not the January payslip. The month-by-month table below shows each one.</p>`,
      },
      {
        h2: `Creative-work costs of ${F.kupAuthors} at ${c.gross}`,
        html: `<p>Polish employment contracts can split pay into a regular part and a fee for transferring copyright in work you create, common for programmers, architects, designers and journalists. On that part, deductible costs are ${F.kupAuthors} (after social contributions), capped at ${F.kupAuthorsLimit} a year. At ${c.gross} gross:</p>
<ul>
<li><strong>no creative costs:</strong> ${c.netYear} net a year${bm ? `, higher band from ${MON[bm - 1]}` : ''};</li>
<li><strong>50 % creative fee:</strong> ${$(a50.total.net)}${bm50 ? `, higher band from ${MON[bm50 - 1]}` : ', no higher band'};</li>
<li><strong>80 % creative fee:</strong> ${$(a80.total.net)}${bm80 ? `, higher band from ${MON[bm80 - 1]}` : ', no higher band'}.</li>
</ul>
<p>It requires genuinely creative work and records of it, such as a log of works delivered. Ask HR whether the company already uses this. Guide: <a href="${route('authors', 'en')}">creative work costs</a>.</p>`,
      },
      {
        h2: 'Your full cost to the employer',
        html: `<p>On top of ${c.gross} the company pays ${c.erTotal} in contributions: pension ${F.emerytalnaEr}, disability ${F.rentowaEr}, accident insurance, the Labour and Solidarity Funds at ${F.fpfs} and the guaranteed benefits fund. That is ${c.cost} a month and ${$(y.total.cost)} a year, of which ${c.netYear} reaches you. PPK, private medical care or a sports card add more. This gap is why B2B offers appear at this level: an invoice of ${c.gross} leaves ${c.b2bRyczNet} on the IT lump sum and ${c.b2bLinNet} on the flat tax. Details: <a href="${route('employer', 'en')}">employer cost calculator</a>.</p>`,
      },
    ],
    faqs: [
      { q: `How much do creative-work costs add per year on ${c.gross}?`, a: `With half the salary as a creative fee, about ${$(a50.total.net - c.raw.netYear)} a year: take-home rises from ${c.netYear} to ${$(a50.total.net)}. At 80 % the gain reaches ${$(a80.total.net - c.raw.netYear)}. The ${F.kupAuthors} costs are calculated after social contributions and capped at ${F.kupAuthorsLimit} a year. The work must be genuinely creative and stated in the contract.` },
      { q: `Will ${c.gross} gross reach the ZUS contribution cap?`, a: `${capReached ? `Yes, in ${c.capMonth}.` : `No. Gross pay is ${$(c.amount * 12)} a year and the cap is ${F.cap}, so pension and disability contributions are deducted every month.`} The cap applies only to those two; sickness and health contributions have no annual ceiling for employees. A large bonus could change the answer.` },
      { q: `What is the yearly employer cost of a ${c.gross} salary?`, a: `${$(y.total.cost)}, twelve times ${c.cost}. Beyond gross, the employer pays ${c.erTotal} a month: its share of pension and disability insurance, accident insurance, the Labour and Solidarity Funds and the guaranteed benefits fund. PPK, benefits and equipment are not included in that figure.` },
      { q: `How big is the drop once ${c.gross} hits the higher band?`, a: `${bm ? `${$(y.months[0].net - y.months[11].net)} a month: from ${c.netJan} to ${c.netDec}. The first lower payslip is the one for ${c.bracketMonth}; the following ones are fully taxed at ${F.pitHigh}.` : 'There is no drop.'} Contributions do not change, and pay returns to the January level next year when the count restarts.` },
    ],
  };
};

/* ------------------------------------------------------------------ 25000 */
const a25000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const bm = bracketNo(y.months);
  const cm = y.months.find((m) => m.capped)?.month ?? null;
  const capM = cm ? y.months[cm - 1] : null, before = cm && cm > 1 ? y.months[cm - 2] : null;
  const erSave = capM && before ? before.er.total - capM.er.total : 0;
  const socSave = capM && before ? before.social - capM.social : 0;
  const capBase = capM ? P.zus.annual_cap - c.amount * (capM.month - 1) : 0;
  const decUp = capM && before ? capM.net > before.net : false;
  const halfPit = uopYear({ gross: c.amount / 2 }).total.pit;
  return {
    title: `${c.gross} Gross to Net ${F.year}: ${c.net} and the ZUS Cap`,
    description: `${c.gross} gross pays ${c.net} net in ${F.year}, less from ${bm ? MON[bm - 1] : 'December'} when the ${F.pitHigh} rate starts. The ${F.cap} ZUS cap then ${decUp ? 'lifts' : 'changes'} the ${c.capMonth ?? 'December'} payslip to ${c.netDec}.`,
    h1: `${c.gross} gross to net: higher band and ZUS cap`,
    intro: `A ${c.gross} gross job pays ${c.netJan} in January and a different amount almost every quarter.`,
    resume: `${c.gross} gross pays ${c.netJan} net a month at the start of ${F.year} on a Polish employment contract, with PIT-2 and standard costs. At this level your pay changes twice during the year. ${bm ? `First in ${MON[bm - 1]}: the taxable base passes ${F.threshold} and net falls to ${$(y.months[10].net)} as income is taxed at ${F.pitHigh}.` : ''} ${cm ? `Then in ${MON[cm - 1]}: gross pay since January reaches the ${F.cap} cap (thirty times the forecast average wage), so pension and disability contributions are charged on just ${$(capBase)}, and the count restarts next year.` : `The ${F.cap} cap is not reached.`} ${decUp ? `As a result the ${c.capMonth} payslip rises to ${c.netDec}, even with ${F.pitHigh} still applying.` : ''} The salary is above ${F.capMonthly}, a twelfth of the cap, which is why the cap bites within the year. Annual take-home is ${c.netYear}, tax advances ${c.pitYear}, and the employer spends ${$(y.total.cost)}. On B2B, the IT lump sum would leave ${c.b2bRyczNet} from a ${c.gross} invoice.`,
    sections: [
      {
        h2: cm ? `The ZUS cap arrives in ${MON[cm - 1]}` : 'The ZUS cap is out of reach',
        html: `<p>Pension and disability contributions are only due on income up to ${F.cap} a year. ${cm && capM && before ? `At ${c.gross} a month, ${cm - 1} payslips add up to ${$(c.amount * (cm - 1))}, so in ${MON[cm - 1]} contributions are charged only on the remaining ${$(capBase)}. Your social contributions drop from ${$(before.social)} to ${$(capM.social)}, a saving of ${$(socSave)}.` : ''}</p>
<p>Sickness (${F.chorobowa}) and health (${F.health}) contributions have no annual cap for employees and keep running on full pay. Lower pension contributions also mean less recorded on your ZUS pension account, something to weigh if you plan to retire in Poland. More: <a href="${route('cap', 'en')}">ZUS contribution cap</a>.</p>`,
      },
      {
        h2: bm ? `In the higher band from ${MON[bm - 1]}` : 'No higher band',
        html: `<p>${bm ? `At ${c.gross} the ${F.threshold} threshold falls as early as ${MON[bm - 1]}, so more than half the year is taxed at ${F.pitHigh}. Net pay drops from ${c.netJan} to ${$(y.months[10].net)}, ${$(y.months[0].net - y.months[10].net)} a month.` : ''} Tax advances for the year total ${c.pitYear}, compared with ${$(halfPit)} at half this salary, because ${F.pitHigh} covers a large share of income. When comparing offers in this range, especially against countries with monthly flat withholding, compare annual net.</p>`,
      },
      {
        h2: `The ${c.capMonth ?? 'December'} payslip: why it ${decUp ? 'goes up' : 'changes'}`,
        html: `<p>${capM && before ? `In ${MON[(cm ?? 12) - 1]} two effects meet: ${F.pitHigh} on the whole base and lower contributions after the cap. Lower contributions raise the taxable base, so the tax advance grows from ${$(before.pit)} to ${$(capM.pit)}, but ${decUp ? `the contribution saving is larger and net pay rises from ${$(before.net)} to ${$(capM.net)}` : `net pay is ${$(capM.net)}`}. The employer pays ${$(erSave)} less in its own contributions that month.` : ''}</p>
<p>So the last payslip of the year is a poor guide to the salary. In January full contributions and the ${F.pitLow} rate return.</p>`,
      },
    ],
    faqs: [
      { q: `When do pension contributions stop on ${c.gross} gross?`, a: `${cm ? `In ${MON[cm - 1]} you pay them only on ${$(capBase)}, because gross pay since January reaches the ${F.cap} cap. From January they are charged on full pay again.` : `They do not stop this year, because annual pay stays under ${F.cap}.`} The same ceiling applies to disability contributions, on both your side and the employer's.` },
      { q: 'After the ZUS cap, do I still pay health insurance?', a: `Yes. The ${F.cap} cap covers only pension and disability contributions. Health (${F.health}) and sickness (${F.chorobowa}) contributions are taken from full pay even after it. Because lower social contributions increase the health contribution base, the health deduction actually rises slightly in the month the cap is reached.` },
      { q: `How much does the employer save at the cap on ${c.gross}?`, a: `${erSave > 0 && cm ? `In ${MON[cm - 1]} its contributions fall by ${$(erSave)} against the previous month, because pension (${F.emerytalnaEr}) and disability (${F.rentowaEr}) are charged on just ${$(capBase)}.` : 'Nothing this year, as the cap is not reached.'} Accident insurance, the Labour and Solidarity Funds and the guaranteed benefits fund continue on full pay.` },
      { q: `Would a B2B lump sum beat ${c.gross} on payroll?`, a: `A ${c.gross} invoice leaves ${c.b2bRyczNet} a month on the IT lump sum, against ${c.netJan} on the job in January and ${$(c.raw.netYear / 12)} on average over the year. ${c.raw.b2bRyczNet > c.raw.netYear / 12 ? 'The lump sum wins clearly' : 'The job still wins'}, but B2B has no paid leave or employer sick pay, and the lump-sum rate depends on your service.` },
    ],
  };
};

export const ANGLES_EN: Record<number, AngleFn> = {
  5000: a5000, 6000: a6000, 7000: a7000, 8000: a8000, 9000: a9000,
  10000: a10000, 12000: a12000, 15000: a15000, 20000: a20000, 25000: a25000,
};
