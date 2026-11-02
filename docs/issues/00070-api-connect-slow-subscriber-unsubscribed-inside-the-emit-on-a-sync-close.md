# 00070 — `api.connect`'s slow-subscriber disconnect unsubscribes inside the module's emit when the host's channel tells its close at once

- **Status:** OPEN
- **Area:** runner (the module API's subscriptions on a host's channel, `api.connect`; `src/runner/api-session.ts`)
- **Severity:** low — only a host's channel whose `terminate()` (or `close()`, without a `terminate`) calls its own
  `onClose` listeners in the same turn; a `MessagePort` and a WebSocket tell a close on a later turn. With such a
  carrier, a slow subscriber's subscriptions are unsubscribed inside the module's own `emit`, against the module API's
  rule that "a module's unsubscribe never runs inside its own emit" (the module comment of `api-session.ts`, RN-15).
  Nothing is thrown and nothing more is sent.
- **Effort:** small — dispose of the connection's listeners before the carrier's `terminate()` (as the private link's
  endpoint disposes of its own before it closes the carrier), or call the `terminate()` with the deferred end.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-01, while fixing issue 00068 (`start-umbradb` P10.4d) on a Mac with Node.js 24.9.0: the new
  test's carrier tells its close at once, and the new path (a `bufferedAmount` that throws) defers its close with the
  end for that reason; the existing slow-subscriber path does not. A different defect from 00068's (no member is read
  outside a guard), so filed and skipped.

## Problem

`connectChannel` registers its `end` as the channel's `onClose` listener (`src/runner/api-session.ts:408`). A slow
subscriber is disconnected from `SubscriptionConnection.#write` — inside the module's `emit` — by the carrier's
`disconnect()` (`:387-393`), which calls the host's `terminate()` (or `close()`) at once and defers only its own call of
`end` (`queueMicrotask(end)`, "so an unsubscribe never runs inside it"). A host's channel that tells its close in the
same turn calls `end` from inside `terminate()`: the connection's subscriptions are unsubscribed while the module's
`emit` is still running. `SubscriptionCarrier.disconnect`'s contract says the carrier "tells its end on a later turn,
never inside the caller's turn" (`:196`); the WebSocket carrier keeps it (`ws` tells a terminate's close later),
the channel carrier only when the host's channel does.

## Evidence

Probe (`node --import tsx`, Node.js 24.9.0, on `9bf97d6`): a module API with one subscription whose unsubscribe
records whether it ran inside the module's emit; `connectChannel` over a channel whose `close()` calls its close
listeners at once and whose `bufferedAmount()` is 1000 with `maxBufferedBytes: 10`; a `subscribe`, then one emit:
`{"unsubscribedInsideEmit":true}`.

## Suggested fix

In `disconnect()`, dispose of the connection's listeners (`disposers`) before the carrier's `terminate()`, so a close
told at once reaches no listener, and keep `queueMicrotask(end)` for the unsubscriptions; or move the `terminate()`
into the deferred end, as the `bufferedAmount` path does since `start-umbradb` P10.4d. A test: a channel whose
`terminate` tells its close at once, a slow subscriber, and the subscription still open right after the emit returns,
unsubscribed after it.
