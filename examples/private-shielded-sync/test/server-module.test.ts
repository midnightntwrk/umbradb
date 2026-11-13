/**
 * The module through UmbraDB's real process on PostgreSQL 18 (spec story 1, the server half of stories 3 and 4,
 * FR-002, FR-003, FR-013, FR-020–024, FR-041, FR-065–081, FR-145, SC-002). A tape node serves the chain of
 * `./server-chain.ts` (real v9 transactions); `core-ledger-state` applies it and stores the events and roots; the
 * module runs beside it, and its routes are called on the module API's mounted handler, from a server on a random
 * loopback port. Every expectation is taken from the stored rows, the reference replay, or values computed here.
 */

import { randomInt } from "node:crypto";
import { existsSync, mkdtempSync, readdirSync, readFileSync, rmSync } from "node:fs";
import { createServer, type Server } from "node:http";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { nodeSourceOf } from "../../../src/backbone/core-block-fetch/node-source.js";
import type { ProcessHandle } from "../../../src/runner/process.js";
import { chainDeclarations } from "../../../test/backbone/chain-build.js";
import { genesisOf } from "../../../test/backbone/ingest-harness.js";
import { LEDGER_CORE, restartAt } from "../../../test/backbone/ledger-restart.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { core, entryOf, startProcess } from "../../../test/runner/process-build.js";
import { TapeNode } from "../../../tools/tape/index.js";
import { listenOnRandomPort } from "../../../tools/tape/port.js";
import { compileKernel, Kernel } from "../kernel/index.ts";
import {
  bucketOf,
  buildQueries,
  columnRecords,
  decodeAnswers,
  findInBucket,
  positionOf,
  setupMatrix,
  type TableInfo,
  WorkerMultiplier,
} from "../pir/index.ts";
import {
  decodeAnswerBody,
  decodeManifest,
  decodeReadRecord,
  decodeTailOutput,
  encodeQueryBody,
  fromHex,
  type Manifest,
  OCTET_STREAM,
  ROUTES,
  snapshotId,
  splitTail,
  toHex,
} from "../shared/index.ts";
import { pssDeclaration } from "../server/declaration.ts";
import type { PssServer } from "../server/server.ts";
import { STATS_FILE } from "../server/store.ts";
import { rootFromStored } from "../server/tree.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const SECRET = "pss-test-admin-secret-0123456789";
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");
/** A request body from bytes. */
const bodyOf = (bytes: Uint8Array): BodyInit => bytes as Uint8Array<ArrayBuffer>;

let chain: ScenarioChain;
let kernel: Kernel;
let multiplier: WorkerMultiplier;
const hash = (a: Uint8Array, b: Uint8Array): Uint8Array => kernel.hash2(a, b)!;

/** A naive tree of `leaves` of depth `depth` under the ledger's rules (null: empty). */
function naiveRoot(leaves: readonly Uint8Array[], depth: number, from = 0): Uint8Array | null {
  if (from >= leaves.length) return null;
  if (depth === 0) return leaves[from]!;
  const half = 2 ** (depth - 1);
  const left = naiveRoot(leaves, depth - 1, from);
  const right = naiveRoot(leaves, depth - 1, from + half);
  return hash(left ?? new Uint8Array(32), right ?? new Uint8Array(32));
}

/** One process of the module over the chain's tape, its routes on a loopback server. */
interface Run {
  readonly handle: ProcessHandle;
  readonly origin: string;
  readonly logs: string[];
  readonly lines: string[];
  server(): PssServer;
  close(): Promise<void>;
}

