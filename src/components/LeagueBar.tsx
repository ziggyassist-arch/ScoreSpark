"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface LeagueItem {
  code: string;
  name: string;
  short: string;
  crest: string;
  standingsId: string;
}

// Top leagues shown in the scrollable bar
const TOP_LEAGUES: LeagueItem[] = [
  { code: "all", name: "All Leagues", short: "All", crest: "", standingsId: "" },
  { code: "PL", name: "Premier League", short: "EPL", crest: "/leagues/pl.png", standingsId: "epl" },
  { code: "CL", name: "Champions League", short: "UCL", crest: "/leagues/ucl.png", standingsId: "ucl" },
  { code: "PD", name: "La Liga", short: "La Liga", crest: "/leagues/laliga.png", standingsId: "laliga" },
  { code: "BL1", name: "Bundesliga", short: "Bund.", crest: "/leagues/bl1.png", standingsId: "bundesliga" },
  { code: "SA", name: "Serie A", short: "Serie A", crest: "/leagues/seriea.png", standingsId: "seriea" },
  { code: "FL1", name: "Ligue 1", short: "Ligue 1", crest: "/leagues/ligue1.png", standingsId: "ligue1" },
  { code: "MLS", name: "MLS", short: "MLS", crest: "https://a.espncdn.com/i/teamlogos/leagues/500/mls.png", standingsId: "mls" },
  { code: "ELC", name: "Championship", short: "Champ.", crest: "/leagues/championship.png", standingsId: "championship" },
  { code: "DED", name: "Eredivisie", short: "Erev.", crest: "/leagues/eredivisie.png", standingsId: "eredivisie" },
  { code: "PPL", name: "Primeira Liga", short: "Liga PT", crest: "/leagues/ligapt.png", standingsId: "ligapt" },
  { code: "LMX", name: "Liga MX", short: "Liga MX", crest: "https://a.espncdn.com/i/leaguelogos/soccer/500/17.png", standingsId: "ligamx" },
];

