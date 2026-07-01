# VALIDATION — KalkulatorWynagrodzen.pl

## Project Summary
Polish salary calculator (brutto → netto) for 2026, built with Astro 5, React 19, Tailwind v4, and Vitest.

## Tax & Social Parameters (2026)

| Parameter | Value | Source |
|---|---|---|
| PIT first bracket | 12% up to 120,000 PLN | Ustawa o PIT |
| PIT second bracket | 32% above 120,000 PLN | Ustawa o PIT |
| Kwota wolna od podatku | 30,000 PLN/year | Ustawa o PIT |
| Ulga podatkowa (monthly) | 300 PLN | 3,600 / 12 |
| ZUS emerytalne (employee) | 9.76% | Ustawa o systemie ubezpieczeń społecznych |
| ZUS rentowe (employee) | 1.50% | Ustawa o systemie ubezpieczeń społecznych |
| ZUS chorobowe (employee) | 2.45% | Ustawa o systemie ubezpieczeń społecznych |
| Total employee ZUS | 13.71% | Sum of above |
| Składka zdrowotna | 9% of (brutto - ZUS) | Ustawa o NFZ |
| ZUS annual cap | ~235,000 PLN | 30× average salary |
| Koszty uzyskania (standard) | 250 PLN/month | Ustawa o PIT |
| Koszty uzyskania (commuting) | 300 PLN/month | Ustawa o PIT |
| Employer emerytalne | 9.76% | — |
| Employer rentowe | 6.50% | — |
| Employer wypadkowe | ~1.67% | Average rate |
| Fundusz Pracy | 2.45% | — |
| FGŚP | 0.10% | — |
| Minimum wage (2026 est.) | 4,700 PLN/month | Rozporządzenie RM |

## Calculation Steps

1. **ZUS employee** = brutto × 13.71% (with annual cap for emerytalne + rentowe)
2. **Health insurance base** = brutto - ZUS employee
3. **Składka zdrowotna** = base × 9%
4. **Tax base** = brutto - ZUS - koszty uzyskania (rounded to full PLN)
5. **PIT advance** = tax base × 12% - ulga podatkowa (300 PLN) → rounded to full PLN
6. **Netto** = brutto - ZUS - zdrowotna - PIT

## Test Coverage

- ZUS rate calculations (4 tests)
- Health insurance calculation (3 tests)
- PIT progressive tax (3 tests)
- Full salary calculation (6 tests)
- Employer cost calculations (2 tests)
- Total: 18 test cases

## Tech Stack

- **Framework**: Astro 5+
- **UI**: React 19
- **Styling**: Tailwind CSS v4 (@tailwindcss/vite)
- **Testing**: Vitest
- **Language**: TypeScript (strict)
- **Deployment target**: Static site

## File Structure

```
kalkulatorwynagrodzen.pl/
├── astro.config.mjs
├── package.json
├── tsconfig.json
├── vitest.config.ts
├── env.d.ts
├── .gitignore
├── VALIDATION.md
├── public/
│   ├── favicon.svg
│   └── robots.txt
└── src/
    ├── styles/global.css
    ├── lib/
    │   ├── baremes-2026.ts
    │   ├── engine.ts
    │   └── engine.test.ts
    ├── components/
    │   └── Calculator.tsx
    ├── layouts/
    │   └── Layout.astro
    └── pages/
        ├── index.astro
        ├── faq/index.astro
        ├── regulamin/index.astro
        └── prywatnosc/index.astro
```

## Validation Checklist

- [ ] `npm install` succeeds
- [ ] `npm test` — all 18 tests pass
- [ ] `npm run build` — static build succeeds
- [ ] All pages render with `lang="pl"`
- [ ] Calculator computes correct netto from brutto
- [ ] Polish flag bar and red/blue color scheme applied
- [ ] SEO meta tags present on all pages
- [ ] Legal pages (regulamin, prywatnosc) contain full text
- [ ] FAQ page answers common questions
