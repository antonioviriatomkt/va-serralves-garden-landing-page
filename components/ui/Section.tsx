"use client";

import type { ReactNode } from "react";
import { Stagger, StaggerItem } from "@/components/motion/Stagger";

/** A page section with consistent vertical rhythm and max width. */
export function Section({
  id,
  children,
  className = "",
  tone = "cream",
}: {
  id?: string;
  children: ReactNode;
  className?: string;
  tone?: "cream" | "white" | "plum" | "travertine";
}) {
  const toneClass = {
    cream: "bg-cream text-ink",
    white: "bg-white text-ink",
    plum: "bg-plum-800 text-cream",
    travertine: "bg-travertine-100 text-ink",
  }[tone];

  return (
    <section
      id={id}
      className={`scroll-mt-20 px-5 py-16 sm:px-8 sm:py-24 ${toneClass} ${className}`}
    >
      <div className="mx-auto w-full max-w-content">{children}</div>
    </section>
  );
}

/** Eyebrow + serif heading pair used across modules — reveals on scroll. */
export function SectionHeading({
  kicker,
  title,
  intro,
  invert = false,
  align = "left",
}: {
  kicker?: string;
  title: string;
  intro?: string;
  invert?: boolean;
  align?: "left" | "center";
}) {
  const alignClass = align === "center" ? "text-center mx-auto" : "";
  return (
    <Stagger className={`max-w-2xl ${alignClass}`}>
      {kicker && (
        <StaggerItem as="p" className="text-xs uppercase tracking-widest2 text-brass">
          {kicker}
        </StaggerItem>
      )}
      <StaggerItem
        as="h2"
        className={`mt-3 font-serif text-3xl leading-tight sm:text-4xl ${
          invert ? "text-cream" : "text-plum-800"
        }`}
      >
        {title}
      </StaggerItem>
      {intro && (
        <StaggerItem
          as="p"
          className={`mt-4 text-base leading-relaxed ${
            invert ? "text-cream/75" : "text-ink/70"
          }`}
        >
          {intro}
        </StaggerItem>
      )}
    </Stagger>
  );
}
