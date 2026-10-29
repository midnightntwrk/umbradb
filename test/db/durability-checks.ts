import postgres from "postgres";
import { connectionOfUrl } from "./connection.js";
import { expect } from "vitest";
import type { ErrorCode, UmbraError } from "../../src/db/errors.js";
import { startDatabase } from "../../src/db/migrate.js";
import { openPostgres, type PostgresOptions } from "../../src/db/postgres.js";
import { planSchemas } from "../../src/db/roles.js";
import { startWriter } from "../../src/db/writer-lock.js";
import { rejection, WRITER_LOCK_HOLDERS_SQL } from "./writer-lock-checks.js";

/**
 * The durability probe's checks, shared by `durability-probe.test.ts` and its committed negative control
 * (`durability-probe.negative-control.test.ts`), which must make the first one fail. [A18, DB-12]
 */

const noHeight = async (): Promise<bigint | null> => null;

/**
 * Opens the database at `url` and checks that the writer's start refuses with `code` (not retryable) before anything is
 * written: a transaction is refused the same way before its body runs, startup refuses before any migration (no
 * `core_chain` schema), and the refused writer holds no lock. Resolves with the refusal.
 */
export async function expectRefusedBeforeAnyWrite(
  url: string,
  code: ErrorCode,
  options: Partial<PostgresOptions> = {},
): Promise<UmbraError> {
  const db = openPostgres({ connection: connectionOfUrl(url), committedHeight: noHeight, ...options });
  const admin = postgres(url, { max: 1, onnotice: () => undefined });
  try {
    const refused = await rejection(() => startWriter(db));
    expect(refused.code).toBe(code);
    expect(refused.retryable).toBe(false);
    let bodyRan = false;
    const refusedWrite = await rejection(() =>
      db.transaction(async () => {
        bodyRan = true;
      }),
    );
    expect(refusedWrite.code).toBe(code);
    expect(bodyRan).toBe(false);
    const refusedStartup = await rejection(() =>
      startDatabase(db, { plan: planSchemas([]), parts: [], committedVersions: new Map(), handles: { height: null } }),
    );
    expect(refusedStartup.code).toBe(code);
    const [schema] = await admin.unsafe("SELECT to_regnamespace('core_chain') IS NULL AS absent");
    expect(schema?.absent).toBe(true);
    // A session the API ended leaves the server a moment later.
    await expect.poll(async () => (await admin.unsafe(WRITER_LOCK_HOLDERS_SQL)).length, { timeout: 5_000 }).toBe(0);
    return refused;
  } finally {
    await db.close();
    await admin.end({ timeout: 5 });
  }
}
