/**
 * The completeness check of a recorded range tape (task 0.3's acceptance, "every IN-8 call of every height is on the
 * tape"; owner decision Q123): what the recording driver (`./range.ts`) records, checked record by record, so a tape
 * that any client making any subset of those calls replays is known to be one.
 *
 * A tape of the range `from`–`to` is complete when:
 * - it is **one session** (no `disconnect`), with no `fault` record and no error answer — every client's one
 *   connection is served the first session (TT-3), and an error recorded where the node answers a value would be
 *   replayed as the answer —, and every call is one of IN-8's;
 * - for **every height h** it holds `chain_getBlockHash [h]` with a block hash H, and at H `chain_getHeader` (whose
 *   number is h and, above `from`, whose parent is the hash of h − 1), `chain_getBlock`, `state_getRuntimeVersion`
 *   (with a `specVersion`), `state_getStorage [System.Events, H]` and `midnight_ledgerStateRoot`;
 * - `state_getMetadata [H]` at the range's first block and at every height whose state's runtime is not its parent's;
 * - for **block 0**, when the range holds it, `system_properties []` and, for each registration prefix, every page of
 *   `state_getKeysPaged [prefix, keysPage, start, H0]` — from `null`, each next page after the last key of a full one
 *   — and `state_getStorage [key, H0]` for every key listed;
 * - **the live window:** `chain_getFinalizedHead []` and `chain_getHeader` of its answer, and both head subscriptions,
 *   each with at least one notification.
 *
 * Each problem is a sentence naming the line, or the height (block 0, the live window) and the call with its params,
 * in that order: lines, heights ascending, block 0, the live window.
 */

import { NODE_METHODS } from "../../src/node/methods.js";
import { type Json, jsonText } from "./json.js";
import { EVENTS_KEY, isKeysPage, KEYS_PAGE, REGISTRATION_PREFIXES } from "./range.js";
import type { Params, TapeRecord } from "./records.js";
import { requestKey } from "./session.js";

/** The range a tape was recorded for, and the page size of its `state_getKeysPaged` calls ({@link KEYS_PAGE}). */
export interface CompletenessRange {
  readonly from: number;
  readonly to: number;
  readonly keysPage?: number;
}

const BLOCK_HASH = /^0x[0-9a-f]{64}$/;
const SUBSCRIPTIONS = ["chain_subscribeNewHeads", "chain_subscribeFinalizedHeads"] as const;

const isHeight = (value: number): boolean => Number.isSafeInteger(value) && value >= 0;

function field(value: Json | undefined, name: string): Json | undefined {
  return typeof value === "object" && value !== null && !Array.isArray(value)
    ? (value as { readonly [key: string]: Json })[name]
    : undefined;
}

