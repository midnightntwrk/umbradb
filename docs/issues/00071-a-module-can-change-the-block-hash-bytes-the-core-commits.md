# 00071 — A module can change the bytes of the block's hash it is given, and the core commits or checks the changed bytes

- **Status:** OPEN
- **Area:** runner (the block context the loop gives each callback; `src/runner/loop.ts`)
- **Severity:** medium — a user module's callback (host code, through the module API) that writes into `b.hash` or
  `b.parentHash` changes the loop's own block: changed in `on-compute`, `core-block-commit` commits the block under the
  changed hash and processing halts at the next height with `parent-mismatch`; changed in `on-db-write`, after
  `core-block-commit` wrote its row, the loop's cursor check halts with `unexpected-cursor`. Modules otherwise write only
  their own schemas (DB-6), so this is the one way found for a module to change what the core records of a block. No
  attacker is involved: a module bug (reusing the array as a buffer) is enough.
- **Effort:** small — the core reads its own protected copy of the block's byte arrays for its checks and the commit,
  each callback gets its own copy (or an immutable view), and a test shows that a module's change is seen by nothing
  else.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, while investigating issue 00060 (`start-umbradb` P11.1) on a Mac with Node.js 24.9.0, by
  scratch runs through the process (`test/runner/process-build.ts`'s build, `InMemoryBlockSource`, head 8) on
  PostgreSQL 18 and PGlite 0.5.10. Not this change's: filed and skipped.

## Problem

`FinalizedLoop`'s block context is `Object.freeze({ height: block.height, hash: block.hash, parentHash:
block.parentHash, … })` (`src/runner/loop.ts:1173-1186`): the frozen object holds the very `Uint8Array`s of the loop's
`run.block`, and freezing an object does not freeze a typed array's bytes. Every callback of the height gets them, and
`core-block-commit` writes the block's row and its hash's row from `b.hash` and `b.parentHash`
(`src/backbone/core-block-commit/core-block-commit.ts`, `writeBlockRow`, `writeHashRow`). So:

- a module that changes `b.hash` in `on-fetch` … `on-compute`, or in an `on-db-write` callback before
  `core-block-commit`'s (none today: it is first), makes the core commit the block under the changed hash. Seen on both
  backends: block 3's row holds `0x750e8a…` instead of block 3's `0x8a0e8a…`, and block 4 halts with `parent-mismatch`
  ("the block at height 4 names the parent 0x8a0e8a…, but the block at height 3 is 0x750e8a…"). The wrong row stays
  committed;
- a module that changes it in its `on-db-write`, after `core-block-commit` wrote the row, makes the loop's check before
  the `COMMIT` (`src/runner/loop.ts:777-790`) compare the row with the changed bytes: the height halts with
  `unexpected-cursor` ("left the cursor at height 3 with another hash"), on both backends;
- after the `COMMIT`, `on-after-db-write` and `on-stop-height` callbacks, and a private process's report to the core
  (`core-private-source`'s `committed`, from `b.hash`), see the changed bytes (read from the code, not run).

## Evidence

- `src/runner/loop.ts:1176-1179` — `hash: block.hash, parentHash: block.parentHash`, no copy.
- `src/runner/loop.ts:778` — the cursor check compares the row with `run.block.hash`, the same array.
- The scratch test of the investigation (two cases per backend: a module whose `on-compute`, or `on-db-write`, at height
  3 runs `b.hash[0] ^= 0xff`), recorded in the `start-umbradb` plan's P11 notes.

## Suggested fix

The core must read its own protected copy of the block's `hash` and `parentHash` for its own checks and the commit —
`core-block-commit`'s parent check and rows (`src/backbone/core-block-commit/core-block-commit.ts:118-147`, `:186`,
which read the context's `b.hash` and `b.parentHash`) and the loop's cursor check before the `COMMIT` — and each
callback must get its own copy of those bytes (or an immutable view of them), so that no callback can change what
another callback sees or what the core writes. One copy per height shared by the callbacks is not enough:
`core-block-commit` is itself one of the height's callbacks and reads the context's bytes, so an earlier callback
could still change them before the core writes its rows. Test on both backends that a module's change of its bytes,
in `on-compute` and in `on-db-write`, changes neither the committed rows nor another callback's view. The check before
the `COMMIT` then no longer sees a module's change; another writer on a server database still reaches it
(`test/runner/halts.test.ts`).
