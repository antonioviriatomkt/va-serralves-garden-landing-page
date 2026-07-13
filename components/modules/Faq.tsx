"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Collapse } from "@/components/motion/Collapse";
import { useTrack } from "@/lib/hooks/useTrack";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Faq({ content }: ModuleProps) {
  const t = useTrack();
  const f = content.faq;
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function toggle(i: number, question: string) {
    setOpenIndex((prev) => {
      const next = prev === i ? null : i;
      if (next === i) t("faq_opened", { index: i, question });
      return next;
    });
  }

  return (
    <Section id="faq" tone="cream">
      <SectionHeading kicker={content.tagline} title={f.title} intro={f.intro} />
      <div className="mt-8 divide-y divide-travertine-200 border-y border-travertine-200">
        {f.items.map((item, i) => {
          const isOpen = openIndex === i;
          return (
            <div key={i}>
              <button
                type="button"
                onClick={() => toggle(i, item.q)}
                aria-expanded={isOpen}
                className="flex w-full items-center justify-between gap-4 py-5 text-left"
              >
                <span className="font-serif text-lg text-plum-800">
                  {item.q}
                </span>
                <span
                  className={`flex-shrink-0 text-plum-500 transition-transform duration-300 ease-lux ${
                    isOpen ? "-rotate-180" : ""
                  }`}
                  aria-hidden
                >
                  <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
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
              <Collapse open={isOpen}>
                <p className="pb-6 pr-10 leading-relaxed text-ink/70">
                  {item.a}
                </p>
              </Collapse>
            </div>
          );
        })}
      </div>
    </Section>
  );
}

registerModule("faq", Faq);
export default Faq;
