import { z } from "zod";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { privateCursorHeight, type PrivateIntakeOptions } from "../../src/backbone/core-private-source/index.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { type PrivateBackend, type TestDatabase } from "./backends.js";
import { launchPrivate, launchPublicCore, type PrivateOptions, privateModule, type PublicCore } from "./builds.js";
import { pub } from "./config-hash-checks.js";
import { HoldingRelay } from "./relays.js";

/**
 * A private process keeps the public configuration hash it accepted in its private database. Each start compares it
 * with the hash in the core's first `hello-ack` and with the hash of the public history it read. On a difference it
 * stops with `public-config-changed`, naming the new hash and `--update-hash`. Started with `updateHash`
 * (`umbradb run --update-hash`) set to the new hash, it runs its full checks, records the hash and continues. Shared by
 * `accepted-hash.test.ts` and its negative controls' file; imports nothing of Vitest. [A165, PP-14, Q159]
 *
 * **The run** ({@link a165Run}): a public core with the public module `pub` (`./config-hash-checks.ts`: a data setting
 * `level`, a route `GET /level`), whose revision from 30 has `level` 1, then 2, then 3 — each a change of a data field
 * above the core's cursor, so another configuration hash, read from `X-Umbra-Config-Hash` at each start —, its
 * module API on a free port and, with a transport, its `listen.transport` behind a {@link HoldingRelay} that follows
 * its restarts; and a private process `acceptor` with `coreTransport` (the relay), or without one (PostgreSQL only: its
 * public database read directly), on one private database, started again and again — each start an "attempt". [RN-16]
 * 1. `first` — the core at 5 with `level` 1 (hash H1): the private process's first start runs to 5 and records H1;
 * 2. the core restarted with `level` 2 (H2) at 8; `changed` — a start without `updateHash` stops, before any height,
 *    with `public-config-changed`, its message naming H2 and `--update-hash=H2`; H1 stays recorded;
 * 3. `other` — `updateHash` set to H1, the hash it had accepted (another value than the one found): it stops alike;
 * 4. `checked` — `updateHash` H2 with a private module `needy` added from 50 that requires an item no public module
 *    provides: the full checks run (the graph refuses with `item-no-provider`), and nothing is recorded;
 * 5. `accepted` — `updateHash` H2: it runs to 8 and records H2;
 * 6. the core taken to 10; `again` — a start without `updateHash` runs to 10, H2 being the one recorded;
 * 7. `twin` — a private process on a new private database runs to 10: its contents hash (with the process's tables
 *    declared `deterministic: false`) is the accepting one's, so where the hash is kept leaves the digests and the
 *    contents alone; [DT-3, Q75]
 * 8. with a transport, `race` — the relay holds the start's `hello` (PostgreSQL: after its read of the public history)
 *    or its first `read` (PGlite: after its first `hello-ack`), the core is restarted meanwhile with `level` 3 (H3)
 *    at 10, then the relay lets it through: the start stops with `public-config-changed` naming H3, and H2 stays.
 * A negative control's run ({@link A165Options.short}) ends after `other`.
 */

/** `pub`'s entries with `level` `level` from 30 (`level` 0 from 1). */
const pubEntries = (level: number) => [
  { id: "pub", start: 1, version: "1.0.0", config: { level: 0 } },
  { id: "pub", start: 30, version: "1.0.0", config: { level } },
];

/** A private module requiring the public `table` item `pub-rows`, which no public module provides. [PP-13] */
const NEEDY: ModuleDeclaration = {
  id: "needy",
  version: "1.0.0",
  side: "private",
  requires: ["pub-rows"],
  provides: [],
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: [],
  points: {},
};

/** The private process's tables declared `deterministic: false`: the accepted hash's. [design §8, §10] */
export const ACCEPTED_OPTED_OUT = Object.freeze([Object.freeze({ schema: "core_private_source", table: "accepted_config" })]);

/** What one start of the private process did. */
export interface Attempt {
  /** Whether its startup completed. */
  readonly started: boolean;
  /** Its state, and its reason's code, when it ended or was stopped. */
  readonly state: string;
  readonly code: string | null;
  /**
   * The refusal's message, or the error of the step run during its startup (the race's restart), prefixed as such;
   * "" when it started.
   */
  readonly message: string;
  /** The hash its private database holds as accepted after it stopped; null when none. */
  readonly stored: string | null;
  /** The private cursor's height after it stopped. */
  readonly cursor: bigint | null;
}

