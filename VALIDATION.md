# VALIDATION — KalkulatorWynagrodzen.pl

## Źródła

- **Ustawa o podatku dochodowym od osób fizycznych (PIT)**
- **Ustawa o systemie ubezpieczeń społecznych (ZUS)**
- **Rozporządzenie Rady Ministrów w sprawie minimalnego wynagrodzenia**
- [podatki.gov.pl](https://www.podatki.gov.pl)
- [zus.pl](https://www.zus.pl)

---

## Przypadek testowy 1: Wynagrodzenie 5 000 PLN brutto, umowa o pracę

**Dane wejściowe:**
- Wynagrodzenie brutto: 5 000 PLN/miesiąc
- Rodzaj umowy: Umowa o pracę
- Koszty uzyskania: Standardowe (250 PLN)

**Oczekiwane obliczenie:**

| Pozycja | Obliczenie | Kwota |
|---|---|---|
| Brutto | | 5 000,00 PLN |
| ZUS emerytalne (9,76%) | 5 000 × 0,0976 | −488,00 PLN |
| ZUS rentowe (1,50%) | 5 000 × 0,015 | −75,00 PLN |
| ZUS chorobowe (2,45%) | 5 000 × 0,0245 | −122,50 PLN |
| **ZUS pracownik razem** | | **−685,50 PLN** |
| Podstawa zdrowotnej | 5 000 − 685,50 | 4 314,50 PLN |
| Składka zdrowotna (9%) | 4 314,50 × 0,09 | −388,31 PLN |
| Podstawa PIT | 5 000 − 685,50 − 250 | 4 065 PLN |
| Zaliczka PIT (12%) | 4 065 × 0,12 − 300 | −187,80 PLN |
| **Netto** | 5 000 − 685,50 − 388,31 − 188 | **~3 738 PLN** |

---

## Przypadek testowy 2: Wynagrodzenie 12 000 PLN brutto (drugi próg podatkowy)

**Dane wejściowe:**
- Wynagrodzenie brutto: 12 000 PLN/miesiąc
- Rodzaj umowy: Umowa o pracę

**Oczekiwane obliczenie:**
1. ZUS pracownik: 12 000 × 13,71% = **1 645,20 PLN**
2. Składka zdrowotna (9%): (12 000 − 1 645,20) × 0,09 = **931,93 PLN**
3. Podstawa PIT: 12 000 − 1 645,20 − 250 = **10 105 PLN**
4. Po przekroczeniu 120 000 PLN/rok → drugi próg 32%
5. **Netto roczne znacząco niższe po przekroczeniu progu**

---

## Przypadek testowy 3: Wynagrodzenie minimalne 4 700 PLN brutto

**Dane wejściowe:**
- Wynagrodzenie brutto: 4 700 PLN/miesiąc (minimalne 2026)
- Rodzaj umowy: Umowa o pracę

**Oczekiwane obliczenie:**
1. ZUS pracownik: 4 700 × 13,71% = **644,37 PLN**
2. Składka zdrowotna: (4 700 − 644,37) × 0,09 = **365,01 PLN**
3. PIT: niska zaliczka dzięki kwocie wolnej
4. **Netto:** ~3 500–3 600 PLN

---

## Build status

- **Build:** 31 pages, 0 errors
- **Tests:** 22/22 passed
- **Sitemap:** auto-generated (sitemap-index.xml)

## Page inventory (31 pages)

| Category | Count | Details |
|---|---|---|
| Home + legal | 3 | index, regulamin, prywatnosc |
| Tool pages | 1 | faq |
| Guides index | 1 | /guides/ |
| Guide articles | 8 | progi-podatkowe-pit, skladki-zus-pracownik, skladka-zdrowotna, kwota-wolna-od-podatku, umowa-o-prace-vs-b2b, koszty-uzyskania-przychodu, ulga-dla-mlodych, negocjowanie-wynagrodzenia |
| Salary pages | 12 | wynagrodzenie-[brutto]-brutto-netto (12 salary levels) |
| Voivodeship pages | 6 | kalkulator-[wojewodztwo] (6 voivodeships) |

## Components

- Calculator.tsx (Polish gross-to-net salary calculator)

## Data files

- baremes-2026.ts — PIT brackets, ZUS rates, health insurance, kwota wolna
- wynagrodzenia-data.ts — 12 salary entries with pre-calculated examples
- wojewodztwa-data.ts — 6 voivodeship entries with regional context

## Quality gates

- [x] Build passes (31 pages, 0 errors)
- [x] Tests pass (22/22)
- [x] Sitemap generated
- [x] Schema.org on every page (WebApplication, FAQPage, BreadcrumbList)
- [x] Analytics: Plausible + GA4 placeholder
- [x] robots.txt present
- [x] llms.txt present
- [x] All guide pages > 1500 words
- [x] Disclaimer in footer
- [x] Mobile-responsive navigation (hamburger menu)
- [x] Internal cross-linking between tools and guides
