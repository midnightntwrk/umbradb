# 00048 — No advisory scan covers the vendored Rust crates, and releases have no provenance

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

The vendored ledger packages are rebuilt and compared byte for byte in CI, but the blocking advisory scan covers npm
only: no scan reads the patched Rust crates' dependency graphs. Releases carry no verifiable provenance. The
supply-chain notes also state facts that are no longer true (issue 00044).

Found by the 0.10.0 threat model draft (Codex, 2026-10-28; `~/todo/Umbra/experiments/00028-threat-model-draft.md`), its
gap list; the owner chose to record it for later (2026-10-28).

## Evidence

- `.github/workflows/vendored-ledger.yml:45`: rebuild and compare.
- `.github/workflows/supply-chain.yml:73`: the advisory scan, npm only.
- `docs/supply-chain/slsa.md:104`: release provenance absent; `:61`: a stale `private: true`, version `0.1.0`.

## Suggested fix

Scan the vendored crates' `Cargo.lock` graphs (for example `cargo audit` or `osv-scanner`) as a blocking gate, assign
who triages advisories, and attach verifiable provenance (SLSA, npm provenance) to releases.
