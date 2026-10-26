/**
 * The boundary reader (task 0.3; `openspec/changes/core-arch/specs/ledger/spec.md` LG-1 to LG-3; task 12.2's note (a)):
 * the data the built-in ledger version tables (`src/ledger/networks.json`) take from a network's node — its genesis and
 * every runtime upgrade from genesis to the finalized head — and the record of the node's answers they cite.
 *
 * **Genesis:** the hash of block 0 (`chain_getBlockHash [0]`) and its runtime: the `MNSV` digest of block 0's header,
 * which must name the `spec_version` `state_getRuntimeVersion` reports at block 0.
 *
 * **Upgrades:** `state_getRuntimeVersion` is read at every `step`-th block and at the finalized head; each change
 * between two samples is bisected to every block U whose state's runtime is not its parent's — the block that enacts
 * the upgrade (`set_code`) — and F = U + 1, the first block the new runtime built (LG-1's terms). U's header must carry
 * the old runtime's `MNSV`, F's the new one's: each boundary is `u { height, hash, specVersion }` and `f { … }` with
 * their `MNSV` versions, as `networks.json` lists them. Two upgrades between two samples are both found; an upgrade
 * undone before the next sample (A → B → A within `step` blocks) is not seen.
 *
 * **The record** (`calls`): the node's answers, as it sent them, to `chain_getBlockHash`, `chain_getHeader` and
 * `state_getRuntimeVersion` at block 0, and for each boundary to `chain_getBlockHash` at U − 1, U and F,
 * `chain_getHeader` at U and F and `state_getRuntimeVersion` at U − 1 and U — the form of
 * `test/node/fixtures/mainnet-answers.json`, which `test/ledger/networks.test.ts` reads (A94's last clause, A95).
 *
 * Read directly with the node client (no tape is recorded), with its retries, at most `concurrency` requests at once.
 */

import { mnsvSpecVersion } from "../../src/ledger/version-table.js";
import { type ConnectSocket, NodeClient } from "../../src/node/index.js";
import { bytesAnswer, headerAnswer } from "../../src/node/decode.js";
import { isWebSocketUrl } from "./builder.js";
import { type Json, jsonText } from "./json.js";
import { limiter } from "./range.js";

export interface BoundaryBlockReading {
  readonly height: number;
  readonly hash: string;
  /** The `spec_version` of the block's `MNSV` digest: the runtime that built it. */
  readonly specVersion: number;
}

export interface BoundaryReading {
  readonly genesis: { readonly hash: string; readonly specVersion: number };
  readonly head: { readonly height: number; readonly hash: string };
  readonly boundaries: readonly { readonly u: BoundaryBlockReading; readonly f: BoundaryBlockReading }[];
  /** The record: each call the tables cite and the node's answer, in reading order. */
  readonly calls: readonly { readonly method: string; readonly params: readonly Json[]; readonly result: unknown }[];
  /** Requests sent to the node. */
  readonly requests: number;
}

export interface BoundaryOptions {
  /** The node's WebSocket URL (`ws://` or `wss://`); never shown. */
  readonly node: string;
  /** Blocks between two samples of the runtime; 1,000 by default. */
  readonly step?: number;
  /** Requests in flight at most; 8 by default. */
  readonly concurrency?: number;
  readonly connect?: ConnectSocket;
  /** Receives a line per boundary found. */
  readonly log?: (line: string) => void;
}

export const DEFAULT_BOUNDARY_STEP = 1_000;

const isPositive = (value: number): boolean => Number.isSafeInteger(value) && value >= 1;

