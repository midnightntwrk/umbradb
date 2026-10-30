# 00045 — Mutual TLS does not bind a certificate to an instance id

- **Status:** OPEN
- **Area:** security
- **Severity:** med
- **Effort:** large — tying a certificate to an instance name needs a configuration and transport design, not a patch.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

The core's transport checks a private process's client certificate against the trusted roots (PP-11, opt-in mutual TLS),
then accepts the instance id the peer declares in its `hello`. Any client with a certificate from a trusted root can
claim another instance's id — for example an absent lockstep instance's — and its first report's height is counted
without its hash being checked. Later reports are checked against public block hashes, not against the private
computation, so every authorized peer is trusted to report honest progress.

Found by the 0.10.0 threat model draft (Codex, 2026-10-28; `~/todo/Umbra/experiments/00028-threat-model-draft.md`), its
gap list; the owner chose to record it for later (2026-10-28).

## Evidence

- `src/private/core-transport.ts:181`: the certificate chain checked.
- `src/private/core-transport.ts:289`: the peer's `hello.instance` accepted as declared.
- `src/private/core-transport.ts:305`: the initial height counted.

## Suggested fix

Map certificate identities (subject or SAN) to the instance ids they may claim, refuse a `hello` naming another id, and
check the first report's hash as later ones are; document that authorized peers remain trusted for honest progress, and
that a plain transport needs a protected network (PP-11).
