"use client";

import { useRouter } from "next/navigation";

const SOCCER_LEAGUES = [
  { code: "CL", name: "Champions League", country: "Europe" },
  { code: "PL", name: "Premier League", country: "England" },
  { code: "PD", name: "La Liga", country: "Spain" },
  { code: "BL1", name: "Bundesliga", country: "Germany" },
  { code: "SA", name: "Serie A", country: "Italy" },
  { code: "FL1", name: "Ligue 1", country: "France" },
  { code: "DED", name: "Eredivisie", country: "Netherlands" },
  { code: "PPL", name: "Primeira Liga", country: "Portugal" },
  { code: "ELC", name: "Championship", country: "England" },
] as const;

export default function SoccerLeagueSelector({ currentLeague }: { currentLeague: string }) {
  const router = useRouter();

  return (
    <div className="relative">
      <select
        value={currentLeague}
        onChange={(e) => router.push(`/scores/soccer/teams?league=${e.target.value}`)}
        className="w-full appearance-none bg-card border border-white/10 rounded-xl px-4 py-3 text-sm text-white/90 font-medium cursor-pointer hover:border-white/20 transition-colors focus:outline-none focus:border-gold-spark/50"
        style={{ colorScheme: "dark" }}
      >
        {SOCCER_LEAGUES.map((league) => (
          <option key={league.code} value={league.code}>
            {league.name} ({league.country})
          </option>
        ))}
      </select>
      <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none">
        <svg className="w-5 h-5 text-white/40" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
        </svg>
      </div>
    </div>
  );
}
