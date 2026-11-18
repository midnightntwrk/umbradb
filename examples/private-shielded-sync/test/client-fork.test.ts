/**
 * The client and the cross-check across a ledger 8 → 9 upgrade (spec FR-140 for Preprod's history, decision Q43): the
 * module in UmbraDB's real process on PostgreSQL 18 over `./client-fork-chain.ts` (ledger 8 to height 3, ledger 9 from
 * 4), a snapshot at 5 and the tail to 7. Coins made and spent under ledger 8, a ledger 8 coin spent under ledger 9:
 * the client's result equals the ledger's own replay, which reads ledger 8 events with the ledger 8 package and carries
 * the local state into ledger 9.
 */

import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { RAW } from "../../../test/ledger/adapter-fixtures.js";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { BlobCache } from "../client/cache.ts";
import { compareWithClient, readZswapEvents, replayZswapEvents } from "../client/cross-check.ts";
import { PssHttp } from "../client/http.ts";
import { walletKeys } from "../client/keys.ts";
import type { Ledger, LedgerV8 } from "../client/ledger.ts";
import { sync, type SyncResult } from "../client/sync.ts";
import { compileKernel, Kernel, ScanPool } from "../kernel/index.ts";
import { inlineMultiplier } from "../pir/index.ts";
import { ADMIN_SECRET, buildAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ForkChain, forkChain } from "./client-fork-chain.ts";

const LONG = 600_000;
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;
const v9 = RAW.v9 as unknown as Ledger;
const v8 = RAW.v8 as unknown as LedgerV8;

let chain: ForkChain;
let db: ProcessDatabase;
let r: ModuleRun;
let kernel: Kernel;
let scanPool: ScanPool;
let dir: string;
const results: Partial<Record<"A" | "B", SyncResult>> = {};

beforeAll(async () => {
  chain = await forkChain();
  kernel = new Kernel(compileKernel());
  scanPool = new ScanPool({ threads: 2 });
  dir = mkdtempSync(join(tmpdir(), "pss-fork-"));
  await backend.start();
  db = await backend.database();
  r = await startModule(chain, db, {
    stop: 7,
    config: { dataDir: join(dir, "server"), pathSplit: 1, queriesPerCall: 8, snapshotEvery: 0, adminSecret: ADMIN_SECRET, threads: 1 },
  });
  await stoppedAt(r, 7);
  await buildAt(r, 5);
  for (const name of ["A", "B"] as const) {
    results[name] = await sync({
      ledger: v9,
      keys: walletKeys(chain.wallets[name].keys9, kernel),
      http: new PssHttp(r.origin),
      cache: new BlobCache(mkdtempSync(join(dir, "cache-"))),
      kernel,
      scanPool,
      multiplier: inlineMultiplier,
    });
  }
}, LONG);

afterAll(async () => {
  await r?.close();
  await scanPool?.close();
  await backend.stop();
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
}, LONG);

describe("across the ledger 8 → 9 upgrade", () => {
  it("the stored events are ledger 8 events below F and ledger 9 events from F; the ledger 9 package cannot read the former", async () => {
    const rows = await readZswapEvents((q) => db.query(q), 7);
    expect([...new Set(rows.map((row) => `${row.height < 4 ? "<F" : "≥F"} ${row.ledger}`))].sort()).toEqual(["<F v8", "≥F v9"]);
    const old = rows.find((row) => row.ledger === "v8")!;
    expect(() => RAW.v9.Event.deserialize(old.bytes)).toThrow();
    expect(() => RAW.v8.Event.deserialize(old.bytes)).not.toThrow();
  });

  it("FR-140 + SC-001: each wallet's coins and spends (made and spent under ledger 8, a ledger 8 coin spent under ledger 9) equal the ledger's own replay, with zero differences", async () => {
    const rows = await readZswapEvents((q) => db.query(q), 7);
    for (const name of ["A", "B"] as const) {
      const state = results[name]!.state;
      const replay = replayZswapEvents({ v9, v8 }, chain.wallets[name].seed, rows, 7);
      const report = compareWithClient(replay, state, rows);
      expect(report.differences, name).toEqual([]);
      expect(report.equal).toBe(true);
      expect(report.balances.client).toEqual(report.balances.ledger);
    }
    const a = results.A!.state;
    expect(a.coins.map((c) => c.value).sort()).toEqual(["10", "20", "30", "40", "5", "50", "6"]);
    const at = (value: string) => a.coins.find((c) => c.value === value)!;
    expect([at("10").spent?.height, at("10").spent?.source]).toEqual([3, "snapshot"]);
    expect([at("20").spent?.height, at("20").spent?.source]).toEqual([6, "tail"]);
    expect([at("50").source, at("5").source]).toEqual(["tail", "tail"]);
    expect(results.B!.state.coins.map((c) => c.value).sort()).toEqual(["15", "4", "5", "7"]);
  });

  it("the client's unspent coins equal each wallet's own local state, carried from ledger 8 to 9", () => {
    for (const name of ["A", "B"] as const) {
      const local = [...chain.wallets[name].local.coins].map((c: { mt_index: bigint; value: bigint }) => [Number(c.mt_index), c.value.toString()]).sort((x, y) => Number(x[0]) - Number(y[0]));
      expect(results[name]!.state.coins.filter((c) => c.spent === null).map((c) => [c.position, c.value])).toEqual(local);
    }
  });
});
