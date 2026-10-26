import { readdirSync, readFileSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { adminCore, adminSource, ask, statusWhen } from "./admin-harness.js";
import { freePort } from "../runner/process-harness.js";
import { startProcess, testBuild } from "../runner/process-build.js";

/**
 * The tests' processes and the admin endpoints' default (task 8.1a; owner decision Q128 B): the runner's `startProcess`
 * serves the admin endpoints unless its caller passes `admin: false`, on `listen.admin` — CF-4's `0.0.0.0:8081` unless
 * configured —, so a test process that leaves them on collides with every other test process on a shared machine.
 * Outside `test/admin/`, whose tests are about the endpoints and say how each of their processes serves them, a test
 * starts a process through `test/runner/process-build.ts`'s `startProcess`, which opts out unless the test asks for
 * them; this fails on any file under `test/` that takes the runner's own instead (a named or renamed import, a
 * namespace import that calls it, a dynamic import or a re-export of `src/runner/process.ts` or `src/runner/index.ts`).
 */

const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const TESTS = join(REPOSITORY, "test");

/** The runner's modules that export `startProcess`, without their extension. */
const RUNNER = ["src/runner/process", "src/runner/index"].map((module) => join(REPOSITORY, module));

/** The files that may take the runner's `startProcess`: the tests' own, and the admin endpoints' tests. */
const allowed = (file: string): boolean =>
  file === "test/runner/process-build.ts" || file.startsWith("test/admin/");

/** Whether `specifier`, imported by `file` (relative to the repository), names one of {@link RUNNER}. */
function namesRunner(file: string, specifier: string): boolean {
  if (!specifier.startsWith(".")) return false;
  const target = resolve(REPOSITORY, dirname(file), specifier).replace(/\.(?:[cm]?js|[cm]?ts)$/, "");
  return RUNNER.includes(target);
}

/** The names a brace list (`{ a, type b, c as d }`) takes as values, by their exported names. */
const valueNames = (list: string): string[] =>
  list
    .split(",")
    .map((item) => item.trim())
    .filter((item) => item !== "" && !item.startsWith("type "))
    .map((item) => item.split(/\s+as\s+/)[0]?.trim() ?? "");

/**
 * How `source`, the text of `file` (relative to the repository), takes the runner's `startProcess`: one line per form
 * found, none when it does not. Comments starting a line are left out.
 */
function runnerStarts(file: string, source: string): string[] {
  const text = source.replace(/^\s*\/\*[\s\S]*?\*\//gm, "").replace(/^\s*\/\/.*$/gm, "");
  const found: string[] = [];
  const named = /\b(import|export)\s+(type\s+)?\{([^}]*)\}\s*from\s*["']([^"']+)["']/g;
  for (const [, kind, typeOnly, list, specifier] of text.matchAll(named)) {
    if (typeOnly !== undefined) continue;
    if (namesRunner(file, specifier as string) && valueNames(list as string).includes("startProcess")) {
      found.push(`${kind} { startProcess } from ${specifier}`);
    }
  }
  for (const [, alias, specifier] of text.matchAll(/\bimport\s+\*\s+as\s+(\w+)\s+from\s*["']([^"']+)["']/g)) {
    if (namesRunner(file, specifier as string) && new RegExp(`\\b${alias}\\.startProcess\\b`).test(text)) {
      found.push(`import * as ${alias} from ${specifier}, calling ${alias}.startProcess`);
    }
  }
  for (const [, specifier] of text.matchAll(/\bexport\s+\*\s+from\s*["']([^"']+)["']/g)) {
    if (namesRunner(file, specifier as string)) found.push(`export * from ${specifier}`);
  }
  for (const [, specifier] of text.matchAll(/\bimport\(\s*["']([^"']+)["']\s*\)/g)) {
    if (namesRunner(file, specifier as string)) found.push(`import(${specifier})`);
  }
  return found;
}

/** Every source file under `directory`, relative to the repository. */
function sources(directory: string): string[] {
  return readdirSync(directory, { withFileTypes: true }).flatMap((entry) => {
    const path = join(directory, entry.name);
    if (entry.isDirectory()) return sources(path);
    return /\.(?:[cm]?ts|[cm]?js)$/.test(entry.name) ? [relative(REPOSITORY, path)] : [];
  });
}

describe("the tests' processes opt out of the admin endpoints unless they ask (task 8.1a, Q128 B)", () => {
  it("no test outside test/admin/ takes the runner's startProcess: each goes through test/runner/process-build.ts's", () => {
    const takers = sources(TESTS).filter(
      (file) => runnerStarts(file, readFileSync(join(REPOSITORY, file), "utf8")).length > 0,
    );
    expect(takers.filter((file) => !allowed(file))).toEqual([]);
    // The walk reads every test file: the ones allowed to take it are found (the admin endpoints' own tests, nested).
    expect(takers).toEqual(
      expect.arrayContaining([
        "test/runner/process-build.ts",
        "test/admin/admin-harness.ts",
        "test/admin/exit.worker.ts",
        "test/admin/lifecycle.test.ts",
        "test/admin/default.test.ts",
      ]),
    );
  });

  it("the shared startProcess takes the runner's (it is the one allowed outside test/admin/), and opts out by default", () => {
    const file = "test/runner/process-build.ts";
    expect(runnerStarts(file, readFileSync(join(REPOSITORY, file), "utf8"))).toEqual([
      "import { startProcess } from ../../src/runner/process.js",
    ]);
  });

  it("the shared startProcess serves no admin endpoints unless the test asks, then on its own listen.admin", async () => {
    const run = async (admin: { readonly admin?: boolean | undefined }) => {
      const port = await freePort();
      const handle = startProcess({
        declarations: testBuild([]).declarations,
        config: { data: { entries: [adminCore("pglite:memory", 1, { extra: { listen: { admin: `127.0.0.1:${port}` } } })] } },
        source: adminSource(1n),
        log: () => undefined,
        ...admin,
      });
      try {
        await handle.started;
        const origin = `http://127.0.0.1:${port}`;
        if (admin.admin === true) await statusWhen(origin, (body) => body.state === "following");
        return (await ask(origin, "/health/live")).status ?? "nothing listens";
      } finally {
        await handle.stop();
      }
    };
    expect(await run({})).toBe("nothing listens");
    expect(await run({ admin: undefined })).toBe("nothing listens");
    expect(await run({ admin: false })).toBe("nothing listens");
    expect(await run({ admin: true })).toBe(200);
  }, 60_000);

  it("allows the runner's startProcess in the shared helper and under test/admin/ only", () => {
    const files = ["test/runner/process-build.ts", "test/admin/x.test.ts", "test/runner/x.test.ts"];
    const others = ["test/administrator/x.test.ts", "test/backbone/process-build.ts", "test/runner/process-build.test.ts"];
    expect([...files, ...others].map(allowed)).toEqual([true, true, false, false, false, false]);
  });

  it("finds each form of taking the runner's startProcess, and none of the harmless ones", () => {
    const file = "test/backbone/planted.test.ts";
    const planted = [
      'import { startProcess } from "../../src/runner/process.js";',
      'import { type ProcessHandle, startProcess as start } from "../../src/runner/process.js";',
      'import {\n  statusOf,\n  startProcess,\n} from "../../src/runner/process.ts";',
      'import { startProcess } from "../../src/runner/index.js";',
      'import * as runner from "../../src/runner/process.js";\nrunner.startProcess({});',
      'const { startProcess } = await import("../../src/runner/process.js");',
      'export { startProcess } from "../../src/runner/process.js";',
      'export * from "../../src/runner/process.js";',
    ];
    expect(planted.map((source) => runnerStarts(file, source).length)).toEqual(planted.map(() => 1));
    const harmless = [
      'import { startProcess } from "../runner/process-build.js";',
      'import { startProcess } from "../runner/process-harness.js";',
      'import { type ProcessHandle, statusOf } from "../../src/runner/process.js";',
      'import type { startProcess } from "../../src/runner/process.js";',
      'import { type startProcess } from "../../src/runner/process.js";',
      'import * as runner from "../../src/runner/process.js";\nrunner.statusOf({});',
      '// import { startProcess } from "../../src/runner/process.js";',
      '/**\n * import { startProcess } from "../../src/runner/process.js";\n */',
      'import { startProcess } from "../../src/runner/processes.js";',
    ];
    expect(harmless.map((source) => runnerStarts(file, source))).toEqual(harmless.map(() => []));
  });
});
