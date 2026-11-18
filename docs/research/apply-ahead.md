# Apply ahead: the next block applied while a block's transaction runs

The design note of the ledger worker applying block h + 1 while the main thread runs block h's transaction
(`src/backbone/core-ledger-state/apply-ahead.ts`). It is on by default; the `core` entry's `applyAhead: false` turns it
off.

## 1. What overlaps, and what does not

Per height h the main thread and the ledger worker took turns:

1. at h's `on-compute`, the worker applies h;
2. the main thread runs h's transaction: the `on-db-write` callbacks, the reclamation at `on-settle` (its computation,
   the eviction of the nodes it deletes, awaited, the net write), the cursor check and the `COMMIT`; then h's points
   after the commit and h + 1's points up to its `on-compute`;
3. the worker had nothing to do during 2, and the main thread waited for it during 1.

**The change moves one request: h + 1's apply.** h's `on-settle` sends it, marked ahead (`ApplyBlock.ahead`), right
after it sends h's eviction, or right after its computation where it evicts nothing. The worker applies h + 1 on the
pending state after h while the main thread awaits the eviction's answer, writes h's net change, commits, and runs h + 1's
points before its `on-compute`. h + 1's `on-compute` takes the result where it would have asked for the apply. Every
point of a block still runs after the block before it committed, in the order it ran before; no point is added.

Considered and not chosen:

| Option | Why not |
|---|---|
| Send h + 1's apply at the start of h's `on-settle`, or at h's `on-compute`, so it overlaps more | It would run before h's eviction: the package would still count stored the nodes h deletes, and leave out of h + 1's flush a node h deletes and h + 1 brings back. Each result would need a check against the evictions sent after it, and those evictions' records kept across retries (section 3) |
| Send it after the eviction's answer, or after the net write | The worker answers in order, so sending right after the eviction already has it run after the eviction; waiting for the answer only shortens the overlap |
| More than one block ahead | Every block is a settle point here, so a block two ahead would be applied before the eviction of the block between |
| Run all of h + 1's `on-compute` ahead | Every `on-compute` reads the database at the block before, which does not exist before that block commits |

## 2. What the worker holds

The engine (`src/ledger/worker/engine.ts`) held the state committed at a height and at most one pending state. It now
holds the pending states of the blocks applied and not committed, oldest first:

| State | When it leaves |
|---|---|
| after h − 1, committed | disposed when h commits |
| after h, pending | becomes the committed one at `commit(h)`, which the host sends once h's `COMMIT` answered |
| after h + 1, pending, applied ahead | becomes the oldest pending state when h commits |

- **An apply is ahead only when marked.** It takes the newest pending state as its parent: the parent block's height
  and hash must match, and the ledger must be the same. Anything else is refused. With nothing pending it is an
  ordinary apply on the committed state.
- **Never ahead:** blocks 0 and 1, a v8 → v9 conversion and an upgrade within v9 (their apply reads the database at the
  block before), a height in another range of the graph than the block in progress, a height past the loop's last one,
  a block the runner has not prepared yet, and a block whose released state keys are not among those kept of h.
- **An unmarked apply keeps the rule it had**: only on the committed state at h − 1; it drops every pending state.
- **The same block again** (a height made again, or a block applied ahead asked for again, marked or not) gets its
  pending result back. The thread cannot apply it anew: its package counts the first apply's flush stored.
- **Requests stay in order.** The worker answers one request at a time, in the order sent (`src/ledger/worker/run.ts`).
- **Ledger tasks** that need the state before a block get the committed state, as before.
- **Memory:** one more state object in the worker, sharing all but the changed nodes with the one before it, and h + 1's
  result on the main thread until h + 1's `on-compute`.

## 3. The rule, and why a result applied ahead is the result of an apply at the block's turn

**The rule.** No block above a settle point is applied before that settle's eviction has been sent to the worker. The
apply of h + 1 is sent by h's settle, after h's eviction; the worker processes requests in the order sent, so it
processes the eviction first.

**The argument.** The apply of n is sent by n − 1's settle after its eviction, and every settle below sent its own
before. So when the worker applies n, its package has forgotten every node those settles deleted. Every node it
believes stored was flushed by a block up to n − 1 and not deleted since, so it is stored once n − 1 commits (a retried
n − 1 writes the same flush, its pending result, and deletes the same keys). A flush leaves out only what the package
believes stored, so each node n's batch leaves out is stored after n − 1: the batch is the one an apply after n − 1's
`COMMIT` gets, but for nodes a rolled-back settle had the package forget, which it flushes again and the computation
counts as written again unchanged. No eviction is sent between n's apply and n's own settle, so no later eviction needs
checking.

