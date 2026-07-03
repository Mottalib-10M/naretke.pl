/**
 * Dane dla programmatic SEO — strony wojewódzkie
 * 6 największych województw Polski z kontekstem regionalnym (2026)
 */

export interface WojewodztwoData {
  slug: string;
  name: string;
  nameLocative: string;
  capital: string;
  averageSalary: number;
  population: string;
  description: string;
  economicContext: string;
  keyIndustries: string[];
  faq: { question: string; answer: string }[];
}

export const wojewodztwaData: WojewodztwoData[] = [
  {
    slug: "mazowieckie",
    name: "Mazowieckie",
    nameLocative: "mazowieckim",
    capital: "Warszawa",
    averageSalary: 8200,
    population: "5,5 mln",
    description: "Kalkulator wynagrodzeń dla województwa mazowieckiego. Oblicz wynagrodzenie netto z brutto w regionie z najwyższymi zarobkami w Polsce. Aktualne stawki ZUS i PIT na 2026 rok.",
    economicContext: "Województwo mazowieckie to najsilniejszy gospodarczo region Polski, generujący ponad 22% PKB kraju. Warszawa jako stolica jest największym rynkiem pracy z najwyższymi wynagrodzeniami. Średnie wynagrodzenie w województwie mazowieckim wynosi około 8 200 PLN brutto — znacznie powyżej średniej krajowej. Region jest centrum finansowym, technologicznym i administracyjnym, gdzie koncentrują się siedziby największych firm, banków, instytucji rządowych i międzynarodowych korporacji. Wysoka konkurencja o talenty sprawia, że wynagrodzenia w Warszawie i okolicach są najwyższe w kraju, szczególnie w IT, finansach, doradztwie i sektorze publicznym.",
    keyIndustries: ["IT i nowe technologie", "finanse i bankowość", "usługi doradcze", "administracja publiczna", "farmacja", "media i reklama"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie w województwie mazowieckim w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie mazowieckim w 2026 roku wynosi około 8 200 PLN miesięcznie. Jest to najwyższe średnie wynagrodzenie wśród wszystkich województw, napędzane głównie przez wysoko płatne stanowiska w Warszawie.",
      },
      {
        question: "Ile netto zarobię w Warszawie przy średnim wynagrodzeniu?",
        answer: "Przy średnim wynagrodzeniu brutto w województwie mazowieckim (8 200 PLN) pracownik otrzyma na rękę około 5 929 PLN netto. Skorzystaj z kalkulatora powyżej, aby obliczyć dokładną kwotę dla swojego wynagrodzenia.",
      },
      {
        question: "Dlaczego wynagrodzenia na Mazowszu są najwyższe w Polsce?",
        answer: "Wynagrodzenia w województwie mazowieckim są najwyższe ze względu na koncentrację międzynarodowych korporacji, instytucji finansowych i firm technologicznych w Warszawie. Wysoki koszt życia w stolicy również wpływa na wyższe wynagrodzenia. Dodatkowo Warszawa jest centrum administracyjnym kraju z dużym popytem na wykwalifikowaną kadrę.",
      },
    ],
  },
  {
    slug: "malopolskie",
    name: "Małopolskie",
    nameLocative: "małopolskim",
    capital: "Kraków",
    averageSalary: 7100,
    population: "3,4 mln",
    description: "Kalkulator wynagrodzeń dla województwa małopolskiego. Sprawdź ile zarobisz netto w Krakowie i regionie. Oblicz składki ZUS, zdrowotną, PIT na 2026.",
    economicContext: "Województwo małopolskie z Krakowem jako stolicą jest drugim co do wielkości centrum biznesowym w Polsce. Kraków jest uznawany za polską stolicę outsourcingu IT i BPO/SSC — działa tu ponad 200 centrów usług wspólnych zatrudniających dziesiątki tysięcy osób. Średnie wynagrodzenie wynosi około 7 100 PLN brutto. Region łączy silny sektor technologiczny z bogatą tradycją akademicką — Kraków jest jednym z największych ośrodków akademickich z Uniwersytetem Jagiellońskim i AGH. Branża turystyczna również odgrywa istotną rolę w gospodarce regionu.",
    keyIndustries: ["IT i outsourcing", "BPO/SSC", "turystyka", "edukacja i nauka", "przemysł metalurgiczny", "usługi finansowe"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie w Krakowie w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie małopolskim w 2026 roku wynosi około 7 100 PLN miesięcznie. W samym Krakowie wynagrodzenia w sektorze IT i BPO mogą być znacząco wyższe, sięgając 10 000–15 000 PLN brutto na stanowiskach specjalistycznych.",
      },
      {
        question: "Ile netto zarobię w Małopolsce przy średniej pensji?",
        answer: "Przy średnim wynagrodzeniu 7 100 PLN brutto w województwie małopolskim pracownik otrzyma na rękę około 5 174 PLN netto po odliczeniu składek ZUS, zdrowotnej i PIT. Użyj kalkulatora, aby sprawdzić dokładną kwotę.",
      },
      {
        question: "Jakie branże najlepiej płacą w Krakowie?",
        answer: "Najlepiej płatne branże w Krakowie to IT i nowe technologie, centra usług wspólnych (BPO/SSC), finanse i doradztwo. Programiści senior mogą zarabiać 15 000–25 000 PLN brutto, a specjaliści w centrach usług 8 000–12 000 PLN brutto.",
      },
    ],
  },
  {
    slug: "slaskie",
    name: "Śląskie",
    nameLocative: "śląskim",
    capital: "Katowice",
    averageSalary: 6800,
    population: "4,4 mln",
    description: "Kalkulator wynagrodzeń dla województwa śląskiego. Oblicz wynagrodzenie brutto-netto w Katowicach i na Śląsku. Składki ZUS, PIT 2026.",
    economicContext: "Województwo śląskie to jeden z najgęściej zaludnionych regionów Polski z silną tradycją przemysłową. Region przechodzi transformację z gospodarki opartej na górnictwie i hutnictwie w kierunku nowoczesnych usług, IT i motoryzacji. Średnie wynagrodzenie wynosi około 6 800 PLN brutto. Aglomeracja katowicka z miastami takimi jak Katowice, Gliwice, Sosnowiec i Bielsko-Biała tworzy duży rynek pracy. Katowice stają się coraz ważniejszym centrum IT i BPO w Polsce, oferując niższe koszty życia niż Warszawa czy Kraków przy konkurencyjnych wynagrodzeniach.",
    keyIndustries: ["motoryzacja", "IT i BPO", "górnictwo i energetyka", "hutnictwo", "logistyka", "usługi biznesowe"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie na Śląsku w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie śląskim w 2026 roku wynosi około 6 800 PLN miesięcznie. Region oferuje zróżnicowane wynagrodzenia — od sektora górniczego po nowoczesne usługi IT.",
      },
      {
        question: "Ile netto zarobię przy średniej pensji na Śląsku?",
        answer: "Przy średnim wynagrodzeniu 6 800 PLN brutto w województwie śląskim pracownik otrzyma na rękę około 4 955 PLN netto. Dokładną kwotę dla Twojego wynagrodzenia obliczysz kalkulatorem powyżej.",
      },
      {
        question: "Czy Śląsk to dobry region do pracy w IT?",
        answer: "Tak, Katowice i Gliwice rozwijają się jako centra IT i BPO. Region oferuje konkurencyjne wynagrodzenia (7 000–15 000 PLN brutto w IT) przy niższych kosztach życia niż Warszawa. Obecność Politechniki Śląskiej zapewnia stały dopływ wykwalifikowanej kadry.",
      },
    ],
  },
  {
    slug: "wielkopolskie",
    name: "Wielkopolskie",
    nameLocative: "wielkopolskim",
    capital: "Poznań",
    averageSalary: 6900,
    population: "3,5 mln",
    description: "Kalkulator wynagrodzeń województwo wielkopolskie. Oblicz netto z brutto w Poznaniu i Wielkopolsce. Aktualne składki ZUS, zdrowotna, PIT 2026.",
    economicContext: "Województwo wielkopolskie z Poznaniem jako stolicą to trzecia co do wielkości gospodarka regionalna w Polsce. Region charakteryzuje się najniższą stopą bezrobocia i silną kulturą przedsiębiorczości. Średnie wynagrodzenie wynosi około 6 900 PLN brutto. Poznań jest ważnym centrum handlowym — Międzynarodowe Targi Poznańskie to największa instytucja targowa w Polsce. Region ma rozwinięty przemysł motoryzacyjny (Volkswagen), spożywczy i farmaceutyczny. Wielkopolska przyciąga również inwestorów zagranicznych dzięki dobremu położeniu logistycznemu i wykwalifikowanej kadrze.",
    keyIndustries: ["motoryzacja", "przemysł spożywczy", "handel i targi", "logistyka", "farmacja", "IT i usługi"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie w Poznaniu w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie wielkopolskim w 2026 roku wynosi około 6 900 PLN miesięcznie. Poznań oferuje wynagrodzenia wyższe niż średnia regionalna, szczególnie w IT, motoryzacji i handlu.",
      },
      {
        question: "Ile netto zarobię w Wielkopolsce przy średniej pensji?",
        answer: "Przy średnim wynagrodzeniu 6 900 PLN brutto w województwie wielkopolskim pracownik otrzyma na rękę około 5 028 PLN netto po odliczeniu składek i podatków. Skorzystaj z kalkulatora, aby obliczyć netto dla swojej kwoty brutto.",
      },
      {
        question: "Jakie są perspektywy zarobkowe w Wielkopolsce?",
        answer: "Wielkopolska oferuje stabilny rynek pracy z niskim bezrobociem. Najlepiej płatne sektory to motoryzacja (Volkswagen i poddostawcy), IT, farmacja i logistyka. Region przyciąga inwestycje zagraniczne, co zwiększa popyt na pracowników i napędza wzrost wynagrodzeń.",
      },
    ],
  },
  {
    slug: "dolnoslaskie",
    name: "Dolnośląskie",
    nameLocative: "dolnośląskim",
    capital: "Wrocław",
    averageSalary: 7000,
    population: "2,9 mln",
    description: "Kalkulator wynagrodzeń dla Dolnego Śląska. Oblicz wynagrodzenie netto z brutto we Wrocławiu i regionie. Składki ZUS, zdrowotna, PIT 2026.",
    economicContext: "Województwo dolnośląskie z Wrocławiem to jeden z najdynamiczniej rozwijających się regionów Polski. Wrocław jest trzecim co do wielkości centrum IT w Polsce, a także ważnym ośrodkiem BPO/SSC. Średnie wynagrodzenie wynosi około 7 000 PLN brutto. Region przyciąga inwestycje zagraniczne — we Wrocławiu i okolicach działają centra rozwojowe Google, IBM, Hewlett-Packard, Credit Suisse i wielu innych korporacji. Silna baza akademicka (Politechnika Wrocławska, Uniwersytet Wrocławski) zapewnia stały dopływ kadr. Atrakcyjny stosunek wynagrodzeń do kosztów życia czyni Wrocław jednym z najbardziej pożądanych miast do pracy w Polsce.",
    keyIndustries: ["IT i nowe technologie", "BPO/SSC", "przemysł elektroniczny", "motoryzacja", "farmacja", "chemia"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie we Wrocławiu w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie dolnośląskim w 2026 roku wynosi około 7 000 PLN miesięcznie. We Wrocławiu, szczególnie w IT i BPO, wynagrodzenia mogą być wyższe — specjaliści zarabiają 9 000–18 000 PLN brutto.",
      },
      {
        question: "Ile netto zarobię na Dolnym Śląsku przy średniej pensji?",
        answer: "Przy średnim wynagrodzeniu 7 000 PLN brutto w województwie dolnośląskim pracownik otrzyma na rękę około 5 102 PLN netto. Użyj kalkulatora, aby sprawdzić netto dla Twojego konkretnego wynagrodzenia.",
      },
      {
        question: "Czy Wrocław konkuruje z Warszawą pod względem zarobków w IT?",
        answer: "Wrocław oferuje wynagrodzenia w IT niższe o 10–20% niż Warszawa, ale przy znacznie niższych kosztach życia (szczególnie wynajmu). Stosunek netto do kosztów życia jest w wielu przypadkach korzystniejszy we Wrocławiu, co czyni go atrakcyjnym rynkiem pracy dla specjalistów IT.",
      },
    ],
  },
  {
    slug: "pomorskie",
    name: "Pomorskie",
    nameLocative: "pomorskim",
    capital: "Gdańsk",
    averageSalary: 7050,
    population: "2,3 mln",
    description: "Kalkulator wynagrodzeń dla województwa pomorskiego. Oblicz netto z brutto w Gdańsku i Trójmieście. Aktualne składki ZUS, PIT na 2026 rok.",
    economicContext: "Województwo pomorskie z Trójmiastem (Gdańsk, Gdynia, Sopot) to dynamiczny region z unikatową mieszanką tradycji morskiej i nowoczesnych technologii. Średnie wynagrodzenie wynosi około 7 050 PLN brutto. Gdańsk jest jednym z najszybciej rosnących rynków IT w Polsce, przyciągającym międzynarodowe firmy technologiczne i centra R&D. Region ma silne tradycje w stoczniówce, logistyce portowej i sektorze morskim. Trójmiasto oferuje wysoką jakość życia z dostępem do morza, co przyciąga specjalistów z całej Polski. Port w Gdańsku jest największym portem w Polsce, generując liczne miejsca pracy w logistyce i handlu międzynarodowym.",
    keyIndustries: ["IT i gamedev", "logistyka i porty morskie", "stoczniówka", "turystyka", "energetyka (w tym offshore)", "BPO/SSC"],
    faq: [
      {
        question: "Jakie jest średnie wynagrodzenie w Trójmieście w 2026?",
        answer: "Średnie wynagrodzenie brutto w województwie pomorskim w 2026 roku wynosi około 7 050 PLN miesięcznie. Trójmiasto, szczególnie Gdańsk, oferuje wynagrodzenia wyższe od średniej regionalnej, zwłaszcza w IT i logistyce.",
      },
      {
        question: "Ile netto zarobię w Gdańsku przy średniej pensji?",
        answer: "Przy średnim wynagrodzeniu 7 050 PLN brutto w województwie pomorskim pracownik otrzyma na rękę około 5 138 PLN netto. Skorzystaj z kalkulatora powyżej, aby obliczyć netto dla Twojego wynagrodzenia brutto.",
      },
      {
        question: "Jakie branże najlepiej płacą w Trójmieście?",
        answer: "Najlepiej płatne branże w Trójmieście to IT i gamedev (8 000–20 000 PLN brutto), logistyka morska i portowa, energetyka offshore oraz centra usług wspólnych. Gdańsk jest także ważnym ośrodkiem dla branży gier komputerowych z firmami takimi jak CD Projekt.",
      },
    ],
  },
];
