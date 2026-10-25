/**
 * The durability probe (DB-12; `openspec/changes/core-arch/design.md` §4 "Durability probe", §11), moved from 0.9.5's
 * `src/postgres/durability-probe.ts` unchanged in behaviour: on PostgreSQL, startup refuses `fsync=off`, a transaction
 * pooler, and `full_page_writes=off` unless the operator set `fullPageWritesOffAllowed` (CF-4); `synchronous_commit=off`
 * is a warning, not a refusal. What changed: each refusal is an {@link UmbraError} with its §11 code
 * (`durability-fsync-off`, `durability-full-page-writes-off`, `durability-pooler`) instead of 0.9.5's two error classes;
 * the override is CF-4's `fullPageWritesOffAllowed`; and the probe runs on the writer's session when the writer starts —
 * right after the writer lock (`./writer-lock.ts`, `./postgres.ts`), before the first write — instead of inside 0.9.5's
 * `runMigrations`. 0.9.5's file stays for 0.9.5's `runMigrations` until task 17.2 removes both.
 *
 * WHERE the backend is PGlite, which runs without fsync, the process starts only under the development opt-in
 * ({@link pgliteNeedsDevelopmentOptIn}, checked by `openPglite` before anything is opened or created).
 *
 * The decisions are pure functions ({@link classifyFsync}, {@link classifyFullPageWrites},
 * {@link classifySynchronousCommit}, {@link assertNoTransactionPooler}), tested exhaustively without a server; the
 * probe ({@link probeDurability}) reads the settings on one session and runs them. It interpolates nothing into SQL:
 * a setting's name is a parameter of `current_setting($1)`, and the pooler check's key is a parameter.
 */

import type { Row } from "../deterministic-postgresql/index.js";
import { type ErrorCode, UmbraError } from "./errors.js";

/** Statements on one session, each in autocommit (outside any transaction), in the order sent. */
export interface ProbeSession {
  query(sql: string, params?: unknown[]): Promise<Row[]>;
}

/** What the probe needs of the configuration (CF-4). */
export interface DurabilityProbeOptions {
  /**
   * Permit `full_page_writes=off` (CF-4's `fullPageWritesOffAllowed`, default false). Only when the storage guarantees
   * atomic 8 kB page writes, so that no page can be torn by a crash.
   */
  readonly fullPageWritesOffAllowed: boolean;
}

/** A durability trade an operator may accept on purpose: reported, never refused. */
export interface DurabilityWarning {
  readonly kind: "lost-tail";
  readonly setting: string;
  readonly value: string;
  readonly message: string;
}

/** A setting that refuses startup, with the code it refuses with. */
export interface DurabilityViolation {
  readonly code: Extract<ErrorCode, "durability-fsync-off" | "durability-full-page-writes-off">;
  readonly setting: string;
  readonly value: string;
  readonly message: string;
}

// ---- the decisions, pure ----------------------------------------------------------------------------------------

export function classifyFsync(value: string): DurabilityViolation | null {
  if (value !== "off") return null;
  return {
    code: "durability-fsync-off",
    setting: "fsync",
    value,
    message:
      "fsync=off lets PostgreSQL skip flushing WAL and data to disk, so an operating-system crash or a power loss can " +
      "leave the database arbitrarily corrupted, not merely missing its last commits; set fsync=on",
  };
}

export function classifyFullPageWrites(value: string, allowed: boolean): DurabilityViolation | null {
  if (value !== "off" || allowed) return null;
  return {
    code: "durability-full-page-writes-off",
    setting: "full_page_writes",
    value,
    message:
      "full_page_writes=off risks torn pages on crash recovery (a page half written across a crash cannot be rebuilt " +
      "from the WAL), which can corrupt committed data; set full_page_writes=on, or set fullPageWritesOffAllowed in " +
      "the core entry only if the storage guarantees atomic 8 kB page writes",
  };
}

export function classifySynchronousCommit(value: string): DurabilityWarning | null {
  // on, local, remote_write and remote_apply all flush the commit's WAL to local disk before acknowledging it on a
  // primary, so none of them gives up local crash durability.
  if (value !== "off") return null;
  return {
    kind: "lost-tail",
    setting: "synchronous_commit",
    value,
    message:
      "synchronous_commit=off acknowledges a commit before its WAL is flushed, so a crash can lose the last commits " +
      "(without corrupting anything); UmbraDB warns rather than refuses, and replays those blocks after a restart",
  };
}

/** The refusal for `violations` (at least one): the first one's code, every one named. */
export function durabilityRefusal(violations: readonly DurabilityViolation[]): UmbraError {
  const first = violations[0]!;
  return new UmbraError(
    first.code,
    `PostgreSQL's settings refuse startup: ${violations.map((v) => `${v.setting}=${v.value}: ${v.message}`).join("; ")}`,
    {
      setting: first.setting,
      value: first.value,
      violations: violations.map(({ code, setting, value }) => ({ code, setting, value })),
    },
  );
}

