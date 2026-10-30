import { PGlite } from "@electric-sql/pglite";
import type { DatabaseParts, PglitePathParts, PostgresParts } from "../../src/config/database-parts.js";
import { AsyncLocalStorage } from "node:async_hooks";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import {
  PRIVATE_BACKENDS,
  PRIVATE_LOGIN,
  type PrivateBackend,
  READER_LOGIN,
  type SessionSeen,
  START_TIMEOUT_MS,
  TEST_TIMEOUT_MS,
} from "./backends.js";
import { type PrivateOptions, startPrivate, startPublicCore } from "./builds.js";

/**
 * With a core and a private process running, the core's database connections reach only the public database. The
 * private process is bound to the core's public database and follows it as it commits. [A112, PP-1]
 *
 * What is looked at is every connection, not a sample. On PostgreSQL each database logs every session that logs in
 * (`backends.ts`: a login event trigger), with its login: the core's is the server's login, the private process's own
 * database is reached as `umbradb_private` and the public database, for its reads of public data, as `umbradb_reader`.
 * On PGlite a connection is an engine on a data directory, opened in the process: every `PGlite.create` is recorded
 * with the process whose work called it (an `AsyncLocalStorage` value each process is started in, which every
 * callback, read and timer of its startup and loop carries).
 */

/** Which process an engine or session belongs to: `core`, `private`, or the test's own (`test`). */
const owner = new AsyncLocalStorage<string>();

/** Every PGlite engine opened while the spy is on: its process and its data directory. */
const engines: { readonly owner: string; readonly dataDir: string }[] = [];

/** What one run saw. [A112] */
export interface A112Observation {
  readonly kind: PrivateBackend["kind"];
  /** PostgreSQL: the core's login. */
  readonly coreLogin?: string;
  /** PostgreSQL: the sessions each database saw log in. */
  readonly publicSessions?: readonly SessionSeen[];
  readonly privateSessions?: readonly SessionSeen[];
  /** PGlite: the engines each process opened, by data directory. */
  readonly engines?: readonly { readonly owner: string; readonly dataDir: string }[];
  readonly publicDir?: string;
  readonly privateDir?: string;
  /** The private cursor and the core's at the end, both expected at the head. */
  readonly privateCursor: bigint | null;
  readonly coreCursor: bigint | null;
  /** PostgreSQL: the private process's connections to the public database left once it stopped. */
  readonly readersLeft?: number;
}

const HEAD = 10n;

/** The oracle: every problem with what was observed, none when the core reaches only the public database. [A112] */
export function a112Problems(observed: A112Observation): string[] {
  const problems: string[] = [];
  if (observed.coreCursor !== HEAD) problems.push(`the core stopped at ${observed.coreCursor}, not ${HEAD}`);
  if (observed.privateCursor !== HEAD) problems.push(`the private process stopped at ${observed.privateCursor}, not ${HEAD}`);
  if (observed.kind === "postgres") {
    const runner = (sessions: readonly SessionSeen[]) => sessions.filter((session) => session.application === "umbradb");
    const privateRunner = runner(observed.privateSessions ?? []);
    const publicRunner = runner(observed.publicSessions ?? []);
    for (const session of privateRunner) {
      if (session.login !== PRIVATE_LOGIN) {
        problems.push(
          `a connection of ${session.login === observed.coreLogin ? "the core" : session.login} reached the private ` +
            "database",
        );
      }
    }
    if (!privateRunner.some((session) => session.login === PRIVATE_LOGIN)) {
      problems.push("the private process never connected to its database");
    }
    if (!publicRunner.some((session) => session.login === observed.coreLogin)) {
      problems.push("the core never connected to the public database");
    }
    if (!publicRunner.some((session) => session.login === READER_LOGIN)) {
      problems.push("the private process never read the public database");
    }
    for (const session of publicRunner) {
      if (session.login !== observed.coreLogin && session.login !== READER_LOGIN) {
        problems.push(`the public database saw a connection of ${session.login}`);
      }
    }
    if (observed.readersLeft !== 0) {
      problems.push(`the stopped private process left ${observed.readersLeft} connections to the public database`);
    }
  } else {
    const opened = observed.engines ?? [];
    const of = (process: string) => opened.filter((engine) => engine.owner === process).map((engine) => engine.dataDir);
    for (const dataDir of of("core")) {
      if (dataDir !== observed.publicDir) problems.push(`the core opened an engine on ${dataDir}, not the public database`);
    }
    if (!of("core").includes(observed.publicDir as string)) problems.push("the core never opened the public database");
    if (!of("private").includes(observed.privateDir as string)) problems.push("the private process never opened its database");
    for (const dataDir of of("private")) {
      if (dataDir !== observed.privateDir) problems.push(`the private process opened an engine on ${dataDir}`);
    }
  }
  return problems;
}

