// Share of blocks with transactions near given heights, from the node: a block's extrinsics above the minimum of its
// range. 400 consecutive blocks from each height given, and from 20,000, 2,000 and 400 below the head.
//   UMBRADB_LOCAL_NODE=ws://<host>:9944 node txshare.mjs [<height> ...]
const node = process.env.UMBRADB_LOCAL_NODE;
if (!node) throw new Error("set UMBRADB_LOCAL_NODE to the node's WebSocket address");
const url = node.replace(/^ws(s?):\/\//, "http$1://");
const given = process.argv.slice(2).map(Number);
let id = 0;
const rpc = async (method, params) => (await (await fetch(url, { method: "POST", headers: { "content-type": "application/json" }, body: JSON.stringify({ jsonrpc: "2.0", id: ++id, method, params }) })).json()).result;
const head = parseInt((await rpc("chain_getHeader", [])).number, 16);
const fin = parseInt((await rpc("chain_getHeader", [await rpc("chain_getFinalizedHead", [])])).number, 16);
console.log("best", head, "finalized", fin, "chain", await rpc("system_chain", []));
const N = 400;
for (const from of [...given, head - 20000, head - 2000, head - N]) {
  const counts = [];
  const heights = Array.from({ length: N }, (_, i) => from + i).filter((h) => h <= head);
  for (let i = 0; i < heights.length; i += 40) {
    counts.push(...await Promise.all(heights.slice(i, i + 40).map(async (h) => (await rpc("chain_getBlock", [await rpc("chain_getBlockHash", [h])])).block.extrinsics.length)));
  }
  const min = Math.min(...counts);
  const withTx = counts.filter((c) => c > min).length;
  let runs = 0, both = 0;
  for (let i = 1; i < counts.length; i++) if (counts[i] > min && counts[i - 1] > min) both++;
  console.log(`from ${from}: ${counts.length} consecutive blocks, minimum ${min} extrinsics, ${((100 * withTx) / counts.length).toFixed(0)}% with transactions, ${((100 * both) / counts.length).toFixed(0)}% follow another block with transactions, mean ${(counts.reduce((a, b) => a + b, 0) / counts.length - min).toFixed(2)} transactions per block`);
}
