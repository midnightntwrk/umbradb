# 00076 — The node source's first prefetch reads the whole window's hashes before it fetches the first block

- **Status:** OPEN
- **Area:** backbone (`core-block-fetch`'s node source, `src/backbone/core-block-fetch/node-source.ts`)
- **Severity:** low — performance at the start of a run: the first block is asked for only after `prefetchWindow /
  concurrency` round trips of hash reads (8 with the defaults, 64 and 8), about 2 s on a link 250 ms from the node, on
  every start and after every retry that begins a run. Nothing is wrong in what is committed.
- **Effort:** small to medium — let a height's block fetch go before the hash reads of heights above it (a slot queue
  ordered by height, or the block fetched in the same slot right after its hash), with a test of the order.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, while measuring issue 00075 (`start-umbradb` plan, P12.B): a WebSocket proxy logging every
  JSON-RPC call between the stats-module example and the preview node. Not this change's: filed and skipped.

## Problem

When the loop's run begins, `#fill` begins every height of the window at once (`#begin`, heights cursor + 1 to the
window's end). Each height's preparation (`#prepareFinalized`) takes a slot for `chain_getBlockHash`, releases it,
takes its turn at the queue, then waits for a slot again for `chain_getBlock`. Slots are handed out in the order they
were asked for (`#slot`: waiters pushed and shifted), and every height asked for its hash slot before any height asked
for its block slot, so the first height's block waits behind the hash reads of all the heights above it.

## Evidence

- `src/backbone/core-block-fetch/node-source.ts:584-590` — `#fill` begins every height of the window in one loop.
- `:610-619` — `#slot`: a FIFO of waiters (`#slots.push`, `#slots.shift`).
- `:626-660` — `#prepareFinalized`: the hash in one slot, the block in a second slot asked for after the take.
- The proxy's record (the stats-module example from a new database, `prefetchWindow` 64, concurrency 8, about 250 ms
  of round trip): 65 `chain_getBlockHash` calls (block 0's at startup, then heights 0–63 in 8 rounds, 2.0 s) before the
  first `chain_getBlock`; the blocks 0–7 were asked for together right after the last round. The measurements are in
  issue 00075.

## Suggested fix

Keep the window and the concurrency, but serve a lower height's block before a higher height's hash: order the slot
waiters by height (and by stage), or fetch the block in the same slot as its hash when the queue has no block of that
hash. Test with a node client whose calls are recorded (no network): the first `chain_getBlock` is asked for before the
hash of height cursor + 1 + concurrency, and the `on-finalized` and height orders are unchanged.
