# The reclamation of a run of blocks: the rule, and the computation of a run

What the reclamation of stored ledger nodes computes after a block, proved from the per-block step's own rules, and
the computation of the node tables after a run of consecutive blocks built on it:
`src/backbone/core-ledger-state/run-reclaim.ts`, with its tests. Nothing calls the computation yet: the per-block
step (`refcount.ts`) is what `core-ledger-state` runs. Every statement about the code names a file and the function,
rule or check it rests on.

Paths are short for: `refcount.ts`, `core-ledger-state.ts`, `node-set.ts`, `retention.ts`, `sql.ts`,
`run-reclaim.ts` in `src/backbone/core-ledger-state/`; `engine.ts` in `src/ledger/worker/`; `model` for
`test/backbone/refcount-model.ts`; `patch 0001` and `patch 0003` for
`vendor/ledger/v9/patches/0001-storage-core-external-node-store.patch` and `0003-ledger-wasm-node-store-exports.patch`.
The per-block step's rules 1 to 8 are those of `refcount.ts`'s module comment.

## 1. In short

- **The rule.** After a block h that sweeps, the stored nodes are exactly what four sets of keys reach through the
  child lists stored after h: the keys with a root count after h − 1, the keys with a root count after h, the nodes h
  wrote new, and the keys that a child list replaced by h referenced (section 3.4). A reference count is the number
  of references from stored child lists, and the queue is the stored nodes with no reference and no root count; with
  `sweep` on, every queued key is one that h itself released, wrote new, or dropped from a replaced list. The ledger
  package only flushes what a key whose root count rises reaches, so with it the new nodes add nothing, and where no
  list is replaced the stored set is what the roots after h − 1 and the roots after h reach (section 3.5).
- **It follows from the step's own rules** 1 to 8 and from the tables satisfying four properties before the block
  (closure, counts, queue, roots are rows), which the step keeps. It does not hold in closed form with `sweep` off,
  on tables that already break one of the four, or for the bytes of a node the package can spell in two ways
  (section 3.9).
- **The run form.** A run is one or more consecutive blocks settled together. Each block of a run hands over its
  flushed nodes and root-count changes, in memory, and writes its own rows, `root_counts` among them; no step runs
  for it and no statement of reclamation is sent. After the run's last block, one computation runs: the run's nodes
  are added to the stored ones, counts change by the references of the lists added and replaced, and a cascade
  deletes every node that the last block's protected keys (the rule's four sets) do not reach, starting from the
  queue the run found, the keys the run released, the run's own nodes and the keys whose count fell. Its reads are
  bounded by what the run flushed and by what it deletes (section 4).
- **What it gives.** For a run of one block, the per-block step's tables (section 4.3, Theorem 3). With the package's
  flush rule, the tables after a longer run are byte for byte the per-block step's for the same flushes, unless a
  node is left stored only because a child list the run's last block replaced referenced it (Theorem 4). Such a run
  is computed again one block shorter, as many times as that takes: it ends at a run that keeps no such node or at
  one block, and either way holds the per-block step's tables (Theorem 5). One block off is not always enough.
  Where two runs' packages flush a key in different forms,
  the tables are consistent and hold the same node set, and their bytes can differ, as they already can between two
  per-block runs whose packages held different nodes (section 3.9). Section 4.9 lists where a run of one block still
  differs from the step: on damaged tables, on blocks that break the flush rule, and in the words of a halt.

## 2. Names

