import type { ComponentType } from "react";
import type { DevelopmentContent, ModuleKey, UIStrings } from "@/types/content";

/** Props every registered module receives. Intent mode/locale/preset come from
 * context (useMode), so modules stay simple and reorder reactively. */
export interface ModuleProps {
  content: DevelopmentContent;
  ui: UIStrings;
}

export type ModuleComponent = ComponentType<ModuleProps>;

const registry = new Map<ModuleKey, ModuleComponent>();

/** Each section component self-registers by calling this at module load. */
export function registerModule(key: ModuleKey, component: ModuleComponent) {
  registry.set(key, component);
}

export function getModule(key: ModuleKey): ModuleComponent | undefined {
  return registry.get(key);
}
