import { useState, useCallback, type ChangeEvent } from "react";
import { calculateSalary, type WynagrodzeniResult } from "../lib/engine.ts";
import { WYNAGRODZENIE_MINIMALNE_BRUTTO } from "../lib/baremes-2026.ts";

function formatPLN(value: number): string {
  return value.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }) + " zł";
}

function formatPercent(value: number): string {
  return value.toFixed(1) + "%";
}

export default function Calculator() {
  const [brutto, setBrutto] = useState<string>("7500");
  const [czyDojedza, setCzyDojedza] = useState(false);
  const [czyUlga, setCzyUlga] = useState(true);
  const [result, setResult] = useState<WynagrodzeniResult | null>(() =>
    calculateSalary({ bruttoMiesieczne: 7500, czyDojedza: false, czyUlgaPodatkowa: true })
  );

  const handleCalculate = useCallback(() => {
    const value = parseFloat(brutto.replace(/\s/g, "").replace(",", "."));
    if (isNaN(value) || value <= 0) {
      setResult(null);
      return;
    }
    const res = calculateSalary({
      bruttoMiesieczne: value,
      czyDojedza,
      czyUlgaPodatkowa: czyUlga,
    });
    setResult(res);
  }, [brutto, czyDojedza, czyUlga]);

  const handleBruttoChange = (e: ChangeEvent<HTMLInputElement>) => {
    setBrutto(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleCalculate();
  };

  return (
    <div className="max-w-4xl mx-auto">
      {/* Formularz */}
      <div className="card p-6 mb-6">
        <h2 className="text-2xl font-bold mb-6 text-[var(--color-primary)]">
          Oblicz wynagrodzenie netto
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          {/* Brutto */}
          <div>
            <label htmlFor="brutto" className="block text-sm font-semibold mb-2 text-gray-700">
              Wynagrodzenie brutto (PLN/miesiąc)
            </label>
            <input
              id="brutto"
              type="text"
              inputMode="decimal"
              value={brutto}
              onChange={handleBruttoChange}
              onKeyDown={handleKeyDown}
              className="input-field"
              placeholder={`np. ${WYNAGRODZENIE_MINIMALNE_BRUTTO}`}
              aria-label="Wynagrodzenie brutto miesięczne w złotych"
            />
            <p className="text-xs text-[var(--color-muted)] mt-1">
              Minimalne w 2026: {formatPLN(WYNAGRODZENIE_MINIMALNE_BRUTTO)}
            </p>
          </div>

          {/* Opcje */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                id="dojedza"
                type="checkbox"
                checked={czyDojedza}
                onChange={(e) => setCzyDojedza(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-primary)]"
              />
              <label htmlFor="dojedza" className="text-sm text-gray-700">
                Podwyższone koszty uzyskania (dojeżdżam do pracy)
              </label>
            </div>
            <div className="flex items-center gap-3">
              <input
                id="ulga"
                type="checkbox"
                checked={czyUlga}
                onChange={(e) => setCzyUlga(e.target.checked)}
                className="w-4 h-4 accent-[var(--color-primary)]"
              />
              <label htmlFor="ulga" className="text-sm text-gray-700">
                Stosuj ulgę podatkową (PIT-2)
              </label>
            </div>
          </div>
        </div>

        <button
          onClick={handleCalculate}
          className="btn-primary w-full md:w-auto text-lg"
          aria-label="Oblicz wynagrodzenie netto"
        >
          Oblicz wynagrodzenie
        </button>
      </div>

      {/* Wyniki */}
      {result && (
        <div className="space-y-6">
          {/* Główne kwoty */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="card p-5 text-center">
              <p className="text-sm text-[var(--color-muted)] mb-1">Brutto</p>
              <p className="text-2xl font-bold text-gray-800">{formatPLN(result.brutto)}</p>
              <p className="text-xs text-[var(--color-muted)]">rocznie: {formatPLN(result.roczne.brutto)}</p>
            </div>
            <div className="card p-5 text-center border-2 border-[var(--color-primary)]">
              <p className="text-sm text-[var(--color-muted)] mb-1">Netto (na rękę)</p>
              <p className="text-3xl font-bold text-[var(--color-primary)]">{formatPLN(result.netto)}</p>
              <p className="text-xs text-[var(--color-muted)]">rocznie: {formatPLN(result.roczne.netto)}</p>
            </div>
            <div className="card p-5 text-center">
              <p className="text-sm text-[var(--color-muted)] mb-1">Koszt pracodawcy</p>
              <p className="text-2xl font-bold text-gray-800">{formatPLN(result.kosztPracodawcy)}</p>
              <p className="text-xs text-[var(--color-muted)]">rocznie: {formatPLN(result.roczne.kosztPracodawcy)}</p>
            </div>
          </div>

          {/* Szczegóły potrąceń */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Składki pracownika */}
            <div className="card p-5">
              <h3 className="text-lg font-bold mb-4 text-[var(--color-secondary)]">
                Potrącenia pracownika
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <Row label="Składka emerytalna (9,76%)" value={result.zusPracownik.emerytalne} />
                  <Row label="Składka rentowa (1,5%)" value={result.zusPracownik.rentowe} />
                  <Row label="Składka chorobowa (2,45%)" value={result.zusPracownik.chorobowe} />
                  <Row
                    label="ZUS łącznie (13,71%)"
                    value={result.zusPracownik.razem}
                    bold
                  />
                  <tr><td colSpan={2} className="py-1 border-b border-gray-100"></td></tr>
                  <Row label="Podstawa zdrowotna" value={result.podstawaZdrowotna} />
                  <Row label="Składka zdrowotna (9%)" value={result.skladkaZdrowotna} />
                  <tr><td colSpan={2} className="py-1 border-b border-gray-100"></td></tr>
                  <Row label="Koszty uzyskania przychodu" value={result.kosztyUzyskania} />
                  <Row label="Podstawa opodatkowania" value={result.podstawaOpodatkowania} />
                  <Row label="Podatek brutto (12%)" value={result.podatekBrutto} />
                  <Row label="Ulga podatkowa" value={result.ulgaPodatkowa} />
                  <Row label="Zaliczka PIT" value={result.zaliczkaPIT} bold />
                </tbody>
              </table>
            </div>

            {/* Składki pracodawcy */}
            <div className="card p-5">
              <h3 className="text-lg font-bold mb-4 text-[var(--color-secondary)]">
                Składki pracodawcy
              </h3>
              <table className="w-full text-sm">
                <tbody>
                  <Row label="Składka emerytalna (9,76%)" value={result.zusPracodawca.emerytalne} />
                  <Row label="Składka rentowa (6,5%)" value={result.zusPracodawca.rentowe} />
                  <Row label="Składka wypadkowa (1,67%)" value={result.zusPracodawca.wypadkowe} />
                  <Row label="Fundusz Pracy (2,45%)" value={result.zusPracodawca.funduszPracy} />
                  <Row label="FGŚP (0,10%)" value={result.zusPracodawca.fgsp} />
                  <Row label="Razem składki pracodawcy" value={result.zusPracodawca.razem} bold />
                  <tr><td colSpan={2} className="py-1 border-b border-gray-100"></td></tr>
                  <Row label="Całkowity koszt pracodawcy" value={result.kosztPracodawcy} bold />
                </tbody>
              </table>

              <div className="mt-6 p-4 bg-gray-50 rounded-lg">
                <p className="text-sm text-[var(--color-muted)]">
                  <strong>Efektywna stawka podatkowa:</strong>{" "}
                  <span className="text-[var(--color-primary)] font-bold">
                    {formatPercent(result.efektywnaStawka)}
                  </span>
                </p>
                <p className="text-xs text-[var(--color-muted)] mt-1">
                  Uwzględnia składki ZUS, zdrowotną i PIT
                </p>
              </div>
            </div>
          </div>

          {/* Pasek wizualizacji */}
          <div className="card p-5">
            <h3 className="text-lg font-bold mb-4">Podział wynagrodzenia brutto</h3>
            <div className="w-full h-8 rounded-lg overflow-hidden flex">
              <div
                className="bg-green-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${(result.netto / result.brutto) * 100}%` }}
                title={`Netto: ${formatPLN(result.netto)}`}
              >
                Netto
              </div>
              <div
                className="bg-blue-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${(result.zusPracownik.razem / result.brutto) * 100}%` }}
                title={`ZUS: ${formatPLN(result.zusPracownik.razem)}`}
              >
                ZUS
              </div>
              <div
                className="bg-cyan-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${(result.skladkaZdrowotna / result.brutto) * 100}%` }}
                title={`Zdrowotna: ${formatPLN(result.skladkaZdrowotna)}`}
              >
                Zdr.
              </div>
              <div
                className="bg-red-500 flex items-center justify-center text-xs text-white font-semibold"
                style={{ width: `${(result.zaliczkaPIT / result.brutto) * 100}%` }}
                title={`PIT: ${formatPLN(result.zaliczkaPIT)}`}
              >
                PIT
              </div>
            </div>
            <div className="flex flex-wrap gap-4 mt-3 text-xs text-[var(--color-muted)]">
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-green-500 inline-block"></span> Netto
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-blue-500 inline-block"></span> ZUS
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-cyan-500 inline-block"></span> Zdrowotna
              </span>
              <span className="flex items-center gap-1">
                <span className="w-3 h-3 rounded bg-red-500 inline-block"></span> PIT
              </span>
            </div>
          </div>
        </div>
      )}

      {!result && (
        <div className="card p-8 text-center">
          <p className="text-[var(--color-muted)]">
            Wprowadź kwotę brutto i kliknij &ldquo;Oblicz wynagrodzenie&rdquo;
          </p>
        </div>
      )}
    </div>
  );
}

function Row({ label, value, bold = false }: { label: string; value: number; bold?: boolean }) {
  return (
    <tr className={bold ? "font-bold border-t border-gray-200" : ""}>
      <td className="py-1.5 pr-4 text-gray-600">{label}</td>
      <td className="py-1.5 text-right text-gray-900">{formatPLN(value)}</td>
    </tr>
  );
}
