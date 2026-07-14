"use client";

import { Section, SectionHeading } from "@/components/ui/Section";
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
