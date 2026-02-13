# ScoreSpark — Feature Specification v1.0

> **The build bible for the ScoreSpark iOS app.**
> Multi-sport live scores, advanced stats, and draft intelligence — built for the obsessive fan.
> Created: 2026-02-12

---

## Table of Contents

1. [Vision & Positioning](#1-vision--positioning)
2. [Competitive Landscape Analysis](#2-competitive-landscape-analysis)
3. [Supported Sports & Leagues](#3-supported-sports--leagues)
4. [Core Platform Features](#4-core-platform-features)
5. [Live Game Experience](#5-live-game-experience)
6. [NBA-Specific Features](#6-nba-specific-features)
7. [NFL-Specific Features](#7-nfl-specific-features)
8. [Soccer-Specific Features](#8-soccer-specific-features)
9. [Draft Central](#9-draft-central)
10. [Player Profiles & Stats](#10-player-profiles--stats)
11. [Team Hub](#11-team-hub)
12. [Standings & Playoffs](#12-standings--playoffs)
13. [News & Content](#13-news--content)
14. [Social & Community](#14-social--community)
15. [Personalization & Favorites](#15-personalization--favorites)
16. [Notifications & Alerts](#16-notifications--alerts)
17. [Widgets & Live Activities](#17-widgets--live-activities)
18. [Search & AI Query Engine](#18-search--ai-query-engine)
19. [Fantasy & Betting Adjacent](#19-fantasy--betting-adjacent)
20. [Accessibility & Settings](#20-accessibility--settings)
21. [Technical Architecture Notes](#21-technical-architecture-notes)
22. [Monetization Strategy](#22-monetization-strategy)
23. [MVP Phasing](#23-mvp-phasing)

---

## 1. Vision & Positioning

**ScoreSpark** is a premium multi-sport scores and stats app that combines:

- **FotMob's depth** — advanced analytics, visualizations, and data density
- **theScore's speed** — lightning-fast scores with clean, dark-mode-first UI
- **StatMuse's intelligence** — natural language stat queries powered by AI
- **Sleeper's community** — social features and draft tools that keep fans engaged year-round
- **ESPN's breadth** — comprehensive coverage across NBA, NFL, and soccer

### Core Differentiators

1. **Advanced analytics for every sport** — shot charts, pass maps, win probability, EPA — not locked behind paywalls
2. **Consensus Draft Projections** — aggregated mock drafts with ScoreSpark's own consensus board
3. **AI-powered stat queries** — "Who has the most 40-point games this season?" answered instantly
4. **Unified multi-sport experience** — one app, consistent UX, deep in every sport
5. **Beautiful data visualization** — charts, maps, and graphs that are genuinely best-in-class

### Target Users

- **Primary:** NBA and NFL fans (18-40) who care about stats beyond box scores
- **Secondary:** Soccer fans who want FotMob-level depth
- **Tertiary:** Fantasy/betting-adjacent users who need data edge

---

## 2. Competitive Landscape Analysis

### NBA Apps

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **NBA App (Official)** | League Pass integration, official video highlights, play-by-play, shot charts, real-time box scores | Clunky UI, heavy upselling to League Pass, slow load times, limited advanced stats |
| **ESPN** | Brand trust, broad coverage, Fantasy integration, video highlights, expert analysis | Jack of all trades — NBA depth is mediocre, cluttered UI, aggressive ads |
| **theScore** | Fastest live scores, clean dark UI, excellent notifications, good box scores, bet tracking | Limited advanced analytics, no shot charts or player tracking data |
| **ClutchPoints** | Fan-focused content, real-time injury reports, trade rumors, social media aggregation, player grades | More content/news than stats, can feel spammy, limited data visualizations |
| **StatMuse** | Natural language stat queries ("Who averaged the most assists in 2019?"), beautiful stat cards, historical depth | Not a live scores app, no game-day experience, more reference than real-time |

### NFL Apps

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **NFL App (Official)** | NFL+ streaming, RedZone, Next Gen Stats, official highlights, fantasy integration | Buggy, aggressive NFL+ upselling, slow, fantasy UX is weak |
| **ESPN** | Monday Night Football, Fantasy (market leader), expert picks, Power Rankings, draft coverage | NFL coverage is broad not deep, same cluttered UI issues |
| **theScore** | Fast scores, drive charts, clean play-by-play, excellent push notifications | Limited Next Gen Stats equivalent, no advanced analytics |
| **Yahoo Sports** | Strong fantasy platform, daily fantasy, stat projections, watch integration | Dated UI, declining investment, fantasy-first not stats-first |
| **Sleeper** | Best draft room UX, mock drafts, community chat, dynasty leagues, real-time player news | Fantasy-only — no standalone scores/stats experience, niche audience |

### Soccer (FotMob — The Gold Standard)

FotMob is the benchmark for what a sport-specific app should be:

- **xG (expected goals)** with shot maps showing every attempt
- **Heat maps and pass maps** per player
- **Match momentum graph** showing who's dominating minute-by-minute
- **Player ratings** (1-10) for every match + season averages
- **Lineups with tactical formation visualization**
- **H2H history** with detailed comparison
- **Standings with form guide** (W/D/L streaks)
- **Live Activities & widgets** that are actually beautiful
- **Transfer news and rumors** integrated into team/player pages
- **Customizable push notifications** (goals, red cards, lineups, FT only, etc.)

---

## 3. Supported Sports & Leagues

### Launch (v1.0)

| Sport | Leagues |
|-------|---------|
| **Basketball** | NBA, WNBA |
| **Football** | NFL |
| **Soccer** | Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, Champions League, Europa League, World Cup |

### Post-Launch Expansion

- NCAA Basketball (March Madness)
- NCAA Football (CFB)
- NBA G League
- Liga MX, EFL Championship, Eredivisie
- International friendlies & qualifiers

---

## 4. Core Platform Features

### 4.1 Home Feed — "Today"

The landing screen. Shows everything happening now and coming up.

- **Live games pinned to top** with real-time scores, clock, and key stat
- **Upcoming games** grouped by league with countdown timers
- **Completed games** with final scores, top performer highlight
- **Personalized order** — favorite teams/leagues float to top
- **Quick filters:** All | NBA | NFL | Soccer | Favorites
- **"Happening Now" ticker** — injuries, trades, breaking news as a horizontal scrollable strip
- **Score spoiler mode** — hide scores until tapped (for DVR fans)

### 4.2 Navigation

- **Tab bar:** Today | Scores | Explore | Draft | Profile
- **Scores tab:** Full schedule grid by date, swipeable date picker
- **Explore tab:** Standings, stats leaders, news, trending
- **Draft tab:** (Seasonal) Draft central for NBA/NFL
- **Profile tab:** Favorites, settings, notifications, history

### 4.3 Universal Design Principles

- **Dark mode first** — OLED-optimized blacks, vibrant accent colors per team
- **Team color theming** — game pages, team pages tinted with team's primary color
- **Haptic feedback** on score updates, goal alerts, big plays
- **Buttery animations** — 60fps transitions, spring physics on cards
- **Offline mode** — cached scores, standings, and stats available without connection
- **Pull-to-refresh** everywhere
- **Deep linking** — every game, player, team has a shareable URL

---

## 5. Live Game Experience

The game detail page is the crown jewel. Inspired by FotMob's match page but expanded for all sports.

### 5.1 Game Header

- Teams with logos, current score, game clock/period/quarter/half
- **Live Activity integration** — updates on Lock Screen and Dynamic Island
- Venue, broadcast info, attendance
- **Win probability indicator** — real-time percentage bar between the two teams
- Quick-tap to add to favorites or set notification preferences

### 5.2 Universal Game Tabs

Every game page has sport-appropriate tabs:

| Tab | Description |
|-----|-------------|
| **Summary** | Key events timeline, top performers, game flow chart |
| **Play-by-Play** | Chronological event log with icons and detail |
| **Box Score** | Full statistical breakdown for all players |
| **Stats** | Team comparison stats with visual bars |
| **Lineups** | Starting lineups/formations with player photos |
| **H2H** | Historical matchup data |
| **Odds** | Pre-game and live odds from multiple books |

### 5.3 Game Flow / Momentum Graph

Inspired by FotMob's momentum graph:

- **NBA:** Point differential over time, showing runs and lead changes. X-axis = game clock, Y-axis = point differential. Color-coded by which team is on top.
- **NFL:** Expected Points Added (EPA) cumulative graph per drive. Shows offensive momentum swings.
- **Soccer:** Pressure/possession momentum graph minute-by-minute. xG timeline showing when big chances occurred.

### 5.4 Win Probability Chart

Real-time win probability line graph:
- Updates on every play/possession
- Key plays annotated on the graph (3-pointer to tie, pick-6, red card)
- Pre-game probabilities shown as starting point
- Shareable as an image

### 5.5 Live Commentary / Key Events Timeline

- Vertical scrolling timeline with icons for each event type
- **NBA:** Baskets, blocks, steals, timeouts, substitutions, technicals, challenges
- **NFL:** Plays with yard gains, penalties, turnovers, scores, challenges, injuries
- **Soccer:** Goals, cards, substitutions, VAR decisions, corners, free kicks
- Tap any event to see detail (shot chart location, play diagram, etc.)

---

## 6. NBA-Specific Features

### 6.1 Shot Charts

Per-player and per-team shot charts on a half-court diagram:

- **Made/missed markers** color-coded (green/red)
- **Zone efficiency overlay** — court divided into zones with FG% heat coloring
- **Filter by:** quarter, shot type (2PT/3PT/FT), made/missed, assisted/unassisted
- **Season shot charts** — accumulated over the season with density visualization
- **Comparison mode** — overlay two players' shot charts
- **League-average comparison** — show zones above/below league average FG%

### 6.2 Player Tracking / Advanced Stats

Sourced from NBA's tracking data:

- **Speed & distance** covered per game
- **Touches, time of possession**
- **Closest defender distance** on shots
- **Catch-and-shoot vs pull-up** shooting splits
- **Drives, post-ups, isolation** play-type breakdowns
- **Rebounding chances** (contested vs uncontested)
- **Hustle stats** — deflections, loose balls, charges drawn, screen assists

### 6.3 Lineup Analysis

- **5-man lineup stats** — Net Rating, pace, minutes together
- **On/off court impact** — team stats with player on vs off
- **Plus/minus visualization** — game-level +/- timeline per player
- **Rotation chart** — visual timeline showing who was on court each minute

### 6.4 Play-by-Play Enhanced

- Each play shows: scorer, assister, shot type, distance, shot clock
- **Shot location dot** next to each scoring play
- **Run tracker** — highlight scoring runs (e.g., "12-0 run over 3:24")
- Filter by: scoring plays only, turnovers, fouls

### 6.5 NBA-Specific Stats

- **Traditional:** PTS, REB, AST, STL, BLK, TO, FG%, 3P%, FT%
- **Advanced:** PER, TS%, eFG%, USG%, AST%, TOV%, DRTG, ORTG, BPM, VORP, WS, WS/48
- **Per-game, per-36, per-100 possessions** toggle
- **Clutch stats** — performance in last 5 min of games within 5 points
- **Splits:** Home/Away, vs Conference, monthly, day of week, rest days

### 6.6 Trade Machine / Deadline Tracker

- **Trade deadline countdown** with rumor aggregation
- **Trade tracker** — completed trades with salary details
- **Salary cap impact** visualization
- **Before/after team ratings** for completed trades

---

## 7. NFL-Specific Features

### 7.1 Drive Charts

Visual drive summaries:

- **Field position diagram** showing start → end of each drive
- Color-coded by result: TD (green), FG (yellow), punt (gray), turnover (red)
- Tap to expand into play-by-play for that drive
- **Red zone efficiency** tracked per team

### 7.2 Play-by-Play Enhanced

- **Down & distance** with field position marker
- **EPA per play** shown inline
- **Pass chart** — where on the field each pass was targeted (air yards diagram)
- **Personnel packages** — 11, 12, 21, etc. noted when available
- Filter by: team, down, play type (run/pass), scoring drives only

### 7.3 Passing Charts & Target Maps

- **Target distribution** — where a QB throws (short left, deep middle, etc.) with completion % per zone
- **Receiver target share** — pie chart of team targets
- **Air yards vs YAC** breakdown per receiver
- **Pressure rate** — how often QB is pressured, stats under pressure vs clean pocket

### 7.4 NFL Advanced Stats

- **Passing:** ANY/A, EPA/play, CPOE, air yards, passer rating
- **Rushing:** EPA/rush, yards before/after contact, broken tackles, stuff rate
- **Receiving:** target share, separation, catch rate, YAC/reception, contested catch rate
- **Defense:** EPA/play allowed, pressure rate, coverage stats, missed tackle rate
- **Special Teams:** return averages, punt hang time, FG accuracy by distance
- **Team:** DVOA-style efficiency ratings, strength of schedule

### 7.5 Game Script Analysis

- **Score differential over time** — graph showing how the game unfolded
- **Pass/run ratio** by game script (when leading, trailing, close)
- **Play-action rate and success**
- **Situational efficiency:** 3rd down, red zone, goal-to-go, 2-minute drill

### 7.6 Weekly Power Rankings

- **ScoreSpark composite** — aggregate of multiple outlets' power rankings
- Week-over-week movement arrows
- Key stats backing each ranking
- User voting / community rankings comparison

### 7.7 Injury Reports

- **Practice participation** tracker (DNP, Limited, Full)
- Wednesday → Thursday → Friday progression tracking
- Game-day inactive list
- IR tracker with expected return timelines
- Impact analysis — how team performs without key player

---

## 8. Soccer-Specific Features

Mirror FotMob's best features with ScoreSpark's visual style:

### 8.1 Match Stats & Visualizations

- **xG (Expected Goals)** — per shot, cumulative, per team
- **Shot map** — every shot plotted on pitch with xG value and outcome
- **Heat maps** — per player touch density on pitch
- **Pass maps** — completed/incomplete passes with direction arrows
- **Average positions** — where each player operated on the pitch
- **Defensive actions map** — tackles, interceptions, clearances plotted

### 8.2 Tactical Features

- **Formation visualization** — starting XI shown in tactical formation
- **Formation changes** tracked during match
- **Pressing intensity** metrics
- **Progressive passes/carries** highlighted
- **Set piece analysis** — corner delivery zones, free kick positions

### 8.3 Player Ratings

- **Match rating (1-10)** based on statistical performance model
- **Key stats driving the rating** shown as supporting evidence
- **Season average rating** tracked over time
- **Best XI** — automatically generated best lineup of the matchweek

### 8.4 Transfer Window

- **Transfer news feed** — rumors and confirmed deals
- **Transfer tracker** — all completed transfers by league
- **Fee visualization** — biggest transfers ranked
- **Player linked to clubs** — rumor aggregation per player

### 8.5 Standings Enhanced

- **Form guide** — last 5/10 results shown as W/D/L bubbles
- **xG table** — standings based on expected goals
- **Home/Away splits**
- **Points per game trend** — mini sparkline per team
- **Relegation/promotion/European places** color-coded

---

## 9. Draft Central

**The killer feature that no single app does comprehensively.** Available for both NBA and NFL drafts.

### 9.1 Consensus Big Board

ScoreSpark aggregates mock drafts from 15+ top sources:

**NBA Sources:** ESPN (Givony/Schmitz), The Ringer, The Athletic, NBADraft.net, Bleacher Report, CBS Sports, SI, Yahoo, Sam Vecenie, Kevin O'Connor, etc.

**NFL Sources:** ESPN (McShay/Kiper), The Ringer, The Athletic, PFF, CBS Sports, NFL.com (Jeremiah/Brooks), SI, Walter Football, Mel Kiper, Todd McShay, Daniel Jeremiah, etc.

#### Consensus Algorithm

- Each prospect gets a **Consensus Rank** — weighted average of all mock draft positions
- **Confidence Score** — how much agreement exists (tight range = high confidence, wide range = volatile)
- **Trend indicator** — rising/falling/stable based on last 30 days of mock drafts
- **Range visualization** — bar showing lowest to highest projected pick across mocks

#### Big Board Display

- Sortable/filterable prospect list
- **Tier groupings** — visual tier breaks (Tier 1: generational, Tier 2: franchise, etc.)
- Filter by: position, school/club, height, weight, age
- Tap prospect → full scouting profile

### 9.2 Mock Draft Simulator

- **Pick-by-pick mock draft** — ScoreSpark's consensus projection for every pick
- **Trade probability** — likelihood a team trades up/down based on historical data + rumors
- **User mock draft** — build your own, compare against consensus
- **Community mock** — crowdsourced pick-by-pick

### 9.3 Prospect Profiles

- **Scouting report** — strengths, weaknesses, pro comparison, ceiling/floor
- **Stats** — college/international stats, per-game, advanced
- **Measurements** — combine results, pro day numbers
- **Highlights** — embedded video clips
- **Draft stock chart** — how their ranking has changed over the season
- **Mock draft history** — where each outlet has projected them over time

### 9.4 Team Draft Pages

- **Team needs analysis** — ranked positional needs with explanation
- **Draft capital** — all picks owned (including acquired/traded)
- **Roster context** — current depth chart with contract status
- **Best fits** — prospects that match team needs and scheme
- **Draft history** — past picks with hit/miss grades

### 9.5 Draft Night Live

- **Real-time pick tracker** — as picks happen, instant update
- **Consensus vs actual** comparison — did the pick match projections?
- **Trade tracker** — draft-night trades with pick swap details
- **Instant analysis** — AI-generated pick grades and fit analysis
- **Live community reactions** — chat/reactions per pick

### 9.6 Post-Draft

- **Draft grades** — aggregated from analysts + ScoreSpark's own
- **Team-by-team breakdown** with haul analysis
- **Redraft projections** — after rookie season, where would they have gone?

---

## 10. Player Profiles & Stats

### 10.1 Profile Header

- Player photo, team logo, jersey number, position
- **Key bio:** age, height, weight, experience, draft pick, college/country
- **Contract info:** current salary, years remaining, cap hit
- **Season stat line** — the 3-4 most important stats prominently displayed
- **Follow button** — add to favorites for notifications

### 10.2 Stats Dashboard

- **Season stats** — current season, all standard + advanced
- **Career stats** — year-by-year table, career totals and averages
- **Game log** — every game this season with full stat line, sortable
- **Splits:** Home/Away, by opponent, by month, pre/post All-Star, rest days, wins/losses
- **Rankings** — where player ranks league-wide in each stat category
- **Percentile chart** — radar/spider chart showing percentile rank in key stats vs position

### 10.3 Visualizations

- **NBA:** Season shot chart, scoring by quarter, usage rate trend
- **NFL:** Passing chart (season), target heatmap, EPA trend by week
- **Soccer:** Heat map (season), pass map, progressive actions chart

### 10.4 Comparison Tool

- **Side-by-side player comparison** — select any two players
- Stat tables with leader highlighted
- Radar chart overlay
- Historical comparison — compare peak seasons across eras
- **"vs" page** when two players face each other — head-to-head history

### 10.5 Player News

- Aggregated news/tweets about the player
- Injury updates
- Fantasy-relevant updates
- Trade rumors (if applicable)

---

## 11. Team Hub

### 11.1 Team Header

- Logo, record, conference/division rank, streak
- **Next game** countdown with opponent and broadcast info
- **Season grade** — ScoreSpark's overall team rating (A+ through F)

### 11.2 Team Tabs

| Tab | Contents |
|-----|----------|
| **Overview** | Record, recent results, upcoming schedule, key stats |
| **Roster** | Full roster with photos, sortable by stats |
| **Schedule** | Full season schedule with results, exportable to calendar |
| **Stats** | Team stats — offensive, defensive, advanced |
| **Standings** | Division/conference standings context |
| **Depth Chart** | Current depth chart (NFL) / rotation (NBA) / lineup (Soccer) |
| **Transactions** | Trades, signings, waives, injuries timeline |
| **Draft** | Team's draft page (needs, picks, best fits) |
| **News** | Team-specific news feed |

### 11.3 Team Stats Visualizations

- **Offensive vs Defensive rating** scatter plot (NBA)
- **EPA per play** offense vs defense scatter (NFL)
- **xG for vs xG against** scatter (Soccer)
- Season trend lines for key metrics
- League rank badges (Top 5, Bottom 5, etc.)

---

## 12. Standings & Playoffs

### 12.1 Standings

- **Conference/Division/League** views
- Clinching scenarios and magic numbers
- **Form guide** — last 10 results
- **Strength of schedule** remaining
- **Projected final record** — based on current pace + schedule difficulty
- Playoff odds percentage
- Sortable by any stat column
- **NBA:** Play-In tournament picture
- **NFL:** Wild card race, division leaders, seeding tiebreakers
- **Soccer:** Full table with xG table toggle, home/away splits

### 12.2 Playoff Bracket

- **Visual bracket** — interactive, tappable
- Series scores (NBA) / single game results (NFL) / aggregate (Soccer UCL)
- Upcoming game schedule within series
- **Historical brackets** — past seasons browsable

---

## 13. News & Content

### 13.1 News Feed

- **Aggregated from** top sources (The Athletic, ESPN, Bleacher Report, team reporters)
- Filterable by: sport, team, topic (trades, injuries, analysis, rumors)
- **Breaking news** badges with push notification integration
- Save/bookmark articles

### 13.2 Video Highlights

- **Embedded highlights** — key plays, game recaps
- Auto-playing in feed with mute toggle
- Full game highlight packages (2-5 min recaps)
- Individual play clips

### 13.3 ScoreSpark Originals (Future)

- Weekly power rankings articles
- Draft analysis pieces
- Stat-driven stories ("The 5 Most Clutch Players This Season")
- AI-generated game recaps

---

## 14. Social & Community

### 14.1 Game Chat

- **Per-game chat room** — real-time during live games
- Reactions (emoji, GIF) on messages
- **Automated bot posts** for scoring plays/big moments
- Upvote/downvote for quality control
- Mute/block users

### 14.2 Predictions & Picks

- **Pick'em** — predict game winners each week
- **Prop predictions** — will Player X score 30+?
- Leaderboards for prediction accuracy
- **Friends league** — compete with friends on picks

### 14.3 User Polls

- Quick community polls on game pages ("Who wins tonight?", "MVP of the game?")
- Results shown as live-updating bar charts

### 14.4 Share Cards

- **Beautiful shareable stat cards** — auto-generated images for any stat, comparison, or game result
- Optimized for Instagram Stories, Twitter, iMessage
- ScoreSpark watermark/branding
- Deep link back to the app

---

## 15. Personalization & Favorites

### 15.1 Favorite Teams

- Follow unlimited teams across all sports
- Favorite teams appear first everywhere
- Team-colored accents throughout the app when viewing their content
- **One-tap follow** during onboarding

### 15.2 Favorite Players

- Follow individual players
- Player news and stat updates in personalized feed
- Game alerts when they're playing

### 15.3 Favorite Leagues

- Prioritize which leagues appear in scores/standings
- Hide leagues you don't care about

### 15.4 Onboarding Flow

1. Select sports you follow
2. Pick favorite teams (smart suggestions by location)
3. Pick favorite players (suggested from chosen teams)
4. Notification preferences
5. Widget setup prompt

---

## 16. Notifications & Alerts

### 16.1 Customizable Per Team

Each followed team can have individually configured alerts:

| Alert Type | Description |
|------------|-------------|
| **Game Start** | Notification when the game tips off / kicks off |
| **Scoring** | Every score (or only TDs, only goals — configurable) |
| **Quarter/Half** | Score updates at breaks |
| **Final Score** | Game over with final score |
| **Close Game** | Alert when game is within X points in final minutes |
| **Big Play** | Dunks, pick-sixes, screamers (sport-specific) |
| **Lineup** | Starting lineup announcement (30-60 min before game) |
| **Injury** | In-game injury to key player |
| **Breaking News** | Trades, signings, major news about your team |

### 16.2 Global Alerts

- **Trade alerts** — any trade across the league
- **Draft alerts** — pick-by-pick during draft night
- **Upset alerts** — when a major upset is in progress
- **Milestone alerts** — player approaching record/milestone

### 16.3 Quiet Hours

- Set times when notifications are silenced
- Game-day override option

### 16.4 Notification Center

- In-app notification history
- Tappable — each notification deep-links to relevant content

---

## 17. Widgets & Live Activities

### 17.1 Home Screen Widgets

| Size | Content |
|------|---------|
| **Small** | Single game score (live or next upcoming) |
| **Medium** | Today's scores for favorite team(s), 2-3 games |
| **Large** | Full scoreboard — all live/upcoming games for a sport |
| **Lock Screen (inline)** | Next game countdown OR live score |
| **Lock Screen (circular)** | Team logo with score or record |

- Widgets update in near-real-time during live games
- Customizable: choose sport, team, or "all favorites"
- Multiple widget styles: minimal, detailed, standings

### 17.2 Live Activities

- **Triggered automatically** when a followed team's game starts
- **Dynamic Island (compact):** Score + clock
- **Dynamic Island (expanded):** Score + clock + last event + top scorer
- **Lock Screen banner:** Full game state — score, clock, key stats
- **Updates on:** Every score, quarter/half changes, final
- User can start/stop Live Activity from game page

### 17.3 StandBy Mode

- Optimized widget display for StandBy mode (iPhone on charger)
- Larger, glanceable scoreboard

### 17.4 Apple Watch (Future)

- Complications for live scores
- Game alerts on wrist
- Quick glance at standings

---

## 18. Search & AI Query Engine

**Inspired by StatMuse — the most unique feature in ScoreSpark.**

### 18.1 Natural Language Search

Users type or speak questions in plain English:

**Examples:**
- "Who leads the NBA in assists?"
- "How did the Chiefs do in the red zone last week?"
- "Liverpool's record against Man City in the last 5 years"
- "Which QB has the highest EPA per play this season?"
- "Jokic vs Embiid stats this season"
- "Top 10 scorers under 25 in the NBA"
- "What's the longest winning streak in NFL history?"

### 18.2 Response Format

- **Stat card** — beautifully formatted answer with the data
- **Supporting context** — additional stats that add context
- **Visualizations** — auto-generated charts where relevant
- **Shareable** — every answer is a shareable image card

### 18.3 Search UX

- **Search bar** accessible from every screen (pull down)
- **Trending queries** — what other fans are searching
- **Recent searches** saved
- **Autocomplete** with smart suggestions
- **Voice input** supported

### 18.4 Traditional Search

- Search for: players, teams, games, articles
- Instant results with preview cards
- Recent/trending searches

---

## 19. Fantasy & Betting Adjacent

**ScoreSpark is NOT a fantasy app or sportsbook.** But it provides data tools that fantasy and betting users love.

### 19.1 Fantasy-Relevant Data

- **Projected stats** — per game projections for key categories
- **Ownership %** in major DFS platforms
- **Red/green flags** — matchup analysis for fantasy relevance
- **Start/Sit tool** — compare two players' matchup outlook
- **Waiver wire highlights** — trending players with breakout potential

### 19.2 Odds & Lines

- **Pre-game odds** from multiple sportsbooks
- **Live odds** updating during game
- **Line movement tracker** — how odds have shifted since opening
- **Spread, moneyline, over/under** displayed
- **Player props** — major player prop lines shown on player pages
- **No direct betting integration** — ScoreSpark provides info only

### 19.3 Trends & Edges

- **ATS records** (against the spread) for teams
- **Over/under trends** — how often a team goes over
- **Situational trends** — "Team X is 8-2 ATS as home underdogs"
- **Rest advantage analysis** — back-to-backs, short weeks, bye weeks

---

## 20. Accessibility & Settings

### 20.1 Accessibility

- Full VoiceOver support
- Dynamic Type support (all text scales)
- Reduce Motion option (disables animations)
- High contrast mode
- Color blind-friendly palettes for all visualizations

### 20.2 Settings

- **Appearance:** Dark / Light / System
- **Spoiler mode:** Hide/show scores globally
- **Date format:** US / International
- **Time format:** 12h / 24h
- **Temperature:** °F / °C (for weather in game info)
- **Stat format:** Per game / Per 36 / Per 100 (default for NBA)
- **Data usage:** High quality / Data saver (reduce image/video loading)
- **Cache management:** Clear cached data

### 20.3 Account

- Sign up via Apple ID, Google, or email
- Favorites, preferences, and notification settings sync across devices
- Export data (GDPR compliance)
- Delete account option

---

## 21. Technical Architecture Notes

### 21.1 Platform

- **iOS 17+** (required for Live Activities, StandBy, latest widget APIs)
- **SwiftUI** primary UI framework
- **Swift 6** with strict concurrency
- **Minimum device:** iPhone 12

### 21.2 Data Sources

| Data Type | Potential Sources |
|-----------|-------------------|
| NBA live scores & stats | NBA API, Sports Radar, ESPN API |
| NBA advanced stats | NBA Stats API (stats.nba.com), PBP Stats |
| NFL live scores & stats | ESPN API, Sports Radar, NFL API |
| NFL advanced stats | NFL Next Gen Stats API, PFF (licensed) |
| Soccer scores & stats | Football-Data.org, API-Football, Opta |
| Soccer advanced stats | StatsBomb, Opta, FBref data |
| Draft projections | Web scraping + manual curation of mock drafts |
| News | RSS feeds, NewsAPI, official team feeds |
| Odds | The Odds API, various sportsbook APIs |

### 21.3 Architecture

- **MVVM + Clean Architecture** with SwiftUI
- **Local persistence:** SwiftData for favorites/settings, CoreData for cached stats
- **Networking:** async/await with URLSession, WebSocket for live data
- **Real-time updates:** WebSocket connections for live games, SSE fallback
- **Push notifications:** APNs with Firebase Cloud Messaging backend
- **Image caching:** Kingfisher or Nuke
- **Charts:** Swift Charts framework + custom Canvas renderers for shot charts, heat maps
- **Backend:** Node.js or Python (FastAPI) for data aggregation, AI query processing
- **AI engine:** OpenAI API or Claude API for natural language stat queries
- **CDN:** CloudFront for static assets and images

### 21.4 Performance Targets

- **App launch:** < 1.5s cold start
- **Score update latency:** < 5s from real-world event
- **Search response:** < 1s for traditional, < 3s for AI queries
- **Widget refresh:** Every 5-15 min (iOS system limit), Live Activities real-time
- **Offline:** Core data available without connection within 24h of last sync
- **App size:** < 80MB download

---

## 22. Monetization Strategy

### 22.1 Free Tier

Everything in this spec is free except:

- Some AI query volume limits (e.g., 20 AI queries/day)
- Basic widgets (1-2 styles)

### 22.2 ScoreSpark Pro ($4.99/month or $39.99/year)

- **Unlimited AI queries**
- **All widget styles** including custom team widgets
- **Ad-free experience**
- **Advanced comparison tools** (multi-player, historical)
- **Export stats** to CSV
- **Priority notifications** (faster delivery)
- **Exclusive Pro badge** in community features
- **Custom themes** beyond dark/light

### 22.3 Advertising (Free Tier)

- Tasteful banner ads on scores/standings pages
- Interstitial between article pages (skippable)
- **Never:** No ads on live game pages during active games
- **Never:** No video ads that interrupt experience
- **Sponsored content** clearly labeled

---

## 23. MVP Phasing

### Phase 1: Foundation (Weeks 1-8)

- [ ] Core app shell: navigation, theming, dark mode
- [ ] Live scores for NBA, NFL (in-season sport priority)
- [ ] Game detail pages: summary, box score, play-by-play
- [ ] Basic standings
- [ ] Team and player pages (basic stats)
- [ ] Favorites system
- [ ] Push notifications (game start, final score)
- [ ] Home feed

### Phase 2: Depth (Weeks 9-16)

- [ ] Advanced stats (NBA shot charts, NFL passing charts)
- [ ] Win probability graphs
- [ ] Game momentum/flow charts
- [ ] Player comparison tool
- [ ] Widgets (small + medium)
- [ ] Live Activities
- [ ] Enhanced notifications (customizable)
- [ ] News feed integration

### Phase 3: Draft & Intelligence (Weeks 17-24)

- [ ] Draft Central: consensus big board, prospect profiles
- [ ] Mock draft simulator
- [ ] Team needs analysis
- [ ] AI-powered natural language search
- [ ] Share cards
- [ ] Soccer support (scores, xG, shot maps)

### Phase 4: Community & Polish (Weeks 25-32)

- [ ] Game chat
- [ ] Pick'em / predictions
- [ ] Fantasy-adjacent tools
- [ ] Odds integration
- [ ] Large widgets, Lock Screen widgets
- [ ] Apple Watch app
- [ ] ScoreSpark Pro subscription
- [ ] Performance optimization pass

### Phase 5: Scale (Post-Launch)

- [ ] NCAA Basketball & Football
- [ ] Additional soccer leagues
- [ ] Android app
- [ ] Web companion
- [ ] ScoreSpark Originals content
- [ ] API for third-party integrations

---

## Appendix A: Feature Priority Matrix

| Feature | Impact | Effort | Priority |
|---------|--------|--------|----------|
| Live scores | 🔴 Critical | Medium | P0 |
| Box scores / play-by-play | 🔴 Critical | Medium | P0 |
| Favorites & notifications | 🔴 Critical | Low | P0 |
| Game detail pages | 🔴 Critical | High | P0 |
| Standings | 🟡 High | Low | P0 |
| Team/player pages | 🟡 High | Medium | P1 |
| Widgets & Live Activities | 🟡 High | Medium | P1 |
| Shot charts / pass maps | 🟡 High | High | P1 |
| Win probability | 🟡 High | Medium | P1 |
| News feed | 🟢 Medium | Low | P1 |
| Draft consensus board | 🟡 High | High | P2 |
| AI search engine | 🟡 High | High | P2 |
| Soccer support | 🟢 Medium | High | P2 |
| Game chat / community | 🟢 Medium | High | P3 |
| Fantasy tools | 🟢 Medium | Medium | P3 |
| Odds/betting data | 🟢 Medium | Low | P3 |
| Mock draft simulator | 🟢 Medium | High | P3 |
| Apple Watch | 🔵 Low | Medium | P4 |

## Appendix B: Key Metrics / KPIs

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| DAU | 50,000 |
| Session length | > 5 min avg |
| Sessions per user per day | > 2.5 during game days |
| Push notification opt-in | > 70% |
| Widget adoption | > 40% of users |
| Live Activity engagement | > 60% during live games |
| Pro conversion rate | > 5% of MAU |
| App Store rating | > 4.7 |
| Retention (D7) | > 45% |
| Retention (D30) | > 25% |

---

*This document is the single source of truth for ScoreSpark's feature set. All design and engineering decisions should reference this spec. Update as features are refined during development.*

*Last updated: 2026-02-12*
