# 00036 — `InMemoryBlockSource`'s default blocks name runtime 2.0 with ledger `v9`, which the tables now map to `v9-rc3`

- **Status:** CLOSED — fixed 2026-10-29: `IN_MEMORY_SPEC_VERSION` is 2,001,000 (runtime 2.1, ledger v9), and
  `test/backbone/core-block-fetch.test.ts` checks that every known network's table maps it to `IN_MEMORY_LEDGER`.
- **Area:** logic
- **Severity:** low
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-27, during task 12.2a of `openspec/changes/core-arch` (owner decision Q139 A: runtime 2.0's ledger
  is the package `v9-rc3`), outside its change: the constants are `src/runner/`'s (task 5.2, task 10.3's block items).

## Problem

`InMemoryBlockSource` (exported; for tests and module authors) gives every block it makes, unless told otherwise, the
`spec_version` 2,000,000 — "runtime 2.0's (CORE-ARCH §4.8), whose ledger is v9" — and the block item `ledger-version`
`v9`. Since task 12.2a, LG-3's built-in rows map 2,000,000–2,000,999 to `v9-rc3` (ledger v9 as runtime 2.0 built it,
`ledger-9.1.0.0-rc.3`) and 2,001,000 on to `v9` (rc.5). The in-memory blocks therefore pair a runtime with a ledger no
built-in table pairs it with, and the constant's comment is no longer true. Nothing breaks today: the in-memory blocks
carry no Midnight transactions and do not go through the version table, and no test runs `core-ledger-state` over them.
A module author who builds a block with transactions on that default and expects the built-in tables' ledger would get
the rc.5 one.

## Evidence

- `src/runner/in-memory-source.ts:27-31`: `IN_MEMORY_SPEC_VERSION = 2_000_000` ("runtime 2.0's … whose ledger is v9"),
  `IN_MEMORY_LEDGER = "v9"`; `:182` `"ledger-version": own.ledger ?? IN_MEMORY_LEDGER`.
- `src/ledger/networks.json` (task 12.2a): `{ "specVersionMin": 2000000, "specVersionMax": 2000999, "ledger": "v9-rc3" }`,
  `{ "specVersionMin": 2001000, "specVersionMax": 2999999, "ledger": "v9" }` for every known network.
- `test/backbone/core-block-fetch.test.ts:100-108` and `test/backbone/block-fetch-stand-in.ts:20-23` hold the two
  constants as they are (`expect(IN_MEMORY_LEDGER).toBe("v9")`).

## Suggested fix

Make the default runtime 2.1's — `IN_MEMORY_SPEC_VERSION = 2_001_000`, whose ledger is `v9` — and correct the comment;
or keep 2,000,000 and make `IN_MEMORY_LEDGER` `"v9-rc3"`. The first keeps the in-memory blocks on the release the current
node builds and changes no ledger name a test reads; either changes the `spec_version` or the ledger every in-memory
block records (`core_block_commit.blocks`), so the tests that hold the constants change with it.
