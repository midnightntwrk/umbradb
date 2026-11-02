# 00074 — `/status`'s finalized head, the lag and readiness stay at the head the loop read when its batch began

- **Status:** OPEN — waiting on the owner's decision (`start-umbradb` plan, question Q-29): `core-arch`'s design defines
  the lag as "the head the loop last read minus the cursor", so following the latest head is a design amendment.
- **Area:** runner (the process's state, `src/runner/process.ts`; the finalized loop, `src/runner/loop.ts`); admin
  (`/status`)
- **Severity:** medium — while the process syncs, `status().head`, `/status`'s `node.finalizedHead`, the lag, the
  state and readiness describe the chain as it was when the current batch began, which on a new database is the chain's
  head when processing began. The lag is understated for the whole batch, and near its end the process reports
  `following` and ready, then falls back to `syncing` when the loop reads the head again: readiness flaps.
- **Effort:** small to medium — a side-effect-free read of the source's latest finalized head on the block-source
  interface, implemented by every source (node, in-memory, private, the browser's), read by `status()`; processing and
  every `on-finalized` order unchanged. Plus the design amendment.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, by a user run of the README on `v0.10.0-rc.1` (finding 6), checked on the branch
  `00028-core-arch` (`00b7437`): the same loop since rc.1.

## Problem

The loop reads the source's finalized head once per batch, then processes every height up to it before reading it
again. The process learns the head only through that read (the loop observer's `head`), so whatever the node finalizes
during the batch shows nowhere until the batch ends. `/status`'s best head (`nodeView().bestHead`) follows the node
live, so the two heads `/status` shows can be far apart.

A probe on the branch (PGlite in memory, an in-memory chain at head 400, a module whose `on-db-write` takes 3 ms; at
cursor 10 the source finalized 600): of 183 samples of `status()`, the 173 with the cursor below 400 all read head
400 — at cursor 398, lag 2, `following` — and the next read, at cursor 416, head 600, lag 184, `syncing`.

## Evidence

- `src/runner/loop.ts:565` — `head = await source.finalizedHead()`, once per batch; `:578` — the batch, every height to
  `head.height`.
- `src/runner/process.ts` — the loop observer's `head` sets the process's head; `statusOf` computes the lag, the state
  and readiness from it.
- `src/backbone/core-block-fetch/node-source.ts:270-275` — `finalizedHead()` records the head it returns as
  `#announced` (the prefetch's bound, which orders that head's `on-finalized` before its heights), so calling it more
  often for reporting would change processing.
- `openspec/changes/core-arch/design.md:117` — "`syncing` or `following` by the lag (the head the loop last read minus
  the cursor)"; AE-3: "**Lag** is, for the core, the node's finalized head minus the cursor".

## Suggested fix

If the owner chooses to follow the latest head (Q-29, option 1): amend the design's sentence; add to the block-source
interface a read of the latest finalized head the source knows, without side effects — the node source's head kept from
its finalized subscription, the in-memory source's `head`, the private source's last public cursor read — and have
`status()` report it, leaving the loop's per-batch read as it is. Test on both backends: the probe above, committed (the
head reaches 600 while the cursor is still below 400, the lag computed from it), and the existing `on-finalized`
ordering tests unchanged.
