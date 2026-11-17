/**
 * The module's Dust routes through UmbraDB's real process on PostgreSQL 18 (spec 00062 FR-007, FR-010 to FR-013,
 * SC-004), with the harness of `server-module.test.ts`. The test chain (`./server-chain.ts`) has no Dust events, so
 * real Preprod ones (`./server-dust-fixture.ts`) are written into the core's events table at the chain's committed
 * heights, and the core's stored Dust tree values (`dust_commitment_first_free`, `dust_commitment_root`,
 * `dust_generation_first_free`, `dust_generation_root`) set to Preprod's there, before the module joins
 * (`startsMidChain`); the module reads them at start, builds its Dust snapshot (check table, commitment tree checked
 * against the stored root, path table, generation records checked against theirs), follows the later heights, and
 * serves them. The check table and a coin's path are read by PIR through the wallet's own code
 * (`../client/dust-check.ts`) in SimplePIR, then in IPIR+SP after a snapshot build of that scheme rebuilt them (which
 * needs the IPIR+SP add-on, `ipir/build.sh native`). Every expectation is taken from the fixture's events and stored
 * values, read with the vendored ledger build.
 */

import { createHash } from "node:crypto";
import { mkdtempSync, rmSync } from "node:fs";
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
import { core, entryOf as moduleEntry, startProcess } from "../../../test/runner/process-build.js";
import { TapeNode } from "../../../tools/tape/index.js";
import { listenOnRandomPort } from "../../../tools/tape/port.js";
import * as ledger from "../../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { DustChecker } from "../client/dust-check.ts";
import { compileKernel, Kernel } from "../kernel/kernel.ts";
import { PssHttp } from "../client/http.ts";
import { compileIpirWasm } from "../ipir/wallet-node.ts";
import { inlineMultiplier } from "../pir/index.ts";
import {
  decodeDustCheckManifest,
  decodeDustChunk,
  type DustCoinsAnswer,
  dustEntryAt,
  type DustManifest,
  type DustParametersAnswer,
  encodeQueryBody,
  fromHex,
  OCTET_STREAM,
  ROUTES,
} from "../shared/index.ts";
import { pssDeclaration } from "../server/declaration.ts";
import type { PssServer } from "../server/server.ts";
import { rootFromStored } from "../server/tree.ts";
import { scenarioChain, type ScenarioChain } from "./server-chain.ts";
import { commitmentsUpTo, entryOf, FIXTURE, FIXTURE_STATES, type FixtureRow, type FixtureState, ownerOf, spendRows } from "./server-dust-fixture.ts";

const LONG = 600_000;
const SECRET = "pss-dust-test-admin-secret-012345";
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");

/** The test chain's height each fixture row is written at: the era's first block is 2, the module joins at 5. */
function testHeight(row: FixtureRow): number {
  if (row.height <= 3_348_434) return 2;
  if (row.height <= 3_349_459) return 3;
  return 4;
}
const ERA = 2;
/** The core's stored Dust tree values after each test height: Preprod's after the heights written there. */
const STATE: Readonly<Record<number, FixtureState>> = { 2: FIXTURE_STATES[0]!, 3: FIXTURE_STATES[1]!, 4: FIXTURE_STATES[2]!, 5: FIXTURE_STATES[2]!, 6: FIXTURE_STATES[2]!, 7: FIXTURE_STATES[2]! };
/** A stored root as the snapshot's manifest names it: 32 bytes little-endian, hexadecimal. */
const rootHex = (stored: string): string => hex(rootFromStored(Buffer.from(stored, "hex")));
const LAST = FIXTURE.at(-1)!.height;

interface Run {
  readonly handle: ProcessHandle;
  readonly origin: string;
  readonly logs: string[];
  readonly lines: string[];
  server(): PssServer;
  close(): Promise<void>;
}

