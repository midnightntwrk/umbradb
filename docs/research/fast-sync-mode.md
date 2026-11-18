# Fast-sync mode: chunks of blocks in one transaction

Far behind the finalized head, the finalized loop (`src/runner/loop.ts`) can store a chunk of consecutive heights
a..b in one database transaction instead of one transaction per block. Every block still runs every point, and no
module is told which way its block is stored: the engine moves the `BEGIN`, the `COMMIT` and what follows them. With
the mode off, and for a height processed alone, the loop's path is the one it had before. This note says what a chunk
does, why, and why it stores what the mode off stores.

## 1. The setting, and when a chunk forms

`fastSync: { blocks, distance }` on a public process's `core` entry, operational, `{ blocks: 0, distance: 600 }` by
default: off while `blocks` is below 2, `blocks` at most 1,000 (`src/config/core-settings.ts`). `chunkEnd`
(`src/runner/fast-sync.ts`) gives a chunk's last height as the lowest of first + `blocks` − 1; the head less
`distance` (the head the loop read for its pass, so a chunk holds only heights at least `distance` behind it); the end
of the range of the resolved graph holding first, or of the `core` entry's revision covering it; and the loop's last
height. A chunk holds two blocks or more; any other height is processed alone.

The graph's ranges split at every module revision's start and stop, so inside a chunk no entry starts or stops and no
setting a callback reads changes: `on-start-height` can fall only on a chunk's first block and `on-stop-height` only
on its last. The `core` entry's revisions are not in the graph, so the core revision's end bounds a chunk too. The
bound of 1,000 bounds what a chunk keeps until its `COMMIT`: its blocks' items, the ledger worker's kept parses, the
held trace records. A private process, and a public process that waits for private instances at every block
(`lockstepInstances`), store one block per transaction.

## 2. A chunk's blocks are taken before its transaction

