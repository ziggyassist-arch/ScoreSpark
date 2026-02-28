import type { Sport } from "../types";

export interface MockNewsArticle {
  id: string;
  title: string;
  source: string;
  url: string;
  sport: Sport;
  imageUrl?: string;
  timeAgo: string;
  publishedAt?: string;
}

export const soccerNews: MockNewsArticle[] = [
  {
    id: "mock-news-soccer-1",
    title: "Arsenal and Liverpool set for title showdown at Emirates",
    source: "BBC Sport",
    url: "https://example.com/arsenal-liverpool-preview",
    sport: "soccer",
    timeAgo: "2h ago",
    publishedAt: "2026-02-27T14:00:00Z",
  },
  {
    id: "mock-news-soccer-2",
    title: "Haaland hits 25-goal mark as City keep pace with leaders",
    source: "Sky Sports",
    url: "https://example.com/haaland-25-goals",
    sport: "soccer",
    timeAgo: "4h ago",
    publishedAt: "2026-02-27T12:00:00Z",
  },
  {
    id: "mock-news-soccer-3",
    title: "Saka nominated for PFA Player of the Year",
    source: "The Athletic",
    url: "https://example.com/saka-pfa-nomination",
    sport: "soccer",
    timeAgo: "6h ago",
    publishedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "mock-news-soccer-4",
    title: "Isak hat-trick sinks Manchester United at St James' Park",
    source: "BBC Sport",
    url: "https://example.com/isak-hatrick",
    sport: "soccer",
    timeAgo: "18h ago",
    publishedAt: "2026-02-26T22:00:00Z",
  },
  {
    id: "mock-news-soccer-5",
    title: "Chelsea target summer reinforcements after inconsistent run",
    source: "ESPN",
    url: "https://example.com/chelsea-summer-plans",
    sport: "soccer",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T08:00:00Z",
  },
  {
    id: "mock-news-soccer-6",
    title: "Aston Villa confirm Champions League qualification after Villa Park win",
    source: "The Guardian",
    url: "https://example.com/villa-ucl-qualification",
    sport: "soccer",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T06:00:00Z",
  },
];

export const nbaNews: MockNewsArticle[] = [
  {
    id: "mock-news-nba-1",
    title: "Celtics extend winning streak to five games with dominant win",
    source: "ESPN",
    url: "https://example.com/celtics-five-game-streak",
    sport: "nba",
    timeAgo: "1h ago",
    publishedAt: "2026-02-27T15:00:00Z",
  },
  {
    id: "mock-news-nba-2",
    title: "Curry drops 41 in Warriors comeback win over Bucks",
    source: "NBA.com",
    url: "https://example.com/curry-41-points",
    sport: "nba",
    timeAgo: "5h ago",
    publishedAt: "2026-02-27T11:00:00Z",
  },
  {
    id: "mock-news-nba-3",
    title: "Jokic triple-double leads Nuggets past 76ers",
    source: "The Athletic",
    url: "https://example.com/jokic-triple-double",
    sport: "nba",
    timeAgo: "8h ago",
    publishedAt: "2026-02-27T08:00:00Z",
  },
  {
    id: "mock-news-nba-4",
    title: "Durant dominates in Suns road win at Miami",
    source: "ESPN",
    url: "https://example.com/durant-dominates-miami",
    sport: "nba",
    timeAgo: "20h ago",
    publishedAt: "2026-02-26T20:00:00Z",
  },
  {
    id: "mock-news-nba-5",
    title: "LeBron passes another milestone as Lakers fall to Celtics",
    source: "Bleacher Report",
    url: "https://example.com/lebron-milestone",
    sport: "nba",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T10:00:00Z",
  },
  {
    id: "mock-news-nba-6",
    title: "Trade deadline preview: Which contenders need a deal?",
    source: "The Ringer",
    url: "https://example.com/trade-deadline-preview",
    sport: "nba",
    timeAgo: "2d ago",
    publishedAt: "2026-02-25T14:00:00Z",
  },
];

