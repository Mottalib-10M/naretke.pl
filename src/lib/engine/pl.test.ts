import { describe, it, expect } from 'vitest';
import { uop, uopYear, zlecenie, dzielo, b2b, b2bZusMonth, grossForNet, sickPay, overtime, capMonth, healthCapped, PARAMS } from './pl';

describe('umowa o pracę 2026', () => {
  it('płaca minimalna 4806 zł → 3606 zł netto (KUP 250, PIT-2)', () => {
    const m = uop({ gross: PARAMS.minimum_wage.monthly, pit2: true });
    expect(m.social).toBeCloseTo(658.91, 2);
    expect(m.health).toBeCloseTo(373.24, 2);
    expect(m.taxBase).toBe(3897);
    expect(m.pit).toBe(168);
    expect(Math.round(m.net)).toBe(3606);
  });
  it('5000 zł: ZUS 13,71 %, zdrowotna 9 % od podstawy po ZUS', () => {
    const m = uop({ gross: 5000 });
    expect(m.social).toBeCloseTo(685.5, 2);
    expect(m.health).toBeCloseTo(388.31, 2);
    expect(m.taxBase).toBe(4065);
    expect(m.pit).toBe(188); // 4065 × 12 % − 300 = 187,80 → 188
    expect(m.net).toBeCloseTo(5000 - 685.5 - 388.31 - 188, 2);
  });
  it('bez PIT-2 zaliczka nie jest pomniejszana o 300 zł', () => {
    expect(uop({ gross: 5000, pit2: false }).pit - uop({ gross: 5000 }).pit).toBe(300);
  });
  it('KUP 300 zł dla dojeżdżających obniża podstawę o 50 zł', () => {
    expect(uop({ gross: 7000 }).taxBase - uop({ gross: 7000, kup: 'raised' }).taxBase).toBe(50);
  });
  it('ulga dla młodych: zero PIT, ZUS i zdrowotna bez zmian', () => {
    const m = uop({ gross: 6000, under26: true });
    expect(m.pit).toBe(0);
    expect(m.health).toBeCloseTo(uop({ gross: 6000 }).health, 2);
  });
  it('ulga dla młodych kończy się po 85 528 zł przychodu w roku', () => {
    const y = uopYear({ gross: 10000, under26: true });
    const exempt = y.months.reduce((s, m) => s + m.exempt, 0);
    expect(exempt).toBeCloseTo(PARAMS.pit.youth_exempt_limit, 0);
    expect(y.months[7].pit).toBe(0);
    expect(y.months[9].pit).toBeGreaterThan(0);
  });
  it('12 000 zł: drugi próg dopiero w grudniu', () => {
    const y = uopYear({ gross: 12000 });
    expect(y.months.findIndex((m) => m.secondBracket)).toBe(11);
  });
  it('25 000 zł: limit 282 600 zł osiągnięty w grudniu, emerytalna niższa', () => {
    const y = uopYear({ gross: 25000 });
    expect(capMonth(25000)).toBe(12);
    expect(y.months[11].capped).toBe(true);
    expect(y.months[11].emerytalna).toBeCloseTo((PARAMS.zus.annual_cap - 11 * 25000) * 0.0976, 2);
    expect(y.months[11].chorobowa).toBeCloseTo(25000 * 0.0245, 2);
    expect(y.months[11].net).toBeGreaterThan(y.months[10].net - 1); // mniej ZUS mimo 32 %
    // FP + FS + FGŚP liczone od podstawy emerytalnej (ograniczonej)
    expect(y.months[11].er.fp).toBeCloseTo((PARAMS.zus.annual_cap - 11 * 25000) * 0.0245, 2);
  });
  it('PPK: wpłata pracodawcy 1,5 % zwiększa podstawę PIT, pracownik 2 % po podatku', () => {
    const a = uop({ gross: 8000 }); const b = uop({ gross: 8000, ppk: true });
    expect(b.ppkEmployee).toBeCloseTo(160, 2);
    expect(b.ppkEmployer).toBeCloseTo(120, 2);
    expect(b.taxBase - a.taxBase).toBe(120);
    expect(b.social).toBeCloseTo(a.social, 2);
  });
  it('koszt pracodawcy przy 5000 zł: 9,76 + 6,5 + 1,67 + 1,0 + 1,45 + 0,10 %', () => {
    const m = uop({ gross: 5000 });
    expect(m.er.cost).toBeCloseTo(5000 * (1 + 0.0976 + 0.065 + 0.0167 + 0.01 + 0.0145 + 0.001), 1);
  });
  it('netto → brutto odwraca silnik', () => {
    const g = grossForNet(6000);
    expect(uop({ gross: g }).net).toBeGreaterThanOrEqual(6000);
    expect(uop({ gross: g - 2 }).net).toBeLessThan(6000);
  });
  it('plafond santé « 2021 » ne joue que sur de très petits salaires', () => {
    expect(healthCapped(1000, 137.1, 250)).toBeLessThan(0.09 * 862.9);
    expect(healthCapped(4806, 658.91, 250)).toBeCloseTo(373.24, 2);
  });
});

