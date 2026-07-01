/**
 * Silnik kalkulatora wynagrodzeń — Polska 2026
 * Obliczenia brutto → netto dla umowy o pracę
 */

import {
  PIT_BRACKETS,
  KWOTA_ZMNIEJSZAJACA_PODATEK_ROCZNA,
  ULGA_PODATKOWA_MIESIECZNA,
  KOSZTY_UZYSKANIA_STANDARD,
  KOSZTY_UZYSKANIA_PODWYZSZONE,
  ZUS_EMERYTALNE_PRACOWNIK,
  ZUS_RENTOWE_PRACOWNIK,
  ZUS_CHOROBOWE_PRACOWNIK,
  ZUS_EMERYTALNE_PRACODAWCA,
  ZUS_RENTOWE_PRACODAWCA,
  ZUS_WYPADKOWE_PRACODAWCA,
  FUNDUSZ_PRACY,
  FGSP,
  SKLADKA_ZDROWOTNA_RATE,
  ZUS_ROCZNA_PODSTAWA_LIMIT,
  MIESIACE_W_ROKU,
} from "./baremes-2026.ts";

// ─── Typy ────────────────────────────────────────────────────────────────────

export interface WynagrodzeniInput {
  /** Wynagrodzenie brutto miesięczne w PLN */
  bruttoMiesieczne: number;
  /** Czy pracownik dojeżdża (podwyższone koszty uzyskania) */
  czyDojedza?: boolean;
  /** Czy stosować ulgę podatkową (PIT-2) */
  czyUlgaPodatkowa?: boolean;
  /** Skumulowane brutto od początku roku (do obliczenia limitu ZUS) */
  skumulowaneBrutto?: number;
}

export interface SkladkiZUS {
  emerytalne: number;
  rentowe: number;
  chorobowe: number;
  razem: number;
}

export interface SkladkiPracodawca {
  emerytalne: number;
  rentowe: number;
  wypadkowe: number;
  funduszPracy: number;
  fgsp: number;
  razem: number;
}

export interface WynagrodzeniResult {
  /** Wynagrodzenie brutto miesięczne */
  brutto: number;
  /** Składki ZUS pracownika */
  zusPracownik: SkladkiZUS;
  /** Podstawa składki zdrowotnej */
  podstawaZdrowotna: number;
  /** Składka zdrowotna */
  skladkaZdrowotna: number;
  /** Koszty uzyskania przychodu */
  kosztyUzyskania: number;
  /** Podstawa opodatkowania (zaokrąglona) */
  podstawaOpodatkowania: number;
  /** Zaliczka na podatek PIT (przed odliczeniami) */
  podatekBrutto: number;
  /** Ulga podatkowa (kwota zmniejszająca) */
  ulgaPodatkowa: number;
  /** Zaliczka na PIT do urzędu (po zaokrągleniu) */
  zaliczkaPIT: number;
  /** Wynagrodzenie netto */
  netto: number;
  /** Składki pracodawcy */
  zusPracodawca: SkladkiPracodawca;
  /** Całkowity koszt pracodawcy */
  kosztPracodawcy: number;
  /** Efektywna stawka podatkowa */
  efektywnaStawka: number;
  /** Roczne podsumowanie */
  roczne: {
    brutto: number;
    netto: number;
    kosztPracodawcy: number;
    podatekRoczny: number;
    zusRoczny: number;
  };
}

// ─── Funkcje obliczeniowe ────────────────────────────────────────────────────

/**
 * Oblicza składki ZUS pracownika z uwzględnieniem limitu rocznego
 * Limit dotyczy składek emerytalnej i rentowej (30× przeciętne wynagrodzenie)
 */
