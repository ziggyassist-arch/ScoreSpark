# ScoreSpark vs FotMob — Gap Audit
**Date:** 2026-02-27

## Priority 1: CRITICAL (Basic functionality missing)

### 1. ⏱ No live match minute/clock on match list
**FotMob:** Shows "45'+2" or "67'" next to live matches — the single most important live data point.
**ScoreSpark:** `MatchCard.tsx` line 29-31: Falls back to `match.clock?.displayValue` → `match.clock?.value` → `"LIVE"`. 
**Problem:** For `fd-` soccer matches, `clock` is never populated by football-data.org API. Shows only "LIVE" with no minute.
**Fix:** Enrich fd- matches with ESPN clock data, OR calculate elapsed time from `startTime` for fd- matches.

### 2. 🎯 fd- match detail has no events/stats/commentary
**FotMob:** Every match has events (goals, cards, subs), stats (possession, shots), and commentary.
**ScoreSpark:** `match-service.ts` `getMatchDetailById()` for fd- matches only calls football-data.org which returns basic score data. No events are mapped, stats are empty, no commentary.
**Fix:** For fd- matches, cross-reference ESPN to find matching event, fetch ESPN summary for events + stats + commentary.

### 3. 📊 fd- match cards show no score detail
**FotMob:** Match cards show goal scorers inline (e.g., "Salah 23', 67'").
**ScoreSpark:** `MatchCard.tsx` line 204+: Shows goal scorers from `match.events` — but fd- matches have empty events array.
**Fix:** Same as #2 — populate events for fd- matches.

### 4. 🔄 No auto-refresh for live data
**FotMob:** Live matches update every 30-60 seconds automatically.
**ScoreSpark:** Pages are server-rendered (RSC). No client-side polling or WebSocket for live updates.
**Fix:** Add client-side polling (setInterval fetch) for live match data, or SSE/WebSocket. Start with simple 30s polling.

## Priority 2: HIGH (Expected basic features)

### 5. 📅 No date picker / date navigation
**FotMob:** Has left/right arrows + calendar to see yesterday's, today's, tomorrow's matches.
**ScoreSpark:** Only shows today's matches. No date navigation.
**Fix:** Add date parameter to scores pages + date nav UI.

### 6. 🏆 Match detail: No half-time score indicator
**FotMob:** Shows "HT 1-0" or similar between-half indicators.
**ScoreSpark:** No half-time score shown anywhere for soccer.
**Fix:** Include HT score from ESPN summary or fd API.

### 7. ⚽ Match detail: No shot map
**FotMob:** Shows visual shot map with xG.
**ScoreSpark:** No shot map.
**Fix:** Lower priority — needs detailed shot data API.

### 8. 🔔 Favorites don't affect match list ordering
**FotMob:** Favorite teams/leagues appear at top.
**ScoreSpark:** Has favorites feature but doesn't prioritize them in match list.
**Fix:** Sort favorited matches to top.

## Priority 3: MEDIUM (Polish features)

### 9. Team page has no recent form (W/D/L dots)
### 10. No "live" sorting — live matches should float to top
### 11. Standings page needs league aliases (✅ JUST FIXED)
### 12. No search functionality
### 13. No match notifications/alerts

## Fix Order (one at a time, verified):
1. **#1** — Live match minute for fd- matches
2. **#2** — fd- match detail enrichment (events + stats + commentary)
3. **#4** — Auto-refresh for live data
4. **#5** — Date navigation
5. **#6** — Half-time score
6. **#3** — (Solved by #2)
7. **#8** — Favorites ordering
8. **#10** — Live match sorting
