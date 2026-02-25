"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function ScoresPage() {
  const router = useRouter();

  useEffect(() => {
    let sport = "soccer";
    try {
      const stored = localStorage.getItem("scorespark-default-sport");
      if (stored && ["soccer", "nba", "nfl", "nhl", "mlb"].includes(stored)) {
        sport = stored;
      }
    } catch {}
    router.replace(`/scores/${sport}`);
  }, [router]);

  return null;
}
