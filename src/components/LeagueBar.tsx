"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const TOP_LEAGUES = [
  { code: "all", name: "All Leagues", short: "All", crest: "", standingsId: "" },
  { code: "PL", name: "Premier League", short: "EPL", crest: "/leagues/pl.png", standingsId: "epl" },
  { code: "PD", name: "La Liga", short: "La Liga", crest: "/leagues/laliga.png", standingsId: "laliga" },
  { code: "BL1", name: "Bundesliga", short: "Bund.", crest: "/leagues/bl1.png", standingsId: "bundesliga" },
  { code: "SA", name: "Serie A", short: "Serie A", crest: "/leagues/seriea.png", standingsId: "seriea" },
  { code: "FL1", name: "Ligue 1", short: "Ligue 1", crest: "/leagues/ligue1.png", standingsId: "ligue1" },
  { code: "CL", name: "Champions League", short: "UCL", crest: "/leagues/ucl.png", standingsId: "ucl" },
  { code: "EC", name: "Europa League", short: "UEL", crest: "/leagues/uel.png", standingsId: "uel" },
  { code: "ELC", name: "Championship", short: "Champ.", crest: "/leagues/championship.png", standingsId: "championship" },
  { code: "DED", name: "Eredivisie", short: "Erev.", crest: "/leagues/eredivisie.png", standingsId: "eredivisie" },
  { code: "PPL", name: "Primeira Liga", short: "Liga PT", crest: "/leagues/ligapt.png", standingsId: "ligapt" },
];

export default function LeagueBar() {
  const pathname = usePathname();

  return (
    <div className="flex gap-3 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1">
      {TOP_LEAGUES.map((league) => {
        const isActive = league.standingsId && pathname.includes(league.standingsId);
        const isAll = league.code === "all";

        return (
          <Link
            key={league.code}
            href={isAll ? "/scores/soccer" : `/standings/${league.standingsId}`}
            className={`flex flex-col items-center gap-1.5 min-w-[58px] py-2 px-2 rounded-xl transition-all duration-200 group ${
              isActive ? "bg-white/10" : "hover:bg-white/5"
            }`}
          >
            <div className={`w-9 h-9 rounded-full flex items-center justify-center overflow-hidden ${
              isActive ? "ring-2 ring-gold-spark/50" : ""
            }`}>
              {isAll ? (
                <svg className="w-6 h-6 text-white/60 group-hover:text-white/80" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6A2.25 2.25 0 016 3.75h2.25A2.25 2.25 0 0110.5 6v2.25a2.25 2.25 0 01-2.25 2.25H6a2.25 2.25 0 01-2.25-2.25V6zM3.75 15.75A2.25 2.25 0 016 13.5h2.25a2.25 2.25 0 012.25 2.25V18a2.25 2.25 0 01-2.25 2.25H6A2.25 2.25 0 013.75 18v-2.25zM13.5 6a2.25 2.25 0 012.25-2.25H18A2.25 2.25 0 0120.25 6v2.25A2.25 2.25 0 0118 10.5h-2.25a2.25 2.25 0 01-2.25-2.25V6zM13.5 15.75a2.25 2.25 0 012.25-2.25H18a2.25 2.25 0 012.25 2.25V18A2.25 2.25 0 0118 20.25h-2.25A2.25 2.25 0 0113.5 18v-2.25z" />
                </svg>
              ) : (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={league.crest}
                  alt={league.name}
                  width={32}
                  height={32}
                  className="w-8 h-8 object-contain group-hover:scale-110 transition-transform"
                />
              )}
            </div>
            <span className={`text-[10px] font-medium text-center leading-tight whitespace-nowrap ${
              isActive ? "text-white" : "text-white/40 group-hover:text-white/60"
            }`}>
              {league.short}
            </span>
          </Link>
        );
      })}
    </div>
  );
}
