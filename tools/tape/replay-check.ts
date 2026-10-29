/**
 * The record-and-replay check through the node client. A session of `src/node/`'s `NodeClient` is run through the
 * recording builder against a node. The tape it recorded is replayed by the tape node to a new client running the same
 * session, and every frame each connection sent and received is compared byte for byte. [A71, TT-4]
 *
 * Its default session, {@link in8Tour}, is what the check's manual half runs against a real Midnight node
 * (`tsx tools/tape/main.ts check --node <url> --out <file>`, `./command.ts`). The CI runs it against a scripted node
 * (`test/tape/record-and-replay.test.ts`). [A71]
 */

import {
  type ConnectSocket,
  connectWebSocket,
  NodeClient,
  type NodeClientOptions,
} from "../../src/node/index.js";
import { TapeBuilder } from "./builder.js";
import { TapeNode } from "./node.js";
import type { TapeRecord } from "./records.js";
import { tapeId, writeTape } from "./tape.js";

/** A node client session, run once against the builder and once against the tape node. */
export type ReplaySession = (client: NodeClient) => Promise<void>;

/** What a client sent and received on one connection, as text, in order. */
export interface ConnectionFrames {
  readonly sent: readonly string[];
  readonly received: readonly string[];
}

export interface RecordAndReplayOptions {
  /** The node's WebSocket URL (`ws://` or `wss://`). */
  readonly node: string;
  /** The session; {@link in8Tour} by default. */
  readonly session?: ReplaySession;
  /** The node client's options for both runs (its `connect` is wrapped to capture the frames). */
  readonly client?: Omit<NodeClientOptions, "url">;
}

export interface RecordAndReplayResult {
  /** The tape the builder recorded. */
  readonly records: readonly TapeRecord[];
  readonly bytes: Uint8Array;
  /** The tape's id: the SHA-256 of its bytes. */
  readonly id: string;
  /** Each connection's frames when recorded, and when replayed. */
  readonly recorded: readonly ConnectionFrames[];
  readonly replayed: readonly ConnectionFrames[];
  /** The first difference between the runs (or the replayed session's failure); undefined when there is none. */
  readonly difference: string | undefined;
  readonly identical: boolean;
}

/** `System.Number`'s storage key (twox128("System") ‖ twox128("Number")): the block's height. */
const SYSTEM_NUMBER = Buffer.from("26aa394eea5630e07c48ae0c9558cef702a5c1b19ab7a04f536c519aca4983ac", "hex");
/** The `System` pallet's storage prefix. */
const SYSTEM_PREFIX = Buffer.from("26aa394eea5630e07c48ae0c9558cef7", "hex");

/** How long the tour waits for its heads by default: a few blocks of a live chain. */
export const DEFAULT_HEADER_TIMEOUT_MS = 120_000;

/**
 * The node-call tour: every node call the client may make, once, at the node's finalized head (`chain_getBlockHash(0)`,
 * `chain_getFinalizedHead`, `chain_getHeader`, `chain_getBlock`, `state_getRuntimeVersion`, `state_getMetadata`,
 * `state_getStorage` (`System.Number`), `state_getKeysPaged` (three `System` keys), `midnight_ledgerStateRoot`,
 * `system_properties`), each without retries (a node that fails fails the tour). Then both head subscriptions, until
 * one new head and two finalized heads have come (within `headerTimeoutMs`). [IN-8]
 */
export async function in8Tour(
  client: NodeClient,
  options: { readonly headerTimeoutMs?: number } = {},
): Promise<void> {
  const once = { retry: false } as const;
  await client.blockHash(0n, once);
  const head = await client.finalizedHead(once);
  await client.header(head, once);
  await client.block(head, once);
  await client.runtimeVersion(head, once);
  await client.metadata(head, once);
  await client.storage(SYSTEM_NUMBER, head, once);
  await client.storageKeys(SYSTEM_PREFIX, 3, null, head, once);
  await client.ledgerStateRoot(head, once);
  await client.systemProperties(once);
  const timeoutMs = options.headerTimeoutMs ?? DEFAULT_HEADER_TIMEOUT_MS;
  let newHeads = 0;
  let finalized = 0;
  let timer: ReturnType<typeof setTimeout> | undefined;
  try {
    await new Promise<void>((resolve, reject) => {
      const seen = (): void => {
        if (newHeads >= 1 && finalized >= 2) resolve();
      };
      timer = setTimeout(
        () =>
          reject(
            new Error(
              `the node-call tour waited ${timeoutMs} ms for 1 new head and 2 finalized heads, ` +
                `and received ${newHeads} and ${finalized}`,
            ),
          ),
        timeoutMs,
      );
      const subscribed = (async () => {
        await client.subscribeNewHeads({
          header: () => {
            newHeads += 1;
            seen();
          },
          error: reject,
        });
        await client.subscribeFinalizedHeads({
          header: () => {
            finalized += 1;
            seen();
          },
          error: reject,
        });
      })();
      subscribed.catch(reject);
    });
  } finally {
    clearTimeout(timer);
  }
}

