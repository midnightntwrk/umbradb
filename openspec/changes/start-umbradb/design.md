# Design — START-UMBRADB: UmbraDB as a library

Section numbers of `core-arch` are cited as `core-arch design §n`. Requirement ids are this change's (`LM-*`) or
`core-arch`'s (`AE-*`, `RN-*`, `CF-*`, …); criteria are this change's `L1` … `L67` (`acceptance.md`).

## 0. Baseline

The spec deltas modify requirements of `core-arch`, which is not archived: `openspec/specs/` holds no baseline for its
capabilities. `core-arch` is archived first, then this change; each `## MODIFIED Requirements` header matches the
`core-arch` header exactly. Both land in PR #16 (owner decision D-9).

## 1. Source layout

```
src/
  library/start-umbradb.ts     startUmbraDB, the handle facade, the cwd default (the Node entry)      [new]
  library/channels.ts          PrivateLinkChannel, messagePortChannel, the channel envelope            [new]
  runner/resolve.ts            resolve and its stages; planNetwork                                    [new]
  runner/process.ts            the engine (today's startProcess; internal)                             [changed]
  private/core-transport.ts    session logic shared by sockets and channels; socket carrier split out  [changed]
  private/private-transport.ts the same, private side                                                  [changed]
  runner/api-server.ts         module API handlers usable mounted; socket carrier split out           [changed]
  cli/run.ts, cli/*.ts         the command builds its ports and calls the engine / the resolver        [changed]
```

## 2. Architecture

```
  umbradb run (src/cli)      startUmbraDB (Node)       the browser demo                 config check · backup · restore
        │                           │                           │                                   │
        └──────────────┬────────────┴──────────────┬────────────┘                                   │
                       ▼                           ▼                                                │
             ENGINE  (one lifecycle: load → resolve → plan network → refuse → open → … → stop)        │
                       │ calls                                                                      │
                       ▼                                                                            ▼
             RESOLVER (pure; shared by every caller) + NETWORK PLANNER (the engine's)  ◄─────────────┘
```

## 3. Engine, resolver, entry points

### 3.1 Engine

`src/runner/process.ts`, internal. It owns the whole lifecycle including loading (owner decision D-13): startup step
2 loads the configuration (a `{ file }` given as a URL is converted with `fileURLToPath`), imports the user modules
(§6), calls the resolver and the network planner, applies the class-A refusals (§7.2), then continues as today
(`core-arch` RN-*, IN-*). Its input:

```ts
interface EngineInput {
  config: { file: string } | { data: unknown };
  cwd: string;                         // base of every relative path, for { file } and { data } alike
  userModules: UserModulesSource;      // §6
  network: NetworkRequest;             // §5; the string "configured" only from src/cli
  ports: EnginePorts;                  // below; absent = off
  source?: InMemoryBlockSource;        // library, public side only (§4)
  acceptPublicConfigHash?: string;
  signal?: AbortSignal;
  // + today's test seams (checkChain, loop, nodeClient, …): internal, never reachable from startUmbraDB
}
```

| Port | Off when absent | Who sets it |
|---|---|---|
| `log` | silent | host; command (stderr); demo (page log) |
| `adminListener` | no admin thread, no admin port | command; library when `network.admin` listens |
| `backupSignals` | no SIGUSR2 listener | command only |
| `backupAtStop` | no backup at the configured stop height | command only |
| `workerOutput` | the worker threads' stdout and stderr are drained to `log` (or dropped) | command: `"inherit"` (the threads write to the process's stdout and stderr, as today) |
| `ledgerWorkerEntry` | the Node `worker_threads` entry | browser (a Web Worker script URL) |

**`process` access.** The engine, resolver and planner never read the global `process`, except G10's reads (§7.1). A
static check, using the TypeScript checker, fails the build on any other access under `src/` outside `src/cli/` and
`src/library/start-umbradb.ts`: an identifier `process` that resolves to the global symbol (a local binding named
`process`, as in `src/config/history.ts` and `src/runner/process.ts`, is not flagged), `globalThis.process`,
`global.process`, `globalThis["process"]`, `(globalThis as T).process` (`src/runner/process.ts:684`), and a
one-argument `path.resolve(x)` / `resolve(x)`, which reads the working directory (today at `src/db/pglite-lock.ts:104`,
`src/runner/process.ts:878`, `:955`, `:997`, `src/ledger/identity.ts:197`; each takes an explicit base or an absolute
path). `loadConfig` takes `cwd` as a required argument; its `process.cwd()` default (`src/config/load.ts:92`) is
removed.

### 3.2 Resolver and network planner

`src/runner/resolve.ts`: pure, no I/O, importable by the browser bundle.

