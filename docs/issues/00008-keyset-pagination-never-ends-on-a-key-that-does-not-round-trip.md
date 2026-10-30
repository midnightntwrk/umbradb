# 00008 — The rows of a table are read forever when a key read back does not round-trip

- **Status:** OPEN
- **Area:** logic
- **Severity:** low
- **Effort:** small — stop reading when a page does not move forward; latent today, no key type triggers it.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-24, during task 2.2b of `openspec/changes/core-arch` (date and time values), by its mutation-style
  negative controls: two wrong variants of the date and time mapping made the determinism suites hang instead of fail.

## Problem

`rowsInKeyOrder` (`src/determinism/module-tables.ts`, written in task 1.2) reads a table a page at a time with keyset
pagination: each next page is `WHERE (key) > (last key read) ORDER BY key LIMIT n`, the last key being the value the
read handle returned for the page's last row, sent back as a parameter. Nothing checks that a page moves forward. If a
key value does not survive the round trip — the handle returns it rounded, so that the value sent back is smaller than
the stored one — the next page starts at or before the row it just read, and with a page of one row (or a page whose
rows all share the rounded key) the same page is read again forever. The contents hash (`contentsHash`) streams these
rows too, and its row-count check (`row-count-changed`) runs only after the stream ends, so it never fires.

With the database API as built, every key type round-trips exactly (integers as `number`/`bigint`, `text`, `bytea`,
`uuid`, `boolean`, and since task 2.2b `timestamptz` as RFC 3339 text with its microseconds), so no current read loops.
The risk is a future change to the mapping, or a key type added to DT-2 whose read value is lossy, which would turn a
wrong value into a hang rather than a failure — on a startup or a backup check, a process that never finishes.

## Evidence

- `src/determinism/module-tables.ts:182-189`: the `for (;;)` loop ends only when a page is shorter than `pageSize`;
  `after` is taken from the handle's last row without comparing it with the previous `after`.
- `src/determinism/contents-hash.ts`: `rows !== count` is checked after the `for await` over `rowsInKeyOrder` ends.
- Task 2.2b's mutation pass (2026-10-24, scratch runner outside the clone): mapping a `timestamptz` to a JavaScript
  `Date` (milliseconds only) or to text cut to milliseconds made `test/determinism/module-tables.test.ts`'s
  `timestamptz` key-order test (page size 1, a key at `…14:30:00.000001Z`) and the contents hash's oracle loop; the
  suite did not end within 300 s and was killed. Both variants are wrong code, so the hang is a caught failure, but a
  slow and unclear one.

## Suggested fix

Make the loop fail instead of repeating: in `rowsInKeyOrder`, refuse a page whose last key is not greater than the
previous page's last key in DT-2's order (compare the two keys with a single `SELECT ($1, …) > ($2, …)` on the same
handle, or keep the encoded keys and compare them where the key types allow), with an error naming the table and the
key (`unreadable-result`-like, or a new code); and in `contentsHash`, stop with `row-count-changed` as soon as more rows
than counted have been read. A test would use a read handle that rounds its key values.
