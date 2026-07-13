import type { Variants, Transition } from "framer-motion";

/**
 * Luxury motion system — one signature easing, long durations, tight
 * choreography. Restraint is the luxury signal; motion should feel weighted,
 * never bouncy. All values are tokens so every reveal reads the same.
 */

/** Signature ease-out (expo-like) for entrances/reveals. */
export const EASE_LUX: [number, number, number, number] = [0.22, 1, 0.36, 1];
/** Smooth in-out for toggles, heights, accordions. */
export const EASE_INOUT: [number, number, number, number] = [0.65, 0, 0.35, 1];

export const DURATION = {
  micro: 0.3,
  base: 0.6,
  slow: 0.9,
} as const;

/** Distance (px) elements rise as they fade in. */
export const RISE = 22;

/** Cascade between sibling items. */
export const STAGGER = 0.08;

export const revealTransition: Transition = {
  duration: DURATION.base,
  ease: EASE_LUX,
};

/** The house reveal: fade + rise. */
export const fadeUp: Variants = {
  hidden: { opacity: 0, y: RISE },
  visible: { opacity: 1, y: 0, transition: revealTransition },
};

/** Parent that cascades its children (use with `staggerItem`). */
export const staggerParent = (stagger = STAGGER, delay = 0): Variants => ({
  hidden: {},
  visible: {
    transition: { staggerChildren: stagger, delayChildren: delay },
  },
});

export const staggerItem: Variants = fadeUp;

/** Shared viewport config — animate once, a little before fully in view. */
export const viewportOnce = { once: true, margin: "0px 0px -12% 0px" } as const;
