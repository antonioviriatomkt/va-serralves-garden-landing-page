import type { Locale, Preset } from "@/types/content";

/**
 * Global, non-content site constants.
 * Preset is fixed to `luxury` for this build but the composition/module
 * system supports `mainstream` too (see content/composition.json).
 */
export const SITE = {
  /** Active segment preset for this deployment. */
  preset: "luxury" as Preset,
  name: "Serralves Garden",
  tagline: "Boavista Living",
  developmentSlug: "serralves-garden",
  /** Placeholder WhatsApp number for the demo (VA Properties mobile). */
  whatsappNumber: "351963562733",
  /** Public base URL used for OG tags (safe default for the demo). */
  baseUrl: "https://serralves-garden.example.com",
} as const;

export const LOCALES: Locale[] = ["pt", "en"];
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en";
}