describe('umowa zlecenie i o dzieło', () => {
  it('zlecenie 5000 zł bez chorobowego, bez PIT-2', () => {
    const z = zlecenie({ gross: 5000 });
    expect(z.social).toBeCloseTo(5000 * 0.1126, 2);
    expect(z.kup).toBeCloseTo((5000 - z.social) * 0.2, 2);
    expect(z.pit).toBe(Math.round(Math.round(5000 - z.social - z.kup) * 0.12));
  });
  it('student do 26 lat: netto = brutto', () => { expect(zlecenie({ gross: 3000, student: true }).net).toBe(3000); });
  it('umowa ≤ 200 zł: podatek zryczałtowany 12 % od przychodu', () => {
    const d = dzielo({ gross: 200 }); expect(d.flat).toBe(true); expect(d.pit).toBe(24);
  });
  it('dzieło 1000 zł, KUP 20 %: 96 zł podatku', () => { expect(dzielo({ gross: 1000 }).pit).toBe(96); });
  it('dzieło z prawami autorskimi, KUP 50 %: 60 zł podatku', () => { expect(dzielo({ gross: 1000, authors: true }).pit).toBe(60); });
});

describe('B2B 2026', () => {
  it('duży ZUS = 1926,76 zł z chorobowym, 1788,29 zł bez (ZUS)', () => {
    const a = b2bZusMonth('full', true), b = b2bZusMonth('full', false);
    expect(a.emerytalna + a.rentowa + a.chorobowa + a.wypadkowa + a.fp).toBeCloseTo(PARAMS.b2b.zus_month_full, 2);
    expect(b.emerytalna + b.rentowa + b.wypadkowa + b.fp).toBeCloseTo(PARAMS.b2b.zus_month_full_no_sickness, 2);
  });
  it('preferencyjny = 456,18 zł z chorobowym, 420,86 zł bez', () => {
    const a = b2bZusMonth('preferential', true), b = b2bZusMonth('preferential', false);
    expect(a.emerytalna + a.rentowa + a.chorobowa + a.wypadkowa).toBeCloseTo(PARAMS.b2b.zus_month_preferential, 2);
    expect(b.emerytalna + b.rentowa + b.wypadkowa).toBeCloseTo(PARAMS.b2b.zus_month_preferential_no_sickness, 2);
  });
  it('ryczałt 12 % przy 15 000 zł/mies.: zdrowotna 830,58 zł (próg 60–300 tys.)', () => {
    const r = b2b({ revenue: 15000, form: 'ryczalt', ryczaltRate: 0.12 });
    expect(r.health).toBeCloseTo(830.58, 2);
  });
  it('liniowy: zdrowotna 4,9 % nie mniej niż 432,54 zł', () => {
    expect(b2b({ revenue: 6000, form: 'liniowy' }).health).toBeCloseTo(432.54, 2);
    const r = b2b({ revenue: 30000, costs: 2000, form: 'liniowy' });
    expect(r.health).toBeGreaterThan(432.54);
  });
  it('ulga na start: brak składek społecznych, zdrowotna zostaje', () => {
    const r = b2b({ revenue: 10000, form: 'skala', zus: 'start' });
    expect(r.social).toBe(0); expect(r.health).toBeGreaterThan(0);
  });
});

describe('chorobowe i nadgodziny', () => {
  it('L4 80 %: podstawa po odjęciu 13,71 %', () => {
    const s = sickPay({ gross: 6000, days: 10 });
    expect(s.base).toBeCloseTo(6000 * 0.8629, 2);
    expect(s.daily).toBeCloseTo((6000 * 0.8629) / 30 * 0.8, 2);
  });
  it('nadgodziny: dodatek 50 % i 100 %', () => {
    const o = overtime({ gross: 6720, hoursInMonth: 168, h50: 10, h100: 2 });
    expect(o.hourly).toBe(40); expect(o.pay50).toBe(600); expect(o.pay100).toBe(160);
  });
});
