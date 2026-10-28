/**
 * The pack smoke's node (`./pack-install.mjs`, core-arch task 17.3; design §13 "the pack smoke … syncs a tape on
 * PostgreSQL in Docker"): a tape node (`tools/tape/`, outside the package) serving the browser tests' synthetic chain
 * (`test/browser/tapes.ts`) — blocks 0 to 9 of runtime 2.0, real ledger v9 transactions at heights 4 (two regular ones)
 * and 6 (two regular ones and a system one) — as one session of a process on a new database from S = 3 to 9.
 *
 * Run from the repository's root with `npx tsx test/smoke/tape-node.ts`: it prints one JSON line — the node's URL, the
 * chain's genesis hash (the `custom` network's `genesisHash`), S, the last height and how many transactions the chain
 * holds — and serves until its standard input closes or it is signalled.
 */

import { TapeNode } from "../../tools/tape/index.js";
import { browserChain, syncSession } from "../browser/tapes.js";

const START = 3n;
const LAST = 9n;

const chain = browserChain(LAST);
const node = await TapeNode.start({ records: syncSession(chain, START, LAST) });
const transactions = [...chain.transactions.values()].reduce((sum, n) => sum + n, 0);
process.stdout.write(
  `${JSON.stringify({ url: node.url, genesis: chain.genesis, start: Number(START), last: Number(LAST), transactions })}\n`,
);

let closing = false;
const close = (): void => {
  if (closing) return;
  closing = true;
  void node.close().then(() => process.exit(0));
};
process.stdin.on("end", close);
process.stdin.on("close", close);
process.stdin.resume();
process.on("SIGTERM", close);
process.on("SIGINT", close);
