/**
 * Content schema types.
 *
 * These types are shaped to mirror a future Sanity "Development" schema so the
 * local JSON adapter can be swapped for a Sanity-backed `ContentSource` without
 * touching any component. Field names and nesting intentionally read like a CMS
 * document (see lib/content/ContentSource.ts for the adapter contract).
 */

export type Locale = "pt" | "en";
export type Preset = "luxury" | "mainstream";
export type Mode = "res" | "inv";

export type UnitStatus = "available" | "reserved" | "sold";
export type Typology = "T2" | "T3" | "T4";

/** Module keys — one per registered section component. */
export type ModuleKey =
  | "hero"
  | "keyNumbers"
  | "gallery"
  | "location"
  | "availability"
  | "finishes"
  | "developer"
  | "investment"
  | "faq"
  | "finalCta";

/** Ordered module list per intent mode, for a given preset. */
export interface CompositionForPreset {
  res: ModuleKey[];
  inv: ModuleKey[];
}

/** Full composition config — keyed by preset (Sanity: a `composition` object). */
export type Composition = Record<Preset, CompositionForPreset>;

/* ------------------------------------------------------------------ */
/* Development document                                                */
/* ------------------------------------------------------------------ */

export interface KeyNumber {
  value: string;
  label: string;
}

export interface HeroContent {
  kicker: string;
  headline: string;
  /** Sub-headline emphasis differs by intent mode. */
  subheadline: Record<Mode, string>;
  deliveryLabel: string;
  ctaPrimary: string;
  ctaSecondary: string;
  chooser: {
    prompt: string;
    live: string;
    invest: string;
  };
  imageSlot: string;
}

export interface GalleryImage {
  slot: string;
  caption: string;
}

export interface GalleryContent {
  title: string;
  intro: string;
  images: GalleryImage[];
}

export interface LocationContent {
  title: string;
  lead: string;
  body: string[];
  highlights: { title: string; description: string }[];
  imageSlot: string;
}

export interface Unit {
  id: string;
  typology: Typology;
  floor: number;
  totalM2: number;
  interiorM2: number;
  balconyM2: number | null;
  yardM2: number | null;
  terraceM2: number | null;
  garageM2: number;
  parkingLabel: string;
  status: UnitStatus;
  /** Optional per-unit image; falls back to a per-typology slot in the grid. */
  imageSlot?: string | null;
}

export interface AvailabilityContent {
  title: string;
  intro: string;
  priceLabel: string;
  requestPriceCta: string;
  reserveCta: string;
  viewDetailsCta: string;
  viewListLabel: string;
  viewGridLabel: string;
  note: string;
  columns: {
    unit: string;
    typology: string;
    floor: string;
    total: string;
    interior: string;
    parking: string;
    status: string;
    price: string;
  };
  statusLabels: Record<UnitStatus, string>;
  detail: {
    heading: string;
    interior: string;
    balcony: string;
    yard: string;
    terrace: string;
    garage: string;
    total: string;
    close: string;
  };
}

export interface FinishesContent {
  title: string;
  intro: string;
  items: { title: string; description: string }[];
}

export interface DeveloperContent {
  title: string;
  lead: string;
  body: string[];
  stats: KeyNumber[];
  scarcityLine: string;
  architecture: {
    studio: string;
    architects: string;
    note: string;
  };
}

export interface InvestmentContent {
  title: string;
  intro: string;
  points: { title: string; body: string }[];
  repricing: {
    label: string;
    launch: string;
    current: string;
    note: string;
  };
  foreignBuyer: {
    title: string;
    body: string[];
  };
  disclaimer: string;
}

export interface FaqContent {
  title: string;
  intro: string;
  items: { q: string; a: string }[];
}

export interface FinalCtaContent {
  title: string;
  body: Record<Mode, string>;
  ctaPrimary: string;
  ctaSecondary: string;
  note: string;
}

/** The "Development" document (Sanity-shaped). */
export interface DevelopmentContent {
  slug: string;
  name: string;
  tagline: string;
  status: string;
  locationLabel: string;
  deliveryLabel: string;
  preset: Preset;
  hero: HeroContent;
  keyNumbers: { items: KeyNumber[] };
  gallery: GalleryContent;
  location: LocationContent;
  availability: AvailabilityContent;
  units: Unit[];
  finishes: FinishesContent;
  developer: DeveloperContent;
  investment: InvestmentContent;
  faq: FaqContent;
  finalCta: FinalCtaContent;
}

/* ------------------------------------------------------------------ */
/* UI microcopy (Sanity: a "siteSettings" / localized strings doc)     */
/* ------------------------------------------------------------------ */

export interface Q0Strings {
  openLabel: string;
  title: string;
  stepOf: string; // "Step {n} of {total}" template with {n}/{total}
  steps: {
    typology: { title: string; help: string };
    purpose: { title: string; help: string; live: string; invest: string };
    strategy: {
      title: string;
      help: string;
      longTerm: string;
      shortTerm: string;
      resale: string;
      ownUse: string;
    };
    timeline: {
      title: string;
      help: string;
      within3: string;
      within6: string;
      within12: string;
      beyond12: string;
    };
    offplan: { title: string; help: string; yes: string; no: string };
    location: {
      title: string;
      help: string;
      countryLabel: string;
      countryPlaceholder: string;
      languageLabel: string;
      pt: string;
      en: string;
    };
    contact: {
      title: string;
      help: string;
      name: string;
      email: string;
      phone: string;
      consent: string;
    };
  };
  buttons: { back: string; next: string; submit: string; close: string };
  confirmation: {
    title: string;
    body: string;
    followUp: string;
    whatsapp: string;
    done: string;
  };
  validation: { required: string; email: string };
}

export interface UIStrings {
  localeName: string;
  otherLocaleName: string;
  otherLocaleCode: Locale;
  nav: {
    availability: string;
    location: string;
    contact: string;
    languageSwitch: string;
  };
  modeToggle: {
    label: string;
    live: string;
    invest: string;
  };
  whatsapp: {
    label: string;
    prefill: string;
  };
  footer: {
    developer: string;
    address: string;
    disclaimer: string;
    demoNotice: string;
  };
  q0: Q0Strings;
}

/** One localized content bundle (a locale's JSON file). */
export interface LocaleContent {
  locale: Locale;
  development: DevelopmentContent;
  ui: UIStrings;
}
