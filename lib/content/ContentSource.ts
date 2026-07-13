import type {
  Composition,
  Locale,
  LocaleContent,
  Preset,
} from "@/types/content";

/**
 * The content adapter contract.
 *
 * Components never import JSON directly — they receive resolved content from a
 * `ContentSource`. Today this is backed by local JSON (see jsonAdapter.ts);
 * swapping to Sanity later means implementing this same interface against
 * `@sanity/client` — no component changes required.
 */
export interface ContentSource {
  /** Resolve the localized content bundle (Development document + UI strings). */
  getLocaleContent(locale: Locale): Promise<LocaleContent>;

  /** Resolve the module composition config (module order per preset × mode). */
  getComposition(preset: Preset): Promise<Composition[Preset]>;
}