/** What one run saw. */
export interface A165Run {
  readonly transport: boolean;
  /** The core's configuration hashes: H1, H2, H3 (null when not reached). */
  readonly hashes: { readonly h1: string | null; readonly h2: string | null; readonly h3: string | null };
  readonly first: Attempt;
  readonly changed: Attempt;
  readonly other: Attempt;
  readonly checked?: Attempt;
  readonly accepted?: Attempt;
  readonly again?: Attempt;
  /** The contents hashes of the accepting private database and of a new one, both at 10. */
  readonly twin?: { readonly own: string; readonly fresh: string; readonly freshCursor: bigint | null };
  readonly race?: Attempt;
}

/** Options of {@link a165Run}. */
export interface A165Options {
  /** Whether the private process has `coreTransport`; without, PostgreSQL only. */
  readonly transport: boolean;
  /** A negative control's start decision (`PrivateIntakeOptions.acceptance`). */
  readonly acceptance?: PrivateIntakeOptions["acceptance"];
  /** A negative control's shorter run: up to `other`. */
  readonly short?: boolean;
}

/** `0x` hex of a byte string. */
const hexOf = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** The accepted hash `db` holds (`core_private_source.accepted_config`), or null when it holds none. */
export async function storedHash(db: TestDatabase): Promise<string | null> {
  return db.read(async (read) => {
    const [table] = await read.query("SELECT to_regclass('core_private_source.accepted_config') IS NOT NULL AS present");
    if (table?.present !== true) return null;
    const [row] = await read.query("SELECT config_hash FROM core_private_source.accepted_config WHERE id = 1");
    return row === undefined ? null : hexOf(row.config_hash as Uint8Array);
  }, privateCursorHeight);
}

/** The private cursor's height `db` holds. */
const cursorOf = (db: TestDatabase): Promise<bigint | null> => db.read((read) => privateCursorHeight(read), privateCursorHeight);

/** The contents hash of the private database `db` at its cursor, its opted-out tables by name only. [DT-3] */
const contentsOf = async (db: TestDatabase): Promise<string> =>
  hexOf(await db.read((read) => contentsHash(read, { optedOut: ACCEPTED_OPTED_OUT }), privateCursorHeight));