```ts
resolveDeclarations({ userModules, side }) → DeclarationSet           // commandBuild + validateDeclarations (MD-2)
resolveConfig({ data, file, declarations, side? }) → {                // plainData (CF-1) + validateConfig (CF-2, CF-3)
  checked, side,                                                       //   + processCoreEntry (Q102)
  core,            // the process's core revision, with its raw index
  surfaces,        // the addresses written in entries[core.index].config, before schema defaults
}
resolve(input) → resolveDeclarations, then resolveConfig, plus { declarations, privateIntake, sourceKind }

planNetwork(resolved, request) → plan | refusals   // §5.2: N1–N9
```

- **Failure contract.** Each stage throws today's refusal unchanged — the `UmbraError` that `validateDeclarations`,
  `plainData`, `validateConfig` or `processCoreEntry` throws, with its findings — carrying the loaded input's secrets
  (`configSecrets`, `src/config/validate.ts:338`) so that a caller redacts the refusal as the engine's `earlyRedactor`
  does today (AE-6). `resolve` stops at the first stage that throws.
- **Callers.** The engine calls `resolve` and `planNetwork`; the plan drives what opens. `umbradb config check` calls
  the two stages itself, as today, so that it still reports a declarations refusal at `modules[<i>]` beside the
  validation findings (`src/cli/config-check.ts:274-291`); `umbradb backup` and `umbradb restore` call `resolve`. Their
  checks and behaviour are unchanged. No module outside `src/runner/resolve.ts` calls `commandBuild`,
  `buildDeclarations`, `inferSide`, `validateConfig` or `processCoreEntry`, and none outside the engine calls
  `planNetwork` (L56).
- **The private side's link** (`privateIntake`, `openPublicSide`) takes a link — an address with the configuration's
  `tls`, or a `connect` function — instead of reading `coreTransport`. The engine gives it the plan's link; the restore
  gives it the written `privateLink` address with the configuration's `tls`, from `resolve().surfaces` and `checked`,
  as today (`src/cli/restore.ts:106-139`).

Importing (a `{ file }`'s `modules` export, `modulesFrom`) is the caller's, before `resolve`. The admin parts stay in
the backbone whatever listens, so a database is interchangeable between the command and the library.

### 3.3 Entry points

- `startUmbraDB` (`src/library/start-umbradb.ts`) — §4. Reads `process.cwd()` for the `cwd` default (D-14).
- `umbradb run` (`src/cli/run.ts`) — §9. The only code that touches signals, stderr and `process.exitCode`.
- The browser demo — §8.

## 4. Public API (`umbradb`)

```ts
export function startUmbraDB(options: UmbraDBOptions): UmbraDBHandle;   // synchronous; never throws for bad options

export interface UmbraDBOptions {
  config: { file: string | URL } | { data: unknown };   // required; no configuration file is looked for
  cwd?: string;                     // default process.cwd()
  modules?: readonly ModuleDeclaration[];   // only with { data }; §6
  modulesFrom?: URL;                // only with { data }; §6
  source?: InMemoryBlockSource;     // public side only; with it no node client is created and `node` is never contacted
  signal?: AbortSignal;             // aborting it = stop(); never an unhandled rejection
  log?: (line: string) => void;     // silent when absent; also gets the worker threads' output (G2)
  acceptPublicConfigHash?: string;  // read by a private process, as the command's --update-hash (PP-14)
  network?: UmbraDBNetwork;         // §5; default: no listener, no link
}

export interface UmbraDBHandle {
  status(): UmbraDBStatus;
  readonly started: Promise<UmbraDBStarted>;   // rejects per "started's rejection"; marked handled
  readonly ended: Promise<UmbraDBEnd>;         // never rejects
  readonly closed: Promise<void>;              // always resolves (G7)
  stop(): Promise<void>;
  pause(): Promise<void>;
  resume(): void;
  backup(target: string): Promise<UmbraDBBackup>;   // a path relative to cwd; replaces the file at target; no test seams
  readonly api: { http: NodeHttpHandler; upgrade: NodeUpgradeHandler };
  readonly admin: { http: NodeHttpHandler };
  readonly privateLink: { accept(channel: PrivateLinkChannel): void };
}

export interface UmbraDBStatus {    // today's ProcessStatus, plus `listening`
  readonly state: "starting" | "refused" | "syncing" | "following" | "stopped" | "halted" | "stopping";   // AE-3
  readonly ready: boolean;                          // what /health/ready answers (AE-4)
  readonly conditions: readonly UmbraDBCondition[]; // AE-3's conditions
  readonly cursor: bigint | null;
  readonly head: bigint | null;
  readonly lag: bigint | null;
  readonly reason: UmbraDBReason | null;            // { code, height, module, point } for refused and halted; kept once stopping
  readonly ended: UmbraDBEnd | null;                // how processing ended (today's ProcessingEnd), null while it has not
  readonly listening: {                             // each address once bound; null when not listening or once closed
    readonly api: Address | null; readonly admin: Address | null; readonly privateLink: Address | null;
  };
}

export function finalizedHeight(node: string, options?: { signal?: AbortSignal; timeoutMs?: number }): Promise<bigint>;
// S for a new database (owner decision D-8); default timeoutMs 30_000; rejects node-unreachable after it, or with the
// signal's reason when aborted
export function messagePortChannel(port: MessagePortLike): PrivateLinkChannel;   // §5.4
```

- **States.** `status().state` is AE-3's state, unchanged; "serving" here means `syncing` or `following`. After
  `closed`, the state stays `stopping` (or `refused`, after a class-A refusal), as today.
- **`started`'s rejection (owner decision D-18: one code for one failure).**
  - A refusal or a startup failure rejects with an `UmbraError` whose `code` is `status().reason.code`: the code
    today's `reasonOf` gives (`src/runner/failures.ts:163-182`) — the failure's own code when it is listed
    (`REFUSAL_CODES`, `HALT_CODES`, which are `core-arch` design §11's lists, so every new refusal joins design §11,
    §7.2), else `callback-error` (a module callback failed; `details` name the module and point), `listen-failed` (a
    listener could not bind) or `database-error`. When the failure is itself an `UmbraError` with that code, `started`
    rejects with that same error; otherwise with a new `UmbraError` whose `cause` is the original thrown value.
    `callback-error` and `listen-failed` become `ERROR_CODES` entries, so `REFUSAL_CODES` gains both and `HALT_CODES`
    gains `callback-error`; no reason code is renamed, so `/status` and the command's log are unchanged.
  - A stop during startup (`stop()` or `signal`) rejects with the abort reason, as `fetch` does: the host signal's
    `reason`, or for `stop()` an `AbortError` `DOMException`. The engine substitutes it for whatever the interrupted
    step threw (today, for example, `handle-closed` from the closed node client); the state is `stopping`, `reason`
    stays null.
  - `started` is marked handled (as `src/runner/process.ts:836` does today), so a host that never attaches a handler
    gets no unhandled rejection.
- **The handle is a facade.** It forwards exactly these members; the engine's `backup(out, seams)` and every test seam
  are unreachable. `UmbraDBStarted` holds the API's bound address, the side and S — never the checked settings (they
  hold the TLS key and the database password unredacted).
