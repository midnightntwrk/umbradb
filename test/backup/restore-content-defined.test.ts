import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { cursorHeight } from "../../src/backbone/core-block-commit/sql.js";
import { writeBackup } from "../../src/backup/backup.js";
import { isEmptyDatabase } from "../../src/backup/restore.js";
import { declaredOptOuts } from "../../src/cli/configured.js";
import type { Database } from "../../src/db/api.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { contentsHashOf } from "../../src/library/contents-hash.js";
import { declaredContentDefined } from "../../src/modules/adapters.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { committed, ingest, watched, watcher } from "../backbone/ingest-harness.js";
import { LEDGER_CORE } from "../backbone/ledger-restart.js";
import { childKey, type Child, decodeChildren, encodeChildren, hex } from "../ledger/node-format.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { entryOf } from "../runner/process-build.js";
import { BACKUP_BACKENDS, type BackupBackend, type BackupDatabase, connectionOf, pathOf } from "./backup-fixtures.js";
import { type LedgerBackup, ledgerBackup, ledgerChain, type RestoreBuild, restoreLedger } from "./restore-ledger.js";

/**
 * `core-ledger-state`'s content-defined node tables in a backup and a restore, on PostgreSQL 18.6 and PGlite 0.5.10,
 * with the build's own ledger core, whose `core-ledger-state` declares them content-defined and writes the counts and
 * the queue each block's reclamation step gives: the ledger chain of `./restore-ledger.ts`, synced from genesis by the
 * process and backed up by it (`ProcessHandle.backup`), then restored with `restoreBackup` and that build.
 *
 * - The process's backup takes the node tables by their content: its manifest's contents hash is the build's, not the
 *   bytes'.
 * - A changed byte in a `core_ledger_state.nodes` row of the file (its payload, its child list), or its child
 *   list's length in more bytes than it needs (the ledger refuses it), refuses with
 *   `ledger-refcount-invalid`; a node respelled with consistent counts and queue (a small child its stored child list
 *   embeds, referenced and stored as its own row instead) passes the contents-hash step, and the restore goes on to
 *   its state root's check and commits; a changed value in a row the hash covers byte by byte (`root_counts`) still
 *   gives `contents-hash-mismatch`; after every refusal the target is empty.
 * - `ref_counts` or `unreferenced` that differ from what the rows give fail with `ledger-refcount-invalid`
 *   (reason `tables-inconsistent`) in a restore (rolled back, the target empty), in a backup (`writeBackup` as
 *   `umbradb backup` calls it, and the process's own: nothing written) and through the exported `contentsHash`'s code,
 *   as does a changed byte of a `nodes` row.
 */

const TEST_TIMEOUT_MS = 900_000;

/** The build's core modules: the ledger's own. */
const BUILD_CORE: readonly ModuleDeclaration[] = LEDGER_CORE;

/** The restore's build: {@link BUILD_CORE}, each enabled from 0. */
const RESTORE_BUILD: RestoreBuild = { core: BUILD_CORE, entry: (module) => entryOf(module, 0) };

/** The declarations of the build, as the process and the restore run them. */
const DECLARATIONS = validateDeclarations(chainDeclarations([watcher(watched())], { core: BUILD_CORE }));
const ALL = [...DECLARATIONS.backbone, ...DECLARATIONS.core, ...DECLARATIONS.user];

/** The contents hash as the exported function computes it for the build. */
const buildHash = contentsHashOf(ALL);

const NODES_INSERT = /^INSERT INTO core_ledger_state\.nodes VALUES \('\\x([0-9a-f]{64})', '\\x([0-9a-f]*)', '\\x([0-9a-f]*)'\);$/gm;
const REF_COUNTS_INSERT = /^INSERT INTO core_ledger_state\.ref_counts VALUES \('\\x([0-9a-f]{64})', (\d+)\);$/gm;
const ROOT_COUNTS_INSERT = /^INSERT INTO core_ledger_state\.root_counts VALUES \('\\x([0-9a-f]{64})', (\d+)\);$/gm;

/** A node row of the file: its line, key, payload and child list in hex. */
interface FileRow {
  readonly line: string;
  readonly key: string;
  readonly data: string;
  readonly children: string;
}

const bytesOf = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));
const nodeLine = (key: string, data: string, children: string): string =>
  `INSERT INTO core_ledger_state.nodes VALUES ('\\x${key}', '\\x${data}', '\\x${children}');`;

/** The `nodes` rows of a backup's text. */
function fileRows(text: string): FileRow[] {
  return [...text.matchAll(NODES_INSERT)].map(([line, key, data, children]) => ({
    line: line as string,
    key: key as string,
    data: data as string,
    children: children as string,
  }));
}

