# ScoreSpark vs FotMob — Gap Audit
**Date:** 2026-02-27

## Completed Fixes (deployed to Vercel)

1. ✅ **Live match minute** — fd- matches show "23'", "67'", "HT" instead of "LIVE"
2. ✅ **ESPN enrichment** — fd- match details get events/stats/commentary from ESPN for PL/La Liga/Serie A/Bundesliga/Ligue 1/UCL
3. ✅ **Auto-refresh polling** — 30s polling for live matches, "Updated Xs ago" indicator
4. ✅ **Date navigation** — FotMob-style 7-day date strip
5. ✅ **HT score + red card indicators** — Half-time score on cards/detail, tiny red rectangles for red cards
6. ✅ **Match status variants** — AET, PEN, PPD, CAN, SUS, ABD instead of just "FT"
7. ✅ **Popular league ordering** — Big 5 + UCL at top, "More Leagues" divider
8. ✅ **Aggregate scores + team form** — UCL two-leg aggregates, W/D/L form dots
9. ✅ **Goal scorers in header** — Scorer names grouped by player in match detail header
10. ✅ **Visual event timeline** — FotMob-style horizontal timeline with events plotted
11. ✅ **League position + tappable links** — "5th" under team names, league name links to standings

## Remaining FotMob Gaps

### HIGH
- [ ] Match momentum/pressure indicator for live matches
- [ ] Better upcoming match card (countdown, broadcast info)
- [ ] Player page (tap player name → career stats)
- [ ] xG (expected goals) display

### MEDIUM
- [ ] Shot map visualization
- [ ] Search for teams/players/leagues
- [ ] Notifications/alerts for goals/match start
- [ ] League filter on scores page (show only PL, only La Liga, etc.)

### LOW
- [ ] Formation change tracking during match
- [ ] Referee stats
- [ ] Weather info for upcoming matches
- [ ] Social sharing of match cards
