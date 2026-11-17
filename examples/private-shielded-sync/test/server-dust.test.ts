/**
 * The module's Dust routes through UmbraDB's real process on PostgreSQL 18 (spec 00062 FR-007, FR-010, FR-011,
 * FR-013), with the harness of `server-module.test.ts`. The test chain (`./server-chain.ts`) has no Dust events, so
 * real Preprod ones (`./server-dust-fixture.ts`) are written into the core's events table at the chain's committed
 * heights before the module joins (`startsMidChain`); the module reads them at start, follows the later heights, and
 * serves them. Every expectation is taken from the fixture's events, read with the vendored ledger build.
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
import { decodeDustChunk, type DustCoinsAnswer, dustEntryAt, type DustManifest, type DustParametersAnswer, OCTET_STREAM, ROUTES } from "../shared/index.ts";
import { pssDeclaration } from "../server/declaration.ts";
import type { PssServer } from "../server/server.ts";
import { scenarioChain, type ScenarioChain } from "./server-chain.ts";
import { entryOf, FIXTURE, type FixtureRow, ownerOf, spendRows } from "./server-dust-fixture.ts";

const LONG = 600_000;
const SECRET = "pss-dust-test-admin-secret-012345";
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const hex = (b: Uint8Array): string => Buffer.from(b).toString("hex");

/** The test chain's height each fixture row is written at: the era's first block is 2, the module joins at 5. */
function testHeight(row: FixtureRow): number {
  if (row.height <= 3_349_443) return 2;
  if (row.height <= 3_349_459) return 3;
  return 4;
}
const ERA = 2;

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
    expect(s.dust).toMatchObject({ eraHeight: ERA, height: 7, entries: 10, chunks: 1, firstCoins: 3, updates: 1, owners: 2, parameters: "initial", error: null });
    const loaded = r.logs.map((line) => JSON.parse(line) as Record<string, unknown>).find((line) => line.event === "dust-loaded");
    expect(loaded).toMatchObject({ rows: FIXTURE.length, height: 4, entries: 10 });
    expect(s.settings.dustEraHeight).toBe(ERA);
  });

  it("GET /dust/manifest and /dust/chunk/0: the file of the era's spends in chain order, each entry the event's prefix, declared time, fee and position", { timeout: LONG }, async () => {
    const answer = await fetch(`${r.origin}${ROUTES.dustManifest}`);
    expect(answer.status).toBe(200);
    const manifest = (await answer.json()) as DustManifest;
    expect(manifest).toMatchObject({ version: 1, eraHeight: ERA, height: 7, entries: 10, chunkEntries: 4096, prefixBytes: 4 });
    expect(manifest.chunks).toHaveLength(1);
    expect(manifest.chunks[0]).toMatchObject({ first: 0, count: 10, firstHeight: 2, lastHeight: 3 });

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

  it("GET /dust/parameters: the ledger's initial Dust parameters, the era having no parameter change", { timeout: LONG }, async () => {
    const answer = await fetch(`${r.origin}${ROUTES.dustParameters}`);
    expect(answer.status).toBe(200);
    expect((await answer.json()) as DustParametersAnswer).toEqual({
      nightDustRatio: "5000000000",
      generationDecayRate: "8267",
      dustGracePeriodSeconds: "10800",
      source: "initial",
      changedAt: null,
      height: 7,
    });
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
