"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useSearchParams } from "next/navigation";
import type { Locale, Mode, Preset } from "@/types/content";
import { track } from "@/lib/track";

const STORAGE_KEY = "va_intent_mode";

type ModeSource = "url" | "storage" | "chooser" | "toggle" | "default";

interface ModeState {
  mode: Mode;
  /** True once the visitor's intent is known (url / storage / chooser). */
  resolved: boolean;
  locale: Locale;
  preset: Preset;
  /** Set mode from the hero chooser (first explicit selection). */
  chooseMode: (mode: Mode) => void;
  /** Toggle mode after it is already resolved (header/hero switch). */
  switchMode: (mode: Mode) => void;
}

const ModeContext = createContext<ModeState | null>(null);

function isMode(value: string | null | undefined): value is Mode {
  return value === "res" || value === "inv";
}

export function ModeProvider({
  locale,
  preset,
  children,
}: {
  locale: Locale;
  preset: Preset;
  children: ReactNode;
}) {
  const searchParams = useSearchParams();
  const [mode, setMode] = useState<Mode>("res");
  const [resolved, setResolved] = useState(false);
  const didInit = useRef(false);
  const didPageView = useRef(false);

  const persist = useCallback((next: Mode) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, next);
    } catch {
      /* localStorage unavailable — non-fatal for the demo */
    }
  }, []);

  const emitResolved = useCallback(
    (next: Mode, source: ModeSource) => {
      track("mode_resolved", { mode: next, locale, preset, source });
    },
    [locale, preset],
  );

  // Resolution priority: 1) ?m= URL param → 2) localStorage → 3) default `res`
  // (chooser visible). Runs once on mount.
  useEffect(() => {
    if (didInit.current) return;
    didInit.current = true;

    if (!didPageView.current) {
      didPageView.current = true;
      track("page_view", { mode: "res", locale, preset });
    }

    const urlMode = searchParams.get("m");
    if (isMode(urlMode)) {
      setMode(urlMode);
      setResolved(true);
      persist(urlMode);
      emitResolved(urlMode, "url");
      return;
    }

    let stored: string | null = null;
    try {
      stored = window.localStorage.getItem(STORAGE_KEY);
    } catch {
      stored = null;
    }
    if (isMode(stored)) {
      setMode(stored);
      setResolved(true);
      emitResolved(stored, "storage");
      return;
    }

    // Unresolved: default composition is `res`, hero chooser stays visible.
    setMode("res");
    setResolved(false);
  }, [searchParams, persist, emitResolved, locale, preset]);

  const chooseMode = useCallback(
    (next: Mode) => {
      setMode(next);
      setResolved(true);
      persist(next);
      emitResolved(next, "chooser");
    },
    [persist, emitResolved],
  );

  const switchMode = useCallback(
    (next: Mode) => {
      // Runs from a click handler, so reading `mode`/`resolved` from closure is
      // safe and keeps side effects out of the state updater.
      if (mode === next && resolved) return;
      setMode(next);
      setResolved(true);
      persist(next);
      if (resolved) {
        track("mode_switched", { mode: next, from: mode, locale, preset });
      } else {
        emitResolved(next, "toggle");
      }
    },
    [mode, resolved, persist, emitResolved, locale, preset],
  );

  return (
    <ModeContext.Provider
      value={{ mode, resolved, locale, preset, chooseMode, switchMode }}
    >
      {children}
    </ModeContext.Provider>
  );
}

export function useMode(): ModeState {
  const ctx = useContext(ModeContext);
  if (!ctx) {
    throw new Error("useMode must be used within a ModeProvider");
  }
  return ctx;
}
