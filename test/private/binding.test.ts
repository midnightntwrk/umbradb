import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { DatabaseParts, PglitePathParts } from "../../src/config/database-parts.js";
import {
  type PrivateIntakeOptions,
  privateCursorHeight,
  startHashDecision,
} from "../../src/backbone/core-private-source/index.js";
import {
  PRIVATE_BACKENDS,
  type PrivateBackend,
  READER_LOGIN,
  START_TIMEOUT_MS,
  type TestDatabase,
  TEST_TIMEOUT_MS,
} from "./backends.js";
import { cursorHeight } from "../../src/backbone/core-block-commit/sql.js";
import { readIdentity } from "../../src/backbone/core-chain/index.js";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { openPglite } from "../../src/db/pglite.js";
import { builtInNetwork } from "../../src/ledger/networks.js";
import { genesisHex, launchPrivate, type PrivateOptions, type PublicCore, startPublicCore } from "./builds.js";

/**
 * A private database is bound to one public database. Its first start records the public database's genesis hash and
 * S in `core_private_source.cursor`. Every later start against a public database whose genesis hash or S differs — or
 * with a private S below the public S — is refused with `private-binding-mismatch` (the process stays up, `refused`,
 * the private database unchanged), and the database it is bound to still starts it. [A113, PP-2]
 *
 * The configured network is compared first, so the start against another network's public database is refused for its
 * network (`details.reason` `network`) before the comparison with the recorded binding. That comparison still refuses
 * it on its own (`genesis`) when the network check is skipped. [PP-2, Q136 B]
 *
 * A private process configured for one network, starting for the first time against the public database of another,
 * is refused with `private-binding-mismatch` (`details.reason` `network`, the configured network's genesis hash and the
 * public database's) before any migration: its database holds no table, schema or binding afterwards. Configured for
 * the public database's network, it binds. [A156, PP-2, Q136 B]
 */

/**
 * How one start went: it started (and reached the head), or it was refused with a state, a reason code and the
 * refusal's details — and, on PostgreSQL, how many connections to the public database it held while it stayed
 * refused, before it was stopped.
 */
type Outcome =
  | "started"
  | {
      readonly state: string;
      readonly code: string | null;
      readonly message: string;
      readonly details?: Readonly<Record<string, unknown>>;
      readonly readers?: number;
    };

/** What the private database records of its binding, read from outside. */
interface Binding {
  readonly genesis: string;
  readonly start: number;
  readonly cursor: number | null;
  /** `core-chain`'s identity of the private database: the genesis hash it recorded, its S, whether anchored. */
  readonly chain: string | null;
}

/** What one binding run saw. [A113] */
interface A113Observation {
  readonly first: Outcome;
  readonly bound: Binding | null;
  readonly otherGenesis: Outcome;
  readonly otherStart: Outcome;
  readonly privateBelow: Outcome;
  readonly afterRefusals: Binding | null;
  readonly again: Outcome;
  /** PostgreSQL: the refused private processes' connections to the public databases left open. */
  readonly readersLeft?: number;
}

const A = genesisHex(0xa1);
const B = genesisHex(0xb2);

/**
 * Adds to `problems` what is wrong with `outcome`, a start that `what` describes and that must be refused with
 * `private-binding-mismatch`, `refused` and holding no connection to the public database.
 */
function checkRefused(problems: string[], outcome: Outcome, what: string): void {
  if (outcome === "started") {
    problems.push(`${what}: the private process started`);
    return;
  }
  if (outcome.code !== "private-binding-mismatch") problems.push(`${what}: refused with ${outcome.code}`);
  if (outcome.state !== "refused") problems.push(`${what}: the process was ${outcome.state}, not refused`);
  if ((outcome.readers ?? 0) !== 0) {
    problems.push(`${what}: the refused process kept ${outcome.readers} connections to the public database`);
  }
}

