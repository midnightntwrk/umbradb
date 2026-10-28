import fs from "node:fs";
import { syncBuiltinESMExports } from "node:module";
import { basename, join, resolve, sep } from "node:path";
import { fileURLToPath } from "node:url";

/**
 * A174's observer and oracle (task 15.1b; BK-1, the threat model draft's gap 7; `design.md` §9.1): the modes of a
 * backup's files, seen from outside the code that writes them, from each file's creation to after its rename.
 *
 * - **At creation, and at each open and rename** ({@link watchFileModes}): Node.js's own functions that create, open or
 *   rename a file — `open`, `openSync`, `writeFile`, `writeFileSync`, `appendFile`, `appendFileSync`, `copyFile`,
 *   `copyFileSync`, `rename`, `renameSync`, and `open`, `writeFile`, `appendFile`, `copyFile`, `rename` of
 *   `node:fs/promises` — are wrapped on the `node:fs` and `node:fs/promises` objects, and their ES module bindings
 *   updated with them (`syncBuiltinESMExports`), so the code calls the wrappers however it imported the functions; a
 *   stream opens its file through `fs.open`, so a stream's file is seen too. A call on a path in a watched directory is
 *   followed at once — before its caller's next step — by an `lstat` of the path: `created` when no file was there
 *   before the call, `opened` or `written` when one was, `renamed` for the new name. A file is known by its inode, so a
 *   temporary file renamed to its final name is one file.
 * - **Between them:** the directory's files, polled every millisecond while watched (`seen`).
 * - **While `pg_dump` runs** ({@link watchingPgDump}): the `pg_dump` a backup runs is a wrapper that lists the
 *   directory's files with their modes when `pg_dump` starts and when it ended (`pg_dump start`, `pg_dump end`) — a
 *   process of its own, so what it sees does not depend on this one.
 * - **In a process of its own** (`./file-modes.preload.ts`): the same observer, loaded before the command with
 *   `--import`, writes what it saw to a log when its process exits.
 *
 * {@link modeProblems} is the oracle: every file created in the directory while it was watched — the backup's
 * temporary file among them — had mode `0600` at every observation, the backup file at the end is one of them, and its
 * mode is `0600`. A file whose creation was not seen is not taken as checked from creation. The tests run with a umask
 * of `000`, under which a file Node.js creates with its default mode is `0666`.
 */

/** The mode A174 requires of a backup file and of its temporary file. */
export const OWNER_ONLY = 0o600;

/** One look at a file of a watched directory. */
export interface ModeObservation {
  /** When: `created`, `opened`, `written`, `renamed`, `seen`, `pg_dump start`, `pg_dump end`. */
  readonly at: string;
  /** The file's name in the directory. */
  readonly name: string;
  /** Its inode number, as decimal text. */
  readonly ino: string;
  /** Its permission bits. */
  readonly mode: number;
}

/** A watched directory's observer. */
export interface ModeWatch {
  /** What was seen so far. */
  observations(): ModeObservation[];
  /** Ends the watch, after one last look at the directory. */
  stop(): void;
}

/** A mode as octal text (`0600`). */
export const octal = (mode: number): string => `0${mode.toString(8).padStart(3, "0")}`;

/** The watches, by directory (absolute), and what each saw. */
const watches = new Map<string, ModeObservation[]>();

/** The functions wrapped, with the originals they replaced while installed. */
let originals: { readonly target: Record<string, unknown>; readonly name: string; readonly original: unknown }[] = [];

/** The watched directory's absolute path of `value` (a path, a `Buffer`, a `file:` URL), or null. */
function watched(value: unknown): { readonly dir: string; readonly path: string } | null {
  if (watches.size === 0) return null;
  let path: string;
  if (typeof value === "string") path = value;
  else if (Buffer.isBuffer(value)) path = value.toString();
  else if (value instanceof URL && value.protocol === "file:") path = fileURLToPath(value);
  else return null;
  const absolute = resolve(path);
  for (const dir of watches.keys()) if (absolute.startsWith(dir + sep)) return { dir, path: absolute };
  return null;
}

/** Records what `path` is now, as `at`. */
function record(dir: string, path: string, at: string): void {
  const stat = fs.lstatSync(path, { bigint: true, throwIfNoEntry: false });
  if (stat === undefined) return;
  watches.get(dir)?.push({ at, name: basename(path), ino: String(stat.ino), mode: Number(stat.mode & 0o7777n) });
}

/** What a call that creates or opens `path` is called once it succeeded: `created` unless a file was there. */
type After = (dir: string, path: string, existed: boolean) => void;

