"use client";

import { useCallback } from "react";
import { track, type TrackEvent } from "@/lib/track";
import { useMode } from "@/lib/mode/ModeProvider";

/**
 * Context-aware tracker. Returns a `track(event, props)` function that always
 * attaches `{ mode, locale, preset }` — the three parameters the brief requires
 * on every event.
 */
export function useTrack() {
  const { mode, locale, preset } = useMode();

  return useCallback(
    (event: TrackEvent, props: Record<string, unknown> = {}) => {
      track(event, { mode, locale, preset, ...props });
    },
    [mode, locale, preset],
  );
}