export function calculateZUS(
  bruttoMiesieczne: number,
  skumulowaneBrutto: number = 0
): SkladkiZUS {
  let podstawaEmerytRent = bruttoMiesieczne;

  // Sprawdź limit roczny dla składek emerytalnej i rentowej
  const noweSkumulowane = skumulowaneBrutto + bruttoMiesieczne;
  if (skumulowaneBrutto >= ZUS_ROCZNA_PODSTAWA_LIMIT) {
    // Już przekroczono limit — brak składek em. i rent.
    podstawaEmerytRent = 0;
  } else if (noweSkumulowane > ZUS_ROCZNA_PODSTAWA_LIMIT) {
    // Częściowe przekroczenie limitu w tym miesiącu
    podstawaEmerytRent = ZUS_ROCZNA_PODSTAWA_LIMIT - skumulowaneBrutto;
  }

  const emerytalne = round2(podstawaEmerytRent * ZUS_EMERYTALNE_PRACOWNIK);
  const rentowe = round2(podstawaEmerytRent * ZUS_RENTOWE_PRACOWNIK);
  const chorobowe = round2(bruttoMiesieczne * ZUS_CHOROBOWE_PRACOWNIK);

  return {
    emerytalne,
    rentowe,
    chorobowe,
    razem: round2(emerytalne + rentowe + chorobowe),
  };
}

/**
 * Oblicza składkę zdrowotną (9% od podstawy = brutto - ZUS społeczne)
 */
export function calculateZdrowotna(podstawa: number): number {
  if (podstawa <= 0) return 0;
  return round2(podstawa * SKLADKA_ZDROWOTNA_RATE);
}

/**
 * Oblicza podatek PIT wg skali progresywnej
 * @param rocznyDochod - roczny dochód do opodatkowania
 * @returns roczny podatek przed odliczeniami
 */
export function calculatePIT(rocznyDochod: number): number {
  if (rocznyDochod <= 0) return 0;

  let podatek = 0;
  let remaining = rocznyDochod;
  let previousLimit = 0;

  for (const bracket of PIT_BRACKETS) {
    const bracketWidth = bracket.limit === Infinity
      ? remaining
      : Math.min(remaining, bracket.limit - previousLimit);

    if (bracketWidth <= 0) break;

    podatek += bracketWidth * bracket.rate;
    remaining -= bracketWidth;
    previousLimit = bracket.limit;
  }

  return round2(podatek);
}

/**
 * Oblicza składki ZUS pracodawcy
 */
export function calculateZUSPracodawca(
  bruttoMiesieczne: number,
  skumulowaneBrutto: number = 0
): SkladkiPracodawca {
  let podstawaEmerytRent = bruttoMiesieczne;

  const noweSkumulowane = skumulowaneBrutto + bruttoMiesieczne;
  if (skumulowaneBrutto >= ZUS_ROCZNA_PODSTAWA_LIMIT) {
    podstawaEmerytRent = 0;
  } else if (noweSkumulowane > ZUS_ROCZNA_PODSTAWA_LIMIT) {
    podstawaEmerytRent = ZUS_ROCZNA_PODSTAWA_LIMIT - skumulowaneBrutto;
  }

  const emerytalne = round2(podstawaEmerytRent * ZUS_EMERYTALNE_PRACODAWCA);
  const rentowe = round2(podstawaEmerytRent * ZUS_RENTOWE_PRACODAWCA);
  const wypadkowe = round2(bruttoMiesieczne * ZUS_WYPADKOWE_PRACODAWCA);
  const funduszPracy = round2(bruttoMiesieczne * FUNDUSZ_PRACY);
  const fgsp = round2(bruttoMiesieczne * FGSP);

  return {
    emerytalne,
    rentowe,
    wypadkowe,
    funduszPracy,
    fgsp,
    razem: round2(emerytalne + rentowe + wypadkowe + funduszPracy + fgsp),
  };
}

/**
 * Główna funkcja — pełne obliczenie brutto → netto
 */
