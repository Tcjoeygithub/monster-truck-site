#!/bin/bash
# Daily collection fill script
# Runs the autopilot to generate pages, then pushes and deploys
# Usage: ./scripts/daily-fill.sh [count]
#   count = number of pages to generate (default: 9)

set -e
cd "$(dirname "$0")/.."

COUNT=${1:-9}
LOG="scripts/daily-fill.log"

echo "$(date): Starting daily fill ($COUNT pages)" | tee -a "$LOG"

# Start dev server in background
npm run dev &
DEV_PID=$!
sleep 8

# Run the autopilot
RESULT=$(curl -s "http://localhost:3000/api/cron?count=$COUNT" \
  -H "Authorization: Bearer $(grep CRON_SECRET .env.local | cut -d= -f2)")

echo "$RESULT" | python3 -c "
import sys, json
try:
    d = json.load(sys.stdin)
    print(f'Collection: {d.get(\"collectionName\", \"unknown\")}')
    print(f'Published: {d[\"pagesPublished\"]}, Failed: {d[\"pagesFailed\"]}')
    for p in d.get('pages', []):
        status = 'OK' if p['success'] else 'FAIL'
        print(f'  [{status}] {p[\"title\"]}')
except:
    print('Could not parse result')
" | tee -a "$LOG"

# Kill dev server
kill $DEV_PID 2>/dev/null

# Push and deploy if any pages were published
PUBLISHED=$(echo "$RESULT" | python3 -c "import sys,json; print(json.load(sys.stdin).get('pagesPublished',0))" 2>/dev/null || echo "0")

if [ "$PUBLISHED" -gt "0" ]; then
  echo "Pushing $PUBLISHED new pages..." | tee -a "$LOG"
  git add src/data/ public/images/coloring-pages/
  git commit -m "Autopilot: $PUBLISHED new coloring pages ($(date +%Y-%m-%d))

Co-Authored-By: Claude Opus 4.6 (1M context) <noreply@anthropic.com>"
  git push origin main
  vercel --prod --yes
  echo "$(date): Deployed $PUBLISHED pages" | tee -a "$LOG"
else
  echo "$(date): No pages published (quota or errors)" | tee -a "$LOG"
fi

echo "$(date): Done" | tee -a "$LOG"