/** `text` (hex) with the hex digit at `at` changed, so one byte of the value differs. */
function oneByteChanged(text: string, at: number): string {
  const digit = Number.parseInt(text[at] as string, 16) ^ 0x1;
  return `${text.slice(0, at)}${digit.toString(16)}${text.slice(at + 1)}`;
}

/**
 * `text` with one node respelled (see the module comment): the first row whose child list embeds, at its top level, a
 * child that is no row of its own gets that child referenced instead; the child's row is added after it, and its
 * reference count (1: no stored list referenced it) after the first count. Its own references are now counted
 * through its row instead of its parent's, so no other count changes, and it is referenced, so the queue does not
 * change. Returns the text and the parent's key.
 */
function respelled(text: string): { readonly text: string; readonly parent: string; readonly child: string } {
  const rows = fileRows(text);
  const stored = new Set(rows.map((row) => row.key));
  for (const row of rows) {
    const children = decodeChildren(bytesOf(row.children));
    const at = children.findIndex((child) => "direct" in child && !stored.has(hex(childKey(child))));
    if (at < 0) continue;
    const embedded = children[at] as Extract<Child, { direct: unknown }>;
    const key = hex(childKey(embedded));
    const list = children.map((child, index): Child => (index === at ? { ref: bytesOf(key) } : child));
    const childRow = nodeLine(key, hex(embedded.direct.data), hex(encodeChildren(embedded.direct.children)));
    const parentLine = nodeLine(row.key, row.data, hex(encodeChildren(list)));
    const firstCount = [...text.matchAll(REF_COUNTS_INSERT)][0]?.[0];
    if (firstCount === undefined) throw new Error("the backup holds no reference count to add one after");
    const out = text
      .replace(row.line, `${parentLine}\n${childRow}`)
      .replace(firstCount, `${firstCount}\nINSERT INTO core_ledger_state.ref_counts VALUES ('\\x${key}', 1);`);
    return { text: out, parent: row.key, child: key };
  }
  throw new Error("no stored row embeds a child that is no row of its own");
}

