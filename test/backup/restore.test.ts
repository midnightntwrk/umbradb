import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT } from "../../src/cli/command.js";
import type { RestoreCommandSeams } from "../../src/cli/restore.js";
import type { BlockRef } from "../../src/runner/block-source.js";
import type { ProcessingEnd } from "../../src/runner/process.js";
import { InMemoryBlockSource, inMemoryBlock } from "../../src/runner/in-memory-source.js";
import postgres from "postgres";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { type ChainBlock, hex } from "../backbone/fetch-fixtures.js";
import { type CliProject, cliProject } from "../cli/cli-fixtures.js";
import { CHAIN, chainNode, HEAD as HEAD_OF_TAPE } from "../cli/run-fixtures.js";
import { coreSettings } from "../runner/process-build.js";
import {
  BACKUP_BACKENDS,
  type BackupBackend,
  type BackupDatabase,
  catalogOf,
  hashOf,
  heightsAt,
  manifestOf,
  pathOf,
  startTicker,
  tableHeights,
  tickerModule,
  urlOf,
  writeTickerConfig,
} from "./backup-fixtures.js";
import {
  backupAt as backupAtStop,
  chain as chainOf,
  codeIn,
  emptied,
  restoreRun as run,
  restoreTarget,
} from "./restore-fixtures.js";

/**
 * A125 `[DIFF]`, A126 `[CI]` and A128 `[DIFF]` (task 15.2; BK-3, BK-4; `design.md` §9.1; owner decisions Q83, Q85),
 * with A147's backup part, on PostgreSQL 18.6 and PGlite 0.5.10, through `umbradb restore` in this process (its chain an
 * in-memory one standing in for the node, `RestoreCommandSeams.source`): a backup written on one backend restores on the
 * other with every check of BK-3 passing, and the restored database's owners and grants are a database built by
 * migrations' (compared in the catalogs); each refusal of BK-3 in its order, the target as it was after it; a backup
 * restored on either backend and continued to h + 100 equals an instance that never stopped. The ledger state root's
 * check is `./restore-ledger.test.ts`; A127 (a restore killed while loading) `./restore-kill.test.ts`; the committed
 * negative controls `./restore.negative-control.test.ts`.
 */

/** Each test waits on purpose for processes to reach heights (task 0.5's notes): its own budget, for a loaded machine. */
const TEST_TIMEOUT_MS = 900_000;

/** The backups' height, and the chain's head the restores check against. */
const H = 12n;
const HEAD = 140n;

let project: CliProject;
let dir: string;

beforeAll(async () => {
  project = await cliProject();
  project.write("ticker.ts", tickerModule(project.builders));
  project.write("ticker-1.1.ts", tickerModule(project.builders, { version: "1.1.0" }));
  project.write("ticker-changed.ts", tickerModule(project.builders, { migrationComment: "changed" }));
  dir = mkdtempSync(join(tmpdir(), "umbradb-restores-"));
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.start()));
  process.env.UMBRADB_PG_DUMP = (BACKUP_BACKENDS[0] as BackupBackend).env().UMBRADB_PG_DUMP;
}, 300_000);

afterAll(async () => {
  delete process.env.UMBRADB_PG_DUMP;
  await Promise.all(BACKUP_BACKENDS.map((backend) => backend.stop()));
  if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
  project?.remove();
}, 120_000);

let files = 0;
const output = (name: string): string => join(dir, `${name}-${++files}.backup`);

/** A backup at `height` on `backend` (`./restore-fixtures.ts`). */
const backupAt = (backend: BackupBackend, height: bigint) => backupAtStop(project, backend, height, output(`${backend.kind}-${height}`));

/** The in-memory chain up to `head` (by default {@link HEAD}), with `blocks` in place of its own. */
const chain = (head: bigint = HEAD, blocks: readonly BlockRef[] = []) => chainOf(head, blocks);

/** `umbradb restore` in this process, the chain {@link chain}'s unless given. */
const restoreRun = (file: string, config: string, seams: RestoreCommandSeams = chain()) => run(project, file, config, seams);

