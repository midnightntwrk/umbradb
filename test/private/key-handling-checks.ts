import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { join, relative, sep } from "node:path";

/**
 * The static check that key handling has left the core: keys, and private items in general, are a module's, not the
 * core's. Nothing of the removed key handling is left in the repository's code, its module guide or the change's
 * design:
 * - the private backbone part `core-key-registry` (its folder, its table `core_key_registry.keys`, its item
 *   `admitted-keys`);
 * - the point `on-key` (`POINTS`, `PointCallbacks`, `PendingKey`, the loop's `keys` and `keyPoint`);
 * - the private `core` entry's `testKeys` and the configuration rule `test-keys`;
 * - a declaration's `keyKinds` and `validateKey`, and the code `test-key-conflict`;
 * - the removed key tests, and the key half of the `/status` test with the required id `private.no-key-bytes-public`.
 *   [A119, A120, A123]
 *
 * Imports nothing of Vitest. [Q154 A2]
 *
 * **What is read** ({@link SCANNED}): every file under `src/`, `browser/` and `test/` — but this check's own files,
 * which name what they look for —, `docs/module-guide.md` and `openspec/changes/core-arch/design.md`. Comments count:
 * a comment describing the removed parts is as stale as the code. The decision record, `tasks.md` (whose done notes
 * are history), the specs and `docs/issues/` are not read.
 *
 * **What is looked for**: the files that must not exist ({@link REMOVED_PATHS}), and every name of {@link REMOVED_NAMES}
 * in a file's path or text, but for {@link UNRELATED}: a name a file outside the change uses for something else.
 */

/** A name of the removed key handling, as a pattern, and what it named. */
export interface RemovedName {
  readonly name: string;
  readonly pattern: RegExp;
}

/** The names of the removed parts (see the module comment); each pattern is global, so every match is found. */
export const REMOVED_NAMES: readonly RemovedName[] = Object.freeze([
  // The part, its folder, its table and its options: core-key-registry, core_key_registry, CORE_KEY_REGISTRY(_ID),
  // coreKeyRegistry, KeyRegistryOptions; and "the key registry" in prose.
  { name: "core-key-registry", pattern: /core[-_]?key[-_]?registry/gi },
  { name: "KeyRegistryOptions", pattern: /\bKeyRegistryOptions\b/g },
  { name: "the key registry", pattern: /\bkey registry\b/gi },
  // The point and its keys.
  { name: "on-key", pattern: /(?<![\w-])on-key(?![\w-])/g },
  { name: "PendingKey", pattern: /\bPendingKeys?\b/g },
  { name: "pendingKeysOf", pattern: /\bpendingKeysOf\b/g },
  { name: "keyPoint", pattern: /\bkeyPoint\b/g },
  // The configuration's test keys and their rule: testKeys, TestKey(Config), TEST_KEY(S), test-keys, testKeysRule,
  // TestKeysRuleOptions, testKeyConflict, test-key-conflict.
  { name: "testKeys", pattern: /\btest[-_]?keys?/gi },
  { name: "a test key", pattern: /\btest keys?\b/gi },
  // A declaration's key fields.
  { name: "keyKinds", pattern: /\bkeyKinds\b/g },
  { name: "validateKey", pattern: /\bvalidateKey\b/g },
  // The key's id and its admission.
  { name: "keyIdOf", pattern: /\bkeyIdOf\b/g },
  { name: "admitted-keys", pattern: /\badmitted[-_]keys\b/gi },
  { name: "AdmittedKey", pattern: /\bAdmittedKeys?\b/g },
  { name: "arrived_height", pattern: /\barrived_?height\b/gi },
  // The required id of the `/status` test's key half. [A120]
  { name: "private.no-key-bytes-public", pattern: /no-key-bytes-public/g },
]);

/** The files and folders that must not exist: the part's folder and the removed key tests. [A119, A120, A123] */
export const REMOVED_PATHS: readonly string[] = Object.freeze([
  "src/backbone/core-key-registry",
  "test/backbone/core-key-registry.test.ts",
  "test/runner/key-point.test.ts",
  "test/private/keys.test.ts",
  "test/private/keys.negative-control.test.ts",
  "test/private/key-checks.ts",
  "test/private/key-crash.worker.ts",
]);

