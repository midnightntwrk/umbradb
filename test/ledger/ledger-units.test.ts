import { mkdirSync, mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it } from "vitest";
import { UmbraError } from "../../src/db/errors.js";
import { manifestSha256, readManifest, readPackageFile } from "../../src/ledger/identity.js";
import { loadLedgerPackage } from "../../src/ledger/load.js";
import { plainDataProblem } from "../../src/ledger/plain-data.js";
import { checkLedgerSources } from "../../src/ledger/sources.js";
import { bindLedgerTasks, hasLedgerTasks, TASKS_STATE_ITEM, withLedgerTasks } from "../../src/ledger/tasks.js";
import type { LedgerName, LedgerPackage, LedgerTask } from "../../src/ledger/types.js";
import { type BlockId, LedgerEngine, ledgerTasksOf, type TaskRun } from "../../src/ledger/worker/engine.js";
import type { LedgerHost } from "../../src/ledger/worker/host.js";
import type { BlockContext, ItemSink, ModuleDeclaration, ProcessContext } from "../../src/modules/declaration.js";
import { NETWORK_ID, RAW, T0, zswapOutputTransaction } from "./adapter-fixtures.js";
import { CONTRACT_LOG_SITES_TASK } from "../../src/backbone/core-contract-logs-fast/task.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { userModules } from "../modules/declarations.js";
import { callArgsModule, STATE_BEFORE_TASK } from "./fixtures/task-modules.js";

/**
 * What the ledger tasks' tests left to mutation testing:
 * - `plainDataProblem`'s comparison of a value with its structured clone (driven through getters, which give the walk,
 *   the clone and the comparison each their own value), a clone refused, a class with no name;
 * - `LedgerEngine`'s modules check, kept parse and state before a block on the main thread;
 * - `withLedgerTasks`' points and freezing;
 * - `loadLedgerPackage`'s versions;
 * - `checkLedgerSources`' default.
 */

/** An object whose `k` gives `values` in turn (the last one again): the walk reads the first, the clone the second. */
function turns(...values: unknown[]): { readonly k: unknown } {
  let next = 0;
  const object = {};
  Object.defineProperty(object, "k", { enumerable: true, get: () => values[Math.min(next++, values.length - 1)] });
  return object as { readonly k: unknown };
}

const kept = (where: string) => `a value its structured clone does not keep, at ${where}`;

describe("plainDataProblem's clone comparison (task 17.5b)", () => {
  it("finds a value its clone does not keep: a primitive, null, bytes, an array, an object", () => {
    const u = (...bytes: number[]) => Uint8Array.from(bytes);
    const cases: [unknown[], string | null][] = [
      [[1, 1, 1], null],
      [[1, 1, 2], "$.k"],
      [[1, 1, "1"], "$.k"],
      [[{}, null, {}], "$.k"],
      [[u(1, 2), u(1, 3), u(1, 2)], "$.k"],
      [[u(1, 2), u(1), u(1, 2)], "$.k"],
      [[u(1, 2), [1, 2], u(1, 2)], "$.k"],
      [[u(1, 2), u(1, 2), u(1, 2)], null],
      [[u(1, 2), u(1, 2, 3), u(1, 2)], "$.k"],
      [[[1], [1, 2], [1]], "$.k"],
      [[[1], { 0: 1 }, [1]], "$.k"],
      [[[1, 1], [1, 2], [1, 1]], "$.k[1]"],
      [[[1, 2], [1, 2], [1, 2]], null],
      [[{}, [], {}], "$.k"],
      [[{}, u(), {}], "$.k"],
      [[{ a: 1 }, { a: 1, b: 2 }, { a: 1 }], "$.k"],
      [[{ a: 1 }, { b: 1 }, { a: 1 }], "$.k.a"],
      [[{ a: 1, b: 1 }, { a: 1, b: 2 }, { a: 1, b: 1 }], "$.k.b"],
      [[{ a: 1, b: 1 }, { a: 1, b: 1 }, { a: 1, b: 1 }], null],
    ];
    for (const [values, where] of cases) {
      expect(plainDataProblem(turns(...values)), JSON.stringify(values, (_k, v) => (v instanceof Uint8Array ? [...v] : v)))
        .toBe(where === null ? null : kept(where));
    }
  });

  it("names a clone it refuses, an array of another prototype, and a class with no name", () => {
    const buffer = new ArrayBuffer(4);
    const view = new Uint8Array(buffer);
    structuredClone(buffer, { transfer: [buffer] });
    expect(plainDataProblem({ view })).toBe("a value structured clone refuses (An ArrayBuffer is detached and could not be cloned.)");
    expect(plainDataProblem(Object.setPrototypeOf([], null))).toBe("an object that is not plain at $");
    expect(plainDataProblem(Object.setPrototypeOf({}, { constructor: { name: "" } }))).toBe("an object that is not plain at $");
    expect(plainDataProblem(Object.setPrototypeOf({}, { constructor: { name: 7 } }))).toBe("an object that is not plain at $");
    expect(plainDataProblem(Object.create(Object.create(null)))).toBe("an object that is not plain at $");
  });
});

