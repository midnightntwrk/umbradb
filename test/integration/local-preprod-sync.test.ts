import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterAll, describe, expect, it } from "vitest";

/**
 * The local preprod runs' script (`scripts/local-preprod-sync.mjs`) talks only to the archive node on the owner's LAN,
 * whose WebSocket URL `UMBRADB_LOCAL_NODE` holds. Without it — unset, empty, or not a `ws://` or `wss://` URL — the
 * script exits non-zero naming the variable before it does anything else: given valid arguments and no `docker` on its
 * `PATH`, it still names the variable rather than the missing command, and it creates no output directory. No test
 * runs it against a node. [ledger-refcount design §12.1]
 */

const SCRIPT = fileURLToPath(new URL("../../scripts/local-preprod-sync.mjs", import.meta.url));
const VARIABLE = "UMBRADB_LOCAL_NODE";

/** A scratch folder: an empty `bin` for the script's `PATH`, and the output directory it is told to write. */
const SCRATCH = mkdtempSync(join(tmpdir(), "umbradb-local-preprod-"));
const EMPTY_PATH = mkdtempSync(join(SCRATCH, "bin-"));

afterAll(() => rmSync(SCRATCH, { recursive: true, force: true }));

/** Runs the script with `args`, the variable set to `value` (unset when `undefined`) and nothing else on `PATH`. */
function run(value: string | undefined, args: readonly string[]) {
  const env: NodeJS.ProcessEnv = { PATH: EMPTY_PATH };
  if (value !== undefined) env[VARIABLE] = value;
  return spawnSync(process.execPath, [SCRIPT, ...args], { env, encoding: "utf8", timeout: 30_000 });
}

describe("scripts/local-preprod-sync.mjs without UMBRADB_LOCAL_NODE", () => {
  const cases: readonly { readonly name: string; readonly value: string | undefined }[] = [
    { name: "unset", value: undefined },
    { name: "empty", value: "" },
    { name: "not a WebSocket URL", value: "http://192.0.2.1:9944" },
  ];

  for (const { name, value } of cases) {
    it(`${name}: exits non-zero naming the variable, before starting or writing anything`, () => {
      const out = join(SCRATCH, `out-${cases.findIndex((c) => c.name === name)}`);
      const result = run(value, ["--label", "check", "--stop", "10000", "--out", out]);
      expect(result.error).toBeUndefined();
      expect(result.signal).toBeNull();
      expect(result.status).not.toBe(0);
      expect(result.stderr).toContain(VARIABLE);
      expect(result.stderr).not.toMatch(/docker/i);
      expect(result.stdout).toBe("");
      expect(existsSync(out)).toBe(false);
    });
  }

  it("names the variable before any argument is read: no arguments at all", () => {
    const result = run(undefined, []);
    expect(result.signal).toBeNull();
    expect(result.status).not.toBe(0);
    expect(result.stderr).toContain(VARIABLE);
  });
});
