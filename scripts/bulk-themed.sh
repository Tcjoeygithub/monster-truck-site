#!/bin/bash
# bulk-themed.sh — generate N new listicles with specific themes, then batch
# deploy and schedule pins to Zippy.
#
# Themes are listed in the THEMES array below. Each is fed to the autopilot
# as the required theme for that iteration's brand-new collection.
set -u
cd "$(dirname "$0")/.."
LOG="scripts/bulk-themed.log"
: > "$LOG"

# 20 badass themes — distinct from existing collections
THEMES=(
  "Dragon"
  "Shark"
  "Wolf"
  "Tiger"
  "Eagle Raptor"
  "Gorilla"
  "Bear"
  "Rhino"
  "Cobra Snake"
  "Scorpion"
  "Bull"
  "Phoenix"
  "Werewolf"
  "Ninja"
  "Samurai"
  "Viking"
  "Pirate"
  "Cowboy Wild West"
  "Alien UFO"
  "Zombie"
)

DAYS="${1:-30}"  # spread pins over this many days (default 30)

echo "=== bulk-themed start: $(date -u +%Y-%m-%dT%H:%M:%SZ)  themes=${#THEMES[@]} days=$DAYS ===" | tee -a "$LOG"

# Kill any stale dev server
pkill -f "next dev" 2>/dev/null
sleep 2

npm run dev > /tmp/next-themed.log 2>&1 &
DEV_PID=$!
trap 'kill $DEV_PID 2>/dev/null; pkill -f "caffeinate -i -d" 2>/dev/null' EXIT

caffeinate -i -d &

# Wait for dev server
for i in {1..60}; do
  curl -sf http://localhost:3000 > /dev/null 2>&1 && break
  sleep 2
done
echo "Dev server up" | tee -a "$LOG"

CRON=$(grep "^CRON_SECRET=" .env.local | cut -d= -f2)
SUCCESS=0
FAIL=0

for i in "${!THEMES[@]}"; do
  N=$((i+1))
  THEME="${THEMES[$i]}"
  START=$(date +%s)
  echo "[$N/${#THEMES[@]}] $(date -u +%H:%M:%S) UTC  theme='$THEME'" | tee -a "$LOG"

  ENCODED=$(python3 -c "import urllib.parse,sys; print(urllib.parse.quote(sys.argv[1]))" "$THEME")
  RESULT=$(curl -sS -m 1500 -H "Authorization: Bearer $CRON" \
    "http://localhost:3000/api/cron?count=10&theme=$ENCODED")

  PUB=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('pagesPublished',0))" 2>/dev/null || echo 0)
  NAME=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('collectionName',''))" 2>/dev/null || echo "")
  DUR=$(($(date +%s) - START))

  if [ "$PUB" -gt "0" ]; then
    SUCCESS=$((SUCCESS+1))
    echo "  ✓ $NAME (+$PUB pages, ${DUR}s)" | tee -a "$LOG"
  else
    FAIL=$((FAIL+1))
    ERR=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','unknown'))" 2>/dev/null || echo unknown)
    echo "  ✗ failed (${DUR}s): ${ERR:0:200}" | tee -a "$LOG"
  fi
done

echo "" | tee -a "$LOG"
echo "=== Generation done: $SUCCESS succeeded, $FAIL failed ===" | tee -a "$LOG"

kill $DEV_PID 2>/dev/null

if [ "$SUCCESS" -eq "0" ]; then
  echo "No successes, skipping deploy" | tee -a "$LOG"
  exit 1
fi

echo "Generating PDFs..." | tee -a "$LOG"
python3 scripts/generate-pdfs.py 2>&1 | tail -3 | tee -a "$LOG"

echo "Committing + deploying..." | tee -a "$LOG"
git add src/data/ public/images/coloring-pages/ public/pdfs/
git -c commit.gpgsign=false commit -m "Bulk themed: +$SUCCESS badass listicles ($(date +%Y-%m-%d))

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" 2>&1 | tail -3 | tee -a "$LOG"
git push origin main 2>&1 | tail -3 | tee -a "$LOG"

echo "Waiting 2min for deploy..." | tee -a "$LOG"
sleep 120

echo "Generating pin descriptions..." | tee -a "$LOG"
node scripts/generate-pin-descriptions.mjs 2>&1 | tail -5 | tee -a "$LOG"

echo "Scheduling pins across $DAYS days..." | tee -a "$LOG"
node scripts/schedule-pins.mjs --days="$DAYS" 2>&1 | tail -8 | tee -a "$LOG"

git add src/data/pinned.json src/data/pin-descriptions.json src/data/pinterest-boards.json
if ! git diff --cached --quiet; then
  git -c commit.gpgsign=false commit -m "Bulk themed: schedule $SUCCESS collections' pins over $DAYS days

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" | tail -3 | tee -a "$LOG"
  git push origin main 2>&1 | tail -2 | tee -a "$LOG"
fi

# Slack ping at the end
URL=$(grep SLACK_NOTIFY_URL ~/.claude/settings.json | head -1 | sed 's/.*": "\(.*\)".*/\1/')
if [ -n "$URL" ] && [ "$URL" != "REPLACE_WITH_WEBHOOK_URL" ]; then
  curl -sS -X POST -H 'Content-Type: application/json' \
    --data "{\"text\":\"🚀 *bulk-themed DONE* · $SUCCESS/$((SUCCESS+FAIL)) collections live, pins staggered over $DAYS days\"}" \
    "$URL" > /dev/null 2>&1 || true
fi

echo "=== DONE at $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG"