const hash = (byte: number): Uint8Array => new Uint8Array(32).fill(byte);
const at = (height: bigint): BlockId => ({ height, hash: hash(Number(height) + 1) });
const run = (height: bigint, module: string, tasks: readonly string[], parentHash = at(height - 1n).hash): TaskRun => ({
  ...at(height),
  parentHash,
  ledger: "v9",
  transactions: 0,
  module,
  tasks,
});

describe("LedgerEngine on the main thread (task 17.5b)", () => {
  it("takes modules that are objects with an id, a module without tasks as none", () => {
    for (const module of [null, 1, "m", { id: 1 }, {}]) {
      expect(() => ledgerTasksOf([module as never]), String(module)).toThrow(
        new TypeError("the ledger worker takes the modules the host ships: each a declaration, with its id"),
      );
    }
    expect(ledgerTasksOf([{ id: "m" } as never]).get("m")).toEqual([]);
    expect(() => ledgerTasksOf([Object.assign(() => 1, { id: "f" }) as never])).toThrow(TypeError);
  });

  it("refuses a state-needing task without the state at h − 1: none, another height, another parent", { timeout: 120_000 }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage, tasks: ledgerTasksOf([{ id: "s", ledgerTasks: [STATE_BEFORE_TASK] } as never]) });
    const refused = (what: string) =>
      `the ledger task root-before of s at block 1 needs the state before the block, and the ledger worker holds ${what} ` +
      "(core-ledger-state's on-compute has it hold that state)";
    await expect(engine.tasks(run(1n, "s", ["root-before"]))).rejects.toThrow(refused("no state"));
    await engine.genesis({
      ledger: "v9",
      ...at(0n),
      parentHash: new Uint8Array(32),
      timestampMs: BigInt(T0),
      transactions: 0,
      genesisState: RAW.v9.LedgerState.blank(NETWORK_ID).serialize(),
      includesBlockZero: true,
    });
    engine.commit(at(0n));
    await expect(engine.tasks(run(1n, "s", ["root-before"], hash(9)))).rejects.toThrow(refused("the state at 0"));
    await expect(engine.tasks({ ...run(2n, "s", ["root-before"]), parentHash: at(0n).hash })).rejects.toThrow(
      "the ledger task root-before of s at block 2 needs the state before the block, and the ledger worker holds the state at 0",
    );
    expect(await engine.tasks(run(1n, "s", ["root-before"]))).toMatchObject({ "root-before": { height: 1n } });
    await expect(engine.tasks(run(1n, "s", ["missing"]))).rejects.toThrow("(runLedgerWorker(modules))");
  });

  it("parses again a block kept with another ledger or another number of transactions; gives none for none", { timeout: 120_000 }, async () => {
    const engine = new LedgerEngine({ load: loadLedgerPackage });
    const transaction = zswapOutputTransaction(RAW.v9);
    expect(await engine.parse("v9", at(1n), [])).toEqual([]);
    expect(await engine.parse("v9", at(1n), [transaction])).toHaveLength(1);
    expect(await engine.parse("v9", at(1n), [transaction, transaction.slice()])).toHaveLength(2);
    await expect(engine.parse("v8", at(1n), [transaction, transaction.slice()])).rejects.toThrow();
  });

  it("names the adapter and block whose parse is not plain data", async () => {
    const fake = {
      parseTransaction: () => ({ native: new Map() }),
    } as unknown as LedgerPackage;
    const engine = new LedgerEngine({ load: async () => fake });
    await expect(engine.parse("v9", at(4n), [Uint8Array.of(1)])).rejects.toThrow(
      new TypeError("the v9 adapter parsed block 4 into an object of the class Map at $[0].native, not plain data"),
    );
  });
});

