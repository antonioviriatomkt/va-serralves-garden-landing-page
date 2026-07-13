"use client";

import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import type { DevelopmentContent, Typology, UIStrings } from "@/types/content";
import { Q0Modal } from "./Q0Modal";

export interface Q0OpenOptions {
  /** Pre-select a typology (e.g. from an availability row). */
  typology?: Typology | null;
  /** Where the form was opened from — recorded on q0_started. */
  source?: string;
  /** Unit id when opened from a specific unit's "request price" action. */
  unitId?: string | null;
}

interface Q0ContextValue {
  open: (options?: Q0OpenOptions) => void;
  close: () => void;
  isOpen: boolean;
}

const Q0Context = createContext<Q0ContextValue | null>(null);

export function Q0Provider({
  development,
  ui,
  children,
}: {
  development: DevelopmentContent;
  ui: UIStrings;
  children: ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [options, setOptions] = useState<Q0OpenOptions>({});

  const open = useCallback((opts: Q0OpenOptions = {}) => {
    setOptions(opts);
    setIsOpen(true);
  }, []);

  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(
    () => ({ open, close, isOpen }),
    [open, close, isOpen],
  );

  return (
    <Q0Context.Provider value={value}>
      {children}
      {isOpen && (
        <Q0Modal
          development={development}
          ui={ui}
          options={options}
          onClose={close}
        />
      )}
    </Q0Context.Provider>
  );
}

export function useQ0(): Q0ContextValue {
  const ctx = useContext(Q0Context);
  if (!ctx) {
    throw new Error("useQ0 must be used within a Q0Provider");
  }
  return ctx;
}
