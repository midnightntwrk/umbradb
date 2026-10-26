import { readFileSync } from "node:fs";
import { expect } from "vitest";
import { WebSocket } from "ws";
import { TapeBuilder, type TapeRecord } from "../../tools/tape/index.js";
import { withNode } from "./checks.js";
import { RawClient } from "./raw-client.js";
import { type Script, ScriptedNode, type Step } from "./scripted-node.js";

/**
 * A71's record-and-replay check (`openspec/changes/core-arch/acceptance.md` §9; TT-4; task 9.2), which the committed
 * negative controls (`builder.negative-control.test.ts`) run against wrong builders and `builder.test.ts` against the
 * real one: a client session against the scripted JSON-RPC server (`scripted-node.ts`), recorded by the builder, then
 * the same session against the tape node serving that tape; the client must receive byte-identical answers and
 * notifications in the same order, connection by connection, and each connection must end the same way.
 *
 * **The session** ({@link runA71Session}) covers what a recording meets: a request without `params` (recorded as `[]`),
 * numeric and string ids, an integer beyond 2^53 in an answer, one method and params answered differently twice, an
 * error answer, object params, two subscriptions (a string and a number id) with notifications after the answers that
 * let them through, a call the node never answers before it drops the connection (a `timeout` fault), the client
 * reconnecting and subscribing again, a connection the client ends, a connection whose node handshake fails (an empty
 * session, dropped as it opens), and a last session the client ends. Each request waits for its answer, so a client
 * receives every frame in one order on both runs.
 */

/** The tape the builder records for {@link runA71Session}, written by hand in the writer's form, not by the builder. */
export const A71_TAPE_PATH = new URL("./fixtures/a71-recorded.tape.jsonl", import.meta.url);

/** Its SHA-256, computed by `shasum -a 256` when the file was written (2026-10-26). */
export const A71_TAPE_ID = "92a2a3ddb1284665c249b2f125651abddb47884e47e7745f803358011d434e53";

/** The committed tape's text. */
export function a71TapeText(): string {
  return readFileSync(A71_TAPE_PATH, "utf8");
}

/**
 * What a client received on one connection, and how the connection ended: the close code when the node ended it, or
 * `"client"` when the client did. (The tape records a session's end as a `disconnect` whoever ended it, so the tape
 * node drops a session the client ended once its last record is answered: the frames are the same, the close is not.)
 */
export interface ConnectionFrames {
  readonly texts: readonly string[];
  readonly close: number | "client";
}

/** How long, in real time, a session waits for a connection to end before failing. */
const END_WAIT_MS = 15_000;

function ended(closed: Promise<number>, connection: number): Promise<number> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(`connection ${connection} did not end`)), END_WAIT_MS);
    void closed.then((code) => {
      clearTimeout(timer);
      resolve(code);
    });
  });
}

/** Opens a connection the server drops before any frame; resolves with what arrived and the close code. */
function droppedConnection(url: string): Promise<ConnectionFrames> {
  const socket = new WebSocket(url);
  const texts: string[] = [];
  socket.on("error", () => {});
  socket.on("message", (data) => texts.push(String(data)));
  return new Promise((resolve) => socket.on("close", (close) => resolve({ texts, close })));
}

/**
 * A71's client session against `url`. After each answer, `check(connection, texts)` sees what the connection has
 * received so far (the replay compares it with the recording, so a wrong tape fails at its first wrong frame).
 */
export async function runA71Session(
  url: string,
  check: (connection: number, texts: readonly string[]) => void = () => {},
): Promise<ConnectionFrames[]> {
  const sessions: ConnectionFrames[] = [];
  const one = await RawClient.open(url);
  const step1 = async (answer: Promise<unknown>): Promise<void> => {
    await answer;
    check(1, one.texts);
  };
  one.send('{"jsonrpc":"2.0","id":1,"method":"system_properties"}');
  await step1(one.answer(1));
  await step1(one.call("chain_getBlockHash", [0], 2));
  await step1(one.call("chain_subscribeFinalizedHeads", [], 3));
  await step1(one.call("chain_getFinalizedHead", [], 4));
  await step1(one.call("chain_getHeader", ["0xf1"], 5));
  await step1(one.call("chain_getFinalizedHead", [], "six"));
  await step1(one.call("state_getStorage", ["0x26aa", "0xf2"], 7));
  await step1(one.call("chain_subscribeNewHeads", [], 8));
  await step1(one.call("state_getMetadata", { at: "0xf2" }, 9));
  one.request("chain_getBlock", ["0xf2"], 10);
  sessions.push({ texts: one.texts, close: await ended(one.closed, 1) });

  const two = await RawClient.open(url);
  const step2 = async (answer: Promise<unknown>): Promise<void> => {
    await answer;
    check(2, two.texts);
  };
  await step2(two.call("chain_subscribeFinalizedHeads", [], 1));
  await step2(two.call("chain_getBlock", ["0xf2"], 2));
  await step2(two.call("state_getStorage", ["0x26aa", "0xf1"], 3));
  await step2(two.call("chain_getBlockHash", [0], 4));
  await two.close();
  sessions.push({ texts: two.texts, close: "client" });

  sessions.push(await droppedConnection(url));

  const four = await RawClient.open(url);
  await four.call("chain_getFinalizedHead", [], 1);
  check(4, four.texts);
  await four.close();
  sessions.push({ texts: four.texts, close: "client" });
  return sessions;
}