/** Waits until `check` holds, or fails after `ms` naming `what`. */
async function until(check: () => boolean, what: string, ms = 300_000): Promise<void> {
  const deadline = Date.now() + ms;
  while (!check()) {
    if (Date.now() > deadline) throw new Error(`timed out: ${what}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

/** The `X-Umbra-Config-Hash` of a started core's module API. [RN-16] */
async function headerHash(api: { readonly host: string; readonly port: number } | null): Promise<string | null> {
  if (api === null) throw new Error("the core has no module API listener");
  const response = await fetch(`http://${api.host}:${api.port}/level`);
  await response.arrayBuffer();
  return response.headers.get("x-umbra-config-hash");
}

/** Runs the accepted-hash scenario (see the module comment) on `backend`. [A165] */
export async function a165Run(backend: PrivateBackend, options: A165Options): Promise<A165Run> {
  const postgres = backend.kind === "postgres";
  if (!options.transport && !postgres) throw new Error("a private process without a transport reads a PostgreSQL public database");
  const publicDb = await backend.database("public");
  const privateDb = await backend.database("private");
  const relay = options.transport ? await HoldingRelay.start() : null;
  const launch = (head: bigint, level: number): PublicCore =>
    launchPublicCore({
      database: publicDb.setting,
      head,
      modules: [pub()],
      entries: pubEntries(level),
      extra: { listen: { api: "127.0.0.1:0", ...(options.transport ? { transport: "127.0.0.1:0" } : {}) } },
    });
  let core = launch(5n, 1);
  /** Starts the core (already launched) behind the relay, takes it to `head`, and resolves with its hash. */
  const started = async (head: bigint): Promise<string | null> => {
    if (relay !== null) relay.retarget(await core.transportWithin(300_000));
    const handle = await core.handle.started;
    await core.advance(head);
    return headerHash(handle.api);
  };
  /** Stops the core and starts it again with `level` at `head`; resolves with its hash. */
  const restart = async (head: bigint, level: number): Promise<string | null> => {
    await core.stop();
    relay?.retarget(null);
    core = launch(head, level);
    return started(head);
  };
  /** The private process's options on `database`, with `rest`. */
  const privateOptions = (database: TestDatabase, rest: Partial<PrivateOptions> = {}): PrivateOptions => ({
    database: database.setting,
    instanceId: "acceptor",
    ...(relay === null ? {} : { coreTransport: relay.address }),
    ...(postgres ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : {}),
    extra: { backoffCeilingMs: 1_000 },
    ...(options.acceptance === undefined ? {} : { intake: { acceptance: options.acceptance } }),
    ...rest,
  });
  /**
   * One start on `database`: `beforeStarted` runs while its startup runs (the race's restart); once started it is taken
   * to `reach` (none: stopped at once), then stopped either way, and its database read. When `beforeStarted` throws,
   * the start is not awaited and the attempt's message is that error, so a failure tells a restart that did not
   * finish from a start that ended first.
   */
  const attempt = async (
    database: TestDatabase,
    rest: Partial<PrivateOptions>,
    reach: bigint | null,
    beforeStarted?: () => Promise<void>,
  ): Promise<Attempt> => {
    const running = launchPrivate(privateOptions(database, rest));
    let startedOk = false;
    let stepDone = beforeStarted === undefined;
    let message = "";
    try {
      await beforeStarted?.();
      stepDone = true;
      await running.handle.started;
      startedOk = true;
      if (reach !== null) await running.reach(reach).catch(() => undefined);
    } catch (error) {
      const text = error instanceof Error ? error.message : String(error);
      message = stepDone ? text : `the step run during its startup failed: ${text}`;
    }
    const status = running.handle.status();
    await running.stop();
    return {
      started: startedOk,
      state: status.state,
      code: status.reason?.code ?? null,
      message,
      stored: await storedHash(database),
      cursor: await cursorOf(database),
    };
  };
  const pm = privateModule("pm", []);
  try {
    const h1 = await started(5n);
    const first = await attempt(privateDb, {}, 5n);
    const h2 = await restart(8n, 2);
    const changed = await attempt(privateDb, {}, null);
    const other = await attempt(privateDb, h1 === null ? {} : { updateHash: h1 }, null);
    if (options.short === true) return { transport: options.transport, hashes: { h1, h2, h3: null }, first, changed, other };
    const checked = await attempt(
      privateDb,
      {
        ...(h2 === null ? {} : { updateHash: h2 }),
        modules: [pm, NEEDY],
        entries: [
          { id: "pm", start: 1, version: "1.0.0", config: { salt: 0 } },
          { id: "needy", start: 50, version: "1.0.0", config: {} },
        ],
      },
      null,
    );
    const accepted = await attempt(privateDb, h2 === null ? {} : { updateHash: h2 }, 8n);
    await core.advance(10n);
    const again = await attempt(privateDb, {}, 10n);
    const freshDb = await backend.database("private");
    const fresh = await attempt(freshDb, { instanceId: "twin" }, 10n);
    const twin = { own: await contentsOf(privateDb), fresh: await contentsOf(freshDb), freshCursor: fresh.cursor };
    let race: Attempt | undefined;
    let h3: string | null = null;
    if (relay !== null) {
      // PostgreSQL: the public history is read directly, then the hello waits; PGlite: the history is read through the
      // core, after the first hello-ack, so its first read waits.
      relay.hold([postgres ? "hello" : "read"]);
      race = await attempt(privateDb, {}, null, async () => {
        await until(() => relay.held > 0, "the relay to hold the private start's first message");
        await core.stop();
        relay.retarget(null);
        core = launch(10n, 3);
        relay.retarget(await core.transportWithin(300_000));
        relay.release();
        const handle = await core.handle.started;
        await core.advance(10n);
        h3 = await headerHash(handle.api);
      });
    }
    return { transport: options.transport, hashes: { h1, h2, h3 }, first, changed, other, checked, accepted, again, twin, race };
  } finally {
    await core.stop();
    await relay?.close();
  }
}

/**
 * The problems of a start that must stop with `public-config-changed` naming `found`, `stored` still recorded. A start
 * that ended otherwise carries its message, so the refusal's own words, or the error of a step run during its startup,
 * show with the problem.
 */
function stopProblems(what: string, attempt: Attempt, found: string | null, stored: string | null, cursor: bigint): string[] {
  const problems: string[] = [];
  if (attempt.started) problems.push(`${what}: the private process started (${attempt.state}, ${attempt.code}), it did not stop`);
  else if (attempt.code !== "public-config-changed") {
    problems.push(`${what}: refused with ${attempt.code}, not public-config-changed${attempt.message === "" ? "" : `: ${attempt.message}`}`);
  }
  if (found !== null && !attempt.message.includes(`--update-hash=${found}`)) {
    problems.push(`${what}: its message does not name the new hash ${found} with --update-hash: ${attempt.message}`);
  }
  if (attempt.stored !== stored) problems.push(`${what}: the private database holds ${attempt.stored}, not ${stored}`);
  if (attempt.cursor !== cursor) problems.push(`${what}: the private cursor is ${attempt.cursor}, not ${cursor}`);
  return problems;
}

/** The problems of a start that must run to `cursor` with `stored` recorded. */
function runProblems(what: string, attempt: Attempt | undefined, stored: string | null, cursor: bigint): string[] {
  if (attempt === undefined) return [`${what}: not run`];
  const problems: string[] = [];
  if (!attempt.started) problems.push(`${what}: refused (${attempt.code}): ${attempt.message}`);
  if (attempt.stored !== stored) problems.push(`${what}: the private database holds ${attempt.stored}, not ${stored}`);
  if (attempt.cursor !== cursor) problems.push(`${what}: the private cursor is ${attempt.cursor}, not ${cursor}`);
  return problems;
}

/** A configuration hash's form: `0x` and 64 lowercase hex digits. */
const HASH = /^0x[0-9a-f]{64}$/;

/** The accepted-hash oracle: every problem with `run`, none when the scenario holds (see the module comment). [A165] */
export function a165Problems(run: A165Run): string[] {
  const { h1, h2, h3 } = run.hashes;
  const problems: string[] = [];
  for (const [name, hash] of [["H1", h1], ["H2", h2]] as const) {
    if (hash === null || !HASH.test(hash)) problems.push(`the core's ${name} is ${hash}`);
  }
  if (h1 === h2) problems.push("the core's configuration hash did not change with a data field");
  problems.push(...runProblems("the first start", run.first, h1, 5n));
  problems.push(...stopProblems("a start after the core's configuration changed", run.changed, h2, h1, 5n));
  problems.push(...stopProblems("a start with --update-hash set to another hash", run.other, h2, h1, 5n));
  if (run.checked === undefined) return problems;
  const checked = run.checked;
  if (checked.started || checked.code !== "item-no-provider") {
    problems.push(`a start with --update-hash and a module requiring an item no public module provides: ${checked.started ? "started" : checked.code}`);
  }
  if (checked.stored !== h1) problems.push(`a start refused by its full checks recorded ${checked.stored}, not ${h1} kept`);
  problems.push(...runProblems("a start with --update-hash set to the new hash", run.accepted, h2, 8n));
  problems.push(...runProblems("a start after the new hash was accepted", run.again, h2, 10n));
  if (run.twin === undefined) problems.push("no new private database was run");
  else {
    if (run.twin.freshCursor !== 10n) problems.push(`the new private database reached ${run.twin.freshCursor}, not 10`);
    if (run.twin.own !== run.twin.fresh) {
      problems.push(`the accepting private database hashes ${run.twin.own}, a new one ${run.twin.fresh}: the accepted hash reached the contents`);
    }
  }
  if (!run.transport) return problems;
  // An H3 never read means the race's restart did not reach its last line; the race's message says why.
  if (h3 === null || h3 === h2) {
    const why = h3 === null && run.race !== undefined && run.race.message !== "" ? ` (the race's start: ${run.race.message})` : "";
    problems.push(`the core's H3 is ${h3}${why}`);
  }
  if (run.race === undefined) problems.push("no start raced the core's restart");
  else problems.push(...stopProblems("a start whose core changed its configuration during it", run.race, h3, h2, 10n));
  return problems;
}
