import { mkdtempSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { pathToFileURL } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { buildCoreVersion } from "../../src/config/build.js";
import { loadConfig } from "../../src/config/load.js";
import {
  PLAIN_DATA_RULES,
  type PlainData,
  type PlainDataRule,
  plainData,
  plainDataWith,
  samePlainData,
} from "../../src/config/plain-data.js";
import { UmbraError } from "../../src/db/errors.js";
import { CORE_SETTINGS, REPOSITORY } from "./config-fixtures.js";

/**
 * The configuration file is evaluated to plain data: objects, arrays, strings, booleans, `null` and integers from 0
 * to 2^53 − 1. Anything else in it refuses startup with `not-plain-data`, naming its path inside the configuration
 * (`entries[1].config.onError`). [A26, CF-1]
 *
 * The `A26` table holds the seven specified values: a function, a class instance, `undefined`, a bigint, 1.5, −1 and
 * 2^53. Each sits in a configuration file written as an operator writes one, and is loaded by the loader startup calls
 * (`loadConfig`); the runner's refused state is tested elsewhere. [A26]
 *
 * The plain-data check also refuses the other values that are not data (a symbol, an array's hole, a getter, …), each
 * by a rule of its own. The committed negative control shows that a check without one rule fails exactly that rule's
 * rows.
 */

/** The refusal `run` throws, or undefined when it returns. */
async function thrown(run: () => unknown): Promise<unknown> {
  try {
    await run();
  } catch (error) {
    return error;
  }
  return undefined;
}

/** The `UmbraError` `run` throws; fails the test otherwise. */
async function refusal(run: () => unknown): Promise<UmbraError> {
  const error = await thrown(run);
  expect(error).toBeInstanceOf(UmbraError);
  return error as UmbraError;
}

/**
 * A configuration file's text: the builders and the fixture modules imported by absolute path (which Vitest's resolver
 * reads, where it does not read a `file:` URL), then `entries`.
 */
function configSource(entries: string): string {
  const config = join(REPOSITORY, "src", "config", "index.js");
  const fixtures = join(REPOSITORY, "test", "config", "config-fixtures.js");
  return [
    `import { coreEntry, defineConfig } from ${JSON.stringify(config)};`,
    `import { CORE_SETTINGS, stats } from ${JSON.stringify(fixtures)};`,
    "",
    `export default defineConfig({ entries: ${entries} });`,
    "",
  ].join("\n");
}

const CORE = "coreEntry({ start: 0, config: CORE_SETTINGS })";

/** An environment variable no test sets: reading it gives `undefined`, as an unset secret does. */
const UNSET = "UMBRADB_TEST_4_1_UNSET_TOKEN";

/** One value that is not plain data, where it is, how the refusal names it, and the rule that refuses it. */
interface Row {
  readonly name: string;
  readonly rule: string;
  readonly path: string;
  readonly found: string;
  /** For the `A26` rows: the `entries` of a configuration file that holds the value. */
  readonly entries?: string;
  /** For the other rows: the value, built here. */
  readonly build?: () => unknown;
}

const A26: readonly Row[] = [
  {
    name: "a function (CF-1's scenario)",
    rule: "function",
    path: "entries[1].config.onError",
    found: "a function",
    entries: `[${CORE}, stats.entry({ start: 0, config: { pollMs: 1000, onError: () => 0 } })]`,
  },
  {
    name: "a class instance",
    rule: "class-instance",
    path: "entries[1].config.window",
    found: "an instance of Window",
    entries: `[${CORE}, stats.entry({ start: 0, config: { pollMs: 1000, window: new (class Window { size = 10 })() } })]`,
  },
  {
    name: "undefined (an unset environment variable)",
    rule: "undefined",
    path: "entries[1].config.token",
    found: "undefined",
    entries: `[${CORE}, stats.entry({ start: 0, config: { pollMs: 1000, token: process.env.${UNSET} } })]`,
  },
  {
    name: "a bigint",
    rule: "bigint",
    path: "entries[1].start",
    found: "the bigint 2500000n",
    entries: `[${CORE}, stats.entry({ start: 2_500_000n, config: { pollMs: 1000 } })]`,
  },
  {
    name: "1.5",
    rule: "not-integer",
    path: "entries[0].config.tipCap",
    found: "1.5, which is not an integer",
    entries: "[coreEntry({ start: 0, config: { ...CORE_SETTINGS, tipCap: 1.5 } })]",
  },
  {
    name: "−1",
    rule: "below-zero",
    path: "entries[1].stop",
    found: "-1, which is below 0",
    entries: `[${CORE}, stats.entry({ start: 0, stop: -1, config: { pollMs: 1000 } })]`,
  },
  {
    name: "2^53",
    rule: "above-max",
    path: "entries[0].config.ledgerTable.rows[1].specVersionMax",
    found: "9007199254740992, which is above 2^53 - 1",
    entries:
      "[coreEntry({ start: 0, config: { ...CORE_SETTINGS, ledgerTable: { rows: [" +
      '{ specVersionMin: 0, specVersionMax: 999, ledger: "v8" }, ' +
      '{ specVersionMin: 1000, specVersionMax: 2 ** 53, ledger: "v9" }] } } })]',
  },
];

/** A getter, defined on an otherwise plain object. */
function withGetter(): unknown {
  const settings = { pollMs: 1000 };
  Object.defineProperty(settings, "limit", { get: () => 10, enumerable: true });
  return { entries: [{ id: "stats", config: settings }] };
}

/** A non-enumerable property, defined on an otherwise plain object. */
function withHiddenProperty(): unknown {
  const settings = { pollMs: 1000 };
  Object.defineProperty(settings, "token", { value: "t", enumerable: false });
  return { entries: [{ id: "stats", config: settings }] };
}

/** An array with a property besides its elements. */
function withArrayProperty(): unknown {
  const instances = ["a", "b"];
  Object.assign(instances, { primary: "a" });
  return { entries: [{ id: "core", config: { lockstepInstances: instances } }] };
}

/** An array with a property named like an element that is not one: not canonical (`"01"`), or not an integer. */
function withElementLikeProperty(key: string): unknown {
  const instances = ["a", "b"];
  Object.assign(instances, { [key]: "c" });
  return { entries: [{ id: "core", config: { lockstepInstances: instances } }] };
}

/** An object that contains itself. */
function withCycle(): unknown {
  const settings: Record<string, unknown> = { pollMs: 1000 };
  settings.self = settings;
  return { entries: [{ id: "stats", config: settings }] };
}

const OTHERS: readonly Row[] = [
  {
    name: "NaN",
    rule: "not-integer",
    path: "entries[0].start",
    found: "NaN, which is not an integer",
    build: () => ({ entries: [{ id: "core", start: Number.NaN }] }),
  },
  {
    name: "Infinity",
    rule: "not-integer",
    path: "entries[0].stop",
    found: "Infinity, which is not an integer",
    build: () => ({ entries: [{ id: "core", start: 0, stop: Number.POSITIVE_INFINITY }] }),
  },
  {
    name: "a symbol",
    rule: "symbol",
    path: "entries[0].config.network",
    found: "a symbol",
    build: () => ({ entries: [{ id: "core", config: { network: Symbol("preprod") } }] }),
  },
  {
    name: "a byte array (bytes are 0x-prefixed hex strings)",
    rule: "class-instance",
    path: "entries[0].config.genesisHash",
    found: "an instance of Uint8Array",
    build: () => ({ entries: [{ id: "core", config: { genesisHash: new Uint8Array(32) } }] }),
  },
  {
    name: "a Map",
    rule: "class-instance",
    path: "entries[0].config.ledgerSources",
    found: "an instance of Map",
    build: () => ({ entries: [{ id: "core", config: { ledgerSources: new Map([["v8", "vendored"]]) } }] }),
  },
  {
    name: "a boxed string",
    rule: "class-instance",
    path: "entries[0].config.network",
    build: () => ({ entries: [{ id: "core", config: { network: new String("preprod") } }] }),
    found: "an instance of String",
  },
  {
    name: "an instance of an anonymous class",
    rule: "class-instance",
    path: "entries[0].config",
    found: "an object whose prototype is neither Object.prototype nor Array.prototype",
    build: () => ({ entries: [{ id: "core", config: new (class {})() }] }),
  },
  {
    name: "an object whose prototype has no constructor",
    rule: "class-instance",
    path: "entries[0]",
    found: "an object whose prototype is neither Object.prototype nor Array.prototype",
    build: () => ({ entries: [Object.create(Object.create(null) as object) as object] }),
  },
  {
    name: "an array without a prototype",
    rule: "class-instance",
    path: "entries",
    found: "an object whose prototype is neither Object.prototype nor Array.prototype",
    build: () => ({ entries: Object.setPrototypeOf([], null) as unknown }),
  },
  {
    name: "an instance of a subclass of Array",
    rule: "class-instance",
    path: "entries[0].config.lockstepInstances",
    found: "an instance of Instances",
    build: () => ({ entries: [{ id: "core", config: { lockstepInstances: new (class Instances extends Array {})() } }] }),
  },
  {
    name: "an empty array slot",
    rule: "hole",
    path: "entries[1]",
    found: "an empty array slot",
    build: () => ({ entries: [{ id: "core" }, , { id: "stats" }] }),
  },
  {
    name: "a property of an array besides its elements",
    rule: "array-property",
    path: "entries[0].config.lockstepInstances.primary",
    found: "a property of an array besides its elements",
    build: withArrayProperty,
  },
  {
    name: 'a property of an array named like an element, "01"',
    rule: "array-property",
    path: 'entries[0].config.lockstepInstances["01"]',
    found: "a property of an array besides its elements",
    build: () => withElementLikeProperty("01"),
  },
  {
    name: 'a property of an array named like an element, "1.5"',
    rule: "array-property",
    path: 'entries[0].config.lockstepInstances["1.5"]',
    found: "a property of an array besides its elements",
    build: () => withElementLikeProperty("1.5"),
  },
  {
    name: "a getter",
    rule: "accessor",
    path: "entries[0].config.limit",
    found: "a getter or setter",
    build: withGetter,
  },
  {
    name: "a property keyed by a symbol",
    rule: "symbol-key",
    path: "entries[0].config[Symbol(tag)]",
    found: "a property keyed by a symbol",
    build: () => ({ entries: [{ id: "stats", config: { pollMs: 1000, [Symbol("tag")]: 1 } }] }),
  },
  {
    name: "a non-enumerable property",
    rule: "not-enumerable",
    path: "entries[0].config.token",
    found: "a non-enumerable property",
    build: withHiddenProperty,
  },
  {
    name: "a cycle",
    rule: "cycle",
    path: "entries[0].config.self",
    found: "an object that contains it (a cycle)",
    build: withCycle,
  },
  {
    name: "the default export itself",
    rule: "function",
    path: "",
    found: "a function",
    build: () => () => ({ entries: [] }),
  },
];

let directory = "";
/** Each `A26` row's configuration file, by row name. */
const files = new Map<string, string>();

beforeAll(() => {
  delete process.env[UNSET];
  directory = mkdtempSync(join(tmpdir(), "umbradb-a26-"));
  writeFileSync(join(directory, "package.json"), '{ "type": "module" }\n');
  A26.forEach((row, index) => {
    const file = join(directory, `a26-${index}.config.ts`);
    writeFileSync(file, configSource(row.entries as string));
    files.set(row.name, file);
  });
});

afterAll(() => {
  if (directory !== "") rmSync(directory, { recursive: true, force: true });
});

/** A row's value: the default export of its configuration file, or the value built here. */
async function valueOf(row: Row): Promise<unknown> {
  if (row.build !== undefined) return row.build();
  const file = files.get(row.name) as string;
  return ((await import(pathToFileURL(file).href)) as { default: unknown }).default;
}

/** The rows `rules` do not refuse as the row says, each with what went wrong. */
async function failures(rules: readonly PlainDataRule[]): Promise<string[]> {
  const out: string[] = [];
  for (const row of [...A26, ...OTHERS]) {
    const value = await valueOf(row);
    const error = await thrown(() => plainDataWith(value, rules));
    if (error === undefined) out.push(`${row.name}: accepted`);
    else if (!(error instanceof UmbraError)) out.push(`${row.name}: threw ${(error as Error).name}`);
    else if (error.code !== "not-plain-data") out.push(`${row.name}: ${error.code}`);
    else if (error.details.path !== row.path || error.details.found !== row.found) out.push(`${row.name}: details`);
  }
  return out;
}

describe("A26: each value that is not plain data refuses startup with not-plain-data and its path (CF-1)", () => {
  for (const row of A26) {
    it(row.name, async () => {
      const file = files.get(row.name) as string;
      const error = await refusal(() => loadConfig({ file }));
      expect(error.code).toBe("not-plain-data");
      expect(error.retryable).toBe(false);
      expect(error.details).toEqual({ file, path: row.path, found: row.found });
      expect(error.message).toContain(file);
      expect(error.message).toContain(`the configuration's value at ${row.path} is ${row.found}`);
      expect(error.message).toContain(
        "a configuration holds objects, arrays, strings, booleans, null and integers from 0 to 2^53 - 1;",
      );
    });
  }

  it("covers A26's seven values, each refused by a rule of its own", () => {
    expect(A26.map((row) => row.rule)).toEqual([
      "function",
      "class-instance",
      "undefined",
      "bigint",
      "not-integer",
      "below-zero",
      "above-max",
    ]);
  });

  it("control: the same file without the value loads", async () => {
    const file = join(directory, "a26-control.config.ts");
    writeFileSync(file, configSource(`[${CORE}, stats.entry({ start: 2_500_000, stop: 2_600_000, config: { pollMs: 1000 } })]`));
    const { data } = await loadConfig({ file });
    expect(data).toEqual({
      entries: [
        { id: "core", start: 0, version: buildCoreVersion(), config: { ...CORE_SETTINGS } },
        { id: "stats", start: 2_500_000, stop: 2_600_000, version: "1.2.0", config: { pollMs: 1000 } },
      ],
    });
  });
});

describe("CF-1: the plain-data check refuses everything else that is not data, each by its rule", () => {
  for (const row of OTHERS) {
    it(row.name, async () => {
      const value = await valueOf(row);
      const error = await refusal(() => plainData(value));
      expect(error.code).toBe("not-plain-data");
      expect(error.details).toEqual({ path: row.path, found: row.found });
    });
  }

  it("names the default export itself when it is not plain data", async () => {
    const error = await refusal(() => plainData(() => 0));
    expect(error.message).toMatch(/^the configuration's default export is a function, which is not plain data: /);
  });

  it("names a key that is not an identifier with brackets and quotes", async () => {
    const value = { "a b": { "c-d": [{ "": () => 0 }] } };
    expect((await refusal(() => plainData(value))).details.path).toBe('["a b"]["c-d"][0][""]');
    expect((await refusal(() => plainData({ x: { "0": () => 0 } }))).details.path).toBe('x["0"]');
    expect((await refusal(() => plainData({ $a_1: { _b: () => 0 } }))).details.path).toBe("$a_1._b");
  });

  it("never calls a getter: it names the getter without reading it", async () => {
    let reads = 0;
    const settings = {};
    Object.defineProperty(settings, "token", { get: () => ++reads, enumerable: true });
    const error = await refusal(() => plainData({ entries: [{ id: "stats", config: settings }] }));
    expect(error.details).toEqual({ path: "entries[0].config.token", found: "a getter or setter" });
    expect(reads).toBe(0);
  });

  it("refuses the first value that is not data, depth first in property order", async () => {
    const value = { a: { b: [1, { c: () => 0 }], d: 1.5 }, e: undefined };
    expect((await refusal(() => plainData(value))).details.path).toBe("a.b[1].c");
  });

  it("gives each rule's fix in its message", async () => {
    const fixes: readonly (readonly [unknown, string])[] = [
      [{ x: () => 0 }, "compute the value in the file and write the result"],
      [{ x: new Uint8Array(1) }, "byte values as 0x-prefixed lowercase hex strings"],
      [{ x: undefined }, "leave the property out"],
      [{ x: 1n }, "write heights and counts as numbers"],
      [{ x: 0.5 }, "a configuration's numbers are integers"],
      [{ x: -2 }, "from 0"],
      [{ x: 2 ** 60 }, "is not exact"],
    ];
    for (const [value, fix] of fixes) expect((await refusal(() => plainData(value))).message, fix).toContain(fix);
  });

  it("has the rules in this order: how a place holds its value first, then the value", () => {
    // An empty slot or a getter holds no value to read, so it is named as such before `undefined` could name it.
    expect(PLAIN_DATA_RULES.map((rule) => rule.name)).toEqual([
      "hole",
      "array-property",
      "symbol-key",
      "not-enumerable",
      "accessor",
      "undefined",
      "function",
      "bigint",
      "symbol",
      "not-integer",
      "below-zero",
      "above-max",
      "class-instance",
      "cycle",
    ]);
    expect(Object.isFrozen(PLAIN_DATA_RULES)).toBe(true);
  });

  it("refuses every row with every rule, each with its own path and words", async () => {
    expect(await failures(PLAIN_DATA_RULES)).toEqual([]);
  });

  it("negative control: a check that skips one rule fails exactly that rule's rows", async () => {
    for (const rule of PLAIN_DATA_RULES) {
      const without = PLAIN_DATA_RULES.filter((other) => other !== rule);
      const expected = [...A26, ...OTHERS].filter((row) => row.rule === rule.name).map((row) => row.name);
      const failed = (await failures(without)).map((failure) => failure.slice(0, failure.lastIndexOf(":")));
      expect(failed, rule.name).toEqual(expected);
      expect(expected.length, rule.name).toBeGreaterThan(0);
    }
  });
});

describe("CF-1: plain data is accepted, and the check returns a frozen copy of it", () => {
  it("accepts objects, arrays, strings, booleans, null and integers from 0 to 2^53 − 1", () => {
    const value = {
      a: 0,
      b: Number.MAX_SAFE_INTEGER,
      c: "",
      d: true,
      e: false,
      f: null,
      g: [],
      h: {},
      i: [[{ j: ["k", 1, null] }]],
    };
    expect(plainData(value)).toEqual(value);
  });

  it("reads −0 as the integer 0", () => {
    const copy = plainData({ start: -0 }) as { start: number };
    expect(Object.is(copy.start, 0)).toBe(true);
  });

  it("accepts an object without a prototype, and copies it as a plain object", () => {
    const value = Object.assign(Object.create(null) as Record<string, unknown>, { network: "preprod" });
    const copy = plainData(value) as object;
    expect(copy).toEqual({ network: "preprod" });
    expect(Object.getPrototypeOf(copy)).toBe(Object.prototype);
  });

  it("keeps a key named __proto__ as data, without changing the copy's prototype", () => {
    const value = JSON.parse('{ "__proto__": { "polluted": true }, "a": 1 }') as unknown;
    const copy = plainData(value) as Record<string, unknown>;
    expect(Object.keys(copy)).toEqual(["__proto__", "a"]);
    expect(Object.getPrototypeOf(copy)).toBe(Object.prototype);
    expect(Object.getOwnPropertyDescriptor(copy, "__proto__")?.value).toEqual({ polluted: true });
    expect(({} as Record<string, unknown>).polluted).toBeUndefined();
  });

  it("accepts an object reached twice (not a cycle), and copies it at each place", () => {
    const shared = { pollMs: 1000 };
    const copy = plainData({ a: shared, b: [shared] }) as { a: object; b: object[] };
    expect(copy).toEqual({ a: { pollMs: 1000 }, b: [{ pollMs: 1000 }] });
    expect(copy.a).not.toBe(shared);
  });

  it("accepts frozen input, and returns a deeply frozen copy detached from it", () => {
    const inner = { pollMs: 1000 };
    const value = { entries: [{ id: "stats", config: inner }] };
    const copy = plainData(Object.freeze(value)) as { entries: { config: { pollMs: number } }[] };
    inner.pollMs = 2000;
    expect(copy.entries[0]?.config.pollMs).toBe(1000);
    expect(Object.isFrozen(copy)).toBe(true);
    expect(Object.isFrozen(copy.entries)).toBe(true);
    expect(Object.isFrozen(copy.entries[0])).toBe(true);
    expect(Object.isFrozen(copy.entries[0]?.config)).toBe(true);
  });

  it("names the file in the message and details when one is given", async () => {
    const error = await refusal(() => plainData({ x: () => 0 }, "/etc/umbradb.config.ts"));
    expect(error.details).toEqual({ file: "/etc/umbradb.config.ts", path: "x", found: "a function" });
    expect(error.message).toMatch(/^\/etc\/umbradb\.config\.ts: the configuration's value at x is a function/);
  });
});

describe("CF-3: plain data equal field for field (task 4.2)", () => {
  it("is equal whatever the order of an object's keys, at any depth", () => {
    expect(samePlainData({ a: 1, b: [{ c: "x", d: null }] }, { b: [{ d: null, c: "x" }], a: 1 })).toBe(true);
    expect(samePlainData([], [])).toBe(true);
    expect(samePlainData("x", "x")).toBe(true);
  });

  it("differs in a value, a key, a length, an order of elements or a type", () => {
    expect(samePlainData({ a: 1 }, { a: 2 })).toBe(false);
    expect(samePlainData({ a: 1 }, { b: 1 })).toBe(false);
    expect(samePlainData({ a: 1 }, { a: 1, b: 2 })).toBe(false);
    expect(samePlainData([1, 2], [2, 1])).toBe(false);
    expect(samePlainData([1], [1, 1])).toBe(false);
    expect(samePlainData([], {})).toBe(false);
    expect(samePlainData({}, [])).toBe(false);
    expect(samePlainData({ a: null }, { a: {} })).toBe(false);
    expect(samePlainData(null, {})).toBe(false);
    expect(samePlainData(1, "1")).toBe(false);
    // A key the other object does not have of its own, though every object inherits it.
    const own = JSON.parse('{"__proto__": {}}') as PlainData;
    expect(samePlainData(own, { x: 1 })).toBe(false);
    expect(samePlainData({ constructor: {} } as PlainData, { x: {} })).toBe(false);
  });
});
