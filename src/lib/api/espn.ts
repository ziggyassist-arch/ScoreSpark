/**
 * Unified ESPN API client for NFL, NBA, NHL, and MLB
 * Uses the free, unofficial ESPN site API (no key needed)
 */

import type {
  ESPNScoreboardResponse,
  ESPNStandingsResponse,
  ESPNInjuryResponse,
  ESPNLeadersResponse,
  ESPNPowerIndexResponse,
  ESPNEventSummaryResponse,
} from "./types/espn";

const BASE_URL = "https://site.api.espn.com/apis";
const WEB_BASE_URL = "https://site.web.api.espn.com/apis";

/** ESPN sport/league path mapping */
const SPORT_PATHS: Record<string, { sport: string; league: string }> = {
  nfl: { sport: "football", league: "nfl" },
  nba: { sport: "basketball", league: "nba" },
  nhl: { sport: "hockey", league: "nhl" },
  mlb: { sport: "baseball", league: "mlb" },
};

/** ESPN soccer league slugs for leagues beyond football-data.org free tier */
export const ESPN_SOCCER_LEAGUES: Record<string, { slug: string; name: string; country: string; region: string }> = {
  // === ALREADY HAD ===
  MLS: { slug: "usa.1", name: "MLS", country: "USA", region: "Americas" },
  LMX: { slug: "mex.1", name: "Liga MX", country: "Mexico", region: "Americas" },
  SPL: { slug: "sco.1", name: "Scottish Premiership", country: "Scotland", region: "Europe" },
  TSL: { slug: "tur.1", name: "Süper Lig", country: "Turkey", region: "Europe" },
  JPL: { slug: "bel.1", name: "Jupiler Pro League", country: "Belgium", region: "Europe" },
  BSA: { slug: "bra.1", name: "Brasileirão Série A", country: "Brazil", region: "Americas" },
  ASL: { slug: "arg.1", name: "Liga Profesional", country: "Argentina", region: "Americas" },
  SAL: { slug: "sau.1", name: "Saudi Pro League", country: "Saudi Arabia", region: "Asia" },
  JL: { slug: "jpn.1", name: "J1 League", country: "Japan", region: "Asia" },
  AL: { slug: "aus.1", name: "A-League", country: "Australia", region: "Asia" },

  // === NEW — EUROPE ===
  AUT: { slug: "aut.1", name: "Austrian Bundesliga", country: "Austria", region: "Europe" },
  SUI: { slug: "sui.1", name: "Swiss Super League", country: "Switzerland", region: "Europe" },
  GRE: { slug: "gre.1", name: "Greek Super League", country: "Greece", region: "Europe" },
  CZE: { slug: "cze.1", name: "Czech First League", country: "Czechia", region: "Europe" },
  DEN: { slug: "den.1", name: "Superliga", country: "Denmark", region: "Europe" },
  NOR: { slug: "nor.1", name: "Eliteserien", country: "Norway", region: "Europe" },
  SWE: { slug: "swe.1", name: "Allsvenskan", country: "Sweden", region: "Europe" },
  FIN: { slug: "fin.1", name: "Veikkausliiga", country: "Finland", region: "Europe" },
  ROU: { slug: "rou.1", name: "Liga I", country: "Romania", region: "Europe" },
  RUS: { slug: "rus.1", name: "Russian Premier League", country: "Russia", region: "Europe" },
  ISR: { slug: "isr.1", name: "Ligat Ha'al", country: "Israel", region: "Europe" },
  CYP: { slug: "cyp.1", name: "Cypriot First Division", country: "Cyprus", region: "Europe" },

  // === NEW — AMERICAS ===
  COL: { slug: "col.1", name: "Liga BetPlay", country: "Colombia", region: "Americas" },
  CHI: { slug: "chi.1", name: "Chilean Primera División", country: "Chile", region: "Americas" },
  PER: { slug: "per.1", name: "Peruvian Liga 1", country: "Peru", region: "Americas" },
  URU: { slug: "uru.1", name: "Uruguayan Primera División", country: "Uruguay", region: "Americas" },
  ECU: { slug: "ecu.1", name: "Liga Pro", country: "Ecuador", region: "Americas" },
  PAR: { slug: "par.1", name: "División de Honor", country: "Paraguay", region: "Americas" },

  // === NEW — ASIA & AFRICA ===
  IND: { slug: "ind.1", name: "Indian Super League", country: "India", region: "Asia" },
  IDN: { slug: "idn.1", name: "Indonesian Liga 1", country: "Indonesia", region: "Asia" },
  THA: { slug: "tha.1", name: "Thai League", country: "Thailand", region: "Asia" },
  SGP: { slug: "sgp.1", name: "S.League", country: "Singapore", region: "Asia" },
  MYS: { slug: "mys.1", name: "Malaysian Super League", country: "Malaysia", region: "Asia" },
  CHN: { slug: "chn.1", name: "Chinese Super League", country: "China", region: "Asia" },
  NGA: { slug: "nga.1", name: "NPFL", country: "Nigeria", region: "Africa" },
  GHA: { slug: "gha.1", name: "Ghana Premier League", country: "Ghana", region: "Africa" },
  KEN: { slug: "ken.1", name: "Kenyan Premier League", country: "Kenya", region: "Africa" },

  // === EUROPEAN CUPS ===
  UCL_ESPN: { slug: "uefa.champions", name: "Champions League", country: "Europe", region: "Cups" },
  UEL_ESPN: { slug: "uefa.europa", name: "Europa League", country: "Europe", region: "Cups" },

  // === SECOND DIVISIONS ===
  ENG2: { slug: "eng.2", name: "Championship", country: "England", region: "Europe" },
  ESP2: { slug: "esp.2", name: "La Liga 2", country: "Spain", region: "Europe" },
  GER2: { slug: "ger.2", name: "2. Bundesliga", country: "Germany", region: "Europe" },
  ITA2: { slug: "ita.2", name: "Serie B", country: "Italy", region: "Europe" },
  FRA2: { slug: "fra.2", name: "Ligue 2", country: "France", region: "Europe" },

  // === DOMESTIC CUPS ===
  FA_CUP: { slug: "eng.fa", name: "FA Cup", country: "England", region: "Cups" },
  LEAGUE_CUP: { slug: "eng.league_cup", name: "EFL Cup", country: "England", region: "Cups" },
  COPA_REY: { slug: "esp.copa_del_rey", name: "Copa del Rey", country: "Spain", region: "Cups" },
  DFB_POKAL: { slug: "ger.dfb_pokal", name: "DFB-Pokal", country: "Germany", region: "Cups" },
  COPPA: { slug: "ita.coppa_italia", name: "Coppa Italia", country: "Italy", region: "Cups" },
  COUPE_FR: { slug: "fra.coupe_de_france", name: "Coupe de France", country: "France", region: "Cups" },

  // === WOMEN'S ===
  NWSL: { slug: "usa.nwsl", name: "NWSL", country: "USA", region: "Americas" },
  WSL: { slug: "eng.w.1", name: "WSL", country: "England", region: "Europe" },
  USL1: { slug: "usa.usl.1", name: "USL Championship", country: "USA", region: "Americas" },
};

