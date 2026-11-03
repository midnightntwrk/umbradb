# Spec delta — `ledger` capability

Modifies `core-arch`'s `specs/ledger/spec.md` (`ledger-refcount` `design.md` §0: `core-arch` is archived first, then
`start-umbradb`, then this change). EARS forms and terms as in `core-arch`'s `specs/runner/spec.md`; the ledger's terms
as in `core-arch`'s `specs/ledger/spec.md`. Each modified requirement is restated in full; the change is storing ledger
nodes as the node stores them, comparing them by the nodes they hold, and reclaiming them by reference counting
(`design.md` §2–§4).

## RENAMED Requirements

- FROM: `### Requirement: LG-14 Unused ledger nodes are reclaimed by a fixed-budget mark-and-sweep`
- TO: `### Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting`

## MODIFIED Requirements

### Requirement: LG-11 The ledger state lives in the database

THE system SHALL store the ledger state only in `core_ledger_state`, on the ledger's storage contract with the node's
`layout-v2` layout: each ledger node as its key, `data` and `children` (the ledger's serialization of its child list,
references and embedded children included); root counts per key; and, for reclamation (LG-14), the reference count of
every key that stored nodes reference (`ref_counts`) and the queue of stored nodes that have neither a reference nor a
root count (`unreferenced`). THE stored child list of a node SHALL be the one the ledger last wrote for it: WHEN the
ledger writes again a node already stored with another child list, THE system SHALL replace the stored child list, as
the node's own storage does, and a node written again with the same child list SHALL leave its row untouched. Per block,
`core-ledger-state` SHALL write the ledger's flushed batch (its nodes, its changed root counts) with the block's row of
`core_ledger_state.states` and the block's reclamation step in the block's `on-db-write`, and persist the state after
the block. Whole serialized states SHALL NOT be stored. Reads SHALL check each node's hash against its key. WHEN the
process restarts THE ledger worker SHALL load the state at the cursor from its state key and the stored nodes, and
reclamation SHALL continue from the stored counts and queue. `nodes`, `ref_counts` and `unreferenced` SHALL be
content-defined tables (DT-3, DT-4): `nodes` takes part in the contents hash by its **node set** — the keys of its rows
and of every node embedded in them, each once, every row's key checked against its content — and `ref_counts` and
`unreferenced` by a check that they hold exactly the counts and queue its rows and `root_counts` give, which, IF it
fails, SHALL fail the computation with `ledger-refcount-invalid`; none of the three SHALL be captured or digested per
block. Two indexers that processed the
same chain with the same configuration SHALL hold the same node set after every block, whatever their restart
histories. THE flushed batch SHALL carry each changed root count as a signed change, which the
writer adds to the stored count, deleting a count that reaches 0 (owner decision Q53).

#### Scenario: Restart from the database alone
- **WHEN** the process is killed and restarted at cursor h
- **THEN** the state loaded from the database has the root stored for h, and the next block's root matches the node's

#### Scenario: The same node set whatever the worker's history
- **WHEN** two indexers process the same chain, one restarted at several heights and one never restarted, and the
  ledger of one keeps a node spelled with a small child referenced where the other writes it embedded
- **THEN** after every block their node sets, `root_counts`, `states`, digests and contents hashes are identical

#### Scenario: A node written again with another child list
- **WHEN** block h's batch writes a stored node with a small child referenced where its stored child list embeds it
- **THEN** its row holds the new child list after h, its old child list's references are subtracted and its new ones
  added, and a worker restarted at h + 1 loads the new child list

### Requirement: LG-13 Contract states stay alive

THE system SHALL persist every contract state key and zswap-state key that `core-contract-states` stores, and SHALL
never release them.

#### Scenario: An old contract state survives reclamation
- **WHEN** a contract's state stored at height 10 has not changed for 10,000 blocks and every ledger state that held it
  has been released and its unused nodes deleted
- **THEN** that state still loads from its stored key

### Requirement: LG-14 Unused ledger nodes are reclaimed by reference counting

