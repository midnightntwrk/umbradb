# 00026 — A configuration's `core` revisions may name different networks

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-10-26, during task 10.2a of `openspec/changes/core-arch` (the node's genesis hash compared with the
  configured network's at every start, decision records Q117 A and Q120 B). The configuration code involved is tasks
  4.1 and 4.2's; task 10.2a did not change it.

## Problem

`network` and `genesisHash` are data fields of the `core` entry (CF-4), and a data field may change at a revision, so a
configuration whose `core` entry is `coreEntry({ start: 0, config: { network: "preprod", … } })` followed by
`coreEntry({ start: 5000, config: { network: "mainnet", … } })` is accepted. No node serves both networks: the chain's
genesis hash is one value for the whole database.

Task 10.2a compares the node's genesis hash with the network of the process's `core` revision (the one whose
operational fields the process runs with, Q102), so on an empty database with a mainnet node the configuration above
starts: the node's genesis hash is recorded, heights 0–4999 are processed under a revision that names preprod (its
built-in ledger table among its data fields) and from 5000 under one that names mainnet. On a database with a cursor
the stored genesis hash then catches every later node of the other network, so no wrong chain is mixed in, but the
history records a network the database never held.

## Evidence

- `src/config/core-settings.ts:98-99` — `network` and `genesisHash` are data fields (`DATA`), which revisions may change.
- `src/config/validate.ts` — no rule compares the `network` (or `genesisHash`) of one `core` revision with another's.
- `src/runner/process.ts` (`#open`) — `checkChain` is given `configuredGenesisOf(settings)`, the process revision's
  settings only.

## Suggested fix

Refuse, in the configuration's validation (`invalid-configuration`, a finding at the later revision's `network` or
`genesisHash`), a `core` revision whose network or `custom` genesis hash differs from the earlier revisions': the chain
of a database is fixed at its first start. Alternatively compare the node's genesis hash with every `core` revision's
configured network in `checkChain`. Either changes CF-4's text (a data field that may not change), so it is the owner's
decision.
