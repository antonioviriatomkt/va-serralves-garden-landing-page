"use client";

import type { ReactNode } from "react";

type Variant = "light" | "outline" | "solid" | "outlineDark";

/**
 * Luxury CTA — on hover, a colour fill wipes in from the left. The label is
 * drawn twice: a base copy underneath and a hover-coloured copy clipped by the
 * same wipe, so text and background always match (no mid-transition dead zone).
 */
export function CtaButton({
  children,
  onClick,
  variant = "light",
  arrow = false,
  className = "",
  type = "button",
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: Variant;
  arrow?: boolean;
  className?: string;
  type?: "button" | "submit";
}) {
  const styles: Record<
    Variant,
    { base: string; hoverBg: string; hoverText: string }
  > = {
    light: {
      base: "bg-cream text-plum-800",
      hoverBg: "bg-plum-700",
      hoverText: "text-cream",
    },
    outline: {
      base: "border border-cream/40 text-cream",
      hoverBg: "bg-cream",
      hoverText: "text-plum-800",
    },
    solid: {
      base: "bg-plum-700 text-cream",
      hoverBg: "bg-plum-800",
      hoverText: "text-cream",
    },
    outlineDark: {
      base: "border border-plum-700 text-plum-800",
      hoverBg: "bg-plum-700",
      hoverText: "text-cream",
    },
  };
  const s = styles[variant];

  const content = (
    <>
      {children}
      {arrow && (
        <svg
          width="14"
          height="14"
          viewBox="0 0 16 16"
          fill="none"
          aria-hidden
          className="transition-transform duration-500 ease-lux group-hover:translate-x-1"
        >
          <path
            d="M3 8h10M9 4l4 4-4 4"
            stroke="currentColor"
            strokeWidth="1.4"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      )}
    </>
  );

  return (
    <button
      type={type}
      onClick={onClick}
      className={`group relative inline-flex items-center justify-center overflow-hidden text-sm font-medium ${s.base} ${className}`}
    >
      <span className="relative z-10 inline-flex items-center gap-2 px-7 py-3.5">
        {content}
      </span>
      <span
        aria-hidden
        className={`absolute inset-0 z-20 inline-flex items-center justify-center gap-2 px-7 py-3.5 [clip-path:inset(0_100%_0_0)] transition-[clip-path] duration-500 ease-lux group-hover:[clip-path:inset(0_0_0_0)] ${s.hoverBg} ${s.hoverText}`}
      >
        {content}
      </span>
    </button>
  );
}
