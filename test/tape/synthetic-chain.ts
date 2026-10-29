import { createHash } from "node:crypto";
import { type Script, type ScriptedRequest, type Step } from "./scripted-node.js";

/**
 * A synthetic Midnight chain for the recording driver's tests: every allowed node call answered from a model in the
 * node's answer shapes (`src/node/decode.ts` reads them), by a {@link Script} of the scripted node
 * (`./scripted-node.ts`), on any connection and in any order, as a public node answers. [IN-8]
 *
 * Its runtime upgrades follow the ledger's boundary terms: block U enacts the upgrade, so the state at U already has
 * the new runtime (`state_getRuntimeVersion` at U's hash) while U's header still carries the old one in its `MNSV`
 * digest, and F = U + 1 is the first block built by the new runtime. Block 0's header carries the runtime at genesis.
 * [LG-1]
 *
 * `fault` lets a test break a request — by its method, its params and which request of that pair it is (counting from
 * 1, across connections) — with a dropped connection, an error answer, another result, or no answer, to see the driver
 * record a chunk again or give up.
 */

export interface SyntheticUpgrade {
  /** U: the block that enacts it. */
  readonly height: number;
  /** The new runtime's `spec_version`. */
  readonly specVersion: number;
}

export type SyntheticFault =
  | { readonly drop: true }
  | { readonly error: { readonly code: number; readonly message: string } }
  | { readonly result: unknown }
  | { readonly silent: true };

export interface SyntheticChainOptions {
  /** The number of blocks: heights 0 to length − 1; the finalized head is the last. */
  readonly length: number;
  readonly genesisSpecVersion?: number;
  readonly upgrades?: readonly SyntheticUpgrade[];
  /** How many cNight registrations block 0's state holds under `Mappings`. */
  readonly registrations?: number;
  /** Notifications each head subscription sends when made; 2 by default. */
  readonly notifications?: number;
  /** Breaks a request: its method, its params, and which request of that method and params it is (from 1). */
  readonly fault?: (method: string, params: readonly unknown[], occurrence: number) => SyntheticFault | undefined;
  /** Gives block h's header another parent hash (a chain that does not link). */
  readonly unlinkedAt?: number;
}

export interface SyntheticChain {
  readonly script: Script;
  readonly hashes: readonly string[];
  /** The `spec_version` of the state after block h (`state_getRuntimeVersion` at h's hash). */
  stateSpec(height: number): number;
  /** The `spec_version` in block h's `MNSV` digest. */
  mnsv(height: number): number;
  /** Every request received, by method, in order. */
  readonly requests: Map<string, unknown[][]>;
  /** The registration keys of block 0 under `Mappings`, in key order. */
  readonly registrationKeys: readonly string[];
}

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;
const sha = (text: string): string => hex(createHash("sha256").update(text).digest());

/** `System.Events`, `CNightObservation.Mappings`, `CNightObservation.Mapping`: twox128 prefixes (Substrate). */
export const EVENTS_STORAGE = "0x26aa394eea5630e07c48ae0c9558cef780d41e5e16056765bc8461851072c9d7";
export const MAPPINGS_PREFIX = "0xbbf4abef611bc3c9ca8cee3af9d8f7d14732239c3eff01cda7d8c21ecf067453";
export const MAPPING_PREFIX = "0xbbf4abef611bc3c9ca8cee3af9d8f7d1559191cdd22c99236677774060685a70";

/** A `DigestItem::Consensus(*b"MNSV", spec_version.encode())` item, as hex. */
export function mnsvItem(specVersion: number): string {
  const item = Buffer.alloc(10);
  item.set([0x04, 0x4d, 0x4e, 0x53, 0x56, 0x10]);
  item.writeUInt32LE(specVersion, 6);
  return hex(item);
}

