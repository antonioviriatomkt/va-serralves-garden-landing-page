"use client";

import type {
  CompositionForPreset,
  DevelopmentContent,
  UIStrings,
} from "@/types/content";
import { useMode } from "@/lib/mode/ModeProvider";
import "@/lib/modules/registerAll";
import { getModule } from "@/lib/modules/registry";

/**
 * Renders the page by mapping over the composition config for the current
 * intent mode. No hardcoded layout — reordering the module keys in
 * content/composition.json reorders the page. Switching mode re-maps the list
 * client-side, with no reload.
 */
export function PageComposition({
  composition,
  content,
  ui,
}: {
  composition: CompositionForPreset;
  content: DevelopmentContent;
  ui: UIStrings;
}) {
  const { mode } = useMode();
  const order = composition[mode];

  return (
    <main>
      {order.map((key) => {
        const Module = getModule(key);
        if (!Module) {
          if (process.env.NODE_ENV !== "production") {
            // eslint-disable-next-line no-console
            console.warn(`[composition] no module registered for "${key}"`);
          }
          return null;
        }
        return <Module key={key} content={content} ui={ui} />;
      })}
    </main>
  );
}