export function calculateSalary(input: WynagrodzeniInput): WynagrodzeniResult {
  const {
    bruttoMiesieczne,
    czyDojedza = false,
    czyUlgaPodatkowa = true,
    skumulowaneBrutto = 0,
  } = input;

  // 1. Składki ZUS pracownika
  const zusPracownik = calculateZUS(bruttoMiesieczne, skumulowaneBrutto);

  // 2. Podstawa składki zdrowotnej = brutto - ZUS społeczne
  const podstawaZdrowotna = round2(bruttoMiesieczne - zusPracownik.razem);

  // 3. Składka zdrowotna
  const skladkaZdrowotna = calculateZdrowotna(podstawaZdrowotna);

  // 4. Koszty uzyskania przychodu
  const kosztyUzyskania = czyDojedza
    ? KOSZTY_UZYSKANIA_PODWYZSZONE
    : KOSZTY_UZYSKANIA_STANDARD;

  // 5. Podstawa opodatkowania = brutto - ZUS - koszty uzyskania
  const podstawaOpodatkowaniaRaw = bruttoMiesieczne - zusPracownik.razem - kosztyUzyskania;
  const podstawaOpodatkowania = Math.max(0, Math.round(podstawaOpodatkowaniaRaw));

  // 6. Zaliczka na podatek (miesięczna)
  // Stosujemy stawkę 12% (pierwszy próg) dla miesięcznej zaliczki
  const podatekBrutto = round2(podstawaOpodatkowania * PIT_BRACKETS[0].rate);

  // 7. Ulga podatkowa
  const ulgaPodatkowa = czyUlgaPodatkowa ? ULGA_PODATKOWA_MIESIECZNA : 0;

  // 8. Zaliczka PIT = podatek - ulga (zaokrąglona do pełnych złotych)
  const zaliczkaPIT = Math.max(0, Math.round(podatekBrutto - ulgaPodatkowa));

  // 9. Netto = brutto - ZUS - zdrowotna - PIT
  const netto = round2(
    bruttoMiesieczne - zusPracownik.razem - skladkaZdrowotna - zaliczkaPIT
  );

  // 10. Składki pracodawcy
  const zusPracodawca = calculateZUSPracodawca(bruttoMiesieczne, skumulowaneBrutto);

  // 11. Koszt pracodawcy
  const kosztPracodawcy = round2(bruttoMiesieczne + zusPracodawca.razem);

  // 12. Efektywna stawka podatkowa
  const efektywnaStawka = bruttoMiesieczne > 0
    ? round2(((bruttoMiesieczne - netto) / bruttoMiesieczne) * 100)
    : 0;

  // 13. Roczne podsumowanie (uproszczone — bez limitu ZUS w ciągu roku)
  const bruttoRoczne = round2(bruttoMiesieczne * MIESIACE_W_ROKU);
  const nettoRoczne = round2(netto * MIESIACE_W_ROKU);
  const kosztPracodawcyRoczny = round2(kosztPracodawcy * MIESIACE_W_ROKU);
  const zusRoczny = round2(zusPracownik.razem * MIESIACE_W_ROKU);
  const podatekRoczny = round2(zaliczkaPIT * MIESIACE_W_ROKU);

  return {
    brutto: bruttoMiesieczne,
    zusPracownik,
    podstawaZdrowotna,
    skladkaZdrowotna,
    kosztyUzyskania,
    podstawaOpodatkowania,
    podatekBrutto,
    ulgaPodatkowa,
    zaliczkaPIT,
    netto,
    zusPracodawca,
    kosztPracodawcy,
    efektywnaStawka,
    roczne: {
      brutto: bruttoRoczne,
      netto: nettoRoczne,
      kosztPracodawcy: kosztPracodawcyRoczny,
      podatekRoczny,
      zusRoczny,
    },
  };
}

// ─── Pomocnicze ──────────────────────────────────────────────────────────────

/** Zaokrąglenie do 2 miejsc po przecinku */
function round2(value: number): number {
  return Math.round(value * 100) / 100;
}
