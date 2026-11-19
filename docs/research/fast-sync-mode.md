# Fast-sync mode: chunks of blocks in one transaction

Far behind the finalized head, the finalized loop (`src/runner/loop.ts`) can store a chunk of consecutive heights
a..b in one database transaction instead of one transaction per block. Every block still runs every point, and no
module is told which way its block is stored: the engine moves the `BEGIN`, the `COMMIT` and what follows them. With
the mode off, and for a height processed alone, the loop's path is the one it had before. This note says what a chunk
does, why, and why it stores what the mode off stores.

## 1. The setting, and when a chunk forms

`fastSync: { blocks, distance }` on a public process's `core` entry, operational, `{ blocks: 0, distance: 600 }` by
default (`FAST_SYNC_DEFAULT` of `src/runner/fast-sync.ts`, which the schema of `src/config/core-settings.ts` takes
its defaults from): off while `blocks` is below 2, `blocks` at most 1,000. `chunkEnd`
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

## 2. What a chunk needs from the source comes before its transaction

**The blocks.** The loop takes every block of the chunk first, in height order, with nothing open: from the source as
it prepared it (`on-fetch` and `on-parse` run by the source's queue), else from the source with those points run by
the loop. It keeps each with its items as `on-parse` left them for the rest of its run.

**A take that fails** at j makes the chunk a..j − 1. The failure is kept for j until the loop reaches j:
- a retry or a new run of the blocks below j keeps it;
- no chunk is planned across j, so j is never taken again and its callbacks are not called again;
- the loop processes j alone, and the failure is thrown there, as j's;
- it is dropped, and logged, only when a block below j stops processing (a failure that is not retried).
A kept failure that is retryable is retried once it was thrown at j, as with the mode off.

**The answers.** After the first block's `on-compute` and before the `BEGIN`, the loop waits until the source holds
what the callbacks of the later blocks ask it for from `on-compute` on (`BlockSource.answered`). The node source holds
the ledger state root of each block, which `core-ledger-state`'s `on-compute` compares: it asks the root if its
prefetch has not, and keeps the answer, or the failure, for the callback. That root is the only call a core module
makes to the node after `on-parse` (block 0's genesis state is asked at a chunk's first block, before the `BEGIN`).
The module does not change: it asks the source as before, and inside a chunk the answer is already there. An answer
that is a failure reaches the block's `on-compute`, which fails before its first write, so the chunk commits at the
block before and the loop halts at that block, as with the mode off. The source knows what is asked from the first
root asked in a run, which a chunk's first block asks before the `BEGIN`.

**So nothing in an open transaction waits for the chain.** A stop, a pause or a lost database connection met while a
chunk is open is bounded by the chunk's own work: the stop and the pause end the chunk before its next block (§8), a
lost connection fails the next statement. While the loop waits for a block or an answer, no transaction is open: the
process's stop closes the node client at once, the pending calls fail, the loop's signal ends the wait, and the
chunk's first block, already computed, is stored alone before the loop returns. On PGlite a module's read at
`on-fetch` or `on-parse` cannot wait behind a transaction that waits for that block.

The cost: with `prefetchWindow` below `blocks`, a chunk waits for the heights above the window before its `BEGIN`. A
root the prefetch asked is kept until `on-compute` has asked for the root two heights above it, so the takes of a
chunk do not drop the roots of its blocks.

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
| the block's end | k < b: after k's cursor check, where a block alone would `COMMIT` (§4a) | the engine's own statements |
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

## 4a. A block's end inside a chunk

With one block per transaction, the `COMMIT` ends the block: it checks the deferred constraints, fires the deferred
triggers, and the next block starts in a new transaction. Inside a chunk, after the cursor check of each block that is
not the chunk's last, the engine sends the block's end (`src/db/block-end.ts`):

1. One read, at every end: whether any constraint is deferrable, and what the transaction cannot give the next block
   as a new one would. When it finds any of the three things below, the chunk commits at this block, and the heights
   up to its planned end are stored one per transaction.
2. `SET CONSTRAINTS ALL IMMEDIATE; SET CONSTRAINTS ALL DEFERRED`, one text on the transaction's control path, sent
   just before the read and together with it. The first statement checks every pending deferred constraint and fires
   every pending deferred constraint trigger. One that fails gives the error the `COMMIT` gives (the same SQLSTATE)
   and aborts the transaction: the failure is this block's, handled as a failure of its writes (§7). The second puts
   every deferrable constraint in deferred mode again, which is the mode a new transaction gives the constraints
   declared `INITIALLY DEFERRED`, whatever a callback set with `SET CONSTRAINTS`. The text is left out while the
   transaction's last end read that no constraint is deferrable, since nothing can then be pending; if this end's
   read finds one after all (the block made it), the text is sent then and the read once more.

The chunk's last block gets no end: its `COMMIT` follows. A height stored alone, and every height with the mode off,
sends none.

| What a transaction's end does | Inside a chunk, at a block's end |
|---|---|
| checks the deferred constraints | checked by the engine; a failure is the block's, with the `COMMIT`'s error |
| fires the deferred constraint triggers | fired by the same statement; the next block reads what they wrote |
| returns each constraint to its declared mode | `INITIALLY DEFERRED`: deferred again by the engine. `DEFERRABLE INITIALLY IMMEDIATE`: no statement restores one constraint's mode, so the chunk ends at this block |
| runs the `ON COMMIT` action of temporary tables | no catalog says which action a table has, so the chunk ends at a block that leaves a temporary table or sequence in the writer's session |
| closes the cursors declared without `WITH HOLD` | the chunk ends at a block that leaves one open |
| ends `SET LOCAL`, `set_config(…, true)`, `SET TRANSACTION` | not restored: the setting lasts to the chunk's `COMMIT` (a difference, §10) |
| releases transaction-level advisory locks and row locks | not released: other sessions wait until the chunk's `COMMIT`; the writer's own blocks hold them already |
| delivers `NOTIFY` | delivered at the chunk's `COMMIT`, equal notifications of its blocks once |
| sequences | nothing at either end: a sequence's value is no part of a transaction. A chunk that rolls back has advanced it by the values of all its blocks |
| savepoints, prepared transactions | a module's handle refuses `SAVEPOINT`, `RELEASE`, `ROLLBACK TO` and `PREPARE TRANSACTION` in both modes |
| `now()`, the transaction id | the chunk's, the same for all its blocks |

A deferrable constraint that a block creates after the chunk's first block is deferred until that block's end,
whatever its declaration; the chunk then ends there if it is initially immediate.

The cost per block of a chunk but its last, measured on the tests' servers (3,000 ends in one transaction, about 375
rows in `pg_constraint`; a one-parameter `SELECT` took 0.15 to 0.20 ms there on PostgreSQL 18 and 0.11 ms on PGlite
0.5.10):