/** The binding oracle: every problem with what was observed, none when the binding holds. [A113] */
function a113Problems(observed: A113Observation): string[] {
  const problems: string[] = [];
  const refused = (outcome: Outcome, what: string) => checkRefused(problems, outcome, what);
  if (observed.first !== "started") problems.push(`the first start against A was refused (${observed.first.code})`);
  const expected = { genesis: A, start: 1, cursor: 3, chain: `${A} from 1, anchored` };
  if (JSON.stringify(observed.bound) !== JSON.stringify(expected)) {
    problems.push(`after its first start the binding is ${JSON.stringify(observed.bound)}, not ${JSON.stringify(expected)}`);
  }
  refused(observed.otherGenesis, "against a public database of another network");
  refused(observed.otherStart, "against a public database with another S");
  refused(observed.privateBelow, "a new private database whose S is below the public S");
  if (JSON.stringify(observed.afterRefusals) !== JSON.stringify(expected)) {
    problems.push(`the refusals changed the binding to ${JSON.stringify(observed.afterRefusals)}`);
  }
  if (observed.again !== "started") problems.push("the public database it is bound to no longer starts it");
  if ((observed.readersLeft ?? 0) !== 0) {
    problems.push(`the refused private processes left ${observed.readersLeft} connections to the public databases`);
  }
  return problems;
}

/** The binding row of a private database, from outside; null without one (or without its table). */
async function bindingIn(db: TestDatabase): Promise<Binding | null> {
  const { rows, identity } = await db.read(async (read) => {
    const [table] = await read.query("SELECT to_regclass('core_private_source.cursor') IS NOT NULL AS present");
    if (table?.present !== true) return { rows: [], identity: null };
    const found = await read.query(
      "SELECT public_genesis_hash AS genesis, public_start_height::int AS start, height::int AS cursor " +
        "FROM core_private_source.cursor",
    );
    return { rows: found, identity: await readIdentity(read) };
  }, privateCursorHeight);
  const [row] = rows;
  if (row === undefined) return null;
  const hex = (bytes: Uint8Array) => `0x${Buffer.from(bytes).toString("hex")}`;
  const chain =
    identity === null
      ? null
      : `${hex(identity.genesisHash)} from ${identity.start}, ${identity.anchorHash === null ? "not anchored" : "anchored"}`;
  return {
    genesis: hex(row.genesis as Uint8Array),
    start: Number(row.start),
    cursor: row.cursor === null ? null : Number(row.cursor),
    chain,
  };
}

/** Runs `body` with a public core on `db` (genesis `genesis`, S `start`, head 3), stopped afterwards. */
async function withCore<T>(db: TestDatabase, genesis: string, start: number, body: (core: PublicCore) => Promise<T>) {
  const core = await startPublicCore({ database: db.setting, head: 3n, start, genesisHash: genesis });
  try {
    return await body(core);
  } finally {
    await core.stop();
  }
}

/** A private start's options against `core`'s public database `db`. */
function against(backend: PrivateBackend, db: TestDatabase, core: PublicCore, rest: PrivateOptions): PrivateOptions {
  return backend.kind === "postgres"
    ? { ...rest, publicDatabase: db.readerSetting as DatabaseParts }
    : { ...rest, direct: () => core.db() };
}

/** The `UmbraError` `error` is or wraps (a failing `on-start-db` is a `CallbackFailure` whose cause it is), if any. */
function umbraIn(error: unknown): UmbraError | undefined {
  for (let at = error; at instanceof Error; at = at.cause) if (at instanceof UmbraError) return at;
  return undefined;
}

/**
 * Starts a private process expecting either outcome; one that starts is run to the head 3 when `reach` says so, and
 * of one that is refused the connections it holds to `publicDb` (PostgreSQL) are counted before it is stopped.
 */
