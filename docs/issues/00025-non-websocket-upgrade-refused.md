# 00025 — The module API listener refuses a request that offers an upgrade other than WebSocket

- **Status:** OPEN
- **Area:** bug
- **Severity:** low
- **Effort:** small — hand only WebSocket upgrades to the WebSocket server and ignore the rest.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 5.2c of `openspec/changes/core-arch`, while testing `X-Umbra-Version` on `ws`'s
  refusals of an upgrade. The code involved is task 5.2a's; task 5.2c did not change which requests are upgraded.

## Problem

Node.js's HTTP server hands every request with `Connection: Upgrade` and an `Upgrade` header to the server's `upgrade`
listener, whatever protocol it names, and never to the request handler, as long as an `upgrade` listener exists. The
module API listener's `upgrade` listener passes every such request to `ws`, which refuses any protocol but
`websocket` with `400 Invalid Upgrade header`. So a client that offers an upgrade the server may ignore (RFC 9110 §7.8:
the server "MAY ignore a received Upgrade header field") gets 400 instead of the answer to its request. `curl --http2`
on an `http://` URL does exactly that (`Connection: Upgrade, HTTP2-Settings`, `Upgrade: h2c`): checked with curl 8.7.1
against the listener, `curl -i http://…/q` answered 200 and `curl -i --http2 http://…/q` answered
`400 Bad Request` with the body `Invalid Upgrade header`.

## Evidence

- `src/runner/api-server.ts:389-390` — `server.on("upgrade", …)` calls `sockets.handleUpgrade` for every upgrade
  request, whatever its `Upgrade` header.
- `node_modules/ws/lib/websocket-server.js:257` (ws 8.22.0) — `handleUpgrade` refuses an `Upgrade` other than
  `websocket` with 400.
- `test/runner/api-server.test.ts:1346` — the test of task 5.2c that sends `Upgrade: h2c` as curl does and gets the
  400 (with `X-Umbra-Version`, which is what that test checks).

## Suggested fix

Give the listener's HTTP server Node.js's `shouldUpgradeCallback` option (Node.js 24.9.0, `_http_server.js`; the
default is "an `upgrade` listener exists"): upgrade only requests whose `Upgrade` header names `websocket` (case
insensitively), so every other request reaches the module API as an ordinary request and is answered as HTTP/1.1.
Then test that `curl --http2`'s request is answered by its route, and move the test of `ws`'s 400 for a malformed
upgrade to another of `ws`'s refusals (a missing `Sec-WebSocket-Key`, already tested beside it).
