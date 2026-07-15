"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useReducedMotion } from "framer-motion";
import { EASE_LUX } from "@/lib/motion";

/**
 * Counts the first integer in `value` up from zero when it scrolls into view,
 * preserving any surrounding text ("16+", "8 / 14", "5"). Non-numeric values
 * render as-is. Honors reduced motion.
 *
 * Resilience: `display` defaults to the REAL value, so server-render, no-JS,
 * reduced-motion — and any case where the scroll trigger never fires (smooth-
 * scroll quirks, a backgrounded tab) — show the real numbers, never zeros. The
 * count-up is a progressive enhancement layered on via a self-owned
 * IntersectionObserver, which is more reliable under smooth-scroll libraries
 * (Lenis) than framer's viewport hook was here.
 */
export function CountUp({
  value,
  duration = 1.4,
}: {
  value: string;
  duration?: number;
}) {
  const reduce = useReducedMotion();
  const ref = useRef<HTMLSpanElement>(null);

  // Keep deps primitive so the tween isn't restarted on every re-render.
  const matchStr = value.match(/\d[\d.]*/)?.[0] ?? null;
  const target = matchStr ? parseInt(matchStr.replace(/\D/g, ""), 10) : null;
  const animated = !reduce && matchStr !== null && target !== null;

  // Real value by default — the safe fallback the trust section relies on.
  const [display, setDisplay] = useState(value);

  useEffect(() => {
    if (!animated) {
      setDisplay(value);
      return;
    }
    const node = ref.current;
    if (!node) return;

    let controls: ReturnType<typeof animate> | undefined;
    const run = () => {
      controls = animate(0, target as number, {
        duration,
        ease: EASE_LUX,
        onUpdate: (v) =>
          setDisplay(value.replace(matchStr as string, String(Math.round(v)))),
      });
    };

    // Already on screen (e.g. above the fold) → count immediately.
    const rect = node.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
      run();
      return () => controls?.stop();
    }

    // Otherwise count up the moment it scrolls into view.
    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          io.disconnect();
          run();
        }
      },
      { threshold: 0 },
    );
    io.observe(node);
    return () => {
      io.disconnect();
      controls?.stop();
    };
  }, [animated, target, matchStr, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