async function outcomeOf(options: PrivateOptions, reach = false, publicDb?: TestDatabase): Promise<Outcome> {
  const running = launchPrivate(options);
  try {
    await running.handle.started;
  } catch (error) {
    const status = running.handle.status();
    const readers = await publicDb?.connected?.(READER_LOGIN);
    await running.stop();
    const refusal = {
      state: status.state,
      code: status.reason?.code ?? null,
      message: (error as Error).message,
      ...(umbraIn(error) === undefined ? {} : { details: (umbraIn(error) as UmbraError).details }),
    };
    return readers === undefined ? refusal : { ...refusal, readers };
  }
  try {
    if (reach) await running.reach(3n);
    return "started";
  } finally {
    await running.stop();
  }
}

/** Runs the binding starts on `backend`; `intake` is a negative control's. [A113] */
async function a113Run(backend: PrivateBackend, intake: Omit<PrivateIntakeOptions, "publicDatabase" | "wakes"> = {}) {
  const publicA = await backend.database("public");
  const publicB = await backend.database("public");
  const publicC = await backend.database("public");
  const privateDb = await backend.database("private");
  const below = await backend.database("private");
  const base: PrivateOptions = { database: privateDb.setting, genesisHash: A, intake };
  const first = await withCore(publicA, A, 1, (core) => outcomeOf(against(backend, publicA, core, base), true));
  const bound = await bindingIn(privateDb);
  const otherGenesis = await withCore(publicB, B, 1, (core) =>
    outcomeOf(against(backend, publicB, core, base), false, publicB),
  );
  const { otherStart, privateBelow } = await withCore(publicC, A, 2, async (core) => ({
    otherStart: await outcomeOf(against(backend, publicC, core, base), false, publicC),
    privateBelow: await outcomeOf(against(backend, publicC, core, { ...base, database: below.setting }), false, publicC),
  }));
  const afterRefusals = await bindingIn(privateDb);
  const again = await withCore(publicA, A, 1, (core) => outcomeOf(against(backend, publicA, core, base), true));
  const observed = { first, bound, otherGenesis, otherStart, privateBelow, afterRefusals, again };
  if (backend.kind !== "postgres") return observed;
  const left = async (db: TestDatabase) => (db.connected as (login: string) => Promise<number>)(READER_LOGIN);
  return { ...observed, readersLeft: (await left(publicB)) + (await left(publicC)) };
}

/** The genesis hash a known network's built-in table records (read from the table, never a constant), as `0x` hex. */
const builtInGenesis = (network: string): string => builtInNetwork(network)?.genesis?.hash as string;

/** Preprod's genesis hash with one byte in its middle (the 17th of 32) changed: another network, nearly the same hash. */
function nearPreprod(): string {
  const text = builtInGenesis("preprod");
  const at = 2 + 2 * 16;
  const byte = (Number.parseInt(text.slice(at, at + 2), 16) ^ 0x01).toString(16).padStart(2, "0");
  return `${text.slice(0, at)}${byte}${text.slice(at + 2)}`;
}

/** What a private database holds that a start creates (its tables and schemas, the tests' `public` left out). */
interface Created {
  readonly tables: readonly string[];
  readonly schemas: readonly string[];
}

/** The tables and schemas of `db` besides the system's and `public` (where the tests' login log is). */
async function createdIn(db: TestDatabase): Promise<Created> {
  return db.read(async (read) => {
    const tables = await read.query(
      "SELECT schemaname || '.' || tablename AS name FROM pg_tables " +
        "WHERE schemaname NOT IN ('pg_catalog', 'information_schema', 'public') ORDER BY 1",
    );
    const schemas = await read.query(
      "SELECT nspname AS name FROM pg_namespace " +
        "WHERE nspname NOT IN ('public', 'information_schema') AND nspname NOT LIKE 'pg\\_%' ORDER BY 1",
    );
    return { tables: tables.map((row) => row.name as string), schemas: schemas.map((row) => row.name as string) };
  }, privateCursorHeight);
}

