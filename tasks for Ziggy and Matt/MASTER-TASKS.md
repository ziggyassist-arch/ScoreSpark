# ScoreSpark Master Task List — Comprehensive Feature Parity

## PRIORITY 1: Logo + News (in progress)
- Score(white) ⚡(gold) Spark(light blue #9DCAED) wordmark — web + iOS
- News from 5-10 sources per sport, mixed by recency

## PRIORITY 2: Full FotMob Parity for Soccer
Every single feature FotMob has, we need:
- [ ] Every league worldwide (not just 9)
- [ ] Full match detail: lineups, formations, player ratings, events timeline, stats, head-to-head
- [ ] Live match: minute-by-minute commentary, momentum tracker
- [ ] Team pages: overview, fixtures, results, squad, stats, transfers, standings
- [ ] Player pages: bio, stats by season, career history, heatmap concept, market value
- [ ] League pages: table, top scorers, assists, cards, form guide
- [ ] Transfer news/rumors
- [ ] Match preview & predicted lineups
- [ ] Referee stats

## PRIORITY 3: Other Sports — Best-in-Class Features
Research theScore, ESPN, Yahoo Sports, CBS Sports and add:

### NBA
- [ ] Box scores, play-by-play
- [ ] Player stats leaders (PPG, RPG, APG)
- [ ] Injury reports
- [ ] Playoff bracket
- [ ] Trade/transaction tracker
- [ ] Power rankings
- [ ] Fantasy relevant stats

### NFL
- [ ] Drive charts, scoring plays
- [ ] Depth charts
- [ ] Injury reports (game-day designations)
- [ ] Playoff bracket
- [ ] Draft board / scouting reports
- [ ] Power rankings
- [ ] Fantasy relevant stats
- [ ] Transaction tracker

### NHL
- [ ] Period-by-period scoring
- [ ] Shots/saves stats
- [ ] Injury reports
- [ ] Playoff bracket
- [ ] Stats leaders (goals, assists, points, GAA, SV%)
- [ ] Trade tracker
- [ ] Power rankings

### MLB
- [ ] Box score, pitch-by-pitch
- [ ] Batting/pitching stats per game
- [ ] Injury reports (IL tracker)
- [ ] Stats leaders (BA, HR, RBI, ERA, K)
- [ ] Transaction tracker
- [ ] Standings with wild card race
- [ ] Power rankings

## PRIORITY 4: Hamburger Menu — Functional
Research what theScore/ESPN/FotMob have in their menus:
- [ ] Settings (dark/light mode, notifications, spoiler mode)
- [ ] Favorites management
- [ ] Account/sign in
- [ ] About / feedback
- [ ] Sport-specific quick links

## PRIORITY 5: Past Scores + Future Dates
- [ ] DatePicker shows past game results with final scores
- [ ] DatePicker shows future scheduled games with times
- [ ] Works for ALL 5 sports with real data
- [ ] NFL offseason handled correctly

## PRIORITY 6: Deploy
- Push all changes to GitHub
- Deploy to Vercel (npx vercel --prod --yes)
- Rebuild iOS and test on simulator