For the tables as committed after block h (`sql.ts`'s migrations):

| Name | Meaning |
|---|---|
| S(h) | the keys of the rows of `nodes` |
| L(h, k) | the child list stored for k ∈ S(h). A **reference** is one occurrence of a key in a child list, through embedded children (`refcount.ts`'s module comment) |
| C(h, k) | k's row in `ref_counts`, 0 without one |
| R(h, k) | k's row in `root_counts`, 0 without one. roots(h) is the keys with R(h, k) > 0 |
| Q(h) | the keys of `unreferenced` |
| Reach(h, X) | the keys reached from the keys X by following references of L(h, ·), X included |

For what block h flushed (`NodeBatch`, `src/ledger/types.ts`), as rule 1 classifies it:

| Name | Meaning |
|---|---|
| N(h) | its new nodes: no row at h − 1 |
| W(h) | its rewritten nodes: a row at h − 1 with another child list |
| X(h) | its nodes written again with the stored child list |
| rise(h) | the keys whose root count the block raises (a net change above 0) |
| rel(h) | the keys released: R(h − 1, k) > 0 and R(h, k) = 0 |
| drop(h) | the keys referenced by L(h − 1, w) for w ∈ W(h): rule 3's keys |
| D(h) | the rows the step deletes |
| P(h) | roots(h − 1) ∪ roots(h) ∪ N(h) ∪ drop(h): rule 4's protected keys |

A run holds the heights a to b; a − 1 is the last height before it.

## 3. The rule for one block

### 3.1 Four properties the step keeps

| | Property | Kept by |
|---|---|---|
| I1 | closure: every reference of L(k), k ∈ S, is in S | the `missing-reference` check and I2 (below) |
| I2 | counts: C(k) is the number of references to k in the lists L(p), p ∈ S | rules 2, 3, 5 and 6 |
| I3 | queue: Q is the keys of S with C(k) = 0 and R(k) = 0 | rule 7 |
| I4 | roots are rows: R(k) > 0 only for k ∈ S | the `missing-reference` check and rule 4 |

They are the four checks the contents hash makes on these tables (`node-set.ts`: `closure`, `counts`, `queue`,
`roots`) and the oracle's I1 to I4 (`model`'s `oracle`).

**A0.** Every row's key is the hash of its payload and its children's keys (`src/ledger/node-key.ts`), so the
references among stored rows form no cycle. The step does not check it; the contents hash does (`node-set.ts`), and
the package does for every node it reads from the store (`patch 0001`).

**Claim.** If the tables after h − 1 have I1 to I4 and block h's step does not halt, the tables after h have them.

- *The rows.* S(h) = (S(h − 1) ∪ N(h)) minus D(h). L(h, k) is the block's list for k ∈ N(h) ∪ W(h), and
  L(h − 1, k) otherwise: the node write inserts a new key, replaces another child list and leaves an equal one
  (`sql.ts`'s `insertNodes`), and the deletions come after it (`writeRefcount`).
- *I2.* The step's change of k's count is: plus one per reference to k in the block's lists of N(h) ∪ W(h) (rule
  2), minus one per reference in the stored lists of W(h) (rule 3), minus one per reference in the list after the
  block's writes of each deleted row, the block's for a rewritten one (rule 5). The nodes of X(h) add nothing (only a
  fault, `unchanged-counted`, counts them). Starting from the references among the lists of S(h − 1), that is
  replacing W(h)'s lists, adding N(h)'s and removing D(h)'s: the references among the lists L(h, ·) of S(h). Rule 6
  stores it.
- *A deleted key has no reference left.* A key is deleted only with a count of 0 (rule 5). Every increment of the
  block comes before the cascade. A decrement after its deletion would take its count below 0, which halts the block
  (`negative-count`). So its count after the block is 0, and by I2 no row of S(h) references it.
- *I1.* A reference of a list the block writes is checked to be a row after the block (`missing-reference`). A
  reference of any other row of S(h) was in S(h − 1) by I1 and is not deleted, by the point above.
- *I4.* A key whose root count rises is checked to be a row after the block (`missing-reference`). Any other key with
  R(h, k) > 0 had R(h − 1, k) > 0, was a row by I4, and is protected (rule 4).
- *I3.* Rule 7 sets the membership of every key of Q(h − 1), of N(h), with a count change and with a root-count
  change to "a row after, no reference, no root count". A key outside those sets keeps its count and its root count,
  and its row: were it deleted, its count after the block would be 0 with no change, so it was 0 before, and by I3
  the key was queued or had a root count, hence was in those sets or protected.

The claim does not use `sweep`: with it off nothing is deleted (rule 5) and the rest is the same.

### 3.2 The queue after a block that sweeps

**Lemma 1.** With `sweep` on at h and I1 to I4 after h − 1: Q(h) ⊆ N(h) ∪ rel(h) ∪ drop(h).

Take k ∈ Q(h): a row with C(h, k) = 0 and R(h, k) = 0. If it was no row at h − 1 it is in N(h). If R(h − 1, k) > 0
it is in rel(h). Otherwise it is a row at h − 1 with no root count at either height, so rule 4 protects it only if
it is in drop(h). Suppose it is not. Then the cascade deletes it, which contradicts k ∈ S(h):

- *k ∈ Q(h − 1).* Its counts are read before the first round and it is a candidate from the first round (rule 5). If
  nothing of the block references it, the first round deletes it. If new or rewritten lists reference it, its count
  ends at 0 only because the cascade took each of those references back; each time it is reached again; in the round
  after the last, its count is 0 and it is deleted.
- *k ∉ Q(h − 1).* By I3, C(h − 1, k) > 0. Its count ends at 0, so its change ends below 0. It is not in drop(h), so
  rule 3 subtracted nothing from it: every subtraction is the cascade's. Each made it a candidate, and its counts are
  read (rule 5); after the last one it is a candidate, not protected, with a count of 0: it is deleted.

The cascade ends only at a round that deletes nothing, so the round after the last subtraction runs.

### 3.3 Stored is what the roots and the queue reach

**Lemma 2.** With I1 to I4 and A0: S = Reach(roots ∪ Q).

Reach(roots ∪ Q) ⊆ S: roots are rows (I4), queued keys are rows (I3), and references of rows are rows (I1). S ⊆
Reach(roots ∪ Q): a row with no reference has a root count or is queued (I3); a row with a reference has a stored
parent (I2); walking up from any row ends, by A0, at a row with no reference.

It does not say what the stored set is, since the queue is defined by it. Lemma 1 removes that circle.

### 3.4 The rule

**Theorem 1.** With `sweep` on at h, I1 to I4 after h − 1, A0, and a step that does not halt:

> S(h) = Reach(h, P(h)), with P(h) = roots(h − 1) ∪ roots(h) ∪ N(h) ∪ drop(h).
> L(h, k) is the child list last written for k. C(h, ·) is the number of references among those lists (I2).
> Q(h) is the keys of S(h) with no reference and no root count (I3), all of them in N(h) ∪ rel(h) ∪ drop(h).
> R(h, ·) = R(h − 1, ·) plus the block's root-count changes (`core-ledger-state.ts`'s `writeBlock`).

Every key of P(h) is a row after h: a new node is inserted and protected; a key with a root count at h − 1 is a row
by I4, a key of drop(h) is a row by I1, and both are protected; a key with a root count at h is a row by I4 after
h. With I1 after h, Reach(h, P(h)) ⊆ S(h). The other way: S(h) = Reach(h, roots(h) ∪ Q(h)) by Lemma 2, and
roots(h) ∪ Q(h) ⊆ P(h) by Lemma 1, since rel(h) ⊆ roots(h − 1).

