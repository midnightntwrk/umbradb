import { setTimeout as sleep } from "node:timers/promises";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import type { PrivateBackend } from "../private/backends.js";
import { channelPair, peerHello, rawPeer } from "./channel-fixtures.js";
import { channelCore } from "./channel-processes.js";
import { libraryData } from "./library-fixtures.js";

/**
 * The run and oracle, shared by `./channel-queue.test.ts` (the criterion) and
 * `./channel-queue.negative-control.test.ts` (its control, the not-accepting paths keeping the channel): `accept()` on
 * a process not accepting channels — one with no channel request, and a channel core after `stop()` — closes the
 * channel 1008 `private-link-not-accepting`, logs a line naming why, and throws nothing, a carrier that throws at every
 * call included. Imports nothing of Vitest.
 */

/** How long a refused channel may take to be told its close. */
const REFUSED_WITHIN_MS = 2_000;

/** The close the check expects. */
const NOT_ACCEPTING = { code: 1008, reason: "private-link-not-accepting" };

/** A carrier that throws at every call. */
const THROWING: PrivateLinkChannel = {
  send: () => {
    throw new Error("send");
  },
  onMessage: () => {
    throw new Error("onMessage");
  },
  onClose: () => {
    throw new Error("onClose");
  },
  close: () => {
    throw new Error("close");
  },
};

/**
 * The oracle over `accept` on a process not accepting channels, whose log is `lines` and which must name `why`: the
 * problems of one channel given to it and of a carrier that throws, none when it held.
 */
export async function refusedChannelProblems(
  accept: (channel: PrivateLinkChannel) => void,
  lines: readonly string[],
  why: string,
): Promise<string[]> {
  const problems: string[] = [];
  const logged = lines.length;
  const [coreEnd, peerEnd] = channelPair();
  const peer = rawPeer(peerEnd);
  try {
    accept(coreEnd);
  } catch (error) {
    problems.push(`accept() threw: ${String(error)}`);
  }
  const ended = await Promise.race([peer.ended, sleep(REFUSED_WITHIN_MS, null)]);
  if (JSON.stringify(ended) !== JSON.stringify(NOT_ACCEPTING)) {
    problems.push(`the channel ${ended === null ? `is still open after ${REFUSED_WITHIN_MS} ms` : `ended ${JSON.stringify(ended)}`}`);
    peerEnd.close();
  }
  const line = `private link: a channel was closed (private-link-not-accepting): ${why}`;
  if (!lines.slice(logged).includes(line)) problems.push(`no line "${line}"`);
  try {
    accept(THROWING);
  } catch (error) {
    problems.push(`accept() threw for a carrier that throws: ${String(error)}`);
  }
  return problems;
}

/**
 * The run on `backend`: the oracle on a process with no channel request (startUmbraDB as a host starts it, running),
 * then on a channel core after its `stop()` (its open session closed 1001 by the stop, as a socket link's). The
 * problems, each prefixed with its case; none when the rule holds.
 */
export async function l39Problems(backend: PrivateBackend): Promise<string[]> {
  const problems: string[] = [];
  const lines: string[] = [];
  const plain = startUmbraDB({
    config: { data: libraryData((await backend.database("public")).setting) },
    source: new InMemoryBlockSource({ head: 2n }),
    log: (line) => lines.push(line),
  });
  try {
    await plain.started;
    const found = await refusedChannelProblems((channel) => plain.privateLink.accept(channel), lines, "this process accepts no channels");
    problems.push(...found.map((problem) => `no channel request: ${problem}`));
  } finally {
    await plain.stop();
  }
  const core = channelCore(await backend.database("public"), { head: 2n });
  await core.handle.started;
  const [openEnd, peerEnd] = channelPair();
  const open = rawPeer(peerEnd);
  core.handle.privateLink.accept(openEnd);
  open.send(peerHello("open-at-stop"));
  await open.next("hello-ack");
  await core.handle.stop();
  const atStop = await open.ended;
  if (JSON.stringify(atStop) !== JSON.stringify({ code: 1001, reason: "the core is stopping" })) {
    problems.push(`after stop(): the open session ended ${JSON.stringify(atStop)}`);
  }
  const found = await refusedChannelProblems((channel) => core.handle.privateLink.accept(channel), core.lines, "the process is stopping");
  problems.push(...found.map((problem) => `after stop(): ${problem}`));
  return problems;
}