/** A new, empty target on `backend` and its configuration file. */
const target = (backend: BackupBackend, options: Parameters<typeof restoreTarget>[2] = {}) => restoreTarget(project, backend, options);

/** The contents hash and every per-table digest and checkpoint of `db` (BK-4's "the same digests"). */
async function stateOf(db: BackupDatabase): Promise<{ hash: string; digests: string[] }> {
  const rows = await db.query(
    `SELECT 'tables' AS t, "schema", "table", height::text, encode(digest, 'hex') AS d FROM core_digest.tables
     UNION ALL SELECT 'checkpoints', "schema", "table", height::text, encode(digest, 'hex') FROM core_digest.checkpoints
     ORDER BY 1, 2, 3, 4`,
  );
  return { hash: await hashOf(db), digests: rows.map((row) => `${row.t} ${row.schema}.${row.table} ${row.height} ${row.d}`) };
}

/**
 * How processing ended, for an assertion's message (issue 00041): its kind; for a refusal or a failure, the error's
 * name, code and message, and each cause's; then the process's log lines.
 */
function endedText(ended: ProcessingEnd, lines: readonly string[]): string {
  const parts = [`processing ended ${ended.kind}`];
  if (ended.kind === "refused" || ended.kind === "failed") {
    let error: unknown = ended.error;
    for (let depth = 0; error !== undefined && error !== null && depth < 5; depth++) {
      const { name, code, message } = error as { name?: unknown; code?: unknown; message?: unknown };
      const what = `${String(name ?? typeof error)}${code === undefined ? "" : ` (${String(code)})`}: ${String(message ?? error)}`;
      parts.push(`${depth === 0 ? "error" : "caused by"} ${what}`);
      error = (error as { cause?: unknown }).cause;
    }
  }
  parts.push(`log: ${lines.join(" | ")}`);
  return parts.join("\n");
}

/** Runs a ticker process on `db` from its cursor to the core's stop at `stop`. */
async function continueTo(db: BackupDatabase, stop: bigint): Promise<void> {
  const ticker = await startTicker(writeTickerConfig(project, { database: db.setting, stop: Number(stop) }), stop + 5n);
  try {
    const ended = await ticker.handle.ended;
    expect(ended, endedText(ended, ticker.lines)).toMatchObject({ kind: "stopped", height: stop, core: true });
  } finally {
    await ticker.handle.stop();
  }
}

const [POSTGRES, PGLITE] = BACKUP_BACKENDS as [BackupBackend, BackupBackend];