/** Reads `options.node`'s genesis and runtime upgrades (see the module comment). */
export async function readBoundaries(options: BoundaryOptions): Promise<BoundaryReading> {
  if (!isWebSocketUrl(options.node)) throw new TypeError("the node must be a ws:// or wss:// URL");
  const step = options.step ?? DEFAULT_BOUNDARY_STEP;
  const concurrency = options.concurrency ?? 8;
  if (!isPositive(step)) throw new TypeError("step must be a positive integer");
  if (!isPositive(concurrency)) throw new TypeError("concurrency must be a positive integer");
  const client = new NodeClient({ url: options.node, ...(options.connect === undefined ? {} : { connect: options.connect }) });
  const answers = new Map<string, Promise<unknown>>();
  let requests = 0;
  const gate = limiter(concurrency);
  /** The node's answer to `method(params)`, asked once, at most `concurrency` at a time. */
  const ask = (method: "chain_getBlockHash" | "chain_getHeader" | "state_getRuntimeVersion" | "chain_getFinalizedHead", params: Json[]) => {
    const key = jsonText([method, params]);
    let found = answers.get(key);
    if (found === undefined) {
      found = gate(() => {
        requests += 1;
        return client.call(method, params);
      });
      answers.set(key, found);
    }
    return found;
  };
  const hashAt = async (height: number): Promise<string> => (await ask("chain_getBlockHash", [height])) as string;
  const specAt = async (height: number): Promise<number> => {
    const version = (await ask("state_getRuntimeVersion", [await hashAt(height)])) as { specVersion: number };
    return version.specVersion;
  };
  const mnsvAt = async (height: number): Promise<number> => {
    const hash = await hashAt(height);
    const header = headerAnswer("chain_getHeader", "result", await ask("chain_getHeader", [hash]));
    return mnsvSpecVersion({ height: BigInt(height), hash: bytesAnswer("chain_getHeader", "hash", hash), digest: header.digest });
  };
  const calls: { method: string; params: readonly Json[]; result: unknown }[] = [];
  const cite = async (method: "chain_getBlockHash" | "chain_getHeader" | "state_getRuntimeVersion", params: Json[]) => {
    if (calls.some((call) => call.method === method && jsonText(call.params) === jsonText(params))) return;
    calls.push({ method, params, result: await ask(method, params) });
  };
  try {
    const genesis = { hash: await hashAt(0), specVersion: await specAt(0) };
    const genesisMnsv = await mnsvAt(0);
    if (genesisMnsv !== genesis.specVersion) {
      throw new Error(
        `block 0's MNSV digest names spec_version ${genesisMnsv}, where state_getRuntimeVersion at block 0 reports ` +
          `${genesis.specVersion}`,
      );
    }
    await cite("chain_getBlockHash", [0]);
    await cite("chain_getHeader", [genesis.hash]);
    await cite("state_getRuntimeVersion", [genesis.hash]);
    const headHash = (await ask("chain_getFinalizedHead", [])) as string;
    const headHeader = headerAnswer("chain_getHeader", "result", await ask("chain_getHeader", [headHash]));
    const head = { height: Number(headHeader.number), hash: headHash };
    const samples: number[] = [];
    for (let height = 0; height < head.height; height += step) samples.push(height);
    samples.push(head.height);
    const specs = await Promise.all(samples.map(specAt));
    const enactments: number[] = [];
    const bisect = async (low: number, high: number, lowSpec: number, highSpec: number): Promise<void> => {
      if (high === low + 1) {
        enactments.push(high);
        return;
      }
      const middle = Math.floor((low + high) / 2);
      const spec = await specAt(middle);
      if (spec !== lowSpec) await bisect(low, middle, lowSpec, spec);
      if (spec !== highSpec) await bisect(middle, high, spec, highSpec);
    };
    await Promise.all(
      samples.slice(1).map(async (height, index) => {
        const low = samples[index] as number;
        if (specs[index] !== specs[index + 1]) await bisect(low, height, specs[index] as number, specs[index + 1] as number);
      }),
    );
    enactments.sort((a, b) => a - b);
    const boundaries: { u: BoundaryBlockReading; f: BoundaryBlockReading }[] = [];
    for (const u of enactments) {
      const [before, after] = [await specAt(u - 1), await specAt(u)];
      const where = `the upgrade enacted at ${u} (state ${before} → ${after})`;
      const [uMnsv, fMnsv] = [await mnsvAt(u), await mnsvAt(u + 1)];
      if (uMnsv !== before) throw new Error(`${where}: U = ${u}'s MNSV digest names spec_version ${uMnsv}, not ${before}`);
      if (fMnsv !== after) throw new Error(`${where}: F = ${u + 1}'s MNSV digest names spec_version ${fMnsv}, not ${after}`);
      for (const height of [u - 1, u, u + 1]) await cite("chain_getBlockHash", [height]);
      for (const height of [u, u + 1]) await cite("chain_getHeader", [await hashAt(height)]);
      for (const height of [u - 1, u]) await cite("state_getRuntimeVersion", [await hashAt(height)]);
      boundaries.push({
        u: { height: u, hash: await hashAt(u), specVersion: uMnsv },
        f: { height: u + 1, hash: await hashAt(u + 1), specVersion: fMnsv },
      });
      options.log?.(`boundary at U ${u}: ${before} → ${after}`);
    }
    return { genesis, head, boundaries, calls, requests };
  } finally {
    await client.close();
  }
}
