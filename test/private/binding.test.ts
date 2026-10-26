import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { type PrivateIntakeOptions, privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import {
  PRIVATE_BACKENDS,
  type PrivateBackend,
  READER_LOGIN,
  START_TIMEOUT_MS,
  type TestDatabase,
  TEST_TIMEOUT_MS,
} from "./backends.js";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { readIdentity } from "../../src/backbone/core-chain/index.js";
import type { Database } from "../../src/db/api.js";
import { openPglite } from "../../src/db/pglite.js";
import { genesisHex, launchPrivate, type PrivateOptions, type PublicCore, startPublicCore } from "./builds.js";

/**
 * A113 (PP-2; task 14.1): a private database is bound to one public database. Its first start records the public
 * database's genesis hash and S in `core_private_source.cursor`; every later start against a public database whose
 * genesis hash or S differs — or with a private S below the public S — is refused with `private-binding-mismatch`
 * (the process stays up, `refused`, the private database unchanged), and the database it is bound to still starts it.
 */

/**
 * How one start went: it started (and reached the head), or it was refused with a state and a reason code — and, on
 * PostgreSQL, how many connections to the public database it held while it stayed refused, before it was stopped.
 */
type Outcome =
  | "started"
  | { readonly state: string; readonly code: string | null; readonly message: string; readonly readers?: number };

/** What the private database records of its binding, read from outside. */
interface Binding {
  readonly genesis: string;
  readonly start: number;
  readonly cursor: number | null;
  /** `core-chain`'s identity of the private database: the genesis hash it recorded, its S, whether anchored. */
  readonly chain: string | null;
}

/** What one A113 run saw. */
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

/** A113's oracle: every problem with what was observed, none when A113 holds. */
function a113Problems(observed: A113Observation): string[] {
  const problems: string[] = [];
  const refused = (outcome: Outcome, what: string) => {
    if (outcome === "started") {
      problems.push(`${what}: the private process started`);
      return;
    }
    if (outcome.code !== "private-binding-mismatch") problems.push(`${what}: refused with ${outcome.code}`);
    if (outcome.state !== "refused") problems.push(`${what}: the process was ${outcome.state}, not refused`);
    if ((outcome.readers ?? 0) !== 0) {
      problems.push(`${what}: the refused process kept ${outcome.readers} connections to the public database`);
    }
  };
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
    ? { ...rest, publicDatabase: db.readerSetting as string }
    : { ...rest, direct: () => core.db() };
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
    const refusal = { state: status.state, code: status.reason?.code ?? null, message: (error as Error).message };
    return readers === undefined ? refusal : { ...refusal, readers };
  }
  try {
    if (reach) await running.reach(3n);
    return "started";
  } finally {
    await running.stop();
  }
}

/** Runs A113's starts on `backend`; `intake` is a negative control's. */
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

describe.each(PRIVATE_BACKENDS)("A113 a private database is bound to one public database ($name)", (backend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it(
    "refuses with private-binding-mismatch against another public database, and starts against its own",
    async () => {
      const observed = await a113Run(backend);
      expect(a113Problems(observed)).toEqual([]);
      const refusal = observed.otherGenesis as Exclude<Outcome, "started">;
      expect(refusal.message).toContain(`genesis hash ${A}`);
      expect(refusal.message).toContain(B);
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
          ? { database: privateDb.setting, publicDatabase: publicDb.readerSetting as string }
          : {
              database: privateDb.setting,
              direct: () => opened as Database,
            };
      if (backend.kind === "pglite") {
        opened = await openPglite({ dataDir: publicDb.setting.slice("pglite:".length), committedHeight: cursorHeight, developmentOptIn: true });
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
    "negative control: a binding check that compares nothing fails A113",
    async () => {
      const problems = a113Problems(await a113Run(backend, { binding: () => null }));
      expect(problems).toContain("against a public database of another network: the private process started");
      expect(problems).toContain("against a public database with another S: the private process started");
    },
    TEST_TIMEOUT_MS,
  );
});
