# ScoreSpark — Feature Specification v2.0

> **The definitive build bible for ScoreSpark.**
> Multi-sport live scores, advanced stats, community, and draft intelligence — built for the obsessive fan.
> ScoreSpark USA LLC · All rights reserved · Trademark registered
> Created: 2026-02-12 · Updated: 2026-02-13

---

## Table of Contents

1. [Market Context & Strategic Positioning](#1-market-context--strategic-positioning)
2. [Vision & Differentiators](#2-vision--differentiators)
3. [Competitive Landscape](#3-competitive-landscape)
4. [Supported Sports & Leagues](#4-supported-sports--leagues)
5. [Core Platform Features](#5-core-platform-features)
6. [Live Game Experience](#6-live-game-experience)
7. [NBA-Specific Features](#7-nba-specific-features)
8. [NFL-Specific Features](#8-nfl-specific-features)
9. [Soccer-Specific Features](#9-soccer-specific-features)
10. [Draft Central](#10-draft-central)
11. [Player Profiles & Stats](#11-player-profiles--stats)
12. [Team Hub](#12-team-hub)
13. [Standings & Playoffs](#13-standings--playoffs)
14. [News & Content](#14-news--content)
15. [Social & Community](#15-social--community)
16. [Personalization & Favorites](#16-personalization--favorites)
17. [Notifications & Alerts](#17-notifications--alerts)
18. [Widgets & Live Activities](#18-widgets--live-activities)
19. [Search & AI Query Engine](#19-search--ai-query-engine)
20. [Fantasy & Betting Adjacent](#20-fantasy--betting-adjacent)
21. [Accessibility & Settings](#21-accessibility--settings)
22. [Technical Architecture](#22-technical-architecture)
23. [Monetization Strategy](#23-monetization-strategy)
24. [MVP Phasing](#24-mvp-phasing)
25. [Appendices](#25-appendices)

---

## 1. Market Context & Strategic Positioning

### 1.1 The Opportunity

The global sports app market is valued at **$4.81 billion (2024)** and projected to reach **$13.22 billion by 2034** at a **10.64% CAGR** (Precedence Research). This growth reflects a fundamental restructuring of how 3.5 billion football fans — plus hundreds of millions of NBA and NFL fans — interact with sport.

The market is transitioning from a **utilitarian era** (data retrieval) to an **experiential era** (immersion, personalization, integrated commerce). ScoreSpark enters at this inflection point.

### 1.2 The "Twin Screen" Paradigm

The old "second screen" hierarchy has collapsed. For Gen Z and younger demographics, the mobile device is no longer secondary to the TV — it operates as a **twin screen** or often the **primary screen**.

- **80% of Gen Z sports fans** actively use mobile while watching live sports
- **68%** check live stats/scores on mobile during games
- **55%** message friends/groups simultaneously
- **48%** scroll social media (TikTok/X)
- **22%** place in-play bets

**Strategic implication:** ScoreSpark must optimize for **dwell time** — transforming from a check-and-leave utility into a **destination app** — without sacrificing the speed that makes it indispensable.

### 1.3 The Betting Monetization Crisis

The sports app industry's historic reliance on betting affiliate revenue faces existential threat:

- **United Kingdom:** Remote gaming duty expected to **double to 40%** by 2026, with stricter ASA advertising standards curtailing acquisition strategies
- **Brazil:** New federal licensing framework (Law No. 14,790/2023) requires **$5.5M licensing fees** (R$30M) with strict GGR taxation — ending the gray-market affiliate era
- **United States:** Fragmented state-by-state regulation requires sophisticated geofencing and compliance

**This validates ScoreSpark's no-betting-dependency positioning.** While competitors built their economics on betting affiliate revenue, we build on subscriptions, premium data, and community — a more durable model.

### 1.4 The Community Gap

The single biggest insight from competitive analysis: **community and social features are the missing piece.** Every incumbent either ignores social entirely or bolts on generic forums that become ghost towns. FotMob — the best pure soccer app — forces its users to Reddit, Discord, and WhatsApp for community. That's the gap we fill.

---

## 2. Vision & Differentiators

**ScoreSpark** is a premium multi-sport scores, stats, and community app that combines:

- **FotMob's depth** — advanced analytics, visualizations, and data density
- **theScore's speed** — lightning-fast scores with clean, dark-mode-first UI
- **StatMuse's intelligence** — natural language stat queries powered by AI
- **Sleeper's community** — social features and draft tools that keep fans engaged year-round
- **ESPN's breadth** — comprehensive coverage across NBA, NFL, and soccer (800+ leagues)

### Core Differentiators

1. **Context & Community** — our primary moat. Not just data, but narrative and shared experience
2. **Advanced analytics for every sport** — shot charts, pass maps, win probability, EPA, xG — not paywalled
3. **Consensus Draft Projections** — aggregated mock drafts with ScoreSpark's own consensus board (NBA + NFL)
4. **AI-powered stat queries** — "Who has the most 40-point games this season?" answered instantly
5. **Unified multi-sport experience** — one app, consistent UX, deep in every sport
6. **Beautiful data visualization** — charts, maps, and graphs that are genuinely best-in-class
7. **Dwell-time design** — every feature serves the strategic goal of making the app a destination, not a utility

### Target Users

| Persona | Description | % of Users | Monetization Path |
|---------|-------------|------------|-------------------|
| **The "Tactico"** | Data analyst. Demands Opta-level granularity, CSV exports, shot maps | 15% | Scout subscription |
| **The Global Fan** | Follows a major team, often from a different time zone. Needs catch-up features and community | 50% | Ads / Freemium |
| **The Social Fan** | Follows the game for the thrill. Values live reactions, predictions, sharing with friends | 35% | Premium / Affiliate |

**Additional user segments:**
- **Primary:** NBA and NFL fans (18-40) who care about stats beyond box scores
- **Secondary:** Soccer fans who want FotMob-level depth with real community
- **Tertiary:** Fantasy-adjacent users who need a data edge

---

## 3. Competitive Landscape

### 3.1 Soccer Competitors (Deep Dive)

| App | MAU | Primary Moat | Key Strength | Critical Vulnerability |
|-----|-----|-------------|--------------|----------------------|
| **Flashscore** | 155M+ | Speed & Scale | Sub-second latency, 400M+ cumulative downloads, BeSoccer acquisition | "Check-and-leave" utility with dated UX, no community, low dwell time |
| **SofaScore** | 30M+ | Data Depth & Ratings | Player ratings system, Sofascore ratings become cultural currency, deep statistical granularity | Overwhelming interface, heavy betting dependency, data overload for casual fans |
| **OneFootball** | 15M+ | Media Rights (OTT) | Bundesliga streaming deals, editorial content, video highlights | Bloated app (performance complaints), Web3 misadventures eroded trust, expensive content rights model |
| **FotMob** | 10M+ | Clean UX & Speed | Best-in-class mobile UX for soccer, xG visualizations, beautiful Live Activities | **No social features at all** — forces users to Reddit/Discord/WhatsApp. Subscription conversion is low |

**Key insight:** Community is the white space. FotMob has the best UX but zero social. Flashscore has the users but zero engagement depth. SofaScore has the data but overwhelms. OneFootball tried OTT and bloated. None have solved the community problem.

### 3.2 NBA Apps

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **NBA App (Official)** | League Pass integration, official highlights, shot charts, real-time box scores | Clunky UI, heavy League Pass upselling, slow load times, limited advanced stats |
| **ESPN** | Brand trust, broad coverage, Fantasy integration, expert analysis | Jack of all trades — NBA depth mediocre, cluttered UI, aggressive ads |
| **theScore** | Fastest live scores, clean dark UI, excellent notifications | Limited advanced analytics, no shot charts or player tracking |
| **ClutchPoints** | Fan-focused content, injury reports, trade rumors, player grades | More content than stats, can feel spammy, limited data viz |
| **StatMuse** | Natural language stat queries, beautiful stat cards, historical depth | Not a live scores app, no game-day experience |

### 3.3 NFL Apps

| App | Strengths | Weaknesses |
|-----|-----------|------------|
| **NFL App (Official)** | NFL+ streaming, RedZone, Next Gen Stats, fantasy integration | Buggy, aggressive NFL+ upselling, weak fantasy UX |
| **ESPN** | MNF, market-leading Fantasy, expert picks, draft coverage | Broad not deep, cluttered |
| **theScore** | Fast scores, drive charts, clean play-by-play, excellent push notifications | No advanced analytics |
| **Yahoo Sports** | Strong fantasy platform, daily fantasy, watch integration | Dated UI, declining investment |
| **Sleeper** | Best draft room UX, mock drafts, community chat, dynasty leagues | Fantasy-only — no standalone scores/stats |

### 3.4 ScoreSpark vs. Competitors Summary

| Feature | ScoreSpark (Target) | FotMob | SofaScore | Flashscore | OneFootball |
|---------|-------------------|--------|-----------|------------|-------------|
| **Primary Moat** | Context & Community | UX & Speed | Data Depth & Ratings | Speed & Scale | Media Rights |
| **Social Features** | High (Squads, Pulse, Predictions) | Low | Low (Chat) | None | Low |
| **Data Source** | Hybrid (Opta/Sportmonks) | Opta | Sportradar/Internal | Internal (BeSoccer) | Opta |
| **Monetization** | Subs > Ads | Ads > Subs | Betting > Ads | Betting > Ads | Media > Betting |
| **Key Innovation** | AI Commentary, Community Pulse | Clean UI | Player Ratings | Speed | OTT Streaming |
| **Multi-sport** | ✅ Soccer + NBA + NFL | ❌ Soccer only | ⚠️ Multi but soccer-first | ⚠️ Multi but soccer-first | ❌ Soccer only |

---

## 4. Supported Sports & Leagues

### Launch (v1.0)

| Sport | Leagues |
|-------|---------|
| **Basketball** | NBA, WNBA |
| **Football** | NFL |
| **Soccer** | Premier League, La Liga, Serie A, Bundesliga, Ligue 1, MLS, Champions League, Europa League, World Cup + **800+ leagues** via tiered data strategy |

### Post-Launch Expansion

- NCAA Basketball (March Madness)
- NCAA Football (CFB)
- NBA G League
- Liga MX, EFL Championship, Eredivisie
- International friendlies & qualifiers

### Tiered Coverage Strategy

- **Tier 1** (EPL, UCL, La Liga, Bundesliga, Serie A, NBA, NFL): Full Opta/premium data — xG, shot maps, heatmaps, advanced metrics
- **Tier 2/3** (800+ other leagues): Sportmonks/API-Football — live scores, basic stats, lineups. Higher latency tolerance acceptable
- **Redundancy:** Secondary low-cost feed as failover to ensure 99.99% uptime

---

## 5. Core Platform Features

### 5.1 Home Feed — "Today" (AI-Powered Smart Feed)

The landing screen. Shows everything happening now and coming up, **personalized and contextualized**.

- **Live games pinned to top** with real-time scores, clock, and key stat
- **Upcoming games** grouped by league with countdown timers
- **Completed games** with final scores, top performer highlight
- **Personalized order** — favorite teams/leagues float to top; trending "big matches" dynamically inserted based on social chatter and global interest
- **Quick filters:** All | NBA | NFL | Soccer | Favorites
- **"Happening Now" ticker** — injuries, trades, breaking news as a horizontal scrollable strip
- **Score spoiler mode** — hide scores until tapped (for DVR fans)
- **AI "Hype Primer"** — GenAI-generated 1-sentence context for each match (e.g., "Winner takes top spot in La Liga", "Elimination game for the Celtics")
- **"Catch-Up" Mode** for completed matches:
  - Spoiler-free toggle
  - AI-generated 3-bullet narrative summary
  - Key moments timeline with clickable timestamps

### 5.2 Navigation

- **Tab bar:** Today | Scores | Explore | Draft | Profile
- **Scores tab:** Full schedule grid by date, swipeable date picker
- **Explore tab:** Standings, stats leaders, news, trending
- **Draft tab:** (Seasonal) Draft central for NBA/NFL
- **Profile tab:** Favorites, settings, notifications, history

### 5.3 Universal Design Principles

- **Dark mode first** — OLED-optimized blacks, vibrant accent colors per team
- **Team color theming** — game pages, team pages tinted with team's primary color
- **Haptic feedback** on score updates, goal alerts, big plays
- **Buttery animations** — 60fps transitions, spring physics on cards
- **Offline mode** — cached scores, standings, and stats available without connection
- **Pull-to-refresh** everywhere
- **Deep linking** — every game, player, team has a shareable URL

---

## 6. Live Game Experience

The game detail page is the crown jewel. Inspired by FotMob's match page but expanded for all sports.

### 6.1 Game Header

- Teams with logos, current score, game clock/period/quarter/half
- **Live Activity integration** — updates on Lock Screen and Dynamic Island
- Venue, broadcast info, attendance
- **Win probability indicator** — real-time percentage bar between the two teams
- Quick-tap to add to favorites or set notification preferences

### 6.2 Universal Game Tabs

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

### 6.3 Game Flow / Momentum Graph

Inspired by FotMob's momentum graph:

- **NBA:** Point differential over time, showing runs and lead changes. X-axis = game clock, Y-axis = point differential. Color-coded by which team is on top.
- **NFL:** Expected Points Added (EPA) cumulative graph per drive. Shows offensive momentum swings.
- **Soccer:** Pressure/possession momentum graph minute-by-minute (5-min block Pressure Index). xG timeline showing when big chances occurred.

### 6.4 Win Probability Chart

Real-time win probability line graph:
- Updates on every play/possession
- Key plays annotated on the graph (3-pointer to tie, pick-6, red card)
- Pre-game probabilities shown as starting point
- Shareable as an image

### 6.5 Live Commentary / Key Events Timeline

- Vertical scrolling timeline with icons for each event type
- **NBA:** Baskets, blocks, steals, timeouts, substitutions, technicals, challenges
- **NFL:** Plays with yard gains, penalties, turnovers, scores, challenges, injuries
- **Soccer:** Goals, cards, substitutions, VAR decisions, corners, free kicks
- Tap any event to see detail (shot chart location, play diagram, etc.)
- **AI Generative Commentary** — LLM-powered contextual commentary with adjustable tone (casual ↔ analytical), auto-translated for global audiences

### 6.6 "Pulse" Live Reactions

During live matches, users can tap emoji reactions (🔥, 💩, 👏, 😱) that float over the match header — providing a sense of community presence and shared emotion without the toxicity of text chat.

---

## 7. NBA-Specific Features

### 7.1 Shot Charts

Per-player and per-team shot charts on a half-court diagram:

- **Made/missed markers** color-coded (green/red)
- **Zone efficiency overlay** — court divided into zones with FG% heat coloring
- **Filter by:** quarter, shot type (2PT/3PT/FT), made/missed, assisted/unassisted
- **Season shot charts** — accumulated over the season with density visualization
- **Comparison mode** — overlay two players' shot charts
- **League-average comparison** — show zones above/below league average FG%

### 7.2 Player Tracking / Advanced Stats

Sourced from NBA's tracking data:

- **Speed & distance** covered per game
- **Touches, time of possession**
- **Closest defender distance** on shots
- **Catch-and-shoot vs pull-up** shooting splits
- **Drives, post-ups, isolation** play-type breakdowns
- **Rebounding chances** (contested vs uncontested)
- **Hustle stats** — deflections, loose balls, charges drawn, screen assists

### 7.3 Lineup Analysis

- **5-man lineup stats** — Net Rating, pace, minutes together
- **On/off court impact** — team stats with player on vs off
- **Plus/minus visualization** — game-level +/- timeline per player
- **Rotation chart** — visual timeline showing who was on court each minute

### 7.4 Play-by-Play Enhanced

- Each play shows: scorer, assister, shot type, distance, shot clock
- **Shot location dot** next to each scoring play
- **Run tracker** — highlight scoring runs (e.g., "12-0 run over 3:24")
- Filter by: scoring plays only, turnovers, fouls

### 7.5 NBA-Specific Stats

- **Traditional:** PTS, REB, AST, STL, BLK, TO, FG%, 3P%, FT%
- **Advanced:** PER, TS%, eFG%, USG%, AST%, TOV%, DRTG, ORTG, BPM, VORP, WS, WS/48
- **Per-game, per-36, per-100 possessions** toggle
- **Clutch stats** — performance in last 5 min of games within 5 points
- **Splits:** Home/Away, vs Conference, monthly, day of week, rest days

### 7.6 Trade Machine / Deadline Tracker

- **Trade deadline countdown** with rumor aggregation
- **Trade tracker** — completed trades with salary details
- **Salary cap impact** visualization
- **Before/after team ratings** for completed trades

---

## 8. NFL-Specific Features

### 8.1 Drive Charts

Visual drive summaries:

- **Field position diagram** showing start → end of each drive
- Color-coded by result: TD (green), FG (yellow), punt (gray), turnover (red)
- Tap to expand into play-by-play for that drive
- **Red zone efficiency** tracked per team

### 8.2 Play-by-Play Enhanced

- **Down & distance** with field position marker
- **EPA per play** shown inline
- **Pass chart** — where on the field each pass was targeted (air yards diagram)
- **Personnel packages** — 11, 12, 21, etc. noted when available
- Filter by: team, down, play type (run/pass), scoring drives only

### 8.3 Passing Charts & Target Maps

- **Target distribution** — where a QB throws (short left, deep middle, etc.) with completion % per zone
- **Receiver target share** — pie chart of team targets
- **Air yards vs YAC** breakdown per receiver
- **Pressure rate** — how often QB is pressured, stats under pressure vs clean pocket

### 8.4 NFL Advanced Stats

- **Passing:** ANY/A, EPA/play, CPOE, air yards, passer rating
- **Rushing:** EPA/rush, yards before/after contact, broken tackles, stuff rate
- **Receiving:** target share, separation, catch rate, YAC/reception, contested catch rate
- **Defense:** EPA/play allowed, pressure rate, coverage stats, missed tackle rate
- **Special Teams:** return averages, punt hang time, FG accuracy by distance
- **Team:** DVOA-style efficiency ratings, strength of schedule

### 8.5 Game Script Analysis

- **Score differential over time** — graph showing how the game unfolded
- **Pass/run ratio** by game script (when leading, trailing, close)
- **Play-action rate and success**
- **Situational efficiency:** 3rd down, red zone, goal-to-go, 2-minute drill

### 8.6 Weekly Power Rankings

- **ScoreSpark composite** — aggregate of multiple outlets' power rankings
- Week-over-week movement arrows
- Key stats backing each ranking
- User voting / community rankings comparison

### 8.7 Injury Reports

- **Practice participation** tracker (DNP, Limited, Full)
- Wednesday → Thursday → Friday progression tracking
- Game-day inactive list
- IR tracker with expected return timelines
- Impact analysis — how team performs without key player

---

## 9. Soccer-Specific Features

Mirror FotMob's best features with ScoreSpark's visual style and community layer:

### 9.1 Match Stats & Visualizations

- **xG (Expected Goals)** — per shot, cumulative, per team
- **Shot map** — every shot plotted on pitch with xG value and outcome
- **Heat maps** — per player touch density on pitch
- **Pass maps** — completed/incomplete passes with direction arrows
- **Average positions** — where each player operated on the pitch
- **Defensive actions map** — tackles, interceptions, clearances plotted

### 9.2 Tactical Features

- **Formation visualization** — starting XI shown in tactical formation
- **Formation changes** tracked during match
- **Pressing intensity** metrics
- **Progressive passes/carries** highlighted
- **Set piece analysis** — corner delivery zones, free kick positions

### 9.3 Player Ratings

- **Match rating (1-10)** based on statistical performance model
- **Key stats driving the rating** shown as supporting evidence
- **Season average rating** tracked over time
- **Best XI** — automatically generated best lineup of the matchweek

### 9.4 Transfer Window

- **Transfer news feed** — rumors and confirmed deals
- **Transfer tracker** — all completed transfers by league
- **Fee visualization** — biggest transfers ranked
- **Player linked to clubs** — rumor aggregation per player

### 9.5 Standings Enhanced

- **Form guide** — last 5/10 results shown as W/D/L bubbles
- **xG table** — standings based on expected goals
- **Home/Away splits**
- **Points per game trend** — mini sparkline per team
- **Relegation/promotion/European places** color-coded

---

## 10. Draft Central

**The killer feature that no single app does comprehensively.** Available for both **NBA and NFL** drafts.

### 10.1 Consensus Big Board

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

### 10.2 Mock Draft Simulator

- **Pick-by-pick mock draft** — ScoreSpark's consensus projection for every pick
- **Trade probability** — likelihood a team trades up/down based on historical data + rumors
- **User mock draft** — build your own, compare against consensus
- **Community mock** — crowdsourced pick-by-pick

### 10.3 Prospect Profiles

- **Scouting report** — strengths, weaknesses, pro comparison, ceiling/floor
- **Stats** — college/international stats, per-game, advanced
- **Measurements** — combine results, pro day numbers
- **Highlights** — embedded video clips
- **Draft stock chart** — how their ranking has changed over the season
- **Mock draft history** — where each outlet has projected them over time

### 10.4 Team Draft Pages

- **Team needs analysis** — ranked positional needs with explanation
- **Draft capital** — all picks owned (including acquired/traded)
- **Roster context** — current depth chart with contract status
- **Best fits** — prospects that match team needs and scheme
- **Draft history** — past picks with hit/miss grades

### 10.5 Draft Night Live

- **Real-time pick tracker** — as picks happen, instant update
- **Consensus vs actual** comparison — did the pick match projections?
- **Trade tracker** — draft-night trades with pick swap details
- **Instant analysis** — AI-generated pick grades and fit analysis
- **Live community reactions** — chat/reactions per pick

### 10.6 Post-Draft

- **Draft grades** — aggregated from analysts + ScoreSpark's own
- **Team-by-team breakdown** with haul analysis
- **Redraft projections** — after rookie season, where would they have gone?

---

## 11. Player Profiles & Stats

### 11.1 Profile Header

- Player photo, team logo, jersey number, position
- **Key bio:** age, height, weight, experience, draft pick, college/country
- **Contract info:** current salary, years remaining, cap hit
- **Season stat line** — the 3-4 most important stats prominently displayed
- **Follow button** — add to favorites for notifications

### 11.2 Stats Dashboard

- **Season stats** — current season, all standard + advanced
- **Career stats** — year-by-year table, career totals and averages
- **Game log** — every game this season with full stat line, sortable
- **Splits:** Home/Away, by opponent, by month, pre/post All-Star, rest days, wins/losses
- **Rankings** — where player ranks league-wide in each stat category
- **Percentile chart** — radar/spider chart showing percentile rank in key stats vs position (Player Radars — benchmark against peers over last 365 days)

### 11.3 Visualizations

- **NBA:** Season shot chart, scoring by quarter, usage rate trend
- **NFL:** Passing chart (season), target heatmap, EPA trend by week
- **Soccer:** Heat map (season), pass map, progressive actions chart

### 11.4 Comparison Tool

- **Side-by-side player comparison** — select any two players
- Stat tables with leader highlighted
- Radar chart overlay
- Historical comparison — compare peak seasons across eras
- **"vs" page** when two players face each other — head-to-head history

### 11.5 Player News

- Aggregated news/tweets about the player
- Injury updates
- Fantasy-relevant updates
- Trade rumors (if applicable)

---

## 12. Team Hub

### 12.1 Team Header

- Logo, record, conference/division rank, streak
- **Next game** countdown with opponent and broadcast info
- **Season grade** — ScoreSpark's overall team rating (A+ through F)

### 12.2 Team Tabs

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

### 12.3 Team Stats Visualizations

- **Offensive vs Defensive rating** scatter plot (NBA)
- **EPA per play** offense vs defense scatter (NFL)
- **xG for vs xG against** scatter (Soccer)
- Season trend lines for key metrics
- League rank badges (Top 5, Bottom 5, etc.)

---

## 13. Standings & Playoffs

### 13.1 Standings

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

### 13.2 Playoff Bracket

- **Visual bracket** — interactive, tappable
- Series scores (NBA) / single game results (NFL) / aggregate (Soccer UCL)
- Upcoming game schedule within series
- **Historical brackets** — past seasons browsable

---

## 14. News & Content

### 14.1 News Feed

- **Aggregated from** top sources (The Athletic, ESPN, Bleacher Report, team reporters)
- Filterable by: sport, team, topic (trades, injuries, analysis, rumors)
- **Breaking news** badges with push notification integration
- Save/bookmark articles

### 14.2 Video Highlights

- **Embedded highlights** — key plays, game recaps
- Auto-playing in feed with mute toggle
- Full game highlight packages (2-5 min recaps)
- Individual play clips
- **"Simulated Reality" visualizations** — 2D pitch/court animations reconstructing key plays from data points (circumvents video rights restrictions while providing visual context)

### 14.3 ScoreSpark Originals (Future)

- Weekly power rankings articles
- Draft analysis pieces
- Stat-driven stories ("The 5 Most Clutch Players This Season")
- AI-generated game recaps
- Auto-generated "Match Result" graphics designed to look highly professional (à la Bleacher Report) — optimized for social sharing to drive organic acquisition

---

## 15. Social & Community

> **Design principle:** Social must be **additive, not intrusive**. It enhances the primary journey (checking scores/stats) without interrupting it. This is how we avoid the "ghost town" problem.

### 15.1 "Squads" — Private Prediction Leagues

- **Create private groups** where friends predict scores and compete
- Automated scoring system with leaderboards
- **Referral loop:** "Invite 3 friends to a Prediction League, get 1 month Premium free"
- Persistent across the season — drives retention on non-match days

### 15.2 Game Chat & "Pulse" Reactions

- **Per-game chat room** — real-time during live games
- **"Pulse" Reactions** — tap emoji reactions (🔥, 💩, 👏, 😱) that float over the match header, providing shared emotion without text-chat toxicity
- Reactions (emoji, GIF) on messages
- **Automated bot posts** for scoring plays/big moments
- Upvote/downvote for quality control
- Mute/block users
- **AI text moderation** to prevent toxicity and ensure brand-safe environment

### 15.3 Micro-Predictions (In-Match Gamification)

- Real-time micro-event predictions: "Will this penalty be scored?", "Who scores next?", "Over/under 2.5 corners this half?"
- Keeps users engaged throughout the full 90 minutes / 48 minutes / 60 minutes
- Increases dwell time and creates social competition

### 15.4 The Streak Mechanic ("Duolingo Effect")

- **"Days Following Football" streak** — maintain by opening the app, reading an article, or checking a score
- Drives DAU on non-match days through psychological cost of breaking the streak
- Visual streak counter on profile

### 15.5 User Polls

- Quick community polls on game pages ("Who wins tonight?", "MVP of the game?")
- Results shown as live-updating bar charts

### 15.6 Share Cards

- **Beautiful shareable stat cards** — auto-generated images for any stat, comparison, or game result
- Optimized for Instagram Stories, Twitter/X, iMessage, WhatsApp
- ScoreSpark watermark/branding with deep link back to the app
- **BetSlip-style prediction cards** — one-tap generation of visual prediction images for social sharing

### 15.7 Vertical Video Feeds (Future)

- TikTok-style feed per match for user/creator short-form video reactions, tactical breakdowns, fan chants
- Aligns with twin-screen behavior where fans naturally scroll during lulls in play

---

## 16. Personalization & Favorites

### 16.1 Favorite Teams

- Follow unlimited teams across all sports
- Favorite teams appear first everywhere
- Team-colored accents throughout the app when viewing their content
- **One-tap follow** during onboarding

### 16.2 Favorite Players

- Follow individual players
- Player news and stat updates in personalized feed
- Game alerts when they're playing

### 16.3 Favorite Leagues

- Prioritize which leagues appear in scores/standings
- Hide leagues you don't care about

### 16.4 Onboarding Flow

1. Select sports you follow
2. Pick favorite teams (smart suggestions by location)
3. Pick favorite players (suggested from chosen teams)
4. Notification preferences
5. Widget setup prompt

---

## 17. Notifications & Alerts

### 17.1 Customizable Per Team

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

### 17.2 Global Alerts

- **Trade alerts** — any trade across the league
- **Draft alerts** — pick-by-pick during draft night
- **Upset alerts** — when a major upset is in progress
- **Milestone alerts** — player approaching record/milestone

### 17.3 Quiet Hours

- Set times when notifications are silenced
- Game-day override option

### 17.4 Notification Center

- In-app notification history
- Tappable — each notification deep-links to relevant content

---

## 18. Widgets & Live Activities

### 18.1 Home Screen Widgets

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

### 18.2 Live Activities

- **Triggered automatically** when a followed team's game starts
- **Dynamic Island (compact):** Score + clock
- **Dynamic Island (expanded):** Score + clock + last event + top scorer
- **Lock Screen banner:** Full game state — score, clock, key stats
- **Updates on:** Every score, quarter/half changes, final
- User can start/stop Live Activity from game page

### 18.3 StandBy Mode

- Optimized widget display for StandBy mode (iPhone on charger)
- Larger, glanceable scoreboard

### 18.4 Apple Watch (Future)

- Complications for live scores
- Game alerts on wrist
- Quick glance at standings

---

## 19. Search & AI Query Engine

**Inspired by StatMuse — the most unique feature in ScoreSpark.**

### 19.1 Natural Language Search

Users type or speak questions in plain English:

**Examples:**
- "Who leads the NBA in assists?"
- "How did the Chiefs do in the red zone last week?"
- "Liverpool's record against Man City in the last 5 years"
- "Which QB has the highest EPA per play this season?"
- "Jokic vs Embiid stats this season"
- "Top 10 scorers under 25 in the NBA"
- "What's the longest winning streak in NFL history?"

### 19.2 Response Format

- **Stat card** — beautifully formatted answer with the data
- **Supporting context** — additional stats that add context
- **Visualizations** — auto-generated charts where relevant
- **Shareable** — every answer is a shareable image card

### 19.3 Search UX

- **Search bar** accessible from every screen (pull down)
- **Trending queries** — what other fans are searching
- **Recent searches** saved
- **Autocomplete** with smart suggestions
- **Voice input** supported

### 19.4 Traditional Search

- Search for: players, teams, games, articles
- Instant results with preview cards
- Recent/trending searches

---

## 20. Fantasy & Betting Adjacent

**ScoreSpark is NOT a fantasy app or sportsbook.** But it provides data tools that fantasy and betting users love. Our no-betting-dependency model is a strategic advantage as regulatory headwinds crush competitors' economics.

### 20.1 Fantasy-Relevant Data

- **Projected stats** — per game projections for key categories
- **Ownership %** in major DFS platforms
- **Red/green flags** — matchup analysis for fantasy relevance
- **Start/Sit tool** — compare two players' matchup outlook
- **Waiver wire highlights** — trending players with breakout potential

### 20.2 Odds & Lines

- **Pre-game odds** from multiple sportsbooks
- **Live odds** updating during game
- **Line movement tracker** — how odds have shifted since opening
- **Spread, moneyline, over/under** displayed
- **Player props** — major player prop lines shown on player pages
- **Contextual integration** — data-driven prompts (e.g., "Haaland has 5 shots on target. Odds for him to score next: +150") rather than generic "Bet Now" buttons
- **Geofencing compliance** — dynamic localization of betting content based on jurisdiction (legal states see DraftKings, UK sees SkyBet, restricted states see fantasy alternatives like PrizePicks)
- **No direct betting integration** — ScoreSpark provides info only

### 20.3 Trends & Edges

- **ATS records** (against the spread) for teams
- **Over/under trends** — how often a team goes over
- **Situational trends** — "Team X is 8-2 ATS as home underdogs"
- **Rest advantage analysis** — back-to-backs, short weeks, bye weeks

---

## 21. Accessibility & Settings

### 21.1 Accessibility

- Full VoiceOver support
- Dynamic Type support (all text scales)
- Reduce Motion option (disables animations)
- High contrast mode
- Color blind-friendly palettes for all visualizations

### 21.2 Settings

- **Appearance:** Dark / Light / System
- **Spoiler mode:** Hide/show scores globally
- **Date format:** US / International
- **Time format:** 12h / 24h
- **Temperature:** °F / °C (for weather in game info)
- **Stat format:** Per game / Per 36 / Per 100 (default for NBA)
- **Data usage:** High quality / Data saver (reduce image/video loading)
- **Cache management:** Clear cached data
- **AI Commentary tone:** Casual ↔ Analytical (adjustable)

### 21.3 Privacy Center

- **Granular opt-in** for AI personalization data processing (GDPR/CCPA compliant)
- Transparency as a brand asset — "we use data to enhance your experience, not sell it"
- Sign up via Apple ID, Google, or email
- Favorites, preferences, and notification settings sync across devices
- Export data (GDPR compliance)
- Delete account option

---

## 22. Technical Architecture

### 22.1 Platform

- **iOS 17+** (required for Live Activities, StandBy, latest widget APIs)
- **SwiftUI** primary UI framework
- **Swift 6** with strict concurrency
- **Minimum device:** iPhone 12

### 22.2 Data Sources — Hybrid Strategy

| Tier | Leagues | Provider | Rationale |
|------|---------|----------|-----------|
| **Tier 1** | EPL, UCL, La Liga, Bundesliga, Serie A, NBA, NFL | Opta (Stats Perform) / Official APIs | Maximum accuracy, xG/xA, shot maps, heatmaps. "Powered by Opta" brand equity. Cost: $20K-$50K/mo |
| **Tier 2/3** | 800+ other leagues | Sportmonks / API-Football | Cost-efficient, modular pricing, acceptable latency for long-tail leagues |
| **Redundancy** | All | API-Football (failover) | Automatic failover if primary feed lags >5s. Ensures 99.99% uptime |
| **Draft projections** | NBA/NFL | Web scraping + manual curation | Mock drafts from 15+ outlets |
| **News** | All | RSS feeds, NewsAPI, official team feeds | Aggregation layer |
| **Odds** | All | The Odds API, sportsbook APIs | With geofencing compliance |

**Data Normalization Layer:** Golang-based middleware normalizing all providers into ScoreSpark Standard Format (SSF) — single internal schema regardless of source.

### 22.3 Split-Protocol Real-Time Architecture

| Channel | Protocol | Rationale |
|---------|----------|-----------|
| **Live scores, clocks, commentary** | Server-Sent Events (SSE) | One-way server→client. Lower battery usage, lower AWS cost for 1M+ concurrent listeners vs WebSockets |
| **Social features (chat, Pulse, predictions)** | WebSockets (Socket.io) | Bi-directional communication required for user input |

This split ensures the core utility remains performant and cost-effective at scale, while interactive features get the bi-directional channel they need.

### 22.4 Backend Stack

- **Database:** PostgreSQL (user data, relational) + TimescaleDB (match events, time-series data)
- **Cache:** Redis Cluster — critical for "Live" endpoints to prevent DB thrashing during peak traffic
- **API Gateway:** Kong or AWS API Gateway for rate limiting, auth, monetization management
- **AI engine:** OpenAI API or Claude API for natural language stat queries + generative commentary
- **CDN:** CloudFront for static assets and images
- **Push notifications:** APNs with Firebase Cloud Messaging backend

### 22.5 iOS Architecture

- **MVVM + Clean Architecture** with SwiftUI
- **Local persistence:** SwiftData for favorites/settings, CoreData for cached stats
- **Networking:** async/await with URLSession, SSE for live data, WebSocket for social
- **Image caching:** Kingfisher or Nuke
- **Charts:** Swift Charts framework + custom Canvas renderers for shot charts, heat maps

### 22.6 Performance Targets

| Metric | Target |
|--------|--------|
| App launch | < 1.5s cold start |
| Score update latency | < 5s from real-world event (sub-second for Tier 1 with Opta) |
| Search response | < 1s traditional, < 3s AI queries |
| Widget refresh | Every 5-15 min (iOS limit), Live Activities real-time |
| Offline availability | Core data within 24h of last sync |
| App size | < 80MB download |
| Uptime | 99.99% (redundant data feeds) |

### 22.7 Risk Management

- **Latency Health Check:** Auto-switches to backup provider if primary feed lags >5 seconds
- **Betting Compliance:** GeoComply SDK integration for jurisdiction-aware content
- **Video Rights:** No unlicensed video hosting — deep link to official sources or use Simulated Reality visualizations
- **Trademark:** ScoreSpark USA LLC owns the trademark — no naming conflict ✅

---

## 23. Monetization Strategy

### 23.1 Revenue Philosophy

Subscriptions-first, not betting-first. As competitors face the betting monetization crisis, our diversified model becomes a strategic moat.

**Projected Revenue (Year 3):**

| Stream | Amount | Share | Drivers |
|--------|--------|-------|---------|
| Premium Subscriptions | $18.0M | 67% | Advanced analytics, ad-free, Scout tools |
| Advertising (Programmatic) | $6.0M | 22% | Free tier users, high-volume traffic |
| Affiliate (Betting/Merch) | $3.0M | 11% | Smart contextual prompts, licensed partners only |
| **Total** | **$27.0M** | **100%** | Diversified, resilient model |

### 23.2 Free Tier

Everything in this spec is free except:

- Some AI query volume limits (e.g., 20 AI queries/day)
- Basic widgets (1-2 styles)
- Ads restricted to header/footer only — **never on live game pages during active games**, never video ads that interrupt experience

### 23.3 ScoreSpark Pro ($4.99/month or $39.99/year)

- **Unlimited AI queries**
- **All widget styles** including custom team widgets
- **Ad-free experience**
- **Priority data delivery** (faster SSE connection)
- **Live Activities on Lock Screen**
- **Advanced comparison tools** (multi-player, historical)
- **Export stats** to CSV
- **Priority notifications** (faster delivery)
- **Exclusive Pro badge** in community features
- **Custom themes** beyond dark/light
- **Apple Watch app**

### 23.4 ScoreSpark Scout ($14.99/month) — Future

- Everything in Pro
- **Rate-limited API access** (100 calls/day)
- **Deep scouting tools** — advanced player comparison radars, historical xG trend lines
- **CSV export** of any dataset
- **"Manager Mode"** tactical analysis tools
- Targeted at the "Tactico" persona and semi-professional football analysts/content creators

### 23.5 Growth Loops

- **Referral:** "Invite 3 friends to a Prediction League, get 1 month Premium free"
- **Social sharing:** Auto-generated match result graphics and stat cards designed for virality
- **Streak mechanic:** Drives daily opens even on non-match days

---

## 24. MVP Phasing

### Phase 1: Foundation (Weeks 1-8)

- [ ] Core app shell: navigation, theming, dark mode
- [ ] Live scores for NBA, NFL (in-season sport priority)
- [ ] Game detail pages: summary, box score, play-by-play
- [ ] Basic standings
- [ ] Team and player pages (basic stats)
- [ ] Favorites system
- [ ] Push notifications (game start, final score)
- [ ] Home feed (Smart Feed with personalization)

### Phase 2: Depth (Weeks 9-16)

- [ ] Advanced stats (NBA shot charts, NFL passing charts)
- [ ] Win probability graphs
- [ ] Game momentum/flow charts
- [ ] Player comparison tool (with radar charts)
- [ ] Widgets (small + medium)
- [ ] Live Activities
- [ ] Enhanced notifications (customizable)
- [ ] News feed integration
- [ ] "Catch-Up" mode with AI summaries

### Phase 3: Draft & Intelligence (Weeks 17-24)

- [ ] Draft Central: consensus big board, prospect profiles (NBA + NFL)
- [ ] Mock draft simulator
- [ ] Team needs analysis
- [ ] AI-powered natural language search
- [ ] Share cards
- [ ] Soccer support (scores, xG, shot maps, 800+ leagues via tiered data)

### Phase 4: Community & Polish (Weeks 25-32)

- [ ] Game chat with "Pulse" reactions
- [ ] "Squads" prediction leagues
- [ ] Streak mechanic
- [ ] Micro-predictions (in-match gamification)
- [ ] Fantasy-adjacent tools
- [ ] Odds integration with geofencing
- [ ] Large widgets, Lock Screen widgets
- [ ] ScoreSpark Pro subscription
- [ ] Performance optimization pass

### Phase 5: Scale (Post-Launch)

- [ ] Apple Watch app
- [ ] Scout tier subscription
- [ ] NCAA Basketball & Football
- [ ] Vertical video feeds / creator content
- [ ] AI generative commentary
- [ ] Android app
- [ ] Web companion
- [ ] ScoreSpark Originals content
- [ ] API for third-party integrations

---

## 25. Appendices

### Appendix A: Feature Priority Matrix

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
| AI Smart Feed / Catch-Up | 🟡 High | Medium | P1 |
| Draft consensus board | 🟡 High | High | P2 |
| AI search engine | 🟡 High | High | P2 |
| Soccer support (800+ leagues) | 🟡 High | High | P2 |
| Squads / Prediction Leagues | 🟡 High | Medium | P2 |
| Game chat / Pulse reactions | 🟢 Medium | High | P3 |
| Streak mechanic | 🟢 Medium | Low | P3 |
| Micro-predictions | 🟢 Medium | Medium | P3 |
| Fantasy tools | 🟢 Medium | Medium | P3 |
| Odds/betting data | 🟢 Medium | Low | P3 |
| Mock draft simulator | 🟢 Medium | High | P3 |
| Scout tier / API access | 🟢 Medium | Medium | P4 |
| Apple Watch | 🔵 Low | Medium | P4 |
| Vertical video feeds | 🔵 Low | High | P4 |

### Appendix B: Key Metrics / KPIs

| Metric | Target (6 months post-launch) |
|--------|-------------------------------|
| DAU | 50,000 |
| **Average session length** | **> 5 min** (dwell time strategy) |
| Sessions per user per day | > 2.5 during game days |
| Push notification opt-in | > 70% |
| Widget adoption | > 40% of users |
| Live Activity engagement | > 60% during live games |
| Pro conversion rate | > 5% of MAU |
| App Store rating | > 4.7 |
| Retention (D7) | > 45% |
| Retention (D30) | > 25% |
| Prediction League participation | > 20% of MAU |
| Streak retention (7+ day streaks) | > 15% of DAU |

### Appendix C: Works Cited (from PRD)

1. Precedence Research — Sport App Market Size ($13.22B by 2034)
2. iGamingToday — Flashscore hits 155M MAU
3. Dolby OptiView — Top 5 Trends in Live Sports 2025
4. iGaming Business — UK remote gaming duty reforms
5. GR8 Tech — Brazil betting regulation (Law No. 14,790/2023)
6. SofaScore Corporate — About Us
7. DFL — Bundesliga OTT with OneFootball
8-27. See full PRD for complete bibliography.

---

*This document is the single source of truth for ScoreSpark's feature set, market positioning, and technical strategy. All design and engineering decisions should reference this spec. Update as features are refined during development.*

*ScoreSpark USA LLC · Last updated: 2026-02-13*
