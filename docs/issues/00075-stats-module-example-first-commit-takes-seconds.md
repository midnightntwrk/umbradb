# 00075 — The stats-module example takes seconds to commit its first height, with nothing in the log that says why

- **Status:** CLOSED — measured and documented 2026-11-02 in `c0ea6b2` (`start-umbradb` P12.B): 7.2–7.8 s to the first
  commit on this Mac, about 6.4 s of it the node's answers, the first fetch (3.7–3.9 s) the largest phase; the README's
  example section now says the first rows take several seconds, waiting for the node, and what `/status` shows
  meanwhile. The prefetch's share is issue 00076, open.
- **Area:** examples and documentation (the README's "Example: loading `stats-module`"); the node source's first fetch
  (`src/backbone/core-block-fetch/node-source.ts`)
- **Severity:** low — a user following the README sees `umbradb run` start, log the admin address and the database,
  then nothing for several seconds before rows appear, and can take it for a hang. Nothing is wrong: the time goes to
  the node's answers.
- **Effort:** small — say it where the README runs the example; the node source's own share is issue 00076.
- **GitHub:** NOT IN GITHUB ISSUE
- **Found:** 2026-11-02, by a user run of the README on `v0.10.0-rc.1` (finding 7: "about 20 s before the first
  commit"); measured on the branch `00028-core-arch` at `97e50c5` (below).

## Problem

The README runs the example against the public preview node (`wss://rpc.preview.midnight.network`). Between the log's
`database: pglite data/preview` and the first commit, the process waits on the node for most of the time and logs
nothing: `/status` shows `starting`, then `syncing` with `cursor` null.

## Evidence

Measured 2026-11-02 on a Mac (Node.js 24.9.0, the built package, `npm run build`), from a new data directory, against
the README's node, about 250 ms of round trip away (a WebSocket call: 232–250 ms; `chain_getBlock` of block 0, 306 KB,
1.2 s; the runtime metadata, 205 KB, 0.25–0.47 s):

- `./run.sh` as the README runs it (`umbradb run`, `/status` polled): `/status` answers at 0.3 s, `syncing` at 3.6 s,
  the cursor first seen at 8.3 s (heights 0–7 committed; `/status` is published once a second); SIGTERM at 18.3 s, the
  stop's two lines (issue 00072), exit 0.
- The same configuration and module through `startUmbraDB` with a timing module (each point's time taken inside its
  callback), three runs from a new directory and one restart:

| Phase | Run 1 | Run 2 | Run 3 (through a logging proxy) | Restart (cursor 3) |
|---|---|---|---|---|
| package import, configuration, validation, admin listener | 0.16 s | 0.14 s | 0.14 s | 0.15 s |
| PGlite: a new data directory created and opened (an existing one: opened) | 0.71 s | 0.75 s | 0.77 s | 0.14 s |
| node connection (TLS) and chain check, writer, history, migrations → `on-start-db` | 1.79 s | 1.45 s | 1.65 s | 3.09 s |
| `on-start-db` → `on-start-api` (the node's subscriptions and head: 4 calls in series) | 1.00 s | 0.96 s | 1.01 s | 0.01 s |
| **the first fetch: `on-finalized` → `on-fetch` of the first height** | **3.72 s** | **3.91 s** | **3.75 s** | **3.46 s** |
| `on-fetch` → the first height's `on-db-write` (the ledger worker's parse) | 0.36 s | 0.32 s | 0.34 s | 0.29 s |
| **the first commit** | **7.75 s** | **7.55 s** | **7.67 s** | **7.16 s** |

- The logging proxy's record of run 3 (each JSON-RPC call with its time): the first fetch is the node source's
  prefetch reading the finalized hash of every height of its window — `chain_getBlockHash` for heights 0–63, 8 at a
  time, 8 round trips, 2.0 s — before it asks for any block; then `chain_getBlock` of heights 0–7 (0.7–1.4 s, block 0
  the largest), `state_getRuntimeVersion`, `state_getMetadata` and the events' `state_getStorage` (about 1 s). The
  ledger worker's WASM is not on the path: it loads while startup runs, and the first parse ends 0.3 s after `on-fetch`.
- So of about 7.7 s to the first commit here, about 6.4 s is the node's answers (connection and checks 1.4 s,
  subscriptions 1.0 s, the first fetch 3.75 s, of which 2.0 s are the hash reads ahead of block 0), 0.75 s PGlite's new
  directory and the rest local. The reported 20 s was not reproduced: on this Mac it is 7–8 s; a slower link to the
  node stretches each of the round trips made one after another before the first commit (about 20, the connection's
  handshakes besides).

## Suggested fix

The first fetch is the largest phase and it is the node's, so a note where the README runs the example (the measured
time, what the process waits for, what `/status` shows meanwhile) rather than a log line. The 2 s the prefetch spends on
hashes ahead of block 0 is the node source's own ordering: issue 00076.