| The database has | Statements per end | PostgreSQL 18 | PGlite 0.5.10 |
|---|---|---|---|
| no deferrable constraint (UmbraDB's own schema) | 1, the read (3 at a chunk's first end) | 0.18 to 0.21 ms | 0.22 ms |
| a deferrable constraint | 3: the text of two and the read, sent together | 0.20 to 0.21 ms | 0.31 to 0.34 ms |

Through the loop, traced, 600 heights of the tests' modules in chunks of 100 on PostgreSQL: the read was sent 594
times, 0.22 ms each, and the text 6 times, or 594 times, 0.18 ms each, with a deferrable constraint; a block's trace
line held 22.4 statements (23.3 with the constraint) against 25.3 with the mode off.

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

What the worker's package holds inside a chunk is not what it holds with the mode off: every block of the chunk is
parsed before the chunk's first apply, and the worker keeps each block's parse until the chunk's `COMMIT`, where the
mode off releases it at the block's own (`release` follows `committed`). When an eviction finds a swept node held by
a kept transaction, the worker frees every kept parse and those transactions are parsed again at their apply. So a
node that is already stored may be flushed again, or read from the store, at another block than with the mode off.
A node flushed again with the child list its row holds is counted unchanged and writes nothing, so the rows are the
same; a row would differ only if the package flushed a stored node with another child list (a rewrite), which no run
measured did (§11).

## 7. The failure rule

A failure of block k is handled as a block alone handles it at k; what was written below k is committed where the
transaction allows, and stored again one block per transaction where it does not. A block stored again runs from
`on-compute` with its items as `on-parse` left them and `continues` false; nothing is fetched or parsed again.