export const nflNews: MockNewsArticle[] = [
  {
    id: "mock-news-nfl-1",
    title: "Mahomes leads Chiefs to comeback victory over Ravens",
    source: "ESPN",
    url: "https://example.com/mahomes-comeback",
    sport: "nfl",
    timeAgo: "3h ago",
    publishedAt: "2026-02-27T13:00:00Z",
  },
  {
    id: "mock-news-nfl-2",
    title: "Goff throws 4 TDs as Lions outgun Dolphins in shootout",
    source: "NFL.com",
    url: "https://example.com/lions-dolphins-shootout",
    sport: "nfl",
    timeAgo: "6h ago",
    publishedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "mock-news-nfl-3",
    title: "Barkley rushes for 132 yards in Eagles win over Cowboys",
    source: "ESPN",
    url: "https://example.com/barkley-132-yards",
    sport: "nfl",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T08:00:00Z",
  },
  {
    id: "mock-news-nfl-4",
    title: "Derrick Henry and Lamar lead Ravens past Bills",
    source: "CBS Sports",
    url: "https://example.com/ravens-beat-bills",
    sport: "nfl",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T06:00:00Z",
  },
  {
    id: "mock-news-nfl-5",
    title: "Playoff picture: Updated bracket and scenarios for Week 18",
    source: "NFL.com",
    url: "https://example.com/playoff-picture",
    sport: "nfl",
    timeAgo: "2d ago",
    publishedAt: "2026-02-25T12:00:00Z",
  },
];

export const nhlNews: MockNewsArticle[] = [
  {
    id: "mock-news-nhl-1",
    title: "McDavid scores OT winner as Oilers edge Panthers",
    source: "ESPN",
    url: "https://example.com/mcdavid-ot-winner",
    sport: "nhl",
    timeAgo: "2h ago",
    publishedAt: "2026-02-27T14:00:00Z",
  },
  {
    id: "mock-news-nhl-2",
    title: "Avalanche rout Stars 5-2 behind MacKinnon hat trick",
    source: "NHL.com",
    url: "https://example.com/mackinnon-hatrick",
    sport: "nhl",
    timeAgo: "5h ago",
    publishedAt: "2026-02-27T11:00:00Z",
  },
  {
    id: "mock-news-nhl-3",
    title: "Shesterkin brilliant as Rangers blank Hurricanes 3-0",
    source: "The Athletic",
    url: "https://example.com/shesterkin-shutout",
    sport: "nhl",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T10:00:00Z",
  },
  {
    id: "mock-news-nhl-4",
    title: "Bruins survive Golden Knights rally in 5-4 thriller",
    source: "ESPN",
    url: "https://example.com/bruins-golden-knights",
    sport: "nhl",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T06:00:00Z",
  },
  {
    id: "mock-news-nhl-5",
    title: "Trade deadline looms: Top players who could be moved",
    source: "TSN",
    url: "https://example.com/nhl-trade-deadline",
    sport: "nhl",
    timeAgo: "2d ago",
    publishedAt: "2026-02-25T15:00:00Z",
  },
];

export const mlbNews: MockNewsArticle[] = [
  {
    id: "mock-news-mlb-1",
    title: "Ohtani blasts two homers as Dodgers cruise past Braves",
    source: "ESPN",
    url: "https://example.com/ohtani-two-homers",
    sport: "mlb",
    timeAgo: "3h ago",
    publishedAt: "2026-02-27T13:00:00Z",
  },
  {
    id: "mock-news-mlb-2",
    title: "Judge hits walk-off grand slam to beat Astros",
    source: "MLB.com",
    url: "https://example.com/judge-walkoff-slam",
    sport: "mlb",
    timeAgo: "6h ago",
    publishedAt: "2026-02-27T10:00:00Z",
  },
  {
    id: "mock-news-mlb-3",
    title: "Wheeler dominates in Phillies win over Rangers",
    source: "The Athletic",
    url: "https://example.com/wheeler-dominates",
    sport: "mlb",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T10:00:00Z",
  },
  {
    id: "mock-news-mlb-4",
    title: "Orioles young core shines in rout of Rays",
    source: "ESPN",
    url: "https://example.com/orioles-rout-rays",
    sport: "mlb",
    timeAgo: "1d ago",
    publishedAt: "2026-02-26T06:00:00Z",
  },
  {
    id: "mock-news-mlb-5",
    title: "All-Star voting update: Who leads at each position?",
    source: "MLB.com",
    url: "https://example.com/allstar-voting",
    sport: "mlb",
    timeAgo: "2d ago",
    publishedAt: "2026-02-25T14:00:00Z",
  },
];

export function getNewsForSport(sport: Sport): MockNewsArticle[] {
  switch (sport) {
    case "soccer": return soccerNews;
    case "nba": return nbaNews;
    case "nfl": return nflNews;
    case "nhl": return nhlNews;
    case "mlb": return mlbNews;
  }
}

export const allMockNews: MockNewsArticle[] = [
  ...soccerNews,
  ...nbaNews,
  ...nflNews,
  ...nhlNews,
  ...mlbNews,
];
