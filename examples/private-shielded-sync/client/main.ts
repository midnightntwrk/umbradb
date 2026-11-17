/**
 * The private shielded sync client (spec §6, §7): `sync`, `balance`, `send`, `address`, `cross-check`, and `dust`
 * (spec 00062, `./dust.ts`).
 *
 *   npm ci --ignore-scripts --prefix examples/private-shielded-sync/client      # once: the Midnight packages
 *   node --env-file=<secrets.env> examples/private-shielded-sync/client/main.ts sync --wallet A
 *
 * Secrets come only from the environment (`node --env-file=<file outside the repository>`): the wallet's mnemonic
 * (`PSS_MNEMONIC_<WALLET>`, or the variable `--mnemonic-env` names), the indexer key (`PSS_BLOCKFROST_PROJECT_ID`,
 * `send` only). None is printed, logged or sent to the server; the indexer key goes only to the indexer, as its header.
 * A generated test wallet can instead be given as a file holding its 32-byte Zswap seed in hex (`--zswap-seed-file`).
 *
 * Run `main.ts help` for every option.
 */

import { availableParallelism, homedir } from "node:os";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { parseArgs } from "node:util";
import { compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import type { IpirWorkers } from "../ipir/engine.ts";
import { nodeIpirPool } from "../ipir/pool-node.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { inlineMultiplier, type Multiplier, WorkerMultiplier } from "../pir/index.ts";
import { ROUTES, toHex } from "../shared/index.ts";
import { formatShieldedAddress, parseShieldedAddress } from "./address.ts";
import { BlobCache } from "./cache.ts";
import { compareWithClient, readZswapEvents, replayZswapEvents } from "./cross-check.ts";
import { DustChecker } from "./dust-check.ts";
import { dustSync } from "./dust.ts";
import { HttpError, PssHttp } from "./http.ts";
import { keysFromZswapSeed, type WalletKeys } from "./keys.ts";
import { type Ledger, loadLedger, loadLedgerV8 } from "./ledger.ts";
import { watchRss } from "./memory.ts";
import { finalizedHead, zswapRootAt } from "./node-rpc.ts";
import { loadSdk, type SdkSeeds } from "./sdk-api.ts";
import { chooseCoin, coinPath, planTransfer } from "./send.ts";
import { formatBalance, readState, unspentCoins, type WalletState, writeState } from "./state.ts";
import { lowerPathsByPir, pathInTable, sync, type SyncResult } from "./sync.ts";

const HELP = `usage: node [--env-file=<secrets.env>] examples/private-shielded-sync/client/main.ts <command> [options]

commands:
  sync          sync the wallet with the server; write its local state; print the balance
  balance       print the balance and unspent coins of the local state (no network)
  send          spend one coin: --to <shielded address> --token <hex> --amount <base units> [--position <i>]
                [--dry-run: stop before the fee wallet] [--no-submit: balance, prove and validate, do not submit]
  address       print the wallet's shielded address for --network
  cross-check   replay the database's stored Zswap events up to the local state's tail height with the ledger's own
                ZswapLocalState and compare with the local state (FR-140)
  dust          download the Dust file, this wallet's first coins and the Dust parameters; walk each of the wallet's
                Dust chains through the file; check each chain's last coin by PIR in the Dust check table (dropping a
                false match); print each chain's spends, check and current coin (spec 00062; needs the mnemonic,
                whose Dust seed gives the Dust key) [--no-check: walk only]

wallet (one of):
  --wallet <name>            mnemonic from the environment variable PSS_MNEMONIC_<NAME>
  --mnemonic-env <VAR>       mnemonic from the environment variable VAR
  --zswap-seed-file <path>   a generated wallet: its 32-byte Zswap seed as hex (sync, balance, address, cross-check)

options:
  --server <url>             module API (default http://127.0.0.1:10480)
  --data <dir>               state and cache (default ~/.pss-client): <dir>/wallets/<label>/state.json, <dir>/cache/
  --label <name>             the state's folder (default: the wallet name, or "seed-" and the seed file's name)
  --network <name>           the network the server must serve (default PSS_NETWORK when set)
  --threads <n>              scan and PIR threads (default: CPUs − 1, at most 8); with 1, IPIR+SP's requests
                             are made one after the other
  --stats <file>             sync: write the step statistics as JSON
  --json                     print JSON instead of text
  --node-http <url>          send: the node's JSON-RPC (default PSS_NODE_HTTP)
  --node-ws <url>            send: the node's WebSocket (default PSS_NODE_WS)
  --proof-server <url>       send: the local proof server (default PSS_PROOF_SERVER or http://127.0.0.1:49343)
  --max-lag <blocks>         send: refuse a tail more than this many blocks behind the node's finalized head (300)
  --db-url <url>             cross-check: postgres://user@host:port/database (password from --db-password-file)
  --db-password-file <path>  cross-check: the database password
  --out <file>               cross-check, send: write the report or the transfer record as JSON
`;

const { values: opt, positionals } = parseArgs({
  allowPositionals: true,
  options: {
    wallet: { type: "string" },
    "mnemonic-env": { type: "string" },
    "zswap-seed-file": { type: "string" },
    server: { type: "string", default: "http://127.0.0.1:10480" },
    data: { type: "string", default: join(homedir(), ".pss-client") },
    label: { type: "string" },
    network: { type: "string" },
    threads: { type: "string" },
    stats: { type: "string" },
    json: { type: "boolean", default: false },
    to: { type: "string" },
    token: { type: "string" },
    amount: { type: "string" },
    position: { type: "string" },
    "dry-run": { type: "boolean", default: false },
    "no-submit": { type: "boolean", default: false },
    "no-check": { type: "boolean", default: false },
    "node-http": { type: "string" },
    "node-ws": { type: "string" },
    "proof-server": { type: "string" },
    "max-lag": { type: "string", default: "300" },
    "db-url": { type: "string" },
    "db-password-file": { type: "string" },
    out: { type: "string" },
    help: { type: "boolean", default: false },
  },
});

const command = positionals[0] ?? "help";
const log = (line: string): void => void process.stderr.write(`${new Date().toISOString()} ${line}\n`);
const json = (v: unknown): string => JSON.stringify(v, (_k, x) => (typeof x === "bigint" ? x.toString() : x), 2);

function env(name: string): string {
  const value = process.env[name]?.trim();
  if (!value) throw new Error(`the environment variable ${name} is not set (run with node --env-file=<secrets.env>)`);
  return value;
}

/** Blockfrost serves subscriptions at `<path>/ws`; an upgrade at the bare path is closed with 1011 (decision Q11). */
function graphqlWsUrl(url: string): string {
  const trimmed = url.replace(/\/$/, "");
  return trimmed.endsWith("/ws") ? trimmed : `${trimmed}/ws`;
}

function threads(): number {
  const n = opt.threads === undefined ? Math.min(8, Math.max(1, availableParallelism() - 1)) : Number(opt.threads);
  if (!Number.isInteger(n) || n < 1) throw new Error(`--threads must be a whole number ≥ 1`);
  return n;
}

function label(): string {
  if (opt.label) return opt.label;
  if (opt.wallet) return opt.wallet;
  if (opt["mnemonic-env"]) return opt["mnemonic-env"].toLowerCase();
  if (opt["zswap-seed-file"]) return `seed-${opt["zswap-seed-file"].split("/").pop()}`;
  throw new Error("name the wallet: --wallet, --mnemonic-env or --zswap-seed-file");
}

const statePath = (): string => join(resolve(opt.data), "wallets", label(), "state.json");

/** The wallet's seeds. The Dust and Night seeds exist only for a mnemonic (needed by `send`). */
async function seeds(): Promise<{ zswap: Uint8Array; all: SdkSeeds | null }> {
  if (opt["zswap-seed-file"]) {
    const seed = Buffer.from(readFileSync(opt["zswap-seed-file"], "utf8").trim(), "hex");
    if (seed.length !== 32) throw new Error("a Zswap seed file holds 32 bytes as hex");
    return { zswap: new Uint8Array(seed), all: null };
  }
  const variable = opt["mnemonic-env"] ?? (opt.wallet ? `PSS_MNEMONIC_${opt.wallet.toUpperCase()}` : undefined);
  if (variable === undefined) throw new Error("name the wallet: --wallet, --mnemonic-env or --zswap-seed-file");
  const all = (await loadSdk()).seedsFromMnemonic(env(variable));
  return { zswap: all.shielded, all };
}

interface Tools {
  ledger: Ledger;
  kernel: Kernel;
  keys: WalletKeys;
  scanPool: ScanPool;
  multiplier: Multiplier;
  /** IPIR+SP: the wallet's WebAssembly, read and digest-checked only when a snapshot uses IPIR+SP (00058 FR-031). */
  ipirWasm(): WebAssembly.Module;
  /** IPIR+SP: worker threads for a call's requests, started only when a snapshot uses IPIR+SP; none with one thread. */
  ipirWorkers: IpirWorkers | undefined;
  close(): Promise<void>;
}

async function tools(zswapSeed: Uint8Array): Promise<Tools> {
  const ledger = await loadLedger();
  const module = compileKernel();
  const kernel = new Kernel(module);
  const keys = keysFromZswapSeed(ledger, zswapSeed, kernel);
  const n = threads();
  const scanPool = new ScanPool({ threads: n, module });
  const multiplier: Multiplier = n > 1 ? new WorkerMultiplier(n) : inlineMultiplier;
  const ipirWorkers = n > 1 ? nodeIpirPool(n) : undefined;
  return {
    ledger,
    kernel,
    keys,
    scanPool,
    multiplier,
    ipirWasm: () => compileIpirWasm(),
    ipirWorkers,
    async close() {
      await scanPool.close();
      await multiplier.close();
      await ipirWorkers?.close();
    },
  };
}

async function runSync(t: Tools, previous: WalletState | null): Promise<SyncResult> {
  const network = opt.network ?? process.env.PSS_NETWORK?.trim();
  return sync({
    ledger: t.ledger,
    keys: t.keys,
    http: new PssHttp(opt.server),
    cache: new BlobCache(join(resolve(opt.data), "cache")),
    kernel: t.kernel,
    scanPool: t.scanPool,
    multiplier: t.multiplier,
    ipirWasm: t.ipirWasm,
    ...(t.ipirWorkers === undefined ? {} : { ipirWorkers: t.ipirWorkers }),
    ...(network ? { network } : {}),
    previous,
    log,
  });
}

async function cmdSync(): Promise<void> {
  const memory = watchRss();
  const s = await seeds();
  const t = await tools(s.zswap);
  try {
    const path = statePath();
    const result = await runSync(t, readState(path));
    const stateBytes = writeState(path, result.state);
    log(`state written to ${path} (${stateBytes} bytes)`);
    if (opt.stats) {
      writeFileSync(opt.stats, json({ ...result.stats, stateBytes, peakRssBytes: memory.stop(), threads: t.scanPool.threads, server: opt.server, manifest: { height: result.manifest.height, firstFree: result.manifest.firstFree, pathSplit: result.manifest.pathSplit } }));
    }
    process.stdout.write(`${opt.json ? json(result.state) : formatBalance(result.state)}\n`);
  } finally {
    await t.close();
  }
}

function cmdBalance(): void {
  const state = readState(statePath());
  if (state === null) throw new Error(`no local state at ${statePath()}: run sync first`);
  process.stdout.write(`${opt.json ? json({ balances: Object.fromEntries([...unspentCoins(state).reduce((m, c) => m.set(c.tokenType, (m.get(c.tokenType) ?? 0n) + BigInt(c.value)), new Map<string, bigint>())]), unspent: unspentCoins(state), state }) : formatBalance(state)}\n`);
}

async function cmdAddress(): Promise<void> {
  const s = await seeds();
  const ledger = await loadLedger();
  const keys = keysFromZswapSeed(ledger, s.zswap, new Kernel(compileKernel()));
  const network = opt.network ?? env("PSS_NETWORK");
  process.stdout.write(`${formatShieldedAddress({ coinPublicKey: toHex(keys.coinPublicKey), encryptionPublicKey: toHex(keys.encryptionPublicKey) }, network)}\n`);
}

async function cmdSend(): Promise<void> {
  if (!opt.to || !opt.token || !opt.amount) throw new Error("send needs --to <shielded address> --token <hex> --amount <base units>");
  const network = opt.network ?? env("PSS_NETWORK");
  const recipient = parseShieldedAddress(opt.to, network);
  const token = opt.token.toLowerCase();
  if (!/^[0-9a-f]{64}$/.test(token)) throw new Error("--token is a 32-byte token type in hex");
  const amount = BigInt(opt.amount);
  const position = opt.position === undefined ? undefined : Number(opt.position);
  const nodeHttp = opt["node-http"] ?? env("PSS_NODE_HTTP");
  const nodeWs = opt["node-ws"] ?? env("PSS_NODE_WS");
  const maxLag = Number(opt["max-lag"]);
  // The transfer row of the benchmark (spec §8) reads the client's peak memory from the record.
  const memory = watchRss();
  const s = await seeds();
  if (s.all === null && !opt["dry-run"]) throw new Error("send needs the wallet's mnemonic for its Dust fee wallet (or --dry-run)");
  const record: Record<string, unknown> = { startedAt: new Date().toISOString(), wallet: label(), network, token, amount: amount.toString(), recipient: opt.to, timings: {} };
  const timings = record.timings as Record<string, number>;
  const t = await tools(s.zswap);
  const sdk = opt["dry-run"] ? null : await loadSdk();
  let feeWallet: Awaited<ReturnType<NonNullable<typeof sdk>["openFeeWallet"]>> | null = null;
  try {
    // The fee wallet's sync is the long step (minutes); the path is built after it so its root is fresh.
    if (sdk !== null) {
      const proofServer = opt["proof-server"] ?? process.env.PSS_PROOF_SERVER?.trim() ?? "http://127.0.0.1:49343";
      // FR-126: the spend's proof input holds the coin secret key, so the prover must run on this machine.
      if (!["127.0.0.1", "localhost", "[::1]"].includes(new URL(proofServer).hostname)) {
        throw new Error(`the proof server must be local (loopback), not ${new URL(proofServer).hostname}`);
      }
      const started = performance.now();
      feeWallet = await sdk.openFeeWallet(
        s.all!,
        {
          network,
          nodeWs,
          proofServer,
          indexerHttp: env("PSS_INDEXER_HTTP"),
          indexerWs: graphqlWsUrl(env("PSS_INDEXER_WS")),
          projectId: env("PSS_BLOCKFROST_PROJECT_ID"),
          dustTimelineCache: join(resolve(opt.data), "cache", "dust-timeline.json"),
        },
        { log },
      );
      timings.feeWalletSyncMs = performance.now() - started;
      log(`fee wallet synced in ${Math.round(timings.feeWalletSyncMs)} ms`);
    }
    // Sync, path and root (FR-121): the root must be the tail's and the node's, and recent; three attempts.
    let plan: ReturnType<typeof planTransfer> | null = null;
    let lastError: unknown;
    for (let attempt = 1; attempt <= 3 && plan === null; attempt++) {
      try {
        let started = performance.now();
        const result = await runSync(t, readState(statePath()));
        timings.syncMs = performance.now() - started;
        writeState(statePath(), result.state);
        let coin;
        try {
          coin = chooseCoin(unspentCoins(result.state), token, amount, position);
        } catch (error) {
          // Another attempt would read the same coins: only a path or root problem is worth a refresh.
          attempt = 3;
          throw error;
        }
        // The lower path is read by PIR only now, to spend (Q58), unless the tail gives it.
        if (coin.lowerPath === null && pathInTable(result.manifest, coin)) {
          const read = await lowerPathsByPir({ http: new PssHttp(opt.server), cache: new BlobCache(join(resolve(opt.data), "cache")), kernel: t.kernel, multiplier: t.multiplier, ipirWasm: t.ipirWasm, ...(t.ipirWorkers === undefined ? {} : { ipirWorkers: t.ipirWorkers }) }, result, [coin]);
          coin = { ...coin, lowerPath: read.paths.get(coin.position)! };
          timings.pathReadMs = read.stats.ms;
          record.pathRead = { public: read.stats.public, buildMs: read.stats.buildMs, roundTripMs: read.stats.roundTripMs, decodeMs: read.stats.decodeMs, bytesUp: read.stats.bytesUp, bytesDown: read.stats.bytesDown };
        }
        started = performance.now();
        const path = coinPath(result.view, coin, t.kernel);
        timings.pathMs = performance.now() - started;
        const head = await finalizedHead(nodeHttp);
        const lag = head.height - result.state.tail.height;
        if (lag > maxLag) throw new Error(`the server's tail (height ${result.state.tail.height}) is ${lag} blocks behind the node's finalized head ${head.height}: its root may be too old to spend against`);
        const nodeRoot = await zswapRootAt(nodeHttp, `0x${result.state.tail.blockHash}`);
        if (toHex(nodeRoot) !== result.state.tail.root) throw new Error(`the node's Zswap root after block ${result.state.tail.height} differs from the tail's`);
        plan = planTransfer({ ledger: t.ledger, keys: t.keys, network, coin, siblings: path.siblings, root: path.root, recipient, amount });
        timings.stateMs = plan.stateMs;
        timings.spendMs = plan.spendMs;
        record.coin = { position: coin.position, value: coin.value, commitment: coin.commitment, source: coin.source, lowerPathFromPir: record.pathRead !== undefined };
        record.anchor = { tailHeight: result.state.tail.height, tailBlockHash: result.state.tail.blockHash, root: result.state.tail.root, nodeHead: head.height, snapshot: result.state.snapshot };
        record.spend = { nullifier: plan.nullifier, leftHashes: plan.leftHashes, rightUpdates: plan.rightUpdates };
        record.outputs = { payment: plan.payment, change: plan.change };
        record.unprovenBytes = plan.unproven.length;
      } catch (error) {
        lastError = error;
        log(`attempt ${attempt}: ${error instanceof Error ? error.message : String(error)}`);
      }
    }
    if (plan === null) throw new Error("no spend could be built against a current root after three attempts", { cause: lastError });
    log(`spend built: nullifier ${plan.nullifier.slice(0, 16)}…, ${plan.leftHashes} left hashes, ${plan.rightUpdates} right updates`);
    if (feeWallet !== null && sdk !== null) {
      const submitted = await sdk.payProveSubmit(feeWallet, plan.unproven, nodeWs, { log, submit: !opt["no-submit"] });
      record.transaction = submitted;
      Object.assign(timings, submitted.timings);
      if (submitted.finalized !== null) {
        // FR-128: the spent coin is marked; the change's commitment waits for the next sync.
        const state = readState(statePath())!;
        const coin = record.coin as { position: number };
        writeState(statePath(), {
          ...state,
          pending: [
            ...state.pending,
            {
              txHash: submitted.txHash,
              block: { hash: submitted.finalized.blockHash, height: submitted.finalized.blockHeight },
              spent: { position: coin.position, nullifier: plan.nullifier },
              change: plan.change,
              payment: { commitment: plan.payment.commitment, value: plan.payment.value, tokenType: plan.payment.tokenType },
              at: new Date().toISOString(),
            },
          ],
        });
        log(`finalized in block ${submitted.finalized.blockHeight} (${submitted.finalized.blockHash}), transaction ${submitted.txHash}`);
      }
    }
    record.finishedAt = new Date().toISOString();
    record.peakRssBytes = memory.stop();
    const out = opt.out ?? join(resolve(opt.data), "transfers", `${String(record.startedAt).replace(/[:.]/g, "-")}.json`);
    mkdirSync(join(out, ".."), { recursive: true, mode: 0o700 });
    writeFileSync(out, json(record), { mode: 0o600 });
    log(`transfer record written to ${out}`);
    process.stdout.write(`${json(record)}\n`);
  } finally {
    await feeWallet?.stop();
    await t.close();
  }
}

async function cmdCrossCheck(): Promise<void> {
  const state = readState(statePath());
  if (state === null) throw new Error(`no local state at ${statePath()}: run sync first`);
  if (!opt["db-url"] || !opt["db-password-file"]) throw new Error("cross-check needs --db-url and --db-password-file");
  const s = await seeds();
  const [v9, v8] = await Promise.all([loadLedger(), loadLedgerV8()]);
  const { default: postgres } = (await import("postgres" as string)) as { default: (url: string, o: Record<string, unknown>) => { unsafe(q: string): Promise<Record<string, unknown>[]>; end(): Promise<void> } };
  const sql = postgres(opt["db-url"], { password: readFileSync(opt["db-password-file"], "utf8").trim(), max: 1, onnotice: () => {} });
  try {
    const started = performance.now();
    const rows = await readZswapEvents((q) => sql.unsafe(q), state.tail.height);
    log(`read ${rows.length} stored Zswap events up to ${state.tail.height} in ${Math.round(performance.now() - started)} ms`);
    const replay = replayZswapEvents({ v9, v8 }, s.zswap, rows, state.tail.height);
    const report = compareWithClient(replay, state, rows);
    if (opt.out) writeFileSync(opt.out, json(report));
    process.stdout.write(`${json(report)}\n`);
    if (!report.equal) process.exitCode = 1;
  } finally {
    await sql.end();
  }
}

/**
 * `dust` (spec 00062 FR-024): per chain, the spends found (with the file entries they were taken from), the check of
 * its last coin (FR-023: checked, false matches dropped, or not checkable yet), and the current coin (sequence number,
 * position, value); the bytes moved, the check's apart. The key is shown by its last digits only; the secret key and
 * the mnemonic never.
 */
async function cmdDust(): Promise<void> {
  const s = await seeds();
  if (s.all === null) throw new Error("dust needs the wallet's mnemonic (--wallet or --mnemonic-env): its Dust seed gives the Dust key");
  const ledger = await loadLedger();
  const http = new PssHttp(opt.server);
  const n = threads();
  const multiplier: Multiplier = n > 1 ? new WorkerMultiplier(n) : inlineMultiplier;
  const ipirWorkers = n > 1 ? nodeIpirPool(n) : undefined;
  const scheme = { multiplier, ipirWasm: () => compileIpirWasm(), ...(ipirWorkers === undefined ? {} : { ipirWorkers }) };
  /** Why no check was made although asked for: the server serves no check table (503). */
  let checkUnavailable: string | null = null;
  const openChecker = async (): Promise<DustChecker | null> => {
    try {
      return await DustChecker.open(http, scheme);
    } catch (error) {
      if (!(error instanceof HttpError) || error.status !== 503) throw error;
      checkUnavailable = error.message;
      return null;
    }
  };
  let result;
  try {
    result = await dustSync({ ledger, dustSeed: s.all.dust, http, log, ...(opt["no-check"] ? {} : { openChecker }) });
  } finally {
    await multiplier.close();
    await ipirWorkers?.close();
  }
  const checker = result.checker;
  checker?.dispose();
  const sum = (paths: readonly string[], field: "answerBytes" | "bodyBytes"): number => http.records.filter((r) => paths.some((p) => r.path.startsWith(p))).reduce((t, r) => t + r[field], 0);
  const checkPaths = [ROUTES.dustCheckManifest, ROUTES.dustCheckBlob, ROUTES.dustCheckQuery];
  const transfer = {
    requests: http.records.length,
    down: sum([""], "answerBytes"),
    up: sum([""], "bodyBytes"),
    manifest: sum([ROUTES.dustManifest], "answerBytes"),
    chunks: sum([ROUTES.dustChunk], "answerBytes"),
    coins: sum([ROUTES.dustCoins], "answerBytes"),
    parameters: sum([ROUTES.dustParameters], "answerBytes"),
    check: {
      requests: http.records.filter((r) => checkPaths.some((p) => r.path.startsWith(p))).length,
      manifest: sum([ROUTES.dustCheckManifest], "answerBytes"),
      publicArtifact: sum([ROUTES.dustCheckBlob], "answerBytes"),
      calls: checker?.stats.calls ?? 0,
      callsUp: sum([ROUTES.dustCheckQuery], "bodyBytes"),
      callsDown: sum([ROUTES.dustCheckQuery], "answerBytes"),
    },
  };
  const m = result.manifest;
  const p = result.parameters;
  const chains = result.chains.map((c, i) => ({
    firstCoinHeight: c.start.height,
    generationIndex: c.start.generationIndex,
    nightValue: c.start.generation.value,
    dtime: c.generation.dtime?.toISOString() ?? null,
    spends: c.steps.length,
    entries: c.steps.map((step) => step.entry),
    status: c.status,
    falseMatchesDropped: c.dropped.length,
    droppedEntries: c.dropped,
    coin: {
      seq: c.coin.seq,
      position: c.coin.mtIndex,
      ctime: c.coin.ctime.toISOString(),
      valueAtCreation: c.coin.initialValue,
      valueNow: result.values[i]!,
      commitment: `0x${result.commitments[i]!.toString(16).padStart(64, "0")}`,
    },
  }));
  const report = {
    server: http.origin,
    file: { eraHeight: m.eraHeight, height: m.height, entries: m.entries, chunks: m.chunks.length, chunkEntries: m.chunkEntries, prefixBytes: m.prefixBytes },
    parameters: p,
    check:
      checker === null
        ? null
        : { id: checker.id, scheme: checker.manifest.scheme, height: checker.manifest.height, commitments: checker.manifest.commitments, queriesPerCall: checker.manifest.queriesPerCall },
    checkUnavailable,
    keyEnds: result.owner.toString().slice(-8),
    firstCoins: result.chains.length,
    updates: result.updates.length,
    chains,
    at: result.at.toISOString(),
    ms: Math.round(result.ms),
    bytes: transfer,
  };
  if (opt.json) {
    process.stdout.write(`${json(report)}\n`);
    return;
  }
  const f = (v: number | bigint): string => v.toLocaleString("en-US");
  const lines = [
    `Dust file from ${report.server}: to height ${f(m.height)} (era from ${f(m.eraHeight)}), ${f(m.entries)} entries in ${m.chunks.length} chunks`,
    `parameters: ${p.nightDustRatio}, ${p.generationDecayRate}, ${p.dustGracePeriodSeconds} s (${p.source === "initial" ? "the ledger's initial ones" : `changed at ${p.changedAt}`})`,
    report.check === null
      ? `check: not made (${checkUnavailable ?? "--no-check"})`
      : `check table ${report.check.id.slice(0, 16)}…: ${report.check.scheme}, height ${f(report.check.height)}, ${f(report.check.commitments)} commitments, ${report.check.queriesPerCall} requests per call`,
    `key …${report.keyEnds}: ${chains.length} chains in the era, ${report.updates} generation updates`,
  ];
  const statusText = (c: (typeof chains)[number]): string =>
    c.status === "checked"
      ? `checked: the record at position ${c.coin.position} is the last coin's commitment`
      : c.status === "not-checkable"
        ? `not checkable yet: the check table covers positions below ${report.check!.commitments}`
        : c.status === "no-spend"
          ? "nothing to check: the first coin is public"
          : "not checked";
  chains.forEach((c, i) => {
    lines.push(
      `chain ${i + 1}: first coin at height ${f(c.firstCoinHeight)}, generation index ${c.generationIndex}, backed by ${f(c.nightValue)} Stars of Night${c.dtime === null ? "" : `, Night spent at ${c.dtime}`}`,
      `  spends found: ${c.spends}${c.spends === 0 ? "" : ` (file entries ${c.entries.join(", ")})`}`,
      `  check: ${statusText(c)}`,
      `  false matches dropped: ${c.falseMatchesDropped}${c.falseMatchesDropped === 0 ? "" : ` (file entries ${c.droppedEntries.join(", ")})`}`,
      `  current coin: seq ${c.coin.seq}, position ${c.coin.position}, created ${c.coin.ctime}, value at creation ${f(c.coin.valueAtCreation)} Specks, value now ${f(c.coin.valueNow)} Specks`,
      `  commitment ${c.coin.commitment}`,
    );
  });
  lines.push(
    `downloaded ${f(transfer.down)} bytes in ${transfer.requests} requests (manifest ${f(transfer.manifest)}, chunks ${f(transfer.chunks)}, coins ${f(transfer.coins)}, parameters ${f(transfer.parameters)}, check ${f(transfer.check.manifest + transfer.check.publicArtifact + transfer.check.callsDown)}); uploaded ${f(transfer.up)} bytes of request bodies; ${report.ms} ms`,
  );
  if (report.check !== null) {
    lines.push(
      `check: ${transfer.check.calls} call${transfer.check.calls === 1 ? "" : "s"} of ${report.check.queriesPerCall} requests, ${f(transfer.check.callsUp)} bytes up and ${f(transfer.check.callsDown)} down; once per check table: manifest ${f(transfer.check.manifest)} and public artifact ${f(transfer.check.publicArtifact)} bytes down`,
    );
  }
  process.stdout.write(`${lines.join("\n")}\n`);
}

try {
  if (opt.help || command === "help") process.stdout.write(HELP);
  else if (command === "sync") await cmdSync();
  else if (command === "balance") cmdBalance();
  else if (command === "send") await cmdSend();
  else if (command === "address") await cmdAddress();
  else if (command === "cross-check") await cmdCrossCheck();
  else if (command === "dust") await cmdDust();
  else throw new Error(`unknown command ${command}; see main.ts help`);
} catch (error) {
  log(`error: ${error instanceof Error ? error.message : String(error)}`);
  if (error instanceof Error && error.cause instanceof Error) log(`  cause: ${error.cause.message}`);
  process.exitCode = 1;
}