The loop takes every block of the chunk first, in height order, with nothing open: from the source as it prepared
it (`on-fetch` and `on-parse` run by the source's queue), else from the source with those points run by the loop. It
keeps each with its items as `on-parse` left them for the rest of its run. A take that fails at j makes the chunk
a..j − 1, and the failure is thrown when the loop reaches j, without asking the source or calling j's callbacks again.
So while a transaction is open the loop awaits nothing of the source: on PGlite a module's read at `on-fetch` or
`on-parse` cannot wait behind a transaction that waits for that block, and a stop or a pause never waits for the node
with a transaction open. The cost: with `prefetchWindow` below `blocks`, a chunk waits for the heights above the
window before its `BEGIN`.

## 3. Each point, for block k of a chunk a..b

| Point | When | Handle |
|---|---|---|
| `on-best-block`, `on-rollback` | the source's queue | none |
| `on-finalized` | once per head read, before its heights, never while a transaction is open | own read at the cursor |
| `on-fetch`, `on-parse` | when the block is taken, before the `BEGIN` | none |
| `on-start-height` | at a only, before the `BEGIN` | own read at a − 1 |
| `on-compute` | k = a: before the `BEGIN`; k > a: after k − 1's cursor check, its callbacks one at a time | k = a: own read at a − 1; k > a: a read-only view of the transaction at k − 1, opened at the callback's first statement |
| `on-db-write` | in the transaction, in order | block write handle at k − 1 |
| `on-settle` | after k's `on-db-write`, before its cursor check; the run `{ k, k }` | block write handle |
| `on-after-db-write` | after the chunk's `COMMIT`, each block in height order | own read at b |
| `on-stop-height` | at b only, after its `on-after-db-write` | own read at b |

At the `COMMIT`'s answer the transaction's follower (the ledger worker's host) is told `committed` for a..b in height
order and the process's observer once, with b; then each block's `on-after-db-write` runs in its own window. A restart
re-delivers the last committed block's callbacks only, as before.

## 4. Reads while a chunk's transaction is open

The transaction has one user at a time, in arrival order: a block's writes, one `on-compute` callback's read view, or
one read view of `FinalizedLoop.read`. Every view opens in one place, `openView`. The process's ledger worker host
reads stored nodes through `FinalizedLoop.read`, so a request given no read (a parse of a block above the chunk) finds
the nodes the chunk wrote; the host still answers first from the read of a request in flight or a lent read. The
source's finality check asks for the hash stored at heights up to the last taken: a height taken and not committed is
answered from the block taken, any other through a read. The chunk's callbacks run inside the body of its transaction,
so on PGlite a module's `db.read` there is refused with `nested-call`, as with one block. Other readers see committed
data on PostgreSQL, up to `blocks` heights behind what is written, and wait for the `COMMIT` on PGlite.

## 5. `continues` inside a chunk

For the second and later blocks, `continues` is true when the block before was written in the transaction still
open, by the writer's session that holds it, with no failure since: no other writer can have changed a row, and this
block is written in the same transaction, so what a module kept of the block before is what the database holds for
this block. For a chunk's first block the rule is the one of a block alone. It is false at the first block after any
rollback and at every block stored again; the loop's record of the last stored block is cleared at a rollback. The
checks on the writer's session stay.

## 6. The ledger worker across a chunk

The engine holds the state the next block is applied on and one pending state. `core-ledger-state` asks it to hold
the state at h − 1 before every apply; when it holds that state pending, it makes it the base at once. So inside a
chunk no pending state is dropped. But that state is then only written in the open transaction, and the package
counts every node it flushed as stored. If the transaction rolls back, the blocks applied again would flush none of
those nodes. So the host notes each block written and not committed that a `load` names or that is an `apply`'s
parent; `committed(h)` forgets the notes at or below h, and any restart all of them; at `rolledBack`, with a note left,
it restarts the thread, so the blocks made again load the state before them from the database. With one block per
transaction nothing is ever noted. A list of pending states was not chosen: a package refuses to forget a node a live
state holds, so every eviction inside a chunk could be refused.

## 7. The failure rule

A failure of block k is handled as a block alone handles it at k; what was written below k is committed where the
transaction allows, and stored again one block per transaction where it does not. A block stored again runs from
`on-compute` with its items as `on-parse` left them and `continues` false; nothing is fetched or parsed again.

| Failure | What happens | Against one block per transaction |
|---|---|---|
| taking block j | the chunk is a..j − 1; j fails when reached | the same |
| k > a before its first write | `COMMIT` at k − 1, its callbacks, then k's failure (a retryable one holds k) | the same |
| k's writes, not retryable | rollback; a..k − 1 stored again; k's kept failure thrown, k not called again | the same halt |
| retryable while open | rollback; the chunk held; the next run stores a..k − 1 again and k alone | the same from the retry on |
| the `COMMIT` answered with an error | a..b stored again; the block whose own `COMMIT` fails halts | the same |
| the `COMMIT`'s answer lost | held; the next run's cursor read decides: committed, or stored again | as a held height |
| `on-after-db-write` of block j | halt at j, committed; the blocks above j get no such callbacks | the cursor is b, not j |
| the worker traps in a block's writes | the blocks stored again fail at a | the cursor is a − 1, not k − 1 |
| a crash | the database at a − 1 | as before, from a − 1 |

No chunk forms at or below the highest height of a chunk that did not commit until the cursor reaches it, so a
failed chunk is never formed again and every remake goes through the path of a block alone. A failure of a block
stored again is its own; a failure kept for a block above it is dropped and logged when that block stops processing.

## 8. Where a chunk ends early

Before each block k > a, the loop's signal or a pause hold ends the chunk at k − 1 with its `COMMIT`. A callback of
k's `on-compute` that calls `blockBeforeCommitted()` before its first statement ends it there too: the transaction
commits, the call resolves, the rest of k's `on-compute` runs with no transaction open, then the callbacks after the
commit of a..k − 1, then k's writes open the next transaction. No callback runs twice. `core-ledger-state` calls it
when nothing is kept of the block before or its ledger differs: the conversion reads the whole state at h − 1 from the
node tables and may take minutes, so it reads committed rows and no transaction holding other blocks stays open.

## 9. Trace, slow windows, status

A block's trace record is held when its writes end, marked `chunk: [a, b]` at the `COMMIT` (with more than one block),
and written in height order with the block's own work after it, so `sh` at every line is what the mode off gives.
`beginMs` of the first line holds every block's take; `txMs` is each block's part, the first's with the `BEGIN`, the
last one's with the `COMMIT`. A rolled-back chunk leaves no line. A block's slow window is told `ended` at the
`COMMIT` or the rollback. `/status`'s cursor moves at the `COMMIT`.

## 10. Equality

At every height the database holds, row for row in every table of every schema, what the mode off holds, with the
same digests and checkpoints, for the same history of worker restarts.

- Every block runs the same callbacks, with the same handles at the same heights, but `on-after-db-write`, which
  changes nothing stored.
- A read through a view of the open transaction at k − 1 sees exactly the rows a read of the committed height k − 1
  sees with the mode off: nothing else writes between, and the view cannot write.
- `continues` is true only where what a module kept is what the database holds.
- Every `on-settle` run is `{ k, k }`, and `core-digest` takes a block's captured changes at its settle, deleting the
  shadow rows it reads, so each height's digest is its own.
- The ledger worker applies every block on the same state; after a rollback it is restarted, which a run with the mode
  off restarted at a − 1 matches. A worker restart can change the form a later node is stored in, in either mode, so a
  rolled-back chunk is compared with such a run, and every other path with the plain run.

The tests check it at every height inside the transaction, after each block's cursor check, and at every committed
height, on both backends: `test/backbone/fast-sync-equality.test.ts`, `fast-sync-failures.test.ts`,
`fast-sync-feature-module.test.ts`, `fast-sync-worker.test.ts` and, on the recorded devnet,
`fast-sync-tape-devnet.test.ts`.
