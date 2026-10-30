// A worker thread with its own instance of a vendored ledger package (test/ledger/fresh-instance.ts): nothing the
// test's main instance holds in memory is visible here, so every node must come from the store the request carries.
import { parentPort, workerData } from "node:worker_threads";

const { packagePath, op, key, nodes, tamper } = workerData;
const pkg = await import(packagePath);

const hex = (bytes) => Buffer.from(bytes).toString("hex");
const stored = new Map(nodes.map((node) => [hex(node.key), node]));
const requested = [];
const store = {
  get(requestedKey) {
    const k = hex(requestedKey);
    requested.push(k);
    const node = stored.get(k);
    if (!node) return null;
    if (tamper === k) {
      const data = Uint8Array.from(node.data);
      data[0] ^= 0xff;
      return { data, children: node.children };
    }
    return { data: node.data, children: node.children };
  },
};

try {
  if (op === "load") {
    const state = pkg.loadState(key, store);
    const stateRoot = pkg.stateRoot(state);
    const reads = requested.length;
    parentPort.postMessage({ stateRoot, stateKey: pkg.stateKey(state), readsBeforeSerialize: reads, serialized: state.serialize(), requested });
  } else if (op === "convert") {
    const state = pkg.convertFromV8(key, store);
    const stateKey = pkg.stateKey(state);
    pkg.persistKey(stateKey);
    const batch = pkg.flushNodes();
    parentPort.postMessage({
      stateRoot: pkg.stateRoot(state),
      stateKey,
      batch,
      serialized: state.serialize(),
      requested,
    });
  } else {
    throw new Error(`unknown op ${op}`);
  }
} catch (error) {
  parentPort.postMessage({ error: String(error?.message ?? error), errorName: error?.name ?? null, requested });
}
