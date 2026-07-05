/**
 * salary-content.ts — Unikalna tre\u015b\u0107 SEO per poziom wynagrodzenia
 * Generuje kontekst, FAQ, bud\u017cet, kariere, optymalizacj\u0119 podatkow\u0105
 * Autor koncepcji: Mottalib Radif MBA INSEAD
 */

import type { WynagrodzenieData } from "./wynagrodzenia-data.ts";

// \u2500\u2500 Typy \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export interface FaqItem {
  question: string;
  answer: string;
}

export interface BudgetRow {
  category: string;
  amount: number;
  percent: number;
}

export interface CareerInfo {
  title: string;
  roles: string[];
  cities: string[];
  experience: string;
  industries: string[];
  progression: string;
}

export interface TaxTip {
  title: string;
  description: string;
}

// \u2500\u2500 Formater \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

function fmt(n: number): string {
  return n.toLocaleString("pl-PL", {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  });
}

function fmtInt(n: number): string {
  return n.toLocaleString("pl-PL", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

// \u2500\u2500 Salary band detection \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

type Band = "minimalna" | "niska" | "srednia" | "dobra" | "wysoka" | "premium";

function getBand(brutto: number): Band {
  if (brutto <= 4700) return "minimalna";
  if (brutto <= 5500) return "niska";
  if (brutto <= 7500) return "srednia";
  if (brutto <= 10000) return "dobra";
  if (brutto <= 15000) return "wysoka";
  return "premium";
}

// \u2500\u2500 Adjacent salary lookup \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

const salaryLevels = [4666, 5000, 6000, 7000, 8000, 9000, 10000, 12000, 15000, 18000, 20000, 25000];

function getAdjacentSalaries(brutto: number): { prev: number | null; next: number | null } {
  const idx = salaryLevels.indexOf(brutto);
  return {
    prev: idx > 0 ? salaryLevels[idx - 1] : null,
    next: idx < salaryLevels.length - 1 ? salaryLevels[idx + 1] : null,
  };
}

// Simple netto approximation for adjacent salary comparison
function approxNetto(brutto: number): number {
  const zus = brutto * 0.1371;
  const zdrowotna = (brutto - zus) * 0.09;
  const podstawa = Math.round(brutto - zus - 250);
  const pit = Math.max(0, Math.round(podstawa * 0.12 - 300));
  return Math.round((brutto - zus - zdrowotna - pit) * 100) / 100;
}

// \u2500\u2500 Average salary constant \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500
const SREDNIA_KRAJOWA = 7500;

// \u2500\u2500 getBandContext \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getBandContext(d: WynagrodzenieData): string {
  const band = getBand(d.brutto);
  const roczne = d.brutto * 12;
  const roczneNetto = d.netto * 12;
  const roznica = d.brutto - d.netto;
  const procentNetto = ((d.netto / d.brutto) * 100).toFixed(1);

  // Salary-specific unique sentences
  const { prev, next } = getAdjacentSalaries(d.brutto);
  const ratio = ((d.brutto / SREDNIA_KRAJOWA) * 100).toFixed(1);
  const daily = (d.netto / 21).toFixed(2);
  const hourly = (d.netto / 168).toFixed(2);

  // Build salary-specific comparison paragraph
  const uniqueSentences: string[] = [];

  // Comparison to adjacent salaries — vary order based on salary being odd/even thousands
  const compSentence = prev
    ? `Zarabiaj\u0105c ${fmtInt(d.brutto)} z\u0142 brutto, otrzymujesz ${fmt(d.netto - approxNetto(prev))} z\u0142 netto wi\u0119cej miesi\u0119cznie ni\u017c przy ${fmtInt(prev)} z\u0142 brutto. `
    : "";

  const ratioSentence = `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto stanowi ${ratio}% \u015bredniej krajowej (${fmtInt(SREDNIA_KRAJOWA)} PLN). `;

  const dailySentence = `Dziennie po podatkach to ${daily} z\u0142 (${hourly} z\u0142 za godzin\u0119 przy 8-godzinnym dniu pracy). `;

  const nextSentence = next
    ? `Kolejny poziom wynagrodzenia to ${fmtInt(next)} PLN brutto, co daje oko\u0142o ${fmt(approxNetto(next))} PLN netto \u2014 r\u00f3\u017cnica ${fmt(approxNetto(next) - d.netto)} PLN miesi\u0119cznie na r\u0119k\u0119. `
    : "";

  // Vary sentence ORDER based on salary amount to ensure uniqueness
  if (d.brutto % 2000 === 0) {
    uniqueSentences.push(ratioSentence, dailySentence, compSentence, nextSentence);
  } else if (d.brutto % 3000 === 0) {
    uniqueSentences.push(dailySentence, nextSentence, ratioSentence, compSentence);
  } else if (d.brutto % 1000 === 0) {
    uniqueSentences.push(compSentence, nextSentence, dailySentence, ratioSentence);
  } else {
    uniqueSentences.push(nextSentence, compSentence, ratioSentence, dailySentence);
  }

  const uniqueBlock = uniqueSentences.filter(Boolean).join("");

  const contexts: Record<Band, string> = {
    minimalna:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto to p\u0142aca minimalna obowi\u0105zuj\u0105ca w Polsce w 2026 roku na podstawie Rozporz\u0105dzenia Rady Ministr\u00f3w. ` +
      `Dotyczy ona ponad 2,3 miliona pracownik\u00f3w, g\u0142\u00f3wnie w bran\u017cach us\u0142ugowych, handlowych, gastronomicznych i produkcyjnych. ` +
      `Po odliczeniu sk\u0142adek ZUS (${fmt(d.zusRazem)} PLN), sk\u0142adki zdrowotnej (${fmt(d.zdrowotna)} PLN) i zaliczki PIT (${fmt(d.pit)} PLN) ` +
      `pracownik otrzymuje na r\u0119k\u0119 ${fmt(d.netto)} PLN netto, co stanowi ${procentNetto}% kwoty brutto. ` +
      `Rocznie daje to ${fmtInt(roczne)} PLN brutto i ${fmt(roczneNetto)} PLN netto. ` +
      `Pracodawca ponosi ca\u0142kowity koszt zatrudnienia w wysoko\u015bci ${fmt(d.kosztPracodawcy)} PLN miesi\u0119cznie, ` +
      `p\u0142ac\u0105c dodatkowe sk\u0142adki na ubezpieczenia spo\u0142eczne, Fundusz Pracy i FG\u015aP. ` +
      `Minimalne wynagrodzenie jest waloryzowane co roku i od 2023 roku ro\u015bnie w tempie oko\u0142o 15-20% rocznie, ` +
      `co ma bezpo\u015bredni wp\u0142yw na miliony polskich rodzin. ` +
      uniqueBlock,

    niska:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto to kwota nieznacznie przewy\u017cszaj\u0105ca p\u0142ac\u0119 minimaln\u0105, ` +
      `cz\u0119sto spotykana na stanowiskach pocz\u0105tkowych w administracji, handlu, obs\u0142udze klienta i produkcji. ` +
      `Jest popularna zw\u0142aszcza w mniejszych miastach i firmach z sektora M\u015aP. ` +
      `Po odliczeniu wszystkich danin publicznych pracownik otrzymuje ${fmt(d.netto)} PLN netto miesi\u0119cznie, ` +
      `czyli ${procentNetto}% wynagrodzenia brutto. R\u00f3\u017cnica mi\u0119dzy brutto a netto wynosi ${fmt(roznica)} PLN. ` +
      `Roczne wynagrodzenie brutto to ${fmtInt(roczne)} PLN, co komfortowo mie\u015bci si\u0119 w pierwszym progu podatkowym (do 120 000 PLN). ` +
      `Ca\u0142kowity koszt pracodawcy wynosi ${fmt(d.kosztPracodawcy)} PLN, czyli o ${fmt(d.kosztPracodawcy - d.brutto)} PLN wi\u0119cej ni\u017c kwota brutto. ` +
      `Przy tym poziomie wynagrodzenia efektywna stawka obci\u0105\u017ce\u0144 fiskalnych wynosi ${d.efektywnaStawka}%. ` +
      uniqueBlock,

    srednia:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto plasuje si\u0119 w okolicach mediany wynagrodze\u0144 w Polsce, ` +
      `co oznacza, \u017ce oko\u0142o po\u0142owa pracownik\u00f3w zarabia mniej, a po\u0142owa wi\u0119cej. ` +
      `Jest to kwota typowa dla specjalist\u00f3w na stanowiskach pocz\u0105tkowych i \u015brednich w firmach \u015bredniej wielko\u015bci. ` +
      `Z ${fmtInt(d.brutto)} PLN brutto na konto trafia ${fmt(d.netto)} PLN netto (${procentNetto}% brutto). ` +
      `Miesi\u0119czne obci\u0105\u017cenia sk\u0142adkowo-podatkowe wynosz\u0105 \u0142\u0105cznie ${fmt(roznica)} PLN: ` +
      `sk\u0142adki ZUS ${fmt(d.zusRazem)} PLN, zdrowotna ${fmt(d.zdrowotna)} PLN, PIT ${fmt(d.pit)} PLN. ` +
      `Roczne brutto ${fmtInt(roczne)} PLN mie\u015bci si\u0119 w pierwszym progu podatkowym ze stawk\u0105 12%. ` +
      `Koszt pracodawcy to ${fmt(d.kosztPracodawcy)} PLN, co stanowi ${((d.kosztPracodawcy / d.brutto) * 100).toFixed(1)}% kwoty brutto. ` +
      uniqueBlock,

    dobra:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto to kwota cz\u0119sto spotykana w\u015br\u00f3d specjalist\u00f3w z kilkuletnim do\u015bwiadczeniem ` +
      `w du\u017cych miastach Polski \u2014 Warszawie, Krakowie, Wroc\u0142awiu i Tr\u00f3jmie\u015bcie. ` +
      `Jest to wynagrodzenie charakterystyczne dla bran\u017cy IT (stanowiska junior/mid), finans\u00f3w, in\u017cynierii i marketingu. ` +
      `Po odliczeniu sk\u0142adek i podatk\u00f3w pracownik otrzymuje ${fmt(d.netto)} PLN netto, ` +
      `co daje ${procentNetto}% kwoty brutto na r\u0119k\u0119. ` +
      `Roczne brutto wynosi ${fmtInt(roczne)} PLN \u2014 ${roczne <= 120000 ? "mie\u015bci si\u0119 w pierwszym progu podatkowym" : "zbli\u017ca si\u0119 do granicy pierwszego progu podatkowego"}. ` +
      `Ca\u0142kowity koszt pracodawcy to ${fmt(d.kosztPracodawcy)} PLN miesi\u0119cznie (${fmtInt(d.kosztPracodawcy * 12)} PLN rocznie). ` +
      `Efektywna stawka podatkowa ${d.efektywnaStawka}% oznacza, \u017ce z ka\u017cdych 100 PLN brutto pracownik oddaje ${d.efektywnaStawka} PLN na daniny publiczne. ` +
      uniqueBlock,

    wysoka:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto to kwota zarezerwowana dla do\u015bwiadczonych specjalist\u00f3w, ` +
      `kierownik\u00f3w zespo\u0142\u00f3w, senior\u00f3w w IT i kadry mened\u017cerskiej. ` +
      `Roczne brutto ${fmtInt(roczne)} PLN ${roczne > 120000 ? "przekracza pierwszy pr\u00f3g podatkowy (120 000 PLN), co oznacza, \u017ce cz\u0119\u015b\u0107 dochodu jest opodatkowana stawk\u0105 32%" : "mie\u015bci si\u0119 w pierwszym progu podatkowym ze stawk\u0105 12%"}. ` +
      `Pracownik otrzymuje na r\u0119k\u0119 ${fmt(d.netto)} PLN netto miesi\u0119cznie (${procentNetto}% brutto). ` +
      `\u0141\u0105czne miesi\u0119czne obci\u0105\u017cenia to ${fmt(roznica)} PLN, w tym ZUS ${fmt(d.zusRazem)} PLN, zdrowotna ${fmt(d.zdrowotna)} PLN i PIT ${fmt(d.pit)} PLN. ` +
      `Koszt pracodawcy wynosi ${fmt(d.kosztPracodawcy)} PLN miesi\u0119cznie (${fmtInt(d.kosztPracodawcy * 12)} PLN rocznie). ` +
      `Przy pensji ${fmtInt(d.brutto)} PLN brutto kontrakt B2B m\u00f3g\u0142by zwi\u0119kszy\u0107 netto o ${fmtInt(Math.round((d.brutto - 1700 - (d.brutto - 1700) * 0.09 - (d.brutto - 1700 - (d.brutto - 1700) * 0.09) * 0.19) - d.netto))} PLN miesi\u0119cznie. ` +
      uniqueBlock,

    premium:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto to kwota z najwy\u017cszego segmentu rynku pracy w Polsce, ` +
      `typowa dla dyrektor\u00f3w, architekt\u00f3w IT, lekarzy specjalist\u00f3w, prawnik\u00f3w partner\u00f3w i top-managementu mi\u0119dzynarodowych korporacji. ` +
      `Roczne brutto ${fmtInt(roczne)} PLN znacznie przekracza pierwszy pr\u00f3g podatkowy, ` +
      `a ${roczne > 235000 ? "r\u00f3wnie\u017c zbli\u017ca si\u0119 do lub przekracza roczny limit podstawy sk\u0142adek emerytalnych i rentowych ZUS (235 000 PLN)" : "efektywna stawka podatkowa jest bliska 30%"}. ` +
      `Na r\u0119k\u0119 pracownik z pensj\u0105 ${fmtInt(d.brutto)} PLN otrzymuje ${fmt(d.netto)} PLN netto (${procentNetto}% brutto), ` +
      `a koszt pracodawcy si\u0119ga ${fmt(d.kosztPracodawcy)} PLN miesi\u0119cznie (${fmtInt(d.kosztPracodawcy * 12)} PLN rocznie). ` +
      `Optymalizacja podatkowa z ${fmtInt(d.brutto)} PLN brutto poprzez B2B lub IP Box ` +
      `mo\u017ce przynie\u015b\u0107 oszcz\u0119dno\u015bci oko\u0142o ${fmtInt(Math.round((d.brutto - 1700 - (d.brutto - 1700) * 0.09 - (d.brutto - 1700 - (d.brutto - 1700) * 0.09) * 0.19) - d.netto))} PLN miesi\u0119cznie. ` +
      uniqueBlock,
  };

  return contexts[band];
}

// \u2500\u2500 buildFaqs \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function buildFaqs(d: WynagrodzenieData): FaqItem[] {
  const band = getBand(d.brutto);
  const roczne = d.brutto * 12;
  const roczneNetto = d.netto * 12;
  const roznica = d.brutto - d.netto;
  const procentNetto = ((d.netto / d.brutto) * 100).toFixed(1);
  const dzienneNetto = (d.netto / 21).toFixed(2);
  const godzinowe = (d.brutto / 168).toFixed(2);
  const godzinnoweNetto = (d.netto / 168).toFixed(2);

  // FAQ 1 \u2014 always: ile to netto
  const faq1: FaqItem = {
    question: `${fmtInt(d.brutto)} PLN brutto \u2014 ile to netto w 2026 roku?`,
    answer:
      `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto w 2026 roku daje ${fmt(d.netto)} PLN netto na r\u0119k\u0119. ` +
      `Potr\u0105cenia miesi\u0119czne wynosz\u0105 \u0142\u0105cznie ${fmt(roznica)} PLN i sk\u0142adaj\u0105 si\u0119 na nie: ` +
      `sk\u0142adki ZUS ${fmt(d.zusRazem)} PLN (emerytalna ${fmt(d.emerytalne)} PLN, rentowa ${fmt(d.rentowe)} PLN, chorobowa ${fmt(d.chorobowe)} PLN), ` +
      `sk\u0142adka zdrowotna ${fmt(d.zdrowotna)} PLN oraz zaliczka na PIT ${fmt(d.pit)} PLN. ` +
      `Rocznie daje to ${fmtInt(roczne)} PLN brutto i ${fmt(roczneNetto)} PLN netto.`,
  };

  // FAQ 2 \u2014 ZUS
  const faq2: FaqItem = {
    question: `Jakie sk\u0142adki ZUS s\u0105 potr\u0105cane z wynagrodzenia ${fmtInt(d.brutto)} PLN brutto?`,
    answer:
      `Z wynagrodzenia ${fmtInt(d.brutto)} PLN brutto potr\u0105cane s\u0105 trzy sk\u0142adki na ubezpieczenia spo\u0142eczne: ` +
      `emerytalna ${fmt(d.emerytalne)} PLN (9,76% brutto), rentowa ${fmt(d.rentowe)} PLN (1,5% brutto) ` +
      `i chorobowa ${fmt(d.chorobowe)} PLN (2,45% brutto). \u0141\u0105czna kwota sk\u0142adek ZUS pracownika to ${fmt(d.zusRazem)} PLN (13,71% brutto). ` +
      `Dodatkowo od podstawy ${fmt(d.podstawaZdrowotna)} PLN naliczana jest sk\u0142adka zdrowotna 9%, czyli ${fmt(d.zdrowotna)} PLN. ` +
      `Razem sk\u0142adki spo\u0142eczne i zdrowotna to ${fmt(d.zusRazem + d.zdrowotna)} PLN miesi\u0119cznie.`,
  };

  // FAQ 3 \u2014 koszt pracodawcy
  const faq3: FaqItem = {
    question: `Ile kosztuje pracodawc\u0119 pracownik zarabiaj\u0105cy ${fmtInt(d.brutto)} PLN brutto?`,
    answer:
      `Ca\u0142kowity koszt pracodawcy przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto wynosi ${fmt(d.kosztPracodawcy)} PLN miesi\u0119cznie, ` +
      `czyli ${fmtInt(d.kosztPracodawcy * 12)} PLN rocznie. Pracodawca p\u0142aci dodatkowe ${fmt(d.kosztPracodawcy - d.brutto)} PLN ` +
      `ponad kwot\u0119 brutto na sk\u0142adki: emerytaln\u0105 (9,76%), rentow\u0105 (6,5%), wypadkow\u0105 (1,67%), ` +
      `Fundusz Pracy (2,45%) i FG\u015aP (0,10%). Oznacza to, \u017ce ka\u017cde 100 PLN brutto kosztuje pracodawc\u0119 ` +
      `oko\u0142o ${((d.kosztPracodawcy / d.brutto) * 100).toFixed(0)} PLN.`,
  };

  // FAQ 4 \u2014 stawka godzinowa
  const faq4: FaqItem = {
    question: `Ile wynosi stawka godzinowa przy pensji ${fmtInt(d.brutto)} PLN brutto?`,
    answer:
      `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto i standardowym wymiarze 168 godzin pracy miesi\u0119cznie ` +
      `(8 godzin \u00d7 21 dni roboczych) stawka godzinowa brutto wynosi ${godzinowe} PLN, ` +
      `a stawka netto to ${godzinnoweNetto} PLN za godzin\u0119. ` +
      `Dzienna p\u0142aca netto (przy 21 dniach roboczych) to ${dzienneNetto} PLN. ` +
      `Stawka ${godzinowe} PLN/godz. brutto z pensji ${fmtInt(d.brutto)} PLN to ${((parseFloat(godzinowe) / 44) * 100).toFixed(0)}% \u015bredniej krajowej (ok. 44 PLN brutto/godz. w 2026).`,
  };

  // FAQ 5 \u2014 band-specific
  let faq5: FaqItem;
  switch (band) {
    case "minimalna":
      faq5 = {
        question: `Czy minimalne wynagrodzenie ${fmtInt(d.brutto)} PLN brutto wzro\u015bnie w 2027 roku?`,
        answer:
          `Minimalne wynagrodzenie w Polsce ro\u015bnie systematycznie \u2014 w ci\u0105gu ostatnich 3 lat wzros\u0142o o ponad 50%. ` +
          `Prognozy na 2027 rok wskazuj\u0105 wzrost o 5-8%, co da\u0142oby ok. 4 900\u20135 000 PLN brutto. ` +
          `Przy obecnych ${fmtInt(d.brutto)} PLN brutto netto wynosi ${fmt(d.netto)} PLN. ` +
          `Wzrost do 5 000 PLN brutto da\u0142by oko\u0142o 3 738 PLN netto, ` +
          `czyli oko\u0142o ${fmt(3738 - d.netto)} PLN wi\u0119cej na r\u0119k\u0119 miesi\u0119cznie.`,
      };
      break;
    case "niska":
      faq5 = {
        question: `Jak wygl\u0105da ${fmtInt(d.brutto)} PLN brutto na tle \u015bredniej krajowej?`,
        answer:
          `Wynagrodzenie ${fmtInt(d.brutto)} PLN brutto (${fmt(d.netto)} PLN netto) jest nieco poni\u017cej \u015bredniej krajowej, ` +
          `kt\u00f3ra w 2026 roku wynosi oko\u0142o 8 000 PLN brutto. Oznacza to, \u017ce pensja ${fmtInt(d.brutto)} PLN brutto stanowi ` +
          `oko\u0142o ${((d.brutto / 8000) * 100).toFixed(0)}% \u015bredniej. Jednak w mniejszych miastach i bran\u017cach us\u0142ugowych ` +
          `jest to wynagrodzenie cz\u0119sto spotykane i pozwalaj\u0105ce na godne \u017cycie.`,
      };
      break;
    case "srednia":
      faq5 = {
        question: `Czy przy ${fmtInt(d.brutto)} PLN brutto wchodz\u0119 w drugi pr\u00f3g podatkowy?`,
        answer:
          `Nie. Roczne wynagrodzenie brutto przy ${fmtInt(d.brutto)} PLN miesi\u0119cznie wynosi ${fmtInt(roczne)} PLN, ` +
          `co jest poni\u017cej progu 120 000 PLN. Ca\u0142y doch\u00f3d jest opodatkowany stawk\u0105 12%. ` +
          `Do przekroczenia progu brakuje ${fmtInt(120000 - roczne)} PLN rocznego brutto, ` +
          `czyli musieliby\u015b zarabia\u0107 ${fmtInt(Math.ceil((120000 - roczne) / 12))} PLN wi\u0119cej brutto miesi\u0119cznie. ` +
          `Przy obecnej stawce Twoja zaliczka PIT to ${fmt(d.pit)} PLN miesi\u0119cznie.`,
      };
      break;
    case "dobra":
      faq5 = {
        question: `Jak daleko jestem od drugiego progu podatkowego przy ${fmtInt(d.brutto)} PLN brutto?`,
        answer:
          roczne >= 120000
            ? `Roczne brutto ${fmtInt(roczne)} PLN ${roczne === 120000 ? "jest dok\u0142adnie na granicy" : "przekracza"} pierwszego progu podatkowego (120 000 PLN). ` +
              `Jednak miesi\u0119czna podstawa opodatkowania (${fmt(d.podstawaOpodatkowania)} PLN) jest ni\u017csza ni\u017c brutto, ` +
              `bo odliczamy sk\u0142adki ZUS i koszty uzyskania. Twoja zaliczka PIT wynosi ${fmt(d.pit)} PLN miesi\u0119cznie.`
            : `Roczne brutto ${fmtInt(roczne)} PLN nie przekracza progu 120 000 PLN. ` +
              `Brakuje ${fmtInt(120000 - roczne)} PLN do wej\u015bcia w drugi pr\u00f3g (32%). ` +
              `Ca\u0142y doch\u00f3d opodatkowany jest stawk\u0105 12%, a zaliczka PIT wynosi ${fmt(d.pit)} PLN miesi\u0119cznie.`,
      };
      break;
    case "wysoka":
      faq5 = {
        question: `Czy op\u0142aca si\u0119 przej\u015b\u0107 na B2B przy zarobkach ${fmtInt(d.brutto)} PLN?`,
        answer:
          `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto (netto ${fmt(d.netto)} PLN) efektywna stawka podatkowa wynosi ${d.efektywnaStawka}%. ` +
          `Na kontrakcie B2B z liniowym PIT 19% i ma\u0142ym ZUS (1 700 PLN) Twoje netto z ${fmtInt(d.brutto)} PLN wzros\u0142oby o oko\u0142o ${fmtInt(Math.round((d.brutto - 1700 - (d.brutto - 1700) * 0.09 - (d.brutto - 1700 - (d.brutto - 1700) * 0.09) * 0.19) - d.netto))} PLN miesi\u0119cznie. ` +
          `Musisz jednak wliczy\u0107 brak 26 dni urlopu (warto\u015b\u0107: ${fmt(d.netto / 21 * 26)} PLN rocznie), brak chorobowego i odprawy. ` +
          `Przy ${fmtInt(d.brutto)} PLN brutto pr\u00f3g op\u0142acalno\u015bci B2B zale\u017cy od indywidualnych benefit\u00f3w pracowniczych.`,
      };
      break;
    case "premium":
    default:
      faq5 = {
        question: `Czy przy ${fmtInt(d.brutto)} PLN brutto przekraczam limit ZUS?`,
        answer:
          roczne > 235000
            ? `Tak. Roczne brutto ${fmtInt(roczne)} PLN przekracza roczny limit podstawy sk\u0142adek emerytalnych i rentowych ` +
              `ZUS (235 000 PLN w 2026 roku). Przekroczenie nast\u0105pi w ${Math.ceil(235000 / d.brutto)}. miesi\u0105cu pracy. ` +
              `Od tego momentu netto wzro\u015bnie, bo sk\u0142adki emerytalna (${fmt(d.emerytalne)} PLN) i rentowa (${fmt(d.rentowe)} PLN) ` +
              `nie b\u0119d\u0105 ju\u017c naliczane. Miesi\u0119czna oszcz\u0119dno\u015b\u0107 to oko\u0142o ${fmt(d.emerytalne + d.rentowe)} PLN.`
            : `Roczne brutto ${fmtInt(roczne)} PLN zbli\u017ca si\u0119 do limitu ZUS (235 000 PLN). ` +
              `Sk\u0142adki emerytalna i rentowa s\u0105 naliczane przez ca\u0142y rok. ` +
              `Twoja miesi\u0119czna sk\u0142adka emerytalna to ${fmt(d.emerytalne)} PLN, a rentowa ${fmt(d.rentowe)} PLN.`,
      };
      break;
  }

  // FAQ 6 \u2014 band-specific
  let faq6: FaqItem;
  switch (band) {
    case "minimalna":
      faq6 = {
        question: `Jakie \u015bwiadczenia przys\u0142uguj\u0105 przy minimalnym wynagrodzeniu ${fmtInt(d.brutto)} PLN?`,
        answer:
          `Przy minimalnym wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto (${fmt(d.netto)} PLN netto) pracownik ` +
          `mo\u017ce kwalifikowa\u0107 si\u0119 do dop\u0142at do czynszu (Mieszkanie na Start), 800+ na dziecko, ` +
          `oraz ulg podatkowych (np. ulga na dzieci \u2014 1 112,04 PLN rocznie na pierwsze dziecko). ` +
          `Dodatkowo od sk\u0142adek ZUS (${fmt(d.zusRazem)} PLN miesi\u0119cznie) budowany jest kapita\u0142 emerytalny. ` +
          `Warto r\u00f3wnie\u017c rozwa\u017cy\u0107 PPK z dop\u0142at\u0105 pracodawcy (1,5% brutto = ${fmt(d.brutto * 0.015)} PLN).`,
      };
      break;
    case "niska":
      faq6 = {
        question: `Ile odk\u0142ad\u0105 na emerytur\u0119 pracownik z pensj\u0105 ${fmtInt(d.brutto)} PLN brutto?`,
        answer:
          `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto miesi\u0119czna sk\u0142adka emerytalna pracownika wynosi ${fmt(d.emerytalne)} PLN (9,76%). ` +
          `Pracodawca dop\u0142aca kolejne 9,76%, co daje \u0142\u0105cznie ${fmt(d.emerytalne * 2)} PLN miesi\u0119cznie na konto emerytalne. ` +
          `Rocznie na emerytur\u0119 trafia ${fmt(d.emerytalne * 24)} PLN (sk\u0142adki pracownika i pracodawcy). ` +
          `Dodatkowo w ramach PPK pracodawca wp\u0142aca 1,5% brutto (${fmt(d.brutto * 0.015)} PLN), ` +
          `a pracownik 2% (${fmt(d.brutto * 0.02)} PLN), co powi\u0119ksza oszcz\u0119dno\u015bci emerytalne.`,
      };
      break;
    case "srednia":
      faq6 = {
        question: `Jak wygl\u0105da ${fmtInt(d.brutto)} PLN brutto w por\u00f3wnaniu z poprzednim rokiem?`,
        answer:
          `Inflacja w Polsce w latach 2022-2024 spowodowa\u0142a znaczny wzrost wynagrodze\u0144. Kwota ${fmtInt(d.brutto)} PLN brutto ` +
          `w 2026 roku ma si\u0142\u0119 nabywcz\u0105 por\u00f3wnywaln\u0105 do oko\u0142o ${fmtInt(Math.round(d.brutto * 0.87))} PLN w 2023 roku. ` +
          `Na r\u0119k\u0119 otrzymujesz ${fmt(d.netto)} PLN netto, co przy obecnych cenach pozwala na utrzymanie ` +
          `\u015bredniego standardu \u017cycia w wi\u0119kszo\u015bci polskich miast. ` +
          `Ca\u0142kowite obci\u0105\u017cenia (${d.efektywnaStawka}%) s\u0105 typowe dla pierwszego progu podatkowego.`,
      };
      break;
    case "dobra":
      faq6 = {
        question: `Ile odk\u0142ad\u0105 na emerytur\u0119 osoba zarabiaj\u0105ca ${fmtInt(d.brutto)} PLN brutto?`,
        answer:
          `Przy pensji ${fmtInt(d.brutto)} PLN brutto \u0142\u0105czna miesi\u0119czna sk\u0142adka emerytalna (pracownik + pracodawca) ` +
          `wynosi ${fmt(d.emerytalne * 2)} PLN (2 \u00d7 9,76% \u00d7 ${fmtInt(d.brutto)} PLN). ` +
          `Rocznie na konto w ZUS trafia ${fmt(d.emerytalne * 24)} PLN. ` +
          `Je\u015bli dodatkowo uczestniczysz w PPK, pracodawca dop\u0142aca 1,5% (${fmt(d.brutto * 0.015)} PLN), ` +
          `a Ty wp\u0142acasz 2% (${fmt(d.brutto * 0.02)} PLN) z brutto. ` +
          `\u0141\u0105cznie na przysz\u0142\u0105 emerytur\u0119 odk\u0142adanych jest oko\u0142o ${fmt(d.emerytalne * 2 + d.brutto * 0.035)} PLN miesi\u0119cznie.`,
      };
      break;
    case "wysoka":
      faq6 = {
        question: `Jakie ulgi podatkowe mo\u017cna zastosowa\u0107 przy ${fmtInt(d.brutto)} PLN brutto?`,
        answer:
          `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto (PIT miesi\u0119czny ${fmt(d.pit)} PLN) warto rozwa\u017cy\u0107: ` +
          `wsp\u00f3lne rozliczenie z ma\u0142\u017conkiem (je\u015bli partner zarabia poni\u017cej 10 000 PLN brutto \u2014 ` +
          `mo\u017cna unikn\u0105\u0107 drugiego progu podatkowego), ulg\u0119 na dzieci (1 112,04 PLN rocznie na pierwsze dziecko), ` +
          `podwy\u017cszone koszty uzyskania (je\u015bli doje\u017cd\u017casz \u2014 300 PLN zamiast 250 PLN miesi\u0119cznie), ` +
          `oraz ulg\u0119 internetow\u0105 i termomodernizacyjn\u0105. Ka\u017cda z tych ulg obni\u017ca efektywne opodatkowanie poni\u017cej ${d.efektywnaStawka}%.`,
      };
      break;
    case "premium":
    default:
      faq6 = {
        question: `Jak zoptymalizowa\u0107 podatki przy zarobkach ${fmtInt(d.brutto)} PLN brutto?`,
        answer:
          `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto (netto ${fmt(d.netto)} PLN, PIT ${fmt(d.pit)} PLN miesi\u0119cznie) ` +
          `kluczowe strategie optymalizacji to: 1) przej\u015bcie na B2B z liniowym PIT 19% ` +
          `(potencjalna oszcz\u0119dno\u015b\u0107 2 000\u20135 000 PLN/miesi\u0105c), 2) ulga IP Box dla tw\u00f3rc\u00f3w oprogramowania ` +
          `(efektywny PIT 5%), 3) wsp\u00f3lne rozliczenie z ma\u0142\u017conkiem, 4) struktura sp\u00f3\u0142ki z o.o. z CIT este\u0144skim. ` +
          `Wyb\u00f3r strategii zale\u017cy od bran\u017cy i sytuacji rodzinnej. Konsultacja z doradc\u0105 podatkowym jest zalecana.`,
      };
      break;
  }

  return [faq1, faq2, faq3, faq4, faq5, faq6];
}

