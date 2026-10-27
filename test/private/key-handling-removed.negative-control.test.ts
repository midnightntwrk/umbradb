import { mkdirSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { afterEach, describe, expect, it } from "vitest";
import { described, keyLeftovers, leftoversIn } from "./key-handling-checks.js";

/**
 * Task 14.4a's committed negative control: a key part left in place fails the static check of
 * `./key-handling-removed.test.ts`. Each case writes, in a scratch folder laid out as the repository, the files the check
 * reads — copies of the real `src/modules/declaration.ts`, `docs/module-guide.md` and the change's design, unchanged —
 * plus one leftover, and runs the same check there: the copies alone pass, and each leftover is found, named by its
 * file and line.
 */

const ROOT = fileURLToPath(new URL("../..", import.meta.url));
const COPIED = ["src/modules/declaration.ts", "docs/module-guide.md", "openspec/changes/core-arch/design.md"];

const scratch: string[] = [];

afterEach(() => {
  for (const folder of scratch.splice(0)) rmSync(folder, { recursive: true, force: true });
});

/** A scratch repository with {@link COPIED} and `files` (path from the root → text). */
function repository(files: Readonly<Record<string, string>> = {}): string {
  const root = mkdtempSync(join(tmpdir(), "umbradb-key-handling-"));
  scratch.push(root);
  const write = (path: string, text: string): void => {
    mkdirSync(dirname(join(root, path)), { recursive: true });
    writeFileSync(join(root, path), text);
  };
  for (const path of COPIED) write(path, readFileSync(join(ROOT, path), "utf8"));
  for (const [path, text] of Object.entries(files)) write(path, text);
  return root;
}

/** The real `POINTS` with `on-key` put back after `on-stop-height`. */
function pointsWithOnKey(): string {
  const text = readFileSync(join(ROOT, "src/modules/declaration.ts"), "utf8");
  const changed = text.replace('  "on-stop-height",\n] as const);', '  "on-stop-height",\n  "on-key",\n] as const);');
  if (changed === text) throw new Error("src/modules/declaration.ts's POINTS no longer ends with on-stop-height");
  return changed;
}

describe("task 14.4a's negative control: a key part left in place fails the static check", () => {
  it("passes the copies of the cleaned files alone", () => {
    expect(keyLeftovers(repository()).map(described)).toEqual([]);
  });

  it("finds on-key put back in POINTS", () => {
    const root = repository({ "src/modules/declaration.ts": pointsWithOnKey() });
    expect(keyLeftovers(root).map((leftover) => [leftover.file, leftover.name])).toEqual([["src/modules/declaration.ts", "on-key"]]);
  });

  it("finds the part's folder, by its path and its names", () => {
    const root = repository({
      "src/backbone/core-key-registry/index.ts": 'export * from "./core-key-registry.js";\n',
    });
    expect(keyLeftovers(root).map(described)).toEqual([
      "src/backbone/core-key-registry:0: a removed file or folder — src/backbone/core-key-registry",
      "src/backbone/core-key-registry/index.ts:0: core-key-registry — src/backbone/core-key-registry/index.ts",
      'src/backbone/core-key-registry/index.ts:1: core-key-registry — export * from "./core-key-registry.js";',
    ]);
  });

  it("finds a removed test file, the configuration's test keys, a declaration's key fields and the code", () => {
    const root = repository({
      "test/private/keys.test.ts": "// A119\n",
      "src/config/core-settings.ts": "    testKeys: z.array(TEST_KEY).default([]).meta(SECRET),\n",
      "test/modules/module.ts": "  keyKinds: [\"viewing\"],\n  validateKey: () => true,\n",
      "src/runner/failures.ts": '  "test-key-conflict",\n',
      "browser/src/fixture.ts": '  requires: ["admitted-keys", "blocks"],\n',
      "docs/module-guide.md": `${readFileSync(join(ROOT, "docs/module-guide.md"), "utf8")}\n- Keys reach you through the key registry.\n`,
    });
    const names = keyLeftovers(root).map((leftover) => `${leftover.file} ${leftover.name}`);
    expect(names).toEqual([
      "test/private/keys.test.ts a removed file or folder",
      "browser/src/fixture.ts admitted-keys",
      "docs/module-guide.md the key registry",
      "src/config/core-settings.ts testKeys",
      "src/runner/failures.ts testKeys",
      "test/modules/module.ts keyKinds",
      "test/modules/module.ts validateKey",
    ]);
  });

  it("finds validateKey everywhere but in the one file that names it for something else", () => {
    expect(leftoversIn("src/postgres/temporal-kv.ts", "  private validateKey(namespace: string): void {")).toEqual([]);
    expect(leftoversIn("src/modules/declaration.ts", "  validateKey?(kind: string, bytes: Uint8Array): boolean;")).toEqual([
      { file: "src/modules/declaration.ts", line: 1, name: "validateKey", text: "validateKey?(kind: string, bytes: Uint8Array): boolean;" },
    ]);
  });
});
