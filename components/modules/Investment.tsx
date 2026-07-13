"use client";

import { useEffect, useRef, useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Collapse } from "@/components/motion/Collapse";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Investment({ content }: ModuleProps) {
  const { mode } = useMode();
  const t = useTrack();
  const inv = content.investment;

  // Expanded by default in investment mode; collapsed accordion in residence.
  const [expanded, setExpanded] = useState(mode === "inv");
  const autoTracked = useRef(false);

  useEffect(() => {
    if (mode === "inv" && !autoTracked.current) {
      autoTracked.current = true;
      t("investment_section_expanded", { auto: true });
    }
  }, [mode, t]);

  function toggle() {
    setExpanded((prev) => {
      const next = !prev;
      if (next) t("investment_section_expanded", { auto: false });
      return next;
    });
  }

  return (
    <Section id="investment" tone="white">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={expanded}
        className="flex w-full items-start justify-between gap-6 text-left"
      >
        <SectionHeading kicker={content.tagline} title={inv.title} />
        <span
          className={`mt-2 flex-shrink-0 text-plum-500 transition-transform duration-300 ease-lux ${
            expanded ? "-rotate-180" : ""
          }`}
          aria-hidden
        >
          <svg width="18" height="18" viewBox="0 0 16 16" fill="none">
            <path
              d="M4 6l4 4 4-4"
              stroke="currentColor"
              strokeWidth="1.4"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </span>
      </button>

      <Collapse open={expanded}>
        <div>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-plum-700">
            {inv.intro}
          </p>

          <div className="mt-10 grid gap-8 lg:grid-cols-2">
            <ul className="grid gap-6">
              {inv.points.map((p) => (
                <li key={p.title} className="border-t border-travertine-200 pt-4">
                  <h3 className="font-serif text-lg text-plum-800">{p.title}</h3>
                  <p className="mt-2 leading-relaxed text-ink/70">{p.body}</p>
                </li>
              ))}
            </ul>

            <div className="flex flex-col gap-6">
              {/* Phase repricing fact */}
              <div className="rounded-xl bg-plum-800 p-6 text-cream">
                <p className="text-xs uppercase tracking-widest2 text-brass">
                  {inv.repricing.label}
                </p>
                <div className="mt-4 flex items-end gap-4">
                  <div>
                    <p className="text-sm text-cream/60 line-through">
                      {inv.repricing.launch}
                    </p>
                    <p className="font-serif text-3xl text-cream">
                      {inv.repricing.current}
                    </p>
                  </div>
                </div>
                <p className="mt-4 text-sm leading-relaxed text-cream/70">
                  {inv.repricing.note}
                </p>
              </div>

              {/* Foreign-buyer / remote purchase */}
              <div className="rounded-xl border border-travertine-300 p-6">
                <h3 className="font-serif text-lg text-plum-800">
                  {inv.foreignBuyer.title}
                </h3>
                {inv.foreignBuyer.body.map((para, i) => (
                  <p key={i} className="mt-2 text-sm leading-relaxed text-ink/65">
                    {para}
                  </p>
                ))}
              </div>
            </div>
          </div>

          <p className="mt-8 text-xs leading-relaxed text-ink/45">
            {inv.disclaimer}
          </p>
        </div>
      </Collapse>
    </Section>
  );
}

registerModule("investment", Investment);
export default Investment;
