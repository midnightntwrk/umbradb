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
height. A chunk holds two blocks or more; any other height is processed alone. A chunk forms only while nothing exists
in the database that a `COMMIT` would act on (§4a).

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

**A take that fails** at j makes the chunk a..j − 1. The failure is kept for j until the loop reaches j (§7): j is
not taken again, and its callbacks are not called again.

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
lost connection fails the next statement. On PGlite a module's read at `on-fetch` or `on-parse` cannot wait behind a
transaction that waits for that block.

**A stop or a pause asked before the `BEGIN`** ends what the chunk waits for, and the chunk is then its first block,
stored as a height alone is:
- during the takes, no block is taken after the one in flight;
- during the wait for the answers, the wait ends at once, and nothing is asked ahead when the stop or the pause came
  before it.
The blocks taken above the first are kept for when the loop goes on, and the source is asked for their answers again
then. So a pause is reached after the first block, and a stop returns after it, without the node.

**A node that does not answer.** With the mode off, a block's `on-compute` that waits for a root the node does not
give waits: the node client retries without limit; a stop ends the call and the loop; a pause is reached only once
that block is done, so it waits as long as the node does. With chunks, the wait for the roots of a + 1..b comes one
block earlier, before a's `BEGIN`: the node client retries the same way, a stop ends the wait, and a pause ends it
too. Once a is stored alone the loop is where the mode off is: at the next block, whose root is not there. One
difference remains (§10): while neither a stop nor a pause is asked, a is computed and not yet stored for as long as
the node does not answer, where the mode off has stored it.

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
| the read at the block's end | after k's cursor check, at every block of the chunk (§4a) | the engine's own statement |
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

## 4a. What a transaction's end does, and why a chunk holds no block that needs it

With one block per transaction, the `COMMIT` ends the block: it checks the deferred constraints, fires the deferred
triggers, runs the `ON COMMIT` action of temporary tables, closes or keeps the open cursors, and the next block starts
in a new transaction. No statement inside a transaction does what its end does. `SET CONSTRAINTS ALL IMMEDIATE` is
not it: it makes every constraint immediate before the pending triggers fire, where a `COMMIT` fires them with the
constraints still deferred, so a deferred trigger that inserts a child row and then its parent through a deferred
foreign key passes at a `COMMIT` and fails with `23503` under that statement. So nothing of a transaction's end is
done inside a chunk. The rule instead: **a chunk holds only blocks for which a transaction's end has nothing to do but
make their writes durable.**

**The read.** One statement (`STATE` of `src/db/block-end.ts`, the same text on both backends, with one parameter)
answers whether anything exists that a `COMMIT` acts on:

```sql
SELECT EXISTS (SELECT FROM pg_catalog.pg_constraint WHERE condeferrable)
  OR EXISTS (SELECT FROM pg_catalog.pg_trigger WHERE NOT tgisinternal AND (tgconstraint <> 0 OR tgdeferrable))
  OR (pg_catalog.pg_my_temp_schema() <> 0 AND EXISTS (SELECT FROM pg_catalog.pg_class WHERE relnamespace = pg_catalog.pg_my_temp_schema()))
  OR EXISTS (SELECT FROM pg_catalog.pg_cursors WHERE name <> $1) AS acts
```

The parameter is the empty name, the protocol's unnamed cursor the statement itself runs in. It changes nothing.

**Where it is sent.**
- Once, in a transaction of its own on the writer, before a run's first chunk would form (and again whenever the last
  answer is not known: after a block stored without the read, after a transaction that did not commit).
- At the end of each block of a chunk, its last block included, after the cursor check. When it finds something the
  chunk commits at that block, so whatever the block left for its transaction's end is done by a real `COMMIT`, at its
  own block, as with the mode off.
- While it finds something, at the end of each block stored alone where a chunk would otherwise have formed. Every
  block is then stored one per transaction, with the statements of the mode off and that one read more; chunks form
  again when a block's end finds nothing.

