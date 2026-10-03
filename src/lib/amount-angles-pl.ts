/** Angles des pages « X zł brutto ile netto » en polonais (RECETTE §6.2) : un seuil propre par montant.
 *  Toutes les valeurs viennent du moteur (contexte `c` ou calculs ci-dessous) ; la donnée choisit la phrase (§6.4). */
import type { AngleFn } from './amount-types';
import { uop, uopYear, zlecenie, b2b, sickPay, PARAMS as P } from './engine/pl';
import { pct } from './format';
import { route, AMOUNTS } from '../i18n/routes';

/** Miejscownik i dopełniacz nazw miesięcy (1–12). */
const LOC = ['styczniu', 'lutym', 'marcu', 'kwietniu', 'maju', 'czerwcu', 'lipcu', 'sierpniu', 'wrześniu', 'październiku', 'listopadzie', 'grudniu'];
const GEN = ['stycznia', 'lutego', 'marca', 'kwietnia', 'maja', 'czerwca', 'lipca', 'sierpnia', 'września', 'października', 'listopada', 'grudnia'];
const RY = P.b2b.ryczalt_rates[0].rate;
const PPK_LOW = P.ppk.low_income_multiple * P.minimum_wage.monthly;
/** Pierwszy miesiąc z podatkiem 32 % (1–12) albo null. */
const bracketNo = (months: Array<{ secondBracket: boolean; month: number }>) => months.find((m) => m.secondBracket)?.month ?? null;
const ryczNet = (revenue: number) => b2b({ revenue, form: 'ryczalt', ryczaltRate: RY }).net;
const linNet = (revenue: number) => b2b({ revenue, form: 'liniowy' }).net;