const opening =
  (kind: "opened" | "written"): After =>
  (dir, path, existed) =>
    record(dir, path, existed ? kind : "created");
const renaming: After = (dir, path) => record(dir, path, "renamed");

/** Wraps a callback form: the path is argument `index`, the callback the last argument. */
function callbackForm(original: (...args: unknown[]) => unknown, index: number, after: After) {
  return function (this: unknown, ...args: unknown[]): unknown {
    const target = watched(args[index]);
    const callback = args.at(-1);
    if (target === null || typeof callback !== "function") return original.apply(this, args);
    const existed = fs.existsSync(target.path);
    args[args.length - 1] = function (this: unknown, error: unknown, ...rest: unknown[]): unknown {
      if (error === null || error === undefined) after(target.dir, target.path, existed);
      return (callback as (...a: unknown[]) => unknown).call(this, error, ...rest);
    };
    return original.apply(this, args);
  };
}

/** Wraps a synchronous form: the path is argument `index`. */
function syncForm(original: (...args: unknown[]) => unknown, index: number, after: After) {
  return function (this: unknown, ...args: unknown[]): unknown {
    const target = watched(args[index]);
    if (target === null) return original.apply(this, args);
    const existed = fs.existsSync(target.path);
    const result = original.apply(this, args);
    after(target.dir, target.path, existed);
    return result;
  };
}

/** Wraps a promise form: the path is argument `index`. */
function promiseForm(original: (...args: unknown[]) => Promise<unknown>, index: number, after: After) {
  return async function (this: unknown, ...args: unknown[]): Promise<unknown> {
    const target = watched(args[index]);
    if (target === null) return original.apply(this, args);
    const existed = fs.existsSync(target.path);
    const result = await original.apply(this, args);
    after(target.dir, target.path, existed);
    return result;
  };
}

/** Puts the wrappers in place of Node.js's functions (see the module comment). */
function install(): void {
  const callbacks = fs as unknown as Record<string, unknown>;
  const promises = fs.promises as unknown as Record<string, unknown>;
  const wrap = (
    target: Record<string, unknown>,
    name: string,
    form: typeof callbackForm | typeof syncForm | typeof promiseForm,
    index: number,
    after: After,
  ): void => {
    const original = target[name];
    originals.push({ target, name, original });
    target[name] = form(original as never, index, after);
  };
  for (const [name, index, after] of [
    ["open", 0, opening("opened")],
    ["writeFile", 0, opening("written")],
    ["appendFile", 0, opening("written")],
    ["copyFile", 1, opening("written")],
    ["rename", 1, renaming],
  ] as const) {
    wrap(callbacks, name, callbackForm, index, after);
    wrap(callbacks, `${name}Sync`, syncForm, index, after);
    wrap(promises, name, promiseForm, index, after);
  }
  syncBuiltinESMExports();
}

/** Puts Node.js's own functions back. */
function uninstall(): void {
  for (const { target, name, original } of originals.reverse()) target[name] = original;
  originals = [];
  syncBuiltinESMExports();
}

/** Looks at every file of `dir`, recording each file, inode and mode once as `at`. */
function look(dir: string, at: string, seen: Set<string>): void {
  let names: string[];
  try {
    names = fs.readdirSync(dir);
  } catch {
    return;
  }
  for (const name of names) {
    const stat = fs.lstatSync(join(dir, name), { bigint: true, throwIfNoEntry: false });
    if (stat === undefined || !stat.isFile()) continue;
    const observation = { at, name, ino: String(stat.ino), mode: Number(stat.mode & 0o7777n) };
    const key = `${observation.ino}:${observation.mode}:${name}`;
    if (seen.has(key)) continue;
    seen.add(key);
    watches.get(dir)?.push(observation);
  }
}

/** Watches the directory `dir` (see the module comment) until `stop()`. */
export function watchFileModes(dir: string): ModeWatch {
  const absolute = resolve(dir);
  if (watches.has(absolute)) throw new Error(`${absolute} is watched already`);
  if (watches.size === 0) install();
  const observations: ModeObservation[] = [];
  watches.set(absolute, observations);
  const seen = new Set<string>();
  const poll = setInterval(() => look(absolute, "seen", seen), 1);
  poll.unref();
  let stopped = false;
  return {
    observations: () => [...observations],
    stop() {
      if (stopped) return;
      stopped = true;
      clearInterval(poll);
      look(absolute, "seen", seen);
      watches.delete(absolute);
      if (watches.size === 0) uninstall();
    },
  };
}

