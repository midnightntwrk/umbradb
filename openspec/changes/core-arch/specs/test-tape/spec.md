# Spec delta — `test-tape` capability

EARS forms and terms as in `specs/runner/spec.md`. A **tape** is a recording of a Midnight node's JSON-RPC
interactions that replaces the node in tests.

## ADDED Requirements

### Requirement: TT-1 The tape file format

THE system SHALL read and write tapes as JSON-lines files, one record per line in recorded order, of four kinds:
`{ "method", "params", "result" | "error", "delayMs"? }` (a call, answered after `delayMs` milliseconds when present);
`{ "subscribe": id, "method", "params" }` and `{ "notify": id, "result" }` (a subscription and its notifications);
`{ "disconnect": true }`; and `{ "fault": "timeout" | "error", "method", "params", "code"? }`. A tape SHALL be
identified by the SHA-256 of its bytes. IF a line is not one of these kinds THEN reading the tape SHALL fail with the
line number.

#### Scenario: A malformed line
- **WHEN** a tape's line 12 is `{"foo": 1}`
- **THEN** loading fails with `bad-tape-record` at line 12

### Requirement: TT-2 The tape node answers calls by occurrence

THE tape node SHALL serve a tape over WebSocket JSON-RPC 2.0 and SHALL answer the k-th call with a given method and
parameters with the k-th recorded answer for that pair, and the last recorded answer after that; IF no answer is
recorded for the pair THEN it SHALL answer a JSON-RPC error `not-on-tape` naming the method.

#### Scenario: A changing answer
- **WHEN** a tape records `chain_getFinalizedHead` three times with heads A, B, C, and a client calls it four times
- **THEN** the client receives A, B, C, C

#### Scenario: A delayed answer
- **WHEN** a call record carries `"delayMs": 2000`
- **THEN** the tape node answers that call about 2 s after receiving it, and the next recorded answers without delay

### Requirement: TT-3 Subscriptions, disconnects and faults

THE tape node SHALL deliver a subscription's notifications in file order once every call recorded before them has
been answered; on a `disconnect` record it SHALL drop the connection, and the records after it SHALL belong to the next
session; on a `fault` record it SHALL make the next matching call time out (no answer) or fail with the code.

#### Scenario: Reconnecting after a dropped subscription
- **WHEN** a tape holds two notifications, a `disconnect`, then a `subscribe` and two more notifications
- **THEN** a client receives two notifications, sees the connection drop, reconnects, subscribes again, and receives
  the other two

### Requirement: TT-4 The recording builder and its variants

THE system SHALL provide a tape builder that records a tape by proxying a client's WebSocket JSON-RPC session to a real
node, writing every call, subscription and notification in order; and SHALL provide variant transforms over a tape:
drop, repeat or skip notifications of a subscription; insert a `disconnect` after a record; delay answers (setting
`delayMs`); replace an
answer by an error (e.g. state unavailable); and splice another tape's notifications for a range (for a best-chain
switch recorded on a devnet). IF a node's answer or notification is not written as the tape node will replay it
THEN the builder SHALL refuse the recording (`cannot-record`, `not-replayable`), naming the frame, and write nothing of
it (owner decision Q111).

#### Scenario: Record and replay give the same session
- **WHEN** a client session against a local devnet node is recorded, and the same client is then run against the tape
  node serving that tape
- **THEN** the client receives byte-identical answers and notifications in the same order