A height where no chunk would form anyway (too close to the head, a range of one height, a block stored again) and
every height with the mode off send none.

**What it finds, and why nothing a block does is deferred past its own end without it.**

| What a transaction's end acts on | How it can exist | What the read sees |
|---|---|---|
| a deferred constraint check | only a deferrable constraint can be deferred, declared `INITIALLY DEFERRED` or set so with `SET CONSTRAINTS … DEFERRED` | any deferrable constraint (`condeferrable`), whatever its mode: one declared so, made so by `ALTER TABLE … ALTER CONSTRAINT … DEFERRABLE`, or created by the block |
| a deferred trigger | only a constraint trigger can be deferred | any constraint trigger that is not PostgreSQL's own, deferrable or not |
| a temporary table's `ON COMMIT` action | the session has a temporary table | any temporary relation of the writer's session (no catalog says which action a table has) |
| an open cursor: closed, or its query run to its end when declared `WITH HOLD` | a block declared one and left it open, or an earlier transaction left one `WITH HOLD` | any open cursor of the session, with or without hold |

Each is read from the catalogs as the transaction sees them, so what block k creates or leaves open is found at k's
end and committed at k; what it creates and removes is not found, and leaves nothing for a `COMMIT`. A database that
has such an object when a run starts never forms a chunk. UmbraDB's own SQL makes none of them.

Rules run with their statement and event triggers with their command, never at a transaction's end. A module's handle
refuses `SAVEPOINT`, `RELEASE`, `ROLLBACK TO` and `PREPARE TRANSACTION` in both modes.

**What the read does not find**, each the transaction's until its `COMMIT`, and none of them a change of stored data by
itself. These are stated differences from the mode off (§10):

| What a transaction's end does | Inside a chunk |
|---|---|
| ends `SET LOCAL`, `set_config(…, true)` | the setting lasts to the chunk's `COMMIT` |
| releases transaction-level advisory locks, row and table locks | other sessions wait for them until the chunk's `COMMIT` |
| delivers `NOTIFY`, and starts a `LISTEN` | at the chunk's `COMMIT`, equal notifications of its blocks once |
| closes a large object's descriptor | it stays valid until the chunk's `COMMIT` |
| `now()`, the transaction id | the chunk's, the same for all its blocks |
| sequences | nothing at either end: a sequence's value is no part of a transaction. A chunk that rolls back has advanced it by the values of all its blocks |

**The cost**, measured on the tests' servers (3,000 reads in one transaction, three times; a schema of one table, 196
rows in `pg_constraint`; a one-parameter `SELECT` took 0.15 to 0.16 ms there on PostgreSQL 18 and 0.10 to 0.11 ms on
PGlite 0.5.10):

| The database has | Statements per block's end | PostgreSQL 18 | PGlite 0.5.10 |
|---|---|---|---|
| nothing the read looks for | 1 | 0.17 to 0.18 ms | 0.17 ms |
| a deferrable constraint | 1 | 0.16 ms | 0.16 to 0.17 ms |

The scan of `pg_constraint` grows with the number of constraints; it was not measured on a database with UmbraDB's
whole schema in this form.

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

**One store of kept failures.** A failure that is a block's own and cannot be thrown at once is kept for its height,
in one place (`FinalizedLoop.keep`), whatever its kind: the block's take, its `on-compute`, its `on-db-write`, its
`on-settle`, its cursor check, the read at its end, its `COMMIT`. It is kept the moment it is known, before anything
else runs: before the `COMMIT` of the blocks below it, before their callbacks after the commit, before a later run's
cursor read. A kept failure:
- is thrown when the loop reaches its height, processed alone, before anything of that height runs, so the failing
  callback is not called again. One the process retries (a lost connection) is then retried as with the mode off: a
  take is taken again, an `on-compute` resumes from `on-compute`;
- stays kept through a retry or a new run of the blocks below it, a lost or failed `COMMIT`, a pause and a stop;
- ends every chunk planned below it: no chunk forms across its height;
- is dropped, and logged, only when a block below it stops processing (a failure that is not retried).

