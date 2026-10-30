import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { expect } from "vitest";
import {
  type ConnectSocket,
  connectWebSocket,
  NodeClient,
  type NodeRetry,
} from "../../src/node/index.js";
import {
  delayAnswers,
  dropNotifications,
  insertDisconnect,
  type Json,
  readTapeFile,
  repeatNotification,
  replaceWithError,
  skipNotifications,
  spliceNotifications,
  stateUnavailable,
  TapeNode,
  type TapeRecord,
  tapeText,
} from "../../tools/tape/index.js";
import { ManualTimers, until } from "../node/manual-timers.js";
import { A71_TAPE_PATH } from "./builder-checks.js";

/**
 * The transform checks, which the committed negative controls (`transforms.negative-control.test.ts`) run against wrong
 * transforms and `transforms.test.ts` against the real ones: each variant transform, applied to the recorded tape, must
 * give the tape committed as its expected output (`fixtures/transforms/<name>.tape.jsonl`, each written by hand from
 * the recorded tape by line edits, not by the transforms); and a disconnect inserted into a session with a live
 * subscription must replay through the node client, which subscribes again after it reconnects.
 * [A71, TT-4; acceptance §9]
 */

/** The committed expected outputs, and the fork tape the splice takes its notifications from. */
export const TRANSFORMS = new URL("./fixtures/transforms/", import.meta.url);

/** The recorded tape (`fixtures/a71-recorded.tape.jsonl`): the input of every variant. [A71] */
export function baseRecords(): readonly TapeRecord[] {
  return readTapeFile(fileURLToPath(A71_TAPE_PATH)).records;
}

/** The fork tape (`fixtures/transforms/fork.tape.jsonl`): a new-heads subscription on another branch. */
export function forkRecords(): readonly TapeRecord[] {
  return readTapeFile(fileURLToPath(new URL("fork.tape.jsonl", TRANSFORMS))).records;
}

/** The committed expected output `name`. */
export function expectedText(name: string): string {
  return readFileSync(new URL(`${name}.tape.jsonl`, TRANSFORMS), "utf8");
}

/** Each variant transform as the checks apply it to the recorded tape, with its committed output's SHA-256. [A71] */
export const VARIANTS: readonly {
  readonly name: string;
  readonly id: string;
  readonly apply: (records: readonly TapeRecord[]) => readonly TapeRecord[];
}[] = [
  {
    name: "drop",
    id: "dd84508e91e1636f86e229e7aa629d33319fe543dbfc4ef15732ec4cd4fffe06",
    apply: (records) => dropNotifications(records, { session: 1, subscription: "f-1", from: 2 }),
  },
  {
    name: "skip",
    id: "4c6f440172aa5a161e369dbb9aecc9681dbdd388f3042a6b460dc2c2047817c8",
    apply: (records) => skipNotifications(records, { session: 1, subscription: "f-1", from: 2, count: 1 }),
  },
  {
    name: "repeat",
    id: "a22dc8ce4c8546cfe8b1776b19245b56e2b520f9498899ed26af567e4990639b",
    apply: (records) => repeatNotification(records, { session: 1, subscription: 7, nth: 1 }),
  },
  {
    name: "disconnect",
    id: "294c190bae672c0c003636061130507d168197fe711ba53865b5c2d0b01e50e3",
    apply: (records) => insertDisconnect(records, { after: 12 }),
  },
  {
    name: "delay",
    id: "29545fe9ec5e106979af0a8206db504d566ac5275ba97ff5276c9bab3ddf7830",
    apply: (records) => delayAnswers(records, { select: [5, 19], delayMs: 2000 }),
  },
  {
    name: "state-unavailable",
    id: "b9c70616e66338a0dc02d52b347e97ceed6b96bf6ebc4c07bd05134c7a330f0c",
    apply: (records) => stateUnavailable(records, { select: [20] }),
  },
  {
    name: "error",
    id: "bf0f4acf4db452511c9fbd8bb41dd756ea5e399bd63b3004361d05f216c61ec8",
    apply: (records) =>
      replaceWithError(records, { select: [21], error: { code: -32999, message: "RPC rate limit exceeded" } }),
  },
  {
    name: "splice",
    id: "65c3392fc6dbe69de4f78dad84457893c52c8647f87a07d20c4349e4c2684f56",
    apply: (records) =>
      spliceNotifications(records, {
        session: 1,
        subscription: 7,
        from: 1,
        count: 2,
        source: { records: forkRecords(), session: 1, subscription: "n-1", from: 2, count: 3 },
      }),
  },
];

