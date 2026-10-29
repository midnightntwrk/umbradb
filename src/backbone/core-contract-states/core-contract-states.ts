/**
 * The core module `core-contract-states`. For every contract a block touched it stores one row of
 * `core_contract_states.states`, keyed by `(contract_address, height)`, with two keys: the key of the contract's state
 * after the block, and the key of its zswap state (its filtered view of the shielded commitment tree). Both are
 * persisted and never released, so each loads from the stored nodes long after the ledger states that held it were
 * released and swept. [CC-1, LG-13, Q23, Q37; CORE-ARCH §4.11; design §5.4, §10]
 *
 * It is off by default, and it cannot start mid-chain, because the ledger state it reads cannot. [LG-16]
 *
 * **Which contracts, and their keys,** come from `core-ledger-state`. While this module is active at h,
 * `core-ledger-state`'s `on-compute` has the ledger worker persist, in the block's own batch, the keys of every contract
 * the block touched: [CC-1, Q143 A]
 * - those its transactions call or deploy;
 * - those its chain events name as maintained;
 * - at the v8 → v9 conversion block F, every contract the converted state holds.
 *
 * Each contract appears once, in byte order, with its keys taken from the state after the block. So all actions on one
 * contract in one block share one row, holding the state after all of them. The `ledger-state` item carries them
 * (`contracts`). A contract the state does not hold (a deploy that did not apply) has no keys and no row. [CC-1]
 *
 * **At `on-compute`** it puts the `block` item `contract-states` (the rows, frozen); **at `on-db-write`** it writes them
 * in one statement. **The table** and every statement are in `./sql.ts`.
 *
 * The declaration ({@link CORE_CONTRACT_STATES}) is a constant built over its rule. A negative control's build composes
 * its own with {@link coreContractStates}.
 */

import { z } from "zod";
import { UMBRADB_VERSION } from "../../config/build.js";
import type { BlockWriteHandle } from "../../db/api.js";
import type { ContractKeys } from "../../ledger/worker/engine.js";
import { type BlockContext, type DefinedModule, defineModule, type ModuleDeclaration } from "../../modules/declaration.js";
import { CORE_CONTRACT_STATES_ID, LEDGER_STATE_ITEM } from "../core-ledger-state/core-ledger-state.js";
import { CONTRACT_STATES_MIGRATIONS, type ContractStateRow, insertStateRows } from "./sql.js";

export { CORE_CONTRACT_STATES_ID };

/** The `block` (and `table`) item it provides. */
export const CONTRACT_STATES_ITEM = "contract-states";

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** Block `b`'s rows: the keys the `ledger-state` item carries, a contract the state does not hold left out. */
export function contractStatesOf(b: BlockContext): ContractStateRow[] {
  const item = b.items.get(LEDGER_STATE_ITEM) as { readonly contracts?: readonly ContractKeys[] } | undefined;
  if (!Array.isArray(item?.contracts)) {
    throw new TypeError(
      `the block at height ${b.height} has no ledger-state item ${CORE_CONTRACT_STATES_ID} can read: core-ledger-state ` +
        "puts it at on-compute",
    );
  }
  return (item.contracts as readonly ContractKeys[]).flatMap(({ address, stateKey, zswapStateKey }) => {
    if (stateKey === null && zswapStateKey === null) return [];
    if (stateKey === null || zswapStateKey === null) {
      throw new Error(`block ${b.height}: contract ${hex(address)} has one of its keys and not the other`);
    }
    return [{ address, stateKey, zswapStateKey }];
  });
}

/** The `contract-states` item of `b`; throws a `TypeError` when it has none. */
export function contractStatesItemOf(b: BlockContext): readonly ContractStateRow[] {
  const rows = b.items.get(CONTRACT_STATES_ITEM);
  if (!Array.isArray(rows)) {
    throw new TypeError(`the block at height ${b.height} has no contract-states item: ${CORE_CONTRACT_STATES_ID} puts it at on-compute`);
  }
  return rows as readonly ContractStateRow[];
}

/** Writes `rows`, block `height`'s, in one statement; none for no row. */
export async function writeStateRows(w: Pick<BlockWriteHandle, "execute">, height: bigint, rows: readonly ContractStateRow[]): Promise<void> {
  if (rows.length === 0) return;
  await insertStateRows(w, height, rows);
}

/** The rule a negative control may replace (see the module comment). */
export interface CoreContractStatesOptions {
  /** The block's rows: {@link contractStatesOf}, one per contract the block touched. [CC-1] */
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