// \u2500\u2500 getBudgetBreakdown \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getBudgetBreakdown(netMonthly: number): BudgetRow[] {
  const housing = Math.round(netMonthly * 0.30);
  const food = Math.round(netMonthly * 0.20);
  const transport = Math.round(netMonthly * 0.10);
  const media = Math.round(netMonthly * 0.05);
  const health = Math.round(netMonthly * 0.05);
  const entertainment = Math.round(netMonthly * 0.08);
  const savings = Math.round(netMonthly * 0.15);
  const other = netMonthly - housing - food - transport - media - health - entertainment - savings;

  return [
    { category: "Mieszkanie (czynsz, media, kredyt)", amount: housing, percent: 30 },
    { category: "\u017bywno\u015b\u0107 i artyku\u0142y codzienne", amount: food, percent: 20 },
    { category: "Transport (paliwo, komunikacja)", amount: transport, percent: 10 },
    { category: "Telekomunikacja i Internet", amount: media, percent: 5 },
    { category: "Zdrowie i higiena", amount: health, percent: 5 },
    { category: "Rozrywka i kultura", amount: entertainment, percent: 8 },
    { category: "Oszcz\u0119dno\u015bci i inwestycje", amount: savings, percent: 15 },
    { category: "Pozosta\u0142e wydatki", amount: Math.round(other), percent: 7 },
  ];
}