/** A `pg_dump` that watches a directory while it runs (see the module comment). */
export interface PgDumpWatch {
  /** The wrapper: what `UMBRADB_PG_DUMP` names. */
  readonly path: string;
  /** What it saw while dumping (its `--version` runs left out). */
  observations(): ModeObservation[];
  /** How many times it dumped. */
  dumps(): number;
}

/** One run of the wrapper, as its log line holds it. */
interface PgDumpRun {
  readonly version: boolean;
  readonly start: readonly Omit<ModeObservation, "at">[];
  readonly end: readonly Omit<ModeObservation, "at">[];
}

/**
 * Writes into `scripts` (not in `dir`) a `pg_dump` that runs `inner` with its arguments, its output its own, and lists
 * `dir`'s files with their modes when `inner` starts and when it ended, one JSON line per run in a log beside it.
 */
export function watchingPgDump(inner: string, dir: string, scripts: string): PgDumpWatch {
  fs.mkdirSync(scripts, { recursive: true });
  const log = join(scripts, "pg_dump-modes.log");
  const watcher = join(scripts, "pg_dump-modes.mjs");
  fs.writeFileSync(
    watcher,
    [
      'import { spawnSync } from "node:child_process";',
      'import { appendFileSync, lstatSync, readdirSync } from "node:fs";',
      'import { join } from "node:path";',
      `const INNER = ${JSON.stringify(inner)};`,
      `const DIR = ${JSON.stringify(resolve(dir))};`,
      `const LOG = ${JSON.stringify(log)};`,
      "const args = process.argv.slice(2);",
      "const look = () => readdirSync(DIR).flatMap((name) => {",
      "  const stat = lstatSync(join(DIR, name), { bigint: true, throwIfNoEntry: false });",
      "  return stat !== undefined && stat.isFile() ? [{ name, ino: String(stat.ino), mode: Number(stat.mode & 0o7777n) }] : [];",
      "});",
      "const start = look();",
      'const run = spawnSync(INNER, args, { stdio: "inherit" });',
      "const end = look();",
      'appendFileSync(LOG, `${JSON.stringify({ version: args.includes("--version"), start, end })}\\n`);',
      "process.exit(run.status ?? 1);",
      "",
    ].join("\n"),
  );
  const path = join(scripts, "pg_dump");
  fs.writeFileSync(path, `#!/bin/sh\nexec ${JSON.stringify(process.execPath)} ${JSON.stringify(watcher)} "$@"\n`);
  fs.chmodSync(path, 0o755);
  const runs = (): PgDumpRun[] =>
    fs.existsSync(log)
      ? fs
          .readFileSync(log, "utf8")
          .split("\n")
          .filter((line) => line !== "")
          .map((line) => JSON.parse(line) as PgDumpRun)
          .filter((run) => !run.version)
      : [];
  return {
    path,
    observations: () =>
      runs().flatMap((run) => [
        ...run.start.map((file) => ({ ...file, at: "pg_dump start" })),
        ...run.end.map((file) => ({ ...file, at: "pg_dump end" })),
      ]),
    dumps: () => runs().length,
  };
}

/** What {@link modeProblems} also requires. */
export interface ModeOracleOptions {
  /** A `pg_dump` wrote the backup (PostgreSQL): its wrapper saw a file created in the watch while it ran. */
  readonly whileDumping?: boolean;
}

/**
 * A174's oracle for the backup file `out` (see the module comment) given what was seen of its directory: the problems
 * found, none when the backup file was `0600` from its creation — its temporary file included — to after its rename.
 */
export function modeProblems(
  out: string,
  observations: readonly ModeObservation[],
  options: ModeOracleOptions = {},
): string[] {
  const name = basename(out);
  const final = fs.lstatSync(out, { bigint: true, throwIfNoEntry: false });
  if (final === undefined) return [`${name}: no file at the end`];
  const problems: string[] = [];
  const created = new Set(observations.filter((seen) => seen.at === "created").map((seen) => seen.ino));
  if (!created.has(String(final.ino))) {
    problems.push(`${name}: its creation was not seen, so its mode is not known from creation`);
  }
  for (const seen of observations) {
    if (created.has(seen.ino) && seen.mode !== OWNER_ONLY) problems.push(`${seen.at} ${seen.name}: mode ${octal(seen.mode)}`);
  }
  if (options.whileDumping === true && !observations.some((seen) => seen.at.startsWith("pg_dump") && created.has(seen.ino))) {
    problems.push(`${name}: pg_dump ran, but its wrapper saw no file created for the backup`);
  }
  const mode = Number(final.mode & 0o7777n);
  if (mode !== OWNER_ONLY) problems.push(`${name} at the end: mode ${octal(mode)}`);
  return problems;
}
