"use client";

import { ReactLenis } from "lenis/react";
import type { ReactNode } from "react";

/**
 * Global weighted smooth scroll — the single biggest "feel" upgrade. Lenis does
 * real window scrolling with easing, so `window.scrollY` and native scroll
 * events still fire (the EdgeBlur and anchor nav keep working).
 *
 * Opt out on nested vertical scrollers (e.g. the Q0 modal) with
 * `data-lenis-prevent`. Horizontal-only scrollers don't need it — Lenis only
 * virtualizes the vertical axis, so it never traps a sideways table scroll.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  return (
    <ReactLenis
      root
      options={{
        lerp: 0.09,
        smoothWheel: true,
        wheelMultiplier: 1,
        touchMultiplier: 1.4,
        anchors: true,
      }}
    >
      {children}
    </ReactLenis>
  );
}
