#!/usr/bin/env bash
# Calls a running ./run.sh: the admin endpoints, stats-module's routes and its subscription.
#   ./try.sh             # every request below
#   ./try.sh latest      # one of: status latest block recent bad subscribe
set -uo pipefail
cd "$(dirname "$0")"
API="${STATS_API:-127.0.0.1:18080}"
ADMIN="${STATS_ADMIN:-127.0.0.1:18081}"

show() { echo; echo "\$ curl $*"; }
status()  { show "http://$ADMIN/status"; curl -sS "http://$ADMIN/status"; echo; }
latest()  { show -i "http://$API/stats-module/latest"; curl -sS -i "http://$API/stats-module/latest"; echo; }
block()   { show "http://$API/stats-module/blocks/${1:-1}"; curl -sS "http://$API/stats-module/blocks/${1:-1}"; echo; }
recent()  { show "http://$API/stats-module/recent?limit=2"; curl -sS "http://$API/stats-module/recent?limit=2"; echo; }
bad()     { show "http://$API/stats-module/blocks/abc"; curl -sS "http://$API/stats-module/blocks/abc"; echo; }
# Subscribes to stats-module-blocks and prints the messages until three rows arrived (with the repository's ws). Rows
# that arrive while the connection closes are not printed.
subscribe() {
  echo; echo "WebSocket ws://$API: subscribe stats-module-blocks"
  node --input-type=module -e '
    import { WebSocket } from "ws";
    const ws = new WebSocket(`ws://${process.argv[1]}`);
    let rows = 0;
    let done = false;
    const end = () => { done = true; ws.close(); };
    const subscribe = { type: "subscribe", id: "s1", name: "stats-module-blocks", args: { minTx: 0 } };
    ws.on("open", () => ws.send(JSON.stringify(subscribe)));
    ws.on("message", (message) => {
      if (done) return;
      console.log(String(message));
      if (JSON.parse(String(message)).type === "next" && ++rows === 3) end();
    });
    setTimeout(() => { if (!done) { console.log("(no new row within 30 s)"); end(); } }, 30_000).unref();
  ' "$API"
}

if [ $# -gt 0 ]; then "$@"; exit; fi
status; latest; block 1; recent; bad; subscribe
