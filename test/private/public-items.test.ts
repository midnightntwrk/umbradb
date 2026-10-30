import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { z } from "zod";
import type { PrivateIntakeOptions } from "../../src/backbone/core-private-source/index.js";
import { UmbraError } from "../../src/db/errors.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { PublicItem } from "../../src/modules/graph.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, type TestDatabase, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPrivate, type PrivateOptions, type PublicCore, startPublicCore } from "./builds.js";

/**
 * A private module may require the public core's `table` items. On PostgreSQL 18.6 and PGlite 0.5.10, a private module
 * `reader` requires `pub-rows` (the `table` item of the public core's module `pub`) and `blocks` (the public backbone's,
 * `core-block-commit`). [A155, PP-13, Q126 B]
 * - It starts when the public core provides both at every height it runs, and reads `pub.rows` at each of them through
 *   its read of public data.
 * - It is refused with `item-no-provider` naming `pub-rows` against a public core that does not enable `pub`.
 * - It is refused with `item-not-available` when `pub` starts above the reader's start or stops below the heights it
 *   runs.
 * - A private module requiring a public `block` item (`block-header`) is refused (`item-no-provider`): only `table`
 *   items are recorded.
 * [A155, PP-13]
 *
 * The public core records each revision's `table` items in `core_chain.config.provides`, which the private process
 * reads at startup. The committed negative controls replace the intake's view of the public items: with none, the
 * provided case is refused; with every one provided at every height, the not-available cases start. [design §8, §10]
 */

/** The public core's module `pub`: its `table` item `pub-rows`, `pub.rows` holding every height it ran. */
const PUB: ModuleDeclaration = {
  id: "pub",
  version: "1.0.0",
  side: "public",
  requires: ["block-header"],
  provides: [{ name: "pub-rows", lifetimes: ["table"], table: { schema: "pub", tables: ["rows"], kind: "append-only" } }],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [{ id: "001", sql: "CREATE TABLE pub.rows (height bigint PRIMARY KEY)" }],
  points: {
    async "on-db-write"(_p, b, w) {
      await w.execute("INSERT INTO pub.rows (height) VALUES ($1)", [b.height]);
    },
  },
};

/**
 * The private module `reader`: requires `pub-rows` and `blocks`; its `on-fetch` reads the public block and `pub`'s
 * row at the block's height through its read of public data, and fails without either.
 */
const READER: ModuleDeclaration = {
  id: "reader",
  version: "1.0.0",
  side: "private",
  requires: ["pub-rows", "blocks"],
  provides: [],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {
    async "on-fetch"(_p, b, _out, read) {
      if (read === undefined) throw new Error("reader's on-fetch got no read of public data");
      const [block] = await read.query("SELECT hash FROM core_block_commit.blocks WHERE height = $1", [b.height]);
      const [row] = await read.query("SELECT height FROM pub.rows WHERE height = $1", [b.height]);
      if (block === undefined || row === undefined) throw new Error(`no public block or pub row at ${b.height}`);
    },
  },
};

/** A private module requiring the public `block` item `block-header`, which no public `table` item is. */
const HEADER: ModuleDeclaration = { ...READER, id: "header", requires: ["block-header"], points: {} };

/**
 * How one private start went: `started` (and reached the head 3), `started, then …` (its startup completed and its
 * processing ended before the head), or refused with a state, a code and the refusal's details.
 */
type Outcome =
  | string
  | { readonly state: string; readonly code: string | null; readonly details: Readonly<Record<string, unknown>> | null };

/** The `UmbraError` `error` is or wraps, if any. */
function umbraIn(error: unknown): UmbraError | undefined {
  for (let at = error; at instanceof Error; at = at.cause) if (at instanceof UmbraError) return at;
  return undefined;
}

/** What one run saw. [A155] */
interface A155Observation {
  /** `pub` from 1 (S): `reader` from 1. */
  readonly provided: Outcome;
  /** The same public core: `header`, requiring a public block item. */
  readonly blockItem: Outcome;
  /** A public core without `pub`: `reader` from 1. */
  readonly unprovided: Outcome;
  /** `pub` from 2: `reader` from 1, and `reader` from 2. */
  readonly late: Outcome;
  readonly lateFromItsStart: Outcome;
  /** `pub` from 1, stopping at 2: `reader` from 1. */
  readonly stopped: Outcome;
}

/** The oracle: every problem with what was observed, none when all the cases above hold. [A155] */
function a155Problems(observed: A155Observation): string[] {
  const problems: string[] = [];
  const started = (outcome: Outcome, what: string) => {
    if (typeof outcome === "string") {
      if (outcome !== "started") problems.push(`${what}: ${outcome}`);
      return;
    }
    problems.push(`${what}: refused (${outcome.code}) ${JSON.stringify(outcome.details, jsonSafe)}`);
  };
  const refused = (outcome: Outcome, what: string, code: string, details: Readonly<Record<string, unknown>>) => {
    if (typeof outcome === "string") {
      problems.push(`${what}: the private process started`);
      return;
    }
    if (outcome.state !== "refused") problems.push(`${what}: the process was ${outcome.state}, not refused`);
    if (outcome.code !== code) problems.push(`${what}: refused with ${outcome.code}, not ${code}`);
    for (const [key, value] of Object.entries(details)) {
      if (JSON.stringify(outcome.details?.[key], jsonSafe) !== JSON.stringify(value, jsonSafe)) {
        problems.push(`${what}: its ${key} is ${JSON.stringify(outcome.details?.[key], jsonSafe)}, not ${JSON.stringify(value, jsonSafe)}`);
      }
    }
  };
  started(observed.provided, "pub provided from S");
  refused(observed.blockItem, "a public block item required", "item-no-provider", { module: "header", item: "block-header" });
  refused(observed.unprovided, "a public core without pub", "item-no-provider", { module: "reader", item: "pub-rows" });
  refused(observed.late, "pub from 2, reader from 1", "item-not-available", {
    module: "reader",
    item: "pub-rows",
    range: { from: 1n, to: 1n },
    publicProviders: ["pub"],
  });
  started(observed.lateFromItsStart, "pub from 2, reader from 2");
  refused(observed.stopped, "pub stopping at 2, reader from 1", "item-not-available", {
    module: "reader",
    item: "pub-rows",
    range: { from: 3n, to: null },
    publicProviders: ["pub"],
  });
  return problems;
}

