/**
 * The backbone part `core-digest`. It keeps one digest per module table, chained at every height that changes the
 * table, and a checkpoint of every table's digest at each height h with h mod 14,400 = 0. Two instances fed the same
 * chain can then compare table by table: which table differs, and in which 14,400-height window it began to.
 * [DT-4, DT-5, Q84, Q86; CORE-ARCH §4.11, §4.13; design §4 "Change capture for digests", §6]
 *
 * **The tables** and every statement are in `./sql.ts`.
 *
 * A module that requires `digest-tables` or `digest-checkpoints` reads them in its `on-db-write`, which runs before
 * `core-digest`'s, so it sees the digests of h − 1.
 *
 * **Its `on-db-write`** runs last in the block. The runner calls it through `writes.write("core-digest", …)`, which
 * runs it as the login. It reads which tables are captured once per process, and asks in one statement which of them
 * hold shadow rows. For each such table, in the fixed table order: [RN-3, DT-3]
 * - it takes the keys the block touched, with their rows before and after ({@link takeChanges}, which also empties the
 *   shadow table);
 * - it computes the table's changes and new digest (`src/determinism/digest.ts`);
 * - it sets the table's row of `core_digest.tables` when the table changed.
 *
 * Then, at a checkpoint height, it copies every row of `core_digest.tables` into `core_digest.checkpoints`. All of this
 * runs inside the block transaction, so the digests commit with the block.
 *
 * It has no `on-start-db`. What startup must do for the digests must follow every module's migrations, which come after
 * `core-digest`'s, so the database API does it (`src/db/migrate.ts`: change capture after each part, and the shadow
 * tables emptied when startup ends). [Q95]
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import { type CapturedTable, capturedTables, tablesWithChanges, takeChanges } from "../../db/change-capture.js";
import { isCheckpointHeight, nextDigest, tableChanges } from "../../determinism/digest.js";
import { defineModule } from "../../modules/declaration.js";
import { CHECKPOINT_INTERVAL } from "./build-flags.js";
import { CORE_DIGEST_MIGRATIONS, checkpointDigests, readDigests, setDigest } from "./sql.js";

/**
 * The captured tables, read once per process. Startup attaches the capture triggers (`captureTables`, after the
 * migrations) and nothing changes them while the loop runs, so the catalog is not read again in every block. Each
 * startup makes a new process context, so a new build reads them again.
 */
const capturedByProcess = new WeakMap<object, readonly CapturedTable[]>();

/** The captured tables ({@link capturedByProcess}): read through `w` once for `process`, or every time without one. */
async function capturedOf(w: BlockWriteHandle, process: object | undefined): Promise<readonly CapturedTable[]> {
  const known = process === undefined ? undefined : capturedByProcess.get(process);
  if (known !== undefined) return known;
  const tables = Object.freeze(await capturedTables(w));
  if (process !== undefined) capturedByProcess.set(process, tables);
  return tables;
}

/**
 * `core-digest`'s work for the block at `height` (see the module comment), on the block's write handle, after every
 * other part's `on-db-write`. [DT-4, DT-5]
 */
export async function digestBlock(w: BlockWriteHandle, height: bigint, process?: object): Promise<void> {
  const tables = await capturedOf(w, process);
  const previous = new Map<string, Uint8Array>();
  for (const row of await readDigests(w)) {
    previous.set(JSON.stringify([row.schema, row.table]), row.digest);
  }
  // A table whose shadow table holds no row has no change to take, so its digest stays. [DT-4]
  for (const table of await tablesWithChanges(w, tables)) {
    const touched = await takeChanges(w, table);
    const changes = tableChanges(
      table.columns.map((column) => column.type),
      touched,
    );
    if (changes.count === 0) continue;
    const digest = nextDigest(previous.get(JSON.stringify([table.schema, table.name])) ?? null, height, changes.bytes);
    await setDigest(w, { schema: table.schema, table: table.name, height, digest });
  }
  if (isCheckpointHeight(height, CHECKPOINT_INTERVAL)) await checkpointDigests(w, height);
}

/**
 * `core-digest`, the backbone part. It requires `blocks` (from `core-block-commit`) and provides `digest-tables` and
 * `digest-checkpoints`, its two tables. Its version is the build's (`UMBRADB_VERSION`), like every backbone part's and
 * core module's. [CORE-ARCH §4.11]
 */
export const CORE_DIGEST = defineModule({
  id: "core-digest",
  version: UMBRADB_VERSION,
  side: "public",
  requires: ["blocks"],
  provides: [
    {
      name: "digest-tables",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["tables"], kind: "mutable" },
    },
    {
      name: "digest-checkpoints",
      lifetimes: ["table"],
      table: { schema: "core_digest", tables: ["checkpoints"], kind: "append-only" },
    },
  ],
  // Every backbone part starts at S, which is a mid-chain start when S is above genesis. [Q96]
  startsMidChain: true,
  configSchema: z.object({}),
  migrations: CORE_DIGEST_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
  points: {
    async "on-db-write"(p, b, w) {
      await digestBlock(w, b.height, p);
    },
  },
});
