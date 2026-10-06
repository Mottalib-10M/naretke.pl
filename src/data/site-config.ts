/** Configuration centrale du site (générée par new-site.py). */
export const SITE_URL = "https://naretke.pl";
export const SITE_NAMES: Record<string, string> = {"pl": "naretke.pl", "en": "naretke.pl"};
export const LANG_TAGS: Record<string, string> = {"pl": "pl-PL", "en": "en-PL"};
export const OG_LOCALES: Record<string, string> = {"pl": "pl_PL", "en": "en_GB"};
export const LOCALE_TAG = 'pl-PL';
/** Une locale par langue (RECETTE §4) : « 5 000 zł » en polonais, « PLN 5,000 » en anglais. */
export const LOCALE_BY_LANG: Record<'pl' | 'en', string> = { pl: 'pl-PL', en: 'en-GB' };
export const CURRENCY = 'PLN';
export const YEAR = 2026;
/** Année de création du site — signal d'ancienneté (RECETTE §8.0). */
export const SITE_FOUNDED = '2026';
export const LAST_UPDATED = '2026-10-03';
export const AUTHOR_NAME = 'Radif Partners';
export const AUTHOR_ROLE: Record<string, string> = {"pl": "Wydawca kalkulatorów wynagrodzeń i praktycznych poradników · PIT, ZUS i składka zdrowotna", "en": "Publisher of salary calculators and practical guides · Polish PIT, ZUS and health contribution"};
export const AUTHOR_DESC: Record<string, string> = {"pl": "Radif Partners publikuje bezpłatne kalkulatory wynagrodzeń i praktyczne poradniki. Każda stawka na tej stronie pochodzi z ZUS, Ministerstwa Finansów, gov.pl lub z ustawy w ISAP, z podanym źródłem i datą weryfikacji.", "en": "Radif Partners publishes free salary calculators and practical guides. Every rate on this site comes from ZUS, the Ministry of Finance, gov.pl or the statute in ISAP, with the source and verification date on the page."};
/** Sujets sur lesquels l'editeur est competent (schema.org knowsAbout). Ce sont les
 *  themes reellement traites par le site, pas une liste de mots-cles : un sujet
 *  declare ici sans page qui le couvre est une declaration fausse. */
export const KNOWS_ABOUT: Record<string, string[]> = {"pl": ["Wynagrodzenie brutto netto", "Składki ZUS", "Składka zdrowotna", "Podatek PIT", "Umowa zlecenie", "Umowa o dzieło", "B2B ryczałt, liniowy, skala", "PPK"], "en": ["Polish gross to net salary", "ZUS social contributions", "Health contribution", "Polish PIT", "Mandate contract (umowa zlecenie)", "Contract for specific work (umowa o dzieło)", "B2B taxation in Poland", "PPK pension plan"]};
export const CONTACT_EMAIL = "kontakt@naretke.pl";
export const THEME_COLOR = '#DC143C';
export const LOGO_SYMBOL = 'zł';
export const BING_VERIFY_CODE = '';
export const GOOGLE_VERIFY_CODE = '';
/** Régime de consentement : 'opt-in' = rien avant l'accord (UE, Suisse) ;
 *  'notice' = mesure d'audience active avec information préalable et retrait (CA, AU). */
export const CONSENT_MODE: 'opt-in' | 'notice' | 'none' = 'none';
export const GA4_ID = '';
/** Projet Microsoft Clarity (compte amradif). Vide = aucun traceur ni bandeau. */
export const CLARITY_ID = 'ysy1kl3ph0';
export const INDEXNOW_KEY = '7c2e9a4f1d6b48e3a0c5f7b2d9e4a1c6';

/* ------------------------------------------------------------------------- *
 * IDENTITÉ LÉGALE — À COMPLÉTER AVANT LA MISE EN LIGNE
 * Ces champs alimentent la mention légale du pays, la politique de confidentialité,
 * la page contact et le schema Organization. Un champ vide s'affiche en jaune
 * sur le site. Contrôle : `npm run check:legal`.
 * ------------------------------------------------------------------------- */
export interface LegalHosting { name: string; address: string; phone: string; url: string }
export interface LegalIdentity {
  entityName: string; legalForm: string; street: string; postalCode: string; city: string;
  country: string; phone: string; registerLabel: string; registerNumber: string;
  vatLabel: string; vatNumber: string; jurisdiction: string;
  supervisoryAuthority: string; supervisoryAuthorityUrl: string; hosting: LegalHosting;
}
export const LEGAL: LegalIdentity = {
  entityName: 'Radif Partners',  // éditeur de tous les sites du portefeuille (RECETTE §8)
  legalForm: '',  // vide : publication à titre personnel, pas de société
  street: '49 rue du Ressort',
  postalCode: '63000',
  city: 'Clermont-Ferrand',
  country: "France",
  phone: '',                 // ligne de contact publiée
  registerLabel: "SIREN",
  registerNumber: '',
  vatLabel: "VAT",
  vatNumber: '',             // laisser vide si non assujetti
  jurisdiction: "France",
  supervisoryAuthority: "Commission nationale de l'informatique et des libertés (CNIL)",
  supervisoryAuthorityUrl: "https://www.cnil.fr",
  hosting: { name: 'GitHub, Inc. (GitHub Pages)', address: '88 Colin P Kelly Jr Street, San Francisco, CA 94107, United States', phone: '', url: 'https://pages.github.com' },
};

/** Champs sans lesquels le site ne doit pas être mis en ligne. */
export const LEGAL_REQUIRED: Array<keyof LegalIdentity> = ['entityName', 'street', 'postalCode', 'city'];

/** Profils publics de l'auteur (schema.org sameAs). Laisser vide si aucun. */
export const AUTHOR_SAME_AS: string[] = [];

/** Rythme de revue éditoriale annoncé sur le site, en mois. */
export const REVIEW_CYCLE_MONTHS = 12;
