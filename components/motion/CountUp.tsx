"use client";

import { useEffect, useRef, useState } from "react";
import { animate, useInView, useReducedMotion } from "framer-motion";
import { EASE_LUX } from "@/lib/motion";

/**
 * Counts the first integer in `value` up from zero when it scrolls into view,
 * preserving any surrounding text ("16+", "8 / 14", "5"). Non-numeric values
 * render as-is. Honors reduced motion.
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
  const inView = useInView(ref, { once: true, margin: "0px 0px -15% 0px" });

  // Keep deps primitive so the tween isn't restarted on every re-render.
  const matchStr = value.match(/\d[\d.]*/)?.[0] ?? null;
  const target = matchStr ? parseInt(matchStr.replace(/\D/g, ""), 10) : null;
  const animated = !reduce && matchStr !== null && target !== null;

  const [display, setDisplay] = useState(
    animated ? value.replace(matchStr as string, "0") : value,
  );

  useEffect(() => {
    if (!inView || !animated) return;
    const controls = animate(0, target as number, {
      duration,
      ease: EASE_LUX,
      onUpdate: (v) =>
        setDisplay(value.replace(matchStr as string, String(Math.round(v)))),
    });
    return () => controls.stop();
  }, [inView, animated, target, matchStr, value, duration]);

  return (
    <span ref={ref} className="tabular-nums">
      {display}
    </span>
  );
}
