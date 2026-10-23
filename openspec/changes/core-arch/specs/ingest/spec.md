# Spec delta — `ingest` capability

EARS forms and terms as in `specs/runner/spec.md`. **S** is the database's start height; the **anchor** is the block at
S, whose parent hash is not checked; the **queue** holds best blocks above the finalized head, fetched and parsed in
memory, never stored; the **node** is the Midnight node, the indexer's only source of chain data.

## ADDED Requirements

### Requirement: IN-1 The database holds finalized blocks only

THE system SHALL write only finalized blocks to the database and SHALL keep best blocks only in the in-memory queue,
which no API reads.

#### Scenario: A crash with a full queue
- **WHEN** the process is killed while 20 best blocks are queued above the finalized head
- **THEN** after restart the database contains no row of a non-finalized block

### Requirement: IN-2 Bootstrap of an empty database

WHEN the process starts on an empty database, THE `core-chain` part SHALL record the configuration and read the
node's genesis hash (`chain_getBlockHash(0)`) and finalized head; WHILE S is above the finalized head THE process SHALL
wait in state `starting` with the condition `waiting-for-node`; THE anchor hash SHALL be recorded in the transaction of
block S. IF bootstrap is interrupted before block S commits THEN the next start SHALL repeat it; every bootstrap step
SHALL be idempotent and nothing SHALL be processed until block S commits.

#### Scenario: S above the node's head
- **WHEN** S is 1,000 and the node's finalized head is 990
- **THEN** the process stays `starting` with `waiting-for-node` and commits block 1,000 once the head reaches it

### Requirement: IN-3 Startup checks on an existing database

WHEN the process starts on a database with a cursor, THE system SHALL refuse startup IF the node's genesis hash differs
from the stored one or the node's finalized hash at the cursor height differs from the cursor's hash; and WHILE the
node's finalized head is below the cursor THE process SHALL wait with the condition `waiting-for-node`.

#### Scenario: A node of another network
- **WHEN** the configured node reports another genesis hash
- **THEN** startup refuses with `genesis-mismatch` and both hashes

### Requirement: IN-4 Every finalized height, once, in order

THE system SHALL process every height from cursor + 1 up to the node's finalized head in order without skipping one,
using `chain_getFinalizedHead` at start and `chain_subscribeFinalizedHeads` only as a bound that may jump, repeat or be
lost on reconnect. WHEN a height h is processed, `core-block-fetch` SHALL read the finalized hash
(`chain_getBlockHash(h)`), and: a queued block with that hash SHALL go on to `on-compute` with its parsed data; a queued
block with another hash SHALL be dropped with everything queued above it (`on-rollback`) and the finalized block fetched
and parsed; with nothing queued at h, the block SHALL be fetched and parsed. IF a block's parent hash differs from the
cursor's hash, except for the anchor, THEN processing SHALL halt (`parent-mismatch`). IF a finalized-head notification
at or below the cursor carries a hash other than the stored block's at that height THEN processing SHALL halt
(`finality-conflict`).

#### Scenario: A jumping, repeating subscription
- **WHEN** finalized notifications report heads 10, 13, 13, 12, then the connection drops and the next notification is
  20
- **THEN** heights 11 through 20 are each committed once, in order

### Requirement: IN-5 Finalized prefetch

WHILE the cursor is behind the finalized head, THE system SHALL fetch and parse heights ahead of the cursor, up to a
window of `prefetchWindow` heights (operational, default 64) with bounded concurrency, keep the parsed blocks in
memory, and still commit each height in its own transaction in order.

#### Scenario: Catch-up uses the window
- **WHEN** the cursor is 1,000 behind and `prefetchWindow` is 64
- **THEN** at no time are more than 64 heights above the cursor fetched or held, and commits stay one per height

### Requirement: IN-6 The best-block queue

WHEN `chain_subscribeNewHeads` reports a block above the finalized head, THE system SHALL fire `on-best-block`, fetch
and parse it, and append it IF its parent is the top of the queue; OTHERWISE it SHALL walk the new block's parents back
to a queued block or the finalized head, drop every queued block above that common ancestor (`on-rollback`) and fetch
the new branch. Best blocks at or below the cursor SHALL be ignored. THE queue SHALL hold at most `tipCap` blocks
(operational, default 600); WHILE it is full, new best blocks SHALL NOT be queued and the status SHALL report the
condition `finality-stall`.