async function fetchESPN<T>(url: string): Promise<T> {
  const res = await fetch(url, {
    headers: { Accept: "application/json" },
    next: { revalidate: 30 },
  });

  if (!res.ok) {
    console.warn(`[ESPN] ${res.status} ${res.statusText} for ${url}`);
    return { events: [], leagues: [], season: {} } as unknown as T;
  }

  return res.json() as Promise<T>;
}

/**
 * Get scoreboard (today's games) for a sport
 * Optionally pass a date string (YYYYMMDD) for a specific day
 */
export async function getScoreboard(
  sport: "nfl" | "nba" | "nhl" | "mlb",
  date?: string
): Promise<ESPNScoreboardResponse> {
  const paths = SPORT_PATHS[sport];
  const params = new URLSearchParams();
  if (date) params.set("dates", date);

  const url = `${BASE_URL}/site/v2/sports/${paths.sport}/${paths.league}/scoreboard${
    params.toString() ? `?${params}` : ""
  }`;

  return fetchESPN<ESPNScoreboardResponse>(url);
}

/**
 * Get standings for a sport
 */
export async function getESPNStandings(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNStandingsResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/v2/sports/${paths.sport}/${paths.league}/standings`;
  return fetchESPN<ESPNStandingsResponse>(url);
}

/**
 * Get league-wide injury reports
 */
export async function getInjuries(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNInjuryResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/site/v2/sports/${paths.sport}/${paths.league}/injuries`;
  return fetchESPN<ESPNInjuryResponse>(url);
}

/**
 * Get stats leaders for a sport (v3 endpoint — rich inline data)
 */
export async function getLeaders(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNLeadersResponse> {
  const paths = SPORT_PATHS[sport];
  const url = `${BASE_URL}/site/v3/sports/${paths.sport}/${paths.league}/leaders`;
  return fetchESPN<ESPNLeadersResponse>(url);
}

/**
 * Get power rankings (FPI for NFL, BPI for NBA)
 * NHL and MLB use generic power index
 */
/**
 * Get soccer scoreboard from ESPN for leagues not covered by football-data.org
 */
export async function getESPNSoccerScoreboard(
  leagueSlug: string,
  date?: string
): Promise<ESPNScoreboardResponse> {
  const params = new URLSearchParams();
  if (date) params.set("dates", date);
  const url = `${BASE_URL}/site/v2/sports/soccer/${leagueSlug}/scoreboard${
    params.toString() ? `?${params}` : ""
  }`;
  return fetchESPN<ESPNScoreboardResponse>(url);
}

/**
 * Get soccer standings from ESPN
 */
export async function getESPNSoccerStandings(
  leagueSlug: string
): Promise<ESPNStandingsResponse> {
  const url = `${BASE_URL}/v2/sports/soccer/${leagueSlug}/standings`;
  return fetchESPN<ESPNStandingsResponse>(url);
}

/**
 * Get event summary (box score, play-by-play, etc.) from ESPN
 */
export async function getESPNEventSummary(
  sport: string,
  league: string,
  eventId: string
): Promise<ESPNEventSummaryResponse> {
  const url = `${BASE_URL}/site/v2/sports/${sport}/${league}/summary?event=${eventId}`;
  return fetchESPN<ESPNEventSummaryResponse>(url);
}

export async function getPowerIndex(
  sport: "nfl" | "nba" | "nhl" | "mlb"
): Promise<ESPNPowerIndexResponse> {
  const paths = SPORT_PATHS[sport];
  const year = new Date().getFullYear();
  const sortField = sport === "nfl" ? "fpi.fpi" : sport === "nba" ? "bpi.bpi" : "record.wins";
  const limit = sport === "nfl" ? 32 : 30;
  const url = `${WEB_BASE_URL}/fitt/v3/sports/${paths.sport}/${paths.league}/powerindex?region=us&lang=en&season=${year}&sort=${sortField}%3Adesc&limit=${limit}`;
  return fetchESPN<ESPNPowerIndexResponse>(url);
}
