/**
 * The command line (`client/main.ts`) as a separate process, with the client's install (`@midnightntwrk/ledger-v9`
 * 1.0.1 and `ledger-v8` 8.1.3 from `client/node_modules`; skipped without it): `sync`, `balance`, `address`,
 * `cross-check` and `dust` against the module in UmbraDB's real process and its PostgreSQL 18 database, over the
 * synthetic chain.
 */

import { execFile } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { promisify } from "node:util";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { PROCESS_BACKENDS, type ProcessDatabase } from "../../../test/runner/process-backends.js";
import { formatShieldedAddress } from "../client/address.ts";
import type { WalletState } from "../client/state.ts";
import { ADMIN_SECRET, builtAt, type ModuleRun, startModule, stoppedAt } from "./client-harness.ts";
import { type ScenarioChain, scenarioChain } from "./server-chain.ts";

const LONG = 600_000;
const run = promisify(execFile);
const MAIN = fileURLToPath(new URL("../client/main.ts", import.meta.url));
const installed = existsSync(new URL("../client/node_modules/@midnightntwrk/ledger-v9/package.json", import.meta.url));
const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "postgres")!;

let chain: ScenarioChain;
let db: ProcessDatabase;
let r: ModuleRun;
let dir: string;
let seedFile: string;

async function cli(args: readonly string[]): Promise<{ stdout: string; stderr: string; code: number }> {
  try {
    const { stdout, stderr } = await run(process.execPath, [MAIN, ...args], { env: { PATH: process.env.PATH ?? "" }, maxBuffer: 64 * 1024 * 1024 });
    return { stdout, stderr, code: 0 };
  } catch (e) {
    const err = e as { stdout: string; stderr: string; code: number };
    return { stdout: err.stdout, stderr: err.stderr, code: err.code };
  }
}

