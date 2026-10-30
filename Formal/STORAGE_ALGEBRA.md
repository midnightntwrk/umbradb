# The laws of UmbraDB's storage helpers

Two laws hold for the tables UmbraDB's storage helpers give a module (`openspec/changes/core-arch`, SH-1 and SH-2):
**W1**, last write wins, for the cursor table, and **T5**, versions that neither overlap nor leave gaps, for the
height-versioned table. Each is checked by a property test on PostgreSQL and PGlite, and the Lean code under
`Formal/Lean` proves W1 over its model and the interval fact T5's first half rests on. The laws of 0.9.5's storage
library, its other property tests and the documents that went with them were removed with that library (core-arch
design §13; owner decision Q171 A); git history keeps them.

Notation: `[from, to)` is the half-open interval of heights from `from` up to, not including, `to`; a `to` of null
means "not closed yet".

---

## 1. Status of each law

- **T5 (1), versions never overlap.** Holds by the helper's trigger, the sole writer of the history table. Checked by
  A60's property test. Lean: `APISmoke.adjacent_Ico_disjoint`, the interval fact.
- **T5 (2), consecutive versions meet.** Holds by the same trigger and by one change per key per block (SH-3).
  Checked by A60's property test. Lean: none.
- **W1, last write wins.** Holds by one upsert per write, per key. Checked by A59's property test (P9). Lean:
  `UmbraDBFormal/Watermarks/**` and `APISmoke.watermark_overwrite`.

No Lean theorem relates its model to SQL, a trigger or the TypeScript helpers: the property tests, run against real
databases through the real block write handles, are what bridge the model and the code.

---

## 2. T5 — versions over heights (the height-versioned table)

The height-versioned table (`src/helpers/height-versioned.ts`, SH-2) keeps, for each key `k`, versions that each
cover a range `[from, to)` of block heights; the current version has `to` null. Writing `k` at height `h` closes the
current version at `h` and opens one from `h`; deleting it at `h` closes it without opening a new one; writing the
value `k` already has adds no version.

**Law T5.** For one key, the versions

1. **never overlap**: no height lies in two of them, so a read at a height finds at most one version; and
2. **meet at their boundary**: `to` of one version is `from` of the next, unless the key was deleted between them.

Both hold by the helper's trigger, the sole writer of the history table (a module may not `DELETE` or re-key its
rows, SQLSTATE `0A000`), and by the rule that a block changes a key at most once (SH-3). (1) is the half-open interval
fact: `[a, b)` and `[b, c)` are disjoint (`APISmoke.adjacent_Ico_disjoint`). (2) is not a database constraint; it
holds only while the trigger stays the one writer of the boundaries.

---

## 3. W1 — last write wins (the cursor table)

The cursor table (`src/helpers/cursor-table.ts`, SH-1) holds one row per key, `key text` → `value jsonb`, written
only through the module's block write handle: `write(w, key, v)` in `on-db-write`, `read(handle, key)` through any
handle.

**Law W1.** Per key, writing is an idempotent overwrite, `write(write(x, v), v) = write(x, v)`, and `read` returns
the last write. There is no version, no history and no fold: a cursor needs the current progress, not its lineage.
Monotonicity is not part of the law; a module that needs its cursor to move only forward checks that itself. The
value is canonical JSON (the database API's column rules), so what is read back is what was written. W1 holds per key;
a module that wants several kinds of cursor uses several tables or composite keys.

---

## 4. The Lean model

`Formal/Lean` (built and audited by `.github/workflows/lean.yml`) holds:

- `UmbraDBFormal/Watermarks/Model.lean` and `Laws.lean`: a store as a function from addresses to optional values,
  `set`, `get` and `runSets`, with W1's laws — `get_set_same`, `get_set_of_ne`, `set_set_same`, `set_idempotent`,
  `set_comm_of_ne`, `get_runSets_eq_lastMatching` (a read after a sequence of writes returns the last matching one)
  and `runSets_frame`. The model's address is a kind and a key; the cursor table's is a key alone, the case of one
  kind.
- `UmbraDBFormal/APISmoke.lean`: `watermark_overwrite` (two writes to one key equal the second) and
  `adjacent_Ico_disjoint` (T5's interval fact).
- `UmbraDBFormalTest/Trust.lean`: the audit that every declaration uses no axiom beyond `propext`, `Quot.sound` and
  `Classical.choice`, and no `sorry`.

---

## 5. Property tests

- **P9 (W1)**, as A59 (`test/helpers/cursor-table.property.test.ts`): for random sequences of writes over heights,
  some blocks rolling back, reading a key returns its last committed write, inside a block its own last write; on
  PostgreSQL and PGlite. Its negative control is a helper that keeps a key's first write.
- **T5**, as A60 (`test/helpers/height-versioned.property.test.ts`): for random writes, same-value writes and deletes
  over heights, some blocks rolling back, the table read at every height equals a reference model, and each key's
  versions never overlap and meet at their boundary unless deleted there; on PostgreSQL and PGlite. Its negative
  controls are a table that closes a version one height late (an overlap) and one that closes it one height early (a
  gap).

Both pin their `fast-check` seed and name it in the test's title.
