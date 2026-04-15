#!/bin/bash
# bulk-run.sh — generate N new listicles locally, batch commit + schedule pins over --days
#
# Usage:  ./scripts/bulk-run.sh <count> <spread_days>
#         count       = number of listicles to generate (each = 10 pages)
#         spread_days = total days to spread pins across (default 100)
#
# Requires: dev server reachable at localhost:3000, .env.local populated.

set -u
cd "$(dirname "$0")/.."

COUNT=${1:-100}
DAYS=${2:-100}
LOG="scripts/bulk-run.log"
START_ISO=$(date -u +%Y-%m-%dT%H:%M:%SZ)

echo "=== bulk-run start: $START_ISO (count=$COUNT, days=$DAYS) ===" | tee -a "$LOG"

# Start dev server
echo "Starting dev server..." | tee -a "$LOG"
npm run dev > /tmp/next-bulk.log 2>&1 &
DEV_PID=$!
trap "kill $DEV_PID 2>/dev/null; caffeinate_pid=\$(pgrep -f 'caffeinate -i -d'); [ -n \"\$caffeinate_pid\" ] && kill \$caffeinate_pid" EXIT

# Keep Mac awake
caffeinate -i -d &

# Wait for Next to be ready
for i in {1..60}; do
  if curl -sf http://localhost:3000 > /dev/null 2>&1; then
    echo "Dev server up" | tee -a "$LOG"
    break
  fi
  sleep 2
done

CRON_SECRET=$(grep "^CRON_SECRET=" .env.local | cut -d= -f2)
if [ -z "$CRON_SECRET" ]; then echo "Missing CRON_SECRET" | tee -a "$LOG"; exit 1; fi

SUCCESS=0
FAIL=0
for i in $(seq 1 $COUNT); do
  ITER_START=$(date +%s)
  echo "[$i/$COUNT] starting at $(date -u +%H:%M:%S) UTC" | tee -a "$LOG"

  RESULT=$(curl -sS -m 1500 -H "Authorization: Bearer $CRON_SECRET" \
    "http://localhost:3000/api/cron?count=10")

  # Extract pagesPublished
  PUB=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('pagesPublished',0))" 2>/dev/null || echo 0)
  NAME=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('collectionName',''))" 2>/dev/null || echo "")

  DUR=$(($(date +%s) - ITER_START))
  if [ "$PUB" -gt "0" ]; then
    SUCCESS=$((SUCCESS + 1))
    echo "  ✓ $NAME (+$PUB pages, ${DUR}s)" | tee -a "$LOG"
  else
    FAIL=$((FAIL + 1))
    ERR=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('error','unknown'))" 2>/dev/null || echo unknown)
    echo "  ✗ failed (${DUR}s): $ERR" | tee -a "$LOG"
  fi
done

echo "" | tee -a "$LOG"
echo "=== Generation done: $SUCCESS succeeded, $FAIL failed ===" | tee -a "$LOG"

# Stop dev server
kill $DEV_PID 2>/dev/null
wait $DEV_PID 2>/dev/null

if [ "$SUCCESS" -eq "0" ]; then
  echo "No successes, skipping deploy" | tee -a "$LOG"
  exit 1
fi

echo "Generating PDFs..." | tee -a "$LOG"
python3 scripts/generate-pdfs.py | tail -3 | tee -a "$LOG"

echo "Committing and deploying..." | tee -a "$LOG"
git add src/data/ public/images/coloring-pages/ public/pdfs/
git -c commit.gpgsign=false commit -m "Bulk: $SUCCESS new listicles ($(date +%Y-%m-%d))

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" | tail -3 | tee -a "$LOG"
git push origin main 2>&1 | tail -3 | tee -a "$LOG"

echo "Waiting 2min for deploy..." | tee -a "$LOG"
sleep 120

echo "Generating pin descriptions..." | tee -a "$LOG"
node scripts/generate-pin-descriptions.mjs 2>&1 | tail -5 | tee -a "$LOG"

echo "Scheduling pins across $DAYS days..." | tee -a "$LOG"
node scripts/schedule-pins.mjs --days="$DAYS" 2>&1 | tail -10 | tee -a "$LOG"

echo "Committing pin state..." | tee -a "$LOG"
git add src/data/pinned.json src/data/pin-descriptions.json
if ! git diff --cached --quiet; then
  git -c commit.gpgsign=false commit -m "Bulk: schedule $SUCCESS listicles' pins over $DAYS days

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>" | tail -3 | tee -a "$LOG"
  git push origin main 2>&1 | tail -3 | tee -a "$LOG"
fi

echo "=== DONE at $(date -u +%Y-%m-%dT%H:%M:%SZ) ===" | tee -a "$LOG"
