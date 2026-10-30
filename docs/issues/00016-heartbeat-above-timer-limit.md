# 00016 — The WebSocket transport's heartbeat takes an interval Node.js cannot time

- **Status:** CLOSED — fixed 2026-10-29: `connectWebSocket` refuses a `heartbeatMs` that is not a whole number from 1 to
  2^31 − 1 with `invalid-configuration` before connecting; the tests that passed a larger value use 2^31 − 1.
- **Area:** bug
- **Severity:** low
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 9.2 of `openspec/changes/core-arch` (the recording builder), outside its change
  (`src/node/` is task 10.1's).

## Problem

`connectWebSocket(url, events, timers, { heartbeatMs })` uses `heartbeatMs` as given. On the global timers
(`SYSTEM_TIMERS`, the default), Node.js runs any delay above 2^31 − 1 ms after 1 ms instead, with only a
`TimeoutOverflowWarning`. So a caller that asks for a very long heartbeat — to keep it out of the way, as the node
client's tests do on a hand-moved clock — gets a 1 ms heartbeat on the real clock: the first beat pings, the next one
1 ms later finds no pong yet and terminates the connection, so every connection ends almost as soon as it opens.

## Evidence

- `src/node/ws-socket.ts:27` takes `heartbeatMs`, `:29` uses it unchecked, `:44` and `:53` pass it to
  `timers.setTimeout`.
- `src/node/socket.ts:43-44`: `SYSTEM_TIMERS.setTimeout` is Node.js's `setTimeout`.
- `test/node/client.test.ts:38` and `test/tape/node-client.test.ts:30` pass `1_000_000 * HOUR` (3.6 × 10^12 ms): safe
  only because those clients run on `ManualTimers`.
- Seen in task 9.2: a record-and-replay test that passed the same option to a client on the real timers failed every
  session, with Node.js printing "3600000000000 does not fit into a 32-bit signed integer. Timeout duration was set
  to 1." The test now passes 2^31 − 1 (`test/tape/record-and-replay.test.ts`).

No production path passes the option today (the node client calls `connectWebSocket` with the default 30 s), so this
is latent.

## Suggested fix

In `connectWebSocket`, refuse a `heartbeatMs` that is not an integer from 1 to 2^31 − 1 (as the client refuses its own
options with `invalid-configuration`), or clamp it to 2^31 − 1; and have the tests that move the clock by hand pass
2^31 − 1, which works on both clocks.
