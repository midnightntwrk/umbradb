# 00044 — `docs/supply-chain/` states a gate set and package counts that are no longer true

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

Task 17.4a (`openspec/changes/core-arch`, owner decision Q169) classified `docs/supply-chain/` as current: it
describes the supply-chain gates and the third-party components of the tree as it is. Some of its statements are not
true any more. It says the supply-chain gate is "pending merge to `main`" and that `conformance.yml` is the one merge
gate, while `.github/workflows/` holds eight workflows, `supply-chain.yml` among them, on `main`. Its npm totals are
those of an older lock file. A reader checking the project's posture against these pages gets the state of
2026-07, not the tree's.

## Evidence

- `docs/supply-chain/README.md:88` — "Today the one merge gate is **`.github/workflows/conformance.yml`**"; the tree's
  `.github/workflows/` holds `bench-smoke.yml`, `conformance.yml`, `graph.yml`, `lean.yml`, `pack-smoke.yml`,
  `scan.yaml`, `supply-chain.yml` and `vendored-ledger.yml`.
- `docs/supply-chain/README.md:91` — the G18 gate "**landed in this change**"; `:107-108` — its files "are
  **committed as part of this change** (`v1.0.0-infosec-signoff`) and are **pending merge to `main`**".
- `docs/supply-chain/slsa.md:105` — row G-b: "committed in `v1.0.0-infosec-signoff` and pending merge to `main`".
- `docs/supply-chain/inventory.md:10` — "19 direct (5 runtime + 14 dev) · **307 packages total** in
  `package-lock.json`"; at task 17.4a's tree `package.json` has 5 runtime and 16 dev dependencies (21 direct) and
  `package-lock.json` 463 package entries besides the root.

## Suggested fix

Restate the gate section for the workflows the tree holds (what each gates, which are required), drop the "this
change" and "pending merge" wording, and recount the npm totals from the lock file, or state them without figures that
drift. A static test could hold the direct-dependency counts equal to `package.json`, as the inventory's other pins
are held.