describe.skipIf(!installed)("the command line (with the client's install)", () => {
  beforeAll(async () => {
    chain = await scenarioChain();
    dir = mkdtempSync(join(tmpdir(), "pss-cli-"));
    seedFile = join(dir, "a.seed");
    writeFileSync(seedFile, Buffer.alloc(32, 0xa1).toString("hex"), { mode: 0o600 });
    await backend.start();
    db = await backend.database();
    r = await startModule(chain, db, {
      stop: 7,
      config: { dataDir: join(dir, "server"), pathSplit: 2, queriesPerCall: 8, snapshotEvery: 4, adminSecret: ADMIN_SECRET, threads: 1 },
    });
    await stoppedAt(r, 7);
    await builtAt(r, 4);
  }, LONG);

  afterAll(async () => {
    await r?.close();
    await backend.stop();
    if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  }, LONG);

  it("sync writes the local state and prints the balance; balance reads it back without the network; address prints the wallet's shielded address", { timeout: LONG }, async () => {
    const common = ["--zswap-seed-file", seedFile, "--data", join(dir, "data"), "--threads", "2"];
    const synced = await cli(["sync", ...common, "--server", r.origin, "--stats", join(dir, "stats.json")]);
    expect(synced.code, synced.stderr).toBe(0);
    expect(synced.stdout).toContain("unspent coins (7)");
    // FR-006: the seed is in no output or log line.
    expect(`${synced.stdout}${synced.stderr}`).not.toContain(Buffer.alloc(32, 0xa1).toString("hex").slice(0, 16));
    const state = JSON.parse(readFileSync(join(dir, "data", "wallets", "seed-a.seed", "state.json"), "utf8")) as WalletState;
    expect(state.coins).toHaveLength(9);
    const stats = JSON.parse(readFileSync(join(dir, "stats.json"), "utf8")) as Record<string, any>;
    expect(stats.read.calls).toBe(1);
    expect(stats.requests).toHaveLength(8);
    const balance = await cli(["balance", ...common, "--json"]);
    expect(balance.code, balance.stderr).toBe(0);
    expect(JSON.parse(balance.stdout).unspent).toHaveLength(7);
    const address = await cli(["address", ...common, "--network", "preprod"]);
    expect(address.stdout.trim()).toBe(
      formatShieldedAddress({ coinPublicKey: chain.wallets.A.keys.coinPublicKey, encryptionPublicKey: chain.wallets.A.keys.encryptionPublicKey }, "preprod"),
    );
  });

  it("cross-check replays the database's stored events with the ledger packages and finds no difference (exit 0); a changed local state is found out (exit 1)", { timeout: LONG }, async () => {
    const s = db.setting as { host: string; port: number; user: string; name: string; password?: string };
    const passwordFile = join(dir, "pg-password");
    writeFileSync(passwordFile, s.password ?? "", { mode: 0o600 });
    const args = ["cross-check", "--zswap-seed-file", seedFile, "--data", join(dir, "data"), "--db-url", `postgres://${s.user}@${s.host}:${s.port}/${s.name}`, "--db-password-file", passwordFile];
    const ok = await cli(args);
    expect(ok.code, ok.stderr).toBe(0);
    const report = JSON.parse(ok.stdout) as Record<string, any>;
    expect(report).toMatchObject({ upto: 7, equal: true, differences: [], ledger: { received: 9, spent: 2, unspent: 7 }, client: { coins: 9, spent: 2, unspent: 7 } });
    // Negative control: one coin dropped from the local state.
    const path = join(dir, "data", "wallets", "seed-a.seed", "state.json");
    const state = JSON.parse(readFileSync(path, "utf8")) as WalletState;
    writeFileSync(path, JSON.stringify({ ...state, coins: state.coins.slice(1) }));
    const bad = await cli(args);
    expect(bad.code).toBe(1);
    expect((JSON.parse(bad.stdout) as Record<string, any>).differences).toEqual([expect.objectContaining({ what: "only-ledger", position: state.coins[0]!.position })]);
  });

  it("dust (spec 00062): downloads the Dust file, coins and parameters and walks the wallet's chains (none on this chain, which has no Dust events); refuses a wallet without a mnemonic", { timeout: LONG }, async () => {
    // BIP-39's public test vector, not a wallet anyone holds.
    const mnemonic = `${"abandon ".repeat(23)}art`;
    const { stdout, stderr } = await run(process.execPath, [MAIN, "dust", "--mnemonic-env", "PSS_TEST_MNEMONIC", "--server", r.origin, "--json"], {
      env: { PATH: process.env.PATH ?? "", PSS_TEST_MNEMONIC: mnemonic },
    });
    const report = JSON.parse(stdout) as Record<string, any>;
    expect(report.file).toMatchObject({ eraHeight: 3_348_434, height: 7, entries: 0, chunks: 0, chunkEntries: 4096, prefixBytes: 4 });
    expect(report.parameters).toMatchObject({ nightDustRatio: "5000000000", generationDecayRate: "8267", dustGracePeriodSeconds: "10800", source: "initial" });
    expect([report.firstCoins, report.chains, report.bytes.requests, report.bytes.up]).toEqual([0, [], 3, 0]);
    expect(`${stdout}${stderr}`).not.toContain("abandon");
    const text = await cli(["dust", "--zswap-seed-file", seedFile, "--server", r.origin]);
    expect(text.code).toBe(1);
    expect(text.stderr).toContain("dust needs the wallet's mnemonic");
  });

  it("refuses a wallet it cannot name, and a missing mnemonic variable, without printing anything secret", async () => {
    const none = await cli(["sync", "--data", join(dir, "data")]);
    expect(none.code).toBe(1);
    expect(none.stderr).toContain("name the wallet");
    const missing = await cli(["sync", "--wallet", "Z", "--data", join(dir, "data"), "--server", r.origin]);
    expect(missing.code).toBe(1);
    expect(missing.stderr).toContain("PSS_MNEMONIC_Z is not set");
  });
});
