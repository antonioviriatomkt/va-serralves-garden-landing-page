import type {
  Composition,
  Locale,
  LocaleContent,
  Preset,
} from "@/types/content";
import type { ContentSource } from "./ContentSource";

import compositionJson from "@/content/composition.json";
import enContent from "@/content/serralves-garden.en.json";
import ptContent from "@/content/serralves-garden.pt.json";

// JSON is validated by hand against the types; cast through `unknown` because
// TS widens JSON string fields (e.g. status, preset) beyond our literal unions.
const BUNDLES: Record<Locale, LocaleContent> = {
  en: enContent as unknown as LocaleContent,
  pt: ptContent as unknown as LocaleContent,
};

const COMPOSITION = compositionJson as unknown as Composition;

/**
 * Local JSON implementation of `ContentSource`.
 * Async signatures are preserved so a Sanity-backed adapter is a drop-in
 * replacement (the JSON is resolved synchronously but wrapped in Promises).
 */
export class JsonContentSource implements ContentSource {
  async getLocaleContent(locale: Locale): Promise<LocaleContent> {
    const bundle = BUNDLES[locale];
    if (!bundle) {
      throw new Error(`No content bundle for locale "${locale}"`);
    }
    return bundle;
  }

  async getComposition(preset: Preset): Promise<Composition[Preset]> {
    const composition = COMPOSITION[preset];
    if (!composition) {
      throw new Error(`No composition for preset "${preset}"`);
    }
    return composition;
  }
}

/** Default content source used across the app. */
export const contentSource: ContentSource = new JsonContentSource();