// Full list of leagues organized by region — ALL wired to real standings data
const ALL_LEAGUES: { region: string; leagues: LeagueItem[] }[] = [
  {
    region: "European Cups",
    leagues: [
      { code: "CL", name: "Champions League", short: "UCL", crest: "/leagues/ucl.png", standingsId: "ucl" },
      { code: "UEL", name: "Europa League", short: "UEL", crest: "/leagues/uel.png", standingsId: "uel-espn" },
    ],
  },
  {
    region: "England",
    leagues: [
      { code: "PL", name: "Premier League", short: "EPL", crest: "/leagues/pl.png", standingsId: "epl" },
      { code: "ELC", name: "Championship", short: "Champ.", crest: "/leagues/championship.png", standingsId: "eng-championship" },
      { code: "FAC", name: "FA Cup", short: "FA Cup", crest: "", standingsId: "fa-cup" },
      { code: "EFL", name: "EFL Cup", short: "EFL Cup", crest: "", standingsId: "efl-cup" },
      { code: "WSL", name: "WSL (Women)", short: "WSL", crest: "", standingsId: "wsl" },
    ],
  },
  {
    region: "Spain",
    leagues: [
      { code: "PD", name: "La Liga", short: "La Liga", crest: "/leagues/laliga.png", standingsId: "laliga" },
      { code: "SD", name: "La Liga 2", short: "La Liga 2", crest: "", standingsId: "esp-segunda" },
      { code: "CDR", name: "Copa del Rey", short: "Copa", crest: "", standingsId: "copa-del-rey" },
    ],
  },
  {
    region: "Germany",
    leagues: [
      { code: "BL1", name: "Bundesliga", short: "Bund.", crest: "/leagues/bl1.png", standingsId: "bundesliga" },
      { code: "BL2", name: "2. Bundesliga", short: "2.BL", crest: "", standingsId: "ger-2bundesliga" },
      { code: "DFB", name: "DFB-Pokal", short: "DFB", crest: "", standingsId: "dfb-pokal" },
    ],
  },
  {
    region: "Italy",
    leagues: [
      { code: "SA", name: "Serie A", short: "Serie A", crest: "/leagues/seriea.png", standingsId: "seriea" },
      { code: "SB", name: "Serie B", short: "Serie B", crest: "", standingsId: "ita-serieb" },
      { code: "CI", name: "Coppa Italia", short: "Coppa", crest: "", standingsId: "coppa-italia" },
    ],
  },
  {
    region: "France",
    leagues: [
      { code: "FL1", name: "Ligue 1", short: "Ligue 1", crest: "/leagues/ligue1.png", standingsId: "ligue1" },
      { code: "FL2", name: "Ligue 2", short: "Ligue 2", crest: "", standingsId: "fra-ligue2" },
      { code: "CDF", name: "Coupe de France", short: "CdF", crest: "", standingsId: "coupe-de-france" },
    ],
  },
  {
    region: "Rest of Europe",
    leagues: [
      { code: "DED", name: "Eredivisie", short: "Erev.", crest: "/leagues/eredivisie.png", standingsId: "eredivisie" },
      { code: "PPL", name: "Primeira Liga", short: "Liga PT", crest: "/leagues/ligapt.png", standingsId: "ligapt" },
      { code: "TSL", name: "Süper Lig", short: "Turkey", crest: "", standingsId: "superlig" },
      { code: "SPL", name: "Premiership", short: "Scotland", crest: "", standingsId: "scottish" },
      { code: "JPL", name: "Jupiler Pro League", short: "Belgium", crest: "", standingsId: "jupiler" },
      { code: "RUS", name: "Premier League", short: "Russia", crest: "", standingsId: "russian" },
      { code: "GRE", name: "Super League", short: "Greece", crest: "", standingsId: "greek" },
      { code: "SWE", name: "Allsvenskan", short: "Sweden", crest: "", standingsId: "swedish" },
      { code: "DEN", name: "Superliga", short: "Denmark", crest: "", standingsId: "danish" },
      { code: "NOR", name: "Eliteserien", short: "Norway", crest: "", standingsId: "norwegian" },
      { code: "AUT", name: "Bundesliga", short: "Austria", crest: "", standingsId: "austrian" },
      { code: "SUI", name: "Super League", short: "Swiss", crest: "", standingsId: "swiss" },
      { code: "CZE", name: "First League", short: "Czech", crest: "", standingsId: "czech" },
      { code: "FIN", name: "Veikkausliiga", short: "Finland", crest: "", standingsId: "finnish" },
      { code: "ROU", name: "Liga I", short: "Romania", crest: "", standingsId: "romanian" },
      { code: "ISR", name: "Ligat Ha'al", short: "Israel", crest: "", standingsId: "israeli" },
      { code: "CYP", name: "First Division", short: "Cyprus", crest: "", standingsId: "cypriot" },
    ],
  },
  {
    region: "South America",
    leagues: [
      { code: "BSA", name: "Brasileirão Série A", short: "Brazil", crest: "", standingsId: "brasileirao" },
      { code: "ASL", name: "Liga Profesional", short: "Argentina", crest: "", standingsId: "argentina" },
      { code: "COL", name: "Liga BetPlay", short: "Colombia", crest: "", standingsId: "colombian" },
      { code: "CHI", name: "Primera División", short: "Chile", crest: "", standingsId: "chilean" },
      { code: "PER", name: "Liga 1", short: "Peru", crest: "", standingsId: "peruvian" },
      { code: "URU", name: "Primera División", short: "Uruguay", crest: "", standingsId: "uruguayan" },
      { code: "ECU", name: "Liga Pro", short: "Ecuador", crest: "", standingsId: "ecuadorian" },
      { code: "PAR", name: "División de Honor", short: "Paraguay", crest: "", standingsId: "paraguayan" },
    ],
  },
  {
    region: "North America",
    leagues: [
      { code: "MLS", name: "MLS", short: "MLS", crest: "https://a.espncdn.com/i/teamlogos/leagues/500/mls.png", standingsId: "mls" },
      { code: "LMX", name: "Liga MX", short: "Liga MX", crest: "https://a.espncdn.com/i/leaguelogos/soccer/500/17.png", standingsId: "ligamx" },
      { code: "NWSL", name: "NWSL (Women)", short: "NWSL", crest: "", standingsId: "nwsl" },
      { code: "USL", name: "USL Championship", short: "USL", crest: "", standingsId: "usl" },
    ],
  },
  {
    region: "Asia & Middle East",
    leagues: [
      { code: "JL", name: "J1 League", short: "Japan", crest: "", standingsId: "jleague" },
      { code: "CHN", name: "Chinese Super League", short: "China", crest: "", standingsId: "chinese" },
      { code: "IND", name: "Indian Super League", short: "India", crest: "", standingsId: "indian" },
      { code: "SAL", name: "Saudi Pro League", short: "Saudi", crest: "", standingsId: "saudipro" },
      { code: "THA", name: "Thai League", short: "Thailand", crest: "", standingsId: "thai" },
      { code: "IDN", name: "Liga 1", short: "Indonesia", crest: "", standingsId: "indonesian" },
      { code: "MYS", name: "Super League", short: "Malaysia", crest: "", standingsId: "malaysian" },
      { code: "SGP", name: "S.League", short: "Singapore", crest: "", standingsId: "singapore" },
    ],
  },
  {
    region: "Africa & Oceania",
    leagues: [
      { code: "NGA", name: "NPFL", short: "Nigeria", crest: "", standingsId: "nigerian" },
      { code: "GHA", name: "Premier League", short: "Ghana", crest: "", standingsId: "ghanaian" },
      { code: "KEN", name: "Premier League", short: "Kenya", crest: "", standingsId: "kenyan" },
      { code: "AL", name: "A-League", short: "Australia", crest: "", standingsId: "aleague" },
    ],
  },
];