- **`source`** is accepted only when `Object.getPrototypeOf(source) === InMemoryBlockSource.prototype` and the object
  has none of the engine's hook members (`checkChain`, `committedHeight`, `checkModules`, `attach`, `prepared`,
  `fetchRead`); otherwise `source-refused`. With a `source` the engine creates no node client: `node` is validated
  (the configuration format requires it) and never contacted.
- **Exports** (`core-arch` design §12, amended): added `startUmbraDB`, `finalizedHeight`, `messagePortChannel`, and the
  types `UmbraDBOptions`, `UmbraDBHandle`, `UmbraDBStatus`, `UmbraDBStarted`, `UmbraDBEnd`, `UmbraDBBackup`,
  `UmbraDBReason`, `UmbraDBCondition`, `UmbraDBNetwork`, `PrivateLinkChannel`, `MessagePortLike`, `Address`,
  `NodeHttpHandler`, `NodeUpgradeHandler`; kept `InMemoryBlockSource`, `BlockRef` and everything a module or a
  configuration needs; removed `startProcess`, `ProcessHandle`, `ProcessState`, `runLedgerWorker`, `BlockSource`.

## 5. Network

### 5.1 The option

```ts
export interface UmbraDBNetwork {
  api?:   boolean | { host?: string; port: number };   // module routes + WebSocket subscriptions
  admin?: boolean | { host?: string; port: number };   // /health/live, /health/ready, /status, /config
  privateLink?: {
    publicSide?:  boolean | { host?: string; port: number } | { channels: true };
    privateSide?: boolean | { host?: string; port: number } | { connect: (signal: AbortSignal) => Promise<PrivateLinkChannel> };
  };
}
```

| Value | `api` / `admin` | `privateLink.publicSide` | `privateLink.privateSide` |
|---|---|---|---|
| absent / `false` (default) | no listener; handlers on the handle | no link | does not connect |
| `true` | listen at the address written in the process's core revision | listen at its `listen.privateLink`, TLS from the configuration | connect to its `privateLink` address, TLS from the configuration |
| `{ host?, port }` | listen there (`host` default `127.0.0.1`; port 0 = a free port, bound address in `status().listening`) | listen there, TLS from the configuration | connect there, TLS from the configuration |
| `{ channels: true }` | — | no socket; the host calls `handle.privateLink.accept(channel)` | — |
| `{ connect }` | — | — | no socket; the host opens each channel |