/** The ledger table of the tape's custom network (`../cli/run-fixtures.ts`): every `spec_version` is v9's. */
const LEDGER_TABLE = { rows: [{ specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v9" }] };

describe("A125: a backup written on one backend restores on the other (BK-2, BK-3)", () => {
  it(
    "A125: a backup written on PostgreSQL 18 restores on PGlite and one written on PGlite on PostgreSQL 18, every " +
      "check of BK-3 passing, the owners and grants those of a database built by migrations",
    async () => {
      for (const [from, to] of [
        [POSTGRES, PGLITE],
        [PGLITE, POSTGRES],
      ] as const) {
        const { file } = await backupAt(from, H);
        const manifest = manifestOf(file);
        const { db, config } = await target(to);
        const result = await restoreRun(file, config);
        expect(result.stderr, `${from.kind} → ${to.kind}`).toBe("");
        expect(result.code).toBe(EXIT.ok);
        // A PGlite target not created yet is created, which the command says, naming it (owner decisions Q165 B, Q167 A).
        const created = to.kind === "pglite" ? `umbradb restore: created a new PGlite data directory ${pathOf(db.setting)}\n` : "";
        expect(result.stdout).toBe(
          `${created}umbradb restore: restored ${file}: height ${H}, contents hash ${manifest.contentsHash}; the database ` +
            `resumes from ${H + 1n}\n`,
        );
        expect(await tableHeights(db)).toEqual(heightsAt(String(H)));
        expect(await hashOf(db)).toBe(manifest.contentsHash);
        // A database of the target's backend built by migrations, at the same height.
        const reference = await to.database();
        await continueTo(reference, H);
        expect(await hashOf(reference)).toBe(manifest.contentsHash);
        const catalog = await catalogOf(db);
        expect(catalog).toEqual(await catalogOf(reference));
        // The module's routine and enum are among what is compared, its role's as on the migrated database.
        expect(catalog.some((line) => line.startsWith("routine ticker.ticker.triangle(bigint) owner=umbradb_m_ticker acl=umbradb_m_ticker=X/"))).toBe(true);
        expect(catalog.some((line) => line.startsWith("type e ticker.mood owner=umbradb_m_ticker "))).toBe(true);
      }
    },
    TEST_TIMEOUT_MS,
  );
});

describe.each(BACKUP_BACKENDS)("A126: each refusal of BK-3 on $name, in its order", (backend) => {
  it(
    "A126: each restore refusal of BK-3 is triggered and checked before or after loading, as BK-3 orders them; after " +
      "every refusal the target is as it was",
    async () => {
      const { file, source } = await backupAt(backend, H);
      const manifest = manifestOf(file);
      const text = readFileSync(file, "utf8");
      const variant = (name: string, body: string): string => {
        const path = output(name);
        writeFileSync(path, body);
        return path;
      };
      const refused = async (path: string, config: string, code: string, seams?: RestoreCommandSeams) => {
        const result = await restoreRun(path, config, seams);
        expect(result.code, `${code}: ${result.stderr}`).toBe(EXIT.failed);
        // The first refusal after loading on PGlite created the target's directory, which the command says (Q165 B).
        expect(result.stdout.replace(/^umbradb restore: created a new PGlite data directory \S+\n/, "")).toBe("");
        expect(codeIn(result.stderr)).toBe(code);
        return result.stderr;
      };

      // 1. restore-target-not-empty: the backup's own database, unchanged — even with a file of another format.
      const before = { catalog: await catalogOf(source), hash: await hashOf(source), heights: await tableHeights(source) };
      const sourceConfig = writeTickerConfig(project, { database: source.setting });
      await refused(file, sourceConfig, "restore-target-not-empty");
      await refused(variant("garbage", "not a backup\n"), sourceConfig, "restore-target-not-empty");
      expect({ catalog: await catalogOf(source), hash: await hashOf(source), heights: await tableHeights(source) }).toEqual(
        before,
      );

      // Every other refusal leaves the target empty: one target for all of them.
      const { db, config } = await target(backend);
      const empty = async () => expect(await emptied(backend, db)).toBe(true);

      // 2. backup-format-unknown: no manifest, another format, a psql meta-command, a file cut short.
      await refused(variant("no-manifest", text.slice(text.indexOf("\n") + 1)), config, "backup-format-unknown");
      const format2 = text.replace('"format":1', '"format":2');
      expect((await refused(variant("format-2", format2), config, "backup-format-unknown"))).toContain("format is 2");
      const meta = text.replace("\nCREATE SCHEMA ticker;", "\n\\! touch hacked\nCREATE SCHEMA ticker;");
      expect(await refused(variant("meta", meta), config, "backup-format-unknown")).toContain("psql meta-command");
      const cut = text.slice(0, text.indexOf("INSERT INTO ticker.rows") + 40);
      expect(await refused(variant("cut", cut), config, "backup-format-unknown")).toContain("ends inside");
      await empty();
      // The whole dump is read before the chain is: a file cut short is refused before a node of another chain is.
      const otherChain = { height: 0n, hash: new Uint8Array(32).fill(6), parentHash: new Uint8Array(32) };
      await refused(variant("cut-b", cut), config, "backup-format-unknown", chain(HEAD, [otherChain]));

      // 3. backup-history-mismatch: another S; a recorded entry left out (CF-5) — before a bad format? No: after it.
      const otherStart = writeTickerConfig(project, { database: db.setting, start: 2 });
      expect(await refused(file, otherStart, "backup-history-mismatch")).toContain("a restored database keeps its S");
      const omitted = writeTickerConfig(project, { database: db.setting, entry: null });
      expect(await refused(file, omitted, "backup-history-mismatch")).toContain("missing-entry");
      await refused(variant("format-2b", format2), omitted, "backup-format-unknown");
      await empty();

      // 4. backup-build-mismatch: the revision covering h + 1 is 1.0.0 and the build carries 1.1.0 (CF-8); the build's
      // migration 001 changed (DB-9).
      const older = writeTickerConfig(project, {
        database: db.setting,
        module: "./ticker-1.1.ts",
        entry: 'versionEntry({ id: "ticker", version: "1.0.0", start: 1, config: {} })',
      });
      expect(await refused(file, older, "backup-build-mismatch")).toContain("upgrade-required");
      const changed = writeTickerConfig(project, { database: db.setting, module: "./ticker-changed.ts" });
      expect(await refused(file, changed, "backup-build-mismatch")).toContain("migration-checksum-changed");
      await empty();

      // 5. backup-genesis-mismatch: the node's block 0 is another chain's.
      const otherGenesis = { height: 0n, hash: new Uint8Array(32).fill(7), parentHash: new Uint8Array(32) };
      await refused(file, config, "backup-genesis-mismatch", chain(HEAD, [otherGenesis]));
      // 6. backup-block-not-finalized: the node's head below h; another block at h.
      await refused(file, config, "backup-block-not-finalized", chain(H - 1n));
      const otherAtH = { ...inMemoryBlock(H), hash: new Uint8Array(32).fill(8) };
      await refused(file, config, "backup-block-not-finalized", chain(HEAD, [otherAtH]));
      await empty();

      // After loading: contents-hash-mismatch for a changed value in a row the contents hash covers (DT-3) — and before
      // it, a check before loading wins (the genesis here).
      const total = (H * (H + 1n)) / 2n;
      const tallied = `INSERT INTO ticker.tally VALUES (1, ${H}, ${total});`;
      expect(text).toContain(tallied);
      const tampered = variant("tampered", text.replace(tallied, `INSERT INTO ticker.tally VALUES (1, ${H}, ${total + 1n});`));
      const mismatch = await refused(tampered, config, "contents-hash-mismatch");
      expect(mismatch).toContain(manifest.contentsHash);
      await empty();
      await refused(tampered, config, "backup-genesis-mismatch", chain(HEAD, [otherGenesis]));
      await empty();

      // A changed value in a table declared deterministic: false is no row the contents hash covers: restored.
      const logged = text.match(/^INSERT INTO ticker\.log VALUES \(3, 3, '[^']*'\);$/m)?.[0] as string;
      expect(logged).toBeDefined();
      const loggedOther = logged.replace(/'[^']*'/, "'2000-01-01 00:00:00+00'");
      const restored = await restoreRun(variant("opted-out", text.replace(logged, loggedOther)), config);
      expect(restored.code).toBe(EXIT.ok);
      expect(await hashOf(db)).toBe(manifest.contentsHash);
      // And the target is no longer empty: the next restore into it is refused, nothing changed.
      await refused(file, config, "restore-target-not-empty");
    },
    TEST_TIMEOUT_MS,
  );
});

describe("umbradb restore against the configuration's node", () => {
  it(
    "restores a backup of a chain a node serves, checking it against that node through the node source",
    async () => {
      const genesis = { genesisHash: hex((CHAIN[0] as ChainBlock).hash), ledgerTable: LEDGER_TABLE };
      const node = await chainNode();
      const source = await PGLITE.database();
      const file = output("node");
      try {
        const settings = { ...genesis, node: node.url, backupAtStop: file };
        const config = writeTickerConfig(project, { database: source.setting, stop: Number(HEAD_OF_TAPE), extra: settings });
        const ticker = await startTicker(config, 0n, nodeSourceOf);
        try {
          expect(await ticker.handle.ended).toMatchObject({ kind: "stopped", height: HEAD_OF_TAPE, core: true });
        } finally {
          await ticker.handle.stop();
        }
      } finally {
        await node.close();
      }
      // A node of its own for each restore: the same chain, its tape answered from its start.
      const restoreNode = await chainNode();
      try {
        const { db, config } = await target(PGLITE, { extra: { ...genesis, node: restoreNode.url } });
        const result = await restoreRun(file, config, {});
        expect(result.stderr).toBe("");
        expect(result.code).toBe(EXIT.ok);
        expect(await hashOf(db)).toBe(manifestOf(file).contentsHash);
      } finally {
        await restoreNode.close();
      }
      // A manifest naming another block at its height: the node's finalized block there is refused.
      const thirdNode = await chainNode();
      try {
        const other = await target(PGLITE, { extra: { ...genesis, node: thirdNode.url } });
        const tampered = output("node-tampered");
        writeFileSync(tampered, readFileSync(file, "utf8").replace(manifestOf(file).blockHash.slice(2), "ab".repeat(32)));
        const refused = await restoreRun(tampered, other.config, {});
        expect(codeIn(refused.stderr)).toBe("backup-block-not-finalized");
      } finally {
        await thirdNode.close();
      }
    },
    TEST_TIMEOUT_MS,
  );
});

describe("the restore's statements", () => {
  it("counts each statement it ran; the negative controls' restore commits them one by one, checking nothing after", async () => {
    const { file } = await backupAt(PGLITE, H);
    const counted: number[] = [];
    const { db, config } = await target(PGLITE);
    const result = await restoreRun(file, config, { ...chain(), restore: { statementRan: (count) => void counted.push(count) } });
    expect(result.code).toBe(EXIT.ok);
    expect(counted.length).toBeGreaterThan(50);
    expect(counted).toEqual(counted.map((_, index) => index + 1));
    const one = await target(PGLITE);
    const seen: number[] = [];
    const byOne = await restoreRun(file, one.config, {
      ...chain(),
      restore: { statementByStatement: true, statementRan: (count) => void seen.push(count) },
    });
    expect(byOne.code).toBe(EXIT.ok);
    expect(seen).toEqual(counted);
    expect(await hashOf(one.db)).toBe(await hashOf(db));
  }, TEST_TIMEOUT_MS);
});

describe("the restore's own transaction", () => {
  it("checks the target empty again in its transaction: a schema made after the first check refuses the restore", async () => {
    const { file } = await backupAt(POSTGRES, H);
    const { db, config } = await target(POSTGRES);
    // The chain's head is read after the first check and before the transaction: an intruder writes the target then.
    const intruding: RestoreCommandSeams = {
      source: () => {
        const inner = new InMemoryBlockSource({ head: HEAD });
        // A wrapper passes the inner source's members through, its optional ones included.
        return {
          cursor: (read) => inner.cursor(read),
          waitForHead: (above, signal) => inner.waitForHead(above, signal),
          block: (height) => inner.block(height),
          blockItems: (block: BlockRef) => inner.blockItems(block),
          blockEvents: (block: BlockRef) => inner.blockEvents(block),
          async finalizedHead() {
            const admin = postgres(urlOf(db.setting), { max: 1, onnotice: () => undefined });
            try {
              await admin.unsafe("CREATE SCHEMA intruder");
            } finally {
              await admin.end({ timeout: 5 });
            }
            return inner.finalizedHead();
          },
        };
      },
    };
    const result = await restoreRun(file, config, intruding);
    expect(codeIn(result.stderr)).toBe("restore-target-not-empty");
    const schemas = await db.query("SELECT nspname FROM pg_namespace WHERE nspname NOT LIKE 'pg\\_%' AND nspname NOT IN ('public', 'information_schema') ORDER BY 1");
    expect(schemas).toEqual([{ nspname: "intruder" }]);
  }, TEST_TIMEOUT_MS);

  it("resets what the file's SQL set before it hashes: a dump that changes how dates print still restores", async () => {
    const { file } = await backupAt(PGLITE, H);
    const text = readFileSync(file, "utf8");
    const changed = output("datestyle");
    writeFileSync(changed, text.replace("SET row_security = off;", "SET row_security = off;\nSET DateStyle = 'SQL, DMY';"));
    expect(readFileSync(changed, "utf8")).toContain("SET DateStyle = 'SQL, DMY';");
    for (const backend of BACKUP_BACKENDS) {
      const { db, config } = await target(backend);
      const result = await restoreRun(changed, config);
      expect(result.stderr, backend.name).toBe("");
      expect(result.code).toBe(EXIT.ok);
      expect(await hashOf(db)).toBe(manifestOf(file).contentsHash);
    }
  }, TEST_TIMEOUT_MS);
});

describe("a refusal of the configuration's history that is no backup's", () => {
  it("passes on the history check's other refusals as they are: a future revision's sweep off without the opt-in", async () => {
    const { file } = await backupAt(POSTGRES, H);
    const { db } = await target(POSTGRES);
    const settings = (extra: Record<string, unknown>) =>
      JSON.stringify(coreSettings(db.setting, { listen: { admin: "127.0.0.1:0" }, developmentOptIn: false, ...extra }));
    const config = project.write(
      "sweep-off.config.ts",
      [
        `import { coreEntry, defineConfig } from ${JSON.stringify(project.builders)};`,
        'import { ticker } from "./ticker.ts";',
        "export const modules = [ticker];",
        "export default defineConfig({ entries: [",
        `  coreEntry({ start: 1, config: ${settings({})} }),`,
        `  coreEntry({ start: 30, config: ${settings({ sweep: "off" })} }),`,
        "  ticker.entry({ start: 1, config: {} }),",
        "] });",
        "",
      ].join("\n"),
    );
    const result = await restoreRun(file, config);
    expect(codeIn(result.stderr)).toBe("development-opt-in-required");
    expect(await emptied(POSTGRES, db)).toBe(true);
  }, TEST_TIMEOUT_MS);
});

describe("A128: a restored database continues like one that never stopped (BK-4)", () => {
  it(
    "A128: a backup written on PostgreSQL 18 at h, restored on PGlite and on PostgreSQL 18 (and one written on PGlite, " +
      "on PostgreSQL 18), continued to h + 100, gives the contents hash and the per-table digests of an instance that " +
      "never stopped [[backup.restore-equals-uninterrupted]]",
    async () => {
      const h = 20n;
      const end = h + 100n;
      const uninterrupted = await POSTGRES.database();
      await continueTo(uninterrupted, end);
      const expected = await stateOf(uninterrupted);
      expect(expected.digests.some((line) => line.startsWith("tables ticker.rows 120 "))).toBe(true);
      const fromPostgres = await backupAt(POSTGRES, h);
      const fromPglite = await backupAt(PGLITE, h);
      for (const [name, backup, to] of [
        ["PostgreSQL → PGlite", fromPostgres, PGLITE],
        ["PostgreSQL → PostgreSQL", fromPostgres, POSTGRES],
        ["PGlite → PostgreSQL", fromPglite, POSTGRES],
      ] as const) {
        const { db, config } = await target(to);
        const result = await restoreRun(backup.file, config);
        expect(result.code, `${name}: ${result.stderr}`).toBe(EXIT.ok);
        await continueTo(db, end);
        expect(await stateOf(db), name).toEqual(expected);
        // It kept the backup's S and resumed from h + 1: every height once, from 1.
        const [blocks] = await db.query("SELECT min(height)::text AS lo, max(height)::text AS hi, count(*)::text AS n FROM core_block_commit.blocks");
        expect(blocks, name).toEqual({ lo: "1", hi: String(end), n: String(end) });
        // A147's backup part: the next serial value of the table declared deterministic: false follows the restored ones.
        const [log] = await db.query("SELECT count(*)::text AS n, count(DISTINCT id)::text AS ids, min(id)::text AS lo, max(id)::text AS hi FROM ticker.log");
        expect(log, name).toEqual({ n: String(end), ids: String(end), lo: "1", hi: String(end) });
      }
    },
    TEST_TIMEOUT_MS,
  );
});