export function syntheticChain(options: SyntheticChainOptions): SyntheticChain {
  const genesisSpec = options.genesisSpecVersion ?? 22_000;
  const upgrades = [...(options.upgrades ?? [])].sort((a, b) => a.height - b.height);
  const hashes = Array.from({ length: options.length }, (_, height) => sha(`synthetic block ${height}`));
  const byHash = new Map(hashes.map((hash, height) => [hash, height]));
  const stateSpec = (height: number): number =>
    upgrades.filter((upgrade) => upgrade.height <= height).at(-1)?.specVersion ?? genesisSpec;
  const mnsv = (height: number): number => (height === 0 ? genesisSpec : stateSpec(height - 1));
  const header = (height: number) => ({
    parentHash: height === 0 ? `0x${"00".repeat(32)}` : height === options.unlinkedAt ? sha("elsewhere") : hashes[height - 1],
    number: `0x${height.toString(16)}`,
    stateRoot: sha(`state ${height}`),
    extrinsicsRoot: sha(`extrinsics ${height}`),
    digest: { logs: [`0x0661757261${"20".repeat(4)}`, mnsvItem(mnsv(height))] },
  });
  const registrationKeys = Array.from({ length: options.registrations ?? 0 }, (_, index) =>
    `${MAPPINGS_PREFIX}${createHash("sha256").update(`registration ${index}`).digest("hex")}`,
  ).sort();
  const requests = new Map<string, unknown[][]>();
  const counts = new Map<string, number>();
  const notifications = options.notifications ?? 2;
  const head = options.length - 1;

  const answer = (method: string, params: unknown[]): Step[] | undefined => {
    const at = (index: number): number | undefined => byHash.get(params[index] as string);
    switch (method) {
      case "chain_getBlockHash": {
        const height = params[0] as number;
        return [{ result: hashes[height] ?? null }];
      }
      case "chain_getHeader": {
        const height = at(0);
        return [{ result: height === undefined ? null : header(height) }];
      }
      case "chain_getBlock": {
        const height = at(0);
        if (height === undefined) return [{ result: null }];
        const extrinsics = [`0x280403000b${height.toString(16).padStart(12, "0")}`];
        if (height % 5 === 0) extrinsics.push(sha(`transaction ${height}`));
        return [{ result: { block: { header: header(height), extrinsics }, justifications: null } }];
      }
      case "state_getRuntimeVersion": {
        const height = at(0) as number;
        return [
          {
            result: {
              specName: "midnight",
              implName: "midnight",
              authoringVersion: 1,
              specVersion: stateSpec(height),
              implVersion: 0,
              apis: [["0xdf6acb689907609b", 5]],
              transactionVersion: 2,
              systemVersion: 1,
              stateVersion: 1,
            },
          },
        ];
      }
      case "state_getMetadata":
        return [{ result: `0x6d657461${stateSpec(at(0) as number).toString(16).padStart(8, "0")}` }];
      case "state_getStorage": {
        const [key] = params as string[];
        if (key === EVENTS_STORAGE) return [{ result: `0x04${((at(1) as number) % 256).toString(16).padStart(2, "0")}` }];
        if (registrationKeys.includes(key as string) && at(1) === 0) return [{ result: sha(`value ${key}`) }];
        return [{ result: null }];
      }
      case "state_getKeysPaged": {
        const [prefix, count, startKey] = params as [string, number, string | null];
        const keys = prefix === MAPPINGS_PREFIX && at(3) === 0 ? registrationKeys : [];
        const after = keys.filter((key) => startKey === null || key > startKey);
        return [{ result: after.slice(0, count) }];
      }
      case "midnight_ledgerStateRoot":
        return [{ result: Array.from(Buffer.from(sha(`root ${at(0)}`).slice(2), "hex")).concat([0]) }];
      case "system_properties":
        return [{ result: { genesis_extrinsics: ["2805"], genesis_state: "00ab" } }];
      case "chain_getFinalizedHead":
        return [{ result: hashes[head] }];
      case "system_version":
        return [{ result: "0.0.0-synthetic" }];
      default:
        return undefined;
    }
  };

  let subscriptions = 0;
  const script: Script = (request: ScriptedRequest) => {
    const params = (request.params ?? []) as unknown[];
    const list = requests.get(request.method) ?? [];
    list.push(params);
    requests.set(request.method, list);
    const key = JSON.stringify([request.method, params]);
    const occurrence = (counts.get(key) ?? 0) + 1;
    counts.set(key, occurrence);
    const fault = options.fault?.(request.method, params, occurrence);
    if (fault !== undefined) {
      if ("drop" in fault) return [{ drop: true }];
      if ("silent" in fault) return [];
      if ("error" in fault) return [{ error: fault.error }];
      return [{ result: fault.result }];
    }
    const notification = {
      chain_subscribeNewHeads: "chain_newHead",
      chain_subscribeFinalizedHeads: "chain_finalizedHead",
    }[request.method];
    if (notification !== undefined) {
      subscriptions += 1;
      const id = `sub-${subscriptions}`;
      const steps: Step[] = [{ result: id }];
      for (let index = 0; index < notifications; index++) {
        steps.push({ notify: notification, subscription: id, result: header(Math.min(head, Math.max(0, head - 1 + index))) });
      }
      return steps;
    }
    return answer(request.method, params) ?? [{ error: { code: -32601, message: "Method not found" } }];
  };

  return { script, hashes, stateSpec, mnsv, requests, registrationKeys };
}
