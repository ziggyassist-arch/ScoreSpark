"use client";

import { createContext, useContext, useState, useEffect, useCallback, ReactNode } from "react";

interface SpoilerModeContextType {
  spoilerMode: boolean;
  toggleSpoilerMode: () => void;
  /** Set of match IDs the user has revealed */
  revealedMatches: Set<string>;
  revealMatch: (matchId: string) => void;
  isRevealed: (matchId: string) => boolean;
}

const SpoilerModeContext = createContext<SpoilerModeContextType>({
  spoilerMode: false,
  toggleSpoilerMode: () => {},
  revealedMatches: new Set(),
  revealMatch: () => {},
  isRevealed: () => true,
});

const STORAGE_KEY = "scorespark-spoiler-mode";

export function SpoilerModeProvider({ children }: { children: ReactNode }) {
  const [spoilerMode, setSpoilerMode] = useState(false);
  const [revealedMatches, setRevealedMatches] = useState<Set<string>>(new Set());
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored === "true") setSpoilerMode(true);
    } catch {}
    setLoaded(true);
  }, []);

  useEffect(() => {
    if (loaded) {
      localStorage.setItem(STORAGE_KEY, String(spoilerMode));
    }
  }, [spoilerMode, loaded]);

  const toggleSpoilerMode = useCallback(() => {
    setSpoilerMode((prev) => !prev);
    // Reset revealed matches when toggling
    setRevealedMatches(new Set());
  }, []);

  const revealMatch = useCallback((matchId: string) => {
    setRevealedMatches((prev) => new Set(prev).add(matchId));
  }, []);

  const isRevealed = useCallback(
    (matchId: string) => !spoilerMode || revealedMatches.has(matchId),
    [spoilerMode, revealedMatches]
  );

  return (
    <SpoilerModeContext.Provider
      value={{ spoilerMode, toggleSpoilerMode, revealedMatches, revealMatch, isRevealed }}
    >
      {children}
    </SpoilerModeContext.Provider>
  );
}

export function useSpoilerMode() {
  return useContext(SpoilerModeContext);
}
