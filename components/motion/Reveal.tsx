"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import { DURATION, EASE_LUX, RISE, viewportOnce } from "@/lib/motion";

/**
 * Fade + rise into view, once. Honors `prefers-reduced-motion` (renders in
 * place with no transform).
 */
export function Reveal({
  children,
  delay = 0,
  y = RISE,
  className,
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={className}
      initial={{ opacity: 0, y }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={viewportOnce}
      transition={{ duration: DURATION.base, ease: EASE_LUX, delay }}
    >
      {children}
    </motion.div>
  );
}