A malformed request — not an object, an unknown key, `channels` other than `true`, a `port` that is not an integer
from 0 to 65535, a `host` that is not a string, a key not in the table — is refused (§7.2, `invalid-option`).

### 5.2 The network plan

`planNetwork` combines the request with `resolve().surfaces` (the addresses as written in the process's core
revision, before schema defaults) into one plan, and every link decision keys on the plan: the public side's reader
rule, the private side's intake (§3.2), the lockstep checks on both sides. The plan refuses only what the host's
request gets wrong or leaves unsafe (N2–N5); settings that cannot take effect are accepted as today (issue 00055).

- **N1.** Library default: no listener, no link.
- **N2.** One source per address (every surface of the process's side, outbound included): written in the
  configuration with the request `true`, or given as `{ host, port }` with the configuration silent. Both →
  `network-address-conflict` (`both`); `true` with nothing written → `network-address-conflict` (`no-address`).
- **N3.** An address written for a surface of the process's side that the request does not use as an address — not
  requested, or requested as `{ channels: true }` / `{ connect }` → `network-address-conflict` (`unused`).
- **N4.** Only the `privateLink` request sub-key matching the process's side → otherwise
  `private-link-misconfigured` (`wrong-side`).
- **N5.** On PostgreSQL, the public side of the link reads as `transportReader` (the read-only login), never the
  writer's, in every link mode. With a written listen address the schema's `transportReaderRule` requires it, as today;
  with the link given in the request (`publicSide: { channels: true }`, or `{ host, port }`) the plan requires it →
  `private-link-misconfigured` (`reader-missing`).
- **N6.** UmbraDB's per-request and per-message rules apply in every mode: the request body limit (413), read
  timeouts where the backend enforces them (DB-15: on PostgreSQL; PGlite API reads are not bounded, mounted or not),
  message schemas and size, the instance id rule, `/config` redaction and error texts from codes (AE-6); over a channel
  link, the link's own rules as on the socket link: PP-4's schemas, confined reads (`read-refused`),
  `duplicate-instance`, and the reader login's privilege check (`transport-reader-can-write`).
- **N7.** Connection rules belong to the socket's owner: with mounted handlers or a channel, the host owns TLS,
  authentication, Origin policy, connection and rate limits.
- **N8.** Headers (owner decision D-17): every module-API answer UmbraDB writes — on its own listener and from mounted
  handlers — carries `X-Umbra-Version`; `X-Umbra-Config-Hash` is added once the hash exists (after `on-start-db`) and
  is absent before, a missing hash being a wildcard for a client comparing hashes. Admin answers carry no `X-Umbra-*`
  header, as today. A host server's own error answers are the host's.
- **N9.** `accept(channel)` on a process whose plan is not `publicSide: { channels: true }`, or after `stop()` or a
  refusal: the channel is closed (`private-link-not-accepting`), a line is logged, nothing is thrown.

**The surfaces of a side.** A public process has `api`, `admin` and the link's listening side (`listen.privateLink`);
a private process has `api`, `admin` and the link's connecting side (`privateLink`). A `listen.privateLink` written on
a private process is no surface of it: it is ignored, in the library and the command, as today
(`src/runner/process.ts:1336` opens the core transport only on the public side); N3 and N4 do not apply to it (issue
00055 records refusing it). The outbound `privateLink` key exists in the private schema only, so on a public process it
is already an unknown key.

**Where each rule can fire.** N2–N5's refusals judge the host's request, so they arise in `startUmbraDB` and the demo
only: the command's `"configured"` request is derived from the file — a surface of the side is requested if and only
if its address is written, plus the admin default `0.0.0.0:8081` when none is written (issue 00046) — and so it never
produces them.

**`/config`.** The process revision's `listen` and `privateLink` show the plan's addresses, as bound (a requested port
0 shows the bound port), and are absent where nothing listens or connects at an address. A field `network` names each
surface's mode: `{ api, admin, privateLink }`, each `"listening"`, `"connecting"`, `"mounted"` (handlers only),
`"channels"`, `"connect"` or `"none"`. The command's `/config` keeps its `listen` values (its plan is the written
addresses plus the admin default) and gains the `network` field.

### 5.3 Standard service lifecycle (owner decisions D-18, D-19, D-23)

The states are AE-3's. **Admin follows the approved rules, the same for mounted and listening admin, in the library
and the command (D-23).** Only the module API and the link depend on the lifecycle:

| State | `/health/live` | `/health/ready` | `/status`, `/config` | Module API (HTTP and subscriptions) | Private link |
|---|---|---|---|---|---|
| `starting` | liveness (below) | 503 | 200; `/status`: `instance.role` null until the side is known; `/config`: every field but `build` null until the configuration is validated (`UNVALIDATED_CONFIG`, `src/admin/configuration.ts:46-58`) | 503 lifecycle body | channels queued (§5.4) |
| `syncing`, `following` | liveness | AE-4: with a readiness lag set, 200 while the lag is known and at or below it, else 503; 200 without one | 200 | answers (modules' answers unchanged, RN-16) | open |
| `stopped`, `halted` (processing ended on its own: the core's stop, an upgrade boundary, a halt) | liveness | AE-4: `stopped` 200, `halted` 503 | 200, with the reason when halted | **answers reads at the cursor until `stop()`** (D-19) | as today |
| `refused` | liveness | 503 | 200, with the reason | 503 lifecycle body (a listener is never open: class A opens none, class B closes it) | closed; queued channels closed `private-link-not-accepting` |
| `stopping` (after `stop()` or `signal`, and after `closed`) | liveness | 503 | 200, `stopping` | answers until the loop has ended (today's drain, RN-13); then a listener closes, and mounted handlers answer the 503 lifecycle body and close their subscriptions | closed |

- **Liveness.** Listening admin runs in its own thread and answers by the heartbeat (AE-2): `{ live, heartbeatAgeMs,
  livenessTimeoutMs }` (`src/backbone/core-health/endpoints.ts:25-30`), 200 while the last tick is within the liveness
  timeout, in every state. Mounted admin is answered on the host's thread: it answers 200 with `live: true`, the
  main-thread heartbeat's age at the answer as `heartbeatAgeMs` (informational: it may exceed the timeout after a block
  that has ended, without turning the answer 503), `livenessTimeoutMs`, and `"thread": "host"`. It cannot see a blocked
  thread; a host that needs that probe asks UmbraDB to listen for admin.
- **Mounted admin** builds the same snapshot as listening admin, from the engine's state in memory, on request; it
  reads no database per request (AE-1). Whenever admin exists — mounted or listening — the engine keeps today's
  publication and fact reads (`src/admin/process-admin.ts`): the main-thread heartbeat ticks every second and
  publishes; `opened()` and `committed()` mark the facts stale; a publication reads them when they are stale and no
  read runs, one read at a time; a read's completion publishes again, so a commit that landed during a read starts the
  next read at once. The database reads are `core_digest.tables`, the server version and the identity anchor; the
  parts and their revisions come from `opened()`'s facts in memory (`moduleFacts`). With only mounted admin, the
  heartbeat's timer is `unref()`ed and a publication updates the in-memory snapshot instead of posting it to a listener
  thread (today `publish()` returns early without a listener). Mounted admin keeps answering after `closed`, from the
  last snapshot.
- **Listening admin** (library and command) opens after the configuration and the network plan are validated, keeps
  answering through a class-B refusal, a halt and the `stopping` drain, and closes last, at `closed` (as today).
- **The lifecycle body** is the module API's error envelope with the state and reason added:
  `{ "error": { "code": "not-serving", "message": "…" }, "state": "<state>", "reason": { code, height, module, point } | null }`,
  the message produced from codes only (AE-6). Only the lifecycle writes it — never in place of a module's own answer,
  and never for the module API's own `503 no-committed-height` (RN-16).
- **The command** is unchanged: a refusal of the configuration logs its findings and exits 1 before any admin listener
  opens (AE-3); after a later refusal its admin listener stays up — `/health/live` 200, `/health/ready` 503, `/status`
  `refused` with the reason — until it is signalled, then exits 1; during the SIGTERM drain `/status` answers 200
  `stopping`.

### 5.4 Channels

```ts
export interface PrivateLinkChannel {
  send(message: string): void;                                  // host: in order, no loss, no duplication, until the channel ends
  onMessage(listener: (message: string) => void): () => void;  // returns a disposer
  onClose(listener: () => void): () => void;                    // the carrier ended
  close(): void;                                                // graceful end
  terminate?(): void;                                           // forced end; default close()
  bufferedAmount?(): number;                                    // optional: bytes queued, not yet delivered
}
```

- **Host obligations:** in-order delivery of whole messages without loss or duplication until the channel ends;
  messages sent before `onMessage` is registered are buffered by the carrier (UmbraDB registers synchronously in
  `accept()` and right after `connect()` resolves); a carrier without `bufferedAmount` bounds its own queue.
- **Framing (channel links only, not TCP):** UmbraDB wraps the link's messages (PP-4) in an envelope that also carries
  `ping`, `pong` and `close { code, reason }`, so the close codes the protocol depends on — 1008
  `report-hash-mismatch` (halt), 1011 `report-unchecked` (reconnect), 1008 `too-slow` — survive any carrier, including
  a browser `MessagePort`, which may have no close event (a Node `worker_threads` port has one).
- **UmbraDB's own `close()`/`terminate()` ends the channel** — the instance id is released, listeners are disposed —
  whatever the carrier's `onClose` does.
- **Liveness:** each side sends its first ping one `PING_INTERVAL_MS` (15 s) after the channel opens, then every
  interval; a channel whose ping is still unanswered at the next interval is terminated `no-pong`. A dead peer is
  detected within at most two intervals (30 s), as on TCP today (`src/private/core-transport.ts:469-497`).
- **Size:** each incoming message is checked against the link's `MAX_MESSAGE_BYTES` (64 MiB) in UTF-8 bytes → close
  1009 `too-large`.
- **Backpressure:** with `bufferedAmount`, more than the link's `MAX_BUFFERED_BYTES` waiting → close 1008 `too-slow`.
- **Before the link is ready** (it starts after migrations and the configuration-hash read, as today): `accept()`ed
  channels wait in a queue of at most 64; beyond 64 → close 1013 `try-again`. A queued channel's application messages
  are validated on arrival, as on TCP: a first message other than `hello` closes it 1008 `hello-first`
  (`src/private/core-transport.ts:441-443`), an invalid `hello` closes it as TCP does, a `hello` over
  `MAX_HELLO_BYTES` (64 KiB, UTF-8 bytes) closes it 1009 `too-large`, and any second application message closes it
  1008 `hello-pending`; the valid `hello` is held until the link starts. The envelope's control messages (`ping`,
  `pong`, `close`) are handled apart and never count toward that limit. Queued channels are pinged and answer pings on
  the same schedule as open ones, so a healthy queued peer stays queued through any number of intervals and a dead one
  is terminated `no-pong` within two intervals, freeing its slot. At a refusal or `stop()` every queued channel is
  closed `private-link-not-accepting`.
- **`connect(signal)`** is called on every (re)connection and returns a new channel each time; a rejection counts as a
  lost connection with the existing back-off. `stop()` aborts the signal and does not wait for `connect()`; a channel
  it resolves later is closed at once; a later rejection is consumed; no retry starts after `stop()`.
- **`messagePortChannel(port)`** adapts a browser `MessagePort` or a `worker_threads` `MessagePort`.

## 6. User modules and the ledger worker

| `config` | User modules come from | Refused |
|---|---|---|
| `{ file }` | the file's `modules` export, imported by the engine and by the worker | `modules`, `modulesFrom` (`modules-given-twice`) |
| `{ data }`, no module with ledger tasks | `modules` objects, or `modulesFrom` | both (`modules-given-twice`) |
| `{ data }`, a module with ledger tasks | `modulesFrom` only (imported on both threads) | `modules` objects declaring ledger tasks (`ledger-tasks-need-modules-from`) |

- **`modulesFrom`** names an ES module whose `modules` export lists the user modules, as a configuration file's does.
  It replaces the host-provided worker entry and `runLedgerWorker` (`core-arch` design §5.5): the worker imports the
  same URL as the main thread, as it imports the configuration file today (`src/ledger/worker/entry.ts:20-27`). A
  failure to import it refuses with `invalid-configuration`, reason `load-failed`, naming the URL; a `modules` export
  that is missing or not an array, reason `modules-not-a-list` (`src/config/load.ts:25-31`).
- A `{ file }` is evaluated once per host process on the main thread (ESM cache); module files must not change while
  UmbraDB runs, and a module must export the same declarations in every thread (not, for example, by `isMainThread`). A check that both threads loaded the same modules is issue 00057; the worker's start, restart and
  failure paths are unchanged.
- **The browser demo:** its ledger worker has no user-module source yet; a ledger-task user module is refused there
  (`ledger-tasks-need-modules-from`), filed as an issue in `docs/issues/` when the demo change lands.

## 7. Guarantees and refusals

### 7.1 Library-mode guarantees

| # | Guarantee | Change at the base commit |
|---|---|---|
| G1 | No listener is added to `process` | the SIGUSR2 default (`?? nodeSignals()`, `src/runner/process.ts:904`) becomes the command's port |
| G2 | Nothing on stdout/stderr unless the host gives `log` | the default log `process.stderr` is removed; the ledger and admin workers start with `stdout: true, stderr: true` (`src/ledger/worker/host.ts:299`, `src/admin/server.ts:86`), drained to `log` or dropped (the command's `workerOutput` port keeps them inherited); the `node:sqlite` `ExperimentalWarning` is dropped (owner decision D-15) through **one shared import**: the first PGlite directory to need `node:sqlite` starts one `import("node:sqlite")` (`src/db/pglite-lock.ts:184-187`) that every later or overlapping acquisition awaits; `process.emitWarning` is wrapped once for that import's lifetime, dropping only that warning, and restored when it settles, unless the host replaced it meanwhile (kept). **Known limit:** PGlite itself calls `console.error` on some internal failure paths (`node_modules/@electric-sql/pglite/dist/index.js`); a run on Node.js 24.9.0 (2026-11-01) saw none on a start, a failed query or a close; those failure paths are **unconfirmed** and documented, not routed; LM-2 states the exception |
| G3 | No child process unless the host calls `backup()` on PostgreSQL (`pg_dump --version`, `pg_dump`) | `backupAtStop`, `backupOnSignal` refused in library mode (class A) |
| G4 | No port unless the request asks (§5) | the admin default listener and the `listen.*` handling move to the plan |
| G5 | No configuration file is looked for or read except `config.file` | the `umbradb.config.ts` default lookup is the command's only |
| G6 | UmbraDB never ends the host process or sets its exit status: no `process.exit`, no `process.exitCode`, no unhandled rejection | `signal` abort → `stop()` with a `catch`. PGlite 0.5.10's runtime contains an assignment to `process.exitCode`; a run on Node.js 24.9.0 (2026-11-01) showed it **not reached** on a start, a failed query or a close, in memory and on a directory. Its fatal paths (a WASM abort) are **unconfirmed**: planning prevents the assignment where it can, otherwise documents it for those paths (owner decision D-22); LM-2 states the exception |
| G7 | `closed` always resolves; every close step runs even if one fails; failures go to `log` | one close helper (each step isolated) for `#close`, startup's refusal cleanup and `#endItself`; the original failure is kept |
| G8 | Relative paths resolve against `cwd` only | the PGlite path, the backup target, the file lookup — all through `EngineInput.cwd` |
| G9 | Threads: the ledger worker only when the build needs the ledger; the admin thread only when admin listens | — |
| G10 | `process` is read only here: `cwd()` (the Node entry); `hrtime` (heartbeat, admin); `pid` and `env` (inside `backup()`); `emitWarning` (the SQLite import's wrapper) | the static check (§3.1) |

**Documented behaviour.** `backup(target)` replaces the file at `target`. The automatic backups — at the configured
stop height and on SIGUSR2 — keep their rules (keep a backup of the same height; refuse a file that is not a backup);
they are the command's. The host's nearest equivalent of a backup at stop: `const end = await h.ended; if (end.kind ===
"stopped" && end.core) await h.backup(out)` — not exact: `backup(out)` replaces any file at `out`.

**Known limit.** A PGlite directory's lock is an operating-system lock held until the host process exits: within the
host a new handle can reopen the directory once the first has closed; another OS process cannot until the host exits.

### 7.2 Refusal classes

The engine classes a refusal by its startup step, not by whether the core revision is known.

| Class | When | `started` | Process | `closed` | Command |
|---|---|---|---|---|---|
| **A — configuration** | startup step 2: load, resolve, the library's option and network-plan checks; before the database opens, the worker starts or any port opens | rejects | `refused`, ends itself; mounted admin answers per §5.3 | resolves | logs the findings, exit 1, no admin listener (as today) |
| **B — startup** | any startup failure after class A's point and before the loop runs: admin `listen-failed`, history and chain checks, `on-start-db` failures (`callback-error`), link `listen-failed`, `transport-reader-can-write`, module API `listen-failed` | rejects | `refused`; admin (mounted or listening) keeps answering per §5.3 | after `stop()` | admin stays up (AE-3); exit 1 when signalled (as today) |
| **C — runtime halt** | while processing (a callback failure, a check) | already resolved | `halted` at the height; reads keep answering (D-19) | after `stop()` | as today |
| **D — connection** | per connection or channel, any time | unaffected | unaffected | — | — |

| Situation | Code | Class |
|---|---|---|
| A malformed option (§4, §5.1): `config` with neither `file` nor `data`, `modules` not an array, `modulesFrom` not a `URL`, a malformed `network` | `invalid-configuration`, reason `invalid-option`, naming the option's path | A |
| `modulesFrom` fails to import; its `modules` export missing or not an array | `invalid-configuration`, reason `load-failed` / `modules-not-a-list`, naming the URL | A |
| `backupAtStop` or `backupOnSignal` in the process's core revision (library) | `library-setting-refused` (`setting`) | A |
| N2, N3 | `network-address-conflict` (`both`, `no-address`, `unused`) | A |
| N4, N5 | `private-link-misconfigured` (`wrong-side`, `reader-missing`) | A |
| `source` not exactly an `InMemoryBlockSource`, or on a private process | `source-refused` | A |
| `modules` with `{ file }`; `modules` and `modulesFrom`; `modulesFrom` with `{ file }` | `modules-given-twice` | A |
| `modules` declaring ledger tasks without `modulesFrom`; a ledger-task module in the demo | `ledger-tasks-need-modules-from` | A |
| A renamed key (`listen.transport`, `coreTransport`) | `invalid-configuration`, finding `renamed-setting` naming the new key | A |
| A module callback failed during startup (`on-start-db`, `on-start-api`) | `callback-error` (module, point; `cause`) — today's reason code, now an `ERROR_CODES` entry | B |
| A listener could not bind (admin, link, module API) | `listen-failed` (`cause`) — today's reason code, now an `ERROR_CODES` entry | B |
| Any other startup failure without a listed code | `database-error` (`cause`) — today's general reason | B |
| Channel: `no-pong`, `too-slow`, `too-large`, `hello-first`, `hello-pending`, `private-link-not-accepting`, `try-again` | close reason | D |

The six new refusal codes — `network-address-conflict`, `private-link-misconfigured`, `source-refused`,
`modules-given-twice`, `ledger-tasks-need-modules-from`, `library-setting-refused` — are `ERROR_CODES` entries and join
`core-arch` design §11's **Startup refuses**, so `REFUSAL_CODES` lists them and `reasonOf` keeps them; each gets its A87
registry entry and triggering test, with a negative control. `test/runner/code-registry.test.ts` reads every backticked
kebab-case word of that paragraph as a code, so its other wording is edited with that in mind; the paragraph's
"before its core revision is known" becomes "a class-A refusal (`start-umbradb` design §7.2)". No existing reason code
is renamed; `duplicate-instance` is unchanged.

## 8. The browser demo on the engine (owner decision D-21)

- The demo's process worker calls the engine through the browser build's entry with `config: { data }` (from its
  configuration module), `cwd: "/"`, and the browser ports (page log, Web Worker ledger entry).
- Network: the public worker passes `privateLink: { publicSide: { channels: true } }`; each private-instance worker
  passes `privateSide: { connect }`, whose `connect` asks the page for a new `MessageChannel` on each (re)connection
  and hands the public worker the other end (`messagePortChannel`). The page's simulated network and its
  `node:http`/`ws` shims for the link are removed.
- API and admin: not listening; the demo's message channel calls the handle's fetch-style handlers (`api.fetch`,
  `admin.fetch`) and opens subscriptions through `api.connect(channel)` (a `PrivateLinkChannel`-shaped carrier for the
  module API's subscription protocol); these three are built for the demo and not exported. An `api.connect` channel
  keeps the module API's own subscription rules, not §5.4's link rules: its message limit (`DEFAULT_MAX_MESSAGE_BYTES`,
  64 KiB) and its slow-subscriber close (the module API's own `MAX_BUFFERED_BYTES`, 1 MiB, through `bufferedAmount`
  when the carrier gives it; `src/runner/api-server.ts:77-79`), with no ping/pong envelope (the page owns the carrier's
  lifetime).
- **The socket carriers stay out of the bundle.** The link's and the module API's TCP/WebSocket carriers (today inside
  `src/private/core-transport.ts`, `src/private/private-transport.ts`, `src/runner/api-server.ts`) move into their own
  modules, apart from the session logic that channels also use; the browser build lists those carrier modules in
  `UNAVAILABLE` (`browser/build.ts:122`), so they are bundled only as its stubs and the removed shims are not needed.
  The build's substitute `src/runner/api-server.ts` → `browser/src/runner/api.ts` (`browser/build.ts:112`) is removed.
- The test fixture's configuration (`test/browser/fixtures/configuration.ts`) drops `listen.api`, `listen.transport`
  and `coreTransport` (`browser/src/config.ts` writes none of them); its `api=1` parameter is removed (handlers always
  exist), and `private=1` selects the channel link.
- The demo's restore is unchanged (§3.2).

## 9. The command after the change

`umbradb run` builds its ports and calls the engine: network request `"configured"` (§5.2); the stderr log; SIGTERM
and SIGINT → an `AbortSignal`; the SIGUSR2 relay; `backupAtStop`; `workerOutput: "inherit"`; `--update-hash` →
`acceptPublicConfigHash`; the configuration file (`--config` or `umbradb.config.ts`) and its `modules` export;
`process.exitCode` from how processing ended. `run.ts` keeps an internal seam on the engine call so the command's tests
keep their assertions. `config check`, `backup` and `restore` resolve through the resolver (§3.2) with unchanged checks.

**The one breaking change (owner decision D-6), with a CHANGELOG note:** `listen.transport` and `coreTransport` are
renamed `listen.privateLink` and `privateLink`; the old keys are refused (`invalid-configuration`, finding
`renamed-setting` naming the new key) by every command and by `startUmbraDB`. The rename also reaches
`transportReaderRule`'s key and message (`src/config/core-settings.ts:236-255`) and `openPublicSide`'s message
(`src/backbone/core-private-source/public-database.ts:224-227`).

**One non-breaking output change, with a CHANGELOG line:** the `node:sqlite` `ExperimentalWarning` no longer prints.

**Not changed:** which configurations are accepted (issues 00055, 00056 record candidates), the admin endpoints'
answers, the reason codes in `/status` and the log, the worker threads' output, the SIGTERM drain, the admin listener
kept up after a later refusal, the ledger worker's start and restart, and backup and restore.