/**
 * Names a file outside the change uses for something else, by its path from the root: 0.9.5's `TemporalKV` adapter has
 * a private method `validateKey` checking its own namespace, scope and key (the file is retired together with 0.9.5).
 */
export const UNRELATED: readonly { readonly file: string; readonly name: string }[] = Object.freeze([
  { file: "src/postgres/temporal-kv.ts", name: "validateKey" },
]);

/** The folders read whole, and the single files read (see the module comment). */
export const SCANNED = Object.freeze({
  folders: Object.freeze(["src", "browser", "test"]),
  files: Object.freeze(["docs/module-guide.md", "openspec/changes/core-arch/design.md"]),
});

/** This check's own files, which name what they look for. */
export const OWN_FILES: readonly string[] = Object.freeze([
  "test/private/key-handling-checks.ts",
  "test/private/key-handling-removed.test.ts",
  "test/private/key-handling-removed.negative-control.test.ts",
]);

/** Folders never read: installed packages and build outputs. */
const SKIPPED_FOLDERS = new Set(["node_modules", ".git", "dist", "dist-browser", "coverage"]);

/** Files read as text: source, data and documents (not WebAssembly, images or archives). */
const TEXT_FILE = /\.(?:[cm]?[jt]s|[jt]sx|json|jsonl|md|sql|html|css|sh|yml|yaml|toml|txt)$/;

/** One leftover: where, and which name or path. */
export interface Leftover {
  /** The file's path from the root (`/` separated). */
  readonly file: string;
  /** Its line (from 1), or 0 for the path itself. */
  readonly line: number;
  readonly name: string;
  /** The line's text (trimmed, at most 160 characters), or the path. */
  readonly text: string;
}

/** Every file to read under `root` (see {@link SCANNED}), as paths from the root, `/` separated, sorted. */
export function scannedFiles(root: string): string[] {
  const found: string[] = [];
  const walk = (folder: string): void => {
    if (!existsSync(folder)) return;
    for (const entry of readdirSync(folder, { withFileTypes: true })) {
      const path = join(folder, entry.name);
      if (entry.isDirectory()) {
        if (!SKIPPED_FOLDERS.has(entry.name)) walk(path);
      } else if (entry.isFile() && TEXT_FILE.test(entry.name)) {
        found.push(relative(root, path).split(sep).join("/"));
      }
    }
  };
  for (const folder of SCANNED.folders) walk(join(root, folder));
  for (const file of SCANNED.files) if (existsSync(join(root, file)) && statSync(join(root, file)).isFile()) found.push(file);
  return found.filter((file) => !OWN_FILES.includes(file)).sort();
}

/** The leftovers of the removed names in one file's path and text (see the module comment). */
export function leftoversIn(file: string, text: string): Leftover[] {
  const found: Leftover[] = [];
  const unrelated = new Set(UNRELATED.filter((entry) => entry.file === file).map((entry) => entry.name));
  for (const { name, pattern } of REMOVED_NAMES) {
    if (unrelated.has(name)) continue;
    if (new RegExp(pattern.source, pattern.flags).test(file)) found.push({ file, line: 0, name, text: file });
    const lines = text.split("\n");
    for (const [index, line] of lines.entries()) {
      if (new RegExp(pattern.source, pattern.flags).test(line)) {
        found.push({ file, line: index + 1, name, text: line.trim().slice(0, 160) });
      }
    }
  }
  return found;
}

/** Every leftover under `root`: the removed paths that exist, then each scanned file's names, by file and line. */
export function keyLeftovers(root: string): Leftover[] {
  const paths = REMOVED_PATHS.filter((path) => existsSync(join(root, path))).map(
    (path): Leftover => ({ file: path, line: 0, name: "a removed file or folder", text: path }),
  );
  const names = scannedFiles(root).flatMap((file) => leftoversIn(file, readFileSync(join(root, file), "utf8")));
  names.sort((a, b) => (a.file === b.file ? a.line - b.line : a.file < b.file ? -1 : 1));
  return [...paths, ...names];
}

/** A leftover as one line of a report: `file:line: name — text`. */
export const described = (leftover: Leftover): string =>
  `${leftover.file}:${leftover.line}: ${leftover.name} — ${leftover.text}`;
