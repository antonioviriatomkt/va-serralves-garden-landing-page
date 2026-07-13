"use client";

import Link from "next/link";
import { usePathname, useSearchParams } from "next/navigation";
import type { UIStrings } from "@/types/content";
import { useMode } from "@/lib/mode/ModeProvider";

export function SiteHeader({ ui }: { ui: UIStrings }) {
  const { mode, switchMode, locale } = useMode();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Language switch keeps the current query (e.g. ?m=inv).
  const otherPath = pathname.replace(
    /^\/(pt|en)/,
    `/${ui.otherLocaleCode}`,
  );
  const qs = searchParams.toString();
  const otherHref = qs ? `${otherPath}?${qs}` : otherPath;

  return (
    <header className="fixed inset-x-0 top-0 z-40 border-b border-cream/10 bg-plum-900/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 w-full max-w-content items-center justify-between px-5 sm:px-8">
        <Link
          href={`/${locale}`}
          className="flex items-center"
          aria-label="VA Properties"
        >
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src="/logo-va-properties.svg"
            alt="VA Properties"
            className="h-8 w-auto sm:h-9"
          />
        </Link>

        <nav className="hidden items-center gap-7 text-sm text-cream/75 md:flex">
          <a href="#availability" className="nav-underline transition hover:text-cream">
            {ui.nav.availability}
          </a>
          <a href="#location" className="nav-underline transition hover:text-cream">
            {ui.nav.location}
          </a>
          <a href="#contact" className="nav-underline transition hover:text-cream">
            {ui.nav.contact}
          </a>
        </nav>

        <div className="flex items-center gap-3">
          {/* Intent mode toggle */}
          <div
            className="hidden overflow-hidden rounded-full border border-cream/25 text-xs sm:inline-flex"
            role="group"
            aria-label={ui.modeToggle.label}
          >
            <button
              type="button"
              onClick={() => switchMode("res")}
              aria-pressed={mode === "res"}
              className={`px-3 py-1.5 transition ${
                mode === "res"
                  ? "bg-cream text-plum-800"
                  : "text-cream/75 hover:text-cream"
              }`}
            >
              {ui.modeToggle.live}
            </button>
            <button
              type="button"
              onClick={() => switchMode("inv")}
              aria-pressed={mode === "inv"}
              className={`px-3 py-1.5 transition ${
                mode === "inv"
                  ? "bg-cream text-plum-800"
                  : "text-cream/75 hover:text-cream"
              }`}
            >
              {ui.modeToggle.invest}
            </button>
          </div>

          <Link
            href={otherHref}
            className="rounded-full border border-cream/25 px-3 py-1.5 text-xs uppercase tracking-widest text-cream/85 transition hover:border-cream/60"
            aria-label={ui.nav.languageSwitch}
          >
            {ui.otherLocaleCode}
          </Link>
        </div>
      </div>
    </header>
  );
}
