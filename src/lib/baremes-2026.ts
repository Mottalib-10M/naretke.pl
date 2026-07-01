/**
 * Baremy podatkowe i składkowe na rok 2026 — Polska
 * Źródła: Ministerstwo Finansów, ZUS, obowiązujące przepisy
 */

// ─── PIT — Podatek dochodowy od osób fizycznych ─────────────────────────────

/** Progi podatkowe PIT na 2026 rok */
export const PIT_BRACKETS = [
  { limit: 120_000, rate: 0.12 }, // 12% do 120 000 PLN
  { limit: Infinity, rate: 0.32 }, // 32% powyżej 120 000 PLN
] as const;

/** Kwota wolna od podatku (roczna) */
export const KWOTA_WOLNA = 30_000;

/** Kwota zmniejszająca podatek (roczna) = 12% × 30 000 PLN */
export const KWOTA_ZMNIEJSZAJACA_PODATEK_ROCZNA = 3_600;

/** Kwota zmniejszająca podatek (miesięczna) — ulga podatkowa */
export const ULGA_PODATKOWA_MIESIECZNA = 300;

// ─── Koszty uzyskania przychodu ──────────────────────────────────────────────

/** Koszty uzyskania przychodu — standardowe (pracownik miejscowy) */
export const KOSZTY_UZYSKANIA_STANDARD = 250;

/** Koszty uzyskania przychodu — podwyższone (pracownik dojeżdżający) */
export const KOSZTY_UZYSKANIA_PODWYZSZONE = 300;

// ─── ZUS — Składki na ubezpieczenia społeczne (pracownik) ───────────────────

/** Składka emerytalna — udział pracownika */
export const ZUS_EMERYTALNE_PRACOWNIK = 0.0976;

/** Składka rentowa — udział pracownika */
export const ZUS_RENTOWE_PRACOWNIK = 0.015;

/** Składka chorobowa — udział pracownika */
export const ZUS_CHOROBOWE_PRACOWNIK = 0.0245;

/** Łączna składka ZUS pracownika */
export const ZUS_PRACOWNIK_TOTAL = ZUS_EMERYTALNE_PRACOWNIK + ZUS_RENTOWE_PRACOWNIK + ZUS_CHOROBOWE_PRACOWNIK; // 13.71%

// ─── ZUS — Składki na ubezpieczenia społeczne (pracodawca) ──────────────────

/** Składka emerytalna — udział pracodawcy */
export const ZUS_EMERYTALNE_PRACODAWCA = 0.0976;

/** Składka rentowa — udział pracodawcy */
export const ZUS_RENTOWE_PRACODAWCA = 0.065;

/** Składka wypadkowa — udział pracodawcy (średnia) */
export const ZUS_WYPADKOWE_PRACODAWCA = 0.0167;

/** Fundusz Pracy */
export const FUNDUSZ_PRACY = 0.0245;

/** Fundusz Gwarantowanych Świadczeń Pracowniczych */
export const FGSP = 0.001;

/** Łączna składka ZUS pracodawcy */
export const ZUS_PRACODAWCA_TOTAL =
  ZUS_EMERYTALNE_PRACODAWCA +
  ZUS_RENTOWE_PRACODAWCA +
  ZUS_WYPADKOWE_PRACODAWCA +
  FUNDUSZ_PRACY +
  FGSP;

// ─── Ograniczenie rocznej podstawy składek ──────────────────────────────────

/**
 * Roczna podstawa wymiaru składek na ubezpieczenia emerytalne i rentowe
 * (30-krotność prognozowanego przeciętnego wynagrodzenia)
 * Prognoza na 2026: ok. 7 824 PLN/mies. × 30 = ~234 720 PLN
 */
export const ZUS_ROCZNA_PODSTAWA_LIMIT = 235_000;

// ─── Składka zdrowotna ──────────────────────────────────────────────────────

/** Stawka składki zdrowotnej (umowa o pracę) */
export const SKLADKA_ZDROWOTNA_RATE = 0.09;

// ─── Wynagrodzenie minimalne ─────────────────────────────────────────────────

/** Wynagrodzenie minimalne brutto w 2026 roku (prognoza) */
export const WYNAGRODZENIE_MINIMALNE_BRUTTO = 4_700;

/** Liczba miesięcy w roku */
export const MIESIACE_W_ROKU = 12;
