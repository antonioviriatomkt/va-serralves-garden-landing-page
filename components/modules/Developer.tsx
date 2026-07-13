"use client";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { CountUp } from "@/components/motion/CountUp";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Developer({ content }: ModuleProps) {
  const d = content.developer;
  return (
    <Section id="developer" tone="plum">
      <div className="grid gap-12 lg:grid-cols-[1.2fr_1fr] lg:gap-16">
        <div>
          <SectionHeading kicker={content.name} title={d.title} invert />
          <p className="mt-5 text-lg leading-relaxed text-cream/85">{d.lead}</p>
          {d.body.map((para, i) => (
            <p key={i} className="mt-4 leading-relaxed text-cream/70">
              {para}
            </p>
          ))}

          {/* Factual scarcity line — subtle, per Luxury preset */}
          <p className="mt-8 border-l-2 border-brass pl-4 font-serif text-xl italic text-cream">
            {d.scarcityLine}
          </p>
        </div>

        <div className="flex flex-col justify-between gap-10">
          <Stagger as="dl" className="grid grid-cols-2 gap-6">
            {d.stats.map((s) => (
              <StaggerItem key={s.label}>
                <dt className="font-serif text-3xl text-cream">
                  <CountUp value={s.value} />
                </dt>
                <dd className="mt-1 text-xs uppercase tracking-widest2 text-cream/55">
                  {s.label}
                </dd>
              </StaggerItem>
            ))}
          </Stagger>

          <div className="rounded-xl border border-cream/15 p-6">
            <p className="text-xs uppercase tracking-widest2 text-brass">
              {d.architecture.studio}
            </p>
            <p className="mt-2 font-serif text-lg text-cream">
              {d.architecture.architects}
            </p>
            <p className="mt-2 text-sm leading-relaxed text-cream/65">
              {d.architecture.note}
            </p>
          </div>
        </div>
      </div>
    </Section>
  );
}

registerModule("developer", Developer);
export default Developer;
