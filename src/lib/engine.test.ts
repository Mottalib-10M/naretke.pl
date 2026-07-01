import { describe, it, expect } from "vitest";
import {
  calculateZUS,
  calculateZdrowotna,
  calculatePIT,
  calculateZUSPracodawca,
  calculateSalary,
} from "./engine.ts";
import {
  ZUS_EMERYTALNE_PRACOWNIK,
  ZUS_RENTOWE_PRACOWNIK,
  ZUS_CHOROBOWE_PRACOWNIK,
  ZUS_ROCZNA_PODSTAWA_LIMIT,
  SKLADKA_ZDROWOTNA_RATE,
  WYNAGRODZENIE_MINIMALNE_BRUTTO,
  KOSZTY_UZYSKANIA_STANDARD,
  KOSZTY_UZYSKANIA_PODWYZSZONE,
  ULGA_PODATKOWA_MIESIECZNA,
} from "./baremes-2026.ts";

// ─── Helpers ─────────────────────────────────────────────────────────────────

const round2 = (v: number) => Math.round(v * 100) / 100;

// ─── calculateZUS ────────────────────────────────────────────────────────────

describe("calculateZUS — składki pracownika", () => {
  it("oblicza prawidłowe składki ZUS dla wynagrodzenia 6000 PLN", () => {
    const zus = calculateZUS(6000);
    expect(zus.emerytalne).toBe(round2(6000 * ZUS_EMERYTALNE_PRACOWNIK));
    expect(zus.rentowe).toBe(round2(6000 * ZUS_RENTOWE_PRACOWNIK));
    expect(zus.chorobowe).toBe(round2(6000 * ZUS_CHOROBOWE_PRACOWNIK));
    expect(zus.razem).toBe(round2(zus.emerytalne + zus.rentowe + zus.chorobowe));
  });

  it("łączna stawka ZUS pracownika wynosi ~13.71%", () => {
    const zus = calculateZUS(10000);
    const expectedTotal = round2(10000 * (ZUS_EMERYTALNE_PRACOWNIK + ZUS_RENTOWE_PRACOWNIK + ZUS_CHOROBOWE_PRACOWNIK));
    expect(zus.razem).toBe(expectedTotal);
  });

  it("uwzględnia roczny limit składek emerytalnej i rentowej", () => {
    // Skumulowane brutto już osiągnęło limit
    const zus = calculateZUS(20000, ZUS_ROCZNA_PODSTAWA_LIMIT);
    expect(zus.emerytalne).toBe(0);
    expect(zus.rentowe).toBe(0);
    // Chorobowa nadal naliczana
    expect(zus.chorobowe).toBe(round2(20000 * ZUS_CHOROBOWE_PRACOWNIK));
  });

  it("oblicza częściowe składki przy przekroczeniu limitu w miesiącu", () => {
    const skumulowane = ZUS_ROCZNA_PODSTAWA_LIMIT - 5000;
    const zus = calculateZUS(20000, skumulowane);
    // Tylko 5000 PLN podlega składkom em. i rent.
    expect(zus.emerytalne).toBe(round2(5000 * ZUS_EMERYTALNE_PRACOWNIK));
    expect(zus.rentowe).toBe(round2(5000 * ZUS_RENTOWE_PRACOWNIK));
    // Chorobowa od pełnej kwoty
    expect(zus.chorobowe).toBe(round2(20000 * ZUS_CHOROBOWE_PRACOWNIK));
  });
});

// ─── calculateZdrowotna ─────────────────────────────────────────────────────

describe("calculateZdrowotna — składka zdrowotna", () => {
  it("oblicza 9% od podstawy", () => {
    const zdrowotna = calculateZdrowotna(5000);
    expect(zdrowotna).toBe(round2(5000 * SKLADKA_ZDROWOTNA_RATE));
  });

  it("zwraca 0 dla ujemnej podstawy", () => {
    expect(calculateZdrowotna(-100)).toBe(0);
  });

  it("zwraca 0 dla zerowej podstawy", () => {
    expect(calculateZdrowotna(0)).toBe(0);
  });
});

// ─── calculatePIT ────────────────────────────────────────────────────────────

describe("calculatePIT — podatek dochodowy", () => {
  it("oblicza 12% dla dochodu poniżej 120 000 PLN", () => {
    const pit = calculatePIT(80_000);
    expect(pit).toBe(round2(80_000 * 0.12));
  });

  it("oblicza podatek progresywny powyżej 120 000 PLN", () => {
    const pit = calculatePIT(150_000);
    const expected = round2(120_000 * 0.12 + 30_000 * 0.32);
    expect(pit).toBe(expected);
  });

  it("zwraca 0 dla zerowego lub ujemnego dochodu", () => {
    expect(calculatePIT(0)).toBe(0);
    expect(calculatePIT(-5000)).toBe(0);
  });

  it("uwzględnia kwotę wolną — dochód 30 000 PLN → podatek 3 600 PLN", () => {
    // Kwota wolna = 30 000, podatek 12% = 3 600, ale kwota zmniejszająca = 3 600
    // Więc efektywnie podatek = 0 po odliczeniu
    const pit = calculatePIT(30_000);
    expect(pit).toBe(3_600); // Przed odliczeniem kwoty zmniejszającej
  });
});

