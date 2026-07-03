/**
 * Dane dla programmatic SEO — strony wynagrodzeń brutto-netto
 * Pre-obliczone wartości dla 12 popularnych poziomów wynagrodzeń w Polsce (2026)
 */

export interface WynagrodzenieData {
  slug: string;
  brutto: number;
  netto: number;
  zusRazem: number;
  emerytalne: number;
  rentowe: number;
  chorobowe: number;
  podstawaZdrowotna: number;
  zdrowotna: number;
  kosztyUzyskania: number;
  podstawaOpodatkowania: number;
  pit: number;
  kosztPracodawcy: number;
  efektywnaStawka: number;
  label: string;
  description: string;
  context: string;
  faq: { question: string; answer: string }[];
}

export const wynagrodzeniaData: WynagrodzenieData[] = [
  {
    slug: "4666",
    brutto: 4666,
    netto: 3510.92,
    zusRazem: 639.71,
    emerytalne: 455.40,
    rentowe: 69.99,
    chorobowe: 114.32,
    podstawaZdrowotna: 4026.29,
    zdrowotna: 362.37,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 3776,
    pit: 153,
    kosztPracodawcy: 5621.60,
    efektywnaStawka: 24.76,
    label: "4 666 PLN (minimalna)",
    description: "Sprawdź, ile wynosi wynagrodzenie netto z pensji minimalnej 4 666 PLN brutto w 2026 roku. Oblicz składki ZUS, zdrowotną i podatek PIT dla najniższej krajowej.",
    context: "Wynagrodzenie minimalne w Polsce w 2026 roku wynosi 4 666 PLN brutto miesięcznie. Jest to najniższa kwota, jaką pracodawca może wypłacić pracownikowi zatrudnionemu na pełny etat na umowę o pracę. Minimalna pensja dotyczy ponad 2 milionów pracowników w Polsce, szczególnie w branżach usługowych, handlowych i gastronomicznych. Z kwoty 4 666 PLN brutto po odliczeniu wszystkich składek i podatków pracownik otrzymuje na rękę 3 510,92 PLN netto. Oznacza to, że prawie jedna czwarta wynagrodzenia (24,76%) trafia na składki i podatki.",
    faq: [
      {
        question: "Ile wynosi minimalne wynagrodzenie netto w 2026 roku?",
        answer: "Minimalne wynagrodzenie brutto w 2026 roku wynosi 4 666 PLN. Po odliczeniu składek ZUS (639,71 PLN), składki zdrowotnej (362,37 PLN) i zaliczki na PIT (153 PLN), pracownik otrzymuje na rękę 3 510,92 PLN netto miesięcznie.",
      },
      {
        question: "Jakie składki ZUS są potrącane z minimalnej pensji?",
        answer: "Z wynagrodzenia minimalnego 4 666 PLN brutto potrącane są: składka emerytalna (455,40 PLN), rentowa (69,99 PLN) i chorobowa (114,32 PLN). Łączna kwota składek społecznych wynosi 639,71 PLN, co stanowi 13,71% wynagrodzenia brutto.",
      },
      {
        question: "Ile kosztuje pracodawcę pracownik z minimalną pensją?",
        answer: "Całkowity koszt pracodawcy przy minimalnym wynagrodzeniu 4 666 PLN brutto wynosi 5 621,60 PLN miesięcznie. Pracodawca płaci dodatkowe składki emerytalne, rentowe, wypadkowe, na Fundusz Pracy i FGŚP, co zwiększa koszt zatrudnienia o około 20,48%.",
      },
    ],
  },
  {
    slug: "5000",
    brutto: 5000,
    netto: 3738.19,
    zusRazem: 685.50,
    emerytalne: 488.00,
    rentowe: 75.00,
    chorobowe: 122.50,
    podstawaZdrowotna: 4314.50,
    zdrowotna: 388.31,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 4065,
    pit: 188,
    kosztPracodawcy: 6024.00,
    efektywnaStawka: 25.24,
    label: "5 000 PLN",
    description: "Oblicz ile to netto z 5 000 PLN brutto w 2026. Pełny rozkład: składki ZUS, zdrowotna, podatek PIT, koszt pracodawcy. Kalkulator wynagrodzeń online.",
    context: "Wynagrodzenie 5 000 PLN brutto to jedna z najczęściej spotykanych kwot w ofertach pracy w Polsce, szczególnie na stanowiskach początkowych w administracji, handlu czy produkcji. Kwota ta nieznacznie przewyższa wynagrodzenie minimalne i jest popularna w mniejszych miastach oraz firmach z sektora MŚP. Z kwoty 5 000 PLN brutto pracownik otrzymuje na rękę 3 738,19 PLN netto. Efektywna stawka podatkowa wynosi 25,24%, co oznacza, że ponad jedna czwarta wynagrodzenia jest przeznaczana na składki i podatki.",
    faq: [
      {
        question: "5 000 PLN brutto — ile to netto w 2026 roku?",
        answer: "Z wynagrodzenia 5 000 PLN brutto w 2026 roku pracownik otrzyma na rękę 3 738,19 PLN netto. Potrącenia wynoszą: 685,50 PLN (ZUS), 388,31 PLN (zdrowotna) i 188 PLN (PIT).",
      },
      {
        question: "Ile wynosi podatek PIT od wynagrodzenia 5 000 PLN brutto?",
        answer: "Zaliczka na podatek dochodowy PIT od wynagrodzenia 5 000 PLN brutto wynosi 188 PLN miesięcznie. Podstawa opodatkowania to 4 065 PLN (brutto minus ZUS minus koszty uzyskania). Podatek obliczany jest stawką 12% z uwzględnieniem ulgi podatkowej 300 PLN.",
      },
      {
        question: "Jaki jest koszt pracodawcy przy pensji 5 000 PLN brutto?",
        answer: "Koszt pracodawcy przy wynagrodzeniu 5 000 PLN brutto wynosi 6 024 PLN miesięcznie. Oprócz wynagrodzenia brutto pracodawca odprowadza dodatkowe składki (emerytalna, rentowa, wypadkowa, FP, FGŚP) w łącznej kwocie 1 024 PLN.",
      },
    ],
  },
  {
    slug: "6000",
    brutto: 6000,
    netto: 4420.43,
    zusRazem: 822.60,
    emerytalne: 585.60,
    rentowe: 90.00,
    chorobowe: 147.00,
    podstawaZdrowotna: 5177.40,
    zdrowotna: 465.97,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 4927,
    pit: 291,
    kosztPracodawcy: 7228.80,
    efektywnaStawka: 26.33,
    label: "6 000 PLN",
    description: "Kalkulator 6 000 PLN brutto na netto 2026. Ile zarobisz na rękę? Szczegółowe obliczenie składek ZUS, zdrowotnej, PIT i kosztu pracodawcy.",
    context: "Wynagrodzenie 6 000 PLN brutto to mediana wynagrodzeń w wielu polskich miastach i branżach. Jest to kwota spotykana na stanowiskach specjalistycznych i administracyjnych w firmach średniej wielkości. Z 6 000 PLN brutto pracownik otrzymuje 4 420,43 PLN netto. Różnica między brutto a netto wynosi 1 579,57 PLN, co stanowi 26,33% wynagrodzenia. Przy tej pensji pracownik mieści się komfortowo w pierwszym progu podatkowym (12%).",
    faq: [
      {
        question: "6 000 PLN brutto — ile to netto w 2026?",
        answer: "Z wynagrodzenia 6 000 PLN brutto pracownik otrzyma 4 420,43 PLN netto na rękę. Składki ZUS wynoszą 822,60 PLN, składka zdrowotna 465,97 PLN, a zaliczka PIT 291 PLN.",
      },
      {
        question: "Ile składek ZUS zapłacę przy pensji 6 000 PLN brutto?",
        answer: "Przy wynagrodzeniu 6 000 PLN brutto łączna kwota składek społecznych ZUS wynosi 822,60 PLN miesięcznie (13,71%). Składa się na nią: emerytalna 585,60 PLN, rentowa 90 PLN i chorobowa 147 PLN.",
      },
      {
        question: "Jaka jest efektywna stawka podatkowa przy 6 000 PLN brutto?",
        answer: "Efektywna stawka podatkowa przy wynagrodzeniu 6 000 PLN brutto wynosi 26,33%. Oznacza to, że z każdych 100 PLN brutto pracownik oddaje 26,33 PLN na składki i podatki, a 73,67 PLN otrzymuje na rękę.",
      },
    ],
  },
  {
    slug: "7000",
    brutto: 7000,
    netto: 5101.67,
    zusRazem: 959.70,
    emerytalne: 683.20,
    rentowe: 105.00,
    chorobowe: 171.50,
    podstawaZdrowotna: 6040.30,
    zdrowotna: 543.63,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 5790,
    pit: 395,
    kosztPracodawcy: 8433.60,
    efektywnaStawka: 27.12,
    label: "7 000 PLN",
    description: "Przelicz 7 000 PLN brutto na netto w 2026. Dowiedz się, ile dostaniesz na rękę po odliczeniu ZUS, zdrowotnej i PIT. Kalkulator wynagrodzeń.",
    context: "Wynagrodzenie 7 000 PLN brutto to kwota często spotykana na stanowiskach specjalistycznych i juniorskich w IT, finansach czy marketingu. W wielu polskich miastach jest to wynagrodzenie powyżej mediany, oferujące komfortowy standard życia. Z 7 000 PLN brutto na konto trafia 5 101,67 PLN netto, czyli pracownik przekracza psychologiczny próg 5 000 PLN na rękę. Roczne wynagrodzenie brutto wynosi 84 000 PLN, co komfortowo mieści się w pierwszym progu podatkowym.",
    faq: [
      {
        question: "7 000 PLN brutto — ile to netto?",
        answer: "Wynagrodzenie 7 000 PLN brutto to 5 101,67 PLN netto na rękę w 2026 roku. Na potrącenia składa się: ZUS 959,70 PLN, zdrowotna 543,63 PLN i PIT 395 PLN.",
      },
      {
        question: "Ile rocznie zarobi osoba z pensją 7 000 PLN brutto?",
        answer: "Osoba zarabiająca 7 000 PLN brutto miesięcznie otrzyma rocznie 84 000 PLN brutto i około 61 220 PLN netto (12 × 5 101,67 PLN). Roczne wynagrodzenie mieści się w pierwszym progu podatkowym (do 120 000 PLN).",
      },
      {
        question: "Jaki jest koszt pracodawcy przy 7 000 PLN brutto?",
        answer: "Koszt pracodawcy wynosi 8 433,60 PLN miesięcznie, czyli o 1 433,60 PLN więcej niż wynagrodzenie brutto. Rocznie koszt pracodawcy to 101 203,20 PLN.",
      },
    ],
  },
  {
    slug: "8000",
    brutto: 8000,
    netto: 5783.91,
    zusRazem: 1096.80,
    emerytalne: 780.80,
    rentowe: 120.00,
    chorobowe: 196.00,
    podstawaZdrowotna: 6903.20,
    zdrowotna: 621.29,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 6653,
    pit: 498,
    kosztPracodawcy: 9638.40,
    efektywnaStawka: 27.70,
    label: "8 000 PLN",
    description: "Sprawdź ile to netto z 8 000 PLN brutto w 2026. Szczegółowe obliczenia: ZUS, zdrowotna, PIT, koszt pracodawcy. Kalkulator online.",
    context: "Wynagrodzenie 8 000 PLN brutto to kwota popularna wśród specjalistów z kilkuletnim doświadczeniem w większych miastach Polski. Jest to wynagrodzenie spotykane w branży IT na stanowiskach juniorskich, w finansach, inżynierii i innych sektorach wymagających kwalifikacji. Pracownik z pensją 8 000 PLN brutto otrzymuje na rękę 5 783,91 PLN netto. Efektywna stawka podatkowa wynosi 27,70%, a roczne brutto (96 000 PLN) nadal mieści się w pierwszym progu podatkowym.",
    faq: [
      {
        question: "8 000 PLN brutto — ile to netto w 2026?",
        answer: "Z wynagrodzenia 8 000 PLN brutto pracownik otrzyma 5 783,91 PLN netto. Składki ZUS wynoszą 1 096,80 PLN, składka zdrowotna 621,29 PLN, a zaliczka PIT 498 PLN.",
      },
      {
        question: "Czy przy 8 000 PLN brutto wchodzę w drugi próg podatkowy?",
        answer: "Nie. Przy wynagrodzeniu 8 000 PLN brutto roczny dochód wynosi 96 000 PLN, co nie przekracza progu 120 000 PLN. Cały dochód jest opodatkowany stawką 12%. Drugi próg (32%) dotyczy dochodu rocznego powyżej 120 000 PLN.",
      },
      {
        question: "Ile wynosi różnica między 7 000 a 8 000 PLN brutto netto?",
        answer: "Wzrost wynagrodzenia z 7 000 do 8 000 PLN brutto (o 1 000 PLN) daje wzrost netto o 682,24 PLN (z 5 101,67 do 5 783,91 PLN). Pozostałe 317,76 PLN to dodatkowe składki i podatki.",
      },
    ],
  },
  {
    slug: "9000",
    brutto: 9000,
    netto: 6465.15,
    zusRazem: 1233.90,
    emerytalne: 878.40,
    rentowe: 135.00,
    chorobowe: 220.50,
    podstawaZdrowotna: 7766.10,
    zdrowotna: 698.95,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 7516,
    pit: 602,
    kosztPracodawcy: 10843.20,
    efektywnaStawka: 28.17,
    label: "9 000 PLN",
    description: "Kalkulator 9 000 PLN brutto na netto 2026. Pełne obliczenie składek ZUS, zdrowotnej, podatku PIT. Ile dostaniesz na rękę? Sprawdź!",
    context: "Wynagrodzenie 9 000 PLN brutto to kwota typowa dla doświadczonych specjalistów w polskich firmach. W Warszawie i innych dużych miastach jest to wynagrodzenie na stanowiskach mid-level w IT, finansach, marketingu czy inżynierii. Z 9 000 PLN brutto pracownik otrzymuje 6 465,15 PLN netto. Roczne brutto wynosi 108 000 PLN, co zbliża się do pierwszego progu podatkowego (120 000 PLN), ale go nie przekracza.",
    faq: [
      {
        question: "9 000 PLN brutto — ile to netto w 2026?",
        answer: "Wynagrodzenie 9 000 PLN brutto daje 6 465,15 PLN netto na rękę. Potrącenia: ZUS 1 233,90 PLN, zdrowotna 698,95 PLN, PIT 602 PLN.",
      },
      {
        question: "Jak blisko jestem drugiego progu podatkowego przy 9 000 brutto?",
        answer: "Roczne brutto przy 9 000 PLN miesięcznie wynosi 108 000 PLN. Pierwszy próg podatkowy kończy się na 120 000 PLN rocznego dochodu, więc dzieli Cię od niego 12 000 PLN. Cały dochód jest opodatkowany stawką 12%.",
      },
      {
        question: "Ile wynosi składka zdrowotna przy pensji 9 000 PLN?",
        answer: "Składka zdrowotna przy wynagrodzeniu 9 000 PLN brutto wynosi 698,95 PLN miesięcznie. Jest obliczana jako 9% od podstawy, która wynosi 7 766,10 PLN (brutto minus składki ZUS).",
      },
    ],
  },
  {
    slug: "10000",
    brutto: 10000,
    netto: 7147.39,
    zusRazem: 1371.00,
    emerytalne: 976.00,
    rentowe: 150.00,
    chorobowe: 245.00,
    podstawaZdrowotna: 8629.00,
    zdrowotna: 776.61,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 8379,
    pit: 705,
    kosztPracodawcy: 12048.00,
    efektywnaStawka: 28.53,
    label: "10 000 PLN",
    description: "10 000 PLN brutto ile to netto 2026? Oblicz wynagrodzenie na rękę, składki ZUS, zdrowotną, PIT i koszt pracodawcy. Aktualny kalkulator.",
    context: "Wynagrodzenie 10 000 PLN brutto to ważny psychologiczny próg na polskim rynku pracy. Kwota ta kojarzona jest z dobrze płatnymi stanowiskami specjalistycznymi i menedżerskimi. W Warszawie jest to mediana wynagrodzeń w IT, natomiast w mniejszych miastach — wynagrodzenie powyżej średniej. Z 10 000 PLN brutto na konto trafia 7 147,39 PLN netto. Roczne brutto wynosi 120 000 PLN, co oznacza, że pracownik jest na granicy pierwszego progu podatkowego.",
    faq: [
      {
        question: "10 000 PLN brutto — ile to netto w 2026?",
        answer: "Z wynagrodzenia 10 000 PLN brutto pracownik otrzyma 7 147,39 PLN netto na rękę. Potrącenia: ZUS 1 371 PLN (13,71%), zdrowotna 776,61 PLN (9%), PIT 705 PLN.",
      },
      {
        question: "Czy 10 000 PLN brutto przekracza próg podatkowy?",
        answer: "Wynagrodzenie 10 000 PLN brutto miesięcznie daje roczne brutto 120 000 PLN. Pierwszy próg podatkowy kończy się na dochodzie 120 000 PLN, więc jesteś na jego granicy. Podstawa opodatkowania jest niższa niż brutto (po odliczeniu ZUS i kosztów), więc nie przekroczysz drugiego progu.",
      },
      {
        question: "Ile wynosi koszt pracodawcy przy 10 000 PLN brutto?",
        answer: "Całkowity koszt pracodawcy przy wynagrodzeniu 10 000 PLN brutto wynosi 12 048 PLN miesięcznie (144 576 PLN rocznie). Pracodawca płaci dodatkowe 2 048 PLN w składkach ponad kwotę brutto.",
      },
    ],
  },
  {
    slug: "12000",
    brutto: 12000,
    netto: 8509.87,
    zusRazem: 1645.20,
    emerytalne: 1171.20,
    rentowe: 180.00,
    chorobowe: 294.00,
    podstawaZdrowotna: 10354.80,
    zdrowotna: 931.93,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 10105,
    pit: 913,
    kosztPracodawcy: 14457.60,
    efektywnaStawka: 29.08,
    label: "12 000 PLN",
    description: "Kalkulator 12 000 PLN brutto na netto 2026. Szczegółowy rozkład wynagrodzenia: ZUS, zdrowotna, PIT, netto na rękę, koszt pracodawcy.",
    context: "Wynagrodzenie 12 000 PLN brutto to kwota spotykana wśród doświadczonych specjalistów, kierowników zespołów i mid-seniorów w branży IT, finansach i doradztwie. Roczne brutto (144 000 PLN) przekracza pierwszy próg podatkowy (120 000 PLN rocznego dochodu), co oznacza, że część dochodu jest opodatkowana stawką 32%. Z 12 000 PLN brutto pracownik otrzymuje 8 509,87 PLN netto. Efektywna stawka podatkowa wynosi 29,08%.",
    faq: [
      {
        question: "12 000 PLN brutto — ile to netto?",
        answer: "Wynagrodzenie 12 000 PLN brutto w 2026 roku to 8 509,87 PLN netto na rękę. Składki ZUS wynoszą 1 645,20 PLN, zdrowotna 931,93 PLN, a zaliczka PIT 913 PLN.",
      },
      {
        question: "Czy przy 12 000 PLN brutto wchodzę w drugi próg podatkowy?",
        answer: "Tak. Roczne brutto przy 12 000 PLN miesięcznie wynosi 144 000 PLN. Pierwszy próg podatkowy obejmuje dochód do 120 000 PLN rocznie, więc nadwyżka ponad ten próg jest opodatkowana stawką 32% zamiast 12%. Jednak przy miesięcznym rozliczeniu zaliczki efekt ten jest rozkładany na cały rok.",
      },
      {
        question: "Ile wynosi efektywna stawka podatkowa przy 12 000 PLN brutto?",
        answer: "Efektywna stawka podatkowa przy 12 000 PLN brutto wynosi 29,08%. Oznacza to, że z każdych 100 PLN brutto pracownik oddaje 29,08 PLN na składki ZUS, zdrowotną i podatek PIT.",
      },
    ],
  },
  {
    slug: "15000",
    brutto: 15000,
    netto: 10555.58,
    zusRazem: 2056.50,
    emerytalne: 1464.00,
    rentowe: 225.00,
    chorobowe: 367.50,
    podstawaZdrowotna: 12943.50,
    zdrowotna: 1164.92,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 12694,
    pit: 1223,
    kosztPracodawcy: 18072.00,
    efektywnaStawka: 29.63,
    label: "15 000 PLN",
    description: "15 000 PLN brutto ile to netto 2026? Kalkulator wynagrodzenia — pełne obliczenie składek, podatku, netto na rękę i kosztu pracodawcy.",
    context: "Wynagrodzenie 15 000 PLN brutto to kwota typowa dla seniorów w IT, menedżerów średniego szczebla, doświadczonych inżynierów i specjalistów w branży finansowej. Rocznie daje to 180 000 PLN brutto, co znacząco przekracza pierwszy próg podatkowy. Z 15 000 PLN brutto pracownik otrzymuje 10 555,58 PLN netto, przekraczając próg 10 000 PLN na rękę. Efektywna stawka podatkowa wynosi 29,63%.",
    faq: [
      {
        question: "15 000 PLN brutto — ile to netto w 2026?",
        answer: "Z wynagrodzenia 15 000 PLN brutto pracownik otrzyma 10 555,58 PLN netto. Łączne potrącenia wynoszą 4 444,42 PLN: ZUS 2 056,50 PLN, zdrowotna 1 164,92 PLN, PIT 1 223 PLN.",
      },
      {
        question: "Ile podatku PIT zapłacę przy pensji 15 000 PLN?",
        answer: "Miesięczna zaliczka PIT przy wynagrodzeniu 15 000 PLN brutto wynosi 1 223 PLN. Roczny dochód (180 000 PLN brutto) przekracza pierwszy próg podatkowy, więc część dochodu powyżej 120 000 PLN jest opodatkowana stawką 32%.",
      },
      {
        question: "Jak zoptymalizować podatki przy zarobkach 15 000 PLN brutto?",
        answer: "Przy wynagrodzeniu 15 000 PLN brutto warto rozważyć: koszty uzyskania podwyższone (jeśli dojeżdżasz), wspólne rozliczenie z małżonkiem (jeśli partner zarabia mniej), a także inne dostępne ulgi podatkowe. Każda z tych opcji może obniżyć efektywne opodatkowanie.",
      },
    ],
  },
  {
    slug: "18000",
    brutto: 18000,
    netto: 12600.30,
    zusRazem: 2467.80,
    emerytalne: 1756.80,
    rentowe: 270.00,
    chorobowe: 441.00,
    podstawaZdrowotna: 15532.20,
    zdrowotna: 1397.90,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 15282,
    pit: 1534,
    kosztPracodawcy: 21686.40,
    efektywnaStawka: 30.00,
    label: "18 000 PLN",
    description: "Kalkulator 18 000 PLN brutto na netto 2026. Oblicz składki ZUS, zdrowotną, PIT. Ile zarobisz na rękę? Sprawdź koszt pracodawcy.",
    context: "Wynagrodzenie 18 000 PLN brutto to kwota charakterystyczna dla seniorów i liderów w branży IT, dyrektorów w firmach średniej wielkości oraz wysoko wykwalifikowanych specjalistów. Rocznie daje to 216 000 PLN brutto. Z 18 000 PLN brutto pracownik otrzymuje 12 600,30 PLN netto. Efektywna stawka podatkowa wynosi dokładnie 30%, co oznacza, że prawie jedna trzecia wynagrodzenia brutto jest przeznaczana na daniny publiczne.",
    faq: [
      {
        question: "18 000 PLN brutto — ile to netto?",
        answer: "Wynagrodzenie 18 000 PLN brutto to 12 600,30 PLN netto w 2026 roku. Potrącenia: ZUS 2 467,80 PLN, zdrowotna 1 397,90 PLN, PIT 1 534 PLN.",
      },
      {
        question: "Czy warto przejść na B2B przy zarobkach 18 000 PLN?",
        answer: "Przy wynagrodzeniu 18 000 PLN brutto efektywna stawka podatkowa wynosi 30%. Na kontrakcie B2B (liniowy PIT 19%) obciążenie może być niższe, ale trzeba uwzględnić brak płatnego urlopu, L4 i innych świadczeń pracowniczych. Decyzja zależy od indywidualnej sytuacji.",
      },
      {
        question: "Ile wynosi roczne netto przy pensji 18 000 PLN brutto?",
        answer: "Roczne wynagrodzenie netto przy 18 000 PLN brutto miesięcznie wynosi około 151 203,60 PLN (12 × 12 600,30 PLN). Roczne brutto to 216 000 PLN, a roczny koszt pracodawcy 260 236,80 PLN.",
      },
    ],
  },
  {
    slug: "20000",
    brutto: 20000,
    netto: 13963.78,
    zusRazem: 2742.00,
    emerytalne: 1952.00,
    rentowe: 300.00,
    chorobowe: 490.00,
    podstawaZdrowotna: 17258.00,
    zdrowotna: 1553.22,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 17008,
    pit: 1741,
    kosztPracodawcy: 24096.00,
    efektywnaStawka: 30.18,
    label: "20 000 PLN",
    description: "20 000 PLN brutto ile to netto 2026. Pełne obliczenie wynagrodzenia: składki ZUS, zdrowotna, PIT, netto na rękę. Kalkulator online.",
    context: "Wynagrodzenie 20 000 PLN brutto to kwota zarezerwowana dla wysoko wykwalifikowanych specjalistów, seniorów w IT, menedżerów i kadry zarządzającej. Jest to wynagrodzenie znacznie powyżej średniej krajowej. Rocznie daje to 240 000 PLN brutto, co przekracza nie tylko drugi próg podatkowy, ale zbliża się do limitu rocznej podstawy ZUS (235 000 PLN). Z 20 000 PLN brutto pracownik otrzymuje 13 963,78 PLN netto, a efektywna stawka podatkowa to 30,18%.",
    faq: [
      {
        question: "20 000 PLN brutto — ile to netto w 2026?",
        answer: "Z wynagrodzenia 20 000 PLN brutto pracownik otrzyma 13 963,78 PLN netto na rękę. Łączne potrącenia: ZUS 2 742 PLN, zdrowotna 1 553,22 PLN, PIT 1 741 PLN.",
      },
      {
        question: "Czy przy 20 000 PLN brutto przekraczam limit ZUS?",
        answer: "Roczne brutto przy 20 000 PLN miesięcznie wynosi 240 000 PLN, co przekracza limit rocznej podstawy składek emerytalnych i rentowych (235 000 PLN w 2026 roku). Oznacza to, że pod koniec roku netto wzrośnie, bo składki emerytalna i rentowa nie będą już naliczane.",
      },
      {
        question: "Jaki jest koszt pracodawcy przy pensji 20 000 PLN brutto?",
        answer: "Koszt pracodawcy przy 20 000 PLN brutto wynosi 24 096 PLN miesięcznie, czyli 289 152 PLN rocznie. Pracodawca odprowadza dodatkowe 4 096 PLN ponad wynagrodzenie brutto na składki i fundusze.",
      },
    ],
  },
  {
    slug: "25000",
    brutto: 25000,
    netto: 17371.97,
    zusRazem: 3427.50,
    emerytalne: 2440.00,
    rentowe: 375.00,
    chorobowe: 612.50,
    podstawaZdrowotna: 21572.50,
    zdrowotna: 1941.53,
    kosztyUzyskania: 250,
    podstawaOpodatkowania: 21323,
    pit: 2259,
    kosztPracodawcy: 30120.00,
    efektywnaStawka: 30.51,
    label: "25 000 PLN",
    description: "Kalkulator 25 000 PLN brutto na netto 2026. Ile zarobisz na rękę? Szczegółowe obliczenie ZUS, zdrowotnej, PIT. Sprawdź koszt pracodawcy.",
    context: "Wynagrodzenie 25 000 PLN brutto to kwota z najwyższego segmentu rynku wynagrodzeń w Polsce, spotykana u dyrektorów, architektów IT, lekarzy specjalistów i top-managementu. Rocznie daje to 300 000 PLN brutto, co znacząco przekracza zarówno próg podatkowy, jak i limit ZUS. Z 25 000 PLN brutto pracownik otrzymuje 17 371,97 PLN netto. Efektywna stawka podatkowa wynosi 30,51%. Przy tak wysokim wynagrodzeniu warto rozważyć optymalizację podatkową i alternatywne formy zatrudnienia.",
    faq: [
      {
        question: "25 000 PLN brutto — ile to netto w 2026?",
        answer: "Wynagrodzenie 25 000 PLN brutto daje 17 371,97 PLN netto na rękę. Potrącenia: ZUS 3 427,50 PLN, zdrowotna 1 941,53 PLN, PIT 2 259 PLN. Efektywna stawka podatkowa to 30,51%.",
      },
      {
        question: "Ile wynosi roczny podatek PIT przy 25 000 PLN brutto?",
        answer: "Roczna zaliczka PIT przy wynagrodzeniu 25 000 PLN brutto wynosi 27 108 PLN (12 × 2 259 PLN). Dochód roczny (300 000 PLN brutto) znacząco przekracza pierwszy próg podatkowy, więc znaczna część dochodu jest opodatkowana stawką 32%.",
      },
      {
        question: "Czy opłaca się przejść na B2B przy 25 000 PLN?",
        answer: "Przy wynagrodzeniu 25 000 PLN brutto efektywna stawka podatkowa wynosi 30,51%. Na kontrakcie B2B z liniowym PIT (19%) obciążenie może być niższe, ale należy uwzględnić koszty księgowości, brak urlopu, L4, okresu wypowiedzenia i odpraw. Różnica netto może wynosić 2 000–4 000 PLN miesięcznie na korzyść B2B.",
      },
    ],
  },
];
