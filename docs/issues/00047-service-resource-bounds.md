# 00047 — Resource limits are per message or connection, not per service

- **Status:** OPEN
- **Area:** security
- **Severity:** med
- **Effort:** large — service-wide limits (connections, subscriptions, read size while it is built) across the transport
  and the API.
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

The core transport admits any number of connections and builds a `read`'s whole result before its size check; the module
API has no limit on connections or subscriptions; PGlite ignores read timeouts; ledger work has no deadline (by design,
RN-17). A caller that reaches a port can exhaust memory, connections or the PGlite queue.

Found by the 0.10.0 threat model draft (Codex, 2026-10-28; `~/todo/Umbra/experiments/00028-threat-model-draft.md`), its
gap list; the owner chose to record it for later (2026-10-28).

## Evidence

- `src/private/core-transport.ts:417`: connections admitted without a limit; `:347`: results built before the size
  check.
- `src/runner/api-server.ts:231`, `:418`: no aggregate limit on connections and subscriptions.
- `src/db/pglite.ts:307`: read timeouts not applied on PGlite.
- `src/ledger/worker/host.ts:16`: ledger work without a deadline (RN-17).

## Suggested fix

Bound connections, subscriptions, queued work, a read's rows and bytes (while reading, not after) and request rates;
define how an operator recovers from stalled ledger work; keep PGlite-backed services on development networks.
