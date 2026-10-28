import { mkdtempSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/index.js";
import { CORE_BLOCK_PARSED } from "../../src/backbone/core-block-parsed/core-block-parsed.js";
import { CORE_CHAIN_EVENTS } from "../../src/backbone/core-chain-events/core-chain-events.js";
import { CORE_LEDGER_STATE } from "../../src/backbone/core-ledger-state/core-ledger-state.js";
import { CORE_TX_RESULTS } from "../../src/backbone/core-tx-results/core-tx-results.js";
import type { Manifest } from "../../src/backup/manifest.js";
import { type RestoreInput, type RestoreSeams, restoreBackup } from "../../src/backup/restore.js";
import { plainData } from "../../src/config/plain-data.js";
import { validateConfig } from "../../src/config/validate.js";
import { openPglite } from "../../src/db/pglite.js";
import { openPostgres } from "../../src/db/postgres.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import { validateDeclarations } from "../../src/modules/validation.js";
import { NodeClient } from "../../src/node/client.js";
import type { BlockSource } from "../../src/runner/block-source.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { chainDeclarations } from "../backbone/chain-build.js";
import { genesisOf, ingest, type IngestOptions, committed, watched, watcher } from "../backbone/ingest-harness.js";
import { type LedgerScenario, ledgerScenario, recordedGenesis, withNodeRoot } from "../backbone/ledger-tapes.js";
import { systemTransaction, zswapOutputTransaction, RAW } from "../ledger/adapter-fixtures.js";
import type { ProcessDatabase } from "../runner/process-backends.js";
import { core, entryOf } from "../runner/process-build.js";
import { type BackupBackend, type BackupDatabase, connectionOf, pathOf } from "./backup-fixtures.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";

/**
 * A backup with `core-ledger-state` in its history, and its restore checked against a node (task 15.2; BK-3's
 * `backup-root-mismatch`; LG-15): the synthetic ledger tape of task 12.3's tests (`../backbone/ledger-tapes.ts`: real
 * ledger transactions on the undeployed devnet's genesis state, `midnight_ledgerStateRoot` at every block) synced from
 * genesis by the process of `../backbone/ingest-harness.ts` — UmbraDB's backbone over the node source on a tape node,
 * the ledger's core modules enabled from 0, the ledger in its worker thread —, backed up by the process at the head
 * (`ProcessHandle.backup`), and restored with `restoreBackup` itself: the configuration the process ran with (its
 * `core` entry with the target's database), the same build, and a node source on a tape node — the scenario's, or one
 * whose root at the backup's height is another (`withNodeRoot`, a node that disagrees with the backup).
 */

/** The ledger's core modules, as the ledger state's process tests enable them. */
export const LEDGER_CORE: readonly ModuleDeclaration[] = [CORE_CHAIN_EVENTS, CORE_BLOCK_PARSED, CORE_TX_RESULTS, CORE_LEDGER_STATE];

/** A synced, backed-up ledger database. */
export interface LedgerBackup {
  readonly scenario: LedgerScenario;
  readonly file: string;
  readonly manifest: Manifest;
}

/** The scenario: block 0 with the devnet's genesis state, then two blocks with transactions, then an empty one. */
export async function ledgerChain(): Promise<LedgerScenario> {
  const devnet = recordedGenesis("genesis_state_undeployed.mn");
  return ledgerScenario({
    ledger: "v9",
    genesis: devnet.state,
    includesBlockZero: true,
    blocks: [
      [
        { bytes: systemTransaction("v9"), kind: "system" },
        { bytes: zswapOutputTransaction(RAW.v9), kind: "regular" },
      ],
      [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }],
      [{ bytes: zswapOutputTransaction(RAW.v9), kind: "regular" }],
      [],
    ],
  });
}

/**
 * Syncs `scenario` from genesis on `db` and backs it up at its head through the process — or at `options.at`, with
 * `options`' records (a tape capped there), core modules and entries (task 13.1's handoff).
 */