/** Every way `records` falls short of a complete tape of `range`; none for a complete one. */
export function completenessProblems(records: readonly TapeRecord[], range: CompletenessRange): string[] {
  const { from, to } = range;
  const page = range.keysPage ?? KEYS_PAGE;
  if (!isHeight(from)) throw new TypeError("from must be a height (a safe integer from 0)");
  if (!isHeight(to)) throw new TypeError("to must be a height (a safe integer from 0)");
  if (from > to) throw new TypeError(`from (${from}) is above to (${to})`);
  if (!isKeysPage(page)) throw new TypeError("keysPage must be an integer from 1 to 1000");

  const problems: string[] = [];
  const answers = new Map<string, Json>();
  const subscribed = new Map<string, string[]>();
  const notified = new Map<string, number>();
  records.forEach((record, index) => {
    const line = index + 1;
    if ("disconnect" in record) {
      problems.push(`line ${line}: a disconnect: a complete tape is one session, which every client's one connection replays`);
    } else if ("fault" in record) {
      problems.push(`line ${line}: a fault record (${record.method}), which no node answered`);
    } else if ("subscribe" in record) {
      subscribed.set(record.method, [...(subscribed.get(record.method) ?? []), jsonText(record.subscribe)]);
    } else if ("notify" in record) {
      const id = jsonText(record.notify);
      notified.set(id, (notified.get(id) ?? 0) + 1);
    } else if ("error" in record) {
      problems.push(`line ${line}: ${record.method} ${jsonText(record.params)} answered an error: ${jsonText(record.error)}`);
    } else {
      if (!(NODE_METHODS as readonly string[]).includes(record.method)) {
        problems.push(`line ${line}: ${record.method} is not one of IN-8's methods`);
      }
      const key = requestKey(record.method, record.params);
      if (!answers.has(key)) answers.set(key, record.result);
    }
  });
  const answer = (method: string, params: Params): Json | undefined => answers.get(requestKey(method, params as Json));
  const missing = (where: string, method: string, params: Params, why = ""): string | undefined =>
    answer(method, params) === undefined ? `${where}: no ${method} ${jsonText(params)}${why}` : undefined;
  const add = (problem: string | undefined): void => {
    if (problem !== undefined) problems.push(problem);
  };

  const hashes = new Map<number, string>();
  const specs = new Map<number, number>();
  for (let height = from; height <= to; height++) {
    const where = `height ${height}`;
    const hash = answer("chain_getBlockHash", [height]);
    if (hash === undefined) {
      problems.push(`${where}: no chain_getBlockHash [${height}]`);
      continue;
    }
    if (typeof hash !== "string" || !BLOCK_HASH.test(hash)) {
      problems.push(`${where}: chain_getBlockHash [${height}] answered ${jsonText(hash)}, not a block hash`);
      continue;
    }
    hashes.set(height, hash);
    const header = answer("chain_getHeader", [hash]);
    if (header === undefined) {
      add(missing(where, "chain_getHeader", [hash]));
    } else {
      const number = field(header, "number");
      const expected = `0x${height.toString(16)}`;
      if (number !== expected) problems.push(`${where}: chain_getHeader's number is ${String(number)}, not ${expected}`);
      if (height > from) {
        const before = hashes.get(height - 1);
        const parent = field(header, "parentHash");
        if (before === undefined) {
          problems.push(`${where}: no chain_getBlockHash [${height - 1}] to check its parent hash against`);
        } else if (parent !== before) {
          problems.push(`${where}: its parent hash ${String(parent)} is not the hash of height ${height - 1}, ${before}`);
        }
      }
    }
    add(missing(where, "chain_getBlock", [hash]));
    const version = answer("state_getRuntimeVersion", [hash]);
    if (version === undefined) {
      add(missing(where, "state_getRuntimeVersion", [hash]));
    } else {
      const specVersion = field(version, "specVersion");
      if (typeof specVersion === "number" && Number.isSafeInteger(specVersion)) specs.set(height, specVersion);
      else problems.push(`${where}: state_getRuntimeVersion's answer has no specVersion`);
    }
    add(missing(where, "state_getStorage", [EVENTS_KEY, hash]));
    add(missing(where, "midnight_ledgerStateRoot", [hash]));
    const spec = specs.get(height);
    const before = specs.get(height - 1);
    if (height === from) {
      add(missing(where, "state_getMetadata", [hash], " (the range's first block)"));
    } else if (spec !== undefined && before !== undefined && spec !== before) {
      add(missing(where, "state_getMetadata", [hash], ` (the state's runtime changes from ${before} to ${spec})`));
    }
  }

  const genesis = hashes.get(0);
  if (from === 0 && genesis !== undefined) {
    add(missing("block 0", "system_properties", []));
    for (const prefix of REGISTRATION_PREFIXES) {
      let start: string | null = null;
      for (;;) {
        const params: Params = [prefix, page, start, genesis];
        const keys = answer("state_getKeysPaged", params);
        if (keys === undefined) {
          add(missing("block 0", "state_getKeysPaged", params));
          break;
        }
        if (!Array.isArray(keys)) {
          problems.push(`block 0: state_getKeysPaged ${jsonText(params)} answered ${jsonText(keys)}, not a list of keys`);
          break;
        }
        for (const key of keys) add(missing("block 0", "state_getStorage", [key, genesis]));
        if (keys.length < page) break;
        start = keys.at(-1) as string;
      }
    }
  }

  const head = answer("chain_getFinalizedHead", []);
  if (head === undefined) problems.push("no chain_getFinalizedHead []");
  else if (answer("chain_getHeader", [head]) === undefined) {
    problems.push(`no chain_getHeader ${jsonText([head])} (the finalized head)`);
  }
  for (const method of SUBSCRIPTIONS) {
    const ids = subscribed.get(method);
    if (ids === undefined) problems.push(`no ${method} subscription`);
    else if (ids.every((id) => (notified.get(id) ?? 0) === 0)) problems.push(`no notification of ${method}`);
  }
  return problems;
}
