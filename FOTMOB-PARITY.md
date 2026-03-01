# FotMob Feature Parity Spec

## Goal
Mirror every FotMob page, flow, and feature in ScoreSpark.

## Pages to Mirror

### 1. Homepage / Scores Page
FotMob has:
- [x] Top leagues sidebar (Premier League, Champions League, LaLiga, etc.) with follow buttons
- [ ] Date navigation (yesterday / today / tomorrow)
- [ ] Filter buttons: Ongoing, On TV, By time
- [ ] Search/filter text input
- [x] Matches grouped by league (league header with link + expand/collapse)
- [x] Match rows: Team names, score/time, FT badge
- [ ] Follow button per match
- [ ] "Hide all" button for leagues
- [ ] News section at bottom with articles
- [ ] League standings carousel at bottom (EPL, LaLiga, etc.)
- [ ] "Build your own XI" promo

### 2. Match Detail Page
FotMob has:
- [x] Match header: teams, score, status, competition link
- [ ] Match metadata: date/time, venue (with Google Maps link), referee
- [x] Goal scorers with minute + player links
- [ ] **Tabs: Facts, Commentary, Lineup, Table, Stats, Head-to-Head** (we have similar but need parity)
- [ ] **Momentum graph** (SVG timeline showing match momentum)
- [ ] **Top stats** with bar chart (Ball possession, xG, Total shots, Big chances)
- [ ] **"All stats" button** linking to full stats view
- [ ] **Events timeline** (goals, cards, subs with minute markers, HT/FT dividers)
- [ ] **Lineup pitch view** with player ratings (7.8, 6.5, etc.)
- [ ] **Team ratings** (overall team rating number)
- [ ] **Sub-buttons on lineup:** Season stats, Transfer value, Age, Country
- [ ] **Coach section** with coach name + link
- [ ] **Substitutes list** with sub time and rating
- [ ] **Bench / Injured & suspended** expandable section
- [ ] **Team form** section (last 5 matches for each team)
- [ ] **Next match** for both teams
- [ ] **Official highlights** embed (YouTube video)
- [ ] **Venue info** card: stadium name, capacity, surface, weather, Google Maps link
- [ ] **Round context** — all matches in the same round
- [ ] **Insights** — AI-generated match narrative bullets
- [ ] **"Who will win?" poll** — fan voting with percentages
- [ ] **"About the match"** SEO section with detailed text
- [x] Team name links to team page
- [x] Player name links (in lineups)

### 3. Team Overview Page
FotMob has:
- [ ] Team header: badge, name, country link, sync-to-calendar, follow
- [ ] **Tabs: Overview, Table, Fixtures, Squad, Stats, Transfers, History, News**
- [ ] **Team form** (last 5 results as W/D/L dots with score links)
- [ ] **Next match** with competition and time
- [ ] **Daily Summary** — AI-generated bullets about recent events
- [ ] **Full standings table** with form columns (W/D/L dots) and next match
- [ ] **Coach win percentage chart** (historical by season)
- [ ] **Top rated / Top scorers / Top assists** player cards with ratings
- [ ] **News feed** with articles
- [ ] **"About" section** with AI-generated detailed text
- [ ] **Season stats starting XI** — pitch view with player ratings/stats
- [ ] **Fixture difficulty** — color-coded next 5 matches
- [ ] **Upcoming fixtures list**
- [ ] **Stadium card** — name, location, capacity, opened, surface

### 4. League Page (Not yet captured but needed)
- League overview with standings
- Top scorers
- Form table
- Fixtures by matchday
- Stats

### 5. Player Page
- [ ] Player header: photo, name, team, position, nationality, age
- [ ] Season stats (goals, assists, appearances, rating)
- [ ] Match-by-match rating history
- [ ] Career history
- [ ] Transfer history

## Priority Order
1. Match Detail — momentum, xG, player ratings, events timeline, venue card
2. Homepage — date navigation, league grouping improvements, news
3. Team page — full tabs, form, AI summary, coach history, fixture difficulty
4. League page — full implementation
5. Player page — full implementation

## Technical Notes
- Momentum graph: SVG or canvas-based, minute-by-minute
- xG data: Available from ESPN summary API
- Player ratings: Generate from match stats (minutes, goals, assists, cards)
- Weather: wttr.in API for venue weather
- Google Maps: Link format `https://www.google.com/maps/search/{lat},{lng}`
