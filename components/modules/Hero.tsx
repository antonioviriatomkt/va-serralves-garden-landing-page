"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { useQ0 } from "@/lib/q0/Q0Provider";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";
import { CtaButton } from "@/components/ui/CtaButton";
import { ProgressiveBlur } from "@/components/ui/ProgressiveBlur";
import { Magnetic } from "@/components/motion/Magnetic";
import { DURATION, EASE_LUX, RISE, STAGGER } from "@/lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.35 } },
};

const item = {
  hidden: { opacity: 0, y: RISE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_LUX },
  },
};

// Signature moment — the wordmark wipes in left-to-right.
const wordmark = {
  hidden: { clipPath: "inset(0 100% 0 0)" },
  visible: {
    clipPath: "inset(0 0% 0 0)",
    transition: { duration: 1, ease: EASE_LUX },
  },
};

function Hero({ content }: ModuleProps) {
  const { resolved, chooseMode } = useMode();
  const t = useTrack();
  const { open } = useQ0();
  const reduce = useReducedMotion();
  const hero = content.hero;

  return (
    <section
      id="top"
      className="relative flex min-h-[88vh] items-end overflow-hidden bg-plum-900"
    >
      {/* Image settles into place on load (Ken-Burns-lite) */}
      <motion.div
        className="absolute inset-0"
        initial={reduce ? false : { scale: 1.08 }}
        animate={reduce ? false : { scale: 1 }}
        transition={{ duration: 1.8, ease: EASE_LUX }}
      >
        <Media
          slot={hero.imageSlot}
          alt={content.name}
          rounded="rounded-none"
          priority
          showLabel={false}
          className="h-full w-full"
        />
      </motion.div>

      {/* Bottom tint band — fades out slightly above the wordmark */}
      <div
        aria-hidden
        className="absolute inset-x-0 bottom-0 z-0 h-[47%] bg-gradient-to-t from-plum-900/78 via-plum-900/45 to-transparent"
      />
      {/* Progressive-blur lens on the same band (like the bottom bar) */}
      <ProgressiveBlur
        position="bottom"
        fixed={false}
        height="47%"
        baseBlur={0.8}
        layers={6}
        className="z-0"
      />

      {/* Kicker — top, centered */}
      <motion.p
        className="absolute inset-x-0 top-[5.5rem] z-10 text-center text-xs uppercase tracking-widest2 text-cream/85 [text-shadow:0_1px_12px_rgba(36,16,25,0.6)]"
        initial={reduce ? false : { opacity: 0, y: -8 }}
        animate={reduce ? false : { opacity: 1, y: 0 }}
        transition={{ duration: DURATION.slow, ease: EASE_LUX, delay: 0.15 }}
      >
        {hero.kicker}
      </motion.p>

      <motion.div
        className="relative z-10 mx-auto w-full max-w-content px-5 pb-14 pt-28 text-center sm:px-8 sm:pb-20"
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "visible"}
      >
        <motion.h1
          className="mx-auto max-w-2xl"
          variants={reduce ? undefined : wordmark}
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-serralves-garden.svg"
            alt={hero.headline}
            className="mx-auto w-full max-w-lg drop-shadow-[0_1px_10px_rgba(36,16,25,0.35)] sm:max-w-2xl"
          />
        </motion.h1>

        <motion.div
          className="mt-9 flex flex-col items-center gap-3 sm:flex-row sm:justify-center"
          variants={reduce ? undefined : item}
        >
          <Magnetic className="w-full sm:w-auto">
            <CtaButton
              variant="light"
              arrow
              className="w-full sm:w-auto"
              onClick={() => {
                t("hero_cta_clicked", { cta: "primary" });
                open({ source: "hero_primary" });
              }}
            >
              {hero.ctaPrimary}
            </CtaButton>
          </Magnetic>
          <CtaButton
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              t("dossier_requested", { context: "hero" });
              open({ source: "hero_dossier" });
            }}
          >
            {hero.ctaSecondary}
          </CtaButton>
        </motion.div>

        {/* Intent chooser — only while intent is unresolved */}
        {!resolved && (
          <motion.div
            className="mx-auto mt-10 flex flex-col items-center gap-3 border-t border-cream/15 pt-6 sm:flex-row sm:justify-center sm:gap-5"
            variants={reduce ? undefined : item}
          >
            <span className="text-sm text-cream/70">{hero.chooser.prompt}</span>
            <div className="inline-flex overflow-hidden border border-cream/30">
              <button
                type="button"
                onClick={() => chooseMode("res")}
                className="px-5 py-2 text-sm text-cream transition hover:bg-cream/10"
              >
                {hero.chooser.live}
              </button>
              <span aria-hidden className="w-px bg-cream/25" />
              <button
                type="button"
                onClick={() => chooseMode("inv")}
                className="px-5 py-2 text-sm text-cream transition hover:bg-cream/10"
              >
                {hero.chooser.invest}
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </section>
  );
}

registerModule("hero", Hero);
export default Hero;