#### Scenario: A best-chain switch
- **WHEN** queued blocks 101–103 on branch A are replaced by 101′–104′ on branch B
- **THEN** `on-rollback` fires once naming 101–103, the queue holds 101′–104′, and when 101′ is finalized it is used
  without being fetched again

### Requirement: IN-7 Block 0

WHERE S = 0, THE system SHALL process block 0 as the official indexer does: its runtime version from its `MNSV` digest;
its transactions numbered in body order, each fully successful; its ledger state from the node's
`system_properties.genesis_state` — IF that state's root equals the node's `midnight_ledgerStateRoot` at block 0 THEN
the transactions SHALL be applied to an empty state only to produce their results, segment results, events and logs,
and the genesis state SHALL become the state after block 0; OTHERWISE they SHALL be applied to the genesis state; the
root after block 0 SHALL be checked like any other; its cNight registrations SHALL be read from pallet storage at block
0 and numbered in read order.

#### Scenario: A genesis state that already includes block 0
- **WHEN** the genesis state's root equals the node's root at block 0
- **THEN** block 0's transaction results are stored and the state after block 0 is the genesis state, whose root
  matches the node's

### Requirement: IN-8 Only these node calls

THE system SHALL read chain data only from the node, only through `chain_subscribeNewHeads`,
`chain_subscribeFinalizedHeads`, `chain_getFinalizedHead`, `chain_getBlockHash`, `chain_getBlock`, `chain_getHeader`,
`state_getStorage`, `state_getMetadata`, `state_getRuntimeVersion`, `midnight_ledgerStateRoot` and `system_properties`,
and SHALL NOT depend on the official indexer or a wallet SDK at run time.

#### Scenario: A full sync against a tape
- **WHEN** a sync of 1,000 heights runs against a tape node that answers only these methods
- **THEN** it completes, and the tape node received no other method

### Requirement: IN-9 The node must serve every block and its state

IF the node answers that a finalized block, or the state at a finalized block, is unavailable (for example pruned)
THEN processing SHALL halt with `node-requirement`, without retrying.

#### Scenario: A pruned node
- **WHEN** the node answers "state unavailable" for the events of a finalized height
- **THEN** processing halts with `node-requirement` and that height

### Requirement: IN-10 Errors are retried or halt, by kind

THE system SHALL handle errors as follows: a node connection error, timeout, HTTP 429 or 5xx during startup, the
subscriptions or finalized processing SHALL be retried with exponential back-off from 1 s doubling up to
`backoffCeilingMs` (default 30 s) without limit, with the condition `node-retrying`; a lost database connection SHALL be
retried the same way with `database-retrying`, the writer lock re-acquired (DB-11), and, if a COMMIT was in flight,
IN-11 applied; any error on a queued best block (node error or timeout, fetch, decode, callback) SHALL drop that block
from the queue without retry; every other error at a finalized height SHALL roll back and halt (RN-8).

#### Scenario: A flapping node
- **WHEN** the node refuses connections for 2 minutes during catch-up
- **THEN** the process retries with back-off reaching 30 s, reports `node-retrying`, and resumes without skipping or
  repeating a height

### Requirement: IN-11 Recovery after an uncertain COMMIT

IF the database connection is lost during COMMIT THEN THE system SHALL discard the ledger worker's in-memory state,
reconnect, re-acquire the writer lock, and read the cursor: IF it is h with the hash of the block being committed THEN
the block committed, the state at h SHALL be reloaded and processing SHALL continue with `on-after-db-write`; IF it is
h − 1 THEN the state at h − 1 SHALL be reloaded and h processed again from `on-compute`; OTHERWISE processing SHALL
halt (`unexpected-cursor`).

#### Scenario: The connection drops during COMMIT and the commit landed
- **WHEN** the backend is terminated after the server committed h but before the client saw the result
- **THEN** after reconnecting the cursor is h, h is not processed again, and `on-after-db-write` fires for h

### Requirement: IN-12 Startup refusals and halts

THE system SHALL refuse startup, staying up, live and not ready with the reason, on every refusal listed in
`design.md` §11, and SHALL halt processing, leaving the database at the last committed height, on every halt listed
there.

#### Scenario: Every refusal and halt has a test
- **WHEN** the refusal and halt list of `design.md` §11 is compared with the test suite
- **THEN** each entry has a test that triggers it and checks its code
