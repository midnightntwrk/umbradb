// A worker thread with fresh instances of the ledger adapters (test/ledger/adapter-worker-host.ts bundles this file
// with esbuild and runs it): nothing the test's own instances hold in memory is visible here, so a state must load
// from the nodes the request carries, and every result reaches the test by structured clone, as the ledger worker's
// results reach the main thread (task 12.1; LG-7, Q49).
import { parentPort, workerData } from "node:worker_threads";
import { loadLedgerPackage } from "../../../src/ledger/load.js";
import type { ApplyInput, LedgerPackage, StoredNode } from "../../../src/ledger/types.js";
import type { AdapterWorkerRequest } from "../adapter-worker-host.js";

const request = workerData as AdapterWorkerRequest;
const hex = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");

function storeOf(nodes: StoredNode[]): { get(key: Uint8Array): { data: Uint8Array; children: Uint8Array } | null } {
  const stored = new Map(nodes.map((node) => [hex(node.key), node]));
  return {
    get(key) {
      const node = stored.get(hex(key));
      return node === undefined ? null : { data: node.data, children: node.children };
    },
  };
}

function replay(adapter: LedgerPackage, blocks: ApplyInput[]): unknown {
  let state = adapter.emptyState();
  const parsed = [];
  const outputs = [];
  const roots = [];
  for (const block of blocks) {
    parsed.push(block.transactions.map((bytes, index) => adapter.parseTransaction(bytes, index)));
    const applied = adapter.apply(state, block);
    outputs.push(applied.output);
    roots.push(adapter.stateRoot(applied.state));
    state = applied.state;
  }
  return { parsed, outputs, roots, stateKey: adapter.stateKey(state) };
}

try {
  const adapter = await loadLedgerPackage(request.ledger, { networkId: request.networkId });
  let result: unknown;
  switch (request.op) {
    case "load": {
      const state = adapter.load(request.key, storeOf(request.nodes));
      result = { stateRoot: adapter.stateRoot(state), stateKey: adapter.stateKey(state), summary: adapter.stateSummary(state) };
      break;
    }
    case "convert": {
      const state = adapter.convertFromV8!(request.key, storeOf(request.nodes));
      result = { stateRoot: adapter.stateRoot(state), stateKey: adapter.stateKey(state) };
      break;
    }
    case "replay":
      result = replay(adapter, request.blocks);
      break;
  }
  parentPort!.postMessage({ result });
} catch (error) {
  parentPort!.postMessage({ error: error instanceof Error ? error.message : String(error) });
}