Two checks remain, at n's `on-compute`:

1. **The same input.** The input built ahead, from n's `block` items and what n − 1's rows hold (the block before, kept
   in memory), equals, member by member, the input built at n's turn: ledger, height, hashes, both times, the
   outcomes, the released keys, the contracts.
2. **The same worker thread.** The thread that applied it has not been replaced since (`LedgerHost.restarts`).

**Where it is sent.** In `settleRun` (`core-ledger-state.ts`): `ledger.evict(…)` is called (the request is posted),
then the apply of h + 1 is posted, then the eviction's answer is awaited with the block transaction's handle lent to
the worker (`LedgerHost.lend`). Where the computation deletes nothing, the apply is posted right after it. A test
(`ledger-refcount-settle.test.ts` (a), `ledger-apply-ahead.test.ts`) records the order of every settle, eviction and
apply; its negative control (`aheadSentBeforeEviction`, the apply posted at the start of the settle) halts the flip DAG
with `missing-reference`.

## 4. When a result is used, and each event that drops it

A result applied ahead rests on h committing as the state the worker applied h + 1 on, in the same process and on the
same writer session: it is a memory kept from one block for the next, like the block before, the keys found stored and
the copy of the counts, which rest on `BlockContext.continues`. It is used only when h + 1's context says it continues
h, rules 1 and 2 hold, and the apply did not fail.

| Event | What tells it | Result | Test |
|---|---|---|---|
| h's `on-settle` throws after sending it (a lost connection at the net write) | the settle's failure | dropped at once; h + 1 at its turn | `core-ledger-state.test.ts`; `ledger-apply-ahead-failures.test.ts` |
| A failure after the settle (cursor check, a misuse, the `COMMIT` failing), h made again | the next `on-compute` sees `continues` false | dropped; h + 1 at its turn | `core-ledger-state.test.ts`; `ledger-apply-ahead-failures.test.ts` (`COMMIT` lost before it landed) |
| h's `COMMIT` lost its answer and h committed | h + 1's `continues` false | dropped; h + 1 at its turn | `ledger-apply-ahead-failures.test.ts` (landed) |
| The writer's session replaced | h + 1's `continues` false | dropped; h + 1 at its turn | `ledger-apply-ahead-session.test.ts` |
| h's eviction refused and the thread restarted | the restart fails the apply in flight; `LedgerHost.restarts` changed (rule 2) | dropped; h + 1 at its turn, its state loaded from the database | `core-ledger-state.test.ts`; `ledger-apply-ahead-failures.test.ts` (a package refusing in every thread; a restart made to wait for the apply's answer, and its control) |
| h's eviction refused with `restartOnRefusedEviction: false` | h halts in `on-settle` | never used | `ledger-apply-ahead-failures.test.ts` |
| h + 1's input at its turn differs (rule 1) | the inputs compared | dropped; the thread restarted, h + 1 at its turn in the new one | `ledger-apply-ahead.test.ts` (a retention window raised at the turn), its control |
| h + 1's apply traps ahead | the host replaces that thread only (rule 2) | dropped; h + 1 at its turn, which traps again and halts at h + 1, cursor h | `worker-host.test.ts`; `ledger-apply-ahead-failures.test.ts` |
| h halts | the process stops | never used | |

**What a dropped result leaves in the worker.** The thread that applied h + 1 ahead holds h + 1's state pending, and
asked for h + 1 again gives that result back (section 2). So a dropped result is kept, never as a result, for what it
says the worker holds: at h + 1's turn, when that thread is still the worker's and the turn's input differs (or names
another block), the thread is restarted first, and the new one loads the state after h from the database. With the same
input, the worker's pending result is, by section 3, the result of an apply at h + 1's turn, and no thread is restarted.

**A height made again.** The loop's run after a retry takes the held height from its kept items, and the node source
prepares the heights above it only once the loop asks for the next one, so the settle of a height made again usually
finds no next block prepared and sends nothing. h + 1 is then applied at its turn as above.