/** The variant `name` applied to the recorded tape gives its committed expected output, byte for byte. [A71] */
export function expectVariantOutput(name: string): void {
  const variant = VARIANTS.find((candidate) => candidate.name === name);
  if (variant === undefined) throw new Error(`no variant ${name}`);
  expect(tapeText(variant.apply(baseRecords()))).toBe(expectedText(name));
}

const quietConnect: ConnectSocket = (url, events, timers) =>
  connectWebSocket(url, events, timers, { heartbeatMs: 2 ** 31 - 1 });
const hash = (n: number): string => `0x${n.toString(16).padStart(64, "0")}`;

function header(n: number): Json {
  return {
    parentHash: hash(n + 1000),
    number: `0x${n.toString(16)}`,
    stateRoot: hash(n + 2000),
    extrinsicsRoot: hash(n + 3000),
    digest: { logs: [] },
  };
}

/** What a node client saw replaying `records`: `steps` drives it, then the subscriber's events in order. */
async function replayThroughClient(
  records: readonly TapeRecord[],
  steps: (client: NodeClient, timers: ManualTimers, retries: NodeRetry[], events: string[]) => Promise<void>,
): Promise<{ readonly events: readonly string[]; readonly sessions: readonly number[] }> {
  const timers = new ManualTimers();
  const retries: NodeRetry[] = [];
  const node = await TapeNode.start({ records });
  const onRetry = (retry: NodeRetry): void => {
    retries.push(retry);
  };
  const client = new NodeClient({ url: node.url, timers, connect: quietConnect, onRetry });
  const events: string[] = [];
  try {
    await client.subscribeFinalizedHeads({
      header: (seen) => events.push(`header ${seen.number}`),
      restarted: () => events.push("restarted"),
      error: (error) => events.push(`error ${(error as { code?: string }).code ?? String(error)}`),
    });
    await steps(client, timers, retries, events);
    return { events, sessions: node.calls.map((call) => call.session) };
  } finally {
    await client.close();
    await node.close();
  }
}

/**
 * A disconnect inserted after a record, in a session whose subscription has notifications after it: the node client
 * reconnects after its 1 s back-off, subscribes again, and the notifications after the cut reach it.
 */
export async function expectNotificationsAfterInsertedDisconnect(): Promise<void> {
  const records: TapeRecord[] = [
    { subscribe: "a", method: "chain_subscribeFinalizedHeads", params: [] },
    { notify: "a", result: header(1) },
    { method: "chain_getBlockHash", params: [1], result: hash(1) },
    { notify: "a", result: header(2) },
    { method: "chain_getBlockHash", params: [2], result: hash(2) },
    { notify: "a", result: header(3) },
  ];
  const variant = insertDisconnect(records, { after: 3 });
  const seen = await replayThroughClient(variant, async (client, timers, retries, events) => {
    await client.blockHash(1n);
    await until(() => retries.length === 1, "the inserted disconnect");
    await timers.advance(1000);
    await until(() => events.length === 3, "the header after the reconnect");
    await client.blockHash(2n);
    await until(() => events.length === 4, "the last header");
  });
  expect(seen.events).toEqual(["header 1", "restarted", "header 2", "header 3"]);
  expect(seen.sessions).toEqual([1, 1, 2, 2]);
}

/**
 * A disconnect inserted after the last notification of a live subscription: the node client subscribes again on the
 * next session, and that subscription must be on the tape (else the client's subscriber hears `not-on-tape`).
 */
export async function expectResubscriptionOnTape(): Promise<void> {
  const records: TapeRecord[] = [
    { subscribe: "a", method: "chain_subscribeFinalizedHeads", params: [] },
    { notify: "a", result: header(1) },
    { method: "chain_getBlockHash", params: [1], result: hash(1) },
    { method: "chain_getBlockHash", params: [2], result: hash(2) },
  ];
  const variant = insertDisconnect(records, { after: 3 });
  const seen = await replayThroughClient(variant, async (client, timers, retries) => {
    await client.blockHash(1n);
    await until(() => retries.length === 1, "the inserted disconnect");
    await timers.advance(1000);
    await client.blockHash(2n);
  });
  expect(seen.events).toEqual(["header 1", "restarted"]);
}