// \u2500\u2500 getCareerInfo \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getCareerInfo(brutto: number): CareerInfo {
  // Unique role assignments per exact salary amount
  const careerMap: Record<number, CareerInfo> = {
    4666: {
      title: "Stanowiska z wynagrodzeniem minimalnym",
      roles: ["kasjer/ka w markecie", "pracownik linii produkcyjnej", "sprz\u0105tacz/ka biurowy", "pomoc kuchenna w sto\u0142\u00f3wce", "pracownik sortowni paczek"],
      cities: ["wszystkie miasta w Polsce", "szczeg\u00f3lnie regiony wschodnie"],
      experience: "bez wymaganego do\u015bwiadczenia lub sta\u017c/praktyka",
      industries: ["handel detaliczny", "gastronomia sieciowa", "us\u0142ugi porz\u0105dkowe", "produkcja ta\u015bmowa", "logistyka magazynowa"],
      progression: `Awans z ${fmtInt(brutto)} do 5 000 PLN brutto wymaga zazwyczaj 6-12 miesi\u0119cy sta\u017cu i pozytywnej oceny okresowej.`,
    },
    5000: {
      title: "Stanowiska pocz\u0105tkowe ponad minimum",
      roles: ["recepcjonista/ka w hotelu", "asystent/ka administracyjna", "m\u0142odszy sprzedawca B2B", "operator call center", "pracownik biurowy"],
      cities: ["Radom", "Kielce", "Siedlce", "Bia\u0142a Podlaska", "mniejsze miasta wojew\u00f3dzkie"],
      experience: "0\u20131 rok do\u015bwiadczenia zawodowego",
      industries: ["administracja biurowa", "obs\u0142uga klienta telefoniczna", "hotelarstwo", "drobny handel", "sektor publiczny (sta\u017cysta)"],
      progression: `Awans z ${fmtInt(brutto)} do 6 000 PLN brutto wymaga zazwyczaj rozwini\u0119cia kompetencji specjalistycznych i 1-2 lat do\u015bwiadczenia.`,
    },
    6000: {
      title: "Specjalista pocz\u0105tkowy z umiej\u0119tno\u015bciami",
      roles: ["m\u0142odszy ksi\u0119gowy", "technik laboratoryjny", "specjalista ds. administracji", "asystent projektowy", "grafik junior"],
      cities: ["Lublin", "Bia\u0142ystok", "Rzesz\u00f3w", "Olsztyn", "Koszalin"],
      experience: "1\u20132 lata do\u015bwiadczenia w specjalizacji",
      industries: ["ksi\u0119gowo\u015b\u0107 (pocz\u0105tkowa)", "laboratoria medyczne", "administracja projekt\u00f3w", "grafika i DTP", "edukacja prywatna"],
      progression: `Awans z ${fmtInt(brutto)} do 7 000 PLN brutto wymaga certyfikacji bran\u017cowej lub przej\u015bcia do wi\u0119kszej firmy.`,
    },
    7000: {
      title: "Specjalista z kompetencjami rynkowymi",
      roles: ["programista junior (PHP/Python)", "specjalista ds. kadr i p\u0142ac", "handlowiec terenowy", "in\u017cynier wsparcia technicznego", "analityk danych pocz\u0105tkowy"],
      cities: ["\u0141\u00f3d\u017a", "Szczecin", "Bydgoszcz", "Katowice", "Toru\u0144"],
      experience: "2\u20133 lata do\u015bwiadczenia z potwierdzonymi wynikami",
      industries: ["IT (web development)", "kadry i p\u0142ace", "sprzeda\u017c B2B", "wsparcie techniczne", "analityka biznesowa"],
      progression: `Awans z ${fmtInt(brutto)} do 8 000 PLN brutto wymaga udokumentowanych projekt\u00f3w i samodzielno\u015bci w pracy.`,
    },
    8000: {
      title: "Specjalista \u015bredni z do\u015bwiadczeniem",
      roles: ["programista junior/mid (Java, .NET)", "ksi\u0119gowy z certyfikatem ACCA", "in\u017cynier procesu produkcji", "specjalista SEO/SEM", "koordynator logistyki"],
      cities: ["Krak\u00f3w (poza centrum)", "Wroc\u0142aw", "Pozna\u0144", "Tr\u00f3jmiasto (Gdynia)"],
      experience: "3\u20134 lata do\u015bwiadczenia z samodzieln\u0105 odpowiedzialno\u015bci\u0105",
      industries: ["IT (backend development)", "ksi\u0119gowo\u015b\u0107 korporacyjna", "in\u017cynieria produkcji", "marketing cyfrowy", "logistyka i \u0142a\u0144cuch dostaw"],
      progression: `Awans z ${fmtInt(brutto)} do 9 000 PLN brutto wymaga zazwyczaj przej\u0119cia odpowiedzialno\u015bci za podzesp\u00f3\u0142 lub kluczowy projekt.`,
    },
    9000: {
      title: "Specjalista do\u015bwiadczony mid-level",
      roles: ["specjalista ds. marketingu cyfrowego (senior)", "analityk danych (mid)", "in\u017cynier DevOps (junior)", "controller finansowy", "project manager (pocz\u0105tkowy)"],
      cities: ["Warszawa (przedmie\u015bcia)", "Krak\u00f3w (Nowa Huta IT)", "Wroc\u0142aw (centrum)", "Katowice (SSC)"],
      experience: "4\u20135 lat do\u015bwiadczenia z mierzalnymi osi\u0105gni\u0119ciami",
      industries: ["marketing i e-commerce", "data analytics", "DevOps i cloud", "controlling finansowy", "zarz\u0105dzanie projektami"],
      progression: `Awans z ${fmtInt(brutto)} do 10 000 PLN brutto wymaga wej\u015bcia na stanowisko seniorskie lub zmiany pracodawcy na wi\u0119kszego.`,
    },
    10000: {
      title: "Specjalista senior / pocz\u0105tkowy lider",
      roles: ["programista mid/senior (React, Angular)", "in\u017cynier automatyk", "senior analityk finansowy", "team leader ds. sprzeda\u017cy", "architekt rozwi\u0105za\u0144 (junior)"],
      cities: ["Warszawa (centrum)", "Krak\u00f3w (Zabierzow IT hub)", "Gda\u0144sk (Olivia Centre)"],
      experience: "5\u20137 lat do\u015bwiadczenia z elementami liderstwa",
      industries: ["IT (frontend/fullstack)", "automatyka przemys\u0142owa", "bankowo\u015b\u0107 i finanse", "zarz\u0105dzanie sprzeda\u017c\u0105", "konsulting technologiczny"],
      progression: `Awans z ${fmtInt(brutto)} do 12 000 PLN brutto wymaga potwierdzonych kompetencji liderskich i specjalizacji niszowej.`,
    },
    12000: {
      title: "Starszy specjalista / kierownik zespo\u0142u",
      roles: ["senior developer (backend, microservices)", "kierownik zespo\u0142u ksi\u0119gowego", "product owner", "in\u017cynier machine learning (mid)", "doradca podatkowy"],
      cities: ["Warszawa (Wola, Mokot\u00f3w)", "Krak\u00f3w (High5ive)", "Wroc\u0142aw (Business Garden)"],
      experience: "6\u20139 lat do\u015bwiadczenia z zarz\u0105dzaniem lud\u017ami lub produktem",
      industries: ["IT (systemy rozproszone)", "ksi\u0119gowo\u015b\u0107 zarz\u0105dcza", "product management", "sztuczna inteligencja", "doradztwo podatkowe"],
      progression: `Awans z ${fmtInt(brutto)} do 15 000 PLN brutto wymaga przej\u015bcia do roli mened\u017cerskiej lub eksperckiej w firmie technologicznej.`,
    },
    15000: {
      title: "Manager / ekspert bran\u017cowy",
      roles: ["engineering manager", "dyrektor finansowy M\u015aP", "senior product manager", "lekarz z pierwsz\u0105 specjalizacj\u0105", "prawnik z 8+ lat praktyki"],
      cities: ["Warszawa (CBD, \u015ar\u00f3dmie\u015bcie)", "Krak\u00f3w (g\u0142\u00f3wne huby IT)"],
      experience: "8\u201312 lat do\u015bwiadczenia z pe\u0142n\u0105 odpowiedzialno\u015bci\u0105 za zesp\u00f3\u0142 lub bud\u017cet",
      industries: ["IT (management)", "finanse korporacyjne", "product strategy", "medycyna specjalistyczna", "kancelarie prawne (\u015brednie)"],
      progression: `Awans z ${fmtInt(brutto)} do 18 000 PLN brutto wymaga przej\u0119cia odpowiedzialno\u015bci za ca\u0142y dzia\u0142 lub kluczowy obszar biznesowy.`,
    },
    18000: {
      title: "Dyrektor / senior ekspert techniczny",
      roles: ["dyrektor dzia\u0142u IT", "principal engineer", "partner w kancelarii \u015bredniej", "lekarz specjalista (chirurg, kardiolog)", "VP of Engineering (startup)"],
      cities: ["Warszawa (centrum biznesowe)", "Krak\u00f3w (Big Tech offices)"],
      experience: "10\u201315 lat do\u015bwiadczenia z udokumentowan\u0105 \u015bcie\u017ck\u0105 kariery",
      industries: ["IT (architektura system\u00f3w)", "prawo korporacyjne", "medycyna specjalistyczna", "zarz\u0105dzanie technologi\u0105", "venture capital"],
      progression: `Awans z ${fmtInt(brutto)} do 20 000 PLN brutto wymaga wej\u015bcia na poziom C-level lub uzyskania unikalnej ekspertyzy rynkowej.`,
    },
    20000: {
      title: "C-level / wybitny specjalista",
      roles: ["CTO startupu scaleup", "dyrektor finansowy (korporacja)", "senior architect (Big Tech)", "partner zarz\u0105dzaj\u0105cy (kancelaria)", "neurochirurg"],
      cities: ["Warszawa (Plac Europejski, Rondo ONZ)"],
      experience: "12\u201318 lat do\u015bwiadczenia z wp\u0142ywem na strategi\u0119 firmy",
      industries: ["technologia (Big Tech, scaleup)", "bankowo\u015b\u0107 inwestycyjna", "prawo M&A", "medycyna zabiegowa", "doradztwo strategiczne (MBB)"],
      progression: `Awans z ${fmtInt(brutto)} do 25 000 PLN brutto wymaga osi\u0105gni\u0119cia poziomu VP/C-suite w mi\u0119dzynarodowej korporacji.`,
    },
    25000: {
      title: "Top management / wyj\u0105tkowy talent",
      roles: ["CEO/COO sp\u00f3\u0142ki gie\u0142dowej", "VP w Big Tech (Google, Microsoft)", "partner equity w Big4", "ordynator oddzia\u0142u szpitalnego", "zarz\u0105dzaj\u0105cy funduszem PE/VC"],
      cities: ["Warszawa (CBD, mi\u0119dzynarodowe firmy)"],
      experience: "15+ lat do\u015bwiadczenia z pe\u0142n\u0105 odpowiedzialno\u015bci\u0105 za P&L",
      industries: ["C-suite management", "Big Tech (VP+)", "private equity/venture capital", "chirurgia specjalistyczna", "doradztwo strategiczne (partner)"],
      progression: `Przy ${fmtInt(brutto)} PLN brutto dalszy wzrost wynagrodzenia wymaga udzia\u0142\u00f3w w sp\u00f3\u0142ce, bonus\u00f3w rocznych lub przej\u015bcia na kontrakt B2B.`,
    },
  };

  // Fallback to band-based if exact amount not in map
  if (careerMap[brutto]) {
    return careerMap[brutto];
  }

  const band = getBand(brutto);
  const fallback: Record<Band, CareerInfo> = {
    minimalna: careerMap[4666],
    niska: careerMap[5000],
    srednia: careerMap[6000],
    dobra: careerMap[8000],
    wysoka: careerMap[15000],
    premium: careerMap[25000],
  };
  return fallback[band];
}