**A refused eviction** (the stack's rule, unchanged): the block commits, the thread is restarted once per attempt of
the height, and the next block loads its state from the database. The refusal is known before h's `COMMIT`, since the
eviction's answer is awaited in h's `on-settle`.

## 5. What reads what before h commits

- **Other modules' `on-compute`** read nothing earlier: they do not move.
- **A retained state** (`RetainedStates.load`) is loaded beside the held states by its key, as before. Its request may
  wait in the worker behind the apply ahead.
- **An apply ahead reads stored nodes** through the node-store bridge:
  - a node of a pending block's batch is served in the worker, from the pending batches (`pendingNode`);
  - any other node the state reaches was stored before h and not deleted by h's settle (the package forgot what h
    deleted before the apply), so every committed snapshot from after h − 1 to after h holds it with the same bytes;
  - it is sent with no read of its own, since it outlives the settle that sends it. Its node requests are answered
    through the read lent at that moment: the block transaction's handle while the eviction is awaited, then h + 1's
    `on-compute` read, which that callback lends while it awaits the result; else through a read of the process's
    database. Taking a lent read back waits for the answer in flight, so no statement runs on an ended read;
  - on PGlite, whose database has one queue, nothing in h's transaction awaits the worker after the eviction's answer,
    so a node request waiting for the queue is answered once h commits, or by h + 1's `on-compute` read, which holds the
    queue while it awaits the result and lends it. A test (`ledger-apply-ahead-failures.test.ts`, the extended
    package's `applyReads`) has every apply read a stored node, on both backends, across a thread restart.

## 6. Measured

None here. The figures of the earlier design note were measured under another rule: h + 1 applied at h's
`on-compute`, before h's eviction. Under this rule the apply starts later: an empty block's apply hides behind h's net
write, `COMMIT` and the next block's points; a block with transactions loses the time from its parent's `on-compute` to
its parent's eviction. What that costs and gains is for the range bench's rounds to measure.

## 7. The runner's changes

- `BlockSource.ahead(height)` (optional): the finalized block at a height above the loop's next one, when the source has
  it prepared already. It never waits and takes nothing. The node source answers from its prefetch.
- `FinalizedLoop.ahead(height, part)`: the block context a core part will get at `height`, from the start of the
  current height's processing to its `COMMIT`, when the source has `height` prepared, the height is in the same range of
  the graph and not past the loop's last height. Its `continues` is false; the loop runs no point for it.
- The process binds `core-ledger-state` to it (`LedgerBinding.ahead`).

## 8. Tests

| What | Where |
|---|---|
| The engine's pending states in order; an apply ahead gives the result of an apply after the commit; what it refuses; the same block again | `test/ledger/worker-engine.test.ts` |
| An apply ahead in a thread equals a serial thread's, whole batches compared; a trap ahead ends that thread only; the lent read | `test/ledger/worker-host.test.ts` |
| Rule 1 on hand-made inputs; owned copies; the setting | `test/backbone/apply-ahead.test.ts` |
| When a settle sends it, and each event that drops it, on a fake worker | `test/backbone/core-ledger-state.test.ts` |
| `FinalizedLoop.ahead` and the node source's `ahead` | `test/runner/loop-ahead.test.ts`, `test/backbone/node-source.test.ts` |
| Through the process, on PostgreSQL and PGlite: the one-form, extended and flip DAGs store at every height what a run with it off stores, the same chain of step outputs and evictions, results used at nearly every height; every apply ahead after its settle's eviction and none before (`sweep` on and off); rule 1 drops a result | `test/backbone/ledger-apply-ahead.test.ts` |
| The failure paths, each against the run with it off (section 4) | `test/backbone/ledger-apply-ahead-failures.test.ts`, `ledger-apply-ahead-session.test.ts` |
| Negative controls: the apply sent before the eviction, rule 1 unchecked, rule 2 unchecked | `test/backbone/ledger-apply-ahead.negative-control.test.ts` |
| The other process suites | Every suite that runs `core-ledger-state` through the node source runs with the default, on, wherever the source has the next height prepared at a settle: the DAG fixtures' (`test/backbone/refcount-process.ts`), the eviction-restart runs (`eviction-restart.ts`, which pins nothing: its package refuses by the block it applied last, still the block whose settle sends the eviction), the host-follows runs, the restart harness and the recorded tapes'. `ledger-refcount-settle.test.ts` (a) now holds the rule in place of "the next block's apply after the `COMMIT`". |
