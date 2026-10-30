/**
 * `core-chain`'s configuration history in `core_chain.config`. This file holds:
 * - the `table` items a revision provides ({@link tableItemsOf});
 * - the configuration hash of a database ({@link readConfigHash});
 * - recording a startup's configuration in the table ({@link recordHistory}).
 *
 * What is compared and recorded is decided by `checkHistory` (`src/config/history.ts`). The backbone part `core-chain`
 * itself (`./core-chain.ts`) lists `CONFIG_MIGRATION` first among its migrations and calls {@link recordHistory} in its
 * `on-start-db`. [CF-5, CF-6, CF-7, CF-8; CORE-ARCH §4.12; design §7]
 *
 * **The tables** and every statement are in `./sql.ts`.
 *
 * **Order at startup**: [CF-6, CF-8]
 * 1. The runner reads the rows (`readHistory`, in `./sql.ts`; there are none before the table exists) and checks the
 *    configuration against them before any migration runs.
 * 2. `startDatabase` then runs `core-chain` first: its migration `001` on a new database, then its `on-start-db`.
 * 3. That `on-start-db` compares again with the rows its own transaction reads. In that same transaction it deletes the
 *    omitted rows above the cursor and records the check's writes ({@link recordHistory}), each with its `provides`.
 *    [CF-5, Q103 B]
 * 4. It then gives every other revision above the cursor this build's `provides` where its row's differ (for example,
 *    a scheduled revision recorded by an earlier build). A revision at or below the cursor keeps its row as recorded,
 *    `provides` included. [CF-6]
 */

import {
  canonicalJson,
  checkHistory,
  configHashOf,
  type HistoryCheck,
  type HistoryInput,
  type HistoryOptions,
} from "../../config/history.js";
import { CORE_ENTRY_ID } from "../../config/entries.js";
import type { ReadHandle, Transaction } from "../../db/api.js";
import type { ModuleDeclaration } from "../../modules/declaration.js";
import { utf8Order } from "../../modules/graph.js";
import type { DeclarationSet } from "../../modules/validation.js";
import { deleteConfigRow, readConfigRows, readHistory, updateProvides, writeConfigRow } from "./sql.js";

/**
 * What `core_chain.config.provides` records for a revision of `id` in a build of `declarations`: the names of the
 * `table` items (items whose lifetimes include `table`), each once, sorted by their UTF-8 bytes. [PP-13]
 * - For `core`, they are the items of the build's backbone parts, which run with the core entry.
 * - Otherwise, they are the items of the build's declaration of the module `id`. For a scheduled revision, whose
 *   version the build does not carry, that is the declaration the build has, as the graph judges that revision.
 *
 * Throws for a module the build does not have (the configuration refuses its entry first). [CF-3]
 */
export function tableItemsOf(declarations: DeclarationSet<ModuleDeclaration>, id: string): string[] {
  const parts =
    id === CORE_ENTRY_ID
      ? declarations.backbone
      : [...declarations.core, ...declarations.user].filter((declaration) => declaration.id === id);
  if (parts.length === 0 && id !== CORE_ENTRY_ID) {
    throw new Error(`tableItemsOf: the build has no module ${id}; the configuration refuses an entry for it`);
  }
  const names = parts.flatMap((part) =>
    part.provides.filter((item) => item.lifetimes.includes("table")).map((item) => item.name),
  );
  return [...new Set(names)].sort(utf8Order);
}

/**
 * The configuration hash of the database that `read` reads: `configHashOf` of its `core_chain.config` rows (none before
 * the table exists). A process reads its own once, at startup, after `core-chain`'s `on-start-db` has recorded its
 * configuration, and keeps it in memory for the run (`src/runner/process.ts`). [RN-16, PP-14, Q147]
 */
export async function readConfigHash(read: Pick<ReadHandle, "query">): Promise<string> {
  return configHashOf((await readConfigRows(read)) ?? []);
}

/**
 * `core-chain`'s work in its `on-start-db`. In `tx` (its schema write handle, or any transaction) it: [CF-6]
 * - reads the rows and checks the configuration against them (`checkHistory`, which refuses as it does, so the
 *   transaction rolls back with nothing recorded);
 * - deletes the rows the check deletes: the omitted rows above the cursor [CF-5, Q103 B];
 * - records the check's writes, each inserted or replacing the row of its `(id, start)`.
 *
 * A failure anywhere rolls back both the deletes and the writes. Resolves with the check. `options` are passed to
 * `checkHistory` (the negative controls use them).
 */
export async function recordHistory(
  tx: Pick<Transaction, "query" | "execute">,
  input: Omit<HistoryInput, "history">,
  options: HistoryOptions = {},
): Promise<HistoryCheck> {
  const check = checkHistory({ ...input, history: await readHistory(tx) }, options);
  for (const row of check.deletes) await deleteConfigRow(tx, row.id, row.start);
  const written = new Set<string>();
  for (const row of check.writes) {
    const data = row.data === null ? null : canonicalJson(row.data);
    const provides = tableItemsOf(input.declarations, row.id);
    await writeConfigRow(tx, { ...row, data, provides });
    written.add(`${row.id}\u0000${row.start}`);
  }
  // The other revisions above the cursor take this build's items too; those at or below it keep theirs. [CF-6]
  for (const entry of check.entries) {
    const start = BigInt(entry.start);
    if (entry.started || written.has(`${entry.id}\u0000${start}`)) continue;
    await updateProvides(tx, entry.id, start, tableItemsOf(input.declarations, entry.id));
  }
  return check;
}
