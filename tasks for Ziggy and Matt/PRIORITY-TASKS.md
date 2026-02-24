# ScoreSpark Tasks from Matt - Priority List

## 1. Past/Future Dates
- DatePicker should browse past results and future scheduled games
- All sports need real dates, not just today
- NFL season is OVER (Super Bowl already happened) — show past results, no fake today games
- NBA/NHL in regular season, MLB approaching opening day, Soccer leagues in season
- All dates must be REAL and ACCURATE

## 2. Hamburger Menu
- Add ☰ icon top right of nav bar
- Just the icon for now, no dropdown content yet

## 3. MLB/NHL Missing
- Teams page missing MLB and NHL logos and teams
- All 32 NHL teams and 30 MLB teams with logos needed

## 4. Soccer Leagues - Full FotMob Coverage
- League bar needs EVERY league FotMob covers
- Clicking a league shows every team + standings
- Default to Champions League on teams page
- Dropdown listing all leagues

## 5. News from Top 10 Sources Per Sport
- Aggregate via RSS feeds from top 10 sports news sites per sport
- Not just ESPN — include The Athletic, CBS Sports, Bleacher Report, etc.

## 6. Mock Drafts
- Soccer: MLS SuperDraft only
- NBA/NFL/NHL/MLB: Each gets own mock draft
- Research top 5 sources, average picks, show consensus
- Simple list: Pick #, Player, Position, College/Club

## 7. Match Detail Pages
- Click a game → summary, team stats, player stats
- Upcoming games: show DraftKings + FanDuel betting lines (spread, moneyline, O/U)
- Reference best app per sport (FotMob for soccer, ESPN for others)

## 8. Match Detail UI Fix
- Logos misplaced, layout broken when clicking a game
- Fix alignment: home team left, away team right, score centered
- Match FotMob layout exactly

## 9. Team Pages
- Each team clickable → full team page like FotMob
- Overview, fixtures, squad, stats, standings
- Research best app per sport for content

## 10. Deploy to Vercel when done
- npx vercel --prod --yes