/**
 * A transaction pooler shows as a session advisory lock that was taken but that the session's next statement does not
 * see (another backend ran it). A lock that could not be taken is not a pooler's signature — another session holds the
 * key — so the check fails open there, as 0.9.5's did: a real pooler still shows as taken-but-unseen.
 */
export function assertNoTransactionPooler(acquired: boolean, visibleCount: number): void {
  if (!acquired || visibleCount >= 1) return;
  throw new UmbraError(
    "durability-pooler",
    "a session advisory lock this connection took was not visible to its next statement: the connection goes " +
      "through a transaction pooler (for example PgBouncer in transaction mode), which hands each statement to any " +
      "backend and so breaks the writer lock (a session advisory lock); connect UmbraDB to PostgreSQL directly, or " +
      "through a pool in session mode",
    { setting: "connection" },
  );
}

// ---- the probe ---------------------------------------------------------------------------------------------------

/**
 * The pooler check's lock class: the writer lock's (`./writer-lock.ts`), so the check tests the property that lock
 * depends on. The key is unique to the session (its backend pid), so two probes never contend for it.
 */
const POOLER_CHECK_LOCK_CLASS = 3;

/**
 * Takes a session advisory lock under a key unique to the session, counts whether the session's next statement sees it,
 * and releases it. The raw observations, for {@link assertNoTransactionPooler}.
 */
export async function probeAdvisoryLockVisibility(
  session: ProbeSession,
): Promise<{ readonly acquired: boolean; readonly visibleCount: number }> {
  const [own] = await session.query("SELECT pg_backend_pid() AS pid");
  const key = `umbradb:durability-probe:pooler:${String(own?.pid)}`;
  const [taken] = await session.query(
    `SELECT pg_try_advisory_lock(${POOLER_CHECK_LOCK_CLASS}, hashtext($1)) AS acquired`,
    [key],
  );
  if (taken?.acquired !== true) return { acquired: false, visibleCount: 0 };
  try {
    // objsubid 2 is the two-key form; hashtext's int4 key is stored as that oid.
    const [seen] = await session.query(
      "SELECT count(*)::integer AS visible FROM pg_locks WHERE locktype = 'advisory' " +
        `AND classid = ${POOLER_CHECK_LOCK_CLASS} AND objid = (hashtext($1))::oid AND objsubid = 2 ` +
        "AND pid = pg_backend_pid()",
      [key],
    );
    return { acquired: true, visibleCount: Number(seen?.visible ?? 0) };
  } finally {
    await session
      .query(`SELECT pg_advisory_unlock(${POOLER_CHECK_LOCK_CLASS}, hashtext($1))`, [key])
      .catch(() => undefined);
  }
}

/**
 * Reads `fsync`, `synchronous_commit` and `full_page_writes` on `session`, then checks for a transaction pooler. Rejects
 * with the refusal of every violation ({@link durabilityRefusal}: `durability-fsync-off` when `fsync` is off, else
 * `durability-full-page-writes-off`), or with `durability-pooler`; resolves with the warnings otherwise.
 */
export async function probeDurability(session: ProbeSession, options: DurabilityProbeOptions): Promise<DurabilityWarning[]> {
  const setting = async (name: string): Promise<string> =>
    String((await session.query("SELECT current_setting($1) AS v", [name]))[0]?.v);
  const fsync = await setting("fsync");
  const synchronousCommit = await setting("synchronous_commit");
  const fullPageWrites = await setting("full_page_writes");

  const violations = [classifyFsync(fsync), classifyFullPageWrites(fullPageWrites, options.fullPageWritesOffAllowed)];
  const refused = violations.filter((violation): violation is DurabilityViolation => violation !== null);
  if (refused.length > 0) throw durabilityRefusal(refused);

  const seen = await probeAdvisoryLockVisibility(session);
  assertNoTransactionPooler(seen.acquired, seen.visibleCount);

  const warning = classifySynchronousCommit(synchronousCommit);
  return warning === null ? [] : [warning];
}

/**
 * The refusal of PGlite without the development opt-in (DB-12, CF-9): PGlite runs without fsync, so it is a
 * development backend. Names PGlite and the opt-in, never the data directory (the `database` setting is secret, CF-4).
 */
export function pgliteNeedsDevelopmentOptIn(): UmbraError {
  return new UmbraError(
    "development-opt-in-required",
    "the PGlite backend runs only under the development opt-in: PGlite runs without fsync, so a crash of the machine " +
      "can lose or corrupt committed blocks; set developmentOptIn: true in the core entry for development, or use " +
      "PostgreSQL",
    { feature: "pglite" },
  );
}
