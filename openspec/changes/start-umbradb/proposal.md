# Proposal — START-UMBRADB: UmbraDB as a library (`start-umbradb`)

> **Status:** In progress — approved 2026-11-01 by the owner at the stage-1 gate (the cold adversarial review and three
> targeted fix checks, the last PASS; LM-2's two PGlite exceptions approved with it); implemented on the branch
> (`tasks.md` §1–§9), in stage-4 review (§10).

## Why

`core-arch` exports `startProcess` for a host program, but it cannot be called with the package alone: it takes the
build's declarations — UmbraDB's backbone parts, its core modules and the user's modules — and the package exports
neither those parts nor the function that assembles them for the `umbradb` command (issue
`docs/issues/00053-start-process-declarations.md`). Beyond that gap, a host that embeds UmbraDB gets the command's
program-level behaviour: a SIGUSR2 listener, output on stderr, an admin port at `0.0.0.0:8081` by default, a default
configuration file in the working directory, and module handlers that exist only on UmbraDB's own listener.

This change refactors **how UmbraDB is used as a library**. One entry point, `startUmbraDB(options)`, runs the
indexer in the host's own process and does nothing to the host's program by default. Its handlers always exist and can
be mounted in the host's server; a surface listens only when asked; the private link to a private process can run over
sockets or over channels the host provides (a `MessagePort`, a TEE's own carrier). The `umbradb` command, the library
and the browser demo start through one engine and one resolver, so they cannot drift apart.

The owner's decisions behind it (D-1 … D-26) and six design review rounds are recorded in the organizer
specification `00028-umbradb-core-arch-startumbradb` (not in this repository); every rule this change relies on is
restated here.

**Delivery.** The owner decided that this change lands in the pull request that carries `core-arch` (PR #16) before
0.10.0 is final, and that the 0.10.0 release gates then run again on its head (D-9). It is one feature: the library
entry and the parts of the engine it needs.

## What changes

1. **`startUmbraDB`** (design §4): a synchronous call returning a handle (`status()`, `started`, `ended`, `closed`,
   `stop()`, `pause()`, `resume()`, `backup()`, the mounted handlers `api`, `admin`, `privateLink`), never spawning a
   process, binary or shell, never throwing for a bad configuration (every refusal goes through `started`).
2. **No program-level behaviour by default** (design §7.1, G1–G10): no `process` listener, no output unless the host
   gives `log`, no child process unless the host calls `backup()` on PostgreSQL, no port unless asked, no
   configuration file looked for, no exit status, `closed` always resolves.
3. **The network request** (design §5): `api`, `admin`, `privateLink: { publicSide, privateSide }`, each off by
   default, listening at the written address (`true`) or at `{ host, port }`, or — for the link — over channels
   (`{ channels: true }`, `{ connect }`) with UmbraDB's own framing, liveness, size and backpressure rules.
4. **One engine, one resolver** (design §3): today's `startProcess` becomes the internal engine; it owns loading the
   configuration; a pure resolver assembles the build for the engine and for `config check`, `backup` and `restore`.
5. **A standard service lifecycle** (design §5.3): admin keeps the approved probe meanings everywhere; the module API
   answers `503` with the state and reason while it cannot serve; `started` rejects with the same reason code that
   `status()` shows.
6. **User modules for the ledger worker** (design §6): `modules` objects, or `modulesFrom` (a module URL both threads
   import) for modules that declare ledger tasks, replacing the host-provided worker entry and `runLedgerWorker`.
7. **The browser demo on the engine** (design §8): channels for its private link, the engine's fetch-style handlers
   for its API and admin.
8. **Exports** (design §4): added `startUmbraDB`, `finalizedHeight`, `messagePortChannel` and their types; removed
   `startProcess`, `ProcessHandle`, `ProcessState`, `runLedgerWorker`, `BlockSource`.
9. **Configuration keys renamed** (design §9): `listen.transport` → `listen.privateLink`, `coreTransport` →
   `privateLink`; the old keys are refused with a finding that names the new one.

## Non-goals (what this change does NOT cover)

- **No change to which configurations are accepted**, other than the renamed keys. Refusing settings that cannot take
  effect (`tls` or `transportReader` with no link, a listen address on a private process, `--update-hash` on a public
  process, lockstep with no link) is issue 00055; refusing a private process with no public read before its admin
  listener opens is issue 00056.
- **No module consistency check between the main thread and the ledger worker** (issue 00057); the worker's start,
  restart and failure paths are unchanged.
- **No change to `umbradb backup` and `umbradb restore`**, beyond resolving through the shared resolver and the
  renamed keys; how a library host uses them is issue 00058. No public restore API.
- **No `umbradb/browser` package entry** (the owner's phase 2, a later change); only the in-repository demo moves to
  the engine.
- **No peer identity binding** on the private link (issue 00045); a private process's `hello` instance id is trusted.
- **No change to the command's admin default address** (issue 00046) or service-wide limits (issue 00047).
- **No ledger on the host's main thread**; no trap recovery (LG-14 unchanged).

## Impact

- **Breaking for `v0.10.0-rc.1` users of the library:** the removed exports; a host moves from `startProcess` to
  `startUmbraDB`. **Breaking for configurations:** the two renamed keys. `CHANGELOG.md` and the pull request say so.
- **The command:** unchanged except the renamed keys; one non-breaking output change (the `node:sqlite`
  `ExperimentalWarning` no longer prints).
- **Codes:** six new refusal codes, and `callback-error` and `listen-failed` become `ERROR_CODES` entries (design
  §7.2); design §11 of `core-arch` lists the new refusals.
- **Baseline:** the spec deltas modify `core-arch` requirements, which are not archived yet; `core-arch` is archived
  first, then this change (design §0).
- **Tests:** the ~42 test files that call `startProcess(` move to the engine or to `startUmbraDB`; the browser fixture
  drops the old link keys.