/** How a run's private process is wired: as it should be, or a negative control's way. */
export type Wiring = "own" | "core-settings";

/**
 * Runs a core to height 5 and a private process bound to it, then the core to {@link HEAD} with the private process
 * following, and observes every connection. `wiring` `core-settings` is the negative control's private process, which
 * reaches its own database through the core's settings: on PostgreSQL with the core's login, on PGlite opened as the
 * core's work (started in the core's process).
 */
export async function a112Run(backend: PrivateBackend, wiring: Wiring = "own"): Promise<A112Observation> {
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const postgres = backend.kind === "postgres";
  const coreLogin = postgres ? (publicDb.setting as PostgresParts).user : undefined;
  // The core's login and password (`test`, the server's).
  const privateSetting: DatabaseParts =
    postgres && wiring === "core-settings"
      ? {
          ...(privateDb.setting as PostgresParts),
          user: coreLogin as string,
          ...((publicDb.setting as PostgresParts).password === undefined
            ? {}
            : { password: (publicDb.setting as PostgresParts).password as string }),
        }
      : privateDb.setting;
  const first = engines.length;
  const core = await owner.run("core", () => startPublicCore({ database: publicDb.setting, head: 5n }));
  try {
    const options: PrivateOptions = {
      database: privateSetting,
      ...(postgres ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : { direct: () => core.db() }),
      within: (start) => owner.run(wiring === "core-settings" && !postgres ? "core" : "private", start),
    };
    const running = await startPrivate(options);
    let observation: A112Observation;
    try {
      await running.reach(5n);
      await core.advance(HEAD);
      await running.reach(HEAD);
      observation = {
        kind: backend.kind,
        privateCursor: running.handle.status().cursor,
        coreCursor: core.handle.status().cursor,
        ...(postgres
          ? {
              coreLogin: coreLogin as string,
              publicSessions: await (publicDb.sessions as () => Promise<SessionSeen[]>)(),
              privateSessions: await (privateDb.sessions as () => Promise<SessionSeen[]>)(),
            }
          : {
              engines: engines.slice(first),
              publicDir: (publicDb.setting as PglitePathParts).path,
              privateDir: (privateDb.setting as PglitePathParts).path,
            }),
      };
    } finally {
      await running.stop();
    }
    if (!postgres) return observation;
    return { ...observation, readersLeft: await (publicDb.connected as (login: string) => Promise<number>)(READER_LOGIN) };
  } finally {
    await core.stop();
  }
}

describe.each(PRIVATE_BACKENDS)("A112 the core's connections reach only the public database ($name)", (backend) => {
  beforeAll(async () => {
    await backend.start();
    const create = PGlite.create.bind(PGlite);
    // `PGlite.create` takes the data directory, or options holding it; the initdb of a new directory runs on an
    // in-memory engine of PGlite's own, created with options holding none, which is no database of the test.
    vi.spyOn(PGlite, "create").mockImplementation(((first?: unknown, options?: unknown) => {
      const dataDir = typeof first === "string" ? first : (first as { dataDir?: unknown } | undefined)?.dataDir;
      if (dataDir !== undefined) engines.push({ owner: owner.getStore() ?? "test", dataDir: String(dataDir) });
      return (create as (first?: unknown, options?: unknown) => Promise<PGlite>)(first, options);
    }) as typeof PGlite.create);
  }, START_TIMEOUT_MS);
  afterAll(async () => {
    vi.restoreAllMocks();
    await backend.stop();
  }, START_TIMEOUT_MS);

  it(
    "with a core and a private process running, the core's database connections reach only the public database",
    async () => {
      expect(a112Problems(await a112Run(backend))).toEqual([]);
    },
    TEST_TIMEOUT_MS,
  );

  it(
    "negative control: a private process reaching its own database through the core's settings fails A112",
    async () => {
      const observed = await a112Run(backend, "core-settings");
      const expected =
        backend.kind === "postgres"
          ? "a connection of the core reached the private database"
          : `the core opened an engine on ${observed.privateDir}, not the public database`;
      expect(a112Problems(observed)).toContain(expected);
    },
    TEST_TIMEOUT_MS,
  );
});