/** What one network-check run saw, against the public database of a core whose genesis is preprod's. [A156] */
interface A156Observation {
  /** A private process configured for mainnet, on a new private database. */
  readonly mainnet: Outcome;
  /**
   * One configured for a custom network whose genesis hash differs from preprod's in one byte ({@link nearPreprod}), on
   * another new private database.
   */
  readonly custom: Outcome;
  /** What the two refused starts left in their databases. */
  readonly left: readonly Created[];
  /** The bindings those databases recorded. */
  readonly bindings: readonly (Binding | null)[];
  /** One configured for preprod, the public database's network, on the first of those databases. */
  readonly preprod: Outcome;
  /** The binding it recorded. */
  readonly bound: Binding | null;
}

/** The network-check oracle: every problem with what was observed, none when the check holds. [A156] */
function a156Problems(observed: A156Observation): string[] {
  const problems: string[] = [];
  const preprod = builtInGenesis("preprod");
  const refused = (outcome: Outcome, what: string, network: string, configured: string) => {
    checkRefused(problems, outcome, what);
    if (outcome === "started") return;
    const expected = { reason: "network", network, configured, public: preprod };
    if (JSON.stringify(outcome.details) !== JSON.stringify(expected)) {
      problems.push(`${what}: refused with the details ${JSON.stringify(outcome.details)}, not ${JSON.stringify(expected)}`);
    }
  };
  refused(observed.mainnet, "configured for mainnet against preprod's public database", "mainnet", builtInGenesis("mainnet"));
  const custom = "configured for another custom network against preprod's public database";
  refused(observed.custom, custom, "custom", nearPreprod());
  observed.left.forEach((left, index) => {
    if (left.tables.length > 0 || left.schemas.length > 0) {
      problems.push(`refused start ${index + 1} left ${JSON.stringify(left)} in its private database (a migration ran)`);
    }
  });
  observed.bindings.forEach((binding, index) => {
    if (binding !== null) problems.push(`refused start ${index + 1} recorded the binding ${JSON.stringify(binding)}`);
  });
  if (observed.preprod !== "started") {
    const why = observed.preprod.code === null ? observed.preprod.message : observed.preprod.code;
    problems.push(`configured for preprod, its public database's network, it was refused (${why})`);
  }
  const expected = { genesis: preprod, start: 1, cursor: 3, chain: `${preprod} from 1, anchored` };
  if (JSON.stringify(observed.bound) !== JSON.stringify(expected)) {
    problems.push(`configured for preprod it bound ${JSON.stringify(observed.bound)}, not ${JSON.stringify(expected)}`);
  }
  return problems;
}

/** Runs the network-check starts on `backend`; `intake` is a negative control's. [A156] */
async function a156Run(
  backend: PrivateBackend,
  intake: Omit<PrivateIntakeOptions, "publicDatabase" | "wakes"> = {},
): Promise<A156Observation> {
  const publicDb = await backend.database("public");
  const first = await backend.database("private");
  const second = await backend.database("private");
  // A public core whose chain's genesis is preprod's: its identity records preprod's genesis hash.
  return withCore(publicDb, builtInGenesis("preprod"), 1, async (core) => {
    const start = (database: TestDatabase, rest: Omit<PrivateOptions, "database">) =>
      against(backend, publicDb, core, { database: database.setting, intake, ...rest });
    const mainnet = await outcomeOf(start(first, { network: "mainnet" }), false, publicDb);
    const custom = await outcomeOf(start(second, { genesisHash: nearPreprod() }), false, publicDb);
    const left = [await createdIn(first), await createdIn(second)];
    const bindings = [await bindingIn(first), await bindingIn(second)];
    const preprod = await outcomeOf(start(first, { network: "preprod" }), true);
    return { mainnet, custom, left, bindings, preprod, bound: await bindingIn(first) };
  });
}

