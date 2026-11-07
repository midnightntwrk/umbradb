# 00079 — midnight-ledger keeps a cached node created again with another child-list form, while its accounting reads the form (to report upstream)

- **Status:** OPEN
- **Area:** upstream — `midnightntwrk/midnight-ledger` (`storage-core`, `storage`); seen from UmbraDB's `core-ledger-state`
- **Severity:** unknown — no occurrence observed. If it occurs where the ledger's storage-cost accounting reads the
  node, a node that restarted and one that did not could compute different states from the same chain; at the least,
  their stored bytes for that node differ.
- **Effort:** upstream; small to describe, the fix is the ledger team's choice.
- **GitHub:** NOT IN GITHUB ISSUE — to be reported to `midnightntwrk/midnight-ledger` only with the owner's approval
- **Found:** 2026-11-02, at the stage-1 gate of the `ledger-refcount` change (fix checks 6 and 7, findings V1 and X1;
  related issue `docs/issues/00078`).

## Problem

A ledger node's key is the hash of its payload and its children's hashes, and a child's hash is the same whether the
child is embedded in the node (`ArenaKey::Direct`) or referenced by key (`ArenaKey::Ref`). So one key can be written
with two different child lists. Three facts of the pinned source make that observable:

1. **Which form is written depends on the package's memory.** A newly built child is embedded when small; `Sp::persist`
   and `Sp::into_tracked` turn a small node into a referenced one; `RcMap` builds referenced children; a node loaded
   from storage keeps the form it was stored in.
2. **A node created again while cached keeps its old form.** The back-end's `cache` keeps an object already in memory,
   on the stated assumption that "only reference counts can vary for a given key"; a node not in memory is created
   anew, without consulting storage (`layout-v2`). So a long-running process can keep an old form that a restarted
   process, which no longer holds the node, writes in the new form.
3. **The form is not only storage.** The storage-cost accounting (`update_rcmap`, `gc_rcmap`) reads a node's child
   list and counts a referenced child differently from an embedded one, and its result is ledger state.

Together: two processes with different restart histories can hold different forms of one key, and code that reads the
form can see different inputs. Both of the node's storage back-ends replace a node written again, so their databases
hold whichever form was written last.

## Evidence

(`upstream:` is `midnight-ledger` at tag `ledger-9.1.0.0-rc.5`, `67f9f97246339539af0091c4d8c6bc5ab236a191`.)

- Same hash in both forms: `upstream:storage-core/src/arena.rs:2847-2880` (upstream's own test).
- Embedded when small: `upstream:storage-core/src/storable.rs:139-159` (`child_from`, `SMALL_OBJECT_LIMIT` 1,024).
- Referenced form of a small node: `upstream:storage-core/src/arena.rs:1329-1352` (`into_tracked`), `:1525-1540`
  (`persist`, "baked into behaviour"); `upstream:storage/src/delta_tracking/rcmap.rs:199, 224, 251`.
- A loaded node keeps its stored form: `upstream:storage-core/src/arena.rs:975-990`.
- A cached node created again keeps its old object: `upstream:storage-core/src/backend.rs:485-512`; an uncached one is
  created without consulting storage: `upstream:storage-core/src/backend.rs:531-534`.
- The accounting reads the form: `upstream:storage/src/delta_tracking/mod.rs:199-300`.
- The back-ends replace a node written again: `upstream:storage-core/src/db/sql.rs:578-590, 621-630`
  (`INSERT OR REPLACE`), `upstream:storage-core/src/db/paritydb.rs:261-280` (`Set`).

## Suggested fix (upstream; the ledger team's choice)

1. Give every key one child-list form, independent of history (for example, always the form `child_from` gives for
   fresh content), so the assumption in `backend.rs` holds; or
2. make the accounting independent of the form (count a small child the same whether embedded or referenced); or
3. when a cached key is created again with another child list, replace the cached object, so a running process holds
   what a restarted one would write.

UmbraDB's own handling, without changing the ledger's logic, is the `ledger-refcount` change
(`openspec/changes/ledger-refcount/`): it stores what the ledger writes, replaces a node written again as the node
does, and checks every block's state root against the node's.