/** `JSON.stringify`'s replacer for heights. */
const jsonSafe = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}n` : value);

/** A private start's options against `core`'s public database `db`. */
function against(backend: PrivateBackend, db: TestDatabase, core: PublicCore, rest: PrivateOptions): PrivateOptions {
  return backend.kind === "postgres"
    ? { ...rest, publicDatabase: db.readerSetting as DatabaseParts }
    : { ...rest, direct: () => core.db() };
}

/** Starts a private process expecting either outcome; one that starts is run to the head 3. */
async function outcomeOf(options: PrivateOptions): Promise<Outcome> {
  const running = launchPrivate(options);
  try {
    await running.handle.started;
  } catch (error) {
    const status = running.handle.status();
    await running.stop();
    return { state: status.state, code: status.reason?.code ?? null, details: umbraIn(error)?.details ?? null };
  }
  try {
    await running.reach(3n);
    return "started";
  } catch {
    const status = running.handle.status();
    return `started, then ${status.state} (${status.reason?.code ?? "no reason"}) at ${String(status.cursor)}`;
  } finally {
    await running.stop();
  }
}

/** Runs `body` with a public core at head 3 whose module `pub` has the entry `pub` (none when null). */
async function withCore<T>(
  backend: PrivateBackend,
  pub: Readonly<Record<string, unknown>> | null,
  body: (db: TestDatabase, core: PublicCore) => Promise<T>,
): Promise<T> {
  const db = await backend.database("public");
  const core = await startPublicCore({
    database: db.setting,
    head: 3n,
    modules: [PUB],
    entries: pub === null ? [] : [{ id: "pub", version: "1.0.0", config: {}, ...pub }],
  });
  try {
    return await body(db, core);
  } finally {
    await core.stop();
  }
}

/** Runs the starts above on `backend`; `intake` is a negative control's. [A155] */
async function a155Run(
  backend: PrivateBackend,
  intake: Omit<PrivateIntakeOptions, "publicDatabase" | "wakes"> = {},
): Promise<A155Observation> {
  const start = async (db: TestDatabase, core: PublicCore, module: ModuleDeclaration, from: number) =>
    outcomeOf(
      against(backend, db, core, {
        database: (await backend.database("private")).setting,
        intake,
        modules: [module],
        entries: [{ id: module.id, start: from, version: "1.0.0", config: {} }],
      }),
    );
  const { provided, blockItem } = await withCore(backend, { start: 1 }, async (db, core) => ({
    provided: await start(db, core, READER, 1),
    blockItem: await start(db, core, HEADER, 1),
  }));
  const unprovided = await withCore(backend, null, (db, core) => start(db, core, READER, 1));
  const { late, lateFromItsStart } = await withCore(backend, { start: 2 }, async (db, core) => ({
    late: await start(db, core, READER, 1),
    lateFromItsStart: await start(db, core, READER, 2),
  }));
  const stopped = await withCore(backend, { start: 1, stop: 2 }, (db, core) => start(db, core, READER, 1));
  return { provided, blockItem, unprovided, late, lateFromItsStart, stopped };
}

describe.each(PRIVATE_BACKENDS)("A155 a private module requiring public table items ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "starts when the public core provides the item at every height it runs; else item-no-provider or item-not-available",
    async () => {
      const observed = await a155Run(backend);
      expect(a155Problems(observed)).toEqual([]);
      expect(observed.unprovided).toMatchObject({ code: "item-no-provider", details: { item: "pub-rows" } });
      expect(observed.late).toMatchObject({ code: "item-not-available", details: { item: "pub-rows" } });
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: a graph that ignores the public items refuses A155's provided case",
    async () => {
      const problems = a155Problems(await a155Run(backend, { publicItems: () => [] }));
      expect(problems.some((problem) => problem.startsWith("pub provided from S: refused (item-no-provider)"))).toBe(true);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: a graph that ignores the public items' heights starts A155's item-not-available cases",
    async () => {
      const everywhere = (items: readonly PublicItem[]) => items.map((item) => ({ ...item, start: 0n, stop: null }));
      const problems = a155Problems(await a155Run(backend, { publicItems: everywhere }));
      expect(problems).toContain("pub from 2, reader from 1: the private process started");
      expect(problems).toContain("pub stopping at 2, reader from 1: the private process started");
    },
    TEST_TIMEOUT_MS,
  );
});