async function run(
  db: ProcessDatabase,
  options: { readonly stop: number; readonly resumeAt?: number; readonly pss?: { readonly start: number; readonly config: Record<string, unknown> } },
): Promise<Run> {
  // A process resuming at a cursor asks for that block's header and its runtime's metadata there.
  const records = options.resumeAt === undefined ? chain.scenario.records : restartAt(chain.scenario.records, BigInt(options.resumeAt));
  const node = await TapeNode.start({ records });
  const logs: string[] = [];
  const lines: string[] = [];
  let server: PssServer | undefined;
  const pss = pssDeclaration({ log: (line) => logs.push(line), observe: (s) => (server = s) });
  const extra = { node: node.url, genesisHash: genesisOf(records) };
  const entries = [
    core(db.setting, 0, { extra, stop: options.stop }),
    ...LEDGER_CORE.map((module) => entryOf(module, 0)),
    ...(options.pss === undefined ? [] : [entryOf(pss, options.pss.start, options.pss.config)]),
  ];
  const handle = startProcess({
    declarations: chainDeclarations(options.pss === undefined ? [] : [pss], { core: LEDGER_CORE }),
    config: { data: { entries } },
    source: (entry, shared) => nodeSourceOf(entry, shared),
    log: (line) => lines.push(line),
  });
  const http: Server = createServer((request, response) => handle.api.http(request, response));
  const port = await listenOnRandomPort(http);
  return {
    handle,
    origin: `http://127.0.0.1:${port}`,
    logs,
    lines,
    server: () => {
      if (server === undefined) throw new Error("the module has not started");
      return server;
    },
    async close() {
      try {
        await handle.stop();
        await handle.closed;
      } finally {
        await server?.close();
        await new Promise<void>((resolve) => http.close(() => resolve()));
        await node.close();
      }
    },
  };
}

/** Waits until the process ended at `height` (stopped), or fails with its log. */
async function stoppedAt(r: Run, height: number): Promise<void> {
  await r.handle.started;
  const end = await Promise.race([r.handle.ended, sleep(240_000).then(() => null)]);
  expect(end, r.lines.join("\n")).toMatchObject({ kind: "stopped", height: BigInt(height) });
}

const auth = { Authorization: `Bearer ${SECRET}` };

async function status(r: Run): Promise<Record<string, any>> {
  const answer = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { headers: auth });
  expect(answer.status).toBe(200);
  return (await answer.json()) as Record<string, any>;
}

/** Waits until no build runs and the last build is at `height`. */
async function built(r: Run, height: number): Promise<Record<string, any>> {
  for (let waited = 0; waited < 240_000; waited += 50) {
    const s = await status(r);
    if (s.building === null && s.last?.height === height) return s;
    await sleep(50);
  }
  throw new Error(`no build at ${height} finished: ${r.logs.join("\n")}`);
}