// ─── calculateSalary — pełne obliczenia ─────────────────────────────────────

describe("calculateSalary — brutto → netto", () => {
  it("oblicza netto dla wynagrodzenia minimalnego 4 700 PLN", () => {
    const result = calculateSalary({
      bruttoMiesieczne: WYNAGRODZENIE_MINIMALNE_BRUTTO,
    });

    expect(result.brutto).toBe(WYNAGRODZENIE_MINIMALNE_BRUTTO);
    expect(result.netto).toBeGreaterThan(0);
    expect(result.netto).toBeLessThan(WYNAGRODZENIE_MINIMALNE_BRUTTO);
    expect(result.zusPracownik.razem).toBeGreaterThan(0);
    expect(result.skladkaZdrowotna).toBeGreaterThan(0);
    expect(result.zaliczkaPIT).toBeGreaterThanOrEqual(0);
  });

  it("stosuje standardowe koszty uzyskania (250 PLN)", () => {
    const result = calculateSalary({
      bruttoMiesieczne: 8000,
      czyDojedza: false,
    });
    expect(result.kosztyUzyskania).toBe(KOSZTY_UZYSKANIA_STANDARD);
  });

  it("stosuje podwyższone koszty uzyskania (300 PLN) dla dojeżdżających", () => {
    const result = calculateSalary({
      bruttoMiesieczne: 8000,
      czyDojedza: true,
    });
    expect(result.kosztyUzyskania).toBe(KOSZTY_UZYSKANIA_PODWYZSZONE);
  });

  it("stosuje ulgę podatkową 300 PLN domyślnie", () => {
    const result = calculateSalary({
      bruttoMiesieczne: 8000,
    });
    expect(result.ulgaPodatkowa).toBe(ULGA_PODATKOWA_MIESIECZNA);
  });

  it("nie stosuje ulgi podatkowej gdy wyłączona", () => {
    const result = calculateSalary({
      bruttoMiesieczne: 8000,
      czyUlgaPodatkowa: false,
    });
    expect(result.ulgaPodatkowa).toBe(0);
  });

  it("koszt pracodawcy jest większy od brutto", () => {
    const result = calculateSalary({ bruttoMiesieczne: 10_000 });
    expect(result.kosztPracodawcy).toBeGreaterThan(result.brutto);
    expect(result.zusPracodawca.razem).toBeGreaterThan(0);
  });

  it("efektywna stawka podatkowa jest w prawidłowym zakresie", () => {
    const result = calculateSalary({ bruttoMiesieczne: 10_000 });
    expect(result.efektywnaStawka).toBeGreaterThan(0);
    expect(result.efektywnaStawka).toBeLessThan(50);
  });

  it("roczne wartości to 12× miesięczne", () => {
    const result = calculateSalary({ bruttoMiesieczne: 7_500 });
    expect(result.roczne.brutto).toBe(round2(7_500 * 12));
    expect(result.roczne.netto).toBe(round2(result.netto * 12));
  });

  it("wyższe brutto daje wyższe netto", () => {
    const low = calculateSalary({ bruttoMiesieczne: 5_000 });
    const high = calculateSalary({ bruttoMiesieczne: 15_000 });
    expect(high.netto).toBeGreaterThan(low.netto);
  });
});

// ─── calculateZUSPracodawca ──────────────────────────────────────────────────

describe("calculateZUSPracodawca — składki pracodawcy", () => {
  it("oblicza wszystkie składki pracodawcy", () => {
    const zus = calculateZUSPracodawca(10_000);
    expect(zus.emerytalne).toBeGreaterThan(0);
    expect(zus.rentowe).toBeGreaterThan(0);
    expect(zus.wypadkowe).toBeGreaterThan(0);
    expect(zus.funduszPracy).toBeGreaterThan(0);
    expect(zus.fgsp).toBeGreaterThan(0);
    expect(zus.razem).toBe(
      round2(zus.emerytalne + zus.rentowe + zus.wypadkowe + zus.funduszPracy + zus.fgsp)
    );
  });

  it("uwzględnia limit roczny dla składek pracodawcy", () => {
    const zus = calculateZUSPracodawca(20_000, ZUS_ROCZNA_PODSTAWA_LIMIT);
    expect(zus.emerytalne).toBe(0);
    expect(zus.rentowe).toBe(0);
    // Wypadkowe, FP, FGŚP nadal naliczane
    expect(zus.wypadkowe).toBeGreaterThan(0);
    expect(zus.funduszPracy).toBeGreaterThan(0);
  });
});
