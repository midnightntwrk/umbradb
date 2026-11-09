# Spec delta — `ledger` capability

Modifies `core-arch`'s `specs/ledger/spec.md`. EARS forms and terms as in `core-arch`'s `specs/runner/spec.md`; the
ledger's terms as in `core-arch`'s `specs/ledger/spec.md`. The modified requirement is restated in full; the change is
which runtime's metadata decodes a block's content when the runtime in the block's own state and the one in its
parent's differ (`design.md` D1).

## MODIFIED Requirements

### Requirement: LG-4 Block content is decoded with the runtime that built it

THE system SHALL decode a block's extrinsics and events with the metadata of the runtime whose `spec_version` is the
block's `MNSV` version: the runtime in the block's own state WHEN its `spec_version` (`state_getRuntimeVersion` at the
block's hash) is the `MNSV` version; else the runtime in its parent's state WHEN that one's is (block 0: its own); and
IF neither is THEN processing SHALL halt with `metadata-mismatch`, naming the block, its `MNSV` version and both
runtimes' versions. Metadata SHALL be cached by `spec_version`, never stored under another runtime's version. Reads of a
block's own state SHALL use the runtime in that state.

#### Scenario: An enactment block of the earlier form
- **WHEN** block U enacts a runtime upgrade inside itself, so that U's `MNSV` version and its parent's runtime are the
  old one and U's own state holds the new one (preview 556, mainnet 2,738,210)
- **THEN** U is decoded with the old runtime's metadata (from U − 1) and F = U + 1, whose `MNSV` version is the new one,
  with the new runtime's (from U)

#### Scenario: The first block of node 2.1's upgrade
- **WHEN** a block's `MNSV` version and its own state's runtime are the new one, and its parent's state still holds the
  old one (preview 1,572, mainnet 3,346,139, preprod 3,348,434)
- **THEN** the block is decoded with the new runtime's metadata (read at the block), and processing goes on to the next
  block

#### Scenario: No runtime matches
- **WHEN** a block's `MNSV` version is neither its own state's runtime version nor its parent's
- **THEN** processing halts at that block with `metadata-mismatch`, naming the block's hash, its `MNSV` version and both
  runtimes' versions, and the block does not commit
