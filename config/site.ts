import type { Locale, Preset } from "@/types/content";

/**
 * Public base URL for OG/canonical tags. Env-driven so share previews resolve
 * on the actually-deployed domain:
 *   1. NEXT_PUBLIC_SITE_URL — explicit canonical domain (set in Vercel).
 *   2. VERCEL_PROJECT_PRODUCTION_URL — stable production URL across deploys.
 *   3. VERCEL_URL — per-deployment URL (preview deploys).
 *   4. http://localhost:3000 — local dev.
 */
function resolveBaseUrl(): string {
  const explicit = process.env.NEXT_PUBLIC_SITE_URL;
  if (explicit) {
    return explicit.startsWith("http") ? explicit : `https://${explicit}`;
  }
  const prod = process.env.VERCEL_PROJECT_PRODUCTION_URL;
  if (prod) return `https://${prod}`;
  const preview = process.env.VERCEL_URL;
  if (preview) return `https://${preview}`;
  return "http://localhost:3000";
}

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
  /** VA Properties WhatsApp number (Portugal, international format for wa.me). */
  whatsappNumber: "351920615683",
  /** Public base URL used for OG/canonical tags — resolved from env. */
  baseUrl: resolveBaseUrl(),
} as const;

export const LOCALES: Locale[] = ["pt", "en"];
export const DEFAULT_LOCALE: Locale = "pt";

export function isLocale(value: string | undefined): value is Locale {
  return value === "pt" || value === "en";
}
