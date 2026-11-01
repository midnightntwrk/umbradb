import { EventEmitter } from "node:events";
import { existsSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { EXIT, runProcessCommand } from "../../src/cli/command.js";
import { buildCoreVersion } from "../../src/config/build.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { UmbraError } from "../../src/db/errors.js";
import { type EngineConfig, startProcess } from "../../src/runner/process.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { inProcess } from "./cli-fixtures.js";

/**
 * The two keys of the `core` entry renamed with the private link — `listen.transport`, now `listen.privateLink`, and
 * `coreTransport`, now `privateLink` — are refused with the finding `renamed-setting`, at the old key's path and
 * naming the new key, by each command and by the engine they start through: `umbradb config check`, `umbradb backup`
 * and `umbradb restore` on a file, `umbradb run` on a file, and the engine on a file and on data. A public file writes
 * `listen.transport`, a private file `coreTransport`. Each refuses before it opens its database: the PGlite directory
 * the file names is never created. On PostgreSQL 18.6 and PGlite 0.5.10. [L51 CI, CF-4]
 *
 * The negative control is the validation's (`test/config/validate.test.ts`): without the rule, an old key is no
 * longer refused, and every refusal here comes from that one rule of the validation that each command and the engine
 * run (`resolveConfig`, `src/runner/resolve.ts`).
 */

/** A configuration that writes one renamed key: its process's side, the old key and its path, the new key. */
interface Renamed {
  readonly side: "public" | "private";
  /** The old key's path in the configuration. */
  readonly path: string;
  readonly old: string;
  readonly now: string;
  /** The `core` entry's settings on `database`, with the old key. */
  settings(database: DatabaseParts): Readonly<Record<string, unknown>>;
}

const RENAMED: readonly Renamed[] = [
  {
    side: "public",
    path: "entries[0].config.listen.transport",
    old: "listen.transport",
    now: "listen.privateLink",
    settings: (database) => ({
      network: "preprod",
      node: "ws://127.0.0.1:9/node",
      database,
      developmentOptIn: true,
      listen: { admin: "127.0.0.1:0", transport: "127.0.0.1:0" },
    }),
  },
  {
    side: "private",
    path: "entries[0].config.coreTransport",
    old: "coreTransport",
    now: "privateLink",
    settings: (database) => ({
      network: "preprod",
      instanceId: "renamed-1",
      database,
      developmentOptIn: true,
      listen: { admin: "127.0.0.1:0" },
      coreTransport: "127.0.0.1:9",
    }),
  },
];

/**
 * How long a refused configuration may take to end the process on a loaded machine; a run that has not ended by then
 * is stopped, so that a regression fails the test instead of leaving a process up.
 */
const ENDS_WITHIN_MS = 30_000;

/** `text` as a regular expression matching it literally. */
const escaped = (text: string) => text.replace(/[.[\]()]/g, "\\$&");

/** The finding's code and text as a command prints it: its path, the old key, the new key, its code. */
const FINDING = (renamed: Renamed) =>
  new RegExp(
    `${escaped(renamed.path)} \\(core from 0\\): the setting ${escaped(renamed.old)} is renamed ` +
      `${escaped(renamed.now)}: .*\\[invalid-configuration renamed-setting\\]`,
  );

describe.each(PROCESS_BACKENDS)("L51: a renamed key is refused with renamed-setting naming the new key, on $name (CF-4)", (backend: ProcessBackend) => {
  let directory: string;
  beforeAll(async () => {
    await backend.start();
    directory = mkdtempSync(join(tmpdir(), "umbradb-renamed-"));
    writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
  }, 180_000);
  afterAll(async () => {
    rmSync(directory, { recursive: true, force: true });
    await backend.stop();
  }, 60_000);

  /**
   * The database a file names: the backend's — on PGlite a directory of this test's own that is never created, so a
   * refusal before the database opens leaves it absent.
   */
  async function databaseOf(renamed: Renamed): Promise<DatabaseParts> {
    if (backend.kind === "postgres") return (await backend.database()).setting;
    return { kind: "pglite", path: join(directory, `${renamed.side}-db`) };
  }

  /** The configuration's data with `renamed`'s old key. */
  async function dataOf(renamed: Renamed): Promise<unknown> {
    const database = await databaseOf(renamed);
    return { entries: [{ id: "core", start: 0, version: buildCoreVersion(), config: renamed.settings(database) }] };
  }

  let files = 0;
  /** Writes `renamed`'s configuration to a file of its own (Node.js caches a file's first evaluation); its name. */
  async function fileOf(renamed: Renamed): Promise<string> {
    files += 1;
    const name = `${renamed.side}-${files}.config.ts`;
    writeFileSync(join(directory, name), `export default ${JSON.stringify(await dataOf(renamed))};\n`);
    return name;
  }

  /** Nothing was opened: the PGlite directory the file names is not there. */
  const unopened = (renamed: Renamed) => backend.kind !== "pglite" || !existsSync(join(directory, `${renamed.side}-db`));

  for (const renamed of RENAMED) {
    it(`umbradb config check on a ${renamed.side} file refuses ${renamed.old}, naming ${renamed.now}`, async () => {
      const file = await fileOf(renamed);
      const result = await inProcess(["config", "check", file], directory);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stdout).toMatch(FINDING(renamed));
      expect(result.stdout).toMatch(/^failed: 1 finding$/m);
      expect(unopened(renamed)).toBe(true);
    });

    it(`umbradb backup on a ${renamed.side} file refuses ${renamed.old}, naming ${renamed.now}`, async () => {
      const file = await fileOf(renamed);
      const result = await inProcess(["backup", "--out", "renamed.sql", "--config", file], directory);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stderr).toContain("umbradb backup: invalid-configuration: ");
      expect(result.stderr).toContain("was refused (1 finding)");
      expect(result.stderr).toMatch(FINDING(renamed));
      expect(existsSync(join(directory, "renamed.sql"))).toBe(false);
      expect(unopened(renamed)).toBe(true);
    });

    it(`umbradb restore on a ${renamed.side} file refuses ${renamed.old}, naming ${renamed.now}`, async () => {
      const file = await fileOf(renamed);
      const result = await inProcess(["restore", "renamed.sql", "--config", file], directory);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stderr).toContain("umbradb restore: invalid-configuration: ");
      expect(result.stderr).toContain("was refused (1 finding)");
      expect(result.stderr).toMatch(FINDING(renamed));
      expect(unopened(renamed)).toBe(true);
    });

    it(`umbradb run on a ${renamed.side} file refuses ${renamed.old}, naming ${renamed.now}: the process ends, exit 1`, async () => {
      const file = await fileOf(renamed);
      const signals = new EventEmitter();
      const running = inProcess(["run", "--config", file], directory, { run: runProcessCommand({ signals }) });
      const ended = await Promise.race([running.then(() => true), sleep(ENDS_WITHIN_MS, false)]);
      if (!ended) signals.emit("SIGTERM");
      const result = await running;
      // A refusal of the configuration ends the process by itself: no signal was needed. [Q137 B]
      expect(ended).toBe(true);
      expect(result.code).toBe(EXIT.failed);
      expect(result.stderr).toMatch(/^startup refused: invalid-configuration \(1 finding\); the process ends$/m);
      expect(result.stderr).toMatch(new RegExp(`^startup refused: ${FINDING(renamed).source}$`, "m"));
      expect(unopened(renamed)).toBe(true);
    });

    for (const given of ["file", "data"] as const) {
      it(`the engine on a ${renamed.side} configuration given as ${given} refuses ${renamed.old}, naming ${renamed.now}`, async () => {
        const config: EngineConfig = given === "file" ? { file: await fileOf(renamed) } : { data: await dataOf(renamed) };
        const lines: string[] = [];
        const handle = startProcess({
          config,
          cwd: directory,
          userModules: { from: "config" },
          admin: false,
          log: (line) => lines.push(line),
        });
        const refusal = await handle.started.then(
          () => null,
          (error: unknown) => error,
        );
        // A refusal of the configuration ends the process: `closed` resolves with no stop. [Q137 B]
        const closed = await Promise.race([handle.closed.then(() => true), sleep(ENDS_WITHIN_MS, false)]);
        await handle.stop();
        expect(closed).toBe(true);
        expect(refusal).toBeInstanceOf(UmbraError);
        expect((refusal as UmbraError).code).toBe("invalid-configuration");
        const findings = (refusal as UmbraError).details.findings as readonly { rule: string; path: string; message: string }[];
        expect(findings.map(({ rule, path }) => [rule, path])).toEqual([["renamed-setting", renamed.path]]);
        expect(findings[0]?.message).toContain(`the setting ${renamed.old} is renamed ${renamed.now}`);
        expect(handle.status()).toMatchObject({ state: "refused", reason: { code: "invalid-configuration" } });
        expect(lines.some((line) => FINDING(renamed).test(line))).toBe(true);
        expect(unopened(renamed)).toBe(true);
      });
    }
  }
});
