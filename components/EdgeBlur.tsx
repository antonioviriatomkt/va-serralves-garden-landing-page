"use client";

import { useEffect, useState } from "react";
import { ProgressiveBlur } from "./ui/ProgressiveBlur";

/**
 * Viewport bottom-edge progressive blur (the "BELFOZ lens"). Stays hidden while
 * the hero is in view so its CTAs render crisp, then fades in once the visitor
 * scrolls — content dissolves into the blurred edge as it passes under.
 *
 * Sits at z-30: below the header, WhatsApp button (z-40) and Q0 modal (z-50),
 * so every interactive element stays sharp and clickable above it.
 */
export function EdgeBlur() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 200);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <ProgressiveBlur
      position="bottom"
      height={21}
      baseBlur={1.2}
      className={`z-30 transition-opacity duration-500 ${
        visible ? "opacity-100" : "opacity-0"
      }`}
    />
  );
}
