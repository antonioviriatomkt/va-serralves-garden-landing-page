"use client";

import { Section } from "@/components/ui/Section";
import { CtaButton } from "@/components/ui/CtaButton";
import { Magnetic } from "@/components/motion/Magnetic";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { useQ0 } from "@/lib/q0/Q0Provider";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function FinalCta({ content }: ModuleProps) {
  const { mode } = useMode();
  const t = useTrack();
  const { open } = useQ0();
  const c = content.finalCta;

  return (
    <Section id="contact" tone="plum" className="text-center">
      <div className="mx-auto max-w-2xl">
        <p className="text-xs uppercase tracking-widest2 text-brass">
          {content.name} · {content.tagline}
        </p>
        <h2 className="mt-4 font-serif text-3xl leading-tight text-cream sm:text-4xl">
          {c.title}
        </h2>
        <p className="mx-auto mt-5 max-w-xl leading-relaxed text-cream/75">
          {c.body[mode]}
        </p>

        <div className="mt-9 flex flex-col items-center justify-center gap-3 sm:flex-row">
          <Magnetic className="w-full sm:w-auto">
            <CtaButton
              variant="light"
              arrow
              className="w-full sm:w-auto"
              onClick={() => {
                t("hero_cta_clicked", { cta: "final" });
                open({ source: "final_cta" });
              }}
            >
              {c.ctaPrimary}
            </CtaButton>
          </Magnetic>
          <CtaButton
            variant="outline"
            className="w-full sm:w-auto"
            onClick={() => {
              t("dossier_requested", { context: "final_cta" });
              open({ source: "final_cta_dossier" });
            }}
          >
            {c.ctaSecondary}
          </CtaButton>
        </div>

        <p className="mt-6 text-sm text-cream/55">{c.note}</p>
      </div>
    </Section>
  );
}

registerModule("finalCta", FinalCta);
export default FinalCta;
