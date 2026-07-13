import type { DevelopmentContent, UIStrings } from "@/types/content";

export function SiteFooter({
  ui,
  development,
}: {
  ui: UIStrings;
  development: DevelopmentContent;
}) {
  return (
    <footer className="bg-plum-900 px-5 py-12 text-cream/70 sm:px-8">
      <div className="mx-auto grid w-full max-w-content gap-8 sm:grid-cols-2">
        <div>
          <p className="text-sm font-semibold uppercase tracking-widest2 text-cream">
            VA Properties
          </p>
          <p className="mt-2 font-serif text-lg text-cream/90">
            {development.name} · {development.tagline}
          </p>
          <p className="mt-3 text-sm text-cream/55">{ui.footer.address}</p>
        </div>
        <div className="sm:text-right">
          <p className="text-sm text-cream/70">{ui.footer.developer}</p>
          <p className="mt-3 text-xs leading-relaxed text-cream/40">
            {ui.footer.disclaimer}
          </p>
          <p className="mt-2 text-xs uppercase tracking-widest2 text-brass/70">
            {ui.footer.demoNotice}
          </p>
        </div>
      </div>
    </footer>
  );
}
