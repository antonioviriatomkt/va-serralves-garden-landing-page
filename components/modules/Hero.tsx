"use client";

import { motion, useReducedMotion } from "framer-motion";
import { Media } from "@/components/ui/Media";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { useQ0 } from "@/lib/q0/Q0Provider";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";
import { CtaButton } from "@/components/ui/CtaButton";
import { DURATION, EASE_LUX, RISE, STAGGER } from "@/lib/motion";

const container = {
  hidden: {},
  visible: { transition: { staggerChildren: STAGGER, delayChildren: 0.2 } },
};

const item = {
  hidden: { opacity: 0, y: RISE },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: DURATION.base, ease: EASE_LUX },
  },
};

function Hero({ content }: ModuleProps) {
  const { resolved, chooseMode, mode } = useMode();
  const t = useTrack();
  const { open } = useQ0();
  const reduce = useReducedMotion();
  const hero = content.hero;
  const nums = content.keyNumbers.items;

  // Three stats for the hairline strip: typology · residences · delivery.
  const stats = [nums[1], nums[0], nums[3]].filter(Boolean);

  return (
    <section
      id="top"
      className="relative grid grid-cols-1 lg:min-h-[92vh] lg:grid-cols-[0.86fr_1fr]"
    >
      {/* Text panel — cream, generous negative space */}
      <motion.div
        className="order-2 flex flex-col justify-center bg-cream px-6 pb-16 pt-12 sm:px-10 lg:order-1 lg:px-16 lg:pb-20 lg:pt-24"
        variants={reduce ? undefined : container}
        initial={reduce ? false : "hidden"}
        animate={reduce ? false : "visible"}
      >
        <motion.p
          variants={reduce ? undefined : item}
          className="text-xs uppercase tracking-widest2 text-brass"
        >
          {hero.kicker}
        </motion.p>

        <motion.h1 variants={reduce ? undefined : item} className="mt-6">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-serralves-garden-plum.svg"
            alt={hero.headline}
            className="w-full max-w-md"
          />
        </motion.h1>

        <motion.p
          variants={reduce ? undefined : item}
          className="mt-7 max-w-md text-lg leading-relaxed text-plum-700"
        >
          {hero.subheadline[mode]}
        </motion.p>

        <motion.div
          variants={reduce ? undefined : item}
          className="mt-9 flex flex-col gap-4 sm:flex-row sm:items-center"
        >
          <CtaButton
            variant="solid"
            arrow
            className="self-start sm:self-auto"
            onClick={() => {
              t("hero_cta_clicked", { cta: "primary" });
              open({ source: "hero_primary" });
            }}
          >
            {hero.ctaPrimary}
          </CtaButton>
          <button
            type="button"
            onClick={() => {
              t("dossier_requested", { context: "hero" });
              open({ source: "hero_dossier" });
            }}
            className="nav-underline self-start text-sm font-medium text-plum-800 sm:self-auto"
          >
            {hero.ctaSecondary}
          </button>
        </motion.div>

        {/* Intent chooser — only while intent is unresolved */}
        {!resolved && (
          <motion.div
            variants={reduce ? undefined : item}
            className="mt-8 flex flex-wrap items-center gap-x-3 gap-y-1 text-sm text-ink/55"
          >
            <span>{hero.chooser.prompt}</span>
            <span className="inline-flex items-center gap-2">
              <button
                type="button"
                onClick={() => chooseMode("res")}
                className="nav-underline text-plum-800"
              >
                {hero.chooser.live}
              </button>
              <span aria-hidden className="text-ink/30">
                ·
              </span>
              <button
                type="button"
                onClick={() => chooseMode("inv")}
                className="nav-underline text-plum-800"
              >
                {hero.chooser.invest}
              </button>
            </span>
          </motion.div>
        )}

        {/* Micro-stats — content-width cells, each value centred over its label */}
        <motion.div
          variants={reduce ? undefined : item}
          className="mt-12 max-w-md border-t border-travertine-300 pt-6"
        >
          <dl className="flex items-start">
            {stats.map((s, i) => {
              const last = i === stats.length - 1;
              return (
                <div
                  key={s.label}
                  className={`text-center ${
                    i > 0 ? "border-l border-travertine-300 pl-7" : ""
                  } ${last ? "" : "pr-7"}`}
                >
                  <dt className="font-serif text-xl text-plum-800 sm:text-2xl">
                    {s.value}
                  </dt>
                  <dd className="mt-1 text-[0.65rem] uppercase tracking-widest2 text-ink/50">
                    {s.label}
                  </dd>
                </div>
              );
            })}
          </dl>
        </motion.div>
      </motion.div>

      {/* Image panel — clean architectural render */}
      <div className="relative order-1 h-[48vh] overflow-hidden bg-plum-900 lg:order-2 lg:h-auto">
        <motion.div
          className="h-full w-full"
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
      </div>
    </section>
  );
}

registerModule("hero", Hero);
export default Hero;
