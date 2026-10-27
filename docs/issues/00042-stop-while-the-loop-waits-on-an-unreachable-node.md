# 00042 — A stop while the loop waits on an unreachable node does not end the process

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

Task 5.3b made a stop during startup end every wait of startup for the node at once: the process closes its node
client, and its block source, as soon as it is stopped while still `starting` (RN-13 as amended). Once the loop runs,
`ProcessHandle.stop()` and SIGTERM still close the node client only after the loop ended (`#close` awaits `ended`
first), and the loop asks the node source for a height without its signal. So when the node becomes unreachable while
the loop waits for a node call outside a height's transaction — the next height's `chain_getBlockHash` or
`chain_getBlock` in the finalized prefetch, or `midnight_ledgerStateRoot` that `core-ledger-state`'s `on-compute`
awaits —, the client retries that call without limit (IN-10) and the stop waits for it: the process stays `stopping`
until the node answers again, or until a second signal ends it through Node.js's default handler. No transaction is
open at those points, so RN-13's "start no new height, let a block whose transaction is open commit or roll back, and
then exit" is not met, nor design §2's "a stop ends the wait".

Found by task 5.3b (2026-10-27) while looking for every node call startup makes; read from the code, not reproduced by
a test. Task 5.3b's change covers startup only, as its task and A167 say.

## Evidence

- `src/runner/process.ts` `#close`: `await this.ended;` before `await this.#closeNode();` in its `finally`.
- `src/runner/loop.ts:790`–`793` (`#begin`): `await source.prepared(height)`, else `await source.block(height)`; neither
  is given the loop's signal.
- `src/backbone/core-block-fetch/node-source.ts:285` (`prepared`) awaits the prefetch, whose `#prepareFinalized`
  (`:556`) calls `this.client.blockHash(height)` (`:571`) and `this.client.block(hash)` with the client's retries and no
  signal.
- `src/backbone/core-ledger-state/core-ledger-state.ts:465`: `source.ledgerStateRoot(…)`, awaited in `on-compute`.
- `src/node/client.ts` `#withRetry`: a retryable failure is retried "without limit, until it is answered, fails
  otherwise, is aborted by its `signal`, or the client is closed".

## Suggested fix

At a stop while the loop runs, end the node calls the loop awaits outside a height's transaction: either give the
node source's finalized calls the loop's signal (`BlockSource.prepared(height, signal)`, `block(height, signal)`, the
client's `signal` option), the loop ending with `signal` when they abort; or close the node client at once when the
stop finds no transaction open (the loop would report whether one is). Test it as A167 does: a node that answers up to
a height and then refuses connections, a stop while the loop waits for the next height, the process ends within 5 s
with no connection attempt after the stop.