describe("withLedgerTasks' points (task 17.5b)", () => {
  const block = (height: bigint): BlockContext => ({
    height,
    hash: hash(1),
    parentHash: hash(0),
    items: new Map([["block-parsed", { ledger: "v9", transactions: [] }]]),
    settings: {},
    active: () => true,
  });
  const sink = () => {
    const put: [string, unknown][] = [];
    return { put, sink: { put: (name: string, value: unknown) => put.push([name, value]) } as ItemSink };
  };
  const context = (): ProcessContext => ({ items: new Map(), revisions: [], publish() {} });
  const task = (name: string, needsState: boolean): LedgerTask => ({ name, needsState, run: () => null });
  const declaration = (tasks: readonly LedgerTask[], points: ModuleDeclaration["points"] = {}): ModuleDeclaration =>
    ({ id: "m", version: "1", side: "public", requires: [], provides: [], ledgerTasks: tasks, points }) as unknown as ModuleDeclaration;

  it("keeps the module's other callbacks, and adds only the points its kinds of task need", async () => {
    const own = { "on-db-write": async () => undefined, "on-compute": async () => undefined };
    const stateless = withLedgerTasks(declaration([task("a", false)], own));
    expect(stateless.points["on-db-write"]).toBe(own["on-db-write"]);
    expect(stateless.points["on-compute"]).toBe(own["on-compute"]);
    expect(stateless.points["on-parse"]).toBeTypeOf("function");
    const stateful = withLedgerTasks(declaration([task("b", true)]));
    expect(stateful.points["on-parse"]).toBeUndefined();
    expect(stateful.points["on-compute"]).toBeTypeOf("function");
    // A stateful task with no own on-compute runs all the same.
    const p = context();
    bindLedgerTasks(p, { tasks: async () => ({ b: { x: 1 } }) } as unknown as LedgerHost);
    const out = sink();
    await stateful.points["on-compute"]?.(p, block(2n), { query: async () => [] } as never, out.sink);
    expect(out.put).toEqual([["b", { x: 1 }]]);
    expect(hasLedgerTasks({ id: "plain" } as unknown as ModuleDeclaration)).toBe(false);
    expect(TASKS_STATE_ITEM).toBe("ledger-state");
  });

  it("freezes a result deeply, leaving bytes, primitives and an object already frozen as they are", async () => {
    const inner = { deep: [1] };
    const frozenOuter = Object.freeze({ inner });
    const bytes = Uint8Array.of(1, 2);
    const p = context();
    bindLedgerTasks(p, {
      tasks: async () => ({ n: null, s: "text", u: bytes, f: frozenOuter, o: { list: [{ a: 1 }], bytes } }),
    } as unknown as LedgerHost);
    const wrapped = withLedgerTasks(declaration(["n", "s", "u", "f", "o"].map((name) => task(name, false))));
    const out = sink();
    await wrapped.points["on-parse"]?.(p, block(1n), out.sink);
    const results = Object.fromEntries(out.put) as Record<string, any>;
    expect(results.n).toBeNull();
    expect(results.s).toBe("text");
    expect(results.u).toBe(bytes);
    expect(Object.isFrozen(results.f)).toBe(true);
    expect(Object.isFrozen(inner)).toBe(false);
    expect(Object.isFrozen(results.o) && Object.isFrozen(results.o.list) && Object.isFrozen(results.o.list[0])).toBe(true);
  });

  it("names bindLedgerTasks when the context is not bound", async () => {
    const wrapped = withLedgerTasks(declaration([task("a", false)]));
    await expect(wrapped.points["on-parse"]?.(context(), block(1n), sink().sink)).rejects.toThrow(
      "m declares ledger tasks and ran with a process context the runner did not bind to a ledger worker " +
        "(bindLedgerTasks): its tasks run in the worker",
    );
  });
});

