# 00046 — The admin endpoints listen on all interfaces by default, and no HTTP service has an access policy

- **Status:** OPEN
- **GitHub:** NOT IN GITHUB ISSUE

## Problem

`listen.admin` defaults to `0.0.0.0:8081` and the admin endpoints answer without authentication; the module API (HTTP
and WebSocket on `listen.api`) accepts any caller, with no Origin check for WebSocket subscriptions. A module handler
that serves private data exposes it to anyone who reaches the port.

Found by the 0.10.0 threat model draft (Codex, 2026-10-28; `~/todo/Umbra/experiments/00028-threat-model-draft.md`), its
gap list; the owner chose to record it for later (2026-10-28).

## Evidence

- `src/config/core-settings.ts:47`: the admin default address.
- `src/admin/serve.ts:66`: answers without authentication.
- `src/runner/api-server.ts:408`, `:418`: HTTP and WebSocket accepted without authentication or Origin checks.

## Suggested fix

Default `listen.admin` to `127.0.0.1:8081` (public exposure an explicit setting), document running the module API behind
an authenticating TLS proxy, and give modules an authorization contract, with a WebSocket Origin policy where it
applies.