describe.each(BACKUP_BACKENDS)("content-defined node tables in a backup and a restore on $name", (backend: BackupBackend) => {
  let dir: string;

  beforeAll(async () => {
    await backend.start();
    if (backend.kind === "postgres") process.env.UMBRADB_PG_DUMP = backend.env().UMBRADB_PG_DUMP;
    dir = mkdtempSync(join(tmpdir(), "umbradb-content-defined-"));
  }, 300_000);

  afterAll(async () => {
    delete process.env.UMBRADB_PG_DUMP;
    if (dir !== undefined) rmSync(dir, { recursive: true, force: true });
    await backend.stop();
  }, 120_000);

  let files = 0;
  /** `backup` with its file's text replaced by `text`. */
  const variant = (backup: LedgerBackup, text: string): LedgerBackup => {
    const file = join(dir, `variant-${++files}.backup`);
    writeFileSync(file, text);
    return { ...backup, file };
  };

  /** What restoring `backup` into a new target gives, and whether the target is empty after a refusal. */
  async function restoreInto(backup: LedgerBackup): Promise<{ readonly outcome: unknown; readonly target: BackupDatabase }> {
    const target = await backend.database();
    const outcome = await restoreLedger(backend, target, backup, backup.scenario.records, {}, undefined, RESTORE_BUILD).then(
      (restored) => restored,
      (error: unknown) => error,
    );
    return { outcome, target };
  }

  /** True when `target` holds nothing (a PGlite directory never created is empty). */
  async function empty(target: BackupDatabase): Promise<boolean> {
    if (backend.kind === "pglite" && !existsSync(join(pathOf(target.setting), "PG_VERSION"))) return true;
    return target.read((read) => isEmptyDatabase(read), async () => null);
  }

  /** Opens `db` through the database API. */
  async function opened(db: BackupDatabase): Promise<Database> {
    return backend.kind === "postgres"
      ? openPostgres({ connection: connectionOf(db.setting), committedHeight: cursorHeight })
      : openPglite({ dataDir: pathOf(db.setting), committedHeight: cursorHeight, developmentOptIn: true });
  }

  /** Runs `sql` on `db` in one transaction. */
  async function change(db: BackupDatabase, sql: string): Promise<void> {
    const handle = await opened(db);
    try {
      await handle.transaction((tx) => tx.execute(sql));
    } finally {
      await handle.close();
    }
  }

  /** What `writeBackup` gives for `db` as `umbradb backup` calls it with the build's declarations, and the file left. */
  async function backupOf(db: BackupDatabase): Promise<{ readonly outcome: unknown; readonly written: boolean }> {
    const out = join(dir, `backup-${++files}.backup`);
    const handle = await opened(db);
    try {
      const outcome = await writeBackup({
        db: handle,
        target: backend.kind === "postgres" ? { backend: "postgres", connection: connectionOf(db.setting) } : { backend: "pglite" },
        out,
        optedOut: declaredOptOuts(DECLARATIONS),
        contentDefined: declaredContentDefined(ALL),
        side: "public",
        developmentOptIn: true,
        env: backend.env(),
      }).then(
        (written) => written,
        (error: unknown) => error,
      );
      return { outcome, written: existsSync(out) };
    } finally {
      await handle.close();
    }
  }

  /** `ledger-refcount-invalid` with reason `tables-inconsistent`, naming `check` and `key`. */
  const inconsistent = (check: string, key: string) =>
    expect.objectContaining({ code: "ledger-refcount-invalid", details: { reason: "tables-inconsistent", check, key: `0x${key}` } });

  it(
    "the process's backup takes the node tables by content; a changed byte in a nodes row refuses with " +
      "ledger-refcount-invalid, counts or a queue its rows do not give too; a node respelled with consistent counts " +
      "and queue passes the contents-hash step; after every refusal the target is empty, and a backup is not written",
    async () => {
      const scenario = await ledgerChain();
      const db = await backend.database();
      const backup = await ledgerBackup(db, scenario, { core: BUILD_CORE });
      const text = readFileSync(backup.file, "utf8");
      const rows = fileRows(text);
      expect(rows.length).toBeGreaterThan(10);
      expect([...text.matchAll(REF_COUNTS_INSERT)].length).toBeGreaterThan(0);

      // The process's backup: its manifest's hash is the build's, which takes the node tables by their content.
      const byContent = `0x${hex(await db.read((read) => buildHash(read, { optedOut: declaredOptOuts(DECLARATIONS) })))}`;
      const byBytes = `0x${hex(await db.read((read) => contentsHash(read, { optedOut: declaredOptOuts(DECLARATIONS) })))}`;
      expect(backup.manifest.contentsHash).toBe(byContent);
      expect(byBytes).not.toBe(byContent);

      // The file as written restores.
      const unchanged = await restoreInto(backup);
      expect(unchanged.outcome).toMatchObject({ manifest: { contentsHash: byContent } });

      // A node respelled with consistent counts and queue passes the contents-hash step; the restore goes on to
      // the state root's check and commits, holding the new spelling.
      const respelling = respelled(text);
      const same = await restoreInto(variant(backup, respelling.text));
      expect(same.outcome).toMatchObject({ manifest: { contentsHash: byContent, stateRoot: backup.manifest.stateRoot } });
      const [restoredChild] = await same.target.query(
        `SELECT count(*)::int AS n FROM core_ledger_state.nodes WHERE node_key = '\\x${respelling.child}'`,
      );
      expect(restoredChild?.n).toBe(1);
      const [originalChild] = await db.query(`SELECT count(*)::int AS n FROM core_ledger_state.nodes WHERE node_key = '\\x${respelling.child}'`);
      expect(originalChild?.n).toBe(0);

      // A changed byte in a nodes row, its payload or its child list: ledger-refcount-invalid, the target empty.
      const parent = rows.find((row) => row.data.length > 0 && row.children.length > 2) as FileRow;
      const payload = variant(backup, text.replace(parent.line, nodeLine(parent.key, oneByteChanged(parent.data, 0), parent.children)));
      const list = variant(backup, text.replace(parent.line, nodeLine(parent.key, parent.data, oneByteChanged(parent.children, parent.children.length - 1))));
      for (const [what, file] of [
        ["a payload byte", payload],
        ["a child list byte", list],
      ] as const) {
        const refused = await restoreInto(file);
        expect(refused.outcome, what).toEqual(inconsistent("node-key", parent.key));
        expect(await empty(refused.target), what).toBe(true);
      }

      // A row's child list with its number of children in more bytes than it needs, which the ledger
      // refuses ("non-canonical scale encoding"), its key, payload, counts and queue unchanged: the same children, so
      // the same key and node set, yet ledger-refcount-invalid, the target empty.
      // The row: a leaf (its list `00`, as `01 00` and `02 00 00 00`), else the first whose number is in one byte.
      const oneByte = (row: FileRow): boolean => (Number.parseInt(row.children.slice(0, 2), 16) & 0b11) === 0;
      const widened = (rows.find((row) => row.children === "00") ?? rows.find(oneByte)) as FileRow;
      expect(widened).toBeDefined();
      const first = Number.parseInt(widened.children.slice(0, 2), 16);
      for (const [what, spelled] of [
        ["the number of children in 2 bytes", hex(Uint8Array.of(first | 0b01, 0))],
        ["the number of children in 4 bytes", hex(Uint8Array.of(first | 0b10, 0, 0, 0))],
      ] as const) {
        const line = nodeLine(widened.key, widened.data, `${spelled}${widened.children.slice(2)}`);
        const refused = await restoreInto(variant(backup, text.replace(widened.line, line)));
        expect(refused.outcome, what).toEqual(inconsistent("node-key", widened.key));
        expect(await empty(refused.target), what).toBe(true);
      }

      // Counts or a queue the rows do not give, in a restore: rolled back, the target empty.
      const [countLine, countKey, count] = [...text.matchAll(REF_COUNTS_INSERT)][0] as unknown as [string, string, string];
      const counted = variant(backup, text.replace(countLine, `INSERT INTO core_ledger_state.ref_counts VALUES ('\\x${countKey}', ${Number(count) + 1});`));
      const queued = variant(backup, text.replace(countLine, `${countLine}\nINSERT INTO core_ledger_state.unreferenced VALUES ('\\x${countKey}');`));
      for (const [what, file, check] of [
        ["a count changed", counted, "counts"],
        ["a referenced row queued", queued, "queue"],
      ] as const) {
        const refused = await restoreInto(file);
        expect(refused.outcome, what).toEqual(inconsistent(check, countKey));
        expect(await empty(refused.target), what).toBe(true);
      }

      // A changed value in a row the hash covers byte by byte still gives contents-hash-mismatch.
      const [rootLine, rootKey, rootCount] = [...text.matchAll(ROOT_COUNTS_INSERT)][0] as unknown as [string, string, string];
      const rooted = variant(backup, text.replace(rootLine, `INSERT INTO core_ledger_state.root_counts VALUES ('\\x${rootKey}', ${Number(rootCount) + 1});`));
      const mismatch = await restoreInto(rooted);
      expect(mismatch.outcome).toMatchObject({ code: "contents-hash-mismatch" });
      expect(await empty(mismatch.target)).toBe(true);

      // In a backup (nothing written) and through the exported contentsHash's code, on the database itself.
      const written = await backupOf(db);
      expect(written.outcome).toMatchObject({ manifest: { contentsHash: byContent } });
      expect(written.written).toBe(true);
      const tampers: readonly (readonly [string, string, string, string, string])[] = [
        [
          "a count changed",
          `UPDATE core_ledger_state.ref_counts SET count = count + 1 WHERE node_key = '\\x${countKey}'`,
          `UPDATE core_ledger_state.ref_counts SET count = count - 1 WHERE node_key = '\\x${countKey}'`,
          "counts",
          countKey,
        ],
        [
          "a payload byte",
          `UPDATE core_ledger_state.nodes SET data = set_byte(data, 0, get_byte(data, 0) # 1) WHERE node_key = '\\x${parent.key}'`,
          `UPDATE core_ledger_state.nodes SET data = set_byte(data, 0, get_byte(data, 0) # 1) WHERE node_key = '\\x${parent.key}'`,
          "node-key",
          parent.key,
        ],
      ];
      for (const [what, tamper, restore, check, key] of tampers) {
        await change(db, tamper);
        try {
          const refused = await backupOf(db);
          expect(refused.outcome, what).toEqual(inconsistent(check, key));
          expect(refused.written, what).toBe(false);
          const exported = await db.read((read) => buildHash(read)).then(
            () => "hashed",
            (error: unknown) => error,
          );
          expect(exported, what).toEqual(inconsistent(check, key));
        } finally {
          await change(db, restore);
        }
      }
      expect((await backupOf(db)).outcome).toMatchObject({ manifest: { contentsHash: byContent } });

      // The process's own backup refuses too, writing nothing: the process restarted on the database with one
      // count changed (its state loads; only the contents hash reads the counts).
      const [, tamper, untamper] = tampers[0] as readonly [string, string, string, string, string];
      await change(db, tamper);
      try {
        const run = await ingest(db as unknown as ProcessDatabase, scenario.records, { start: 0n, core: BUILD_CORE });
        try {
          await committed(run, scenario.head);
          const out = join(dir, "process-refused.backup");
          const refused = await run.handle.backup(out).then(
            () => "written",
            (error: unknown) => error,
          );
          expect(refused).toEqual(inconsistent("counts", countKey));
          expect(existsSync(out)).toBe(false);
        } finally {
          await run.close();
        }
      } finally {
        await change(db, untamper);
      }
    },
    TEST_TIMEOUT_MS,
  );
});