describe("loadLedgerPackage and checkLedgerSources (task 17.5b)", () => {
  const adapters: LedgerPackage[] = [];
  afterAll(() => adapters.splice(0));

  it("loads each carried version's own adapter, and refuses one the build does not carry", { timeout: 120_000 }, async () => {
    const rc3 = await loadLedgerPackage("v9-rc3", { networkId: NETWORK_ID });
    const v9 = await loadLedgerPackage("v9", { networkId: NETWORK_ID });
    adapters.push(rc3, v9);
    expect([rc3.ledger, v9.ledger]).toEqual(["v9-rc3", "v9"]);
    await expect(loadLedgerPackage("v10" as LedgerName, { networkId: NETWORK_ID })).rejects.toThrow(
      new RangeError("this build carries no ledger v10 adapter"),
    );
  });

  it("takes no settings as every version vendored, and names what a released source lacks", () => {
    expect(() => checkLedgerSources()).not.toThrow();
    expect(() => checkLedgerSources({ v9: "released" })).toThrow(
      "ledgerSources.v9 is released, and this build carries the vendored ledger v9 package only: the released packages " +
        "lack the exports the ledger adapters need; set it to vendored",
    );
  });
});

describe("the vendored packages' manifest and files (task 17.5b, the pass task 12.2b deferred)", () => {
  const root = mkdtempSync(join(tmpdir(), "umbradb-17.5b-identity-"));
  afterAll(() => rmSync(root, { recursive: true, force: true }));
  const HASH = "a".repeat(64);
  const manifest = (text: string): string => {
    mkdirSync(join(root, "v9"), { recursive: true });
    writeFileSync(join(root, "v9", "SHA256SUMS"), text);
    return manifestSha256(Buffer.from(text));
  };
  const refusal = (run: () => unknown): UmbraError => {
    try {
      run();
    } catch (error) {
      return error as UmbraError;
    }
    throw new Error("no refusal");
  };
  const prefix = "the vendored ledger v9 package @umbradb/vendored-ledger-v9 is not the one this build records: ";

  it("names a missing manifest, and one of another SHA-256 with both values", () => {
    const missing = refusal(() => readManifest(join(root, "none"), "v9", "0x00"));
    expect(missing.message.startsWith(`${prefix}its SHA256SUMS is missing;`)).toBe(true);
    const text = `${HASH}  pkg/a.js\n`;
    const found = manifest(text);
    const changed = refusal(() => readManifest(root, "v9", "0x01"));
    expect(changed.message.startsWith(`${prefix}its SHA256SUMS has SHA-256 ${found} where the build records 0x01;`)).toBe(true);
    expect(changed.details).toMatchObject({ reason: "changed", expected: "0x01", found });
  });

  it("names the malformed line, and none for a manifest without its final newline", () => {
    const malformed = (text: string) => refusal(() => readManifest(root, "v9", manifest(text))).message;
    expect(malformed(`${HASH}  pkg/a.js\n${HASH}  pkg/../b.js\n`)).toContain('per file (line 2);');
    expect(malformed(`${HASH}  pkg/a.js\rb\n`)).toContain('per file (line 1);');
    expect(malformed(`${HASH}  pkg/a.js`)).toContain('its SHA256SUMS is not one line "<sha256>  pkg/<file>" per file;');
    expect(malformed(`x${HASH}  pkg/a.js\n`)).toContain("per file (line 1);");
    expect(readManifest(root, "v9", manifest(`${HASH}  pkg/a.js\n`))).toEqual([{ sha256: `0x${HASH}`, path: "pkg/a.js" }]);
  });

  it("names a missing package file with the SHA-256 its manifest records", () => {
    const missing = refusal(() => readPackageFile(root, "v9", { sha256: "0x02", path: "pkg/none.js" }));
    expect(missing.message.startsWith(`${prefix}pkg/none.js is missing;`)).toBe(true);
    expect(missing.details).toMatchObject({ reason: "missing", file: "pkg/none.js", expected: "0x02" });
  });
});

describe("ledger tasks' declarations (task 17.5b)", () => {
  it("lets a private module declare an empty list of ledger tasks, and core-contract-logs-fast's task needs no state", () => {
    const empty = { ...callArgsModule(), side: "private", ledgerTasks: [] } as unknown as ModuleDeclaration;
    expect(() => validateDeclarations(userModules([empty]))).not.toThrow();
    expect(CONTRACT_LOG_SITES_TASK.needsState).toBe(false);
  });
});