describe.each(PRIVATE_BACKENDS)("A113 a private database is bound to one public database ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "refuses with private-binding-mismatch against another public database, and starts against its own",
    async () => {
      const observed = await a113Run(backend);
      expect(a113Problems(observed)).toEqual([]);
      // The configured network (A's) is compared first: another network's public database is refused for it. [Q136 B]
      const refusal = observed.otherGenesis as Exclude<Outcome, "started">;
      expect(refusal.code).toBe("private-binding-mismatch");
      expect(refusal.details).toEqual({ reason: "network", network: "custom", configured: A, public: B });
      expect(refusal.message).toContain(`genesis hash is ${A}`);
      expect(refusal.message).toContain(B);
      expect((observed.otherStart as Exclude<Outcome, "started">).details).toMatchObject({ reason: "start" });
      expect((observed.privateBelow as Exclude<Outcome, "started">).details).toMatchObject({
        reason: "private-start-below",
      });
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "with the configured network's check skipped, PP-2's binding alone refuses another network's public database",
    async () => {
      const observed = await a113Run(backend, { network: () => null });
      expect(a113Problems(observed)).toEqual([]);
      const refusal = observed.otherGenesis as Exclude<Outcome, "started">;
      expect(refusal.details).toEqual({ reason: "genesis", recorded: A, public: B });
      expect(refusal.message).toContain(`genesis hash ${A}`);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "refuses a public database whose core has never started, which has no chain identity to bind to",
    async () => {
      const publicDb = await backend.database("public");
      const privateDb = await backend.database("private");
      let opened: Database | undefined;
      const options: PrivateOptions =
        backend.kind === "postgres"
          ? { database: privateDb.setting, publicDatabase: publicDb.readerSetting as DatabaseParts }
          : {
              database: privateDb.setting,
              direct: () => opened as Database,
            };
      if (backend.kind === "pglite") {
        const dataDir = (publicDb.setting as PglitePathParts).path;
        opened = await openPglite({ dataDir, committedHeight: cursorHeight, developmentOptIn: true });
      }
      try {
        const outcome = await outcomeOf(options);
        expect(outcome).toMatchObject({ state: "refused", code: "private-binding-mismatch" });
        expect((outcome as Exclude<Outcome, "started">).message).toContain("its core has never started");
        expect(await bindingIn(privateDb)).toBeNull();
      } finally {
        await opened?.close();
      }
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: a private chain check that compares nothing — no configured network, no binding — fails A113",
    async () => {
      // A binding check that compares nothing alone is no longer enough: the configured network's check refuses the
      // other network's public database first, so both are skipped. So is the comparison of the public configuration
      // hash the private database accepted, which another public database's configuration fails too: every start is
      // taken for a first one. [Q136 B, PP-14, Q159]
      const problems = a113Problems(
        await a113Run(backend, {
          binding: () => null,
          network: () => null,
          acceptance: (hashes) => startHashDecision({ ...hashes, recorded: null }),
        }),
      );
      expect(problems).toContain("against a public database of another network: the private process started");
      expect(problems).toContain("against a public database with another S: the private process started");
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "A156 configured for another network refuses with private-binding-mismatch before any migration, and binds for its own",
    async () => {
      const observed = await a156Run(backend);
      expect(a156Problems(observed)).toEqual([]);
      const refusal = observed.mainnet as Exclude<Outcome, "started">;
      expect(refusal.code).toBe("private-binding-mismatch");
      expect(refusal.message).toContain(`configured for the network mainnet, whose genesis hash is ${builtInGenesis("mainnet")}`);
      expect(refusal.message).toContain(`the public database's genesis hash is ${builtInGenesis("preprod")}`);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: a chain check that skips the configured network binds A156's other network and fails A156",
    async () => {
      const problems = a156Problems(await a156Run(backend, { network: () => null }));
      expect(problems).toContain("configured for mainnet against preprod's public database: the private process started");
      expect(problems).toContain(
        "configured for another custom network against preprod's public database: the private process started",
      );
    },
    TEST_TIMEOUT_MS,
  );
});