// \u2500\u2500 getTaxTips (with salary-specific calculations) \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getTaxTips(d: WynagrodzenieData): TaxTip[] {
  const band = getBand(d.brutto);
  const roczne = d.brutto * 12;

  // Salary-specific B2B savings estimate
  const b2bZus = 1700; // small ZUS in 2026
  const b2bPit = Math.round((d.brutto - b2bZus - (d.brutto - b2bZus) * 0.09) * 0.19);
  const b2bNetto = d.brutto - b2bZus - (d.brutto - b2bZus) * 0.09 - b2bPit;
  const b2bSavings = Math.round(b2bNetto - d.netto);

  // Distance to 2nd PIT threshold
  const rocznyDochod = Math.round((d.brutto - d.zusRazem - d.kosztyUzyskania) * 12);
  const gapToSecondThreshold = 120000 - rocznyDochod;

  const baseTips: TaxTip[] = [
    {
      title: `Koszty uzyskania przychodu przy ${fmtInt(d.brutto)} PLN brutto`,
      description:
        `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto standardowe koszty uzyskania to 250 PLN miesi\u0119cznie (3 000 PLN rocznie). ` +
        `Obni\u017caj\u0105 one Twoj\u0105 podstaw\u0119 opodatkowania z ${fmt(d.brutto - d.zusRazem)} PLN do ${fmt(d.podstawaOpodatkowania)} PLN. ` +
        `Je\u015bli doje\u017cd\u017casz do pracy z innej miejscowo\u015bci, podwy\u017cszone koszty 300 PLN miesi\u0119cznie ` +
        `obni\u017c\u0105 Tw\u00f3j PIT z ${fmt(d.pit)} PLN do ${fmt(d.pit - 6)} PLN, oszcz\u0119dzaj\u0105c ${fmt(50 * 0.12 * 12)} PLN rocznie.`,
    },
    {
      title: `Ulga PIT-2 \u2014 wp\u0142yw na netto ${fmtInt(d.brutto)} PLN brutto`,
      description:
        `Przy pensji ${fmtInt(d.brutto)} PLN brutto o\u015bwiadczenie PIT-2 obni\u017ca zaliczk\u0119 o 300 PLN miesi\u0119cznie. ` +
        `Bez PIT-2 Twoja zaliczka PIT wzros\u0142aby z ${fmt(d.pit)} PLN do ${fmt(d.pit + 300)} PLN, ` +
        `a netto spad\u0142oby z ${fmt(d.netto)} PLN do ${fmt(d.netto - 300)} PLN miesi\u0119cznie. ` +
        `Przy ${fmtInt(d.brutto)} PLN brutto brak PIT-2 oznacza utrat\u0119 3 600 PLN p\u0142ynno\u015bci rocznej (wyr\u00f3wnanie nast\u0119puje w zeznaniu PIT-37).`,
    },
  ];

  // Salary-specific B2B tip
  if (b2bSavings > 200) {
    baseTips.push({
      title: `Przej\u015bcie na B2B przy ${fmtInt(d.brutto)} PLN \u2014 kalkulacja`,
      description:
        `Przy Twoim wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto, przej\u015bcie na B2B zaoszcz\u0119dzi\u0142oby oko\u0142o ${fmtInt(b2bSavings)} z\u0142 miesi\u0119cznie. ` +
        `Na umowie o prac\u0119 Twoje netto to ${fmt(d.netto)} PLN, natomiast na B2B z liniowym PIT 19% ` +
        `i ma\u0142ym ZUS (${fmtInt(b2bZus)} PLN) otrzyma\u0142by\u015b oko\u0142o ${fmt(b2bNetto)} PLN. ` +
        `Nale\u017cy uwzgl\u0119dni\u0107 brak urlopu, L4, koszty ksi\u0119gowo\u015bci (200-500 PLN) i w\u0142asn\u0105 sk\u0142adk\u0119 zdrowotn\u0105.`,
    });
  }

  // Distance to 2nd threshold tip
  if (gapToSecondThreshold > 0 && gapToSecondThreshold < 50000) {
    baseTips.push({
      title: "Odleg\u0142o\u015b\u0107 do drugiego progu podatkowego",
      description:
        `Do drugiego progu podatkowego (32%) brakuje Ci ${fmtInt(gapToSecondThreshold)} z\u0142 rocznego dochodu. ` +
        `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto Tw\u00f3j roczny doch\u00f3d do opodatkowania wynosi oko\u0142o ${fmtInt(rocznyDochod)} PLN. ` +
        `Podwy\u017cka o ${fmtInt(Math.ceil(gapToSecondThreshold / 12))} PLN miesi\u0119cznie (do podstawy) spowodowa\u0142aby wej\u015bcie w stawk\u0119 32%. ` +
        `W takim przypadku ka\u017cde dodatkowe 100 PLN brutto dawa\u0142oby tylko oko\u0142o 44 PLN netto (zamiast 55 PLN).`,
    });
  } else if (gapToSecondThreshold <= 0) {
    baseTips.push({
      title: "Przekroczony pr\u00f3g 32% \u2014 strategie obni\u017cenia podatku",
      description:
        `Tw\u00f3j roczny doch\u00f3d do opodatkowania (${fmtInt(rocznyDochod)} PLN) przekracza pr\u00f3g 120 000 PLN o ${fmtInt(Math.abs(gapToSecondThreshold))} PLN. ` +
        `Nadwy\u017cka jest opodatkowana stawk\u0105 32% zamiast 12%. Miesi\u0119cznie oznacza to dodatkowy PIT oko\u0142o ` +
        `${fmtInt(Math.round(Math.abs(gapToSecondThreshold) * 0.20 / 12))} PLN. ` +
        `Wsp\u00f3lne rozliczenie z ma\u0142\u017conkiem mo\u017ce zredukowa\u0107 ten dodatkowy podatek do zera.`,
    });
  }

  if (roczne > 100000) {
    const savingsFromJoint = rocznyDochod > 120000 ? Math.round((rocznyDochod - 120000) * 0.20) : 0;
    baseTips.push({
      title: `Wsp\u00f3lne rozliczenie z ma\u0142\u017conkiem przy ${fmtInt(d.brutto)} PLN brutto`,
      description:
        `Przy rocznym brutto ${fmtInt(roczne)} PLN (doch\u00f3d ${fmtInt(rocznyDochod)} PLN) ${rocznyDochod > 120000 ? `nadwy\u017cka ${fmtInt(rocznyDochod - 120000)} PLN jest opodatkowana stawk\u0105 32%` : "zbli\u017casz si\u0119 do progu 32%"}. ` +
        `Wsp\u00f3lne rozliczenie z ma\u0142\u017conkiem zarabiaj\u0105cym poni\u017cej ${fmtInt(Math.round(120000 - rocznyDochod / 2))} PLN rocznego dochodu ` +
        `pozwoli utrzyma\u0107 ca\u0142y doch\u00f3d w stawce 12%. ` +
        (savingsFromJoint > 0 ? `Potencjalna roczna oszcz\u0119dno\u015b\u0107 to oko\u0142o ${fmtInt(savingsFromJoint)} PLN podatku (${fmtInt(Math.round(savingsFromJoint / 12))} PLN miesi\u0119cznie).` : ""),
    });
  }

  if (band === "premium") {
    const ipBoxSaving = Math.round(rocznyDochod * 0.27);
    baseTips.push({
      title: `Ulga IP Box przy dochodzie ${fmtInt(rocznyDochod)} PLN rocznie`,
      description:
        `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto i rocznym dochodzie ${fmtInt(rocznyDochod)} PLN, ulga IP Box (efektywny PIT 5%) ` +
        `zamiast stawki 32% da\u0142aby oszcz\u0119dno\u015b\u0107 oko\u0142o ${fmtInt(ipBoxSaving)} PLN rocznie (${fmtInt(Math.round(ipBoxSaving / 12))} PLN miesi\u0119cznie). ` +
        `IP Box dotyczy tw\u00f3rc\u00f3w oprogramowania, wynalazc\u00f3w i autor\u00f3w w\u0142asno\u015bci intelektualnej. ` +
        `Wymaga prowadzenia ewidencji B+R i interpretacji indywidualnej.`,
    });
  }

  return baseTips;
}

