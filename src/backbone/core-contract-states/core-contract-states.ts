/**
 * The core module `core-contract-states` (`openspec/changes/core-arch/specs/contract-data/spec.md` CC-1,
 * `specs/ledger/spec.md` LG-13; `design.md` §5.4, §10; CORE-ARCH §4.11; decision record Q23, Q37, Q143; task 13.1): for
 * every contract a block touched, one row of `core_contract_states.states` keyed by `(contract_address, height)` with the
 * key of the contract's state after the block and the key of its zswap state (its filtered view of the shielded
 * commitment tree), both persisted and never released (LG-13), so each loads from the stored nodes long after the
 * ledger states holding it were released and swept. Off by default; it cannot start mid-chain, as the ledger state it
 * reads cannot (LG-16).
 *
 * **Which contracts, and their keys** come from `core-ledger-state` (Q143, option A as task 12.4 shipped it): while
 * this module is active at h, `core-ledger-state`'s `on-compute` has the ledger worker persist, in the block's own
 * batch, the keys of every contract the block touched — those its transactions call or deploy, those its chain events
 * name maintained, and at the v8 → v9 upgrade's F every contract the converted state holds (task 13.1) — each once, in
 * byte order, computed on the state after the block, so all actions on one contract in one block share one row with
 * the state after all of them (CC-1); the `ledger-state` item carries them (`contracts`). A contract the state does not
 * hold — a deploy that did not apply — has no keys and no row.
 *
 * **At `on-compute`** it puts the `block` item `contract-states` (the rows, frozen); **at `on-db-write`** it writes them
 * in one statement. The table is append-only and range-partitioned by height.
 *
 * The declaration ({@link CORE_CONTRACT_STATES}) is a constant over its rule; a negative control's build composes its
 * own with {@link coreContractStates}.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { ContractKeys } from "../../ledger/worker/engine.js";
import { type BlockContext, type DefinedModule, defineModule, type ModuleDeclaration } from "../../modules/declaration.js";
import { CORE_CONTRACT_STATES_ID, LEDGER_STATE_ITEM } from "../core-ledger-state/core-ledger-state.js";
import { heightPartitionsSql } from "../height-partitions.js";

export { CORE_CONTRACT_STATES_ID };

/** The `block` (and `table`) item it provides. */
export const CONTRACT_STATES_ITEM = "contract-states";

/** Its table: one row per contract and block. */
export const STATES_TABLE = "core_contract_states.states";

/** `core-contract-states`' migrations (DB-9): applied once, recorded under `core-contract-states`; never changed. */
export const CONTRACT_STATES_MIGRATIONS: readonly { readonly id: string; readonly sql: string }[] = Object.freeze([
  {
    id: "001",
    sql: `CREATE TABLE ${STATES_TABLE} (
  contract_address bytea NOT NULL CHECK (octet_length(contract_address) = 32),
  height bigint NOT NULL CHECK (height >= 0),
  state_key bytea NOT NULL CHECK (octet_length(state_key) = 32),
  zswap_state_key bytea NOT NULL CHECK (octet_length(zswap_state_key) = 32),
  PRIMARY KEY (contract_address, height)
) PARTITION BY RANGE (height);
${heightPartitionsSql(STATES_TABLE)}`,
  },
]);

/** A row of `core_contract_states.states` (CC-1): a contract's keys after the block. */
export interface ContractStateRow {
  readonly address: Uint8Array;
  readonly stateKey: Uint8Array;
  readonly zswapStateKey: Uint8Array;
}

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** Block `b`'s rows: the keys the `ledger-state` item carries, a contract the state does not hold left out. */
export function contractStatesOf(b: BlockContext): ContractStateRow[] {
  const item = b.items.get(LEDGER_STATE_ITEM) as { readonly contracts?: readonly ContractKeys[] } | undefined;
  if (!Array.isArray(item?.contracts)) {
    throw new TypeError(
      `the block at height ${b.height} has no ledger-state item ${CORE_CONTRACT_STATES_ID} can read: core-ledger-state ` +
        "puts it at on-compute (LG-16)",
    );
  }
  return (item.contracts as readonly ContractKeys[]).flatMap(({ address, stateKey, zswapStateKey }) => {
    if (stateKey === null && zswapStateKey === null) return [];
    if (stateKey === null || zswapStateKey === null) {
      throw new Error(`block ${b.height}: contract ${hex(address)} has one of its keys and not the other (LG-13)`);
    }
    return [{ address, stateKey, zswapStateKey }];
  });
}

/** The `contract-states` item of `b`; throws a `TypeError` when it has none. */
export function contractStatesItemOf(b: BlockContext): readonly ContractStateRow[] {
  const rows = b.items.get(CONTRACT_STATES_ITEM);
  if (!Array.isArray(rows)) {
    throw new TypeError(`the block at height ${b.height} has no contract-states item: ${CORE_CONTRACT_STATES_ID} puts it at on-compute (CC-1)`);
  }
  return rows as readonly ContractStateRow[];
}

const INSERT_SQL = `INSERT INTO ${STATES_TABLE} (contract_address, height, state_key, zswap_state_key)
  SELECT r.contract_address, $1::bigint, r.state_key, r.zswap_state_key
  FROM unnest($2::bytea[], $3::bytea[], $4::bytea[]) AS r (contract_address, state_key, zswap_state_key)`;

/** Writes `rows`, block `height`'s, in one statement; none for no row. */
export async function writeStateRows(w: Pick<BlockWriteHandle, "execute">, height: bigint, rows: readonly ContractStateRow[]): Promise<void> {
  if (rows.length === 0) return;
  await w.execute(INSERT_SQL, [height, rows.map((row) => row.address), rows.map((row) => row.stateKey), rows.map((row) => row.zswapStateKey)]);
}

/** The rule a negative control may replace (see the module comment). */
export interface CoreContractStatesOptions {
  /** CC-1: the block's rows; {@link contractStatesOf}, one per contract the block touched. */
  readonly rowsOf?: (b: BlockContext) => readonly ContractStateRow[];
}

/**
 * `core-contract-states` with `options`' rule (see the module comment): a core module that requires `ledger-state`,
 * provides `contract-states` and cannot start mid-chain.
 */
export function coreContractStates(options: CoreContractStatesOptions = {}): DefinedModule<ModuleDeclaration> {
  return defineModule({
    id: CORE_CONTRACT_STATES_ID,
    version: UMBRADB_VERSION,
    side: "public",
    requires: [LEDGER_STATE_ITEM],
    provides: [
      {
        name: CONTRACT_STATES_ITEM,
        lifetimes: ["block", "table"],
        table: { schema: "core_contract_states", tables: ["states"], kind: "append-only" },
      },
    ],
    startsMidChain: false,
    configSchema: z.object({}),
    migrations: CONTRACT_STATES_MIGRATIONS.map(({ id, sql }) => ({ id, sql })),
    points: {
      async "on-compute"(_p, b, _read, out) {
        out.put(CONTRACT_STATES_ITEM, Object.freeze((options.rowsOf ?? contractStatesOf)(b).map((row) => Object.freeze({ ...row }))));
      },
      async "on-db-write"(_p, b, w) {
        await writeStateRows(w, b.height, contractStatesItemOf(b));
      },
    },
  });
}

/** `core-contract-states` (see the module comment). */
export const CORE_CONTRACT_STATES = coreContractStates();