The theorem asks nothing of the tables after h − 1 but I1 to I4. In particular it does not ask that `sweep` was on
before h.

**With `sweep` off at h:** S(h) = S(h − 1) ∪ N(h), and I1 to I4 hold after h (3.1). C(h, ·) and Q(h) are still
given by I2 and I3.

`model`'s oracle checks the same closed form as I6 for the blocks it calls admissible (its `K_h`). Theorem 1 is that
statement for every block.

### 3.5 With the ledger package's flush

**P1 (the package's flush rule).** A flush gives the pending nodes reached from the keys whose net root-count
change since the flush before is above 0, walking through pending nodes only (`patch 0003`, the flush's filter;
`patch 0001`, the store's walk). The engine flushes once per block, after its persists and releases (`engine.ts`).
The four vendored packages share the rule (the same filter in each version's `patch 0003`). So every node a block
flushes is reached from rise(h) through the block's own lists: N(h) ∪ W(h) ∪ X(h) ⊆ Reach(h, rise(h)) ⊆
Reach(h, roots(h)). `model` calls such a block admissible.

**Corollary 1.** With P1: S(h) = Reach(h, roots(h − 1) ∪ roots(h) ∪ drop(h)), and Q(h) ⊆ rel(h) ∪ drop(h).

**Corollary 2.** With P1 and no list replaced at h (W(h) empty): S(h) = Reach(h, roots(h − 1)) ∪ Reach(h, roots(h)),
and Q(h) ⊆ rel(h). This is `refcount.ts`'s first sentence, "keeping, for one block, what the state after h − 1 may
still reach", as an equality.

**What the roots are** (`engine.ts`'s persists and releases): the key of the state after each height of the
retention window, persisted once by its block and released once by the block at which it leaves the window; and the
state and zswap-state keys of each contract a block names, persisted by every such block and never released.

### 3.6 The node set

The contents hash takes `nodes` by its node set: the rows' keys and the keys of every node their child lists embed
(`node-set.ts`). A key fixes its node's payload and its children's keys, so the node set of Reach(h, X) is every
node under the keys X, whichever children are embedded: call it Under(X).

**Corollary 3.** With P1, the node set after a block that sweeps is Under(roots(h − 1) ∪ roots(h)).

The keys of drop(h) are children of nodes of W(h), in their old spelling; W(h) is under roots(h) by P1; so
Under(drop(h)) ⊆ Under(roots(h)). The node set is a function of the roots after two heights and of nothing else:
not of the forms, not of the path that led there.

### 3.7 The cases

| Case | What the rule gives | Basis |
|---|---|---|
| `retainStates` 0 | rel(h) is the key of the state after h − 1, unless the state after h has the same key (the persist and the release then cancel in the flush). Q(h) ⊆ that one key, plus drop(h) | Corollary 1; `engine.ts`'s release |
| `retainStates` above 0 | roots(h) holds the state keys of the heights L(h) to h; rel(h) is the state keys of L(h − 1) to L(h) − 1 that no retained height and no contract still persists. While a raised window fills, no block releases, and Q(h) ⊆ drop(h) | Corollary 1; `retention.ts`; `core-ledger-state.ts`'s `releasesOf` |
| A window lowered | its first block releases several states; all are stored after that block and deleted by the next | the same |
| `sweep` off at h | S(h) = S(h − 1) ∪ N(h): no closed form in the roots. Over blocks j to h with `sweep` off, S(h) is S(j − 1) and every node flushed since, and Q(h) holds every key that lost its last reference and root count since j | 3.1, 3.4 |
| `sweep` on after off | Theorem 1 at the first block that sweeps: one cascade from the whole queue deletes everything P(h) does not reach | Theorem 1 asks only I1 to I4 before the block |
| The conversion block F (v8 to v9) | F's flush is one flush of the v9 package (the converted state's nodes with F's), so Corollary 1 holds at F. roots(F − 1) holds the v8 state key, which F releases, and the v8 keys of the contracts persisted so far, which nothing releases. roots(F) adds the v9 state key and the v9 keys of every contract deployed below F. So after F the whole v8 state is stored beside the v9 one; F + 1 deletes what only the v8 state key reached | derivation from `engine.ts`'s conversion and flush, and `core-ledger-state.ts`'s `deployedBelow` at F |
| A change within v9 | F's package loads the state at F − 1 by its key and holds no other node as stored (`engine.ts`). A node it creates whose key the database holds is flushed again: it is in X(F) with the stored list, in W(F) with another. Corollary 1 covers both | derivation; P1 is each package's |
| Contract keys | never released, so every state a contract ever had stays under a root | `engine.ts`'s contract persists |
| Block 0 | the tables before it are empty and have I1 to I4 | — |

### 3.8 Where the queue makes the rule depend on more than the roots

With `sweep` on and P1, the roots after h do not give S(h). Three things are added, and the queue is where each
shows:

1. **The roots after h − 1.** A state released by h is stored for one block more, with everything only it
   reaches. Its key is queued. This needs the root counts of the height before, nothing else.
2. **drop(h).** A key that only a replaced child list referenced is stored for one block more, and queued. It is
   not a function of any roots: it depends on which child list the database held for the rewritten node, that is on
   the form in which some earlier package wrote it.
3. **N(h) not under a rising key.** Empty with P1. Without P1 such a node is stored for one block and queued
   (`model`'s orphans).

With `sweep` off the queue depends on every block since it was turned off.

### 3.9 Where the rule does not hold

1. **`sweep` off:** no closed form (3.7).
2. **Tables that break I1 to I4 before the block.** The proofs start from them. One such case: a row with no
   reference and no root count that is missing from the queue is no candidate of the cascade unless a deletion
   reaches it (`refcount.ts`, rule 5), so it stays stored.
3. **A row whose key is not its content's** (A0): references could then form a cycle, which counting never frees
   and Lemma 2 does not cover.
4. **A block that breaks P1:** Theorem 1 holds, Corollaries 1 to 3 do not.
5. **As a statement about bytes across two runs.** L(h, k) is "the list last written for k", and which list the
   package writes for a key can depend on what its memory holds: it keeps the child list it first cached for a key
   (`engine.ts`'s module comment), and one node can be stored in two forms (`node-set.ts`). Two runs whose packages
   held different nodes then store different rows for the same node set. Whether this happens on a real chain is
   not settled by this change.
6. **A block that halts** stores nothing (rule 8), so there is no "after".

## 4. The run form

Instead of the per-block step at each block of a run, each block only hands over what it flushed and writes its own
rows; one computation after the run's last block gives the node tables after it (`run-reclaim.ts`). Nothing calls it
yet.

### 4.1 What each block of a run hands over

`RunReclaim.collect`, in memory, with no statement. The record is made with the run's first height alone; each block
handed over must be the one after the block before (a `RangeError` otherwise), and the run is the blocks handed over
when it is computed, the last of them its last block (`RunReclaim.heights` gives the first and the last so far).

| Collected | Kept as | Used for |
|---|---|---|
| Its flushed nodes (key, payload, child list), with its height | The run's node map B: per key the last list written, the block that flushed it, the first block that flushed the key, and the lists held before it with their blocks. A node flushed again with the list B holds changes nothing. One flushed with another list replaces it, and the replaced list's references are marked with the block that replaced it | the universe, the count changes, drop(b), step 3 |
| Its root-count changes | T: the keys any block of the run changed; each key's latest change with its block, from which the last block's own changes are taken when the run is computed | the candidates, R(b − 1) from R(b) |
| Its rising keys | the flush rule, checked on the block's own nodes as the package walks (`patch 0001`, the store's walk): a node that is new, or that replaces a child list, must be reached from a rising key through the block's own nodes (`unreached-node`). Each key's first rising block is kept, and each referenced key's first block that referenced it, to be checked in step 3 | Theorems 2 and 3 need P1; `missing-reference` |
| The `sweep` setting at its height | compared with the run's | 4.7 |

**The flush-rule check.**

- A node flushed again with the child list already held changes nothing in either form, and may be anywhere: the
  model's histories write such nodes outside any root (`model`'s strays), and the package does when it has dropped a
  stored node from its memory. So the check is on the nodes that are new or that replace a list.
- A node that replaces a list the run holds is judged at once: not reached, the block halts.
- A node the run did not hold is judged in step 1, when the database says what it is: not reached by its block, it
  must be a row holding the list that block flushed. The record keeps that list, since a later block of the run may
  replace it under a root.
- "Reached" is the package's walk: from a rising key through the block's own nodes, stopping at a stored one. It is
  narrower than `model`'s "admissible", which follows stored child lists too. A generated block that rewrites a
  stored node reached only through other stored nodes is admissible there and halts here; the package cannot flush
  it.

Each child list is parsed once, here. Nothing else is computed per block: no count, no queue, no deletion. The
computation expects each block's root-count changes to be in `root_counts` when it runs, as `core-ledger-state.ts`'s
`writeBlock` writes them, so that it holds R(b); and `nodes`, `ref_counts` and `unreferenced` to be as the block
before the run left them.

### 4.2 The computation after the run's last block

`RunReclaim.compute`, after the last block's own rows, through a read of the run's transaction (`RunTables`;
`sqlRunTables` for a database read). The node tables are those after a − 1. **`root_counts` is R(b)**: a root count
read is the one after the last block, and the computation takes R(b − 1) as R(b) less the last block's own change.
The theorems below take R(b − 1) and R(b) as inputs; only where each comes from is fixed here.

1. **Classify B against the database.** Which keys of B are rows, and which of those hold another child list, with
   the stored list's references. Nb: the keys of B that are no row. Wb: the rows whose list B replaces. The other
   keys of B are rows with the list B holds, and count as stored rows from here on. The universe is U = S(a − 1) ∪
   Nb, with B's list for the keys of Nb ∪ Wb and the stored list for every other key. Here the nodes that their
   first block did not reach are judged (4.1). The outcome counts the three kinds (`RunOutcome.newNodes`,
   `rewrittenNodes`, `unchangedNodes`; they sum to `handed`).
2. **Count changes.** Plus one per reference in B's lists of Nb ∪ Wb; minus one per reference in the stored lists
   of Wb. (Rules 2 and 3, once for the run.)
3. **Check what was flushed, block by block.** Every reference of every child list a block h flushed (the lists
   replaced since included), but a key's first list in the run when it is the row's own, and every key h raised, is
   stored by h: a row when the run began, or a key of B that h or a block before it flushed. (A list that is the
   row's own is one the per-block step writes again unchanged, and checks nothing of; with I1 its references are
   rows.) Else the run halts with `missing-reference`, naming the first such block, as the
   per-block step halts that block. **And each block's counts:** a key's count when the run began, plus the
   references of the lists the blocks up to h flushed, less those of the lists they replaced (the database's at a
   key's first flush, the run's own at each later one), is not below 0 at any h; else the run halts with
   `negative-count`, naming the first such block. Only a key some block takes a reference from can fall, so only
   those keys are followed, and only their counts are read. When both checks fail, the first block halts the run,
   and at one block the count first, as rule 8 orders them. The deletions are not in these counts: the cascade runs
   once, below, and step 7 checks the counts after it. So a missing reference of the last block is held until step
   7's count check, which the per-block step makes before its references; one of an earlier block halts the run
   here.
4. **Protection.** Pb = the keys with R(b − 1, k) > 0 or R(b, k) > 0, and drop(b): the references of the lists the
   last block replaced, in B or in the database (a key of Wb that only the last block flushed). (Rule 4 at b, without
   its new nodes: P1 makes them redundant.)
5. **Candidates** (`sweep` on): the whole queue as the run found it; T; Nb; the keys whose count change is below 0.
   Their counts are read: whether a row, C(a − 1, k), R(b, k). A key of Nb outside T has none of the three.
6. **The cascade**, as rule 5: in rounds, every candidate that is not in Pb and whose count C(a − 1, k) plus its
   change is 0 is deleted; each reference of its list subtracts 1 and makes its key a candidate, whose counts are
   read once its change is below 0; until a round deletes none. D is the deleted keys. On tables with I1 to I4 every
   candidate is in U; a candidate outside it (a queued key that is no row, a key with a count and no row) is deleted
   as rule 5 deletes it, and the net write's delete of its row halts the run (step 9), as `writeRefcount`'s halts the
   block.
7. **Checks before anything is written.** No count below 0 (`negative-count`). Then a missing reference of the last
   block held in step 3 (`missing-reference`). No list of a node of Nb ∪ Wb that is kept references a key of D
   (`missing-reference`, as the per-block step requires every reference of a list the block writes to be a row
   after it). Every key queued after the run is in rel(b) ∪ drop(b) (`unexpected-queued`; Lemma 1 at b).
8. **The queue after.** Membership is "in U, not deleted, count 0, R(b, k) = 0", evaluated for the queue the run
   found, Nb, the keys with a count change and T. (Rule 7.)
9. **The net write** (`NetWrite`): B's nodes of Nb ∪ Wb that are not deleted; each key's count change, and how many
   of those keys keep a count above 0; the keys leaving and entering the queue; the deleted keys but the nodes of B
   that are no row: the rows, and any key outside U, whose delete affects no row (`row-count-mismatch`).
10. **The deleted keys:** D, rows or not (`RunOutcome.evict`).
11. **What only the last block's replaced lists keep:** the keys of drop(b) left queued, with no root count after
    b − 1 (`keptByReplaced`; Theorems 4 and 5).

### 4.3 Why it gives the per-block tables

**Lemma 3.** With I1 to I4 after a − 1, A0, and step 3 passed: after step 6 the keys of U not deleted are
Reach(Pb) over U's lists, and each key's count after step 6 is the number of references to it among their lists.

- After step 2 a key's count is the number of references to it among U's lists: I2 after a − 1, with Wb's lists
  replaced and Nb's added.
- U is closed under references: I1 after a − 1 for the stored lists, step 3 for B's.
- Every key of U with a count of 0 after step 2 is a candidate or protected. A row with C(a − 1, k) = 0 and no
  change was queued after a − 1 (I3), or had a root count then: it still has one at b − 1 and is protected, or a
  block of the run changed it and the key is in T. A row with C(a − 1, k) > 0 has a change below 0. A key that is
  no row is in Nb.
- A key whose count reaches 0 later was reached by a deletion. If its change is then below 0, its counts are read.
  If not, its count before the run was 0, so it is one of the keys of the point above: a candidate whose counts
  are known, or protected. Either way it is examined in the next round unless it is protected.
- So at the end every key left that is not protected has a reference from a key left, and walking up ends at a
  protected key (A0). A protected key is never deleted, and a key that a key left references has a count above 0.

By the last point, step 7's check of the lists of Nb ∪ Wb never fires on tables with I1 to I4.

**Theorem 2 (equal bytes).** Assume I1 to I4 after a − 1, A0, `sweep` on, P1 for every block, and one child list
per key: every list that the per-block run or the run form flushes or holds for a key is the same bytes. Then
`nodes`, `ref_counts` and `unreferenced` after b are the same in both, for any run length. `root_counts` is written
per block in both.

- Per block: no list is ever replaced, so by Corollary 2, S(b) = Reach(roots(b − 1)) ∪ Reach(roots(b)), each key
  with its one list, and with its payload, which the key fixes (`sql.ts`'s `insertNodes`).
- Run: drop(b) is empty, so by Lemma 3 the keys left are Reach(roots(b − 1) ∪ roots(b)) over U's lists. The two
  reaches follow the same lists, provided U holds everything they reach. A root no block of the run raised is in
  S(a − 1) with all it reaches (I4, I1). For a root that block h raised, P1 says every node it reaches was flushed
  at h, so is in B, or was held as stored by the package at h; step 3 checks that such a node is a row when the run
  began or a node of the run.
- The roots are the same in both: a block's root-count changes are the engine's persists and releases.
- The counts and the queue follow from the rows, lists and root counts (I2, I3; steps 2, 6 and 8).

**Theorem 3 (two forms).** Assume I1 to I4 after a − 1, A0, `sweep` on and P1, with lists replaced or not. Then the
run form's tables after b have I1 to I4, their node set is Under(roots(b − 1) ∪ roots(b)), which is the per-block
step's (Corollary 3), and **for a run of one block they are the per-block step's tables.**

- I1: the keys left are a reach inside a closed U. I2: Lemma 3. I3: step 8, over every key whose row, count or
  root count the run can change. I4: a root after b that the run raised is checked in step 3; any other was a
  row after a − 1; all are protected.
- Node set: the keys of drop(b) are children, in an older spelling, of nodes the last block flushed, which P1 puts
  under rise(b). So Under(Pb) = Under(roots(b − 1) ∪ roots(b)).
- One block: step 2 is rules 2 and 3; step 5's candidates hold rule 5's first round's, and the others are
  protected at b or new; step 4 is rule 4 without the new nodes, and none of those is deleted either way: by P1 each
  is reached from a rising key through the block's own nodes, the rising key is protected, and a node referenced by
  a node left has a count above 0. So the same rows are deleted, and step 8 is rule 7.

| Assumptions | The run form's tables against the per-block step's |
|---|---|
| P1, one child list per key | equal bytes, any run length (Theorem 2) |
| P1, lists replaced, a run of one block | equal bytes (Theorem 3) |
| P1, lists replaced, a longer run, no node kept by the last block's replaced lists alone (`keptByReplaced` 0) | equal bytes (Theorem 4) |
| P1, lists replaced, a longer run, a node kept by them alone | I1 to I4, the same node set, the same `root_counts`, and rows more, queued, that the per-block step keeps only if it still stored the replaced list's node at b − 1. Computed again one block shorter until no such node is kept or one block remains, equal bytes (Theorem 5) |
| `sweep` off for the whole run | equal bytes: neither deletes, so the package flushes the same nodes in both, and steps 1, 2 and 8 are rules 1, 2, 3, 6 and 7 summed |
| P1 broken by a block | the run halts (`unreached-node`); the per-block step would keep the node one block |

**Theorem 4 (no node kept by a replaced list alone).** Assume I1 to I4 after a − 1, A0, `sweep` on, P1 for every
block and the same flushes in both, lists replaced or not; and that no key of the run's drop(b) (the references of
the lists the last block replaced, in B or in the database) is left with no reference and no root count after b − 1
or b (the computation's `keptByReplaced` is 0). Then `nodes`, `ref_counts` and `unreferenced` after b are the
per-block step's in bytes, for any run length.

- The run keeps Reach(roots(b − 1) ∪ roots(b) ∪ drop(b)) over U's lists (Lemma 3; P1 makes the new nodes
  redundant). Were a key of drop(b) kept outside Reach(roots(b − 1) ∪ roots(b)), walking up from it through kept
  parents would stay outside that reach and end (A0) at a kept key with no kept parent: count 0, no root count after
  b − 1 or b, so protected only as a key of drop(b), and queued, which the assumption excludes. So the run keeps
  Reach(roots(b − 1) ∪ roots(b)), and drop(b) is inside it.
- The per-block step's drop(b) is inside the run's: w ∈ W(b) means the per-block step stored w after b − 1 with
  another list than b's, and the list it stored is the last one written for w, by a block of the run or before it,
  which is the list the run holds for w. So by Corollary 1 the per-block step keeps Reach(roots(b − 1) ∪ roots(b))
  too.
- Both reaches follow, for every key, the last list written for it (a key deleted and flushed again is written
  again), and both universes are closed (I1 after b, step 3): the rows and their lists are the same, and the counts
  and the queue follow (I2, I3).

Theorem 2 is the case where no list is replaced. Without the assumption the run keeps rows more, queued: the keys
only a replaced list referenced. Whether the per-block step keeps them too depends on whether it still stored the
replaced list's node after b − 1, that is on S(b − 1), which the run form does not compute: it does where the node
was stored there (a rewrite in both), and does not where a block of the run had deleted it (the per-block step then
takes the last block's write for a new node).

**One block off is not always enough.** A over x and B over y are stored and persisted; block 1 releases both; the
per-block step deletes A, B, x and y at block 2; block 3 writes A again with x embedded and persists it, block 4 the
same for B and y. The run of blocks 1 to 4 finds B's row with its old list, which block 4 replaces: y is kept,
queued (`keptByReplaced` 1). The run of 1 to 3 finds A's row the same way, which block 3 replaces: x is kept
(`keptByReplaced` 1 again). The run of 1 to 2 replaces nothing. Each block taken off can make the new last block
the last replacement of another key.

**Theorem 5 (a run made shorter).** Assume I1 to I4 after a − 1, A0, P1 for every block and the same flushes in
both. Compute the run of blocks a to b; while its `keptByReplaced` is above 0 and it holds more than one block,
compute it again without its last block. The run of a to b* this stops at holds the per-block step's `nodes`,
`ref_counts` and `unreferenced` after b* in bytes; the blocks b* + 1 to b open the next run, from those tables, and
every run's end, run after run, holds the per-block step's tables.

- It stops: each turn takes one block off, and a run of one block is not computed again. So it computes a run at
  most b − a + 1 times.
- Where it stops, either `keptByReplaced` is 0 and the run has more than one block, or the run is the one block a.
  In the first case, with `sweep` on, Theorem 4 gives the per-block step's tables after b*; with `sweep` off
  `keptByReplaced` is always 0 and the run's bytes are equal (the table above). In the second case Theorem 3 gives
  them, whatever `keptByReplaced` is; with `sweep` off, the table above again.
- Both theorems ask of the tables after a − 1 only I1 to I4 (and A0), and of the blocks a to b* only P1 and the same
  flushes. The tables after b* are the per-block step's, which have I1 to I4 (the claim of 3.1), and the next run's
  blocks are the same flushes; so the next run starts where the theorems apply again, and by induction over the
  runs every run's end holds the per-block step's tables.

The cost of the procedure: a run of k blocks can be computed up to k times, each time over its blocks less the ones
taken off. How often a real chain needs a second computation is not measured here; on the generated histories in
two forms, one run is made shorter up to 3 times (T3).

Theorem 4 is about the same flushes. A package told of deletions at every block can flush a node again where one
told of them only at a run's end, which still holds it, does not; when the package spells it differently the second
time, only the first stores the second spelling (section 3.9, point 5).

**What the tests show of it** (`test/backbone/run-reclaim.test.ts`). On generated histories in one form and on the
fixture DAGs, in runs of 1, 2, 3, 7 and 1,000 blocks, flushed by a package told of deletions at every block and by
one told at a run's end only, the tables are the model's at every run's end (T1). A run of one block gives
`refcountStep`'s outputs on every generated block that follows the flush rule, rewrites included, and halts with
`unreached-node` on every other (T2). On generated histories in two forms under the flush rule (T3): flushed by a
package told of deletions at a run's end only, the tables are sound at every run's end and hold the node set of the
roots of the last two heights; flushed as the model flushes them, with each run made shorter as Theorem 5 states,
they are the model's in bytes at every run's end, in runs of 2, 3, 7 and 1,000, where some runs are made shorter
two and three times and some runs of one block are committed with a node kept by their block's replaced lists.
Kept as computed instead (a negative control), some histories store rows more, queued. By hand, the history above:
the runs of 1 to 4 and of 1 to 3 each keep one node the per-block step (`refcountStep` applied block by block) does
not, the run of 1 to 2 and the run of 3 to 4 after it hold the step's tables.

### 4.4 The reads, and what bounds them

All after the last block, through `RunTables` (`run-reclaim.ts`): each read is one statement's shape (`sql.ts`'s
reads of the step, `missingKeys` and `queuedKeys`), sent in statements of at most 1,000 keys (`refcount.ts`'s
`KEYS_PER_STATEMENT`) by whoever gives the tables (`sqlRunTables`).

| Step | Read | Keys |
|---|---|---|
| 1 | which keys of B are rows; which hold another list, with it (`rows`, `changed`) | the distinct nodes the run flushed |
| 3 | which referenced keys are no row (`missing`), less the keys of B and the keys known to be rows (`KnownKeys`) | the distinct references of the lists step 3 checks, and the run's rising keys |
| 3 | counts (`counts`), for the block-by-block counts | the keys a replaced list referenced whose count, followed block by block, falls below the one the run found; most are among step 5's |
| 5 | the queue (`queue`) | the queue the run found: by Lemma 1, what the block before the run released or dropped |
| 5, 6 | counts (`counts`) | the queue, T, the keys whose count fell, the keys the cascade reaches with a change below 0 |
| 6 | child lists of deleted rows that B does not hold (`children`) | the rows the run deletes |
| 8, `sweep` off | which of some keys are queued (`queued`) | the keys step 8 evaluates |

None of these grows with the stored state: each is bounded by what the run flushed (nodes, their references,
root-count changes) plus what it deletes from the database (rows and their references) plus the queue it found.
Each key costs one index lookup, whose depth grows with the logarithm of the table; that is not measured here. A
test holds the count of reads to this: the same run on its tables, and on those tables with 3,000 rows more that it
does not touch, asks for the same keys.

The keys known to be rows are a set made for the run unless the caller gives one (`KnownKeySet`), dropped with it;
step 3 asks the database only about the keys it does not hold, and the run's deleted keys leave it. A set made for
the run holds nothing when step 3 asks, so it saves no read on its own.

The deletions are a net change, not a pass: the rows a run deletes are the rows the per-block step deletes over the
same heights and does not write again. Three blocks delete a lot at once either way: the block after a conversion
(the v8 state), the block after a lowered window, and the first sweeping block after `sweep` was off.

**Statements.** The per-block step sends its reads and writes at every block. The run form sends none per block
and, per run, the reads above and the five writes of the net write. Not measured here.

**Memory.** B holds the payload and child list of every node the run flushed, until the run is computed.

### 4.5 Each key in one form

The per-block step turns a key into hexadecimal text in every map it keeps (`refcount.ts`), and `Buffer.from`
copies its 32 bytes first.

The run computation uses one record per distinct key, made the first time the key is met in the run and found by
the key's text:

- **The text** is the key's 32 bytes as 32 characters, one per byte (Node.js's `latin1`). Its order is the bytes'
  order, which the net write's lists keep. Hexadecimal is produced only for an error's message. `TextDecoder`'s
  `latin1` is not this form: it is windows-1252, which maps 0x80 to 0x9F elsewhere.
- **A reference's text is made from its 32 bytes in place**, with no copy of the key: the reader gives where each
  reference is in the list (`childRefOffsets`, `src/ledger/node-refs.ts`), and the text is read there. Most of a
  list is embedded payload, so only the keys' bytes are made into text.
- **A record holds everything about its key:** whether it is a row, its node in B, its stored list's references
  once read, its counts once read, its count change, its root-count changes, whether it is protected, whether it is
  deleted. A node's references are kept as records, not as keys, so the cascade follows records and converts
  nothing.
- **Bytes are produced only at the edges:** a read's key list, the net write, the deleted keys. A key that came in
  as an array of its own is given back as it came; one that came as a view into a larger buffer (a driver's row) is
  made again from its text, so nothing that leaves carries that buffer along.

A key is converted where it enters (a flushed node's key and child list, a root-count change, a row a read
returns) and nowhere else. It is read with `Buffer`'s `toString("latin1", start, end)`. What the form costs against
hexadecimal is not measured here.

### 4.6 The writes

`writeNet` (`run-reclaim.ts`): the node write, the counts' merge, the queue's two statements, the node delete,
each checked for the rows it must affect (`row-count-mismatch`), as `writeRefcount`'s are. A row of Wb that the
run deletes is not written first, only deleted.

### 4.7 `sweep` off, and one setting per run

- **Off for the whole run:** steps 5 and 6 are skipped, D is empty. The queue is not read whole (it can be large
  while `sweep` is off): the membership before the run of the keys step 8 evaluates is read by key.
- **One setting per run.** A run that sweeps in some blocks and not in others would need the stored set at the
  height of the change, which the run form does not compute. So `collect` refuses a block whose `sweep` differs from
  the run's, and a caller ends the run before that block. A test runs a history whose `sweep` is off over a stretch,
  each run ending at a change: the model's tables at every run's end; a negative control that does not end runs
  there gets other tables.
- A change of `retainStates` needs nothing: it only changes which keys a block releases.

### 4.8 Not chosen

| | Why not |
|---|---|
| The per-block step run once over the run as if it were one block | Rule 4 would protect the roots after a − 1 and every node the run wrote, and rule 5 would start from the old queue only: the state before the run and every state inside it would stay stored. It is a negative control (`run-as-one-block`) |
| A mark from the roots after every run | Its cost grows with the stored state, not with the run |
| The stored set after each block kept in memory, to settle the fourth line of the table in 4.3 | That is the per-block step |
| A mirror of every child list | Its memory grows with the stored state |

### 4.9 A run of one block against the per-block step: what differs

On tables with I1 to I4 and blocks that follow P1 a run of one block gives the step's tables (Theorem 3), and T2
holds every output of the step to it on generated histories. On damaged tables and on blocks that break P1, what
remains different is below. Each damaged-table row is a test that runs the block by `refcountStep` with
`writeRefcount` and as a run of one block with `writeNet`, each on a database of its own, on PostgreSQL and PGlite
(`test/backbone/run-reclaim-tables.test.ts`), unless it names another test.

| Difference | When it shows |
|---|---|
| A new node that no rising key reaches halts the run (`unreached-node`); the step keeps it one block, queued (T2) | blocks that break P1: generated histories only |
| The cascade reads a reached key's counts only once its change is below 0 (the `TODO` at that line in `run-reclaim.ts`); the step reads every reached key's. On tables that lost a count row, a reached key whose change is 0 is kept by the run; the step reads its count as 0, deletes it, and halts with `missing-reference` when a list the block writes references it | damaged counts only |
| On tables that break closure (a stored list referencing a key that is no row), the step protects a new node in its block and the run does not: the run deletes it and halts with `missing-reference` where the step stores the block | damaged tables only |
| With `sweep` off, a queued key that should not be (no row, or a count above 0): the step takes it off the queue; the run reads the queue's membership only for the keys it changes, and leaves it. Aligning them would read the whole queue with `sweep` off, which the run does not | damaged tables only |
| A reference to a key the block's own cascade deletes: both halt with `missing-reference`. The run checks the lists of the written nodes it keeps; the step also those of written nodes it deletes. Under P1 a deleted written node has a kept written ancestor whose reference to it halts the run the same way (`run-reclaim.test.ts`, by hand) | damaged counts only |
| A missing reference and a count the cascade takes below 0 at one block: both name `negative-count`. In a longer run whose earlier block has the reference, the run names `missing-reference` at that block, where the per-block step names the count at the same block; the run's one cascade cannot say at which block a count fell (`run-reclaim.test.ts`, by hand) | damaged counts only |
| The key and the words of a halt: the step names the first failing reference in the order of the keys of the lists it writes; the run names, for step 3, the first failing block and then the first key in byte order | any halt |
| Reads: the run reads which referenced keys are no row (`missing`), and with `sweep` off the queue's membership by key; the step reads which are rows and the queue whole | always; the same tables |

The same both ways, each a test of the same kind: a queued key with no row (both halt with `row-count-mismatch` on
the node delete, which affects no row: step 6 deletes such a candidate as rule 5 does); a key with a count and no
row that a deletion reaches (the same halt); a list flushed again unchanged that references a key stored nowhere
(both store the block: step 3 does not check a list that is the row's own); a key with a count and no row that a
written list references (both `missing-reference`); a queued row with a root count, and one with a count (both take
it off the queue); a root count with no row, released (both store the block); a row with no reference and no root
count missing from the queue (both leave it so).

`unexpected-queued` is no difference from the step: in a build it never fires. A key the run queues has its counts
read and was a candidate: step 8 evaluates the queue it found, the keys whose root count changed and the new nodes,
which are the first round's candidates, and the keys whose count changed, of which those with a count of 0 after
the run had a change below 0 and so were candidates when it fell. A candidate with a count of 0 is deleted unless
protected, and a key protected with no root count after the last block is one that block released or a key its
replaced lists referenced. The check guards the computation itself: the negative controls of steps 4 to 6 show
it halting.
