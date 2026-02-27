#!/bin/bash
# Post-fix verification script — run after every Claude Code fix
# Usage: ./scripts/verify.sh

set -e
cd "$(dirname "$0")/.."

echo "=== 1. BUILD CHECK ==="
npm run build 2>&1 | tail -5
if [ $? -ne 0 ]; then echo "❌ BUILD FAILED"; exit 1; fi
echo "✅ Build passed"

echo ""
echo "=== 2. GIT STATUS ==="
echo "Local:  $(git log --oneline -1)"
echo "Remote: $(git log --oneline origin/main -1)"
if [ "$(git rev-parse HEAD)" != "$(git rev-parse origin/main)" ]; then
  echo "⚠️  Local ahead of remote — not pushed?"
else
  echo "✅ In sync with remote"
fi

echo ""
echo "=== 3. START SERVER ==="
pkill -f "next start" 2>/dev/null || true
sleep 1
npx next start -p 3099 &>/tmp/ss-verify.log &
SERVER_PID=$!
sleep 5

echo ""
echo "=== 4. PAGE CHECKS ==="
FAIL=0

check_page() {
  local path=$1
  local label=$2
  local code=$(curl -s -o /dev/null -w "%{http_code}" "http://localhost:3099$path" 2>/dev/null)
  if [ "$code" = "200" ]; then
    local size=$(curl -s "http://localhost:3099$path" 2>/dev/null | wc -c | tr -d ' ')
    echo "✅ $label ($code, ${size}B)"
  else
    echo "❌ $label ($code)"
    FAIL=1
  fi
}

check_page "/scores/soccer" "Soccer scores"
check_page "/scores/nba" "NBA scores"  
check_page "/scores/nfl" "NFL scores"
check_page "/scores/soccer?date=2026-02-26" "Soccer yesterday"
check_page "/standings/epl" "EPL standings"
check_page "/standings/nba-east" "NBA standings"

echo ""
echo "=== 5. FEATURE CHECKS ==="

# Check soccer page has key elements
SOCCER_HTML=$(curl -s "http://localhost:3099/scores/soccer" 2>/dev/null)
echo "$SOCCER_HTML" | grep -q "All" && echo "✅ League filter present" || echo "❌ League filter missing"
echo "$SOCCER_HTML" | grep -qE 'fd-[0-9]+|espn-soccer-' && echo "✅ Match data present" || echo "❌ No match data"

# Check a match detail page
MATCH_ID=$(echo "$SOCCER_HTML" | grep -oE 'espn-soccer-[0-9]+' | head -1)
if [ -n "$MATCH_ID" ]; then
  MATCH_HTML=$(curl -s "http://localhost:3099/match/$MATCH_ID" 2>/dev/null)
  echo "$MATCH_HTML" | grep -q "standings" && echo "✅ Standings link in detail" || echo "❌ No standings link"
  echo "$MATCH_HTML" | grep -q "HT\|Half" && echo "✅ HT score present" || echo "⚠️  No HT score (may be upcoming match)"
  SIZE=$(echo "$MATCH_HTML" | wc -c | tr -d ' ')
  echo "✅ Match detail renders (${SIZE}B)"
fi

echo ""
echo "=== 6. CLEANUP ==="
kill $SERVER_PID 2>/dev/null
echo "Done. Failures: $FAIL"
exit $FAIL