/** One process over the chain's tape (the module only when `pss` is given), its routes on a loopback server. */
async function run(chain: ScenarioChain, db: ProcessDatabase, options: { stop: number; resumeAt?: number; pss?: { start: number; config: Record<string, unknown> } }): Promise<Run> {
  const records = options.resumeAt === undefined ? chain.scenario.records : restartAt(chain.scenario.records, BigInt(options.resumeAt));
  const node = await TapeNode.start({ records });
  const logs: string[] = [];
  const lines: string[] = [];
  let server: PssServer | undefined;
  const pss = pssDeclaration({ log: (line) => logs.push(line), observe: (s) => (server = s) });
  const entries = [
    core(db.setting, 0, { extra: { node: node.url, genesisHash: genesisOf(records) }, stop: options.stop }),
    ...LEDGER_CORE.map((module) => moduleEntry(module, 0)),
    ...(options.pss === undefined ? [] : [moduleEntry(pss, options.pss.start, options.pss.config)]),
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

async function stoppedAt(r: Run, height: number): Promise<void> {
  await r.handle.started;
  const end = await Promise.race([r.handle.ended, sleep(240_000).then(() => null)]);
  expect(end, r.lines.join("\n")).toMatchObject({ kind: "stopped", height: BigInt(height) });
}

/** Sets the core's stored Dust tree values at the given test heights to the fixture's. */
async function setStates(db: ProcessDatabase, heights: readonly number[]): Promise<void> {
  for (const h of heights) {
    const s = STATE[h]!;
    await db.admin!.unsafe(
      "UPDATE core_ledger_state.states SET dust_commitment_first_free = $1, dust_commitment_root = $2, dust_generation_first_free = $3, dust_generation_root = $4 WHERE height = $5",
      [s.commitmentFirstFree, Buffer.from(s.commitmentRoot, "hex"), s.generationFirstFree, Buffer.from(s.generationRoot, "hex"), h],
    );
  }
}

/** The block time stored at `height`, in seconds. */
async function blockTimeAt(db: ProcessDatabase, height: number): Promise<number> {
  const [row] = await db.admin!.unsafe("SELECT block_time FROM core_block_commit.blocks WHERE height = $1", [height]);
  return (row!.block_time as Date).getTime() / 1000;
}

const auth = { Authorization: `Bearer ${SECRET}` };

async function adminStatus(r: Run): Promise<Record<string, any>> {
  return (await (await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { headers: auth })).json()) as Record<string, any>;
}

/** Waits until no check table builds and the last one is in `scheme` at `height` (or failed, when `ok` is false). */
async function checkBuilt(r: Run, scheme: string, height: number, ok = true): Promise<Record<string, any>> {
  for (let waited = 0; waited < 240_000; waited += 50) {
    const s = await adminStatus(r);
    const last = s.dustCheck?.last;
    if (s.dustCheck?.building === null && last?.scheme === scheme && last?.height === height && last?.ok === ok) return s;
    await sleep(50);
  }
  throw new Error(`no Dust check table in ${scheme} at ${height}: ${r.logs.join("\n")}`);
}

/** Writes the fixture's rows at their test heights, and one spend again below the era (which the module must not read). */
async function writeFixture(db: ProcessDatabase): Promise<void> {
  const rows = [...FIXTURE.map((row) => ({ row, height: testHeight(row) })), { row: spendRows()[5]!, height: ERA - 1 }];
  for (const [i, { row, height }] of rows.entries()) {
    await db.admin!.unsafe(
      `INSERT INTO core_ledger_state.events (height, tx_index, event_index, kind, logical_segment, physical_segment, bytes, nullifier, commitment, tree_index)
       VALUES ($1, $2, 0, $3, 0, 0, $4, $5, $6, $7)`,
      [
        height,
        100 + i,
        row.kind,
        Buffer.from(row.bytes, "hex"),
        row.nullifier === null ? null : Buffer.from(row.nullifier, "hex"),
        row.commitment === null ? null : Buffer.from(row.commitment, "hex"),
        row.treeIndex,
      ],
    );
  }
}

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: Run;
let dataDir: string;

beforeAll(async () => {
  chain = await scenarioChain();
  await backend.start();
  db = await backend.database();
  dataDir = mkdtempSync(join(tmpdir(), "pss-dust-"));
  const coreOnly = await run(chain, db, { stop: 4 });
  await stoppedAt(coreOnly, 4);
  await coreOnly.close();
  await writeFixture(db);
  await setStates(db, [2, 3, 4]);
  r = await run(chain, db, {
    stop: 7,
    resumeAt: 4,
    pss: { start: 5, config: { dataDir, pathSplit: 2, queriesPerCall: 4, adminSecret: SECRET, threads: 1, dustEraHeight: ERA } },
  });
  await stoppedAt(r, 7);
}, LONG);

afterAll(async () => {
  await r?.close();
  await backend.stop();
  if (dataDir !== undefined) rmSync(dataDir, { recursive: true, force: true });
}, LONG);

describe("the module's Dust routes over stored Preprod events (PostgreSQL 18)", () => {
  it("loads the era's stored events at start (not the spend below the era) and follows the later heights", { timeout: LONG }, () => {
    const s = r.server().status() as Record<string, any>;
    expect(s.dust).toMatchObject({ eraHeight: ERA, height: 7, entries: 144, chunks: 1, firstCoins: 110, updates: 5, owners: 47, parameters: "initial", error: null });
    const loaded = r.logs.map((line) => JSON.parse(line) as Record<string, unknown>).find((line) => line.event === "dust-loaded");
    expect(loaded).toMatchObject({ rows: FIXTURE.length, height: 4, entries: 144 });
    expect(s.settings.dustEraHeight).toBe(ERA);
  });

  it("GET /dust/manifest and /dust/chunk/0: the file of the era's spends in chain order, each entry the event's prefix, declared time, fee and position", { timeout: LONG }, async () => {
    const answer = await fetch(`${r.origin}${ROUTES.dustManifest}`);
    expect(answer.status).toBe(200);
    const manifest = (await answer.json()) as DustManifest;
    expect(manifest).toMatchObject({ version: 1, eraHeight: ERA, height: 7, entries: 144, chunkEntries: 4096, prefixBytes: 4 });
    expect(manifest.chunks).toHaveLength(1);
    expect(manifest.chunks[0]).toMatchObject({ first: 0, count: 144, firstHeight: 3, lastHeight: 4 });

    const chunk = await fetch(`${r.origin}${ROUTES.dustChunk}0`);
    expect(chunk.status).toBe(200);
    expect(chunk.headers.get("content-type")).toBe(OCTET_STREAM);
    // The last chunk grows with the file, so it is not cached for good.
    expect(chunk.headers.get("cache-control")).toBe("no-cache");
    const bytes = new Uint8Array(await chunk.arrayBuffer());
    expect([bytes.length, createHash("sha256").update(bytes).digest("hex")]).toEqual([manifest.chunks[0]!.bytes, manifest.chunks[0]!.sha256]);
    expect(chunk.headers.get("etag")).toBe(`"${manifest.chunks[0]!.sha256}"`);
    const decoded = decodeDustChunk(bytes);
    spendRows().forEach((row, i) => {
      const want = entryOf(row);
      const got = dustEntryAt(decoded, i);
      expect([hex(got.prefix), got.time, got.fee, got.position], `entry ${i}`).toEqual([hex(want.prefix), want.time, want.fee, want.position]);
    });

    // At the count the manifest names: the same bytes, cached for good (chunk n at a count never changes).
    const counted = await fetch(`${r.origin}${ROUTES.dustChunk}0?count=144`);
    expect(counted.headers.get("cache-control")).toContain("immutable");
    expect(Buffer.from(await counted.arrayBuffer()).equals(Buffer.from(bytes))).toBe(true);
    const fewer = new Uint8Array(await (await fetch(`${r.origin}${ROUTES.dustChunk}0?count=100`)).arrayBuffer());
    expect(decodeDustChunk(fewer).count).toBe(100);
    expect((await fetch(`${r.origin}${ROUTES.dustChunk}0?count=145`)).status).toBe(404);
    expect((await fetch(`${r.origin}${ROUTES.dustChunk}0?count=x`)).status).toBe(400);
    expect((await fetch(`${r.origin}${ROUTES.dustChunk}1`)).status).toBe(404);
    for (const bad of ["x", "01", "-1", "1e3"]) expect((await fetch(`${r.origin}${ROUTES.dustChunk}${bad}`)).status, bad).toBe(400);
  });

  it("GET /dust/coins?owner=…: that owner's first coins and generation updates as the events' bytes, in chain order; a malformed owner is refused", { timeout: LONG }, async () => {
    const coins = FIXTURE.filter((row) => row.kind !== "dust-spend-processed");
    const owners = [...new Set(coins.map(ownerOf))];
    for (const owner of owners) {
      const answer = await fetch(`${r.origin}${ROUTES.dustCoins}?owner=${owner}`);
      expect(answer.status).toBe(200);
      const body = (await answer.json()) as DustCoinsAnswer;
      const mine = coins.filter((row) => ownerOf(row) === owner);
      expect(body).toEqual({
        owner: owner.toString(),
        eraHeight: ERA,
        height: 7,
        firstCoins: mine.filter((row) => row.kind === "dust-initial-utxo").map((row) => ({ height: testHeight(row), bytes: row.bytes })),
        updates: mine.filter((row) => row.kind === "dust-generation-dtime-update").map((row) => ({ height: testHeight(row), bytes: row.bytes })),
      });
    }
    const nobody = (await (await fetch(`${r.origin}${ROUTES.dustCoins}?owner=1`)).json()) as DustCoinsAnswer;
    expect([nobody.firstCoins, nobody.updates]).toEqual([[], []]);
    for (const bad of ["", "?owner=", "?owner=abc", "?owner=-5", "?owner=007", `?owner=${1n << 256n}`]) {
      const refused = await fetch(`${r.origin}${ROUTES.dustCoins}${bad}`);
      expect(refused.status, bad).toBe(400);
      expect(await refused.json()).toMatchObject({ error: { code: "invalid-owner" } });
    }
    // The log names the route, never the owner asked for.
    const logged = r.logs.filter((line) => line.includes(ROUTES.dustCoins));
    expect(logged.length).toBeGreaterThan(0);
    for (const owner of owners) expect(r.logs.join("\n")).not.toContain(owner.toString().slice(0, 20));
  });

  it("GET /dust/parameters: the ledger's initial Dust parameters, the era having no parameter change; the ledger parameters in force at the last height, as the core's item gave them (the wallet's fee)", { timeout: LONG }, async () => {
    const answer = await fetch(`${r.origin}${ROUTES.dustParameters}`);
    expect(answer.status).toBe(200);
    const body = (await answer.json()) as DustParametersAnswer;
    expect(body).toEqual({
      nightDustRatio: "5000000000",
      generationDecayRate: "8267",
      dustGracePeriodSeconds: "10800",
      source: "initial",
      changedAt: null,
      height: 7,
      ledgerParameters: expect.stringMatching(/^[0-9a-f]+$/),
      ledgerParametersHeight: 7,
    });
    const parameters = ledger.LedgerParameters.deserialize(fromHex(body.ledgerParameters!));
    expect(parameters.dust.nightDustRatio).toBe(5_000_000_000n);
    expect(parameters.feePrices).toBeDefined();
  });

  it("FR-080: one log line per Dust request with its route, status and answer length", { timeout: LONG }, async () => {
    const before = r.logs.length;
    await (await fetch(`${r.origin}${ROUTES.dustManifest}`)).arrayBuffer();
    const line = r.logs
      .slice(before)
      .map((l) => JSON.parse(l) as Record<string, unknown>)
      .find((l) => l.event === "request" && l.route === `GET ${ROUTES.dustManifest}`);
    expect(line).toMatchObject({ status: 200, bodyBytes: 0 });
    expect(line!.answerBytes).toBeGreaterThan(0);
  });
});

describe("the Dust check table (FR-012, FR-023, SC-004)", () => {
  /** The commitments at test height 4, which every later height keeps: positions 0 to 253. */
  const expected = commitmentsUpTo(LAST);
  const positions = [0, 99, 100, 101, 102, 150, 253];
  const coinsAt = (ps: readonly number[]) => ps.map((position) => ({ position, commitment: expected.get(position)! }));

  it("built at start in the configured scheme (SimplePIR) at the height the module started from: positions 0 to 253; the commitment tree's root and the generation records' are the core's stored ones (acceptance 1 and 3); the manifest names them, and the public files are served by digest", { timeout: LONG }, async () => {
    const s = await checkBuilt(r, "simplepir", 4);
    expect(s.dustCheck.current).toMatchObject({ height: 4, commitments: 254, scheme: "simplepir" });
    const answer = await fetch(`${r.origin}${ROUTES.dustCheckManifest}`);
    expect(answer.status).toBe(200);
    const bytes = new Uint8Array(await answer.arrayBuffer());
    const manifest = decodeDustCheckManifest(bytes);
    expect(answer.headers.get("pss-dust-check-id")).toBe(createHash("sha256").update(bytes).digest("hex"));
    const state = STATE[4]!;
    expect(manifest).toMatchObject({
      version: 2,
      eraHeight: ERA,
      height: 4,
      blockTime: await blockTimeAt(db, 4),
      commitments: 254,
      scheme: "simplepir",
      queriesPerCall: 4,
      table: { records: 254, recordBytes: 32 },
      tree: { pathSplit: 2, root: rootHex(state.commitmentRoot), blockRoots: { blocks: 64, size: 64 * 32 }, pathTable: { records: 254, recordBytes: 64 } },
      generation: { records: state.generationFirstFree, root: rootHex(state.generationRoot) },
    });
    for (const ref of [manifest.public, manifest.tree.blockRoots, manifest.tree.pathPublic!, manifest.generation.file]) {
      const artifact = await fetch(`${r.origin}${ROUTES.dustCheckBlob}${ref.digest}`);
      expect(artifact.status).toBe(200);
      expect(artifact.headers.get("cache-control")).toContain("immutable");
      expect((await artifact.arrayBuffer()).byteLength).toBe(ref.size);
    }
    expect((await fetch(`${r.origin}${ROUTES.dustCheckBlob}${"0".repeat(64)}`)).status).toBe(404);
    // The table files are not served: only the public files a wallet needs.
    for (const table of [manifest.table, manifest.tree.pathTable!]) expect((await fetch(`${r.origin}${ROUTES.dustCheckBlob}${table.digest}`)).status).toBe(404);
    const built = r.logs.map((line) => JSON.parse(line) as Record<string, unknown>).find((line) => line.event === "dust-check-built")!;
    expect(built).toMatchObject({ height: 4, scheme: "simplepir", commitments: 254 });
  });

  it("acceptance 2 (SimplePIR): a coin's path, its lower siblings read by PIR in one padded call, gives the core's stored root at every position read; another commitment gives another root, refused; the generation records are the stored root's", { timeout: LONG }, async () => {
    const http = new PssHttp(r.origin);
    const checker = await DustChecker.open(http, { multiplier: inlineMultiplier });
    const kernel = new Kernel(compileKernel());
    try {
      const root = rootHex(STATE[4]!.commitmentRoot);
      for (const position of [0, 101, 252, 253]) {
        const path = await checker.readPath(position, expected.get(position)!, kernel);
        expect([position, hex(path.root), path.siblings.length]).toEqual([position, root, 32]);
      }
      const calls = http.records.filter((rec) => rec.path === ROUTES.dustPathQuery);
      expect(calls).toHaveLength(4);
      expect(new Set(calls.map((c) => c.bodyBytes)).size).toBe(1);
      expect(checker.pathStats).toMatchObject({ calls: 4, bytesUp: 4 * calls[0]!.bodyBytes });
      await expect(checker.readPath(150, expected.get(151)!, kernel)).rejects.toThrow(/not the Dust snapshot's/);
      await expect(checker.readPath(254, new Uint8Array(32), kernel)).rejects.toThrow(/not in the Dust snapshot's tree/);
      const records = await checker.generationRecords();
      expect(records).toHaveLength(STATE[4]!.generationFirstFree);
    } finally {
      checker.dispose();
    }
  });

  it("the wallet's check (SimplePIR): each position read by PIR is the fixture's commitment there; another commitment is refused; a position the table does not reach is not checkable; one call per queriesPerCall positions, each exactly queriesPerCall requests", { timeout: LONG }, async () => {
    const http = new PssHttp(r.origin);
    const checker = await DustChecker.open(http, { multiplier: inlineMultiplier });
    try {
      expect(await checker.check(coinsAt(positions.slice(0, 4)))).toEqual(["match", "match", "match", "match"]);
      expect(checker.stats.calls).toBe(1);
      const wrong = { position: 150, commitment: Uint8Array.from(expected.get(150)!, (b, i) => (i === 0 ? b ^ 1 : b)) };
      expect(await checker.check([...coinsAt(positions.slice(4)), wrong, { position: 254, commitment: new Uint8Array(32) }])).toEqual(["match", "match", "match", "mismatch", "beyond"]);
      // Each call has the same size: its 40-byte header and exactly queriesPerCall requests.
      const calls = http.records.filter((rec) => rec.path === ROUTES.dustCheckQuery);
      expect(calls.length).toBe(checker.stats.calls);
      expect(new Set(calls.map((c) => c.bodyBytes)).size).toBe(1);
      expect(calls[0]!.bodyBytes).toBe(40 + 4 * checker.manifest.table.layout.cols * 4);
      expect(checker.stats.bytesUp).toBe(calls.reduce((t, c) => t + c.bodyBytes, 0));
      // Nothing to check still makes one call.
      const before = checker.stats.calls;
      expect(await checker.check([])).toEqual([]);
      expect(checker.stats.calls).toBe(before + 1);
    } finally {
      checker.dispose();
    }
  });

  it("query refusals: another check's identifier 409 naming the served one, another request count 400, another content type 415", { timeout: LONG }, async () => {
    const bytes = new Uint8Array(await (await fetch(`${r.origin}${ROUTES.dustCheckManifest}`)).arrayBuffer());
    const manifest = decodeDustCheckManifest(bytes);
    const id = createHash("sha256").update(bytes).digest("hex");
    const requestBytes = manifest.table.layout.cols * 4;
    const body = (check: Uint8Array, count: number) => encodeQueryBody({ snapshotId: check, count, payload: new Uint8Array(count * requestBytes) }, requestBytes);
    const post = (b: Uint8Array, type = OCTET_STREAM) => fetch(`${r.origin}${ROUTES.dustCheckQuery}`, { method: "POST", headers: { "Content-Type": type }, body: b as Uint8Array<ArrayBuffer> });
    const other = await post(body(new Uint8Array(32).fill(1), 4));
    expect(other.status).toBe(409);
    expect(await other.json()).toMatchObject({ error: { code: "dust-check-replaced" }, check: id });
    expect((await post(body(fromHex(id, 32), 3))).status).toBe(400);
    expect((await post(body(fromHex(id, 32), 4), "application/json")).status).toBe(415);
  });

  it("a snapshot build at a height whose stored dust_commitment_first_free differs from the events' commitments: the check table is not rebuilt, and the reason is reported", { timeout: LONG }, async () => {
    const before = (await adminStatus(r)).dustCheck.current.id as string;
    // Heights 5 to 7 were committed after the module joined, with the test chain's own value (0).
    const answer = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ height: 7 }) });
    expect(answer.status).toBe(202);
    const s = await checkBuilt(r, "simplepir", 7, false);
    expect(s.dustCheck.last).toMatchObject({ code: "first-free-mismatch", message: "the Dust events up to height 7 fill positions 0 to 253; the core's dust_commitment_first_free there is 0" });
    expect(s.dustCheck.current.id).toBe(before);
  });

  it("SC-004: a snapshot build in IPIR+SP rebuilds the check table in IPIR+SP at its height; the wallet's check through IPIR+SP gives the same answers; a call to the replaced table is refused, whose public artifact is still served", { timeout: LONG }, async () => {
    await setStates(db, [5, 6, 7]);
    const old = decodeDustCheckManifest(new Uint8Array(await (await fetch(`${r.origin}${ROUTES.dustCheckManifest}`)).arrayBuffer()));
    const oldHttp = new PssHttp(r.origin);
    const oldChecker = await DustChecker.open(oldHttp, { multiplier: inlineMultiplier });
    // Wait for the snapshot build the previous test started, then ask for one in IPIR+SP.
    for (let waited = 0; (await adminStatus(r)).building !== null && waited < 240_000; waited += 50) await sleep(50);
    const answer = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { method: "POST", headers: { ...auth, "Content-Type": "application/json" }, body: JSON.stringify({ height: 7, scheme: "ipir-sp" }) });
    expect(answer.status, await answer.clone().text()).toBe(202);
    const s = await checkBuilt(r, "ipir-sp", 7);
    expect(s.dustCheck.current).toMatchObject({ height: 7, commitments: 254, scheme: "ipir-sp" });
    expect(s.dustCheck.previous).not.toBeNull();
    const http = new PssHttp(r.origin);
    const checker = await DustChecker.open(http, { ipirWasm: () => compileIpirWasm() });
    try {
      expect(checker.manifest).toMatchObject({ scheme: "ipir-sp", height: 7, commitments: 254 });
      const wrong = { position: 0, commitment: new Uint8Array(32) };
      expect(await checker.check([...coinsAt(positions), wrong, { position: 254, commitment: new Uint8Array(32) }])).toEqual([...positions.map(() => "match"), "mismatch", "beyond"]);
      const calls = http.records.filter((rec) => rec.path === ROUTES.dustCheckQuery);
      expect(new Set(calls.map((c) => c.bodyBytes)).size).toBe(1);
      // Acceptance 2 in IPIR+SP: the path read gives the stored root at height 7.
      expect(checker.manifest.tree.root).toBe(rootHex(STATE[7]!.commitmentRoot));
      const path = await checker.readPath(253, expected.get(253)!, new Kernel(compileKernel()));
      expect(hex(path.root)).toBe(rootHex(STATE[7]!.commitmentRoot));
      expect(http.records.filter((rec) => rec.path === ROUTES.dustPathQuery)).toHaveLength(1);
    } finally {
      checker.dispose();
    }
    // The SimplePIR table is replaced: a call to it is refused by name; its public artifact is still served.
    await expect(oldChecker.check(coinsAt([0]))).rejects.toMatchObject({ status: 409, code: "dust-check-replaced" });
    oldChecker.dispose();
    expect((await fetch(`${r.origin}${ROUTES.dustCheckBlob}${old.public.digest}`)).status).toBe(200);
    // The log names the routes, with lengths only.
    const lines = r.logs.map((line) => JSON.parse(line) as Record<string, unknown>).filter((line) => line.event === "request" && line.route === `POST ${ROUTES.dustCheckQuery}`);
    expect(lines.length).toBeGreaterThan(0);
    expect(Object.keys(lines[0]!).sort()).toEqual(["answerBytes", "at", "bodyBytes", "event", "ms", "pss", "range", "route", "status"]);
  });
});
