"use client";

import { Section } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { BuildingSketch } from "@/components/ui/BuildingSketch";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function KeyNumbers({ content }: ModuleProps) {
  const items = content.keyNumbers.items;
  return (
    <Section
      tone="cream"
      className="py-14 sm:py-20 lg:relative lg:z-10 lg:-mt-28 lg:pt-28 lg:shadow-[0_-22px_46px_-22px_rgba(45,42,38,0.30)]"
    >
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <BuildingSketch className="mx-auto w-full max-w-md lg:mx-0" />

        <Stagger
          as="dl"
          className="grid grid-cols-2 gap-x-6 gap-y-8 sm:gap-y-10"
        >
          {items.map((item) => (
            <StaggerItem key={item.label} className="text-center sm:text-left">
              <dt className="font-serif text-2xl text-plum-800 sm:text-3xl">
                {item.value}
              </dt>
              <dd className="mt-1 text-xs uppercase tracking-widest2 text-ink/55">
                {item.label}
              </dd>
            </StaggerItem>
          ))}
        </Stagger>
      </div>
    </Section>
  );
}

registerModule("keyNumbers", KeyNumbers);
export default KeyNumbers;
