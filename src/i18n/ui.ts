import type { Locale } from './routes';
const en = {
  updatedOn: 'Updated on', editorialPolicy: 'Editorial policy', contactLabel: 'Contact', reviewedBy: 'Checked by',
  skipToContent: 'Skip to content', mainNav: 'Main navigation', breadcrumbLabel: 'Breadcrumb', breadcrumbHome: 'Home', menuOpen: 'Open menu',
  faqTitle: 'Frequently asked questions', relatedCalculators: 'Related calculators and guides', sourcesTitle: 'Sources', writtenBy: 'Written by',
  asOf: 'Rates', lastUpdated: 'last updated', footerValidated: 'Official ZUS and PIT rates', footerBrowser: '100 % in your browser · no data sent · free',
  footerDisclaimer: 'Estimates only. Your payslip, ZUS and the tax office are authoritative; this is not tax advice.', footerPopular: 'Popular calculations', notFound: 'This page does not exist.',
};
const pl: typeof en = {
  updatedOn: 'Aktualizacja:', editorialPolicy: 'Polityka redakcyjna', contactLabel: 'Kontakt', reviewedBy: 'Sprawdził zespół',
  skipToContent: 'Przejdź do treści', mainNav: 'Nawigacja główna', breadcrumbLabel: 'Ścieżka nawigacji', breadcrumbHome: 'Strona główna', menuOpen: 'Otwórz menu',
  faqTitle: 'Najczęściej zadawane pytania', relatedCalculators: 'Powiązane kalkulatory i poradniki', sourcesTitle: 'Źródła', writtenBy: 'Autor:',
  asOf: 'Stawki', lastUpdated: 'ostatnia aktualizacja', footerValidated: 'Oficjalne stawki ZUS i PIT', footerBrowser: '100 % w Twojej przeglądarce · żadne dane nie są wysyłane · bezpłatnie',
  footerDisclaimer: 'Wyniki mają charakter szacunkowy. Wiążące są lista płac, ZUS i urząd skarbowy; to nie jest doradztwo podatkowe.', footerPopular: 'Popularne obliczenia', notFound: 'Ta strona nie istnieje.',
};
export function t(lang: Locale) { return lang === 'en' ? en : pl; }