| Failure | What happens | Against one block per transaction |
|---|---|---|
| taking block j | the chunk is a..j − 1; the failure is kept for j | the same |
| k > a before its first write | the failure is kept for k; `COMMIT` at k − 1, its callbacks; then k's failure | the same |
| k's writes, not retryable (the read at its end among them) | rollback; the failure is kept for k; a..k − 1 stored again | the same halt |
| the `COMMIT` answered with an error | as the row above, with k the chunk's last block | the same halt: the block whose `COMMIT` it is |
| retryable while open | rollback; the chunk held; the next run stores a..k − 1 again and k alone | the same from the retry on |
| the `COMMIT`'s answer lost | held; the next run's cursor read decides: committed, or stored again | as a held height |
| `on-after-db-write` of block j | halt at j, committed; the blocks above j get no such callbacks | the cursor is b, not j |
| the worker traps in a block's writes | the blocks stored again fail at a | the cursor is a − 1, not k − 1 |
| a crash | the database at a − 1 | as before, from a − 1 |

**A `COMMIT` answered with an error is the chunk's last block's.** Each block below the last ended with a read that
found nothing for a `COMMIT` to act on, so the error can only come from what the last block left (a constraint it
made and violated, a cursor `WITH HOLD` whose query fails) or from the server itself. Either way it is the failure of
the block whose `COMMIT` it is, which is what the mode off reports: the error is kept for that block, the blocks
below it are stored again, and the block halts with the error, not called again. If one of the blocks stored again
then fails at its own `COMMIT` (a server that refuses every `COMMIT`), that failure is its own, the loop halts there,
and the kept one is dropped and logged.

No chunk forms at or below the highest height of a chunk that did not commit until the cursor reaches it, so a
failed chunk is never formed again and every remake goes through the path of a block alone. A failure of a block
stored again is its own.

## 8. Where a chunk ends early

Before each block k > a, the loop's signal or a pause hold ends the chunk at k − 1 with its `COMMIT`, and so does the
read at k − 1's end when it finds something (§4a). A callback of k's `on-compute` that calls `blockBeforeCommitted()`
ends it there too: the view of the transaction the callback read through, if it had opened one, ends; the transaction
commits; the call resolves; the rest of k's `on-compute` runs with no transaction open, the callback's later
statements with a read of their own at k − 1, which now sees that block committed; then the callbacks after the
commit of a..k − 1, then k's writes open the next transaction. No callback runs twice. A call after a read is allowed,
in both modes: with the mode off, and at a chunk's first block, the block before is committed already and the call
resolves at once. Every call for one block gets the same commit: a second call made while the commit is pending
resolves with it, not before. The function is the callback's: kept and called after the callback returned, or at
another point, it throws and ends no chunk. `core-ledger-state` calls it when nothing is
kept of the block before or its ledger differs: the conversion reads the whole state at h − 1 from the node tables and
may take minutes, so it reads committed rows and no transaction holding other blocks stays open.

## 9. Trace, slow windows, status

A block's trace record is held when its writes end, marked `chunk: [a, b]` at the `COMMIT` (with more than one block),
and written in height order with the block's own work after it, so `sh` at every line is what the mode off gives.
`beginMs` of the first line holds every block's take, and its `prepareMs` the wait for the source's answers; `txMs`
is each block's part, the first's with the `BEGIN`, the last one's with the `COMMIT`, and the read at a block's end is
counted in its own line (`sqlN`, `txMs`). A rolled-back chunk leaves no line. A block's slow window is told `ended` at the
`COMMIT` or the rollback. `/status`'s cursor moves at the `COMMIT`.

## 10. Equality, and where the modes differ

At every height the database holds, row for row in every table of every schema, what the mode off holds, with the
same digests and checkpoints, for the same history of worker restarts, provided no callback's writes depend on what
§4a lists as lasting to the chunk's `COMMIT` (a transaction-scoped setting an earlier block made, `now()`, the
transaction id, a sequence's value, a large object's descriptor). The module guide tells authors so.

