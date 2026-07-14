"use client";

import { Section } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImages } from "@/components/ui/EditorialImages";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Gallery({ content }: ModuleProps) {
  const g = content.gallery;
  return (
    <Section id="gallery" tone="cream">
      <Reveal>
        <p className="text-xs uppercase tracking-widest2 text-brass">
          {g.kicker}
        </p>
        <h2 className="mt-4 max-w-3xl font-serif text-3xl leading-[1.15] text-plum-800 sm:text-4xl lg:text-5xl">
          {g.headline}
        </h2>
      </Reveal>

      {/* First two render plates — stacked, editorial */}
      <EditorialImages
        images={g.images.slice(0, 2)}
        layout="stack"
        className="mt-12 sm:mt-16"
      />
    </Section>
  );
}

registerModule("gallery", Gallery);
export default Gallery;
