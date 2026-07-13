import type { Locale, Mode, Preset } from "@/types/content";

/**
 * Analytics stub. Every event is logged to `console.debug` and pushed to
 * `window.dataLayer` (GTM-compatible). No real pixels/analytics in the demo —
 * Phase 3 replaces the sink, not the call sites.
 */

export type TrackEvent =
  | "page_view"
  | "mode_resolved"
  | "mode_switched"
  | "hero_cta_clicked"
  | "gallery_engaged"
  | "unit_viewed"
  | "availability_view_changed"
  | "price_requested"
  | "dossier_requested"
  | "investment_section_expanded"
  | "faq_opened"
  | "location_map_activated"
  | "whatsapp_clicked"
  | "q0_started"
  | "q0_step_completed"
  | "q0_submitted"
  | "q0_abandoned";

/** Context automatically attached to every event. */
export interface TrackContext {
  mode: Mode;
  locale: Locale;
  preset: Preset;
}

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

/**
 * Low-level track: emits to console + dataLayer. Callers should generally use
 * the `useTrack()` hook, which injects `{ mode, locale, preset }` automatically.
 */
export function track(
  event: TrackEvent,
  props: Record<string, unknown> = {},
): void {
  const payload = {
    event,
    ...props,
    timestamp: new Date().toISOString(),
  };

  // Visible in the browser console (filter by "[track]").
  // eslint-disable-next-line no-console
  console.debug("[track]", event, payload);

  if (typeof window !== "undefined") {
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push(payload);
  }
}