- Every block runs the same callbacks, with the same handles at the same heights, but `on-after-db-write`, which
  changes nothing stored.
- A read through a view of the open transaction at k − 1 sees exactly the rows a read of the committed height k − 1
  sees with the mode off: nothing else writes between, the view cannot write, and k − 1 left nothing for a `COMMIT`
  to do (its end read found nothing, or the chunk would have committed there).
- A block that leaves something for its transaction's end is committed at that block, in a database that had nothing
  of the kind before; in any other database every block is committed alone. So a block that the mode off refuses at
  its `COMMIT` is refused by a `COMMIT` at the same block, with the same error.
- `continues` is true only where what a module kept is what the database holds.
- Every `on-settle` run is `{ k, k }`, and `core-digest` takes a block's captured changes at its settle, deleting the
  shadow rows it reads, so each height's digest is its own.
- The ledger worker applies every block on the same state; after a rollback it is restarted, which a run with the mode
  off restarted at a − 1 matches. A worker restart can change the form a later node is stored in, in either mode, so a
  rolled-back chunk is compared with such a run, and every other path with the plain run.

Where the modes differ, each in one line:
1. A failure of `on-after-db-write` of block j leaves the cursor at the chunk's last block, not at j, and the blocks
   above j get no such callbacks.
2. A ledger worker that traps in a block's writes leaves the cursor at a − 1, not at k − 1.
3. A finality conflict the source records while a chunk is open stops the loop at the height above the chunk, at most
   `blocks` heights later than the mode off.
4. A setting made for the transaction (`SET LOCAL`, `set_config(…, true)`) lasts to the chunk's `COMMIT`.
5. Transaction-level advisory locks, row locks and table locks are held to the chunk's `COMMIT`.
6. `NOTIFY` is delivered, and a `LISTEN` starts, at the chunk's `COMMIT`.
7. A large object's descriptor stays valid until the chunk's `COMMIT`.
8. `now()` and the transaction id are the chunk's, the same for all its blocks.
9. A chunk that rolls back has advanced a sequence by the values of all its blocks.
10. A stop met while the loop takes a chunk's blocks or waits for their answers stores the chunk's first block before
    the loop returns; the mode off stores nothing of the height it waits for.
11. While a node does not answer for a chunk's later blocks and neither a stop nor a pause is asked, the chunk's
    first block is computed and not yet stored; the mode off has stored it (§2).
12. A database with a deferrable constraint, a constraint trigger, a temporary table or an open cursor gets one read
    more per block than the mode off where a chunk would otherwise form, and a transaction of that read before a
    run's first chunk would form.

The tests check the equality at every height inside the transaction, after each block's cursor check, and at every
committed height, on both backends: `test/backbone/fast-sync-equality.test.ts`, `fast-sync-failures.test.ts`,
`fast-sync-feature-module.test.ts`, `fast-sync-worker.test.ts` and, on the recorded devnet,
`fast-sync-tape-devnet.test.ts`. The read at a block's end: `test/db/block-end.test.ts`,
`test/runner/loop-chunk-block-end.test.ts`. Kept failures: `test/runner/loop-chunk-preparation.test.ts`,
`loop-chunk-kept-failures.test.ts`. The source's answers, a stop and a pause:
`test/runner/loop-chunk-source-answers.test.ts`, `loop-stop-chunk.test.ts`. A failure at a
chunk's first and last block: `test/runner/loop-chunk-positions.test.ts`. The third difference:
`test/runner/loop-chunk-finality.test.ts`.

## 11. Measured

Preprod, four ranges of 1,500 heights (A to D), PostgreSQL 18, the block trace on, every row of every table hashed;
the build before the read at a block's end and the source's answers were added. Chunks of 100 and of 1,000 against
the mode off on the same build. Not measured again since: the block's end is now one read per block of a chunk (§4a,
about 0.17 ms), and one transaction of that read per run, which these figures do not hold.

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
