"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from "react";

interface StreakContextType {
  streak: number;
  isNewDay: boolean;
}

const StreakContext = createContext<StreakContextType>({
  streak: 0,
  isNewDay: false,
});

const STORAGE_KEY = "scorespark-streak";

interface StreakData {
  count: number;
  lastDate: string; // YYYY-MM-DD
}

function todayStr(): string {
  return new Date().toISOString().slice(0, 10);
}

function yesterdayStr(): string {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return d.toISOString().slice(0, 10);
}

export function StreakProvider({ children }: { children: ReactNode }) {
  const [streak, setStreak] = useState(0);
  const [isNewDay, setIsNewDay] = useState(false);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      const today = todayStr();
      const yesterday = yesterdayStr();

      if (stored) {
        const data: StreakData = JSON.parse(stored);

        if (data.lastDate === today) {
          // Already visited today — keep streak
          setStreak(data.count);
        } else if (data.lastDate === yesterday) {
          // Visited yesterday — increment streak
          const newCount = data.count + 1;
          setStreak(newCount);
          setIsNewDay(true);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ count: newCount, lastDate: today })
          );
        } else {
          // Missed a day — reset
          setStreak(1);
          setIsNewDay(true);
          localStorage.setItem(
            STORAGE_KEY,
            JSON.stringify({ count: 1, lastDate: today })
          );
        }
      } else {
        // First visit ever
        setStreak(1);
        setIsNewDay(true);
        localStorage.setItem(
          STORAGE_KEY,
          JSON.stringify({ count: 1, lastDate: today })
        );
      }
    } catch {
      setStreak(1);
    }
  }, []);

  return (
    <StreakContext.Provider value={{ streak, isNewDay }}>
      {children}
    </StreakContext.Provider>
  );
}

export function useStreak() {
  return useContext(StreakContext);
}