/* ------------------------------------------------------------------ 5000 */
const a5000: AngleFn = (c) => {
  const { F, $ } = c;
  const minNet = uop({ gross: P.minimum_wage.monthly }).net;
  const grossGap = c.amount - P.minimum_wage.monthly, netGap = c.raw.net - minNet;
  const keep = pct(netGap / grossGap, 'pl');
  const ppkMin = uop({ gross: c.amount, ppk: true, ppkEmployeeRate: P.ppk.employee_min }).net;
  const lowPpk = c.amount <= PPK_LOW;
  const youthYear = uopYear({ gross: c.amount, under26: true }).total.net;
  const youthAll = c.amount * 12 <= P.pit.youth_exempt_limit;
  const pit2Share = pct((P.pit.tax_reducing_amount_year / 12) / c.raw.net, 'pl');
  return {
    title: `${c.amount} zł brutto ile netto ${F.year}? ${c.net} na rękę z PIT-2`,
    description: `${c.amount} zł brutto to w ${F.year} r. ${c.net} netto na etacie, ledwie ${$(netGap)} więcej niż przy płacy minimalnej. Ile zmienia PIT-2, PPK i ulga dla młodych w praktyce.`,
    h1: `${c.amount} zł brutto ile netto w ${F.year} r.?`,
    intro: `Na umowie o pracę, ze złożonym PIT-2 i podstawowymi kosztami ${F.kup}, z ${c.gross} brutto zostaje ${c.net} na rękę.`,
    resume: `${c.gross} brutto to w ${F.year} r. ${c.net} netto miesięcznie na umowie o pracę, jeśli pracodawca ma Twoje oświadczenie PIT-2 i stosuje podstawowe koszty uzyskania przychodu ${F.kup}. Ta pensja jest zaledwie o ${c.ratioMin} wyższa od płacy minimalnej ${F.minWage}, a na rękę daje ${$(netGap)} więcej niż minimalne netto ${F.minNet}. Z kwoty brutto odchodzą składki ZUS pracownika ${c.social}, składka zdrowotna ${c.health} i zaliczka na podatek ${c.pit}. Przy tak niskiej zaliczce dwie decyzje ważą bardziej niż przy wyższych zarobkach: bez PIT-2 wypłata spada do ${c.netNoPit2}, a osoba przed 26. urodzinami, objęta ulgą dla młodych, dostaje ${c.netU26}${youthAll ? `, i to przez wszystkie dwanaście miesięcy, bo roczny przychód mieści się w limicie ${F.youthLimit}` : ''}. W skali roku etat daje ${c.netYear} netto, a pracodawcę kosztuje ${c.cost} miesięcznie, bo do pensji dolicza on własne składki.`,
    sections: [
      {
        h2: 'Ile zostaje z nadwyżki ponad płacę minimalną',
        html: `<p>Różnica między ${c.gross} a płacą minimalną to ${$(grossGap)} brutto. Na rękę z tej nadwyżki trafia ${$(netGap)}, czyli około ${keep}. Reszta rozchodzi się na składki emerytalną, rentową i chorobową, składkę zdrowotną ${F.health} i podatek ${F.pitLow}. To dobra miara, gdy negocjujesz podwyżkę o kilkaset złotych: realny przyrost wypłaty zawsze jest wyraźnie mniejszy od kwoty zapisanej w aneksie.</p>
<p>Pracodawca patrzy na tę samą podwyżkę z drugiej strony. Każda złotówka brutto kosztuje go więcej, bo dopłaca swoją część emerytalnej i rentowej, wypadkową, Fundusz Pracy z Funduszem Solidarnościowym oraz FGŚP. Przy tej pensji jego łączny wydatek to ${c.cost}, o ${c.erTotal} więcej niż kwota brutto. Szczegóły pokazuje strona o <a href="${route('employer', 'pl')}">koszcie pracodawcy</a>.</p>`,
      },
      {
        h2: 'PIT-2 i ulga dla młodych przy niskiej zaliczce',
        html: `<p>Zaliczka na podatek wynosi tu tylko ${c.pit}, bo pracodawca odejmuje od niej co miesiąc ${F.reducingMonth} kwoty zmniejszającej. Ta ulga stanowi mniej więcej ${pit2Share} Twojego netto. Jeśli nie złożysz <a href="${route('pit2', 'pl')}">oświadczenia PIT-2</a>, dostaniesz ${c.netNoPit2} i odzyskasz różnicę dopiero w zeznaniu rocznym. Przy pierwszej pracy po studiach to częsty błąd: formularz nie jest obowiązkowy, więc kadry nie zawsze o niego proszą.</p>
<p>Inaczej liczy się wypłata osoby, która nie skończyła 26 lat. <a href="${route('youth', 'pl')}">Ulga dla młodych</a> zwalnia przychód z PIT do ${F.youthLimit} rocznie, więc zaliczka znika, a na rękę zostaje ${c.netU26}. Składki ZUS i zdrowotna zostają jednak potrącone w pełnej wysokości. ${youthAll ? `Przy ${c.gross} miesięcznie limit nie wyczerpie się do końca roku, a roczne netto rośnie do ${$(youthYear)}.` : `Limit wyczerpie się przed końcem roku, więc ostatnie wypłaty będą niższe.`}</p>`,
      },
      {
        h2: `PPK: czy wolno wpłacać tylko ${F.ppkEeMin}`,
        html: `<p>Standardowo potrącenie na PPK to ${F.ppkEe} pensji, a netto spada wtedy do ${c.netPpk}. Ustawa pozwala jednak obniżyć własną wpłatę nawet do ${F.ppkEeMin}, gdy wynagrodzenie z różnych źródeł w danym miesiącu nie przekracza 1,2-krotności płacy minimalnej, czyli ${F.ppkLowIncome}. ${lowPpk ? `${c.gross} mieści się pod tą granicą, więc przy jednym etacie możesz złożyć takie oświadczenie i dostawać ${$(ppkMin)} zamiast ${c.netPpk}.` : `${c.gross} przekracza tę granicę, więc obniżona stawka nie przysługuje.`}</p>
<p>Warto pamiętać, że wpłata pracodawcy ${F.ppkEr} nie zależy od Twojej stawki. Dorabiając na zleceniu, sprawdź sumę obu przychodów, bo to ona decyduje o prawie do niższej wpłaty. Więcej wyliczeń znajdziesz w <a href="${route('ppk', 'pl')}">kalkulatorze PPK</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Czy przy ${c.amount} zł brutto opłaca się składać PIT-2?`, a: `Tak. Bez oświadczenia PIT-2 dostaniesz ${c.netNoPit2} zamiast ${c.net}, bo pracodawca nie odejmie od zaliczki ${F.reducingMonth}. Pieniądze nie przepadają, wracają w zeznaniu rocznym, ale przez cały rok masz niższą wypłatę. Przy pensji tak bliskiej minimalnej ta kwota ma odczuwalne znaczenie dla domowego budżetu, a formularz składa się raz i działa do odwołania.` },
      { q: `Ile dostanę na rękę z ${c.amount} zł brutto przed 26. urodzinami?`, a: `Z ulgą dla młodych ${c.netU26} miesięcznie, bo pracodawca nie pobiera zaliczki na PIT. ZUS ${c.social} i składka zdrowotna ${c.health} zostają potrącone jak u starszych pracowników. ${youthAll ? `Roczny przychód nie przekracza limitu ${F.youthLimit}, więc ulga działa w każdym miesiącu roku.` : `Po przekroczeniu limitu ${F.youthLimit} zaliczka wraca.`} Ulga przysługuje do dnia 26. urodzin.` },
      { q: `Czy przy pensji ${c.amount} zł mogę obniżyć wpłatę do PPK do ${F.ppkEeMin}?`, a: `${lowPpk ? `Tak, jeśli to Twój jedyny przychód albo suma wynagrodzeń w miesiącu nie przekracza ${F.ppkLowIncome}. Wtedy na rękę zostaje ${$(ppkMin)} zamiast ${c.netPpk} przy stawce ${F.ppkEe}.` : `Nie, bo ${c.gross} przekracza ${F.ppkLowIncome}.`} Obniżenie wymaga złożenia pracodawcy oświadczenia, a wpłata firmy ${F.ppkEr} pozostaje bez zmian.` },
      { q: `O ile ${c.amount} zł brutto daje więcej na rękę niż płaca minimalna?`, a: `O ${$(netGap)} miesięcznie: ${c.net} wobec ${F.minNet} przy płacy minimalnej ${F.minWage}. W brutto różnica to ${$(grossGap)}, więc do kieszeni trafia około ${keep} nadwyżki. Rocznie daje to mniej więcej ${$(netGap * 12)} więcej, przy założeniu PIT-2 i podstawowych kosztów uzyskania przychodu w obu przypadkach.` },
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
    title: `${c.amount} zł brutto netto ${F.year}: ${c.net} na rękę, PPK i dojazd`,
    description: `${c.amount} zł brutto daje w ${F.year} r. ${c.net} netto, a z PPK ${c.netPpk}. Dlaczego nie obniżysz wpłaty do ${F.ppkEeMin}, ile dają koszty dojazdu i jak czytać pasek wypłaty.`,
    h1: `${c.amount} zł brutto na rękę w ${F.year} r.`,
    intro: `Etat za ${c.gross} brutto to ${c.net} netto miesięcznie przy PIT-2 i kosztach ${F.kup}.`,
    resume: `Przy ${c.gross} brutto na umowie o pracę dostajesz w ${F.year} r. ${c.net} na rękę, o ile złożyłeś PIT-2 i pracujesz w miejscowości, w której mieszkasz. Pensja wyprzedza płacę minimalną o ${c.ratioMin} i właśnie na tym poziomie mija granica ważna dla oszczędzających w PPK: ${F.ppkLowIncome}, czyli 1,2-krotność płacy minimalnej. ${over ? `Ponieważ ${c.gross} jest wyżej, nie możesz już obniżyć własnej wpłaty poniżej ${F.ppkEe}, a uczestnictwo w programie zmniejsza wypłatę do ${c.netPpk}.` : `Pensja mieści się pod tą granicą, więc możesz obniżyć własną wpłatę.`} Dojeżdżający z innej miejscowości mogą odliczać podwyższone koszty ${F.kupRaised}, co podnosi netto do ${c.netRaised}, czyli tylko o ${$(raisedGain)}. Rocznie etat daje ${c.netYear} netto, co odpowiada średnio tej samej kwocie w każdym miesiącu. Zleceniobiorca z tą samą kwotą brutto, bez PIT-2 u zleceniodawcy, otrzymałby ${c.zlecNet}, a pracodawca wydaje na Twój etat ${c.cost} miesięcznie.`,
    sections: [
      {
        h2: 'Granica PPK przekroczona o kilkaset złotych',
        html: `<p>Ustawa o PPK pozwala uczestnikowi zejść z wpłatą podstawową do ${F.ppkEeMin}, tylko gdy jego wynagrodzenie z różnych źródeł nie przekracza w miesiącu ${F.ppkLowIncome}. ${over ? `${c.gross} wychodzi ponad tę kwotę o ${$(c.amount - PPK_LOW)}, więc pracodawca musi potrącać pełne ${F.ppkEe}, czyli ${$(m.gross * P.ppk.employee_basic)} miesięcznie. Z tej perspektywy ${c.gross} to pierwszy poziom w naszym zestawieniu, na którym obniżona stawka już nie wchodzi w grę.` : `${c.gross} mieści się pod granicą.`}</p>
<p>Zostają dwie drogi: płacić ${F.ppkEe} i korzystać z dopłat albo złożyć deklarację rezygnacji. W PPK do Twojej wpłaty dochodzi ${F.ppkEr} od pracodawcy (${$(mp.ppkEmployer)} miesięcznie), a państwo dokłada ${F.ppkWelcome} na powitanie i ${F.ppkAnnual} rocznie. Rezygnacja podnosi wypłatę, ale te dopłaty przepadają. Wyliczenia dla innych stawek pokazuje <a href="${route('ppk', 'pl')}">kalkulator PPK</a>.</p>`,
      },
      {
        h2: 'Koszty dla dojeżdżających: realny zysk',
        html: `<p>Podwyższone koszty uzyskania przychodu wynoszą ${F.kupRaised} zamiast ${F.kup} miesięcznie i przysługują, gdy mieszkasz poza miejscowością, w której jest zakład pracy. Różnica w kosztach to kilkadziesiąt złotych, ale podatek liczy się od niej według stawki ${F.pitLow}, więc wypłata rośnie o ${$(raisedGain)}, a w roku o ${$(raisedGain * 12)}. To zysk symboliczny, ale darmowy: wystarczy oświadczenie złożone w kadrach.</p>
<p>Nie myl tego z dodatkiem za dojazd ani zwrotem kosztów biletu. Podwyższone koszty nie dają pieniędzy wprost, jedynie obniżają podstawę opodatkowania. Pełne zasady opisuje poradnik o <a href="${route('kup', 'pl')}">kosztach uzyskania przychodu</a>.</p>`,
      },
      {
        h2: `Pasek wypłaty przy ${c.gross} linijka po linijce`,
        html: `<p>Na pasku zobaczysz najpierw składki społeczne: emerytalną ${$(m.emerytalna)} (${F.emerytalnaEe}), rentową ${$(m.rentowa)} (${F.rentowaEe}) i chorobową ${$(m.chorobowa)} (${F.chorobowa}). Razem to ${c.social}. Od kwoty pomniejszonej o te składki kadry liczą składkę zdrowotną ${c.health}, której nie odliczysz od podatku. Podstawa opodatkowania wynosi ${$(m.taxBase)}, a zaliczka po odjęciu ${F.reducingMonth} z PIT-2 to ${c.pit}.</p>
<p>Jeśli na pasku pojawia się dodatkowa pozycja PPK, odejmij ją od netto. Gdy zaliczka jest o ${F.reducingMonth} wyższa niż tutaj, prawdopodobnie pracodawca nie ma Twojego PIT-2.</p>`,
      },
    ],
    faqs: [
      { q: `Dlaczego przy ${c.amount} zł brutto nie mogę wpłacać do PPK mniej niż ${F.ppkEe}?`, a: `${over ? `Bo obniżona wpłata, od ${F.ppkEeMin}, przysługuje tylko przy wynagrodzeniu nieprzekraczającym ${F.ppkLowIncome} miesięcznie, a ${c.gross} jest wyżej o ${$(c.amount - PPK_LOW)}.` : `Możesz, bo ${c.gross} nie przekracza ${F.ppkLowIncome}.`} Masz więc wybór między pełną wpłatą ${F.ppkEe} a rezygnacją z programu. Przy pełnej wpłacie na rękę zostaje ${c.netPpk}.` },
      { q: `Ile zyskam na podwyższonych kosztach dojazdu przy ${c.amount} zł brutto?`, a: `Wypłata wzrośnie o ${$(raisedGain)} miesięcznie, do ${c.netRaised}, a w ciągu roku o około ${$(raisedGain * 12)}. Koszty rosną z ${F.kup} do ${F.kupRaised}, ale oszczędność to tylko podatek ${F.pitLow} od tej różnicy. Prawo do nich ma osoba mieszkająca poza miejscowością, w której znajduje się zakład pracy, po złożeniu oświadczenia pracodawcy.` },
      { q: `Ile kosztuje mnie udział w PPK przy pensji ${c.amount} zł?`, a: `Twoja wpłata ${F.ppkEe} to ${$(c.amount * P.ppk.employee_basic)} miesięcznie, a według kalkulatora, który traktuje wpłatę pracodawcy jako Twój przychód, netto spada łącznie o ${$(c.raw.net - mp.net)}: z ${c.net} do ${c.netPpk}. W zamian na rachunek PPK trafia też ${$(mp.ppkEmployer)} od firmy co miesiąc i dopłaty państwa.` },
      { q: `Ile pracodawca płaci za etat ${c.amount} zł brutto z PPK?`, a: `Bez PPK łączny koszt to ${c.cost} miesięcznie. Z PPK dochodzi wpłata pracodawcy ${F.ppkEr}, więc wydatek rośnie do ${$(mp.er.cost)}. Na koszt składają się pensja, składki emerytalna i rentowa po stronie firmy, wypadkowa, Fundusz Pracy z Funduszem Solidarnościowym i FGŚP.` },
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
    title: `${c.amount} zł brutto netto ${F.year}: etat ${c.net}, zlecenie ${c.zlecNet}`,
    description: `${c.amount} zł brutto w ${F.year} r.: ${c.net} netto na etacie i ${c.zlecNet} na zleceniu. Wpływ PIT-2, koszt dobrowolnego chorobowego i czego nie widać w samej kwocie netto.`,
    h1: `${c.amount} zł brutto: etat czy zlecenie w ${F.year} r.`,
    intro: `Umowa o pracę za ${c.gross} brutto daje ${c.net} na rękę, umowa zlecenie z tą samą stawką ${c.zlecNet}.`,
    resume: `Z ${c.gross} brutto na umowie o pracę zostaje w ${F.year} r. ${c.net} netto, przy PIT-2 i podstawowych kosztach ${F.kup}. Ta sama kwota na umowie zlecenie, bez oświadczenia PIT-2 i bez dobrowolnej składki chorobowej, daje ${c.zlecNet}, czyli ${diff >= 0 ? `o ${$(diff)} mniej` : `o ${$(-diff)} więcej`}. Różnica jest mała, bo zleceniobiorca nie płaci składki chorobowej, a koszty uzyskania przychodu wynoszą u niego ${F.kupContract} po odjęciu składek, zamiast stałych ${F.kup}. Obraz się zmienia, gdy zleceniodawca stosuje PIT-2: wtedy zlecenie daje ${$(zPit2)}. Z dobrowolnym chorobowym spada do ${$(zSick)} bez PIT-2 albo ${$(zBoth)} z PIT-2. Przy porównaniu ofert to jednak nie wszystko. Kwota netto nie pokazuje płatnego urlopu, wynagrodzenia chorobowego od pracodawcy ani okresu wypowiedzenia, które daje tylko etat. Dla zleceniodawcy koszt to ${$(zCost)}, dla pracodawcy na etacie ${c.cost}.`,
    sections: [
      {
        h2: `Etat czy zlecenie przy ${c.gross}: różnica w złotówkach`,
        html: `<ul>
<li><strong>Umowa o pracę:</strong> ${c.net} netto, w tym potrącona chorobowa ${F.chorobowa} i zaliczka po odjęciu ${F.reducingMonth}.</li>
<li><strong>Zlecenie bez PIT-2 i bez chorobowego:</strong> ${c.zlecNet}.</li>
<li><strong>Zlecenie z PIT-2:</strong> ${$(zPit2)}.</li>
<li><strong>Zlecenie z PIT-2 i dobrowolnym chorobowym:</strong> ${$(zBoth)}.</li>
</ul>
<p>${zBoth < c.raw.net ? `Przy pełnym, porównywalnym zestawie ochrony zlecenie wypada słabiej od etatu.` : `Nawet przy pełnym zestawie ochrony zlecenie daje tu nieco więcej niż etat, ale bez praw pracowniczych.`} Jeśli PIT-2 ma już pracodawca z etatu, kwotę zmniejszającą trzeba podzielić między płatników albo zostawić ją u jednego z nich. Szczegółowe porównanie z dziełem zawiera strona <a href="${route('zlecdzielo', 'pl')}">umowa zlecenie czy o dzieło</a>, a samo zlecenie przelicza <a href="${route('zlecenie', 'pl')}">kalkulator umowy zlecenie</a>.</p>`,
      },
      {
        h2: 'Dobrowolne chorobowe: ile kosztuje i co daje',
        html: `<p>Na zleceniu składka chorobowa ${F.chorobowa} jest dobrowolna: zleceniobiorca przystępuje do ubezpieczenia na własny wniosek. Przy ${c.gross} kosztuje to ${$(c.raw.zlecNet - zSick)} netto miesięcznie. Bez niej, gdy zachorujesz, nie dostaniesz zasiłku chorobowego, a zlecenie zwykle płaci tylko za wykonaną pracę.</p>
<p>Na etacie ta składka jest obowiązkowa, a za pierwsze ${F.sickDays} dni choroby w roku płaci pracodawca, ${F.sickRate} wynagrodzenia. Przy tej pensji dzienna stawka chorobowego wynosi ${$(sick.daily)} brutto, więc 10 dni zwolnienia to ${$(sick.benefit)} zamiast ${$(sick.lostSalary)} za przepracowane dni. Wylicz swój przypadek w <a href="${route('sick', 'pl')}">kalkulatorze chorobowego</a>.</p>`,
      },
      {
        h2: 'Czego nie widać w kwocie netto',
        html: `<p>Pracownik na etacie ma płatny urlop wypoczynkowy, okres wypowiedzenia i ochronę z Kodeksu pracy, a zleceniobiorca dostaje wynagrodzenie tylko za zlecone godziny lub zadania. Jeśli zlecenie ma zastąpić etat za ${c.gross}, zapytaj, czy stawka uwzględnia dni wolne, i przelicz ją na godziny. Przy umowie zlecenie obowiązuje też minimalna stawka godzinowa ${F.minHourly} brutto.</p>`,
      },
    ],
    faqs: [
      { q: `Czy na zleceniu za ${c.amount} zł brutto dostanę więcej niż na etacie?`, a: `Zależy od oświadczeń. Bez PIT-2 i bez chorobowego zlecenie daje ${c.zlecNet}, etat ${c.net}. Jeśli zleceniodawca uwzględni PIT-2, wypłata ze zlecenia rośnie do ${$(zPit2)}, ${zPit2 > c.raw.net ? 'więc przewyższa etat' : 'ale wciąż nie dorównuje etatowi'}. Na etacie dostajesz jednak płatny urlop, wynagrodzenie chorobowe od pracodawcy i okres wypowiedzenia, których zlecenie nie zapewnia.` },
      { q: `Ile kosztuje dobrowolne chorobowe na zleceniu za ${c.amount} zł?`, a: `Składka wynosi ${F.chorobowa} wynagrodzenia i obniża netto o ${$(c.raw.zlecNet - zSick)} miesięcznie: z ${c.zlecNet} do ${$(zSick)}, bez PIT-2. Część tej kwoty wraca w niższym podatku, bo składka zmniejsza podstawę opodatkowania. W zamian zyskujesz prawo do zasiłku chorobowego, którego bez tej składki zleceniobiorca nie dostanie.` },
      { q: `Ile wyniesie chorobowe przy pensji ${c.amount} zł brutto na etacie?`, a: `Podstawą jest pensja pomniejszona o składki ${F.sickReduction}, a stawka to ${F.sickRate}. Daje to ${$(sick.daily)} brutto za dzień zwolnienia. Dziesięć dni choroby to ${$(sick.benefit)} zamiast ${$(sick.lostSalary)}. Od tej kwoty nie potrąca się składek społecznych, ale składka zdrowotna i zaliczka na podatek pozostają.` },
      { q: `Czy zleceniodawca uwzględni PIT-2 przy umowie na ${c.amount} zł?`, a: `Tak, jeśli złożysz mu oświadczenie, bo od 2022 r. ustawa obejmuje PIT-2 także umowy zlecenia. Wypłata rośnie wtedy z ${c.zlecNet} do ${$(zPit2)}. Kwotę ${F.reducingMonth} można odliczać tylko u jednego płatnika albo podzielić między dwóch lub trzech, więc przy równoległym etacie trzeba wybrać.` },
    ],
  };
};

/* ------------------------------------------------------------------ 8000 */
const a8000: AngleFn = (c) => {
  const { F, $ } = c;
  const rCost = ryczNet(c.raw.cost), lCost = linNet(c.raw.cost);
  const prev = AMOUNTS[AMOUNTS.indexOf(c.amount as (typeof AMOUNTS)[number]) - 1] ?? c.amount;
  const prevCost = uop({ gross: prev }).er.cost, prevNet = uop({ gross: prev }).net;
  const firstHere = rCost > c.raw.net && ryczNet(prevCost) <= prevNet;
  let parity = Math.ceil(c.raw.net / 10) * 10; while (ryczNet(parity) < c.raw.net) parity += 10;
  const band2 = c.raw.cost * 12 > P.b2b.health.ryczalt_bands[0].revenue_up_to;
  return {
    title: `${c.amount} brutto netto ${F.year}: ${c.net} na etacie, a ile na B2B`,
    description: `Etat za ${c.amount} zł brutto daje w ${F.year} r. ${c.net} netto. Faktura B2B na ${c.cost}, czyli koszt pracodawcy, zostawia na ryczałcie IT ${$(rCost)}. Pełne porównanie.`,
    h1: `${c.amount} zł brutto: etat a faktura B2B w ${F.year} r.`,
    intro: `Na umowie o pracę ${c.gross} brutto to ${c.net} na rękę, a firma wydaje na ten etat ${c.cost}.`,
    resume: `${c.gross} brutto na etacie daje w ${F.year} r. ${c.net} netto miesięcznie, a pracodawcę kosztuje ${c.cost}. Przy tej pensji coraz częściej pada propozycja przejścia na B2B i tu łatwo się pomylić. Faktura na kwotę równą pensji brutto, czyli ${c.gross} netto bez VAT, zostawia na ryczałcie ${pct(RY, 'pl')} dla IT tylko ${c.b2bRyczNet}, bo przedsiębiorca sam płaci pełny ZUS ${F.b2bZusFull} i ryczałtową składkę zdrowotną. Uczciwe porównanie zaczyna się od faktury równej kosztowi pracodawcy: wtedy ryczałt daje ${$(rCost)}, a podatek liniowy ${$(lCost)}, ${rCost > c.raw.net ? `czyli więcej niż etat` : `czyli wciąż mniej niż etat`}. ${firstHere ? `W naszym zestawieniu to pierwszy poziom, na którym B2B przy takiej fakturze wyprzedza umowę o pracę; przy niższych pensjach etat wygrywa.` : ''} Żeby dorównać etatowemu netto, wystarczy faktura około ${$(parity)} miesięcznie. W tych liczbach nie ma płatnego urlopu ani chorobowego.`,
    sections: [
      {
        h2: `Faktura na ${c.gross} to nie pensja ${c.gross}`,
        html: `<p>Pensja brutto to dopiero część wydatku firmy. Do ${c.gross} pracodawca dolicza ${c.erTotal} własnych składek, więc etat kosztuje go ${c.cost}. Kontrahent B2B nie płaci tych składek, dlatego przy przejściu na fakturę negocjuje się zwykle kwotę bliską kosztowi całkowitemu, a nie samemu brutto.</p>
<p>Gdy ktoś proponuje fakturę na ${c.gross}, w praktyce obniża Ci dochód: z ${c.net} do ${c.b2bRyczNet} na ryczałcie IT, bo z faktury trzeba opłacić pełne składki społeczne, zdrowotną i podatek. Ulgi na start i mały ZUS plus zmieniają ten rachunek w pierwszych latach działalności; opisuje je strona o <a href="${route('zusb2b', 'pl')}">ZUS przedsiębiorcy</a>.</p>`,
      },
      {
        h2: `Ryczałt ${pct(RY, 'pl')} przy fakturze równej kosztowi etatu`,
        html: `<p>Przy fakturze ${c.cost} miesięcznie roczny przychód ${band2 ? `przekracza ${F.ryczaltLimit1}, więc składka zdrowotna na ryczałcie wynosi ${F.ryczaltBand2} miesięcznie` : `nie przekracza ${F.ryczaltLimit1}, więc składka zdrowotna na ryczałcie wynosi ${F.ryczaltBand1} miesięcznie`}. Ryczałt liczy się od przychodu, bez kosztów, więc przy pracy wykonywanej z domu, z własnym laptopem, zwykle wygrywa z liniowym. Na liniowym ${F.liniowy} dochodzi składka zdrowotna ${F.healthLiniowy} od dochodu, a koszty firmowe obniżają podatek.</p>
<p>${rCost > lCost ? `Bez kosztów ryczałt daje ${$(rCost)}, a liniowy ${$(lCost)}.` : `Bez kosztów liniowy daje ${$(lCost)}, a ryczałt ${$(rCost)}.`} Wynik zależy od stawki ryczałtu dla Twojej usługi; ${pct(RY, 'pl')} dotyczy programowania. Przeliczysz go w <a href="${route('b2b', 'pl')}">kalkulatorze B2B</a>.</p>`,
      },
      {
        h2: 'Co tracisz, przechodząc z etatu na fakturę',
        html: `<p>Na B2B nie ma płatnego urlopu ani ${F.sickRate} wynagrodzenia za pierwsze dni choroby od pracodawcy. Jeśli bierzesz 26 dni wolnego, faktura za te dni po prostu nie powstaje. Zasiłek chorobowy z ZUS przysługuje tylko przy dobrowolnej składce chorobowej, wliczonej w kwotę ${F.b2bZusFull}. Do tego dochodzą księgowość i rozliczanie VAT. Porównanie z tymi czynnikami pokazuje strona <a href="${route('compare', 'pl')}">B2B czy umowa o pracę</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Jaka faktura B2B dorówna etatowi ${c.amount} zł brutto?`, a: `Na ryczałcie ${pct(RY, 'pl')} dla IT, z pełnym ZUS i bez ulg na start, około ${$(parity)} netto miesięcznie, żeby zostało ${c.net} jak na etacie. To kwota bez urlopu i chorobowego, więc warto doliczyć zapas na dni wolne. Pracodawca płaci za etat ${c.cost}, więc faktura w okolicach tej kwoty daje wyraźną przewagę.` },
      { q: `Ile zostaje z faktury ${c.amount} zł netto na ryczałcie IT?`, a: `${c.b2bRyczNet} miesięcznie, przy pełnym ZUS ${F.b2bZusFull} z dobrowolnym chorobowym i ryczałtowej składce zdrowotnej. To mniej niż ${c.net} na etacie z tej samej kwoty brutto, bo przedsiębiorca sam opłaca składki, które przy etacie dzieli z pracodawcą. Z ulgą na start lub preferencyjnym ZUS wynik jest wyższy.` },
      { q: `Ryczałt czy podatek liniowy przy fakturze odpowiadającej etatowi ${c.amount} zł?`, a: `Przy fakturze ${c.cost} i braku kosztów firmowych ${rCost > lCost ? `ryczałt daje ${$(rCost)}, liniowy ${$(lCost)}` : `liniowy daje ${$(lCost)}, ryczałt ${$(rCost)}`}. Liniowy zaczyna wygrywać, gdy masz istotne koszty: leasing, sprzęt, biuro. Na ryczałcie kosztów nie odliczysz, ale stawka ${pct(RY, 'pl')} od przychodu jest niska.` },
      { q: `Ile pracodawca płaci łącznie za etat ${c.amount} zł brutto?`, a: `${c.cost} miesięcznie: pensja ${c.gross} i ${c.erTotal} składek po stronie firmy (emerytalna, rentowa, wypadkowa ${F.wypadkowa}, Fundusz Pracy z Funduszem Solidarnościowym ${F.fpfs} i FGŚP ${F.fgsp}). Bez PPK. To właśnie ta kwota, a nie brutto, jest rozsądnym punktem wyjścia w rozmowie o stawce B2B.` },
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
    title: `${c.amount} zł brutto ile netto ${F.year}? ${c.net}, blisko średniej`,
    description: `${c.amount} zł brutto to w ${F.year} r. ${c.net} netto, ${c.ratioAvg} prognozowanej średniej ${F.avgForecast}. Co znaczy zarabiać średnią krajową i do czego urzędy używają tej kwoty.`,
    h1: `${c.amount} zł brutto netto w ${F.year} r. a średnia krajowa`,
    intro: `Etat za ${c.gross} brutto to ${c.net} na rękę, kwota bliska przeciętnemu wynagrodzeniu.`,
    resume: `${c.gross} brutto daje w ${F.year} r. ${c.net} netto miesięcznie na umowie o pracę, z PIT-2 i kosztami ${F.kup}. To ${c.ratioAvg} prognozowanego przeciętnego wynagrodzenia na ${F.year} r., które ustawa budżetowa i obwieszczenie w Monitorze Polskim ustaliły na ${F.avgForecast}. ${below ? `Do pełnej średniej brakuje ${$(avg - c.amount)} brutto, a sama średnia daje na rękę ${$(avgNet)}.` : `Pensja przekracza tę średnią.`} GUS podał z kolei przeciętne wynagrodzenie w IV kwartale 2025 r. na poziomie ${F.avgQ4}, z wypłatami z zysku. Kto mówi, że „zarabia średnią krajową”, ma więc na myśli kwotę rzędu ${c.gross}, ale to średnia arytmetyczna, podbijana przez najwyższe pensje, a nie zarobki typowego pracownika. Prognoza nie jest tylko statystyką: od niej liczy się minimalną podstawę ZUS przedsiębiorcy i roczny limit składek emerytalnej i rentowej. W skali roku ${c.gross} daje ${c.netYear} netto.`,
    sections: [
      {
        h2: 'Co naprawdę znaczy „zarabiać średnią krajową”',
        html: `<p>W rozmowach „średnia krajowa” oznacza zwykle ostatni komunikat GUS. Tymczasem w obiegu są dwie różne liczby: dane GUS za kwartał (${F.avgQ4} za IV kwartał 2025 r.) i prognoza wpisana do ustawy budżetowej (${F.avgForecast} na ${F.year} r.). Obie są średnią arytmetyczną, więc kilka bardzo wysokich pensji przesuwa je w górę i nie opisują one zarobków „środkowego” pracownika. Pensja ${c.gross} brutto jest zatem przyzwoita, choć statystycznie nie wyznacza połowy rynku.</p>
<p>Średnia dotyczy też kwot brutto, a porównując oferty, warto patrzeć na netto: ${c.net} przy ${c.gross} wobec ${$(avgNet)} przy prognozowanej średniej. Szczegóły i historię danych opisuje poradnik o <a href="${route('average', 'pl')}">przeciętnym wynagrodzeniu</a>.</p>`,
      },
      {
        h2: 'Gdzie urzędy używają prognozowanej średniej',
        html: `<ul>
<li><strong>ZUS przedsiębiorcy:</strong> minimalna podstawa składek to 60 % prognozy, czyli ${F.b2bBaseFull}, co daje ${F.b2bZusFull} składek miesięcznie (<a href="${route('zusb2b', 'pl')}">ZUS przedsiębiorcy</a>).</li>
<li><strong>Limit 30-krotności:</strong> trzydziestokrotność prognozy, ${F.cap}, to roczny pułap podstawy składek emerytalnej i rentowej (<a href="${route('cap', 'pl')}">limit 30-krotności</a>).</li>
</ul>
<p>Dla pracownika z pensją ${c.gross} ten limit nie ma znaczenia: roczne brutto jest od niego wyraźnie niższe, więc składki płaci przez cały rok. Obie kwoty, podstawa przedsiębiorcy i limit, są stałe w danym roku i nie zmieniają się, gdy GUS publikuje nowe dane kwartalne.</p>`,
      },
      {
        h2: 'Ulga dla młodych kończy się jesienią',
        html: `<p>Osoba przed 26. urodzinami ma przychód zwolniony z PIT do ${F.youthLimit} w roku. Przy ${c.gross} miesięcznie dostaje wtedy ${c.netU26} na rękę, ${end ? `ale limit wyczerpie się w ${LOC[end - 1]}: od tego miesiąca pracodawca znów pobiera zaliczkę, a wypłata wraca do ${c.net}` : `i ulga działa przez cały rok`}. Roczne netto z ulgą to ${$(yY.total.net)}. Warto o tym wiedzieć, planując wydatki na koniec roku, bo spadek wypłaty jest odczuwalny. Zasady opisuje strona o <a href="${route('youth', 'pl')}">uldze dla młodych</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Czy ${c.amount} zł brutto to już średnia krajowa w ${F.year} roku?`, a: `Prawie. Prognozowane przeciętne wynagrodzenie na ${F.year} r. wynosi ${F.avgForecast}, a ${c.gross} to ${c.ratioAvg} tej kwoty. W porównaniu z danymi GUS za IV kwartał 2025 r. (${F.avgQ4}) ${c.amount < P.average_wage.q4_2025_with_profits ? 'pensja jest nieco niższa' : 'pensja jest nawet wyższa'}. Obie liczby to średnie arytmetyczne, zawyżane przez najwyższe pensje.` },
      { q: 'Ile na rękę daje dokładnie prognozowana średnia krajowa?', a: `${F.avgForecast} brutto na umowie o pracę to ${$(avgNet)} netto miesięcznie, przy PIT-2 i podstawowych kosztach uzyskania przychodu. To kwota dla mieszkańca tej samej miejscowości, bez PPK i bez ulgi dla młodych. Z pensją ${c.gross} różnica w netto wynosi ${$(avgNet - c.raw.net)} miesięcznie.` },
      { q: `Kiedy przy ${c.amount} zł brutto kończy się ulga dla młodych?`, a: `${end ? `W ${LOC[end - 1]}. Wtedy suma przychodów od stycznia przekracza limit ${F.youthLimit} i pracodawca zaczyna pobierać zaliczkę na PIT.` : `Nie kończy się w trakcie roku, bo przychód nie przekracza limitu ${F.youthLimit}.`} Do tego czasu dostajesz ${c.netU26} miesięcznie, potem ${c.net}. Ulga dotyczy tylko osób, które nie ukończyły 26 lat, i nie zwalnia ze składek ZUS ani zdrowotnej.` },
      { q: 'Od jakiej średniej liczy się składki przedsiębiorcy w tym roku?', a: `Od prognozowanego przeciętnego wynagrodzenia ${F.avgForecast}. Minimalna podstawa pełnego ZUS to 60 % tej kwoty, czyli ${F.b2bBaseFull}, a składki społeczne z chorobową wynoszą ${F.b2bZusFull} miesięcznie. Na ryczałcie składka zdrowotna liczy się z kolei od przeciętnego wynagrodzenia z IV kwartału poprzedniego roku.` },
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
    title: `${c.amount} zł brutto netto ${F.year}: ${c.net} i wciąż bez progu ${F.pitHigh}`,
    description: `${c.amount} zł brutto to w ${F.year} r. ${c.net} netto i ${F.threshold} brutto rocznie, a jednak bez podatku ${F.pitHigh}. Ile zapasu do progu i od jakiej pensji go przekroczysz.`,
    h1: `${c.amount} zł brutto ile netto w ${F.year} r.${c.bracketMonth ? '' : ': bez drugiego progu'}`,
    intro: `Pięciocyfrowa pensja ${c.gross} brutto oznacza na umowie o pracę ${c.net} na rękę.`,
    resume: `${c.gross} brutto to w ${F.year} r. ${c.net} netto miesięcznie na etacie, przy PIT-2 i kosztach ${F.kup}, czyli ${c.netShare} kwoty brutto. Ta pensja to psychologiczna bariera: pięć cyfr na umowie i ${$(c.amount * 12)} brutto w roku, dokładnie tyle, ile wynosi próg podatkowy ${F.threshold}. ${c.bracketMonth ? `Mimo to część dochodu trafia do drugiego progu w ${c.bracketMonth}.` : `Mimo to nie zapłacisz ani złotówki podatku według stawki ${F.pitHigh}, bo próg dotyczy podstawy opodatkowania, a nie kwoty brutto.`} Od pensji odejmuje się najpierw składki społeczne ${c.social} i koszty ${F.kup}, więc roczna podstawa wynosi ${$(cumBase)}, o ${$(margin)} mniej niż próg. Wszystkie dwanaście wypłat jest równych, po ${c.net}, a zaliczki pobrane w roku sumują się do ${c.pitYear}. Drugi próg zacznie obejmować grudniową wypłatę dopiero przy pensji około ${$(thr)} brutto. Pracodawca wydaje na ten etat ${c.cost}.`,
    sections: [
      {
        h2: `${$(c.amount * 12)} rocznie, a jednak bez ${F.pitHigh}`,
        html: `<p>Wiele osób z pensją ${c.gross} spodziewa się, że w grudniu wejdzie w drugi próg, bo dwanaście pensji daje okrągłe ${$(c.amount * 12)}. Ustawa o PIT liczy jednak próg od dochodu po odliczeniu składek emerytalnej, rentowej i chorobowej oraz kosztów uzyskania przychodu. Składki zabierają ${c.social} miesięcznie, koszty ${F.kup}, i to wystarcza, żeby podstawa została poniżej ${F.threshold}.</p>
<p>${c.bracketMonth ? `Tutaj podstawa przekracza próg w ${c.bracketMonth}.` : `Dlatego grudniowa wypłata wynosi tyle samo, co styczniowa: ${c.netDec}.`} Składka zdrowotna ${F.health} nie obniża podstawy, więc w tym rachunku jej nie ma. Mechanizm progów tłumaczy poradnik o <a href="${route('brackets', 'pl')}">progach podatkowych</a>.</p>`,
      },
      {
        h2: 'Ile zapasu zostaje do drugiego progu',
        html: `<p>Roczna podstawa opodatkowania to ${$(cumBase)}, więc do progu brakuje ${$(margin)} podstawy. W kategoriach pensji oznacza to, że ${F.pitHigh} pojawi się w grudniu dopiero przy miesięcznym brutto około ${$(thr)}. Podwyżka do tej kwoty nie zmienia więc niczego w podatku, choć każda złotówka powyżej ${c.gross} jest oczywiście oskładkowana.</p>
<p>Zapas zmniejszają przychody jednorazowe: nagroda roczna, trzynastka, wynagrodzenie za czy wynagrodzenie za nadgodziny. Jeśli ich suma w roku przekroczy ${$(margin)} podstawy, ostatnia wypłata będzie niższa. Wpływ premii pokazuje <a href="${route('bonus', 'pl')}">kalkulator premii netto</a>, a cały rok <a href="${route('annual', 'pl')}">kalkulator wynagrodzenia rocznego</a>.</p>`,
      },
      {
        h2: 'Pięć cyfr na umowie, cztery na koncie',
        html: `<p>Kwota ${c.gross} brutto brzmi jak przekroczenie bariery, ale na konto wpływa ${c.net}, czyli wciąż kwota czterocyfrowa. Żeby dostawać na rękę pięciocyfrową kwotę, potrzeba znacznie wyższego brutto, a po drodze dochodzi już drugi próg. Warto o tym pamiętać, gdy oferta pracy podaje „dziesięć tysięcy” bez dopisku, czy chodzi o brutto, netto, czy o fakturę.</p>
<p>Dla porównania: zlecenie z tą samą kwotą, bez PIT-2, daje ${c.zlecNet}, a umowa o dzieło ${c.dzieloNet}. Etat wygrywa za to ochroną: płatnym urlopem, wynagrodzeniem chorobowym i okresem wypowiedzenia. Jeśli znasz kwotę netto, a chcesz poznać brutto, użyj <a href="${route('nettobrutto', 'pl')}">kalkulatora netto-brutto</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Czy zarabiając ${c.amount} zł brutto miesięcznie, wchodzę w drugi próg podatkowy?`, a: `${c.bracketMonth ? `Tak, w ${c.bracketMonth}.` : `Nie.`} Próg ${F.threshold} dotyczy podstawy opodatkowania, czyli dochodu po składkach społecznych i kosztach uzyskania przychodu. Przy ${c.gross} brutto ta podstawa wynosi w roku ${$(cumBase)}, o ${$(margin)} mniej niż próg. Sytuację zmieniają dodatkowe przychody, na przykład premia roczna albo nadgodziny.` },
      { q: `Od jakiej pensji brutto drugi próg obejmie już grudniową wypłatę?`, a: `Przy stałej pensji około ${$(thr)} brutto miesięcznie, na umowie o pracę z podstawowymi kosztami i bez innych przychodów. Wtedy suma podstaw od stycznia przekracza ${F.threshold} w ostatnim miesiącu roku i część grudniowego dochodu jest opodatkowana według stawki ${F.pitHigh}. Im wyższa pensja, tym wcześniej to następuje.` },
      { q: `Ile podatku zapłacę w roku przy ${c.amount} zł brutto?`, a: `Pracodawca pobierze w ciągu roku zaliczki na PIT o łącznej wysokości ${c.pitYear}, przy złożonym PIT-2. Do tego dochodzi składka zdrowotna, ${c.health} miesięcznie, której nie odliczasz od podatku. W zeznaniu rocznym kwota podatku może się nieco różnić, na przykład po uldze na dzieci lub odliczeniu darowizn.` },
      { q: `Ile procent z ${c.amount} zł brutto zostaje na rękę?`, a: `${c.netShare}, czyli ${c.net} miesięcznie i ${c.netYear} rocznie. Resztę stanowią składki społeczne (${c.social}), zdrowotna (${c.health}) i zaliczka na podatek (${c.pit}). Udział netto maleje powoli wraz z pensją, a wyraźniej spada dopiero wtedy, gdy część dochodu trafia do drugiego progu.` },
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
  const drop = jan.net - dec.net;
  return {
    title: `${c.amount} zł brutto netto ${F.year}: ${c.net}, a w grudniu ${c.netDec}`,
    description: `${c.amount} zł brutto daje w ${F.year} r. ${c.net} netto${c.bracketMonth ? `, ale w ${LOC[(bm ?? 12) - 1]} wypłata spada do ${c.netDec}` : ''}. Skąd ten spadek, ile kosztuje drugi próg i jakie jest roczne netto.`,
    h1: `${c.amount} zł brutto netto w ${F.year} r.${c.bracketMonth ? `: inna wypłata za ${c.bracketMonth}` : ''}`,
    intro: `Przez większość roku ${c.gross} brutto to ${c.netJan} na rękę na etacie.`,
    resume: `Pensja ${c.gross} brutto daje w ${F.year} r. ${c.netJan} netto miesięcznie na umowie o pracę, z PIT-2 i kosztami ${F.kup}. ${c.bracketMonth && bm ? `Wyjątkiem jest ${c.bracketMonth}: suma podstaw opodatkowania od stycznia przekracza wtedy próg ${F.threshold} o ${$(excess)}, ta nadwyżka podlega stawce ${F.pitHigh} zamiast ${F.pitLow}, a wypłata za ${c.bracketMonth} spada do ${c.netDec}, czyli o ${$(drop)}.` : `Podstawa opodatkowania nie przekracza progu ${F.threshold}, więc wszystkie wypłaty są równe.`} To dokładnie ten poziom pensji, na którym drugi próg przestaje być teorią i pojawia się na pasku, choć tylko symbolicznie: wejście w ${F.pitHigh} kosztuje w całym roku ${$(extra)}. Roczne netto wynosi ${c.netYear}, a zaliczki na podatek ${c.pitYear}. Pracodawca wydaje na etat ${c.cost} miesięcznie. Kto dostaje dodatkowo premię albo nagrodę, wejdzie w drugi próg wcześniej niż na ostatnim pasku roku.`,
    sections: [
      {
        h2: c.bracketMonth ? `${c.bracketMonth.charAt(0).toUpperCase() + c.bracketMonth.slice(1)}: pierwsza wypłata w drugim progu` : 'Cały rok w pierwszym progu',
        html: `<p>Pracodawca liczy zaliczki narastająco: w każdym miesiącu dodaje bieżącą podstawę do sumy od stycznia i sprawdza, czy przekroczyła ${F.threshold}. Przy ${c.gross} brutto miesięczna podstawa wynosi ${$(jan.taxBase)}, a po dwunastu miesiącach suma to ${$(dec.cumTaxBase)}. ${bm ? `Próg pada więc w ${LOC[bm - 1]} i tylko ta wypłata jest częściowo opodatkowana stawką ${F.pitHigh}: zaliczka rośnie z ${$(jan.pit)} do ${$(dec.pit)}.` : `Próg nie zostaje przekroczony.`}</p>
<p>Nie oznacza to błędu w kadrach ani „kary” za podwyżkę. Stawka ${F.pitHigh} dotyczy wyłącznie nadwyżki ponad próg, a nie całego dochodu. Zasady wyjaśnia poradnik o <a href="${route('brackets', 'pl')}">progach podatkowych</a>.</p>`,
      },
      {
        h2: 'Ile kosztuje przekroczenie progu o kilka tysięcy',
        html: `<p>Nadwyżka ponad próg to ${$(excess)} podstawy. Różnica stawek wynosi ${pct(P.pit.rate_high - P.pit.rate_low, 'pl')}, więc wejście w drugi próg kosztuje Cię w całym roku ${$(extra)}. Gdyby cały roczny dochód podlegał stawce ${F.pitHigh}, podatek byłby kilkukrotnie wyższy, i to jest najczęstszy mit, który słychać przy tej pensji.</p>
<p>Roczne netto to ${c.netYear}, nieco mniej niż dwanaście razy ${c.netJan}. Jeśli planujesz wydatki na koniec roku, policz grudzień osobno. Całe zestawienie miesiąc po miesiącu znajdziesz w tabeli poniżej i w <a href="${route('annual', 'pl')}">kalkulatorze rocznym</a>.</p>`,
      },
      {
        h2: 'Kiedy drugi próg przyjdzie wcześniej',
        html: `<p>Każdy dodatkowy przychód w roku zbliża moment przekroczenia progu: premia kwartalna, nagroda jubileuszowa, nadgodziny, a także świadczenia, które pracodawca dolicza do przychodu. Przy pensji ${c.gross} wystarczy niewielka dodatkowa kwota, żeby drugi próg objął także wypłatę listopadową. W drugą stronę działają koszty autorskie, jeśli część pracy ma charakter twórczy, bo obniżają podstawę opodatkowania (<a href="${route('authors', 'pl')}">koszty autorskie</a>).</p>`,
      },
    ],
    faqs: [
      { q: `Dlaczego grudniowa wypłata przy ${c.amount} zł brutto jest niższa?`, a: `${bm ? `Bo w ${LOC[bm - 1]} suma podstaw opodatkowania od stycznia przekracza ${F.threshold} i nadwyżka, ${$(excess)}, jest opodatkowana stawką ${F.pitHigh}. Zaliczka rośnie z ${$(jan.pit)} do ${$(dec.pit)}, a netto spada z ${c.netJan} do ${c.netDec}.` : `Nie jest niższa: podstawa nie przekracza progu.`} Od stycznia następnego roku licznik zaczyna się od zera.` },
      { q: `Ile dodatkowego podatku zapłacę przy ${c.amount} zł brutto przez drugi próg?`, a: `${$(extra)} w całym roku. Tyle wynosi różnica między stawkami ${F.pitHigh} i ${F.pitLow} od nadwyżki ${$(excess)} ponad próg. Pozostała część rocznego dochodu jest opodatkowana według stawki ${F.pitLow}. Kwota założona dla pracownika bez innych przychodów i bez ulg rozliczanych w zeznaniu rocznym.` },
      { q: `Czy przy ${c.amount} zł brutto da się uniknąć drugiego progu?`, a: `Przy zwykłej umowie o pracę tylko w niewielkim stopniu. Podwyższone koszty dla dojeżdżających ${F.kupRaised} obniżają roczną podstawę o kilkaset złotych. Wyraźnie więcej dają koszty autorskie ${F.kupAuthors}, ale tylko przy pracy twórczej, udokumentowanej w umowie i ewidencji utworów. Nadwyżka ponad próg wynosi tu tylko ${$(excess)}, więc nawet niewielka zmiana podstawy może przesunąć cały roczny dochód poniżej ${F.threshold}.` },
      { q: `Jakie jest roczne netto przy ${c.amount} zł brutto?`, a: `${c.netYear} za cały rok, przy PIT-2 i kosztach ${F.kup}. Jedenaście wypłat wynosi po ${c.netJan}, a ${bm ? `wypłata za ${c.bracketMonth} ${c.netDec}` : `ostatnia tyle samo`}. Zaliczki na PIT sumują się do ${c.pitYear}. Pracodawca wyda na Twój etat w roku dwanaście razy ${c.cost}.` },
    ],
  };
};

/* ------------------------------------------------------------------ 15000 */
const a15000: AngleFn = (c) => {
  const { F, $ } = c;
  const y = uopYear({ gross: c.amount });
  const bm = bracketNo(y.months);
  const months32 = bm ? 12 - bm + 1 : 0;
  const yb = uopYear({ gross: c.amount, months: y.months.map((_, i) => (i === 2 ? c.amount * 2 : c.amount)) });
  const bmBonus = bracketNo(yb.months);
  const bonusNet = yb.months[2].net - y.months[2].net;
  const bonusLoss = yb.total.net - y.total.net;
  const lCost = linNet(c.raw.cost);
  return {
    title: `${c.amount} zł brutto ile netto ${F.year}? ${c.net}, jesienią ${c.netDec}`,
    description: `${c.amount} zł brutto daje w ${F.year} r. ${c.net} netto, a od ${bm ? GEN[bm - 1] : 'grudnia'} ${c.netDec}. Drugi próg, premia, która go przyspiesza, i kiedy B2B na podatku liniowym ma sens.`,
    h1: `${c.amount} zł brutto netto w ${F.year} r.: drugi próg ${bm && bm >= 9 ? 'jesienią' : bm ? `od ${GEN[bm - 1]}` : 'nie występuje'}`,
    intro: `Na etacie ${c.gross} brutto to ${c.netJan} na rękę, dopóki nie zacznie działać stawka ${F.pitHigh}.`,
    resume: `${c.gross} brutto daje w ${F.year} r. ${c.netJan} netto miesięcznie na umowie o pracę, ale tylko w pierwszej części roku. ${c.bracketMonth && bm ? `W ${LOC[bm - 1]} suma podstaw opodatkowania przekracza ${F.threshold}, a od ${GEN[bm - 1]} do grudnia, przez ${months32} wypłaty, część albo całość dochodu podlega stawce ${F.pitHigh}. Wypłata w grudniu wynosi już ${c.netDec}.` : `Drugi próg nie pojawia się w tym roku.`} Rocznie zostaje ${c.netYear}, a zaliczki na PIT sumują się do ${c.pitYear}. Na tym poziomie każda premia ma znaczenie podwójne: zwiększa dochód i przyspiesza wejście w drugi próg. Zaczyna się też poważna rozmowa o B2B. Faktura na kwotę równą pensji daje na podatku liniowym ${c.b2bLinNet}, a na ryczałcie IT ${c.b2bRyczNet}${c.raw.b2bRyczNet > c.raw.net ? `, czyli już więcej niż etat` : ''}. Przy fakturze równej kosztowi pracodawcy, ${c.cost}, liniowy zostawia ${$(lCost)}.`,
    sections: [
      {
        h2: bm ? `Od ${GEN[bm - 1]} stawka ${F.pitHigh}` : `Rok bez stawki ${F.pitHigh}`,
        html: `<p>${bm ? `Pierwsze ${bm - 1} wypłat roku wynosi po ${c.netJan}. W ${LOC[bm - 1]} przekraczasz próg, więc ta wypłata jest liczona mieszanie, a kolejne są już w całości w drugim progu i spadają do ${c.netDec}. Różnica, ${$(y.months[0].net - y.months[11].net)} miesięcznie, przypada akurat na okres przedświąteczny.` : `Wszystkie wypłaty są równe.`}</p>
<p>To nie jest błąd kadr. W styczniu licznik startuje od zera i wypłata wraca do ${c.netJan}. Jeśli wolisz stałą kwotę co miesiąc, nie zmienisz tego sposobem liczenia zaliczek, ale możesz odkładać różnicę z pierwszych miesięcy. Kto zmienia pracę w trakcie roku, powinien wiedzieć, że nowy pracodawca nie zna przychodów z poprzedniej firmy i liczy próg od zera, więc różnicę w podatku wyrówna dopiero zeznanie roczne, często z dopłatą. Zasady opisują <a href="${route('brackets', 'pl')}">progi podatkowe</a>.</p>`,
      },
      {
        h2: 'Premia, która przyspiesza drugi próg',
        html: `<p>Przykład: pracodawca wypłaca w marcu premię równą miesięcznej pensji, czyli ${c.gross} brutto. Marcowa wypłata rośnie o ${$(bonusNet)} netto, ale suma podstaw szybciej dochodzi do progu i stawka ${F.pitHigh} zaczyna działać ${bmBonus && bm && bmBonus < bm ? `już w ${LOC[bmBonus - 1]}, a nie w ${LOC[bm - 1]}` : bmBonus ? `w ${LOC[bmBonus - 1]}` : 'w tym samym miesiącu'}. Z całej premii zostaje w roku ${$(bonusLoss)} netto, bo jej część w praktyce opodatkujesz stawką ${F.pitHigh}, choć wypłacono ją wiosną.</p>
<p>Zanim zgodzisz się na zamianę części pensji na premię, policz roczne netto, nie miesięczne. Pomoże <a href="${route('bonus', 'pl')}">kalkulator premii netto</a>.</p>`,
      },
      {
        h2: `Liniowy ${F.liniowy} zaczyna mieć sens`,
        html: `<p>Na podatku liniowym przedsiębiorca płaci ${F.liniowy} niezależnie od dochodu i nie ma drugiego progu, ale traci kwotę zmniejszającą podatek, a składka zdrowotna wynosi ${F.healthLiniowy} dochodu. Przy fakturze ${c.gross} daje to ${c.b2bLinNet}, ${c.raw.b2bLinNet > c.raw.net ? 'więcej' : 'mniej'} niż ${c.net} na etacie w styczniu. Przy fakturze ${c.cost} wynik rośnie do ${$(lCost)}. Ryczałt ${pct(RY, 'pl')} dla IT jest przy braku kosztów jeszcze korzystniejszy: ${c.b2bRyczNet} przy fakturze równej pensji. Przelicz własne koszty w <a href="${route('liniowy', 'pl')}">kalkulatorze podatku liniowego</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Od którego miesiąca przy ${c.amount} zł brutto płacę ${F.pitHigh}?`, a: `${bm ? `Od ${GEN[bm - 1]}. W tym miesiącu suma podstaw opodatkowania od stycznia przekracza ${F.threshold}, więc część wypłaty jest opodatkowana stawką ${F.pitHigh}, a ${12 - bm} kolejne w całości.` : 'W tym roku wcale.'} Przy dodatkowych przychodach, takich jak premia czy nadgodziny, ten moment przesuwa się na wcześniejszy miesiąc.` },
      { q: `Ile netto zostanie z premii równej pensji ${c.amount} zł?`, a: `W miesiącu wypłaty, przy premii w marcu, wypłata rośnie o ${$(bonusNet)}. W skali roku zostaje ${$(bonusLoss)}, bo premia przyspiesza drugi próg${bmBonus ? ` do ${GEN[bmBonus - 1]}` : ''} i jej część jest w praktyce opodatkowana stawką ${F.pitHigh}. Dlatego przy tej pensji lepiej oceniać premie w ujęciu rocznym.` },
      { q: `Czy B2B na liniowym przy ${c.amount} zł daje więcej niż etat?`, a: `Przy fakturze równej pensji: ${c.b2bLinNet} na liniowym wobec ${c.net} na etacie, ${c.raw.b2bLinNet > c.raw.net ? 'więc liniowy już wygrywa' : 'więc etat wciąż wygrywa'}. Przy fakturze równej kosztowi pracodawcy, ${c.cost}, liniowy daje ${$(lCost)}. Pełny ZUS, brak urlopu i chorobowego trzeba wliczyć w stawkę.` },
      { q: `Ile wynosi wypłata w grudniu przy ${c.amount} zł brutto?`, a: `${c.netDec}, wobec ${c.netJan} w styczniu. Różnica wynika ze stawki ${F.pitHigh}, która obejmuje ostatnie miesiące roku. Składki społeczne zostają takie same, bo przy tej pensji roczny limit 30-krotności nie zostaje osiągnięty. W styczniu następnego roku netto wraca do pierwotnej kwoty.` },
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
    title: `${c.amount} zł brutto netto ${F.year}: ${c.net}, koszty autorskie`,
    description: `${c.amount} zł brutto to w ${F.year} r. ${c.net} netto, a od ${bm ? GEN[bm - 1] : 'grudnia'} ${c.netDec}. Ile dają koszty autorskie ${F.kupAuthors} i ile miesięcznie kosztujesz pracodawcę: ${c.cost}.`,
    h1: `${c.amount} zł brutto ile netto w ${F.year} r. i z kosztami autorskimi`,
    intro: `Etat za ${c.gross} brutto oznacza ${c.netJan} na rękę w pierwszych miesiącach roku.`,
    resume: `${c.gross} brutto daje w ${F.year} r. ${c.netJan} netto miesięcznie na etacie, z PIT-2 i kosztami ${F.kup}, ale ${bm ? `od ${GEN[bm - 1]} wypłata spada do ${c.netDec}, bo dochód przekracza próg ${F.threshold} i trafia do stawki ${F.pitHigh}` : 'cały rok w pierwszym progu'}. Roczne netto to ${c.netYear}, a zaliczki na PIT ${c.pitYear}. Przy tej pensji najwięcej zmieniają koszty autorskie: jeśli połowa wynagrodzenia to honorarium za utwory, roczne netto rośnie do ${$(a50.total.net)}${bm50 && bm ? `, a drugi próg przesuwa się z ${GEN[bm - 1]} na ${bm50 > bm ? GEN[bm50 - 1] : GEN[bm - 1]}` : ''}. Średnio w miesiącu zostaje ${$(c.raw.netYear / 12)}, i to tę kwotę warto przyjąć do planowania budżetu. Drugą stroną tej pensji jest koszt dla firmy: ${c.cost} miesięcznie, czyli ${$(y.total.cost)} w roku. ${capReached ? `Limit 30-krotności zostaje osiągnięty w ${c.capMonth}.` : `Roczne brutto, ${$(c.amount * 12)}, nie dochodzi do limitu 30-krotności ${F.cap}, więc składki emerytalna i rentowa są pobierane do końca roku.`}`,
    sections: [
      {
        h2: bm ? `Drugi próg od ${GEN[bm - 1]}` : 'Bez drugiego progu',
        html: `<p>${bm ? `Przez ${bm - 1} miesięcy dostajesz ${c.netJan}. Wypłata za ${c.bracketMonth} jest liczona częściowo według ${F.pitHigh}, a od kolejnego miesiąca cała podstawa podlega tej stawce. Netto spada do ${c.netDec}, czyli o ${$(y.months[0].net - y.months[11].net)} miesięcznie, przez prawie pół roku.` : 'Wszystkie wypłaty są równe.'}</p>
<p>Przy takiej pensji warto planować budżet na średnią roczną, ${$(c.raw.netYear / 12)} miesięcznie, a nie na styczniową wypłatę. Szczegóły daje tabela miesiąc po miesiącu poniżej.</p>`,
      },
      {
        h2: `Koszty autorskie ${F.kupAuthors} przy pensji ${c.gross}`,
        html: `<p>Programiści, graficy, architekci czy dziennikarze mogą mieć w umowie o pracę wyodrębnioną część wynagrodzenia za przeniesienie praw autorskich. Od tej części koszty uzyskania przychodu wynoszą ${F.kupAuthors} (po odjęciu składek), do łącznego limitu ${F.kupAuthorsLimit} w roku. Efekt przy ${c.gross} brutto:</p>
<ul>
<li><strong>bez kosztów autorskich:</strong> ${c.netYear} netto rocznie${bm ? `, drugi próg od ${GEN[bm - 1]}` : ''};</li>
<li><strong>50 % honorarium:</strong> ${$(a50.total.net)}${bm50 ? `, drugi próg od ${GEN[bm50 - 1]}` : ', bez drugiego progu'};</li>
<li><strong>80 % honorarium:</strong> ${$(a80.total.net)}${bm80 ? `, drugi próg od ${GEN[bm80 - 1]}` : ', bez drugiego progu'}.</li>
</ul>
<p>Warunkiem jest rzeczywista praca twórcza i jej udokumentowanie, na przykład w ewidencji utworów. Zasady opisuje poradnik o <a href="${route('authors', 'pl')}">kosztach autorskich</a>.</p>`,
      },
      {
        h2: 'Ile kosztujesz pracodawcę',
        html: `<p>Do ${c.gross} brutto firma dolicza ${c.erTotal} składek: emerytalną ${F.emerytalnaEr}, rentową ${F.rentowaEr}, wypadkową, Fundusz Pracy z Funduszem Solidarnościowym ${F.fpfs} i FGŚP. Razem ${c.cost} miesięcznie i ${$(y.total.cost)} w roku, z czego na Twoje konto trafia ${c.netYear}. Ta relacja tłumaczy, dlaczego przy tej pensji tak często pada propozycja B2B: faktura ${c.gross} daje na ryczałcie IT ${c.b2bRyczNet}, a na liniowym ${c.b2bLinNet}. Jeśli firma dokłada PPK, prywatną opiekę medyczną czy kartę sportową, rzeczywisty koszt etatu jest jeszcze wyższy. Więcej: <a href="${route('employer', 'pl')}">koszt pracodawcy</a>.</p>`,
      },
    ],
    faqs: [
      { q: `Ile zyskam rocznie na kosztach autorskich przy ${c.amount} zł brutto?`, a: `Przy połowie pensji jako honorarium autorskim około ${$(a50.total.net - c.raw.netYear)} rocznie: netto rośnie z ${c.netYear} do ${$(a50.total.net)}. Przy 80 % zysk sięga ${$(a80.total.net - c.raw.netYear)}. Koszty ${F.kupAuthors} liczy się od przychodu po składkach, a ich roczny limit to ${F.kupAuthorsLimit}. Warunkiem jest praca twórcza zapisana w umowie.` },
      { q: `Czy przy ${c.amount} zł brutto przekroczę limit 30-krotności?`, a: `${capReached ? `Tak, w ${c.capMonth}.` : `Nie. Roczne brutto to ${$(c.amount * 12)}, a limit wynosi ${F.cap}, więc składki emerytalna i rentowa są pobierane przez cały rok.`} Limit dotyczy tylko tych dwóch składek; chorobowa i zdrowotna nie mają rocznego pułapu u pracownika. Przy premii lub nagrodzie rocznej warto policzyć ponownie.` },
      { q: `Ile pracodawca płaci rocznie za pensję ${c.amount} zł brutto?`, a: `${$(y.total.cost)}, czyli dwanaście razy ${c.cost}. Ponad brutto firma płaci ${c.erTotal} miesięcznie: składki emerytalną i rentową po swojej stronie, wypadkową, Fundusz Pracy z Funduszem Solidarnościowym i FGŚP. Kwota nie obejmuje PPK, benefitów ani kosztów stanowiska pracy.` },
      { q: `O ile spada wypłata po wejściu w drugi próg przy ${c.amount} zł brutto?`, a: `${bm ? `O ${$(y.months[0].net - y.months[11].net)} miesięcznie: z ${c.netJan} do ${c.netDec}. Pierwsza obniżona wypłata to ta za ${c.bracketMonth}, kolejne są w całości opodatkowane stawką ${F.pitHigh}.` : 'Nie spada.'} Składki zostają bez zmian, a od stycznia następnego roku wypłata wraca do pierwotnego poziomu, bo licznik progu startuje od zera.` },
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
    title: `${c.amount} zł brutto netto ${F.year}: ${c.net} i limit ZUS w ${cm ? LOC[cm - 1] : 'roku'}`,
    description: `${c.amount} zł brutto daje w ${F.year} r. ${c.net} netto, a od ${bm ? GEN[bm - 1] : 'grudnia'} mniej przez stawkę ${F.pitHigh}. Limit 30-krotności ${F.cap} ${decUp ? 'podnosi' : 'zmienia'} wypłatę za ${c.capMonth ?? 'grudzień'}: ${c.netDec}.`,
    h1: `${c.amount} zł brutto netto w ${F.year} r.: drugi próg i limit ZUS`,
    intro: `Etat za ${c.gross} brutto to ${c.netJan} na rękę w styczniu i inna kwota niemal w każdym kwartale.`,
    resume: `${c.gross} brutto daje w ${F.year} r. ${c.netJan} netto w pierwszych miesiącach na umowie o pracę, z PIT-2 i kosztami ${F.kup}. Na tym poziomie wypłata zmienia się dwa razy w roku. ${bm ? `Najpierw w ${LOC[bm - 1]}: suma podstaw przekracza ${F.threshold} i netto spada do ${$(y.months[10].net)}, bo dochód podlega stawce ${F.pitHigh}.` : ''} ${cm ? `Potem w ${LOC[cm - 1]}: suma pensji od stycznia dochodzi do limitu 30-krotności ${F.cap}, więc składki emerytalna i rentowa są liczone tylko od ${$(capBase)}, a w kolejnym roku licznik startuje od nowa.` : `Limit 30-krotności ${F.cap} nie zostaje osiągnięty.`} ${decUp ? `Dzięki temu wypłata za ${c.capMonth} rośnie do ${c.netDec}, mimo że wciąż obowiązuje stawka ${F.pitHigh}.` : ''} Pensja przekracza ${F.capMonthly}, czyli dwunastą część limitu, i dlatego limit wyczerpuje się jeszcze przed końcem roku. Rocznie zostaje ${c.netYear} netto, zaliczki na PIT to ${c.pitYear}, a pracodawca wydaje ${$(y.total.cost)}. Na B2B ryczałt IT dałby z faktury ${c.gross} ${c.b2bRyczNet}.`,
    sections: [
      {
        h2: cm ? `Limit 30-krotności w ${LOC[cm - 1]}` : 'Limit 30-krotności poza zasięgiem',
        html: `<p>Składki emerytalną i rentową płaci się w roku tylko od przychodu do ${F.cap}, czyli trzydziestokrotności prognozowanego przeciętnego wynagrodzenia. ${cm && capM && before ? `Przy ${c.gross} miesięcznie po ${cm - 1} wypłatach suma wynosi ${$(c.amount * (cm - 1))}, więc w ${LOC[cm - 1]} składki liczy się już tylko od ${$(capBase)}. Twoje składki społeczne spadają z ${$(before.social)} do ${$(capM.social)}, o ${$(socSave)}.` : ''}</p>
<p>Składka chorobowa ${F.chorobowa} i zdrowotna ${F.health} nie mają u pracownika rocznego pułapu i są pobierane dalej od pełnej kwoty. Niższe składki emerytalne oznaczają też mniej zapisane na koncie emerytalnym w ZUS. Mechanizm opisuje strona o <a href="${route('cap', 'pl')}">limicie 30-krotności</a>.</p>`,
      },
      {
        h2: bm ? `Od ${GEN[bm - 1]} w drugim progu` : 'Bez drugiego progu',
        html: `<p>${bm ? `Przy ${c.gross} brutto próg ${F.threshold} pada już w ${LOC[bm - 1]}, więc ponad połowa roku przypada na stawkę ${F.pitHigh}. Netto spada z ${c.netJan} do ${$(y.months[10].net)}: to ${$(y.months[0].net - y.months[10].net)} mniej co miesiąc.` : ''} Zaliczki za cały rok to ${c.pitYear}, podczas gdy przy połowie tej pensji wyniosłyby ${$(halfPit)}, bo stawka ${F.pitHigh} obejmuje dużą część dochodu. Porównując oferty w tym przedziale, licz netto roczne, nie miesięczne.</p>`,
      },
      {
        h2: `Wypłata za ${c.capMonth ?? 'grudzień'}: dlaczego ${decUp ? 'jest wyższa' : 'się zmienia'}`,
        html: `<p>${capM && before ? `W ${LOC[(cm ?? 12) - 1]} spotykają się dwa efekty: stawka ${F.pitHigh} od całej podstawy i niższe składki po osiągnięciu limitu. Niższe składki podnoszą podstawę opodatkowania, więc zaliczka rośnie z ${$(before.pit)} do ${$(capM.pit)}, ale ${decUp ? `oszczędność na składkach jest większa i netto rośnie z ${$(before.net)} do ${$(capM.net)}` : `netto wynosi ${$(capM.net)}`}. Pracodawca płaci w tym miesiącu ${$(erSave)} mniej własnych składek.` : 'Wypłaty w końcówce roku są równe.'}</p>
<p>Ostatnia wypłata roku nie jest więc dobrą podstawą do oceny pensji. W styczniu wracają pełne składki i stawka ${F.pitLow}.</p>`,
      },
    ],
    faqs: [
      { q: `W którym miesiącu przy ${c.amount} zł brutto przestaję płacić składkę emerytalną?`, a: `${cm ? `W ${LOC[cm - 1]} płacisz ją już tylko od ${$(capBase)}, bo suma pensji od stycznia dochodzi do limitu ${F.cap}. W styczniu kolejnego roku składki wracają od pełnej pensji.` : `W tym roku nie przestajesz, bo roczna suma nie dochodzi do ${F.cap}.`} Ten sam pułap dotyczy składki rentowej, zarówno po Twojej stronie, jak i pracodawcy.` },
      { q: 'Czy po przekroczeniu limitu 30-krotności nadal płacę składkę zdrowotną?', a: `Tak. Limit ${F.cap} obejmuje tylko składki emerytalną i rentową. Składka zdrowotna ${F.health} i chorobowa ${F.chorobowa} są potrącane od pełnej pensji także po jego przekroczeniu. Ponieważ niższe składki społeczne zwiększają podstawę składki zdrowotnej, ta w miesiącu przekroczenia limitu nawet nieco rośnie.` },
      { q: `Ile zaoszczędzi pracodawca po osiągnięciu limitu przy ${c.amount} zł brutto?`, a: `${erSave > 0 && cm ? `W ${LOC[cm - 1]} jego składki spadają o ${$(erSave)} w stosunku do poprzedniego miesiąca, bo emerytalną ${F.emerytalnaEr} i rentową ${F.rentowaEr} liczy już tylko od ${$(capBase)}.` : 'W tym roku nic, bo limit nie zostaje osiągnięty.'} Wypadkową, Fundusz Pracy z Funduszem Solidarnościowym i FGŚP płaci dalej od pełnej pensji.` },
      { q: `Czy przy ${c.amount} zł brutto opłaca się B2B na ryczałcie?`, a: `Faktura na ${c.gross} daje na ryczałcie IT ${c.b2bRyczNet} miesięcznie, wobec ${c.netJan} na etacie w styczniu i średnio ${$(c.raw.netYear / 12)} w skali roku. ${c.raw.b2bRyczNet > c.raw.netYear / 12 ? 'Ryczałt wygrywa wyraźnie' : 'Etat wciąż wygrywa'}, ale na B2B nie ma płatnego urlopu ani chorobowego od pracodawcy i trzeba uwzględnić stawkę ryczałtu właściwą dla Twojej usługi.` },
    ],
  };
};

export const ANGLES_PL: Record<number, AngleFn> = {
  5000: a5000, 6000: a6000, 7000: a7000, 8000: a8000, 9000: a9000,
  10000: a10000, 12000: a12000, 15000: a15000, 20000: a20000, 25000: a25000,
};