/** Runs `session` with a client of `url` whose every connection's frames are kept. */
async function run(
  url: string,
  session: ReplaySession,
  options: Omit<NodeClientOptions, "url"> | undefined,
): Promise<{ readonly frames: ConnectionFrames[]; readonly failed: boolean; readonly error: unknown }> {
  const frames: { sent: string[]; received: string[] }[] = [];
  const base = options?.connect ?? connectWebSocket;
  const connect: ConnectSocket = (target, events, timers) => {
    const connection = { sent: [] as string[], received: [] as string[] };
    frames.push(connection);
    const socket = base(
      target,
      {
        open: () => events.open(),
        message: (text) => {
          connection.received.push(text);
          events.message(text);
        },
        closed: (failure) => events.closed(failure),
      },
      timers,
    );
    return {
      send: (text) => {
        connection.sent.push(text);
        socket.send(text);
      },
      close: () => socket.close(),
    };
  };
  const client = new NodeClient({ ...options, url, connect });
  try {
    await session(client);
    return { frames, failed: false, error: undefined };
  } catch (error) {
    return { frames, failed: true, error };
  } finally {
    await client.close();
  }
}

/** An error's text, its code first when it has one (`node-unreachable: …`). */
export function errorText(error: unknown): string {
  if (!(error instanceof Error)) return String(error);
  const code = (error as { code?: unknown }).code;
  return typeof code === "string" && !error.message.startsWith(code) ? `${code}: ${error.message}` : error.message;
}

const SHOWN = 200;
const shown = (text: string | undefined): string =>
  text === undefined ? "nothing" : text.length > SHOWN ? `${text.slice(0, SHOWN)}…` : text;

/** The first difference between two runs' frames, or undefined when every frame is the same. */
export function firstDifference(
  recorded: readonly ConnectionFrames[],
  replayed: readonly ConnectionFrames[],
): string | undefined {
  if (recorded.length !== replayed.length) {
    return `recorded ${recorded.length} connections, replayed ${replayed.length}`;
  }
  for (const [index, frames] of recorded.entries()) {
    const other = replayed[index] as ConnectionFrames;
    for (const side of ["sent", "received"] as const) {
      const length = Math.max(frames[side].length, other[side].length);
      for (let frame = 0; frame < length; frame++) {
        const a = frames[side][frame];
        const b = other[side][frame];
        if (a !== b) {
          return `connection ${index + 1}, frame ${frame + 1} ${side}: recorded ${shown(a)}, replayed ${shown(b)}`;
        }
      }
    }
  }
  return undefined;
}

/**
 * Records `session` (the node-call tour by default) through a builder in front of `node`, replays the tape through a
 * tape node, and compares the frames. Throws the builder's `cannot-record` error, or the recorded session's own error;
 * a replayed session that fails is a difference.
 */
export async function recordAndReplay(options: RecordAndReplayOptions): Promise<RecordAndReplayResult> {
  const session = options.session ?? ((client: NodeClient) => in8Tour(client));
  const builder = await TapeBuilder.start({ node: options.node });
  let recording: Awaited<ReturnType<typeof run>>;
  try {
    recording = await run(builder.url, session, options.client);
  } catch (error) {
    // The client could not be made (its options): nothing connected, so nothing was recorded or refused.
    await builder.stop();
    throw error;
  }
  // A refusal of the builder is the cause of whatever else failed, so it is thrown first.
  const records = await builder.stop();
  if (recording.failed) throw recording.error;
  const bytes = writeTape(records);
  const node = await TapeNode.start({ records });
  let replay: Awaited<ReturnType<typeof run>>;
  try {
    replay = await run(node.url, session, options.client);
  } finally {
    await node.close();
  }
  const difference = replay.failed
    ? `the replayed session failed: ${errorText(replay.error)}`
    : firstDifference(recording.frames, replay.frames);
  return {
    records,
    bytes,
    id: tapeId(bytes),
    recorded: recording.frames,
    replayed: replay.frames,
    difference,
    identical: difference === undefined,
  };
}