export default function LeagueBar() {
  const pathname = usePathname();
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setShowDropdown(false);
      }
    }
    if (showDropdown) {
      document.addEventListener("mousedown", handleClickOutside);
      return () => document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [showDropdown]);

  return (
    <div className="relative" ref={dropdownRef}>
      {/* Scrollable top leagues bar */}
      <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1 -mx-1 px-1 items-center">
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

        {/* "More leagues" dropdown trigger */}
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className={`flex flex-col items-center gap-1.5 min-w-[58px] py-2 px-2 rounded-xl transition-all duration-200 group hover:bg-white/5 shrink-0 ${
            showDropdown ? "bg-white/10" : ""
          }`}
        >
          <div className="w-9 h-9 rounded-full flex items-center justify-center">
            <svg className="w-5 h-5 text-white/40 group-hover:text-white/60" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 12.75a.75.75 0 110-1.5.75.75 0 010 1.5zM12 18.75a.75.75 0 110-1.5.75.75 0 010 1.5z" />
            </svg>
          </div>
          <span className="text-[10px] font-medium text-white/40 group-hover:text-white/60 whitespace-nowrap">
            More
          </span>
        </button>
      </div>

      {/* Dropdown with all leagues */}
      {showDropdown && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-surface border border-white/10 rounded-2xl shadow-2xl z-50 max-h-[60vh] overflow-y-auto">
          <div className="p-3 border-b border-white/5">
            <h3 className="text-sm font-semibold text-white/80">All Leagues</h3>
            <p className="text-[11px] text-white/30 mt-0.5">Select a league to view teams & standings</p>
          </div>

          {ALL_LEAGUES.map((group) => (
            <div key={group.region}>
              <div className="px-4 py-2 bg-white/[0.02] sticky top-0">
                <span className="text-[11px] font-semibold text-white/40 uppercase tracking-wider">
                  {group.region}
                </span>
              </div>
              {group.leagues.map((league) => {
                const hasStandings = !!league.standingsId;
                const href = hasStandings ? `/standings/${league.standingsId}` : "/scores/soccer";

                return (
                  <Link
                    key={`${group.region}-${league.code}`}
                    href={href}
                    onClick={() => setShowDropdown(false)}
                    className="flex items-center gap-3 px-4 py-2.5 hover:bg-white/5 transition-colors"
                  >
                    {league.crest ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={league.crest} alt="" className="w-6 h-6 object-contain" />
                    ) : (
                      <div className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center">
                        <span className="text-[9px] font-bold text-white/40">
                          {league.short.slice(0, 2)}
                        </span>
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <p className="text-sm text-white/80 truncate">{league.name}</p>
                    </div>
                    {!hasStandings && (
                      <span className="text-[9px] text-white/20 px-1.5 py-0.5 bg-white/5 rounded">
                        Soon
                      </span>
                    )}
                  </Link>
                );
              })}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
