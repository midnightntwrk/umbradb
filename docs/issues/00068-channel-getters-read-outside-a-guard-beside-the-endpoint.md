# 00068 — Two readers of a host's channel beside the private link's endpoint read its members outside a guard

- **Status:** OPEN
- **Area:** library (the private side's channel carrier; the module API's `api.connect` channels)
- **Severity:** medium — a host channel whose member is a getter that throws: on the private side an unhandled
  rejection (which ends a Node.js host by default) and a connection that never ends or reconnects; on `api.connect` an
  exception thrown into the host's carrier from its own message listener. No bad input from a peer is involved: the
  carrier is the host's.
- **Effort:** small — read the members inside the existing guards, as `ChannelEndpoint` does since `2ae0985`.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, while fixing the stage-4 fix check's N2 (`start-umbradb` P10.4c: a `bufferedAmount` getter
  read outside the endpoint's guard), on a Mac with Node.js 24.9.0. Out of N2's scope (the endpoint,
  `src/library/channels.ts`), so filed and skipped.

## Problem

The private link's endpoint reads every member of the host's channel inside a guard (`2ae0985`). Two other readers of a
host's channel do not:

1. **The private side's carrier** (`src/private/private-channels.ts`). `isChannel` checks the channel `connect()`
   resolved with by reading `send`, `onMessage`, `onClose` and `close` (`:43`), unguarded, inside the fulfilment
   handler of `Promise.resolve().then(() => connect(signal)).then(onChannel, onRejected)` (`:104-121`), whose result is
   discarded (`void`). A getter that throws there rejects that discarded promise: an **unhandled rejection** (G6: no
   unhandled rejection; Node.js's default `--unhandled-rejections=throw` ends the host), and neither `events.failed` nor
   `events.ended` is called, so the private transport neither reconnects nor ends that connection. The same holds for
   `discard(channel)` (`:55`), which calls `isChannel` for a channel resolved after the stop.
2. **The module API's channel connection** (`src/runner/api-session.ts`). `connectChannel`'s carrier reads
   `channel.bufferedAmount` with `typeof` (`:364`) before its `try`, which holds only the call. A getter that throws
   escapes `SubscriptionConnection.#write`, so out of the answer to a client's message (into the host carrier's own
   message listener) and out of a module's `emit`.

## Evidence

A probe (`node --import tsx`, Node.js 24.9.0) on `2ae0985`:
- `channelCarrier(async () => ({ get send() { throw … }, onMessage, onClose, close })).dial(events, signal)`: after
  50 ms, `process.on("unhandledRejection")` saw `Error: host send getter`; the events saw nothing (no `failed`, no
  `ended`).
- `connectChannel({ send, onMessage, onClose, close, get bufferedAmount() { throw … } }, api, { rules })`, then the
  channel's message listener called with `"not json"`: the listener threw `Error: host bufferedAmount getter` (the
  `invalid-request` answer was never sent).

## Suggested fix

1. `isChannel`: read the four members inside a `try` (a throw: not a channel — `failed` with "the host's connect()
   resolved with no channel", `ended(1006)`), and `discard` likewise; or give the fulfilment handler a `catch` that ends
   the connection so.
2. `connectChannel`'s `bufferedAmount()`: move the `typeof channel.bufferedAmount` read inside the `try`, and decide
   whether a throw is "no limit" (as the call that throws is read today, `test/runner/api-session.test.ts` › «a channel
   connection: … an unknown or throwing bufferedAmount is no limit …») or a carrier that ended (as the endpoint now reads
   it).
3. A test each with a getter that throws: no unhandled rejection and the connection ended (private side); nothing thrown
   out of the listener and the connection ended or kept per the decision (`api.connect`).