| Failure | What happens | Against one block per transaction |
|---|---|---|
| taking block j | the chunk is a..j − 1; j's failure is kept for j, and thrown when the loop reaches j, alone (§2) | the same |
| k > a before its first write | `COMMIT` at k − 1, its callbacks, then k's failure (a retryable one holds k) | the same |
| k's writes, not retryable (its end among them, §4a) | rollback; a..k − 1 stored again; k's kept failure thrown, k not called again | the same halt |
| retryable while open | rollback; the chunk held; the next run stores a..k − 1 again and k alone | the same from the retry on |
| the `COMMIT` answered with an error | a..b stored again; the block whose own `COMMIT` fails halts | the same |
| the `COMMIT`'s answer lost | held; the next run's cursor read decides: committed, or stored again | as a held height |
| `on-after-db-write` of block j | halt at j, committed; the blocks above j get no such callbacks | the cursor is b, not j |
| the worker traps in a block's writes | the blocks stored again fail at a | the cursor is a − 1, not k − 1 |
| a crash | the database at a − 1 | as before, from a − 1 |

No chunk forms at or below the highest height of a chunk that did not commit until the cursor reaches it, so a
failed chunk is never formed again and every remake goes through the path of a block alone. A failure of a block
stored again is its own. A failure kept for a block above it (of that block's writes, or of its take) stays kept while
the blocks below are retried, and is dropped and logged only when one of them stops processing.

## 8. Where a chunk ends early

Before each block k > a, the loop's signal or a pause hold ends the chunk at k − 1 with its `COMMIT`, and so does a
block's end that the transaction cannot go on from (§4a). A callback of k's `on-compute` that calls
`blockBeforeCommitted()` before its first statement ends it there too: the transaction commits, the call resolves, the
rest of k's `on-compute` runs with no transaction open, then the callbacks after the commit of a..k − 1, then k's
writes open the next transaction. No callback runs twice. Every call for one block gets the same commit: a second call
made while the commit is pending resolves with it, not before. The function is the callback's: kept and called after
the callback returned, or at another point, it throws and ends no chunk. `core-ledger-state` calls it when nothing is
kept of the block before or its ledger differs: the conversion reads the whole state at h − 1 from the node tables and
may take minutes, so it reads committed rows and no transaction holding other blocks stays open.

## 9. Trace, slow windows, status

A block's trace record is held when its writes end, marked `chunk: [a, b]` at the `COMMIT` (with more than one block),
and written in height order with the block's own work after it, so `sh` at every line is what the mode off gives.
`beginMs` of the first line holds every block's take, and its `prepareMs` the wait for the source's answers; `txMs`
is each block's part, the first's with the `BEGIN`, the last one's with the `COMMIT`, and a block's end is counted in
its own line (`sqlN`, `txMs`). A rolled-back chunk leaves no line. A block's slow window is told `ended` at the
`COMMIT` or the rollback. `/status`'s cursor moves at the `COMMIT`.

## 10. Equality, and where the modes differ

At every height the database holds, row for row in every table of every schema, what the mode off holds, with the
same digests and checkpoints, for the same history of worker restarts, provided no callback's writes depend on what
§4a lists as lasting to the chunk's `COMMIT` (a transaction-scoped setting an earlier block made, `now()`, the
transaction id, a sequence's value). The module guide tells authors so.

- Every block runs the same callbacks, with the same handles at the same heights, but `on-after-db-write`, which
  changes nothing stored.
- A read through a view of the open transaction at k − 1 sees exactly the rows a read of the committed height k − 1
  sees with the mode off: nothing else writes between, the view cannot write, and the deferred triggers of k − 1
  fired at its end.
- A block that the mode off refuses at its `COMMIT` is refused at its end with the same error, and a block that
  breaks and repairs a deferred constraint itself is stored at every place in a chunk.
- `continues` is true only where what a module kept is what the database holds.
- Every `on-settle` run is `{ k, k }`, and `core-digest` takes a block's captured changes at its settle, deleting the
  shadow rows it reads, so each height's digest is its own.
- The ledger worker applies every block on the same state; after a rollback it is restarted, which a run with the mode
  off restarted at a − 1 matches. A worker restart can change the form a later node is stored in, in either mode, so a
  rolled-back chunk is compared with such a run, and every other path with the plain run.

Where the modes differ:
1. A failure of `on-after-db-write` of block j leaves the cursor at the chunk's last block, not at j, and the blocks
   above j get no such callbacks.
2. A ledger worker that traps in a block's writes leaves the cursor at a − 1, not at k − 1.
3. A finality conflict the source records while a chunk is open stops the loop at its next call to the source, once
   the chunk committed: at the height above the chunk, at most `blocks` heights later than the mode off, which halts at
   the next height.
4. What lasts to the chunk's `COMMIT` (§4a): transaction-scoped settings, locks other sessions wait for, `NOTIFY`,
   `now()` and the transaction id; and a sequence a rolled-back chunk advanced.
5. A stop met while the loop waits for a chunk's later blocks or their answers stores the chunk's first block, whose
   `on-compute` has run, before the loop returns; the mode off stores nothing of the height it waits for.

The tests check the equality at every height inside the transaction, after each block's cursor check, and at every
committed height, on both backends: `test/backbone/fast-sync-equality.test.ts`, `fast-sync-failures.test.ts`,
`fast-sync-feature-module.test.ts`, `fast-sync-worker.test.ts` and, on the recorded devnet,
`fast-sync-tape-devnet.test.ts`. The block's end: `test/db/block-end.test.ts`,
`test/runner/loop-chunk-block-end.test.ts`. A kept take failure: `test/runner/loop-chunk-preparation.test.ts`. The
source's answers and a stop: `test/runner/loop-chunk-source-answers.test.ts`, `loop-stop-chunk.test.ts`. A failure at a
chunk's first and last block: `test/runner/loop-chunk-positions.test.ts`. The third difference:
`test/runner/loop-chunk-finality.test.ts`.

## 11. Measured

Preprod, four ranges of 1,500 heights (A to D), PostgreSQL 18, the block trace on, every row of every table hashed;
the build before the block's end and the source's answers were added (the block's end adds one statement per block,
§4a). Chunks of 100 and of 1,000 against the mode off on the same build.

- **Data.** All 30 tables were equal, row for row, between chunks of 100 and the mode off (9 pairs of runs) and
  between chunks of 1,000 and the mode off (2 pairs), with the same chain of step outputs at every height. No run
  restarted its worker or had an eviction refused.
- **Speed.** By itself this change does not make a sync faster. Chunks of 100 ran at 0.98 to 1.03 times the mode
  off's heights per second (runs of one configuration differ by 1% to 16%). Chunks of 1,000 ran at 0.93 (A) and 0.85
  (D).
- **Where the time moves, per block, chunks of 100.** Statements: 10.4 to 10.9 fewer (50.6 → 39.7 on A, 63.2 → 52.9
  on D): one `BEGIN` and one `COMMIT` per chunk, and read views in place of the three read-only transactions a block
  opens. The reads before a block's compute: 1.0 to 1.6 ms → 0.1 to 0.2 ms. Against that, the reclamation's net write
  rises by 0.5 to 1.7 ms (3.10 → 3.57 on A, 5.21 → 6.90 on C), all of it in one statement, the merge of the count
  changes into the counts table.
- **Why 1,000 is slower.** That merge slows with a block's place in its chunk: on D 1.1 times the mode off's at
  places 1 to 100, 2.0 at 401 to 500, 2.5 at 901 to 1,000. Over a run the net write was 3.16 → 5.14 ms per block on A
  and 8.08 → 14.77 on D. So `blocks` above about 100 costs more than it saves until the counts are written once per
  chunk, which this change does not do.
- **Latency and memory.** A block of a chunk of 100 is committed 0.7 to 1.9 s (mean) after its writes end, of a chunk
  of 1,000 5 to 12 s. With chunks of 1,000 the process's resident memory at the end was 62 (A) and 160 MiB (D) above
  the mode off's.
- **The worker's work.** In six of the eleven chunk runs the worker's work differed from the mode off's at 2 or 3
  heights: four stored nodes flushed again at one block and not at another (one run), one stored node read from the
  store at another height (five runs). Over each run the flushed nodes were the same in number (new, and unchanged),
  none was rewritten in any run of either mode, and the net writes and the tables were equal. §6 says what in a chunk
  moves that work; which eviction did it in those runs was not established.
