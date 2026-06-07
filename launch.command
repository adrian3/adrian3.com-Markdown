#!/bin/bash
# Launch the Adrian3 Generator admin server and open the admin UI.
# Double-click this file from Finder to start.

cd "$(dirname "$0")"

PORT=3002
PREVIEW_PORT=$((PORT + 1))
URL="http://localhost:$PORT/"

# Stop anything already listening on the chosen ports so we start fresh.
for P in "$PORT" "$PREVIEW_PORT"; do
  PIDS=$(lsof -ti TCP:$P -sTCP:LISTEN 2>/dev/null)
  if [ -n "$PIDS" ]; then
    echo "Stopping existing listener on port $P."
    kill $PIDS >/dev/null 2>&1
    sleep 0.5
  fi
done

# Install dependencies if needed
if [ ! -d "admin/node_modules" ]; then
  echo "Installing dependencies…"
  npm install --prefix admin
fi

# Start the server in the background
echo "Starting server at $URL"
PORT=$PORT PREVIEW_PORT=$PREVIEW_PORT node admin/server.js &
SERVER_PID=$!

# Wait for the server to be ready (up to 5 seconds)
for i in $(seq 1 10); do
  sleep 0.5
  if curl -s "$URL" > /dev/null 2>&1; then
    break
  fi
done

# Open the admin index in the browser
open "$URL"

# Keep the terminal window open so server stays alive
echo "Server running (PID $SERVER_PID). Close this window to stop."
wait $SERVER_PID
