"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";
import {
  DURATION,
  EASE_LUX,
  RISE,
  STAGGER,
  staggerParent,
  viewportOnce,
} from "@/lib/motion";

type Tag = "div" | "ul" | "dl" | "section" | "li" | "span" | "p" | "h2" | "h3";

/**
 * Parent that cascades its direct <StaggerItem> children into view. Honors
 * reduced motion.
 */
export function Stagger({
  children,
  className,
  stagger = STAGGER,
  delay = 0,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  stagger?: number;
  delay?: number;
  as?: Extract<Tag, "div" | "ul" | "dl" | "section">;
}) {
  const reduce = useReducedMotion();
  const Comp = motion[as];

  if (reduce) {
    const Plain = as;
    return <Plain className={className}>{children}</Plain>;
  }

  return (
    <Comp
      className={className}
      initial="hidden"
      whileInView="visible"
      viewport={viewportOnce}
      variants={staggerParent(stagger, delay)}
    >
      {children}
    </Comp>
  );
}

export function StaggerItem({
  children,
  className,
  y = RISE,
  as = "div",
}: {
  children: ReactNode;
  className?: string;
  y?: number;
  as?: Extract<Tag, "div" | "li" | "span" | "p" | "h2" | "h3">;
}) {
  const Comp = motion[as];
  return (
    <Comp
      className={className}
      variants={{
        hidden: { opacity: 0, y },
        visible: {
          opacity: 1,
          y: 0,
          transition: { duration: DURATION.base, ease: EASE_LUX },
        },
      }}
    >
      {children}
    </Comp>
  );
}