THE system SHALL keep, for every key that stored ledger nodes reference, its **reference count**: the number of times
the key occurs as a reference (`ArenaKey::Ref`) in the stored child lists of the stored nodes, found through embedded
children, each occurrence counted (`core_ledger_state.ref_counts`; a key without a row has 0); and the **queue**: the
stored nodes that have neither a reference nor a root count (`core_ledger_state.unreferenced`). Per block h,
`core-ledger-state` SHALL compute in `on-compute`, from the tables as committed at h − 1 and the block's flushed batch,
and SHALL write in `on-db-write`, in the block's transaction, this step:
(1) the block's **new nodes** are the batch's nodes whose keys were not stored at h − 1, and its **rewritten nodes**
those stored at h − 1 with another child list; a node written again with its stored child list changes nothing;
(2) each new or rewritten node adds 1 to the count of each key its child list references, per occurrence;
(3) each rewritten node subtracts 1 from the count of each key its stored child list referenced at h − 1, per
occurrence;
(4) a key that has a root count after h − 1 or after h, that rule (3) decremented, or of a new node, is **protected**
and not deleted in h;
(5) starting from the keys queued at h − 1, every key with count 0 that is not protected is deleted; each deleted node
subtracts 1 from the count of each key its child list references as stored after the block's writes, per occurrence; a key whose count so reaches 0
and that is not protected is deleted too, in the same block, until no key is left to delete; no limit bounds the
deletions of a block;
(6) after the step the queue holds exactly the stored nodes with neither a reference nor a root count, and a key that
enters it in h is deleted no earlier than block h + 1.
IF a count would fall below 0, a reference in the child list of a new or rewritten node or a key whose root count rises
in h is not a stored node after the step, or a write of the step affects another number of rows than the step computed,
THEN processing SHALL halt with `ledger-refcount-invalid`, naming the reason, and nothing of the block SHALL be stored.
Nodes the step deletes SHALL be evicted from the worker's caches before the block's transaction; IF the ledger package
still refuses an eviction after the worker freed every object it can, THEN THE system SHALL end the worker thread and
start a new one, which loads the state at h − 1 from the database and applies block h again, the step included, without
halting — only a refusal on that retry SHALL fail the block, with `callback-error` (owner decision Q144). WHERE the
`core` entry sets `sweep: off` (development only), step (5) SHALL delete no node while steps (1)–(4) and (6) still run;
the first block with `sweep: on` again SHALL delete the queue by step (5).

#### Scenario: Same deletions on two machines
- **WHEN** the same chain is synced on PostgreSQL and on PGlite
- **THEN** after every block the stored ledger nodes, reference counts and queue are identical

#### Scenario: Reused content after a deletion
- **WHEN** a node deleted at block h1 is needed again by the state at h2
- **THEN** the ledger inserts it again at h2, its references are counted again, and loading the state at h2 succeeds

#### Scenario: A released state is deleted the block after its release
- **WHEN** `retainStates` is 0 and block h releases the state after h − 1
- **THEN** no node of that state is deleted at h, and at h + 1 every node of it that neither the states after h and
  h + 1 nor a node block h + 1 writes reaches is deleted

#### Scenario: A node written again unchanged changes no count
- **WHEN** block h's batch writes again a node stored at h − 1 with the same child list
- **THEN** no reference count changes because of it, and its row is untouched

#### Scenario: A reference a rewrite drops waits one block
- **WHEN** block h rewrites a stored node so that its new child list no longer references key k, and nothing else
  references or persists k
- **THEN** k is not deleted at h, it is queued, and it is deleted at h + 1 unless something references or persists it by
  then

#### Scenario: A node queued and referenced again is kept
- **WHEN** a key is queued at h − 1 and one new node of block h references it once
- **THEN** it is not deleted at h, it leaves the queue, and its count is 1

#### Scenario: A reference to a missing node
- **WHEN** a test package flushes, at block h, a new node that references a key that is not stored and not new
- **THEN** processing halts at h with `ledger-refcount-invalid` (`missing-reference`) and nothing of h is stored
