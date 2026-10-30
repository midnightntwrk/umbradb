# 00034 — `contract_logs.logs.logical_segment` is 0 for every log: the ledger labels fallible contract events so

- **Status:** OPEN upstream; the module guide's note (`docs/module-guide.md`, contract logs) was added 2026-10-29.
- **Area:** logic
- **Severity:** low
- **Effort:** waiting on the ledger team — documented in the module guide meanwhile.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

CC-2 stores each MIP-0002 log's logical segment, as the ledger's event source gives it. With the vendored ledger
(9.1.0.0-rc.5), that value is 0 for every contract log, whichever segment emitted it: a fallible segment's logs carry
the logical segment of the guaranteed one. So the column cannot tell a guaranteed log from a fallible one; only the
physical segment, which `design.md` §10 does not store for logs, does.

It looks like an upstream slip rather than a meaning: in the same function the fallible section's zswap events carry
`logical_segment: segment` (the segment itself), while its unshielded-offer DUST events and its contract actions'
events (deploys, maintenance, contract logs) carry `logical_segment: GUARANTEED_SEGMENT, physical_segment: segment`.

`core-contract-logs-full` stores the ledger's value; `core-contract-logs-fast` gives the same (its `LOGICAL_SEGMENT`,
0, with the source cited), so the two providers agree, which A110 checks. Should the ledger change the label, `-fast`
must follow it in the same version (the rows would change), and `-full` follows by itself.

Found by task 13.1 (2026-10-27).

## Evidence

- `midnight-ledger` `ledger-9.1.0.0-rc.5` `ledger/src/semantics.rs`, `apply_section`: the guaranteed section's contract
  actions with `EventSource { logical_segment: segment (0), physical_segment: *phys_seg }`; the fallible section's
  unshielded offer and contract actions with `EventSource { logical_segment: GUARANTEED_SEGMENT, physical_segment:
  segment }`; `apply_zswap`'s events with `logical_segment: segment, physical_segment: segment`.
- `test/ledger/adapter-suite.ts` (task 12.1): a deploy's event — deploys run in the fallible section — at logical 0,
  physical 1; task 13.1's `test/backbone/contract-modules.test.ts`: a transaction of two intents whose fallible
  transcripts log, every log at logical 0 and physical 1 or 2, as the v9 package's own apply gives them.
- `src/backbone/core-contract-logs-fast/core-contract-logs-fast.ts`, `LOGICAL_SEGMENT`.

## Suggested fix

Ask the ledger team whether the fallible section's `EventSource` should name the segment as its logical segment (as its
zswap events do). Until it changes, document in the module guide that `logical_segment` is 0 for every contract log of
this ledger version; consider storing the physical segment as well (a change of `design.md` §10 and CC-2), which is
what tells the segments apart today.