// \u2500\u2500 getUniqueComparisons \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getUniqueComparisons(d: WynagrodzenieData): string {
  const { prev, next } = getAdjacentSalaries(d.brutto);
  const raised = Math.round(d.brutto * 1.1);
  const raisedNetto = approxNetto(raised);
  const netDiff = raisedNetto - d.netto;

  const paragraphs: string[] = [];

  // 10% raise comparison
  paragraphs.push(
    `10% podwy\u017cka z ${fmtInt(d.brutto)} do ${fmtInt(raised)} z\u0142 brutto zwi\u0119kszy\u0142aby netto o oko\u0142o ${fmt(netDiff)} z\u0142 miesi\u0119cznie. ` +
    `Oznacza to, \u017ce z dodatkowych ${fmtInt(raised - d.brutto)} PLN brutto na r\u0119k\u0119 trafi\u0142oby ${fmt(netDiff)} PLN (${((netDiff / (raised - d.brutto)) * 100).toFixed(1)}%).`
  );

  // Previous salary comparison
  if (prev) {
    const prevNetto = approxNetto(prev);
    const nettoGain = d.netto - prevNetto;
    const zusGain = d.zusRazem - (prev * 0.1371);
    const bruttoStep = d.brutto - prev;
    const efficiency = ((nettoGain / bruttoStep) * 100).toFixed(1);
    paragraphs.push(
      `W por\u00f3wnaniu z wynagrodzeniem ${fmtInt(prev)} PLN brutto, pensja ${fmtInt(d.brutto)} PLN (r\u00f3\u017cnica ${fmtInt(bruttoStep)} PLN brutto) ` +
      `daje ${fmt(nettoGain)} PLN wi\u0119cej netto miesi\u0119cznie (efektywno\u015b\u0107 podwy\u017cki: ${efficiency}%). ` +
      `Z dodatkowych ${fmtInt(bruttoStep)} PLN brutto: ${fmt(zusGain)} PLN trafia na ZUS, ${fmt(bruttoStep - nettoGain - zusGain)} PLN na zdrowotn\u0105 i PIT, a ${fmt(nettoGain)} PLN na Twoje konto.`
    );
  }

  // Next salary comparison
  if (next) {
    const nextNetto = approxNetto(next);
    const nettoNeeded = nextNetto - d.netto;
    paragraphs.push(
      `Aby osi\u0105gn\u0105\u0107 kolejny poziom (${fmtInt(next)} PLN brutto), potrzebna jest podwy\u017cka ${fmtInt(next - d.brutto)} PLN brutto. ` +
      `Da\u0142oby to oko\u0142o ${fmt(nettoNeeded)} PLN wi\u0119cej netto miesi\u0119cznie i ${fmt(nettoNeeded * 12)} PLN wi\u0119cej rocznie.`
    );
  }

  // Percentage breakdown unique to this salary
  const zusPercent = ((d.zusRazem / d.brutto) * 100).toFixed(2);
  const zdrowPercent = ((d.zdrowotna / d.brutto) * 100).toFixed(2);
  const pitPercent = ((d.pit / d.brutto) * 100).toFixed(2);
  paragraphs.push(
    `Rozk\u0142ad potr\u0105ce\u0144 z ${fmtInt(d.brutto)} PLN brutto: sk\u0142adki ZUS stanowi\u0105 ${zusPercent}% brutto, ` +
    `sk\u0142adka zdrowotna ${zdrowPercent}% brutto, a zaliczka PIT ${pitPercent}% brutto. ` +
    `\u0141\u0105cznie pa\u0144stwo pobiera ${d.efektywnaStawka}% Twojego wynagrodzenia brutto.`
  );

  return paragraphs.join(" ");
}

