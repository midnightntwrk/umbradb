// How many blocks carry transactions near given heights, from the node's blocks, as a proxy: it counts extrinsics, not
// transactions. 400 consecutive blocks from each height given, and from 20,000, 2,000 and 400 below the head (those of
// them that the chain has). For each window it prints:
//   - how many blocks have each count of extrinsics;
//   - the blocks with more extrinsics than the window's fewest, their share and mean: the proxy. It cannot see a
//     transaction in a window where every block has one (every block then has the fewest, which is said), and it
//     counts an inherent that only some blocks have as a transaction;
//   - the extrinsics by kind, the share of blocks that have each and the mean per block: an unsigned or bare call by its
//     format's version and its pallet's and call's indexes (v4 5.0), a signed or general one as such. An inherent is in
//     every block, once; a ledger transaction is an unsigned call of the Midnight pallet (its call 0), whose index the
//     runtime's metadata gives.
//   UMBRADB_LOCAL_NODE=<the node's address, ws or wss://<host>:9944> node txshare.mjs [<height> ...]
import { oneLine } from "./lines.mjs";
oneLine("txshare.mjs");
const node = process.env.UMBRADB_LOCAL_NODE;
if (!node) throw new Error("set UMBRADB_LOCAL_NODE to the node's WebSocket address");
const url = node.replace(/^ws(s?):\/\//, "http$1://");
for (const height of process.argv.slice(2)) if (!/^\d+$/.test(height)) throw new Error(`a height is a whole number: ${height}`);
const given = process.argv.slice(2).map(Number);
let id = 0;
const rpc = async (method, params) => (await (await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) })).json()).result;
const head = parseInt((await rpc("chain_getHeader", [])).number, 16);
const fin = parseInt((await rpc("chain_getHeader", [await rpc("chain_getFinalizedHead", [])])).number, 16);
console.log("best", head, "finalized", fin, "chain", await rpc("system_chain", []));
const N = 400;
// An extrinsic's kind, from its bytes (0x and hex): after its SCALE compact length, the format's version byte; for an
// unsigned (v4, 0x04) or bare (v5, 0x05) one, then its pallet's and its call's indexes.
const kindOf = (hex) => {
  const bytes = Buffer.from(hex.slice(2), "hex");
  const mode = bytes[0] & 3;
  const at = mode === 0 ? 1 : mode === 1 ? 2 : mode === 2 ? 4 : 1 + (bytes[0] >> 2) + 4;
  const version = bytes[at];
  if (version === 0x04 || version === 0x05) return `v${version} ${bytes[at + 1]}.${bytes[at + 2]}`;
  return version === 0x84 ? "signed" : version === 0x45 ? "general" : `version 0x${version?.toString(16)}`;
};
for (const from of [...given, head - 20000, head - 2000, head - N].filter((from) => from >= 0)) {
  const heights = Array.from({ length: N }, (_, i) => from + i).filter((h) => h <= head);
  if (heights.length === 0) {
    console.log(`from ${from}: above the best block ${head}`);
    continue;
  }
  const blocks = [];
  for (let i = 0; i < heights.length; i += 40) {
    blocks.push(...await Promise.all(heights.slice(i, i + 40).map(async (h) => (await rpc("chain_getBlock", [await rpc("chain_getBlockHash", [h])])).block.extrinsics.map(kindOf))));
  }
  const counts = blocks.map((kinds) => kinds.length);
  const n = counts.length;
  const pct = (part) => `${((100 * part) / n).toFixed(0)}%`;
  const byCount = [...new Set(counts)].sort((a, b) => a - b).map((c) => `${c} in ${counts.filter((x) => x === c).length}`);
  console.log(`from ${from}: ${n} consecutive blocks; extrinsics per block: ${byCount.join(", ")}`);
  const min = Math.min(...counts);
  if (counts.every((c) => c === min)) console.log(`  every block has ${min} extrinsics: the counts cannot tell whether none or every one carries a transaction`);
  else {
    let after = 0;
    for (let i = 1; i < n; i++) if (counts[i] > min && counts[i - 1] > min) after++;
    console.log(`  above the fewest (${min}): ${pct(counts.filter((c) => c > min).length)} of blocks, ${(counts.reduce((a, b) => a + b, 0) / n - min).toFixed(2)} per block, ${pct(after)} after another such block (a proxy for transactions: an inherent that only some blocks have counts too)`);
  }
  const kinds = [...new Set(blocks.flat())];
  console.log(`  by kind: ${kinds.map((kind, i) => `${kind} in ${pct(blocks.filter((b) => b.includes(kind)).length)}${i === 0 ? " of blocks" : ""} (${(blocks.reduce((a, b) => a + b.filter((k) => k === kind).length, 0) / n).toFixed(2)}${i === 0 ? " per block" : ""})`).join("; ")}`);
}