async function requestBuild(r: Run, height?: number): Promise<Response> {
  return fetch(`${r.origin}${ROUTES.adminSnapshot}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify(height === undefined ? {} : { height }),
  });
}

async function manifestOf(r: Run): Promise<{ manifest: Manifest; bytes: Uint8Array; id: string }> {
  const answer = await fetch(`${r.origin}${ROUTES.manifest}`);
  expect(answer.status).toBe(200);
  const bytes = new Uint8Array(await answer.arrayBuffer());
  const id = toHex(snapshotId(bytes));
  expect(answer.headers.get("pss-snapshot-id")).toBe(id);
  return { manifest: decodeManifest(bytes), bytes, id };
}

async function blob(r: Run, digest: string, headers: Record<string, string> = {}): Promise<Response> {
  return fetch(`${r.origin}${ROUTES.blob}${digest}`, { headers });
}

async function blobBytes(r: Run, digest: string): Promise<Uint8Array> {
  const answer = await blob(r, digest);
  expect(answer.status).toBe(200);
  return new Uint8Array(await answer.arrayBuffer());
}

/** The stored zswap outputs and inputs, as the database holds them. */
async function storedOutputs(db: ProcessDatabase): Promise<{ position: number; height: number; commitment: Uint8Array; evidence: string; ciphertext: Uint8Array | null }[]> {
  const rows = await db.query(
    "SELECT height, tree_index, commitment, evidence, ciphertext FROM core_ledger_state.events WHERE kind = 'zswap-output' ORDER BY tree_index",
  );
  return rows.map((row) => ({
    position: Number(row.tree_index),
    height: Number(row.height),
    commitment: new Uint8Array(row.commitment as Buffer),
    evidence: row.evidence as string,
    ciphertext: row.ciphertext === null ? null : new Uint8Array(row.ciphertext as Buffer),
  }));
}

async function storedInputs(db: ProcessDatabase): Promise<{ height: number; txIndex: number; nullifier: string }[]> {
  const rows = await db.query("SELECT height, tx_index, nullifier FROM core_ledger_state.events WHERE kind = 'zswap-input' ORDER BY height, tx_index, event_index");
  return rows.map((row) => ({ height: Number(row.height), txIndex: Number(row.tx_index), nullifier: hex(row.nullifier as Buffer) }));
}

async function storedState(db: ProcessDatabase, height: number): Promise<{ firstFree: number; root: Uint8Array; hash: string }> {
  const [row] = await db.query(
    `SELECT s.zswap_first_free, s.zswap_root, b.hash FROM core_ledger_state.states s JOIN core_block_commit.blocks b USING (height) WHERE height = ${height}`,
  );
  return { firstFree: Number(row!.zswap_first_free), root: new Uint8Array(row!.zswap_root as Buffer), hash: hex(row!.hash as Buffer) };
}

/** Reads `positions` of the served read table by PIR in calls of exactly `queriesPerCall` vectors (random padding). */
async function readByPir(r: Run, m: Manifest, id: string, positions: readonly number[]): Promise<Uint8Array[]> {
  const t = m.artifacts.readTable;
  const table: TableInfo = { ...t, seed: fromHex(t.seed, 32) };
  const setup = setupMatrix(await blobBytes(r, m.artifacts.readSetup.digest), t.rows);
  const out: Uint8Array[] = [];
  for (let from = 0; from < positions.length; from += m.queriesPerCall) {
    const wanted = positions.slice(from, from + m.queriesPerCall);
    const columns = [...wanted.map((i) => positionOf(i, t.perColumn).column)];
    while (columns.length < m.queriesPerCall) columns.push(randomInt(t.cols));
    const batch = await buildQueries(table, columns, multiplier);
    const answer = await fetch(`${r.origin}${ROUTES.queryRead}`, {
      method: "POST",
      headers: { "Content-Type": OCTET_STREAM },
      body: bodyOf(encodeQueryBody({ snapshotId: fromHex(id, 32), count: columns.length, values: batch.queries }, t.cols)),
    });
    expect(answer.status).toBe(200);
    const decoded = decodeAnswerBody(new Uint8Array(await answer.arrayBuffer()), t.rows, { count: columns.length, snapshotId: fromHex(id, 32) });
    const values = await decodeAnswers(setup, batch, decoded.values, multiplier);
    wanted.forEach((i, q) => out.push(columnRecords(t, values[q]!)[positionOf(i, t.perColumn).slot]!));
  }
  return out;
}

async function lookupByPir(r: Run, m: Manifest, id: string, nullifiers: readonly Uint8Array[]) {
  const t = m.artifacts.nullifierTable;
  const table: TableInfo = { ...t, seed: fromHex(t.seed, 32) };
  const setup = setupMatrix(await blobBytes(r, m.artifacts.nullifierSetup.digest), t.rows);
  const columns = nullifiers.map((n) => bucketOf(n, t.bucketBits));
  while (columns.length < m.queriesPerCall) columns.push(randomInt(t.cols));
  const batch = await buildQueries(table, columns, multiplier);
  const answer = await fetch(`${r.origin}${ROUTES.queryNullifier}`, {
    method: "POST",
    headers: { "Content-Type": OCTET_STREAM },
    body: bodyOf(encodeQueryBody({ snapshotId: fromHex(id, 32), count: columns.length, values: batch.queries }, t.cols)),
  });
  expect(answer.status).toBe(200);
  const decoded = decodeAnswerBody(new Uint8Array(await answer.arrayBuffer()), t.rows);
  const values = await decodeAnswers(setup, batch, decoded.values, multiplier);
  return nullifiers.map((n, q) => findInBucket(columnRecords(t, values[q]!), n));
}

beforeAll(async () => {
  chain = await scenarioChain();
  kernel = new Kernel(compileKernel());
  multiplier = new WorkerMultiplier(2);
  await backend.start();
}, LONG);

afterAll(async () => {
  await multiplier?.close();
  await backend.stop();
}, LONG);

describe("the module on a chain it follows from genesis (PostgreSQL 18)", () => {
  let db: ProcessDatabase;
  let r: Run;
  let dataDir: string;
  const config = (): Record<string, unknown> => ({ dataDir, pathSplit: 2, queriesPerCall: 4, snapshotEvery: 4, adminSecret: SECRET, threads: 2 });
  let tailAt7: Uint8Array;
  let snapshotAt7: string;

  beforeAll(async () => {
    db = await backend.database();
    dataDir = mkdtempSync(join(tmpdir(), "pss-module-"));
    r = await run(db, { stop: 7, pss: { start: 0, config: config() } });
    await stoppedAt(r, 7);
  }, LONG);

  afterAll(async () => {
    await r?.close();
    if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
  }, LONG);

  it("story 1, scenario 1 + SC-002: snapshotEvery builds at 4 while following; the manifest names the height, block hash, output count and a root equal to the core's zswap_root (and the reference replay's)", { timeout: LONG }, async () => {
    const s = await built(r, 4);
    expect(s.last).toMatchObject({ height: 4, ok: true });
    const { manifest, id } = await manifestOf(r);
    const stored = await storedState(db, 4);
    const [identity] = await db.query("SELECT genesis_hash FROM core_chain.identity");
    expect([manifest.height, manifest.blockHash, manifest.firstFree, manifest.root, manifest.genesisHash, manifest.network]).toEqual([
      4,
      stored.hash,
      stored.firstFree,
      toHex(rootFromStored(stored.root)),
      hex(identity!.genesis_hash as Buffer),
      "custom",
    ]);
    expect(manifest.root).toBe(toHex(rootFromStored(chain.scenario.heights[4]!.trees.zswapRoot)));
    expect(s.current.id).toBe(id);
    // The build statistics beside the snapshot: every step with its duration, size and peak memory.
    const stats = JSON.parse(readFileSync(join(dataDir, "snapshots", id, STATS_FILE), "utf8")) as Record<string, any>;
    expect(Object.keys(stats.steps)).toEqual(["scan", "tree", "readTable", "readSetup", "nullifierTable", "nullifierSetup", "manifest"]);
    for (const step of Object.values(stats.steps) as Record<string, number>[]) {
      expect(step.ms).toBeGreaterThanOrEqual(0);
      expect(step.peakRssBytes).toBeGreaterThan(0);
    }
    expect(stats.steps.readTable.bytes).toBe(manifest.artifacts.readTable.size);
    expect(stats.steps.tree.hashes).toBeGreaterThan(0);
    expect(stats.trigger).toBe("every");
    expect(stats.indexLoad).toMatchObject({ height: -1, rows: 0 });
  });

  it("story 1, scenario 2: GET /blob/<scan digest> has 36 bytes per output, entry i the stored row's point and 4 bytes of element 0, or zeros; Range answers parts", { timeout: LONG }, async () => {
    const { manifest } = await manifestOf(r);
    const scan = await blobBytes(r, manifest.artifacts.scan.digest);
    const outputs = (await storedOutputs(db)).filter((o) => o.height <= 4);
    expect(scan.length).toBe(36 * outputs.length);
    expect(outputs.map((o) => o.position)).toEqual(outputs.map((_, i) => i));
    expect(outputs.filter((o) => o.evidence !== "ciphertext")).toHaveLength(1);
    outputs.forEach((o, i) => {
      expect(hex(scan.subarray(36 * i, 36 * i + 36)), `entry ${i}`).toBe(hex(o.ciphertext === null ? new Uint8Array(36) : o.ciphertext.subarray(0, 36)));
    });
    const part = await blob(r, manifest.artifacts.scan.digest, { Range: "bytes=36-71" });
    expect(part.status).toBe(206);
    expect(part.headers.get("content-range")).toBe(`bytes 36-71/${scan.length}`);
    expect(hex(new Uint8Array(await part.arrayBuffer()))).toBe(hex(scan.subarray(36, 72)));
    const last = await blob(r, manifest.artifacts.scan.digest, { Range: "bytes=-36" });
    expect(last.status).toBe(206);
    expect(hex(new Uint8Array(await last.arrayBuffer()))).toBe(hex(scan.subarray(scan.length - 36)));
    expect((await blob(r, manifest.artifacts.scan.digest, { Range: `bytes=${scan.length}-` })).status).toBe(416);
    const whole = await blob(r, manifest.artifacts.scan.digest);
    expect(whole.headers.get("cache-control")).toContain("immutable");
    expect(whole.headers.get("etag")).toBe(`"${manifest.artifacts.scan.digest}"`);
    await whole.arrayBuffer();
    expect((await blob(r, "0".repeat(64))).status).toBe(404);
    expect((await blob(r, "not-a-digest")).status).toBe(400);
  });

  it("the tail at 7 from the snapshot at 4: the core's tip, the commitments of the snapshot's partial block, the later outputs and nullifiers, and the current block roots, from which the root follows", { timeout: LONG }, async () => {
    const { manifest, id } = await manifestOf(r);
    const answer = await fetch(`${r.origin}${ROUTES.tail}`);
    expect(answer.status).toBe(200);
    const tail = splitTail(new Uint8Array(await answer.arrayBuffer()));
    const tip = await storedState(db, 7);
    const outputs = await storedOutputs(db);
    const inputs = await storedInputs(db);
    expect([toHex(tail.header.snapshotId), tail.header.height, toHex(tail.header.blockHash), tail.header.firstFree, toHex(tail.header.root)]).toEqual([
      id,
      7,
      tip.hash,
      tip.firstFree,
      toHex(rootFromStored(tip.root)),
    ]);
    const k = manifest.pathSplit;
    const t0 = Math.floor(manifest.firstFree / 2 ** k) * 2 ** k;
    expect(t0).toBe(8);
    expect(hex(tail.commitments)).toBe(outputs.slice(t0, manifest.firstFree).map((o) => hex(o.commitment)).join(""));
    const later = outputs.slice(manifest.firstFree);
    expect(tail.outputs.length).toBe(later.length * 257);
    later.forEach((o, i) => {
      const decoded = decodeTailOutput(tail.outputs.subarray(257 * i, 257 * (i + 1)));
      expect([hex(decoded.commitment), decoded.ciphertext && hex(decoded.ciphertext)]).toEqual([hex(o.commitment), o.ciphertext && hex(o.ciphertext)]);
    });
    const spentLater = inputs.filter((n) => n.height > 4);
    expect(spentLater).toHaveLength(2);
    expect(tail.nullifiers.length).toBe(40 * spentLater.length);
    spentLater.forEach((n, i) => {
      const view = new DataView(tail.nullifiers.buffer, tail.nullifiers.byteOffset + 40 * i, 40);
      expect([hex(tail.nullifiers.subarray(40 * i, 40 * i + 32)), view.getUint32(32, true), view.getUint32(36, true)]).toEqual([n.nullifier, n.height, n.txIndex]);
    });
    const leaves = outputs.map((o) => kernel.leaf(o.commitment));
    const blocks = Math.ceil(leaves.length / 2 ** k);
    const expectedRoots = Array.from({ length: blocks - t0 / 2 ** k }, (_, j) => naiveRoot(leaves.slice((t0 / 2 ** k + j) * 2 ** k, (t0 / 2 ** k + j + 1) * 2 ** k), k)!);
    expect(hex(tail.blockRoots)).toBe(expectedRoots.map(hex).join(""));
    // A client's root: the snapshot's roots of the blocks below T0, then the tail's.
    const snapshotRoots = await blobBytes(r, manifest.artifacts.blockRoots.digest);
    const all = [
      ...Array.from({ length: t0 / 2 ** k }, (_, b) => snapshotRoots.slice(32 * b, 32 * b + 32)),
      ...expectedRoots,
    ];
    expect(hex(naiveRoot(all, 32 - k)!)).toBe(toHex(tail.header.root));
  });

  it("stories 3 and 4 (server half): every position read through POST /query/read is the stored output's record; nullifiers looked up through POST /query/nullifier", { timeout: LONG }, async () => {
    const { manifest, id } = await manifestOf(r);
    const outputs = (await storedOutputs(db)).filter((o) => o.height <= 4);
    const positions = outputs.map((o) => o.position);
    const records = await readByPir(r, manifest, id, positions);
    const leaves = outputs.map((o) => kernel.leaf(o.commitment));
    const blockRoots = await blobBytes(r, manifest.artifacts.blockRoots.digest);
    const k = manifest.pathSplit;
    records.forEach((bytes, i) => {
      const record = decodeReadRecord(bytes, k);
      const o = outputs[i]!;
      expect(hex(record.commitment)).toBe(hex(o.commitment));
      expect(record.elements && hex(record.elements)).toBe(o.ciphertext && hex(o.ciphertext.subarray(64)));
      expect(record.lowerPath !== null, `path ${i}`).toBe(i < 8);
      if (record.lowerPath === null) return;
      let node = leaves[i]!;
      record.lowerPath.forEach((sibling, l) => {
        node = ((i >> l) & 1) === 0 ? hash(node, sibling) : hash(sibling, node);
      });
      const block = i >> k;
      expect(hex(node)).toBe(hex(blockRoots.subarray(32 * block, 32 * block + 32)));
    });
    const inputs = await storedInputs(db);
    const absent = new Uint8Array(32).fill(0x5a);
    const found = await lookupByPir(r, manifest, id, [...inputs.map((n) => fromHex(n.nullifier, 32)), absent]);
    // At 4 only the first spend is in the table; the others are newer (the tail has them); the made-up one is absent.
    expect(found.map((f) => f && [hex(f.nullifier), f.height, f.txIndex])).toEqual([[inputs[0]!.nullifier, 4, inputs[0]!.txIndex], null, null, null]);
  });

  it("query refusals: another snapshot 409 naming the served one, another vector count 400, another content type 415", { timeout: LONG }, async () => {
    const { manifest, id } = await manifestOf(r);
    const cols = manifest.artifacts.readTable.cols;
    const body = (snapshot: Uint8Array, count: number) =>
      encodeQueryBody({ snapshotId: snapshot, count, values: new Uint32Array(count * cols) }, cols);
    const post = (bytes: Uint8Array, type = OCTET_STREAM) =>
      fetch(`${r.origin}${ROUTES.queryRead}`, { method: "POST", headers: { "Content-Type": type }, body: bodyOf(bytes) });
    const other = await post(body(new Uint8Array(32).fill(1), manifest.queriesPerCall));
    expect(other.status).toBe(409);
    expect(await other.json()).toMatchObject({ error: { code: "snapshot-replaced" }, snapshot: id });
    expect((await post(body(fromHex(id, 32), manifest.queriesPerCall - 1))).status).toBe(400);
    expect((await post(body(fromHex(id, 32), manifest.queriesPerCall), "application/json")).status).toBe(415);
    const nullifierOther = await fetch(`${r.origin}${ROUTES.queryNullifier}`, {
      method: "POST",
      headers: { "Content-Type": OCTET_STREAM },
      body: bodyOf(encodeQueryBody({ snapshotId: new Uint8Array(32), count: manifest.queriesPerCall, values: new Uint32Array(manifest.queriesPerCall * manifest.artifacts.nullifierTable.cols) }, manifest.artifacts.nullifierTable.cols)),
    });
    expect(nullifierOther.status).toBe(409);
  });

  it("the admin routes need the configured secret", { timeout: LONG }, async () => {
    const none = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { method: "POST", headers: { "Content-Type": "application/json" }, body: "{}" });
    expect(none.status).toBe(401);
    expect(none.headers.get("www-authenticate")).toBe("Bearer");
    const wrong = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { method: "POST", headers: { Authorization: `Bearer ${SECRET}x`, "Content-Type": "application/json" }, body: "{}" });
    expect(wrong.status).toBe(401);
    expect((await fetch(`${r.origin}${ROUTES.adminSnapshot}`)).status).toBe(401);
    // Negative control: the right secret is answered.
    expect((await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { headers: auth })).status).toBe(200);
    expect(r.logs.join("\n")).not.toContain(SECRET);
  });

  it("builds on request: at 5; at 6 with the core's stored root changed fails (root-mismatch) and keeps 5; at 7, which prunes 4; again at 7, the same identifier (FR-145); below the current or above the index refused; one build at a time", { timeout: LONG }, async () => {
    const first = await manifestOf(r);
    expect((await requestBuild(r, 5)).status).toBe(202);
    await built(r, 5);
    const five = await manifestOf(r);
    expect(five.manifest.height).toBe(5);
    expect((await status(r)).previous).toEqual({ id: first.id });

    const [original] = await db.query("SELECT zswap_root FROM core_ledger_state.states WHERE height = 6");
    const changed = Buffer.from(original!.zswap_root as Buffer);
    changed[1]! ^= 1;
    await db.admin!.unsafe("UPDATE core_ledger_state.states SET zswap_root = $1 WHERE height = 6", [changed]);
    try {
      expect((await requestBuild(r, 6)).status).toBe(202);
      const failed = await built(r, 6);
      expect(failed.last).toMatchObject({ height: 6, ok: false, code: "root-mismatch" });
      expect((await manifestOf(r)).id).toBe(five.id);
      expect(readdirSync(join(dataDir, "builds"))).toEqual([]);
    } finally {
      await db.admin!.unsafe("UPDATE core_ledger_state.states SET zswap_root = $1 WHERE height = 6", [Buffer.from(original!.zswap_root as Buffer)]);
    }

    expect((await requestBuild(r)).status).toBe(202);
    const running = await requestBuild(r);
    expect(running.status).toBe(409);
    expect(await running.json()).toMatchObject({ error: { code: "build-running" } });
    await built(r, 7);
    const seven = await manifestOf(r);
    expect(seven.manifest.height).toBe(7);
    expect(readdirSync(join(dataDir, "snapshots")).sort()).toEqual([five.id, seven.id].sort());
    expect((await blob(r, first.manifest.artifacts.scan.digest)).status).toBe(404);
    // The previous snapshot's files are still served; its query calls are refused (409).
    expect((await blob(r, five.manifest.artifacts.readSetup.digest)).status).toBe(200);

    expect((await requestBuild(r, 7)).status).toBe(202);
    const again = await built(r, 7);
    expect(again.last).toMatchObject({ ok: true, id: seven.id });
    expect((await manifestOf(r)).id).toBe(seven.id);
    expect((await status(r)).previous).toEqual({ id: five.id });

    expect((await requestBuild(r, 6)).status).toBe(400);
    expect((await requestBuild(r, 8)).status).toBe(400);
    snapshotAt7 = seven.id;
    const tail = await fetch(`${r.origin}${ROUTES.tail}`);
    tailAt7 = new Uint8Array(await tail.arrayBuffer());
    expect(splitTail(tailAt7).header.height).toBe(7);
  });

  it("FR-080: one log line per request with its route, status, body and answer lengths and time, never a body", { timeout: LONG }, async () => {
    const { manifest, id } = await manifestOf(r);
    const before = r.logs.length;
    await readByPir(r, manifest, id, [0]);
    const lines = r.logs.slice(before).map((line) => JSON.parse(line) as Record<string, unknown>).filter((line) => line.event === "request");
    const query = lines.find((line) => line.route === `POST ${ROUTES.queryRead}`)!;
    const t = manifest.artifacts.readTable;
    expect(query).toMatchObject({ status: 200, bodyBytes: 40 + manifest.queriesPerCall * t.cols * 4, answerBytes: 40 + manifest.queriesPerCall * t.rows * 4 });
    expect(typeof query.ms).toBe("number");
    expect(Object.keys(query).sort()).toEqual(["answerBytes", "at", "bodyBytes", "event", "ms", "pss", "range", "route", "status"]);
    const blobLine = lines.find((line) => String(line.route).startsWith("GET /pss/v1/blob/"))!;
    expect(blobLine.answerBytes).toBe(manifest.artifacts.readSetup.size);
  });

  it("restart: a new process on the same database and data directory serves the latest snapshot and the one before, rebuilds the tail to the same bytes, and answers queries; without a secret the admin routes answer 403", { timeout: LONG }, async () => {
    await r.close();
    const { adminSecret: _secret, ...withoutSecret } = config();
    r = await run(db, { stop: 7, pss: { start: 0, config: { ...withoutSecret, snapshotEvery: 0 } } });
    await stoppedAt(r, 7);
    const { manifest, id } = await manifestOf(r);
    expect(id).toBe(snapshotAt7);
    const tail = new Uint8Array(await (await fetch(`${r.origin}${ROUTES.tail}`)).arrayBuffer());
    expect(hex(tail)).toBe(hex(tailAt7));
    const s = r.server().status() as Record<string, any>;
    expect(s.index).toMatchObject({ height: 7, outputs: 15, nullifiers: 3, error: null });
    expect(s.indexLoad).toMatchObject({ height: 7, rows: 18 });
    expect(s.previous).not.toBeNull();
    expect((await blob(r, (s.previous as { id: string }).id)).status).toBe(200);
    const outputs = await storedOutputs(db);
    const [record] = await readByPir(r, manifest, id, [14]);
    expect(hex(decodeReadRecord(record!, manifest.pathSplit).commitment)).toBe(hex(outputs[14]!.commitment));
    expect((await requestBuild(r)).status).toBe(403);
  });
});

describe("the module joining a database already synced (startsMidChain, FR-002)", () => {
  it("added above the cursor, it loads the stored rows at start, follows the later heights, and builds at the head with the core's root", { timeout: LONG }, async () => {
    const db = await backend.database();
    const dataDir = mkdtempSync(join(tmpdir(), "pss-midchain-"));
    try {
      const coreOnly = await run(db, { stop: 4 });
      await stoppedAt(coreOnly, 4);
      await coreOnly.close();
      const r = await run(db, { stop: 7, resumeAt: 4, pss: { start: 5, config: { dataDir, pathSplit: 2, queriesPerCall: 4, adminSecret: SECRET, threads: 2 } } });
      try {
        await stoppedAt(r, 7);
        const s = r.server().status() as Record<string, any>;
        expect(s.indexLoad).toMatchObject({ height: 4, rows: 10 });
        expect(s.index).toMatchObject({ height: 7, outputs: 15, nullifiers: 3, error: null });
        expect((await requestBuild(r)).status).toBe(202);
        await built(r, 7);
        const { manifest } = await manifestOf(r);
        const stored = await storedState(db, 7);
        expect([manifest.height, manifest.firstFree, manifest.root]).toEqual([7, stored.firstFree, toHex(rootFromStored(stored.root))]);
        expect(existsSync(join(dataDir, "snapshots"))).toBe(true);
      } finally {
        await r.close();
      }
    } finally {
      rmSync(dataDir, { recursive: true, force: true });
    }
  });
});