// \u2500\u2500 getHowTaxWorksText \u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500\u2500

export function getHowTaxWorksText(d: WynagrodzenieData): string {
  const roczne = d.brutto * 12;
  const rocznyDochod = Math.round((d.brutto - d.zusRazem - d.kosztyUzyskania) * 12);
  const zusLimitRoczny = 235000;
  const distToZusLimit = zusLimitRoczny - roczne;
  const pitThreshold = 120000;
  const distToPitThreshold = pitThreshold - rocznyDochod;

  // Unique threshold paragraph
  let thresholdParagraph = "";
  if (distToPitThreshold > 0) {
    const monthsToThreshold = Math.ceil(distToPitThreshold / (d.podstawaOpodatkowania));
    thresholdParagraph =
      `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto miesi\u0119cznie, Tw\u00f3j roczny doch\u00f3d do opodatkowania wynosi ${fmtInt(rocznyDochod)} PLN. ` +
      `Mie\u015bcisz si\u0119 w pierwszym progu podatkowym (12%) z zapasem ${fmtInt(distToPitThreshold)} PLN \u2014 ` +
      `musieliby\u015b zarabia\u0107 ${fmtInt(Math.ceil(distToPitThreshold / 12))} PLN wi\u0119cej dochodu miesi\u0119cznie, aby wej\u015b\u0107 w stawk\u0119 32%. ` +
      `Przy ${fmtInt(d.brutto)} PLN brutto ka\u017cda podwy\u017cka o 100 PLN daje oko\u0142o 55 PLN netto (ZUS 13,71 PLN + zdrowotna 7,77 PLN + PIT 12% od reszty). `;
  } else {
    const excess = Math.abs(distToPitThreshold);
    const extraTax = Math.round(excess * 0.20 / 12);
    thresholdParagraph =
      `Przy wynagrodzeniu ${fmtInt(d.brutto)} PLN brutto miesi\u0119cznie, Tw\u00f3j roczny doch\u00f3d do opodatkowania wynosi ${fmtInt(rocznyDochod)} PLN. ` +
      `Przekraczasz pr\u00f3g 120 000 PLN o ${fmtInt(excess)} PLN rocznie, co przy pensji ${fmtInt(d.brutto)} PLN oznacza ` +
      `dodatkowy podatek oko\u0142o ${fmtInt(extraTax)} PLN miesi\u0119cznie (r\u00f3\u017cnica mi\u0119dzy stawk\u0105 32% a 12% od nadwy\u017cki). ` +
      `Przy ${fmtInt(d.brutto)} PLN brutto ka\u017cde kolejne 100 PLN podwy\u017cki daje tylko 44 PLN netto. ` +
      `Rozliczaj\u0105c si\u0119 wsp\u00f3lnie z ma\u0142\u017conkiem, mo\u017cna zaoszcz\u0119dzi\u0107 do ${fmtInt(extraTax * 12)} PLN rocznego podatku. `;
  }

  // ZUS limit paragraph
  let zusLimitParagraph = "";
  if (distToZusLimit > 0 && distToZusLimit < 100000) {
    const monthsToZusLimit = Math.ceil(zusLimitRoczny / d.brutto);
    zusLimitParagraph =
      `Przy pensji ${fmtInt(d.brutto)} PLN brutto (roczne ${fmtInt(roczne)} PLN) do limitu ZUS ${fmtInt(zusLimitRoczny)} PLN brakuje ${fmtInt(distToZusLimit)} PLN. ` +
      `Gdyby\u015b zarabia\u0142/a wi\u0119cej (np. ${fmtInt(Math.ceil(zusLimitRoczny / 12))} PLN brutto miesi\u0119cznie), po ${monthsToZusLimit} miesi\u0105cach ` +
      `sk\u0142adki emerytalna (${fmt(d.emerytalne)} PLN) i rentowa (${fmt(d.rentowe)} PLN) przesta\u0142yby by\u0107 naliczane.`;
  } else if (distToZusLimit <= 0) {
    const miesiacPrzekroczenia = Math.ceil(zusLimitRoczny / d.brutto);
    zusLimitParagraph =
      `Przy pensji ${fmtInt(d.brutto)} PLN brutto roczny przych\u00f3d ${fmtInt(roczne)} PLN przekracza limit ZUS (${fmtInt(zusLimitRoczny)} PLN). ` +
      `W ${miesiacPrzekroczenia}. miesi\u0105cu roku sk\u0142adki emerytalna (${fmt(d.emerytalne)} PLN) i rentowa (${fmt(d.rentowe)} PLN) przestan\u0105 by\u0107 pobierane. ` +
      `Od tego momentu Twoje miesi\u0119czne netto z ${fmtInt(d.brutto)} PLN brutto wzro\u015bnie o ${fmt(d.emerytalne + d.rentowe)} PLN do oko\u0142o ${fmt(d.netto + d.emerytalne + d.rentowe)} PLN.`;
  }

  return (
    `Jak obliczono ${fmt(d.netto)} PLN netto z ${fmtInt(d.brutto)} PLN brutto? Wynagrodzenie na umowie o prac\u0119 podlega trzem filarom obci\u0105\u017ce\u0144. ` +
    `Filar pierwszy: sk\u0142adki ZUS od wynagrodzenia ${fmtInt(d.brutto)} PLN brutto wynosz\u0105 \u0142\u0105cznie ${fmt(d.zusRazem)} PLN (13,71% brutto). ` +
    `W tym: emerytalna 9,76% = ${fmt(d.emerytalne)} PLN, rentowa 1,5% = ${fmt(d.rentowe)} PLN, chorobowa 2,45% = ${fmt(d.chorobowe)} PLN. ` +
    `Filar drugi: sk\u0142adka zdrowotna 9% naliczana od podstawy ${fmt(d.podstawaZdrowotna)} PLN (${fmtInt(d.brutto)} PLN minus ${fmt(d.zusRazem)} PLN ZUS) = ${fmt(d.zdrowotna)} PLN. ` +
    `Filar trzeci: podatek PIT od ${fmtInt(d.brutto)} PLN brutto. Podstawa opodatkowania: ${fmt(d.podstawaOpodatkowania)} PLN ` +
    `(${fmtInt(d.brutto)} PLN brutto - ${fmt(d.zusRazem)} PLN ZUS - ${fmtInt(d.kosztyUzyskania)} PLN koszty uzyskania). ` +
    `Stawka 12% od ${fmt(d.podstawaOpodatkowania)} PLN daje ${fmt(d.podstawaOpodatkowania * 0.12)} PLN, minus ulga 300 PLN = zaliczka PIT ${fmt(d.pit)} PLN. ` +
    `Wyliczenie netto: ${fmtInt(d.brutto)} PLN - ${fmt(d.zusRazem)} PLN - ${fmt(d.zdrowotna)} PLN - ${fmt(d.pit)} PLN = ${fmt(d.netto)} PLN na r\u0119k\u0119. ` +
    `Kwota wolna od podatku (30 000 PLN rocznie) przy pensji ${fmtInt(d.brutto)} PLN brutto realizuje si\u0119 poprzez miesi\u0119czn\u0105 ulg\u0119 300 PLN, ` +
    `kt\u00f3ra obni\u017ca Twoj\u0105 zaliczk\u0119 PIT z ${fmt(d.pit + 300)} PLN do ${fmt(d.pit)} PLN. ` +
    thresholdParagraph +
    zusLimitParagraph
  );
}
