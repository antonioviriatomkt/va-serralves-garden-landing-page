"use client";

import { useState } from "react";
import { Section, SectionHeading } from "@/components/ui/Section";
import { Reveal } from "@/components/motion/Reveal";
import { EditorialImages } from "@/components/ui/EditorialImages";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";
import { useMode } from "@/lib/mode/ModeProvider";
import { useTrack } from "@/lib/hooks/useTrack";
import { registerModule, type ModuleProps } from "@/lib/modules/registry";

function Location({ content }: ModuleProps) {
  const l = content.location;
  const { locale } = useMode();
  const t = useTrack();
  const [active, setActive] = useState(false);

  // Keyless Google Maps embed — no API key / env var required (deploy as-is).
  // Boavista / Serralves, Porto (Rua Professor Augusto Nobre, beside Serralves).
  // NB: the `?q=…&output=embed` shortcut 301-redirects *with* X-Frame-Options,
  // which browsers refuse to frame — so we use the real embed endpoint (its
  // redirect target), which sends no frame-blocking header. `pb` is Google's
  // search-embed payload: !1s<query> !6i<zoom>.
  const mapSrc = `https://www.google.com/maps/embed?pb=!1m3!2m1!1sRua+Professor+Augusto+Nobre,+Porto!6i14&hl=${locale}`;
  const prompt =
    locale === "pt" ? "Toque para explorar o mapa" : "Tap to explore the map";

  return (
    <Section id="location" tone="white">
      <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
        <div>
          <SectionHeading kicker={content.locationLabel} title={l.title} />
          <p className="mt-5 text-lg leading-relaxed text-plum-700">{l.lead}</p>
          {l.body.map((para, i) => (
            <p key={i} className="mt-4 leading-relaxed text-ink/70">
              {para}
            </p>
          ))}

          <Stagger as="ul" className="mt-8 grid gap-5 sm:grid-cols-2">
            {l.highlights.map((h) => (
              <StaggerItem as="li" key={h.title}>
                <p className="font-serif text-lg text-plum-800">{h.title}</p>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">
                  {h.description}
                </p>
              </StaggerItem>
            ))}
          </Stagger>
        </div>

        {/* Live map — muted to the palette, straight corners, framed to match. */}
        <Reveal>
          <div className="relative aspect-[4/5] w-full overflow-hidden border border-travertine-300 bg-travertine-100">
            <iframe
              src={mapSrc}
              title={l.title}
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
              className="absolute inset-0 h-full w-full [filter:grayscale(0.32)_sepia(0.18)_saturate(0.82)_contrast(1.03)_brightness(1.02)]"
            />

            {/* Location caption — never blocks the map */}
            <div
              aria-hidden
              className="pointer-events-none absolute inset-x-0 bottom-0 z-10 bg-gradient-to-t from-plum-900/75 via-plum-900/25 to-transparent p-4"
            >
              <p className="text-xs uppercase tracking-widest2 text-cream/85">
                Boavista · Porto
              </p>
            </div>

            {/* Click-to-activate scrim — keeps page scroll from being trapped by
                the map until the visitor chooses to interact. */}
            {!active && (
              <button
                type="button"
                onClick={() => {
                  setActive(true);
                  t("location_map_activated", {});
                }}
                aria-label={prompt}
                className="group absolute inset-0 z-20 flex items-center justify-center bg-plum-900/[0.06] transition-colors hover:bg-plum-900/0"
              >
                <span className="inline-flex items-center gap-2 border border-cream/60 bg-plum-800/85 px-4 py-2 text-xs font-medium text-cream backdrop-blur-sm transition group-hover:bg-plum-800">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 16 16"
                    fill="none"
                    aria-hidden
                  >
                    <path
                      d="M8 1.6c-2.4 0-4.3 1.9-4.3 4.3 0 3 4.3 8.5 4.3 8.5s4.3-5.5 4.3-8.5c0-2.4-1.9-4.3-4.3-4.3Z"
                      stroke="currentColor"
                      strokeWidth="1.2"
                      strokeLinejoin="round"
                    />
                    <circle cx="8" cy="5.9" r="1.5" stroke="currentColor" strokeWidth="1.2" />
                  </svg>
                  {prompt}
                </span>
              </button>
            )}
          </div>
        </Reveal>
      </div>

      {/* Context plates — the development in its setting */}
      <EditorialImages
        images={content.gallery.images.slice(2, 4)}
        layout="pair"
        className="mt-16 lg:mt-20"
      />
    </Section>
  );
}

registerModule("location", Location);
export default Location;
