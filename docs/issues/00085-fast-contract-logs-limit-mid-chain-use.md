# 00085 — The fast contract-log provider limits mid-chain use: development-only, and it halts on partial transactions

- **Status:** OPEN
- **Area:** contract data (`core-contract-logs-fast`)
- **Severity:** medium for the `token-metadata` change's showcase (a live browser demo stops), low for the core.
- **Effort:** medium — a spec change to CC-3 and its acceptance, then the module.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-05, while drafting `openspec/changes/token-metadata/` (proposal decision D-C), on branch
  `00028-core-arch` at `dd56c93`.

## Problem

`token-metadata` can start at any height only through `core-contract-logs-fast`: `core-contract-logs-full` needs
`core-ledger-state` from height 0 or a restored backup (CC-2). The fast provider has two limits that a mid-chain
deployment meets:

1. It is development-only (`developmentOnly`, MD-5), so a production process that starts mid-chain needs the
   development opt-in. The browser build always sets it (`docs/browser.md:104`); a server does not.
2. It halts the whole process with `fast-log-unsupported` (`partial-transaction`) on any partially successful
   transaction that logs, because the chain's `TxPartialSuccess` does not say which fallible segments failed
   (`src/backbone/core-contract-logs-fast/core-contract-logs-fast.ts:16-25`; CC-3, owner decision Q19 D). A live demo
   that meets one such transaction stops until it is restarted with another provider or start height.

## Evidence

- `src/backbone/core-contract-logs-fast/core-contract-logs-fast.ts:1-25` (the module comment: the cases and the halt).
- `openspec/changes/core-arch/specs/contract-data/spec.md` CC-3.
- `openspec/changes/token-metadata/design.md`, Risks.

## Suggested fix

A change to CC-3 that, instead of halting, stores no log for a partially successful transaction and records the
transaction as skipped in a table of its own (so consumers can tell a gap from an absence), or reads the segment
outcomes from the node when it can. Whether the provider can then leave development-only status is a decision for the
owner.