/** The scripted node's answers to A71's session: by method and params, and by how often each was asked. */
export function a71Script(): Script {
  const asked = new Map<string, number>();
  return (request) => {
    const key = `${request.method} ${JSON.stringify(request.params ?? null)}`;
    const occurrence = (asked.get(key) ?? 0) + 1;
    asked.set(key, occurrence);
    const finalized = (number: string): Step => ({
      notify: "chain_finalizedHead",
      subscription: occurrence === 1 ? "f-1" : "f-2",
      result: { number },
    });
    switch (key) {
      case "system_properties null":
        return [{ raw: `{"jsonrpc":"2.0","id":${JSON.stringify(request.id)},"result":${BIG_PROPERTIES}}` }];
      case "chain_getBlockHash [0]":
        return [{ result: "0xa0" }];
      case "chain_subscribeFinalizedHeads []":
        return [{ result: occurrence === 1 ? "f-1" : "f-2" }, finalized(occurrence === 1 ? "0x1" : "0x4")];
      case "chain_getFinalizedHead []":
        return [{ result: ["0xf1", "0xf2", "0xf3"][occurrence - 1] }];
      case 'chain_getHeader ["0xf1"]':
        return [
          { result: { parentHash: "0xf0", number: "0x1" } },
          { notify: "chain_finalizedHead", subscription: "f-1", result: { number: "0x2" } },
        ];
      case 'state_getStorage ["0x26aa","0xf2"]':
        return [{ error: { code: 4003, message: "Client error: UnknownBlock: State already discarded for 0xf2" } }];
      case "chain_subscribeNewHeads []":
        return [
          { result: 7 },
          { notify: "chain_newHead", subscription: 7, result: { number: "0x3" } },
          { notify: "chain_finalizedHead", subscription: "f-1", result: { number: "0x3" } },
        ];
      case 'state_getMetadata {"at":"0xf2"}':
        return [{ result: "0x6d657461" }, { notify: "chain_newHead", subscription: 7, result: { number: "0x4" } }];
      case 'chain_getBlock ["0xf2"]':
        if (occurrence === 1) return [{ drop: true }];
        return [{ result: { block: { header: { number: "0x2" }, extrinsics: ["0x00"] }, justifications: null } }];
      case 'state_getStorage ["0x26aa","0xf1"]':
        return [{ result: "0x0100" }];
      default:
        throw new Error(`the A71 script has no answer for ${key}`);
    }
  };
}

/** `system_properties` with an integer beyond 2^53, which `JSON.stringify` cannot write. */
const BIG_PROPERTIES = '{"ss58Format":42,"existentialDeposit":18446744073709551616}';

/** A71's session recorded through a builder in front of the scripted node, whose third handshake is refused. */
export interface Recorded {
  readonly records: readonly TapeRecord[];
  readonly frames: readonly ConnectionFrames[];
  /** What the scripted node sent on each of its connections. */
  readonly sent: readonly (readonly string[])[];
  /** The request frames the scripted node received, as their texts. */
  readonly received: readonly string[];
}

export async function recordA71(): Promise<Recorded> {
  const node = await ScriptedNode.start(a71Script());
  node.refuse = (upgrade) => (upgrade === 3 ? 503 : undefined);
  const builder = await TapeBuilder.start({ node: node.url });
  try {
    const frames = await runA71Session(builder.url);
    const records = await builder.stop();
    return { records, frames, sent: node.sent, received: node.received.map((request) => request.text) };
  } finally {
    await builder.stop().catch(() => undefined);
    await node.stop();
  }
}

/** A71's session against the tape node serving `records`, each frame compared with `recorded` as it arrives. */
export function replayA71(
  records: readonly TapeRecord[],
  recorded: readonly ConnectionFrames[],
): Promise<ConnectionFrames[]> {
  return withNode(records, (node) =>
    runA71Session(node.url, (connection, texts) => {
      expect(texts).toEqual(recorded[connection - 1]?.texts.slice(0, texts.length));
    }),
  );
}

/**
 * A71's `[CI]` check: the session recorded by the builder and replayed by the tape node gives byte-identical answers
 * and notifications, in the same order, and the same ends of connections. Returns the recording.
 */
export async function expectRecordReplayIdentical(): Promise<Recorded> {
  const recorded = await recordA71();
  const replayed = await replayA71(recorded.records, recorded.frames);
  expect(replayed).toEqual(recorded.frames);
  return recorded;
}
