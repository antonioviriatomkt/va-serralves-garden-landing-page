"use client";

import { Section, SectionHeading } from "@/components/ui/Section";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { EditorialImages } from "@/components/ui/EditorialImages";
import { SpecMarquee } from "@/components/ui/SpecMarquee";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Finishes({ content }: ModuleProps) {
  const f = content.finishes;
  return (
    <Section id="finishes" tone="travertine">
      <SectionHeading kicker={content.tagline} title={f.title} intro={f.intro} />

      {/* Kinetic spec band — headlines drift past, garage included */}
      <SpecMarquee items={f.items} className="mt-10 sm:mt-12" />

      <Stagger className="mt-12 grid gap-x-8 gap-y-8 sm:grid-cols-2 lg:grid-cols-3">
        {f.items.map((item) => (
          <StaggerItem
            key={item.title}
            className="border-t border-travertine-300 pt-4"
          >
            <h3 className="font-serif text-lg text-plum-800">{item.title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink/65">
              {item.description}
            </p>
          </StaggerItem>
        ))}
      </Stagger>

      {/* Interior render plates */}
      <EditorialImages
        images={content.gallery.images.slice(4, 6)}
        layout="pair"
        className="mt-14 lg:mt-16"
      />
    </Section>
  );
}

registerModule("finishes", Finishes);
export default Finishes;
