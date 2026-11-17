import { spawnSync } from "node:child_process";
import { createHash } from "node:crypto";
import { appendFileSync, chmodSync, cpSync, existsSync, mkdirSync, mkdtempSync, readdirSync, readFileSync, realpathSync, rmSync, symlinkSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { commandBuild } from "../../src/cli/build-modules.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { coreEntry } from "../../src/config/entries.js";
import { versionText } from "../../src/config/history.js";
import { plainData } from "../../src/config/plain-data.js";
import { entriesAtCursor, validateConfig } from "../../src/config/validate.js";
import { startContainer } from "../containers.js";
import { POSTGRES_IMAGE } from "../postgres-image.js";

/**
 * The range bench's scripts (`bench/range/`):
 * - they hold nothing of one machine: no home directory, no private address, and every script that needs the
 *   machine's folder, the node's address or a template refuses to run without it;
 * - the scripts that read a run folder give the right numbers on a small run written here, with the fields the block
 *   trace writes (`src/trace/trace.ts`; `test/trace/traced-process.test.ts` holds the process to those fields), and
 *   print a stage, a phase or a column only where its key is in the trace;
 * - negative controls: `compare.mjs` shows where two runs differ, and `tables.sh` marks the tables in which two small
 *   databases differ; `tables.sh` and `equal.sh` fail, and never count a difference of 0, when a read fails.
 *
 * `tables.sh`, `equal.sh` and `roundtrip.mjs` run on a PostgreSQL container of this file's own, and so does `run.sh`,
 * with a stand-in for its run's container (no build and no node: the stand-in answers `/status` as a test says).
 * `contents-hash.sh`, `roundtrip.sh` (the container around `roundtrip.mjs`) and `preflight.sh` past the password file's
 * mode need a build, a node or a synced database and are not run here.
 */

const SCRIPTS = fileURLToPath(new URL("../../bench/range/", import.meta.url));
const FILES = readdirSync(SCRIPTS).sort();

interface Ran {
  readonly code: number | null;
  readonly stdout: string;
  readonly stderr: string;
}

/**
 * Runs one script with `args`, in an environment without the bench's variables unless `env` gives them, from `cwd`
 * (this process's own unless given). With `termAfter`, a shell script is sent SIGTERM after that many seconds by a
 * shell that started it, as an interrupt would (spawnSync's own timeout closes its output first).
 */
function run(script: string, args: readonly string[], env: Readonly<Record<string, string>> = {}, cwd?: string, termAfter?: number): Ran {
  const base = Object.fromEntries(Object.entries(process.env).filter(([name]) => !/^(BENCH_|BUILD$|TEMPLATE$|UMBRADB_LOCAL_NODE$|SKIP$|FROM$|TO$)/.test(name)));
  const command = script.endsWith(".sh") ? "bash" : process.execPath;
  const argv = termAfter === undefined ? [join(SCRIPTS, script), ...args] : ["-c", `bash "$0" "$@" & pid=$!; sleep ${termAfter}; kill -TERM "$pid"; wait "$pid"`, join(SCRIPTS, script), ...args];
  const result = spawnSync(command, argv, { encoding: "utf8", env: { ...base, ...env }, cwd });
  return { code: result.status, stdout: result.stdout, stderr: result.stderr };
}

let directory = "";
const folder = (label: string): string => join(directory, label);

type Line = Record<string, unknown>;

/**
 * A run folder of five heights, 100 to 104, the third with a transaction: each height creates one node and deletes the
 * one of the height before, so its count changes are +1 for its own node and −1 for the one before. `change` rewrites
 * a height's line (`index` 0 to 4) before it is written; `ends` are the clock's ms at each height's end.
 */
function writeRun(label: string, lastChain: string, change: (line: Line, index: number) => Line = (line) => line, ends: readonly number[] = [0, 10, 30, 40, 60]): void {
  mkdirSync(folder(label));
  const lines = ends.map((t, index) => {
    const h = 100 + index;
    return JSON.stringify(
      change(
        {
          h,
          t,
          tx: index === 2 ? 1 : 0,
          // The fourth height waited 5 ms for its block and 1 ms for the node's root.
          beginMs: index === 3 ? 6 : 1,
          prepareMs: 6,
          applyMs: (index === 2 ? 12 : 2) + (index === 3 ? 1 : 0),
          rootWaitMs: index === 3 ? 1 : 0,
          stepMs: 3,
          evictMs: 0.5,
          txMs: 4,
          writeBlockMs: 1,
          writeRefcountMs: 2,
          commitMs: 0.5,
          sqlN: 20,
          sqlMs: 5,
          encMs: 0.1,
          decMs: 0.1,
          reads: [["rows", 10, 0.1, 10], ["queue", 0, 0.1, 1], ["counts", 30, 0.2, 30], ["references", 1, 0.1, 1]],
          st: [1, 0, 0, 2, 1, 1, 1, 1, 2],
          sh: index === ends.length - 1 ? lastChain : `chain-${h}`,
        },
        index,
      ),
    );
  });
  writeFileSync(join(folder(label), "trace.jsonl"), `${lines.join("\n")}\n`);
  writeFileSync(join(folder(label), "trace.jsonl.stmts.json"), JSON.stringify([{ q: "COMMIT", n: 5, ms: 2.5, max: 0.6 }]));
  const worker = ends.map((_, index) => JSON.stringify({ h: 100 + index, tx: index === 2 ? 1 : 0, adapterApply: index === 2 ? 9 : 1, stateApply: index === 2 ? 5 : 0, settle: 1, flush: 0.5 }));
  writeFileSync(join(folder(label), "trace.jsonl.worker.jsonl"), `${worker.join("\n")}\n`);
  const status = [
    { at: 1_000, status: { state: "running", cursor: "100" } },
    { at: 2_000, status: { state: "running", cursor: "102" } },
    { at: 3_000, status: { state: "stopped", cursor: "104", reason: null } },
    { at: 3_500, status: { state: "stopped", cursor: "104", reason: null } },
  ];
  writeFileSync(join(folder(label), "status.jsonl"), `${status.map((sample) => JSON.stringify(sample)).join("\n")}\n`);
  writeFileSync(join(folder(label), "run.log"), ["admin endpoints listening", "node retries in 1000 ms (node-retrying, connect, attempt 1)", "processing stopped at 104"].join("\n"));
  writeFileSync(join(folder(label), "result.json"), run("summary.mjs", [folder(label)]).stdout);
}

/** The run folders every test below may read; a test that needs another writes it beside them and removes it. */
const RUNS = ["a", "b", "c"];

/** The cells of a line of `compare.mjs`, the run's name first; the chain's text after them is left out. */
const cells = (line: string, count: number): string[] => line.trim().split(/\s+/).slice(0, count);

beforeAll(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-bench-range-"));
  writeRun("a", "chain-end");
  writeRun("b", "chain-end");
  writeRun("c", "chain-other");
});
afterAll(() => rmSync(directory, { recursive: true, force: true }));

