# ScoreSpark — Master Project Log

**Last updated:** February 25, 2026  
**Repo:** github.com/ziggyassist-arch/ScoreSpark  
**Stack:** Next.js 15 (web), SwiftUI/iOS 18 (mobile), ESPN API + football-data.org  
**Vercel:** scorespark.vercel.app  

---

## ✅ COMPLETED

### Infrastructure & Setup
- [x] Next.js 15 web app with App Router
- [x] SwiftUI iOS app (bundle: com.scorespark.app)
- [x] GitHub repo (ziggyassist-arch/ScoreSpark), auto-push on commits
- [x] Vercel deployment with SSO protection disabled for public access
- [x] football-data.org API key configured (.env.local)
- [x] ESPN API integration (free, no key needed)
- [x] `.gitignore` for iOS build artifacts

### Branding & Logo
- [x] Score(white) ⚡(gold #F5C518) Spark(light blue #9DCAED) wordmark — web + iOS
- [x] Brand colors: Navy #2E3460, Gold #F5C518, Light Blue #9DCAED, White #FFFFFF
- [x] App icon: 1024x1024 square (gold bolt on navy)
- [x] Favicon: Option B — gold bolt on navy square
- [x] Logo links to /scores (not landing page)

### Soccer — 60+ Leagues (from 19)
- [x] **Top 5:** Premier League, La Liga, Bundesliga, Serie A, Ligue 1
- [x] **European cups:** Champions League, Europa League
- [x] **Other Europe:** Eredivisie, Primeira Liga, Scottish, Turkish, Belgian, Austrian, Swiss, Greek, Czech, Danish, Norwegian, Swedish, Finnish, Romanian, Russian, Israeli, Cypriot
- [x] **Second divisions:** Championship, La Liga 2, 2. Bundesliga, Serie B, Ligue 2
- [x] **Domestic cups:** FA Cup, EFL Cup, Copa del Rey, DFB-Pokal, Coppa Italia, Coupe de France
- [x] **Americas:** MLS, Liga MX, Brasileirão, Argentine, Colombian, Chilean, Peruvian, Uruguayan, Ecuadorian, Paraguayan
- [x] **Asia:** J1 League, Saudi Pro League, Indian Super League, Chinese Super League, A-League, Thai League, Indonesian Liga 1, Malaysian Super League, S.League (Singapore)
- [x] **Africa:** Nigerian NPFL, Ghanaian Premier League, Kenyan Premier League
- [x] **Women's:** NWSL, WSL, USL Championship
- [x] Raw competition code aliases (PD→La Liga, PL→EPL, etc.)
- [x] Regional grouping in league selector (web)
- [x] All leagues wired to real standings data via ESPN

### Soccer Features
- [x] Live scores with date picker (past dates with real API data)
- [x] Match detail page with stats
- [x] FotMob-style lineup/formation diagrams (full pitch)
- [x] Post-match player ratings on formation view
- [x] Live commentary (minute-by-minute match events)
- [x] League standings with team logos, form guide badges (W/D/L)
- [x] League top scorers + assists (side-by-side redesign)
- [x] Team pages
- [x] Predicted lineups for upcoming matches
- [x] Transfer news section (RSS aggregation)
- [x] News filtering (verified: soccer news only, no cross-sport contamination)

### NBA Features
- [x] Live scores + date picker
- [x] Match detail with box scores
- [x] Play-by-play
- [x] Standings (Eastern + Western conferences)
- [x] Stats leaders
- [x] Injury reports
- [x] Playoff bracket
- [x] Power rankings
- [x] Fantasy-relevant stats with position filters
- [x] Transaction tracker

### NFL Features
- [x] Scores + standings (AFC + NFC)
- [x] Match detail
- [x] Depth charts
- [x] Injury reports
- [x] Playoff bracket
- [x] Mock draft
- [x] Power rankings
- [x] Fantasy-relevant stats
- [x] Transaction tracker

### NHL Features
- [x] Scores + standings
- [x] Match detail
- [x] Stats leaders
- [x] Injury reports
- [x] Playoff bracket
- [x] Power rankings
- [x] Transaction tracker

### MLB Features
- [x] Scores + standings (AL + NL)
- [x] Match detail
- [x] Stats leaders
- [x] Injury reports
- [x] Power rankings
- [x] Transaction tracker

### Web UI
- [x] Dark theme (FotMob-inspired)
- [x] Dark/light mode toggle with localStorage
- [x] Search bar in nav (mobile + desktop)
- [x] Responsive design (mobile + desktop)
- [x] Date picker for past scores
- [x] League bar with "More" dropdown (regional grouping)
- [x] ESPN API error handling (graceful fallback, no more SSR crashes)
- [x] Push notifications (browser Notification API)

### iOS App
- [x] 5-sport tab bar (Soccer, NBA, NFL, NHL, MLB)
- [x] Content tabs (Scores, Standings, Teams, News, Following)
- [x] Score⚡Spark header with search + settings + hamburger
- [x] FotMob-style compact match rows (36px)
- [x] League headers (18px)
- [x] Date picker bar
- [x] Live match indicators (pulse animation)
- [x] Match detail view with commentary tab
- [x] Standings view with 35 soccer leagues
- [x] Teams grid
- [x] News list (from Vercel API)
- [x] Favorites view
- [x] Settings view
- [x] Search sheet
- [x] Builds on iPhone 17 Pro simulator

### Bug Fixes
- [x] ESPN API errors no longer crash server (changed throw → console.warn + empty fallback)
- [x] La Liga standings (PD alias now works correctly)
- [x] Soccer logos fixed on scores page
- [x] Past dates rendering with real data
- [x] News sport filtering (no cross-sport contamination)
- [x] All pages return 200: /scores, /scores/soccer, /scores/nba, /scores/nfl, /scores/nhl, /scores/mlb, teams, news, standings
- [x] Saudi league ESPN endpoint 400 handled gracefully

---

## 🔧 IN PROGRESS / KNOWN ISSUES

### Bugs to Fix
- [ ] **Search API returns 400** — src/app/api/v1/search/route.ts broken
- [ ] **Match detail (past dates)** — shows "?" for team names, missing teamStats
- [ ] **iOS hamburger menu** — icon visible but not functional (no slide-out menu)
- [ ] **iOS soccer logos** — some broken on certain pages
- [ ] **Intermittent 404 on /scores/soccer** — rare but happens

### iOS UI — Needs More Work
- [ ] Still more blank space than FotMob — needs another density pass
- [ ] FotMob uses ~every pixel; our SwiftUI spacing still has gaps
- [ ] Team logos in standings need to be more consistent
- [ ] Bottom tab bar could be tighter
- [ ] Consider ignoring top safe area for truly edge-to-edge content

---

## 📋 NOT YET STARTED

### Soccer — Remaining for Full FotMob Parity
- [ ] Expand to ALL FotMob leagues (551 total; we have ~60 via ESPN)
  - Would need FotMob API or additional data sources for tiny leagues
- [ ] Player pages: bio, stats by season, career history, market value
- [ ] Head-to-head comparison for matches
- [ ] Referee stats per match
- [ ] Momentum tracker (live match)
- [ ] Heatmap concept for players
- [ ] Full squad pages per team
- [ ] Transfer window tracker (not just news)

### Other Sports — Gaps
- [ ] NBA: Trade rumor aggregation
- [ ] NFL: Drive charts, scoring play visualization
- [ ] NHL: Period-by-period scoring breakdown, shots/saves visualization
- [ ] MLB: Box scores quality upgrade, pitch-by-pitch data
- [ ] All sports: Box scores need quality upgrade to match FotMob/theScore/Yahoo level

### Platform Features
- [ ] User accounts / authentication
- [ ] Persistent favorites (currently localStorage only on web)
- [ ] Push notifications (native iOS — currently browser-only)
- [ ] Betting odds integration (lines are shown but not live)
- [ ] Social features (comments, predictions)
- [ ] Widget for iOS (lock screen / home screen)
- [ ] Apple Watch companion
- [ ] Android app

### DevOps
- [ ] Gmail access for ziggyassist@gmail.com (needs app password — blocked)
- [ ] CI/CD pipeline (currently manual deploy)
- [ ] Automated testing suite
- [ ] Error monitoring (Sentry or similar)
- [ ] Analytics (usage tracking)

---

## 📊 Git History (recent)

| Commit | Description |
|--------|-------------|
| 6f4c8c9 | Expand to 60+ soccer leagues, fix La Liga/PD standings, iOS space optimization |
| 940c682 | Visual QA pass: all frontend fixes verified |
| 968a4e5 | Fix frontend rendering: past dates, soccer logos, ESPN match detail |
| f1fe83b | Enhance iOS match detail: rich commentary tab |
| 82fc125 | iOS compact overhaul: FotMob-density layouts |
| 94078e9 | Fix UI polish: badge fallbacks, card radius |
| 794df1a | Compact iOS UI: reduce padding/margins, fix standings logos |
| 75a7043 | Wire push notifications with browser Notification API |
| 5494557 | Add transfer news section for soccer |
| 8326b44 | Fix: ESPN API errors no longer crash server |
| 57f435d | Add predicted lineups for upcoming soccer matches |
| 4dbe388 | Add post-match player ratings on formation view |
| 411eb2e | Add live commentary tab |
| 9580d55 | Redesign lineup view with FotMob-style formation diagram |
| 2ff8cf5 | Redesign league scorers page |
| 9e8b975 | Add team form guide badges to standings |
| 20e97ad | Wire dark/light mode toggle |
| 55a8ccd | Add search bar to navigation |

---

## 🔑 Key Config & Access

| Item | Value |
|------|-------|
| Repo | ~/Projects/ScoreSpark → github.com/ziggyassist-arch/ScoreSpark |
| Branch | main |
| Vercel Project | prj_gMqVvQbUblV3ooTlJJQKD6cOpecS |
| Vercel Team | team_wSuuvAFyZXPXz74mIppQgvbr |
| Dev Server | npx next dev -p 3000 |
| iOS Build | xcodebuild -scheme ScoreSpark -sdk iphonesimulator -destination 'iPhone 17 Pro' |
| Bundle ID | com.scorespark.app |
| football-data.org key | in .env.local |
| ESPN API | free, no key needed |
| Docs folder | ~/Desktop/ScoreSpark (PRD, plan, logo) |
| Code folder | ~/Projects/ScoreSpark |