export async function ledgerBackup(
  db: BackupDatabase,
  scenario: LedgerScenario,
  options: Pick<IngestOptions, "core" | "startOf" | "stopOf"> & { readonly at?: bigint; readonly records?: readonly TapeRecord[] } = {},
): Promise<LedgerBackup> {
  const { at, records, ...build } = options;
  const run = await ingest(db as unknown as ProcessDatabase, records ?? scenario.records, { start: 0n, core: LEDGER_CORE, ...build });
  const file = join(mkdtempSync(join(tmpdir(), "umbradb-ledger-backup-")), "ledger.backup");
  let manifest: Manifest;
  try {
    await committed(run, at ?? scenario.head);
    ({ manifest } = await run.handle.backup(file));
  } finally {
    await run.close();
  }
  return { scenario, file, manifest };
}

/**
 * A restore's build other than the ledger's core modules from 0 (task 13.1's handoff, CC-4): the build's core modules
 * and each one's entry (its start and stop).
 */
export interface RestoreBuild {
  readonly core: readonly ModuleDeclaration[];
  readonly entry: (module: ModuleDeclaration) => Record<string, unknown>;
}

/** The configuration and build the ingest's process ran with, its database `database` (secret, so not recorded). */
function restoreConfig(database: DatabaseParts, records: readonly TapeRecord[], build?: RestoreBuild) {
  const coreModules = build?.core ?? LEDGER_CORE;
  const declarations = validateDeclarations(chainDeclarations([watcher(watched())], { core: coreModules }));
  const genesisHash = genesisOf(records) as string;
  const extra = { node: "ws://127.0.0.1:9/node", genesisHash };
  const entries = [
    core(database, 0, { extra }),
    ...coreModules.map((module) => build?.entry(module) ?? entryOf(module, 0)),
    entryOf(watcher(watched()), 0),
  ];
  const config = validateConfig({
    config: { file: undefined, data: plainData({ entries }, undefined) },
    declarations,
    side: "public",
  });
  return { config, declarations };
}

/**
 * Restores `backup` into `target` on `backend`, the chain a tape node serving `records` — or `chain`, a block source of
 * the test's own —, with the ledger's core modules from 0 or `build`'s.
 */
export async function restoreLedger(
  backend: BackupBackend,
  target: BackupDatabase,
  backup: LedgerBackup,
  records: readonly TapeRecord[],
  seams: RestoreSeams = {},
  chain?: BlockSource,
  build?: RestoreBuild,
): Promise<Awaited<ReturnType<typeof restoreBackup>>> {
  const node = await TapeNode.start({ records });
  const client = new NodeClient({ url: node.url });
  const source = chain ?? nodeSourceOf({ settings: { prefetchWindow: 64, tipCap: 600 } }, { nodeClient: client });
  const { config, declarations } = restoreConfig(target.setting, backup.scenario.records, build);
  const dataDir = backend.kind === "pglite" ? pathOf(target.setting) : "";
  const input: RestoreInput = {
    file: backup.file,
    target: backend.kind === "postgres" ? { backend: "postgres" } : { backend: "pglite", exists: false },
    open: async () =>
      backend.kind === "postgres"
        ? openPostgres({ connection: connectionOf(target.setting), committedHeight: cursorHeight })
        : openPglite({ dataDir, committedHeight: cursorHeight, developmentOptIn: true }),
    config,
    declarations,
    source,
  };
  try {
    return await restoreBackup(input, seams);
  } finally {
    await source.close?.();
    await client.close();
    await node.close();
  }
}

/** The scenario's tape with the node's root at the head replaced by another (a node that disagrees with the backup). */
export function disagreeingNode(scenario: LedgerScenario): readonly TapeRecord[] {
  const root = scenario.heights[Number(scenario.head)]?.root as Uint8Array;
  const other = Uint8Array.from(root, (byte, index) => (index === root.length - 1 ? byte ^ 0xff : byte));
  return withNodeRoot(scenario, scenario.head, other).records;
}