describe("the range bench's scripts hold nothing of one machine", () => {
  it("the folder holds the run, its readers, the comparisons and the machine and chain tools", () => {
    expect(FILES).toEqual(
      expect.arrayContaining([
        ...["run.sh", "lib.sh", "preflight.sh"],
        ...["summary.mjs", "compare.mjs", "analyze.mjs", "worker.mjs", "worker-time.mjs"],
        ...["equal.sh", "contents-hash.sh", "contents-hash.mjs", "tables.sh"],
        ...["txshare.mjs", "roundtrip.sh", "roundtrip.mjs", "profile.mjs"],
        "README.md",
      ]),
    );
  });

  it("no home directory, no private address, no password", () => {
    for (const file of FILES) {
      const text = readFileSync(join(SCRIPTS, file), "utf8");
      expect(text, file).not.toMatch(/\/Users\/|\/home\/[a-z]/);
      // Loopback is no machine's own; a private network's address is.
      expect(text, file).not.toMatch(/\b(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3}\b/);
      expect(text, file).not.toMatch(/PGPASSWORD=[^%$\s]/);
    }
  });

  it("no script writes the plain WebSocket scheme with a host, which the repository's code scan reports", () => {
    // .semgrepignore: the rule matches the scheme anywhere but before localhost, comments included; scanned code writes
    // "ws or wss://". The README is Markdown, which the scan leaves out.
    for (const file of FILES.filter((name) => /\.(?:sh|mjs)$/.test(name))) {
      expect(readFileSync(join(SCRIPTS, file), "utf8"), file).not.toMatch(/\bws:\/\/(?!localhost\b)/);
    }
  });

  it("every shell script parses", () => {
    for (const file of FILES.filter((name) => name.endsWith(".sh"))) {
      const parsed = spawnSync("bash", ["-n", join(SCRIPTS, file)], { encoding: "utf8" });
      expect(parsed.status, `${file}: ${parsed.stderr}`).toBe(0);
    }
  });

  it("npm run bench:range is run.sh", () => {
    const manifest = JSON.parse(readFileSync(fileURLToPath(new URL("../../package.json", import.meta.url)), "utf8")) as { scripts: Record<string, string> };
    expect(manifest.scripts["bench:range"]).toBe("bash bench/range/run.sh");
  });

  it("the scripts that need the machine's folder refuse without BENCH_DIR", () => {
    for (const script of ["run.sh", "equal.sh", "tables.sh", "contents-hash.sh", "roundtrip.sh", "preflight.sh"]) {
      const result = run(script, ["label", "100"]);
      expect(result.code, script).toBe(2);
      expect(result.stderr, script).toContain("set BENCH_DIR");
    }
  });

  it("run.sh refuses a wrong label, a wrong stop height, a missing node address, a missing or wrong template and a checkout that is not built", () => {
    const env = { BENCH_DIR: directory, BUILD: directory };
    expect(run("run.sh", ["label"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("usage: run.sh") });
    expect(run("run.sh", ["Bad_Label", "100"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("a label is lowercase letters, digits and -") });
    expect(run("run.sh", ["label", "10x"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("the stop height is a number") });
    expect(run("run.sh", ["label", "100"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("set UMBRADB_LOCAL_NODE") });
    const node = { ...env, UMBRADB_LOCAL_NODE: "ws://node.invalid:9944" };
    expect(run("run.sh", ["label", "100"], node)).toMatchObject({ code: 2, stderr: expect.stringContaining("set TEMPLATE") });
    expect(run("run.sh", ["label", "100"], { ...node, TEMPLATE: "a template; --" })).toMatchObject({ code: 2, stderr: expect.stringContaining("a template's name is lowercase letters, digits and _") });
    const refused = run("run.sh", ["label", "100"], { ...node, TEMPLATE: "template_at_100" });
    expect(refused).toMatchObject({ code: 2, stderr: expect.stringContaining("is not built") });
    // Refused before anything was created.
    expect(readdirSync(directory).sort()).toEqual(RUNS);
  });

  it("a label and a template's name are held to lowercase whatever the locale", () => {
    // bash before 5.0 (macOS's /bin/bash) matches a bracket range by the locale's collation, where a-z holds capitals.
    const env = { BENCH_DIR: directory, BUILD: directory, UMBRADB_LOCAL_NODE: "ws://node.invalid:9944", LC_ALL: "en_US.UTF-8" };
    const label = expect.stringContaining("a label is lowercase letters, digits and -");
    const template = expect.stringContaining("a template's name is lowercase letters, digits and _");
    expect(run("run.sh", ["Base", "100"], { ...env, TEMPLATE: "template_at_100" })).toMatchObject({ code: 2, stderr: label });
    expect(run("run.sh", ["base", "100"], { ...env, TEMPLATE: "Bench_SRC" })).toMatchObject({ code: 2, stderr: template });
    expect(run("run.sh", ["base", "100"], { ...env, TEMPLATE: "modèle" })).toMatchObject({ code: 2, stderr: template });
    expect(run("tables.sh", ["Base"], env)).toMatchObject({ code: 2, stderr: label });
    expect(readdirSync(directory).sort()).toEqual(RUNS);
  });

  it("txshare.mjs refuses without the node's address", () => {
    const result = run("txshare.mjs", []);
    expect(result.code).not.toBe(0);
    expect(result.stderr).toContain("set UMBRADB_LOCAL_NODE");
  });

  it("txshare.mjs refuses a height that is not a whole number, before it asks the node, in one line", () => {
    for (const height of ["12x", "-5", "1.5"]) {
      const result = run("txshare.mjs", [height], { UMBRADB_LOCAL_NODE: "ws://node.invalid:9944" });
      expect(result.code, height).toBe(1);
      expect(result.stderr.trimEnd(), height).toBe(`txshare.mjs: a height is a whole number: ${height}`);
    }
  });
});

describe("run.sh removes and drops only what a run made, and checks before it does", () => {
  // A machine's folder that holds a build, the password file at its default place and a run folder of run.sh's: its
  // marker names its label and its folder, every link resolved.
  let home = "";
  let build = "";
  beforeAll(() => {
    home = mkdtempSync(join(tmpdir(), "umbradb-bench-range-guard-"));
    build = join(home, "build");
    mkdirSync(join(build, "dist", "cli"), { recursive: true });
    writeFileSync(join(build, "dist", "cli", "main.js"), "");
    writeFileSync(join(home, "pg-password"), "not a password\n", { mode: 0o600 });
    mkdirSync(join(home, "old-run"));
    writeFileSync(join(home, "old-run", ".bench-run"), `a run folder of the range bench, bench/range/run.sh\nlabel old-run\nfolder ${realpathSync(join(home, "old-run"))}\n`);
    writeFileSync(join(home, "old-run", "package.json"), '{"type":"module","private":true}\n');
    writeFileSync(join(home, "old-run", "result.json"), "{}\n");
  });
  afterAll(() => rmSync(home, { recursive: true, force: true }));

  /** run.sh with this folder, a node's address, a template and a database container that does not exist. */
  const guarded = (label: string, env: Readonly<Record<string, string>> = {}): Ran =>
    run("run.sh", [label, "100"], { BENCH_DIR: home, BUILD: build, UMBRADB_LOCAL_NODE: "ws://node.invalid:9944", TEMPLATE: "template_at_100", BENCH_PG_CONTAINER: "umbradb-bench-test-no-such-container", ...env });
  const untouched = (): void => {
    expect(readdirSync(home).sort()).toEqual(["build", "old-run", "pg-password"]);
    expect(readFileSync(join(home, "pg-password"), "utf8")).toBe("not a password\n");
    expect(readdirSync(join(home, "old-run")).sort()).toEqual([".bench-run", "package.json", "result.json"]);
    expect(readFileSync(join(build, "dist", "cli", "main.js"), "utf8")).toBe("");
  };

  it("refuses a label whose folder holds the password file, or is not a run's", () => {
    expect(guarded("pg-password")).toMatchObject({ code: 2, stderr: expect.stringContaining("password file") });
    expect(guarded("build")).toMatchObject({ code: 2, stderr: expect.stringContaining("is not a run's folder") });
    untouched();
  });

  it("refuses a database name that could be a template's, another prefix's, or cut by PostgreSQL", () => {
    expect(guarded("base", { TEMPLATE: "bench_at_100" })).toMatchObject({ code: 2, stderr: expect.stringContaining("begins with the runs' prefix") });
    for (const prefix of ["bench; drop", "Bench_", "bench-"]) {
      expect(guarded("base", { BENCH_DB_PREFIX: prefix }), prefix).toMatchObject({ code: 2, stderr: expect.stringContaining("the database prefix") });
    }
    expect(guarded("a".repeat(60))).toMatchObject({ code: 2, stderr: expect.stringContaining("63 bytes") });
    expect(guarded("base", { STALL_LIMIT: "ten" })).toMatchObject({ code: 2, stderr: expect.stringContaining("STALL_LIMIT") });
    untouched();
  });

  it("checks the database container before it removes a run's folder", () => {
    expect(guarded("old-run")).toMatchObject({ code: 2, stderr: expect.stringContaining("umbradb-bench-test-no-such-container is not running") });
    untouched();
  });
});

describe("preflight.sh", () => {
  it("reads the password file's mode with GNU stat (Linux) and with BSD stat (macOS)", () => {
    const home = mkdtempSync(join(tmpdir(), "umbradb-bench-range-preflight-"));
    // GNU stat first in PATH where the machine's own is BSD's: GNU coreutils installs it as gstat.
    const gnu = spawnSync("bash", ["-c", "stat --version 2>/dev/null | grep -q GNU && echo system || command -v gstat"], { encoding: "utf8" }).stdout.trim();
    try {
      mkdirSync(join(home, "gnu"));
      if (gnu !== "" && gnu !== "system") symlinkSync(gnu, join(home, "gnu", "stat"));
      const line = (env: Readonly<Record<string, string>>): string | undefined =>
        run("preflight.sh", [], { BENCH_DIR: home, BENCH_PG_CONTAINER: "umbradb-bench-test-no-such-container", ...env }).stdout.split("\n").find((text) => text.includes("password file"));
      const paths: [string, Record<string, string>][] = [["the machine's stat", {}], ...(gnu === "" ? [] : [["GNU stat", { PATH: `${join(home, "gnu")}:${process.env.PATH ?? ""}` }] as [string, Record<string, string>]])];
      for (const [which, env] of paths) {
        writeFileSync(join(home, "pg-password"), "not a password\n", { mode: 0o600 });
        chmodSync(join(home, "pg-password"), 0o600);
        expect(line(env), which).toBe("PASS  the password file exists with mode 600");
        chmodSync(join(home, "pg-password"), 0o644);
        expect(line(env), which).toBe("FAIL  the password file exists with mode 600");
      }
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });
});

describe("the scripts that read a run folder", () => {
  it("summary.mjs: heights per second from the first to the last sample whose cursor moved", () => {
    expect(JSON.parse(readFileSync(join(folder("a"), "result.json"), "utf8"))).toEqual({
      from: 100,
      to: 104,
      heights: 4,
      seconds: 2,
      heightsPerSecond: 2,
      msPerHeight: 500,
      endState: "stopped",
      reason: null,
      nodeRetries: 1,
    });
  });

  it("compare.mjs: stage means, keys read, and whether the chains of step outputs are equal", () => {
    const same = run("compare.mjs", [folder("a"), folder("b")]);
    expect(same.code).toBe(0);
    const [header, first, second] = same.stdout.trimEnd().split("\n") as [string, string, string];
    // No run's trace has a key of a column printed only where it is: the header ends with the chain's.
    expect(header.trim().split(/\s+/)).toEqual(["run", "h/s", "ms/blk", "own", "h/s", "own", "wait", "apply", "reclaim", "blk-tx", "cnt-wr", "stmts", "reads", "cnt-keys", "row-keys", "retries", "step", "chain"]);
    // The first height of a run is left out: the means are over heights 101 to 104, which took 60 ms. Of them 10 ms
    // were waits for the block or the node (9 ms for the blocks, 1 ms for a root), so the build's own are 12.5 ms per
    // block, and the apply is counted without the root wait.
    expect(cells(first, 15)).toEqual(["a", "2", "500", "80.00", "12.50", "2.50", "4.50", "3.50", "4.00", "2.00", "20.00", "4.0", "30", "10", "1"]);
    expect(first).toContain("chain-end same (h 104, stopped)");
    expect(second).toContain("chain-end same (h 104, stopped)");
    // Two runs of the same heights that did the same show no difference: every cell after the name is equal.
    expect(cells(second, 15).slice(1)).toEqual(cells(first, 15).slice(1));
    const different = run("compare.mjs", [folder("a"), folder("c")]);
    expect(different.code).toBe(1);
    expect(different.stdout).toContain("chain-other DIFFERENT");
  });

  it("compare.mjs: a column whose key only some traces have is printed for them, with n/a for the others", () => {
    // A build that applies blocks ahead of their turn records it per height: used at two of the four heights after
    // the first, one result dropped. Keys read under a name another build adds are counted with the stored keys.
    const ahead = (line: Line, index: number): Line => ({
      ...line,
      aheadUsed: index === 1 || index === 2 ? 1 : 0,
      ...(index === 3 ? { aheadDropped: 1 } : {}),
      reads: [...(line.reads as unknown[]), ["missing", 5, 0.1, 5]],
    });
    writeRun("ahead", "chain-end", ahead);
    // A run of such a build that dropped nothing never wrote the key of a drop: its count is 0, not unknown.
    writeRun("kept", "chain-end", (line) => ({ ...line, aheadUsed: 1 }));
    try {
      const result = run("compare.mjs", [folder("a"), folder("ahead"), folder("kept")]);
      expect(result.code).toBe(0);
      const [header, first, second, third] = result.stdout.trimEnd().split("\n") as [string, string, string, string];
      expect(header.trim().split(/\s+/).slice(16)).toEqual(["ahead", "dropped", "step", "chain"]);
      expect(cells(first, 17).slice(15)).toEqual(["n/a", "n/a"]);
      expect(cells(second, 17).slice(11)).toEqual(["5.0", "30", "15", "1", "50.0", "1"]);
      expect(cells(third, 17).slice(15)).toEqual(["100.0", "0"]);
      // Alone, the run without the keys has neither column.
      expect(run("compare.mjs", [folder("a")]).stdout).not.toMatch(/ahead|dropped/);
    } finally {
      for (const label of ["ahead", "kept"]) rmSync(folder(label), { recursive: true, force: true });
    }
  });

  it("negative control: compare.mjs shows where two runs differ, and nowhere else", () => {
    // The same heights and the same steps, by a build whose reclamation step takes twice as long, sends twice the
    // statements and asks for half the count keys: each height ends 3 ms later than in run a.
    const slower = (line: Line): Line => ({
      ...line,
      stepMs: 6,
      sqlN: 40,
      reads: (line.reads as [string, number, number, number][]).map(([kind, asked, ms, found]) => [kind, kind === "counts" ? asked / 2 : asked, ms, found]),
    });
    writeRun("slower", "chain-end", slower, [0, 13, 36, 49, 72]);
    try {
      const result = run("compare.mjs", [folder("a"), folder("slower")]);
      // The chains are equal: the two runs computed the same steps, at another speed.
      expect(result.code).toBe(0);
      const [header, first, second] = result.stdout.trimEnd().split("\n") as [string, string, string];
      // "own h/s" is one column: the header has one word more than a line has cells before it.
      const names = ["run", "h/s", "ms/blk", "own h/s", "own", "wait", "apply", "reclaim", "blk-tx", "cnt-wr", "stmts", "reads", "cnt-keys", "row-keys", "retries"];
      expect(header.trim().split(/\s+/).slice(0, 16).join(" ")).toBe(names.join(" "));
      const [base, changed] = [cells(first, 15), cells(second, 15)];
      const differing = names.filter((_, column) => column > 0 && base[column] !== changed[column]);
      expect(differing).toEqual(["own h/s", "own", "reclaim", "stmts", "cnt-keys"]);
      const of = (name: string): [string | undefined, string | undefined] => [base[names.indexOf(name)], changed[names.indexOf(name)]];
      expect(of("own")).toEqual(["12.50", "15.50"]);
      expect(of("own h/s")).toEqual(["80.00", "64.52"]);
      expect(of("reclaim")).toEqual(["3.50", "6.50"]);
      expect(of("stmts")).toEqual(["20.00", "40.00"]);
      expect(of("cnt-keys")).toEqual(["30", "15"]);
      expect(second).toContain("chain-end same");
      // With another chain as well, the run is marked and the script fails.
      rmSync(folder("slower"), { recursive: true, force: true });
      writeRun("slower", "chain-slower", slower, [0, 13, 36, 49, 72]);
      const marked = run("compare.mjs", [folder("a"), folder("slower")]);
      expect(marked.code).toBe(1);
      expect(marked.stdout).toContain("chain-slower DIFFERENT (h 104, stopped)");
      expect(marked.stdout).toContain("chain-end same (h 104, stopped)");
    } finally {
      rmSync(folder("slower"), { recursive: true, force: true });
    }
  });

  it("negative control: compare.mjs takes out a wait for the node that every block has, not only the part above the usual one", () => {
    // The same heights by the same build, with a node that answers each block 20 ms later: each height ends 20 ms later
    // than in run a, and all of it was the wait for the block.
    writeRun("delayed", "chain-end", (line) => ({ ...line, beginMs: (line.beginMs as number) + 20 }), [0, 30, 70, 100, 140]);
    try {
      const result = run("compare.mjs", [folder("a"), folder("delayed")]);
      expect(result.code, result.stderr).toBe(0);
      const [, first, second] = result.stdout.trimEnd().split("\n") as [string, string, string];
      const names = ["run", "h/s", "ms/blk", "own h/s", "own", "wait", "apply", "reclaim", "blk-tx", "cnt-wr", "stmts", "reads", "cnt-keys", "row-keys", "retries"];
      const [base, delayed] = [cells(first, 15), cells(second, 15)];
      // h/s and ms/blk are the status samples' (the same file in both runs); of the trace's columns only the wait moves.
      expect(names.filter((_, column) => column > 0 && base[column] !== delayed[column])).toEqual(["wait"]);
      expect(Number(delayed[names.indexOf("wait")]) - Number(base[names.indexOf("wait")])).toBe(20);
    } finally {
      rmSync(folder("delayed"), { recursive: true, force: true });
    }
  });

  it("compare.mjs: the reclamation's time is its collect, its step and its eviction, and a key a run lacks prints n/a, not 0", () => {
    // A build that collects at every height and runs the step at a batch's last height only, and a build that records
    // neither the block's transaction nor the reclamation.
    writeRun("batched", "chain-end", ({ stepMs: _step, evictMs: _evict, ...line }, index) => ({ ...line, collectMs: 1, ...(index === 4 ? { stepMs: 8, evictMs: 2 } : {}) }));
    writeRun("bare", "chain-end", ({ txMs: _tx, stepMs: _step, evictMs: _evict, ...line }) => line);
    try {
      const result = run("compare.mjs", [folder("a"), folder("batched"), folder("bare")]);
      expect(result.code, result.stderr).toBe(0);
      const [, ...lines] = result.stdout.trimEnd().split("\n");
      const names = ["run", "h/s", "ms/blk", "own h/s", "own", "wait", "apply", "reclaim", "blk-tx", "cnt-wr", "stmts", "reads", "cnt-keys", "row-keys", "retries"];
      const of = (name: string): (string | undefined)[] => lines.map((line) => cells(line, 15)[names.indexOf(name)]);
      // a: 3 + 0.5 a height; batched: 1 a height and 8 + 2 at the last, over four heights; bare: none of the three.
      expect(of("reclaim")).toEqual(["3.50", "3.50", "n/a"]);
      expect(of("blk-tx")).toEqual(["4.00", "4.00", "n/a"]);
    } finally {
      for (const label of ["batched", "bare"]) rmSync(folder(label), { recursive: true, force: true });
    }
  });

  it("analyze.mjs: stages by kind of block, the step's reads, the statements", () => {
    const result = run("analyze.mjs", [folder("a")]);
    expect(result.code, result.stderr).toBe(0);
    expect(result.stdout).toContain("== all: 4 blocks");
    expect(result.stdout).toContain("== empty: 3 blocks");
    expect(result.stdout).toContain("== empty, after an empty block: 2 blocks");
    expect(result.stdout).toContain("== empty, after a block with transactions: 1 blocks");
    expect(result.stdout).toContain("== with transactions: 1 blocks");
    expect(result.stdout).toContain("transaction share 0.250");
    expect(result.stdout).toMatch(/counts\s+1\.00 calls\/block/);
    // The statements' totals are over every height of the run, the first included: 5 COMMITs in 5 heights.
    expect(result.stdout).toContain("total: 1.0 statements/block");
    // The stages of all blocks: 60 ms over four heights, of which the reclamation step is 3 ms a block.
    expect(result.stdout).toMatch(/^ {2}total\s+mean\s+15\.00\s+p50\s+10\.00/m);
    expect(result.stdout).toMatch(/^ {2}stepMs\s+mean\s+3\.00\s+p50\s+3\.00\s+p90\s+3\.00\s+share\s+20\.0%$/m);
  });

  it("analyze.mjs: a stage is printed only where the trace has its key", () => {
    writeRun("no-evict", "chain-end", ({ evictMs: _evict, ...line }) => line);
    try {
      expect(run("analyze.mjs", [folder("a")]).stdout).toMatch(/^ {2}evictMs\s+mean\s+0\.50/m);
      const result = run("analyze.mjs", [folder("no-evict")]);
      expect(result.code, result.stderr).toBe(0);
      expect(result.stdout).not.toContain("evictMs");
      expect(result.stdout).toMatch(/^ {2}stepMs\s+mean\s+3\.00/m);
    } finally {
      rmSync(folder("no-evict"), { recursive: true, force: true });
    }
  });

  it("analyze.mjs: the reclamation's collect, and a stage it does not know, are printed where the trace has them", () => {
    writeRun("more", "chain-end", (line) => ({ ...line, collectMs: 1, laterMs: 2 }));
    try {
      const result = run("analyze.mjs", [folder("more")]);
      expect(result.code, result.stderr).toBe(0);
      expect(result.stdout).toMatch(/^ {2}collectMs\s+mean\s+1\.00/m);
      expect(result.stdout).toMatch(/^ {2}laterMs\s+mean\s+2\.00/m);
      // In a block's order: the collect before the step.
      expect(result.stdout.indexOf("  collectMs")).toBeLessThan(result.stdout.indexOf("  stepMs"));
    } finally {
      rmSync(folder("more"), { recursive: true, force: true });
    }
  });

  it("worker.mjs: a phase it does not know is printed, and a run without a phase's key shows n/a, not 0", () => {
    writeRun("w2", "chain-end");
    try {
      // The same worker lines with a phase another build adds, and without flush.
      const lines = readFileSync(join(folder("w2"), "trace.jsonl.worker.jsonl"), "utf8").trimEnd().split("\n").map((line) => {
        const { flush: _flush, ...rest } = JSON.parse(line) as Line;
        return JSON.stringify({ ...rest, verify: 2 });
      });
      writeFileSync(join(folder("w2"), "trace.jsonl.worker.jsonl"), `${lines.join("\n")}\n`);
      const result = run("worker.mjs", [folder("a"), folder("w2")], { SKIP: "0" });
      expect(result.code, result.stderr).toBe(0);
      const row = (name: string): string[] => (result.stdout.split("\n").find((line) => line.startsWith(`${name} `)) ?? "").trim().split(/\s+/);
      expect(row("verify")).toEqual(["verify", "n/a", "|", "2.00", "2.00", "2.00"]);
      expect(row("flush")).toEqual(["flush", "0.50", "0.50", "0.50", "|", "n/a"]);
    } finally {
      rmSync(folder("w2"), { recursive: true, force: true });
    }
  });

  it("worker.mjs: the phases of the worker's apply, by kind of block, a phase only where the trace has its key", () => {
    const result = run("worker.mjs", [folder("a")], { SKIP: "0" });
    expect(result.code, result.stderr).toBe(0);
    const row = (name: string): string[] => (result.stdout.split("\n").find((line) => line.startsWith(name)) ?? "").trim().split(/\s+/);
    expect(row("adapterApply")).toEqual(["adapterApply", "1.00", "9.00", "9.00"]);
    expect(row("stateApply")).toEqual(["stateApply", "0.00", "5.00", "5.00"]);
    expect(row("apply ")).toEqual(["apply", "2.00", "10.00", "10.00"]);
    expect(result.stdout).toContain("4/1, 1");
    // The run's worker lines hold four phases: no line for the others.
    const printed = result.stdout.split("\n").slice(2, -3).map((line) => line.trim().split(/\s+/)[0]);
    expect(printed).toEqual(["adapterApply", "stateApply", "settle", "flush"]);
    // Limited to the heights after the block with a transaction.
    expect(run("worker.mjs", [folder("a")], { SKIP: "0", FROM: "103" }).stdout).toContain("2/0, 0");
  });

  it("worker.mjs: a block's apply is its phases added up, so the apply's median is the median of those sums", () => {
    // Three blocks with transactions whose (adapterApply, settle) are (1, 9), (9, 1) and (10, 10): applies of 10, 10
    // and 20 ms, whose median is 10. The phases' own medians, 9 and 9, add up to 18, no block's apply.
    mkdirSync(folder("three"));
    try {
      const lines = [[1, 9], [9, 1], [10, 10]].map(([adapterApply, settle], index) => JSON.stringify({ h: 100 + index, tx: 1, adapterApply, settle }));
      writeFileSync(join(folder("three"), "trace.jsonl.worker.jsonl"), `${lines.join("\n")}\n`);
      const result = run("worker.mjs", [folder("three")], { SKIP: "0" });
      expect(result.code, result.stderr).toBe(0);
      const row = (name: string): string[] => (result.stdout.split("\n").find((line) => line.startsWith(name)) ?? "").trim().split(/\s+/);
      // No empty block: its mean is left blank. With transactions: mean 13.33, median 10.
      expect(row("apply ")).toEqual(["apply", "13.33", "10.00"]);
      expect(row("adapterApply")).toEqual(["adapterApply", "6.67", "9.00"]);
    } finally {
      rmSync(folder("three"), { recursive: true, force: true });
    }
  });

  it("worker-time.mjs: where the worker's time went between two applied blocks, adding up to its span, and the main thread's side", () => {
    // Its own folder: the tests above count the folders of `directory`.
    const runs = mkdtempSync(join(tmpdir(), "umbradb-bench-range-worker-time-"));
    try {
      const write = (label: string, worker: readonly object[], blocks: readonly object[]): string => {
        mkdirSync(join(runs, label));
        writeFileSync(join(runs, label, "trace.jsonl.worker.jsonl"), `${worker.map((line) => JSON.stringify(line)).join("\n")}\n`);
        writeFileSync(join(runs, label, "trace.jsonl"), `${blocks.map((line) => JSON.stringify(line)).join("\n")}\n`);
        return join(runs, label);
      };
      // Three applied blocks, the second with transactions. Its apply waited 3.5 ms for stored nodes inside its two
      // stages and its load 2 ms; 4 ms of its garbage collections were reported late, in the entry after it. In the
      // first and the last, 0.5 ms are in no request and not idle.
      const apply = { "rqN.apply": 1, "rq.apply": 4, adapterApply: 2, settle: 1, "post.apply": 0.5 };
      const worker = [
        { h: 100, tx: 0, spanMs: 10, ...apply, "rq.commit": 1, "rqN.commit": 1, "post.commit": 0.25, idleMs: 4.5, transitMs: 0.5, queuedMs: 2, gcMs: 1, gcN: 1 },
        {
          h: 101,
          tx: 2,
          spanMs: 20,
          ...{ "rqN.apply": 1, "rq.apply": 12, adapterApply: 8, stateApply: 6, settle: 2, "post.apply": 0.5 },
          ...{ "node.adapterApply": 3, "node.stateApply": 3, "node.settle": 0.5, "node.rq.apply": 3.5 },
          ...{ "rqN.parse": 1, "rq.parse": 2, parse: 1.5, "post.parse": 0.25 },
          ...{ "rqN.load": 1, "rq.load": 3, "node.rq.load": 2 },
          ...{ nodeWaitMs: 5.5, nodeWaits: 4, nodeGets: 10, nodeGot: 8 },
          ...{ idleMs: 3, transitMs: 1, queuedMs: 6, gcMs: 2, gcN: 1, gcMajorMs: 2 },
        },
        { h: 102, tx: 0, spanMs: 10, ...apply, idleMs: 5.5, transitMs: 0.5, queuedMs: 0, "gcOf.101": 4, "gcNOf.101": 2 },
      ];
      // `collectMs` is a key a later build's reclamation adds: where a trace has it, it counts in the step's line.
      // `laterMs` is a key this reader does not know: it is printed, not dropped.
      const block = { beginMs: 1, txMs: 2, collectMs: 0.5, stepMs: 1, evictMs: 0.5, sqlMs: 3, encMs: 0.25, decMs: 0.25, backMs: 0.5, laterMs: 0.5, "rtN.apply": 1 };
      const blocks = [
        { h: 99, t: 0 },
        { h: 100, t: 10, tx: 0, ...block, applyMs: 3, rootWaitMs: 0, "rt.apply": 4, "rt.commit": 1, "rtN.commit": 1 },
        { h: 101, t: 40, tx: 2, ...block, applyMs: 14, rootWaitMs: 2, "rt.apply": 13, nodeNoticeMs: 1, nodeReadMs: 4, nodeReads: 4 },
        { h: 102, t: 50, tx: 0, ...block, applyMs: 3, rootWaitMs: 0, "rt.apply": 4, "rt.commit": 1, "rtN.commit": 1 },
      ];
      const result = run("worker-time.mjs", [write("w", worker, blocks)], { SKIP: "0" });
      expect(result.code, result.stderr).toBe(0);
      const [ofWorker, ofMain] = result.stdout.split("== w: the main thread") as [string, string];
      /** The numbers of the first line of `text` named `name`: all blocks, empty blocks, blocks with transactions. */
      const row = (text: string, name: string): number[] =>
        (text.split("\n").find((line) => line.trimStart().startsWith(name)) ?? "").slice(32).replace(/%/g, "").trim().split(/\s+/).map(Number);
      expect(ofWorker).toContain("== w: the worker's time, ms per applied block (heights 100 to 102");
      expect(row(ofWorker, "blocks")).toEqual([3, 2, 1]);
      // Mean ms per block for all, empty and with transactions, then the share of the span over all blocks.
      const parts: Record<string, number[]> = {
        adapterApply: [3, 2, 5],
        settle: [1.167, 1, 1.5],
        "apply, rest": [0.833, 0.5, 1.5],
        "parse, the phase": [0.5, 0, 1.5],
        "parse, rest": [0.083, 0, 0.25],
        commit: [0.25, 0.375, 0],
        load: [0.333, 0, 1],
        "posting answers": [0.667, 0.625, 0.75],
        "node waits": [1.833, 0, 5.5],
        transit: [0.667, 0.5, 1],
        idle: [3.667, 4.5, 2],
        unaccounted: [0.333, 0.5, 0],
      };
      expect(row(ofWorker, "span")).toEqual([13.333, 10, 20, 100]);
      for (const [name, expected] of Object.entries(parts)) {
        const found = row(ofWorker, name);
        expect(found.slice(0, 3), name).toEqual(expected);
        // The fourth number is the line's share of the span over all blocks, in percent to one decimal.
        expect(Math.abs((found[3] as number) - (100 * (expected[0] as number)) / 13.333), `${name}'s share`).toBeLessThan(0.06);
      }
      // The lines add up to the span, in each column.
      for (const column of [0, 1, 2]) {
        expect(Object.values(parts).reduce((sum, found) => sum + (found[column] as number), 0), `column ${column}`).toBeCloseTo(row(ofWorker, "span")[column] as number, 2);
      }
      // Apart, since they overlap the lines above; the collections reported late are counted in the block they ran in.
      expect(row(ofWorker, "queued")).toEqual([2.667, 1, 6, 20]);
      expect(row(ofWorker, "garbage collection ")).toEqual([2.333, 0.5, 6, 17.5]);
      expect(row(ofWorker, "of it major")).toEqual([0.667, 0, 2, 5]);
      expect(row(ofWorker, "garbage collections")).toEqual([1.333, 0.5, 3]);
      expect(row(ofWorker, "apply requests")).toEqual([1, 1, 1]);
      expect(row(ofWorker, "load requests")).toEqual([0.333, 0, 1]);
      expect(row(ofWorker, "nodes asked of the store")).toEqual([3.333, 0, 10]);
      expect(ofWorker).toContain("node waits: 4 of 1.375 ms each; by where they fell, ms per block: adapterApply 1.000, settle 0.167, load 0.667, other 0.000");
      expect(ofWorker).toContain("the worker is waiting for work: it had no request to run for 32.5% of its span (transit included)");
      expect(ofWorker).toContain("unaccounted: 2.50% of the span over all blocks (3.70% of the time it was not idle), at most 5.0% of one block's");

      // The main thread: the run's first line only dates the second; three blocks of 10, 30 and 10 ms.
      expect(ofMain).toContain("ms per committed block (heights 100 to 102");
      expect(row(ofMain, "blocks")).toEqual([3, 2, 1]);
      expect(row(ofMain, "the block, by the clock")).toEqual([16.667, 10, 30, 100]);
      expect(row(ofMain, "wait for the block")).toEqual([1, 1, 1, 6]);
      // The apply as the main thread waited for it, without the wait for the node's root.
      expect(row(ofMain, "wait for the worker's apply")).toEqual([6, 3, 12, 36]);
      expect(row(ofMain, "wait for the node's root")).toEqual([0.667, 0, 2, 4]);
      expect(row(ofMain, "reclamation step")).toEqual([2, 2, 2, 12]);
      expect(row(ofMain, "the block's transaction")).toEqual([2, 2, 2, 12]);
      expect(row(ofMain, "statements, client time")).toEqual([3, 3, 3, 18]);
      expect(row(ofMain, "answers' way back")).toEqual([0.5, 0.5, 0.5, 3]);
      expect(row(ofMain, "node requests, to notice")).toEqual([0.333, 0, 1, 2]);
      expect(row(ofMain, "node requests, to read")).toEqual([1.333, 0, 4, 8]);
      expect(row(ofMain, "laterMs")).toEqual([0.5, 0.5, 0.5, 3]);
      expect(row(ofMain, "apply ")).toEqual([7, 4, 13, 42]);
      expect(row(ofMain, "commit ")).toEqual([0.667, 1, 0, 4]);
      expect(row(ofMain, "apply answers")).toEqual([1, 1, 1]);
      expect(row(ofMain, "node requests ")).toEqual([1.333, 0, 4]);

      // Limited to the block with transactions; and a worker with no time to spare is called saturated.
      const limited = run("worker-time.mjs", [join(runs, "w")], { SKIP: "0", FROM: "101", TO: "101" });
      expect(row(limited.stdout, "blocks")).toEqual([1, 0, 1]);
      expect(row(limited.stdout, "span")[0]).toBe(20);
      const busy = write("busy", [{ h: 1, tx: 0, spanMs: 10, "rq.apply": 9.75, "rqN.apply": 1, idleMs: 0.25 }], [{ h: 0, t: 0 }, { h: 1, t: 10, tx: 0 }]);
      expect(run("worker-time.mjs", [busy], { SKIP: "0" }).stdout).toContain("the worker is saturated: it had no request to run for 2.5% of its span");

      // Nothing to read after the warm-up: said, not a table of nothing.
      expect(run("worker-time.mjs", [busy])).toMatchObject({ code: 1, stdout: expect.stringContaining("== busy: no applied block after the first 20") });

      // A run whose worker lines have no span is named and nothing is made up for it; the runs after it are still
      // read.
      const old = run("worker-time.mjs", [folder("a"), busy], { SKIP: "0" });
      expect(old.code).toBe(1);
      expect(old.stdout).toContain("== a: its worker entries have no spanMs");
      expect(old.stdout).toContain("== busy: the worker's time");
    } finally {
      rmSync(runs, { recursive: true, force: true });
    }
  });

  it("a run stopped mid-write: a last line cut in half is left out and said, and the rest is read as it would be", () => {
    writeRun("cut1", "chain-end");
    writeRun("cut2", "chain-end");
    try {
      for (const file of ["trace.jsonl", "trace.jsonl.worker.jsonl"]) appendFileSync(join(folder("cut1"), file), '{"h":105,"t":7');
      for (const script of ["compare.mjs", "analyze.mjs", "worker.mjs", "worker-time.mjs"]) {
        const whole = run(script, [folder("cut2")], { SKIP: "0" });
        const cut = run(script, [folder("cut1")], { SKIP: "0" });
        expect(cut.code, script).toBe(whole.code);
        // The run's name is its folder's: the rest of the output is the same.
        expect(cut.stdout.replaceAll("cut1", "cut2"), script).toBe(whole.stdout);
        expect(cut.stderr, script).toMatch(/last line \(\d+\) is cut/);
        expect(cut.stderr, script).not.toMatch(/^\s+at /m);
      }
    } finally {
      for (const label of ["cut1", "cut2"]) rmSync(folder(label), { recursive: true, force: true });
    }
  });

  it("a run that did not end well: each reader ends with one line naming what is missing, not a stack", () => {
    mkdirSync(folder("broken"));
    try {
      // An empty trace and worker file, and a status file whose cursor never moved.
      for (const file of ["trace.jsonl", "trace.jsonl.worker.jsonl"]) writeFileSync(join(folder("broken"), file), "");
      writeFileSync(join(folder("broken"), "result.json"), "");
      writeFileSync(join(folder("broken"), "status.jsonl"), `${JSON.stringify({ at: 1, status: { state: "running", cursor: "100" } })}\n${JSON.stringify({ at: 2, status: { state: "halted", cursor: "100", reason: "node" } })}\n`);
      for (const script of ["compare.mjs", "analyze.mjs", "worker.mjs", "worker-time.mjs", "summary.mjs"]) {
        const result = run(script, [folder("broken")], { SKIP: "0" });
        expect(result.code, script).toBe(1);
        expect(result.stderr.trimEnd().split("\n"), script).toHaveLength(1);
        expect(result.stderr, script).toMatch(new RegExp(`^${script.replace(".", "\\.")}: `));
        expect(result.stderr, script).toContain(script === "summary.mjs" ? "committed no height" : "holds no line");
      }
      // No status file at all: named.
      rmSync(join(folder("broken"), "status.jsonl"));
      expect(run("summary.mjs", [folder("broken")])).toMatchObject({ code: 1, stderr: expect.stringContaining("status.jsonl") });
      // A trace of one height: after the first, left out, nothing is left to read, which is said, not Infinity or NaN.
      writeFileSync(join(folder("broken"), "trace.jsonl"), `${readFileSync(join(folder("a"), "trace.jsonl"), "utf8").split("\n")[0]}\n`);
      writeFileSync(join(folder("broken"), "result.json"), readFileSync(join(folder("a"), "result.json"), "utf8"));
      for (const script of ["compare.mjs", "analyze.mjs"]) {
        const result = run(script, [folder("broken")]);
        expect(result.code, script).toBe(1);
        expect(result.stdout, script).not.toMatch(/Infinity|NaN/);
        expect(result.stderr, script).toContain("one height");
      }
    } finally {
      rmSync(folder("broken"), { recursive: true, force: true });
    }
  });

  it("compare.mjs takes a run's chain from its last line that has one, and says when a run has none", () => {
    // A build that works in batches writes the chain at a batch's last height only: here the last height has none.
    writeRun("no-last", "chain-end", (line, index) => (index === 4 ? (({ sh: _sh, ...rest }) => rest)(line) : line));
    writeRun("none", "chain-end", ({ sh: _sh, ...line }) => line);
    try {
      const result = run("compare.mjs", [folder("a"), folder("no-last"), folder("none")]);
      expect(result.code).toBe(1);
      const [, first, second, third] = result.stdout.trimEnd().split("\n") as [string, string, string, string];
      expect(first).toContain("chain-end same (h 104, stopped)");
      // Its chain at height 103 is not the first run's at 104.
      expect(second).toContain("chain-103 DIFFERENT (h 103, stopped)");
      expect(third).toContain("no chain (stopped)");
      expect(result.stdout).not.toContain("undefined");
      // A first run with no chain: nothing is said to be the same.
      const reversed = run("compare.mjs", [folder("none"), folder("a")]);
      expect(reversed.code).toBe(1);
      expect(reversed.stdout).not.toMatch(/\bsame\b|undefined/);
    } finally {
      for (const label of ["no-last", "none"]) rmSync(folder(label), { recursive: true, force: true });
    }
  });

  it("profile.mjs: self time by function of a run's CPU profiles", () => {
    const profile = {
      nodes: [
        { id: 1, callFrame: { functionName: "step", url: "file:///build/dist/backbone/refcount.js", lineNumber: 9 } },
        { id: 2, callFrame: { functionName: "", url: "", lineNumber: 0 } },
      ],
      samples: [1, 2, 1],
      timeDeltas: [1_000, 500, 2_000],
    };
    writeFileSync(join(folder("a"), "main.cpuprofile"), JSON.stringify(profile));
    const result = run("profile.mjs", [folder("a")]);
    expect(result.code, result.stderr).toBe(0);
    expect(result.stdout).toContain("== main.cpuprofile: 4 ms sampled");
    expect(result.stdout).toMatch(/3 ms\s+85\.7%\s+step dist\/backbone\/refcount\.js:10/);
  });
});

describe("on small databases in a PostgreSQL container of this file's own", () => {
  let container: StartedPostgreSqlContainer | undefined;

  /** Runs `sql` in `database` of the container, the way the bench's scripts do, and gives what it printed. */
  const psql = (database: string, sql: string): string => {
    const done = spawnSync("docker", ["exec", "-i", (container as StartedPostgreSqlContainer).getId(), "psql", "-U", "postgres", "-q", "-At", "-v", "ON_ERROR_STOP=1", "-d", database], { encoding: "utf8", input: sql });
    if (done.status !== 0) throw new Error(`psql in ${database}: ${done.stderr}`);
    return done.stdout;
  };

  /**
   * A database of the bench's prefix with two tables of a core schema, one of a module's, and one of a schema the
   * comparison does not read.
   */
  const database = (label: string, more: string): void => {
    // A run's database is the prefix and its label with - as _ (`lib.sh`).
    const name = `bench_${label.replaceAll("-", "_")}`;
    psql("postgres", `CREATE DATABASE ${name}`);
    psql(
      name,
      `CREATE SCHEMA core_demo; CREATE SCHEMA contract_demo; CREATE SCHEMA other;
       CREATE TABLE core_demo.blocks (height bigint PRIMARY KEY, hash bytea NOT NULL);
       CREATE TABLE core_demo.nodes (node_key bytea PRIMARY KEY, children bytea[] NOT NULL);
       CREATE TABLE contract_demo.states (address text PRIMARY KEY, state bytea);
       CREATE TABLE other.notes (note text);
       INSERT INTO core_demo.blocks VALUES (1, '\\x01'), (2, '\\x02'), (3, '\\x03');
       INSERT INTO core_demo.nodes VALUES ('\\xaa', '{}'), ('\\xbb', ARRAY['\\xaa'::bytea]);
       INSERT INTO contract_demo.states VALUES ('one', '\\x10'), ('two', NULL);
       ${more}`,
    );
  };

  /** A recorded revision of the `core` entry: its start, its version as `core_chain.config` holds it, its data fields. */
  interface Revision {
    readonly start: number;
    readonly version: string;
    readonly data: object;
  }

  /** A template run.sh can clone: the tables of `core_chain.config` and `core_block_commit.blocks` it reads. */
  const template = (name: string, revisions: readonly Revision[], cursor = 100): void => {
    psql("postgres", `CREATE DATABASE ${name}`);
    const rows = revisions.map(({ start, version, data }) => `('core', ${start}, '${version}', '${JSON.stringify(data)}', '{}')`);
    psql(
      name,
      `CREATE SCHEMA core_chain; CREATE SCHEMA core_block_commit;
       CREATE TABLE core_chain.config (entry_id text NOT NULL, start bigint NOT NULL, stop bigint, version text NOT NULL, data jsonb, data_hash bytea, provides text[] NOT NULL, PRIMARY KEY (entry_id, start));
       CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY);
       INSERT INTO core_chain.config (entry_id, start, version, data, provides) VALUES ${rows.join(", ")};
       INSERT INTO core_block_commit.blocks VALUES (${cursor});`,
    );
  };

  /** A sample of `/status` as the process answers it. */
  const sample = (state: string, cursor: number, reason: unknown = null): object => ({ state, cursor: String(cursor), reason, modules: [] });

  /**
   * A machine for run.sh: a folder with a build, the password file at its default place, and a stand-in for the run's
   * container first in PATH, as `docker` and `curl`. A docker command that names no run container goes to docker, so
   * the database container, its databases and run.sh's statements are real; no run is made. The run's container
   * answers `/status` with the samples `play` gives, one per request; once they are served it keeps the last answer
   * until it is stopped (`stays`), or it ends at once (`dies`). Stopped or ended, it exited with `exit`. Every docker
   * command is logged in `calls.log`; the env file a command names is never read.
   */
  const machine = () => {
    const home = mkdtempSync(join(tmpdir(), "umbradb-bench-range-machine-"));
    const bin = join(home, ".stand-in");
    const docker = spawnSync("bash", ["-c", "command -v docker"], { encoding: "utf8" }).stdout.trim();
    mkdirSync(join(home, "build", "dist", "cli"), { recursive: true });
    writeFileSync(join(home, "build", "dist", "cli", "main.js"), "");
    writeFileSync(join(home, "pg-password"), "not a password\n", { mode: 0o600 });
    mkdirSync(bin);
    writeFileSync(
      join(bin, "docker"),
      `#!/bin/bash
S="${bin}"
printf '%s\\n' "$*" >> "$S/calls.log"
case " $* " in *" umbradb-bench-run-"*) ;; *) exec "${docker}" "$@";; esac
served="$(cat "$S/served" 2>/dev/null || echo 0)"
if [ "$(cat "$S/end")" = dies ] && [ "$served" -ge "$(wc -l < "$S/status.jsonl" | tr -d ' ')" ]; then rm -f "$S/running"; fi
case "$1" in
  run) touch "$S/running" "$S/created"; echo stand-in;;
  port) [ -f "$S/running" ] && echo 127.0.0.1:1;;
  inspect)
    [ -f "$S/created" ] || { echo "Error: No such object" >&2; exit 1; }
    case "$3" in
      *Running*) if [ -f "$S/running" ]; then echo true; else echo false; fi;;
      *) if [ -f "$S/running" ]; then echo '{"Status":"running","Running":true,"ExitCode":0,"OOMKilled":false,"Error":""}'; else printf '{"Status":"exited","Running":false,"ExitCode":%s,"OOMKilled":false,"Error":""}\\n' "$(cat "$S/exit")"; fi;;
    esac;;
  stop) rm -f "$S/running";;
  logs) [ -f "$S/created" ] && cat "$S/log";;
  rm) rm -f "$S/running" "$S/created";;
  *) echo "stand-in docker: not answered: $*" >&2; exit 1;;
esac
`,
      { mode: 0o755 },
    );
    writeFileSync(
      join(bin, "curl"),
      `#!/bin/bash
S="${bin}"
[ -f "$S/running" ] || exit 7
n="$(cat "$S/served" 2>/dev/null || echo 0)"
if [ "$n" -lt "$(wc -l < "$S/status.jsonl" | tr -d ' ')" ]; then n=$((n + 1)); echo "$n" > "$S/served"; fi
[ "$n" -gt 0 ] && sed -n "\${n}p" "$S/status.jsonl"
exit 0
`,
      { mode: 0o755 },
    );
    const env = {
      BENCH_DIR: home,
      BUILD: join(home, "build"),
      UMBRADB_LOCAL_NODE: "ws://node.invalid:9944",
      TEMPLATE: "range_template",
      BENCH_PG_CONTAINER: (container as StartedPostgreSqlContainer).getId(),
      BENCH_NETWORK: "bridge",
      // A run whose stand-in never ends is stopped by run.sh itself, so no test can wait for one.
      STALL_LIMIT: "10",
      PATH: `${bin}:${process.env.PATH ?? ""}`,
    };
    return {
      home,
      env,
      /** Sets what the next run's container does, and forgets the last one's calls. */
      play: (status: readonly object[], end: "stays" | "dies" = "stays", exit = 0, log = "admin endpoints listening\n"): void => {
        writeFileSync(join(bin, "status.jsonl"), status.map((line) => `${JSON.stringify(line)}\n`).join(""));
        writeFileSync(join(bin, "end"), end);
        writeFileSync(join(bin, "exit"), String(exit));
        writeFileSync(join(bin, "log"), log);
        for (const file of ["served", "calls.log", "running", "created"]) rmSync(join(bin, file), { force: true });
      },
      calls: (): string => (existsSync(join(bin, "calls.log")) ? readFileSync(join(bin, "calls.log"), "utf8") : ""),
      done: (): void => rmSync(home, { recursive: true, force: true }),
    };
  };

  beforeAll(async () => {
    // pg_stat_statements loaded, as in the bench's own server: run.sh resets it before a run.
    container = await startContainer(new PostgreSqlContainer(POSTGRES_IMAGE).withUsername("postgres").withCommand(["postgres", "-c", "shared_preload_libraries=pg_stat_statements"]));
    // The same rows, inserted in another order and with a note only this database has, in a schema that is not read.
    database("same-a", "");
    database("same-b", "INSERT INTO other.notes VALUES ('only here'); UPDATE core_demo.blocks SET hash = hash;");
    // One byte of one row changed; one row more; and a table that is not there.
    database("changed", "UPDATE core_demo.nodes SET children = ARRAY['\\xab'::bytea] WHERE node_key = '\\xbb'; INSERT INTO core_demo.blocks VALUES (4, '\\x04'); DROP TABLE contract_demo.states;");
    // A database with no table of a core's or a module's schema: a run's database never is one.
    psql("postgres", "CREATE DATABASE bench_empty");
    psql("bench_empty", "CREATE SCHEMA other; CREATE TABLE other.notes (note text);");
    // The template the runs of a stand-in container clone: one core revision from height 0, its cursor at 100.
    template("range_template", [{ start: 0, version: '{"umbradb":"0.0.0","ledgers":[]}', data: { network: "preprod", sweep: "on" } }]);
  }, 300_000);
  afterAll(async () => {
    await container?.stop();
  }, 60_000);

  /** `tables.sh` on the container, and its lines as [table, each run's count and hash, how marked]. */
  const tables = (labels: readonly string[], env: Readonly<Record<string, string>> = {}) => {
    const result = run("tables.sh", labels, { BENCH_DIR: directory, BENCH_PG_CONTAINER: (container as StartedPostgreSqlContainer).getId(), ...env });
    const lines = result.stdout.trimEnd().split("\n");
    const rows = new Map(lines.slice(0, -1).map((line) => {
      const [table, ...rest] = line.trim().split(/\s+/) as [string, ...string[]];
      const marks = ["DIFFERENT", "NOT", "READ"];
      return [table, { hashes: rest.filter((cell) => !marks.includes(cell)), marked: rest.includes("DIFFERENT"), unread: rest.includes("READ") }] as const;
    }));
    return { result, rows, last: lines.at(-1) };
  };

  it("two databases with the same rows: every table's count and hash are equal, and no difference is counted", () => {
    const { result, rows, last } = tables(["same-a", "same-b"]);
    expect(result.code, result.stderr).toBe(0);
    // The tables of the core's and the modules' schemas, and no other.
    expect([...rows.keys()]).toEqual(["contract_demo.states", "core_demo.blocks", "core_demo.nodes"]);
    for (const [table, { hashes, marked }] of rows) {
      expect(hashes[0], table).toMatch(/^[23]:[0-9a-f]{16}$/);
      expect(hashes[1], table).toBe(hashes[0]);
      expect(marked, table).toBe(false);
    }
    expect(rows.get("core_demo.blocks")?.hashes[0]).toMatch(/^3:/);
    expect(last).toBe("differences from same-a: 0");
  });

  it("a table's hash is a sum over its rows, which needs no sort and grows with no table", () => {
    // Each row's text form hashed with MD5; the first 64 bits of each, as a signed number, added up; the sum's text
    // hashed with MD5 again, 16 hex digits of it. One text value of every row's hash, as an aggregate into a string
    // would build, is refused by PostgreSQL above 1 GB: about 33 million rows of 32 bytes.
    const texts = psql("bench_same_a", "SELECT t::text FROM core_demo.blocks t").trimEnd().split("\n");
    expect(texts).toHaveLength(3);
    const md5 = (text: string): string => createHash("md5").update(text).digest("hex");
    const sum = texts.reduce((total, text) => total + BigInt.asIntN(64, BigInt(`0x${md5(text).slice(0, 16)}`)), 0n);
    const { rows } = tables(["same-a"]);
    expect(rows.get("core_demo.blocks")?.hashes).toEqual([`3:${md5(sum.toString()).slice(0, 16)}`]);
  });

  it("negative control: a changed row, a row more and a missing table are each marked and counted, and the status is 1", () => {
    const { result, rows, last } = tables(["same-a", "same-b", "changed"]);
    expect(result.code, result.stderr).toBe(1);
    for (const [table, { hashes, marked }] of rows) {
      expect(hashes[1], table).toBe(hashes[0]);
      expect(hashes[2], table).not.toBe(hashes[0]);
      expect(marked, table).toBe(true);
    }
    // The same number of rows with one byte changed: only the hash differs.
    expect(rows.get("core_demo.nodes")?.hashes.map((cell) => cell.split(":")[0])).toEqual(["2", "2", "2"]);
    expect(rows.get("core_demo.blocks")?.hashes[2]).toMatch(/^4:/);
    expect(rows.get("contract_demo.states")?.hashes[2]).toBe("absent");
    expect(last).toBe("differences from same-a: 3");
  });

  it("negative control: a table only a later run has is listed, marked and counted", () => {
    // The tables compared are every run's, not the first run's only.
    const reversed = tables(["changed", "same-a"]);
    expect(reversed.result.code, reversed.result.stderr).toBe(1);
    expect([...reversed.rows.keys()]).toEqual(["contract_demo.states", "core_demo.blocks", "core_demo.nodes"]);
    expect(reversed.rows.get("contract_demo.states")).toMatchObject({ hashes: ["absent", expect.stringMatching(/^2:/)], marked: true });
    expect(reversed.last).toBe("differences from changed: 3");
  });

  it("run.sh drops no database a run did not make: a template, or one made by hand", () => {
    // A template database of a run's name, marked as one; another made by hand; and the template a run would clone.
    psql("postgres", "CREATE DATABASE run_template; CREATE DATABASE bench_kept IS_TEMPLATE true; CREATE DATABASE bench_by_hand;");
    for (const name of ["bench_kept", "bench_by_hand"]) psql(name, "CREATE TABLE kept (note text); INSERT INTO kept VALUES ('kept');");
    const home = mkdtempSync(join(tmpdir(), "umbradb-bench-range-drop-"));
    try {
      mkdirSync(join(home, "build", "dist", "cli"), { recursive: true });
      writeFileSync(join(home, "build", "dist", "cli", "main.js"), "");
      writeFileSync(join(home, "pg-password"), "not a password\n", { mode: 0o600 });
      const env = { BENCH_DIR: home, BUILD: join(home, "build"), UMBRADB_LOCAL_NODE: "ws://node.invalid:9944", TEMPLATE: "run_template", BENCH_PG_CONTAINER: (container as StartedPostgreSqlContainer).getId(), BENCH_NETWORK: "bridge" };
      expect(run("run.sh", ["kept", "100"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("bench_kept is marked as a template") });
      expect(run("run.sh", ["by-hand", "100"], env)).toMatchObject({ code: 2, stderr: expect.stringContaining("bench_by_hand exists and was not made by run.sh") });
      // A template that is not there is named before anything is changed.
      expect(run("run.sh", ["fresh", "100"], { ...env, TEMPLATE: "no_such_template" })).toMatchObject({ code: 2, stderr: expect.stringContaining("no template database no_such_template") });
      for (const name of ["bench_kept", "bench_by_hand"]) expect(psql(name, "SELECT note FROM kept"), name).toBe("kept\n");
      expect(psql("postgres", "SELECT count(*) FROM pg_database WHERE datname = 'bench_fresh'")).toBe("0\n");
      expect(readdirSync(home).sort()).toEqual(["build", "pg-password"]);
    } finally {
      rmSync(home, { recursive: true, force: true });
    }
  });

  describe("run.sh, with a stand-in for the run's container", () => {
    /** Whether the server holds a database of that name. */
    const exists = (name: string): boolean => psql("postgres", `SELECT count(*) FROM pg_database WHERE datname = '${name}'`) === "1\n";
    const drop = (...names: string[]): void => {
      for (const name of names) psql("postgres", `DROP DATABASE IF EXISTS ${name} WITH (FORCE)`);
    };

    it("negative control: a folder of a package.json of a general form and other files is not a run's, and is left whole", () => {
      const host = machine();
      try {
        // A scratch project of ES modules whose package.json is, word for word, the one run.sh writes in a run's folder.
        mkdirSync(join(host.home, "example", "src"), { recursive: true });
        writeFileSync(join(host.home, "example", "package.json"), '{"type":"module","private":true}\n');
        writeFileSync(join(host.home, "example", "src", "notes.mjs"), "export const kept = true;\n");
        host.play([], "dies");
        const result = run("run.sh", ["example", "200"], host.env);
        expect(readdirSync(join(host.home, "example")).sort(), result.stderr).toEqual(["package.json", "src"]);
        expect(readFileSync(join(host.home, "example", "src", "notes.mjs"), "utf8")).toBe("export const kept = true;\n");
        expect(result.code, result.stderr).toBe(2);
        expect(result.stderr).toContain("is not a run's folder");
        expect(exists("bench_example")).toBe(false);
      } finally {
        host.done();
        drop("bench_example");
      }
    });

    it("a run's folder is known by its marker, which names its folder and label: a folder run.sh made is used again, a copy of it under another label is not", () => {
      const host = machine();
      try {
        host.play([sample("syncing", 100), sample("stopped", 200)]);
        expect(run("run.sh", ["first", "200"], host.env).code).toBe(0);
        expect(readdirSync(join(host.home, "first"))).toContain(".bench-run");
        // The same label again: the folder is emptied and the run made again.
        writeFileSync(join(host.home, "first", "left-over"), "");
        host.play([sample("syncing", 100), sample("stopped", 200)]);
        expect(run("run.sh", ["first", "200"], host.env).code).toBe(0);
        expect(readdirSync(join(host.home, "first"))).not.toContain("left-over");
        writeFileSync(join(host.home, "first", "left-over-of-first"), "");
        // A copy of that folder under another label holds a marker that names the other: not this label's.
        cpSync(join(host.home, "first"), join(host.home, "second"), { recursive: true, verbatimSymlinks: true });
        const copied = run("run.sh", ["second", "200"], host.env);
        expect(readdirSync(join(host.home, "second")), copied.stderr).toContain("left-over-of-first");
        expect(copied.code, copied.stderr).toBe(2);
        expect(copied.stderr).toContain("is not a run's folder");
        expect(exists("bench_second")).toBe(false);
      } finally {
        host.done();
        drop("bench_first", "bench_second");
      }
    });

    it("negative control: the password file inside a run's folder is found whatever path names it, before anything is removed", () => {
      const host = machine();
      try {
        // A run's folder that run.sh made, with a password file in it.
        host.play([sample("syncing", 100), sample("stopped", 200)]);
        expect(run("run.sh", ["old-run", "200"], host.env).code).toBe(0);
        const inside = join(host.home, "old-run", "password");
        symlinkSync(join(host.home, "old-run"), join(host.home, "link-to-run"));
        symlinkSync(inside, join(host.home, "link-to-password"));
        symlinkSync(host.home, join(host.home, "alias"));
        // Each names that file: from the machine's folder, with . and .., through a link to the folder, as a link, and
        // the run's folder named through a link to the machine's folder while the password's path does not.
        const ways: [string, string, Record<string, string>][] = [
          ["a relative path", "old-run/password", {}],
          ["a . component", `${host.home}/./old-run/password`, {}],
          ["a .. component", `${join(host.home, "build")}/../old-run/password`, {}],
          ["a link to the folder", join(host.home, "link-to-run", "password"), {}],
          ["a link to the file", join(host.home, "link-to-password"), {}],
          ["the bench folder through a link", inside, { BENCH_DIR: join(host.home, "alias") }],
        ];
        const outcomes = ways.map(([way, path, env]) => {
          writeFileSync(inside, "not a password\n", { mode: 0o600 });
          host.play([sample("syncing", 100), sample("stopped", 200)]);
          const result = run("run.sh", ["old-run", "200"], { ...host.env, BENCH_PG_PASSWORD_FILE: path, ...env }, host.home);
          const kept = existsSync(inside) && readFileSync(inside, "utf8") === "not a password\n";
          return { way, kept, code: result.code, refused: result.stderr.includes("names the password file or its folder"), ran: /^run -d /m.test(host.calls()) };
        });
        expect(outcomes).toEqual(ways.map(([way]) => ({ way, kept: true, code: 2, refused: true, ran: false })));
      } finally {
        host.done();
        drop("bench_old_run");
      }
    }, 120_000);

    it("the configuration run.sh writes for a template of several core revisions is valid: an earlier one of this build, and one of another build", () => {
      const host = machine();
      // The build run.sh mounts, as a package whose entry is the repository's source (loaded below with tsx).
      writeFileSync(join(host.env.BUILD, "package.json"), '{"name":"umbradb","type":"module","exports":{".":"./index.ts"}}\n');
      writeFileSync(join(host.env.BUILD, "index.ts"), `export * from ${JSON.stringify(fileURLToPath(new URL("../../src/index.ts", import.meta.url)))};\n`);
      // A revision's data as the history records it: its settings of kind data, defaults applied (validated here).
      const settings = { network: "preprod", node: "ws://node.invalid:9944", database: { kind: "postgres", host: "db", port: 5432, user: "postgres", name: "x", ssl: "disable" } } as const;
      const dataOf = (more: object): object => validateConfig({ config: { data: plainData({ entries: [coreEntry({ start: 0, config: { ...settings, ...more } })] }) }, declarations: commandBuild(), side: "public" }).entries[0]?.data as object;
      const earlier = dataOf({ retainStates: 5 });
      const later = dataOf({});
      const thisBuild = versionText(buildCoreVersion());
      const otherBuild = versionText({ ...buildCoreVersion(), umbradb: "0.9.5" });
      template("rev_this", [{ start: 0, version: thisBuild, data: earlier }, { start: 50, version: thisBuild, data: later }]);
      template("rev_other", [{ start: 0, version: otherBuild, data: { network: "preprod", sweep: "on" } }, { start: 50, version: thisBuild, data: later }]);
      /** The configuration run.sh wrote for `label`, imported as the process imports it, and validated at the cursor 100. */
      const checked = (label: string) => {
        const file = join(host.home, label, "umbradb.config.ts");
        const loaded = spawnSync(process.execPath, ["--import", "tsx", "--input-type=module", "-e", "const m = await import(process.argv[1]); console.log(JSON.stringify(m.default));", file], { encoding: "utf8" });
        expect(loaded.status, loaded.stderr).toBe(0);
        const config = validateConfig({ config: { file, data: plainData(JSON.parse(loaded.stdout)) }, declarations: commandBuild(), side: "public" });
        entriesAtCursor(config, 100n);
        return config.entries.filter((entry) => entry.id === "core");
      };
      try {
        for (const [label, templateName] of [["two-of-this", "rev_this"], ["other-first", "rev_other"]] as const) {
          host.play([sample("syncing", 100), sample("stopped", 200)]);
          const result = run("run.sh", [label, "200"], { ...host.env, TEMPLATE: templateName });
          expect(result.code, result.stderr).toBe(0);
        }
        // This build's earlier revision: validated against this build's schema, with the data it recorded.
        const [first, second] = checked("two-of-this");
        expect(first).toMatchObject({ start: 0, buildVersion: true, data: earlier });
        expect(second).toMatchObject({ start: 50, buildVersion: true, data: later });
        // Another build's: a version entry with its recorded data as written, not validated against this build's schema.
        const [other, own] = checked("other-first");
        expect(other).toMatchObject({ start: 0, buildVersion: false, settings: { network: "preprod", sweep: "on" } });
        expect(own).toMatchObject({ start: 50, buildVersion: true, data: later });
      } finally {
        host.done();
        drop("bench_two_of_this", "bench_other_first", "rev_this", "rev_other");
      }
    }, 120_000);

    it("a run succeeds only if it stopped at the height asked for and its process then ended cleanly; any other end fails, its container's state and log kept", () => {
      const host = machine();
      const log = "admin endpoints listening\nthe stand-in's last line\n";
      // Each run asks for height 200. [what the container does, how run.sh is ended, what run.sh must say]
      const cases: [string, () => void, Record<string, string>, number | undefined][] = [
        ["halted after progress", () => host.play([sample("syncing", 100), sample("syncing", 125), sample("halted", 125, { code: "root-mismatch" })], "stays", 1, log), {}, undefined],
        ["stopped below the height asked for", () => host.play([sample("syncing", 100), sample("stopped", 150)], "stays", 0, log), {}, undefined],
        ["its container died after progress", () => host.play([sample("syncing", 100), sample("syncing", 150)], "dies", 137, log), {}, undefined],
        ["stopped by run.sh, the cursor stuck", () => host.play([sample("syncing", 100), sample("syncing", 110)], "stays", 0, log), { STALL_LIMIT: "1" }, undefined],
        ["interrupted", () => host.play([sample("syncing", 100), sample("syncing", 110)], "stays", 0, log), {}, 5],
        ["complete", () => host.play([sample("syncing", 100), sample("syncing", 150), sample("stopped", 200)], "stays", 0, log), {}, undefined],
      ];
      try {
        const outcomes = cases.map(([what, play, env, timeout]) => {
          play();
          const result = run("run.sh", ["ended", "200"], { ...host.env, ...env }, undefined, timeout);
          const folder = join(host.home, "ended");
          const state = existsSync(join(folder, "container.json")) ? (JSON.parse(readFileSync(join(folder, "container.json"), "utf8")) as { ExitCode: number }) : null;
          return {
            what,
            code: result.code,
            said: result.stderr.includes("the run did not complete") && result.stderr.includes("the stand-in's last line"),
            exitKept: state?.ExitCode ?? null,
            logKept: existsSync(join(folder, "run.log")) && readFileSync(join(folder, "run.log"), "utf8") === log,
            removed: /^rm -f umbradb-bench-run-ended$/m.test(host.calls().split(/^run -d /m)[1] ?? ""),
          };
        });
        expect(outcomes).toEqual([
          { what: "halted after progress", code: 1, said: true, exitKept: 1, logKept: true, removed: true },
          { what: "stopped below the height asked for", code: 1, said: true, exitKept: 0, logKept: true, removed: true },
          { what: "its container died after progress", code: 1, said: true, exitKept: 137, logKept: true, removed: true },
          { what: "stopped by run.sh, the cursor stuck", code: 1, said: true, exitKept: 0, logKept: true, removed: true },
          // Removed at once, its state as it was then: running.
          { what: "interrupted", code: 130, said: false, exitKept: 0, logKept: true, removed: true },
          { what: "complete", code: 0, said: false, exitKept: 0, logKept: true, removed: true },
        ]);
        expect(JSON.parse(readFileSync(join(host.home, "ended", "result.json"), "utf8"))).toMatchObject({ from: 100, to: 200, endState: "stopped" });
      } finally {
        host.done();
        drop("bench_ended");
      }
    }, 120_000);
  });

  it("roundtrip.mjs asks for the keys it sampled, decoded: each case's answer holds them, their children and counts above 0", () => {
    // 40 nodes, each the parent of the next two: every key is stored, is a child of two nodes, and has a count of 2.
    psql("postgres", "CREATE DATABASE bench_roundtrip");
    const key = (i: string): string => `decode(md5('k' || ${i}) || md5('l' || ${i}), 'hex')`;
    psql(
      "bench_roundtrip",
      `CREATE SCHEMA core_ledger_state;
       CREATE TABLE core_ledger_state.nodes (node_key bytea PRIMARY KEY, data bytea NOT NULL, children bytea NOT NULL);
       CREATE TABLE core_ledger_state.ref_counts (node_key bytea PRIMARY KEY, count integer NOT NULL);
       CREATE TABLE core_ledger_state.root_counts (node_key bytea PRIMARY KEY, count integer NOT NULL);
       INSERT INTO core_ledger_state.nodes SELECT ${key("i")}, '\\x00', ${key("(i % 40) + 1")} || ${key("((i + 1) % 40) + 1")} FROM generate_series(1, 40) i;
       INSERT INTO core_ledger_state.ref_counts SELECT ${key("i")}, 2 FROM generate_series(1, 40) i;
       INSERT INTO core_ledger_state.root_counts VALUES (${key("1")}, 1);`,
    );
    // The build the script takes: the repository's dependencies, and its mapping from the source (run with tsx).
    const build = mkdtempSync(join(tmpdir(), "umbradb-bench-range-build-"));
    try {
      writeFileSync(join(build, "package.json"), '{"type":"module"}\n');
      symlinkSync(fileURLToPath(new URL("../../node_modules", import.meta.url)), join(build, "node_modules"));
      mkdirSync(join(build, "dist", "deterministic-postgresql"), { recursive: true });
      writeFileSync(join(build, "dist", "deterministic-postgresql", "index.js"), `export * from ${JSON.stringify(fileURLToPath(new URL("../../src/deterministic-postgresql/index.ts", import.meta.url)))};\n`);
      const started = container as StartedPostgreSqlContainer;
      const env = { ...process.env, BENCH_PG_HOST: started.getHost(), BENCH_PG_PORT: String(started.getPort()), PGPASSWORD: started.getPassword(), REPEAT: "3" };
      const result = spawnSync(process.execPath, ["--import", "tsx", join(SCRIPTS, "roundtrip.mjs"), build, "bench_roundtrip"], { encoding: "utf8", env });
      const answer = (name: string): number => Number(/answer (\d+) bytes/.exec(result.stdout.split("\n").find((line) => line.startsWith(name)) ?? "")?.[1]);
      // An answer's values arrive as text: a key is \x and 64 hex digits (66 bytes), two children's keys 130.
      expect(answer("stored keys, 22 keys"), result.stdout + result.stderr).toBe(22 * 66);
      expect(answer("children, 5 keys")).toBe(5 * (66 + 130));
      expect(result.stdout).toContain("each case's first answer checked: the keys asked for found, with their stored children and counts above 0");
      expect(result.status, result.stderr).toBe(0);
    } finally {
      rmSync(build, { recursive: true, force: true });
      psql("postgres", "DROP DATABASE bench_roundtrip WITH (FORCE)");
    }
  });

  it("equal.sh hashes the node tables with a sum over their rows, which grows with no table, and marks a changed child", () => {
    const home = mkdtempSync(join(tmpdir(), "umbradb-bench-range-equal-"));
    const key = (i: string): string => `decode(md5('k' || ${i}) || md5('l' || ${i}), 'hex')`;
    const made = ["eq-a", "eq-b", "eq-c"];
    try {
      for (const label of made) {
        const name = `bench_${label.replaceAll("-", "_")}`;
        psql("postgres", `CREATE DATABASE ${name}`);
        // eq-c: one node's children differ by one byte.
        const children = label === "eq-c" ? `CASE WHEN i = 7 THEN '\\x01'::bytea ELSE ${key("(i % 30) + 1")} END` : key("(i % 30) + 1");
        psql(
          name,
          `CREATE SCHEMA core_block_commit; CREATE SCHEMA core_ledger_state;
           CREATE TABLE core_block_commit.blocks (height bigint PRIMARY KEY);
           CREATE TABLE core_ledger_state.nodes (node_key bytea PRIMARY KEY, data bytea NOT NULL, children bytea NOT NULL);
           CREATE TABLE core_ledger_state.ref_counts (node_key bytea PRIMARY KEY, count integer NOT NULL);
           CREATE TABLE core_ledger_state.root_counts (node_key bytea PRIMARY KEY, count integer NOT NULL);
           CREATE TABLE core_ledger_state.unreferenced (node_key bytea PRIMARY KEY);
           INSERT INTO core_block_commit.blocks VALUES (100);
           INSERT INTO core_ledger_state.nodes SELECT ${key("i")}, '\\x00', ${children} FROM generate_series(1, 30) i;
           INSERT INTO core_ledger_state.ref_counts SELECT ${key("i")}, 1 FROM generate_series(2, 30) i;
           INSERT INTO core_ledger_state.root_counts VALUES (${key("1")}, 1);`,
        );
        mkdirSync(join(home, label));
        writeFileSync(join(home, label, "status.jsonl"), `${JSON.stringify({ at: 1, status: { state: "stopped", cursor: "100", modules: [{ tables: [{ schema: "core_demo", table: "t", height: "100", digest: "ab" }] }] } })}\n`);
      }
      const result = run("equal.sh", made, { BENCH_DIR: home, BENCH_PG_CONTAINER: (container as StartedPostgreSqlContainer).getId() });
      expect(result.code, result.stderr).toBe(0);
      const [a, b, c] = result.stdout.trimEnd().split("\n").map((line) => line.split("|")[1]?.trim() ?? "");
      // Each table's rows and a hash of them: the first 64 bits of each row's MD5 added up, the sum's MD5, 16 hex digits.
      const md5 = (text: string): string => createHash("md5").update(text).digest("hex");
      const rows = psql("bench_eq_a", "SELECT encode(node_key, 'hex') || md5(children) FROM core_ledger_state.nodes").trimEnd().split("\n");
      const sum = rows.reduce((total, text) => total + BigInt.asIntN(64, BigInt(`0x${md5(text).slice(0, 16)}`)), 0n);
      expect(a).toContain(`nodes 30:${md5(sum.toString()).slice(0, 16)} `);
      expect(a).toMatch(/^100 nodes 30:[0-9a-f]{16} ref_counts 29:[0-9a-f]{16} root_counts 1:[0-9a-f]{16} queue 0:[0-9a-f]{16}$/);
      expect(b).toBe(a);
      // One child changed: the nodes' hash differs, and nothing else.
      expect(c).not.toBe(a);
      expect(c.replace(/nodes \S+/, "")).toBe(a.replace(/nodes \S+/, ""));
    } finally {
      rmSync(home, { recursive: true, force: true });
      for (const label of made) psql("postgres", `DROP DATABASE IF EXISTS bench_${label.replaceAll("-", "_")} WITH (FORCE)`);
    }
  });

  it("refuses without a label", () => {
    const result = run("tables.sh", [], { BENCH_DIR: directory });
    expect(result).toMatchObject({ code: 2, stderr: expect.stringContaining("usage: tables.sh") });
    expect(result.stdout).not.toContain("differences");
  });

  it("a database it cannot read ends it with status 2 and no count, whichever run it is", () => {
    for (const labels of [["typo", "same-a"], ["same-a", "typo"]]) {
      const { result } = tables(labels);
      expect(result.code, labels.join(" ")).toBe(2);
      expect(result.stdout, labels.join(" ")).not.toContain("differences");
      expect(result.stderr, labels.join(" ")).toContain("bench_typo");
    }
  });

  it("an empty read ends it with status 2 and no count: a database with no table of the schemas it reads", () => {
    for (const labels of [["empty", "same-a"], ["same-a", "empty"], ["empty"]]) {
      const { result } = tables(labels);
      expect(result.code, labels.join(" ")).toBe(2);
      expect(result.stdout, labels.join(" ")).not.toContain("differences");
      expect(result.stderr, labels.join(" ")).toContain("bench_empty");
    }
  });

  it("a read of one table that fails, or answers nothing, is marked, not counted as equal, and ends it with status 2 and no count", () => {
    // A stand-in for docker, first in PATH: a statement that reads core_demo.nodes fails (or prints nothing and
    // succeeds), as a query PostgreSQL refuses would; every other command goes to docker.
    const docker = spawnSync("bash", ["-c", "command -v docker"], { encoding: "utf8" }).stdout.trim();
    const bin = mkdtempSync(join(tmpdir(), "umbradb-bench-range-docker-"));
    try {
      writeFileSync(
        join(bin, "docker"),
        `#!/bin/sh\nfor a in "$@"; do case "$a" in *"FROM core_demo.nodes t"*) if [ "$STAND_IN" = empty ]; then exit 0; fi; echo "ERROR:  a read that fails" >&2; exit 1;; esac; done\nexec "${docker}" "$@"\n`,
        { mode: 0o755 },
      );
      for (const mode of ["fails", "empty"]) {
        const { result, rows, last } = tables(["same-a", "same-b"], { PATH: `${bin}:${process.env.PATH ?? ""}`, STAND_IN: mode });
        expect(result.code, mode).toBe(2);
        expect(rows.get("core_demo.nodes"), mode).toMatchObject({ hashes: ["error", "error"], unread: true });
        expect(rows.get("core_demo.blocks"), mode).toMatchObject({ hashes: [expect.stringMatching(/^3:/), expect.stringMatching(/^3:/)], unread: false });
        expect(last, mode).toBe("not compared: 2 reads failed");
        expect(result.stdout, mode).not.toContain("differences");
        expect(result.stderr, mode).toContain("core_demo.nodes");
      }
    } finally {
      rmSync(bin, { recursive: true, force: true });
    }
  });
});

describe("equal.sh fails closed", () => {
  it("a run it cannot read ends it with status 2, says which, and prints no stack", () => {
    // No database container answers here, so every run's query fails too; the status file of run a has no tables, and
    // a run that never wrote one has no status file.
    const absent = run("equal.sh", ["a", "nothing"], { BENCH_DIR: directory, BENCH_PG_CONTAINER: "umbradb-bench-test-no-such-container" });
    expect(absent.code).toBe(2);
    expect(absent.stdout).toContain("not compared:");
    expect(absent.stderr).toContain("equal.sh: could not read");
    expect(absent.stderr).not.toMatch(/^\s+at /m);
  });
});
