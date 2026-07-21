#!/bin/zsh
set -euo pipefail

APP_NAME="Adrian3.com Redesign"
APP_ID="adrian3-redesign"
PORT=3002
PREVIEW_PORT=3003
URL="http://127.0.0.1:${PORT}/"
APP_DIR="$(cd "$(dirname "$0")" && pwd)"
RUN_DIR="$APP_DIR/.run"
PID_FILE="$RUN_DIR/${APP_ID}.pid"
LOG_FILE="$RUN_DIR/${APP_ID}.log"

mkdir -p "$RUN_DIR"

alert() {
  osascript -e "display alert \"$APP_NAME\" message \"$1\""
}

process_details() {
  local pid="$1"
  ps eww -p "$pid" -o command= 2>/dev/null || ps -p "$pid" -o command= 2>/dev/null || true
}

matches_app_process() {
  local pid="$1"
  local details
  details="$(process_details "$pid")"
  [[ -n "$details" ]] || return 1
  [[ "$details" == *"ADE_APPS_LAUNCHER_ID=$APP_ID"* ]] && return 0
  [[ "$details" == *"admin/server.js"* ]] && [[ "$details" == *"$APP_DIR"* ]]
}

stop_pid_if_matches() {
  local pid="$1"
  if [[ -n "${pid:-}" ]] && kill -0 "$pid" 2>/dev/null && matches_app_process "$pid"; then
    kill "$pid" 2>/dev/null || true
    sleep 0.8
    kill -9 "$pid" 2>/dev/null || true
  fi
}

stop_previous_app() {
  if [[ -f "$PID_FILE" ]]; then
    stop_pid_if_matches "$(cat "$PID_FILE" 2>/dev/null || true)"
    rm -f "$PID_FILE"
  fi
}

port_owner_pid() {
  local port="$1"
  lsof -nP -tiTCP:"$port" -sTCP:LISTEN 2>/dev/null || true
}

ensure_port_is_safe() {
  local port="$1"
  local pid
  pid="$(port_owner_pid "$port")"
  [[ -n "${pid:-}" ]] || return 0

  if matches_app_process "$pid"; then
    stop_pid_if_matches "$pid"
    sleep 1
  else
    local details
    details="$(process_details "$pid")"
    alert "Port $port is already in use by another process:\n\n$details"
    exit 1
  fi
}

ensure_runtime() {
  cd "$APP_DIR"
  if [[ ! -d admin/node_modules ]]; then
    echo "Installing dependencies..."
    npm install --prefix admin >> "$LOG_FILE" 2>&1
  fi
}

start_server() {
  cd "$APP_DIR"
  : > "$LOG_FILE"
  nohup env ADE_APPS_LAUNCHER_ID="$APP_ID" PORT="$PORT" PREVIEW_PORT="$PREVIEW_PORT" node admin/server.js >> "$LOG_FILE" 2>&1 &
}

wait_until_ready() {
  for _ in {1..10}; do
    if curl -s "$URL" >/dev/null 2>&1; then
      return 0
    fi
    sleep 0.5
  done
  return 1
}

record_server_pid() {
  local live_pid
  live_pid="$(port_owner_pid "$PORT")"
  if [[ -n "${live_pid:-}" ]]; then
    echo "$live_pid" > "$PID_FILE"
    return 0
  fi
  return 1
}

main() {
  : > "$LOG_FILE"
  ensure_runtime
  stop_previous_app
  ensure_port_is_safe "$PORT"
  ensure_port_is_safe "$PREVIEW_PORT"
  start_server

  if wait_until_ready; then
    record_server_pid || true
    open "$URL"
    exit 0
  fi

  open -a "TextEdit" "$LOG_FILE" >/dev/null 2>&1 || true
  alert "The server did not start. A log file has been opened."
  exit 1
}

main "$@"
