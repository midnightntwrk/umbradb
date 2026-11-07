/**
 * The SQL of `core-contract-states` (`./core-contract-states.ts`): its table, its migration, and the statement it
 * writes each block's rows with.
 *
 * **The table** `core_contract_states.states (contract_address, height) → state_key, zswap_state_key` has one row per
 * contract and block: the key of the contract's state after the block, and the key of its zswap state. All three are
 * 32 bytes (`CHECK`s). The table is append-only and range-partitioned by height (`../height-partitions.ts`).
 * [CC-1; design §10]
 */

import type { BlockWriteHandle } from "../../db/api.js";
import { heightPartitionsSql } from "../height-partitions.js";

/** Its table: one row per contract and block. */
export const STATES_TABLE = "core_contract_states.states";

/** `core-contract-states`' migrations: applied once, recorded under `core-contract-states`, never changed. [DB-9] */
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

/** A row of `core_contract_states.states`: a contract's keys after the block. [CC-1] */
export interface ContractStateRow {
  readonly address: Uint8Array;
  readonly stateKey: Uint8Array;
  readonly zswapStateKey: Uint8Array;
}

const INSERT_SQL = `INSERT INTO ${STATES_TABLE} (contract_address, height, state_key, zswap_state_key)
  SELECT r.contract_address, $1::bigint, r.state_key, r.zswap_state_key
  FROM unnest($2::bytea[], $3::bytea[], $4::bytea[]) AS r (contract_address, state_key, zswap_state_key)`;

/** Inserts `rows`, block `height`'s, in one statement. */
export async function insertStateRows(
  w: Pick<BlockWriteHandle, "execute">,
  height: bigint,
  rows: readonly ContractStateRow[],
): Promise<void> {
  await w.execute(INSERT_SQL, [
    height,
    rows.map((row) => row.address),
    rows.map((row) => row.stateKey),
    rows.map((row) => row.zswapStateKey),
  ]);
}
