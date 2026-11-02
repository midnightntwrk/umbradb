# 00073 — `examples/stats-module/try.sh subscribe` prints every row that arrives before its close completes

- **Status:** OPEN
- **Area:** examples (`examples/stats-module/try.sh`)
- **Severity:** low — the script says it prints the subscription's messages "until three rows arrived", and a user
  following the README while the process syncs sees many more: rows keep arriving, and printing, until the WebSocket's
  closing handshake completes. Nothing else is affected.
- **Effort:** small — stop printing once the third row is printed (and once the 30 s wait gave up).
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, by a user run of the README on `v0.10.0-rc.1` (finding 4); the script is unchanged on the
  branch `00028-core-arch` (`00b7437`). A probe — a local `ws` server that answers the subscription and sends 12 rows
  at once — saw the script's client print all 12.

## Problem

The client in `subscribe()` prints every message it receives, and calls `ws.close()` when the third `next` arrives.
`close()` starts the closing handshake; the socket stays open until the server's close frame comes back, and every
message already sent before it is still received and printed. While the process is syncing, rows are sent faster than
the handshake completes, so the output goes on past three rows.

## Evidence

- `examples/stats-module/try.sh:24-27` — `console.log(String(message))` for every message, then `ws.close()` at the
  third `next`, with nothing that stops the printing after it.
- `examples/stats-module/try.sh:16` — the script's own comment: "prints the messages until three rows arrived".

## Suggested fix

Keep a flag: once the third row is printed (or the 30 s wait gave up), set it, close, and print nothing more. Test: the
script's client (`./try.sh subscribe`, with `STATS_API` at a local `ws` server that sends 12 rows) prints the
subscription's acknowledgement and exactly the first three rows.
