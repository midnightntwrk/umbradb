// A worker thread with its own instance of a vendored ledger package (test/ledger/package-keys.ts): it loads the states
// the request lists, in order, from the store the request carries, and serializes each, so that the package reads every
// node of each state it does not hold already. Nothing else runs in this instance, so every node it holds it read from
// the store, and the package refuses a node whose content does not hash to the key it asked for (the module aborts).
import { parentPort, workerData } from "node:worker_threads";

const { packagePath, keys, nodes } = workerData;
const pkg = await import(packagePath);

const hex = (bytes) => Buffer.from(bytes).toString("hex");
const stored = new Map(nodes.map((node) => [hex(node.key), node]));
const requested = new Set();
let last = null;
const store = {
  get(key) {
    last = hex(key);
    requested.add(last);
    const node = stored.get(last);
    return node === undefined ? null : { data: node.data, children: node.children };
  },
};

let walked = 0;
try {
  for (const key of keys) {
    const state = pkg.loadState(key, store);
    state.serialize();
    state.free();
    walked += 1;
  }
  parentPort.postMessage({ walked, requested: [...requested], last });
} catch (error) {
  parentPort.postMessage({ walked, requested: [...requested], last, error: String(error?.message ?? error) });
}
