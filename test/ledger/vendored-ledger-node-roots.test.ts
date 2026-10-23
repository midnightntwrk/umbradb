import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import { describe, expect, it } from "vitest";
import * as v8 from "../../vendor/ledger/v8/pkg/midnight_ledger_wasm_fs.js";
import * as v9 from "../../vendor/ledger/v9/pkg/midnight_ledger_wasm_v9_fs.js";
import { runInFreshInstance, type StoredNode } from "./fresh-instance.js";
import { V8_PACKAGE_PATH, V9_PACKAGE_PATH } from "./ledger-states.js";
import { free, hex, storedNodeKey } from "./node-format.js";

// Task 0.2 of `openspec/changes/core-arch` (design.md §5.1, specs/ledger LG-11, LG-15): the vendored packages' state root
// against the value the node itself reports. fixtures/genesis/ holds the genesis ledger states of mainnet and preview
// (ledger v8) and of a local undeployed dev chain (ledger v9), each as its node returned it in
// `system_properties.genesis_state`, with the node's `midnight_ledgerStateRoot` at block 0 (node-roots.json records
// where and when each value was read).

interface NodeRoot {
  file: string;
  ledger: "v8" | "v9";
  network: string;
  stateRoot: string;
  sha256: string;
}

const fixtures = new URL("./fixtures/genesis/", import.meta.url);
const { states } = JSON.parse(readFileSync(new URL("node-roots.json", fixtures), "utf8")) as { states: NodeRoot[] };

// What each package's instance flushed so far in this file: the store a caller would have written.
const stores = { v8: new Map<string, StoredNode>(), v9: new Map<string, StoredNode>() };

const packages = {
  v8: { api: v8, path: V8_PACKAGE_PATH, deserialize: (bytes: Uint8Array) => v8.LedgerState.deserialize(bytes) },
  v9: { api: v9, path: V9_PACKAGE_PATH, deserialize: (bytes: Uint8Array) => v9.LedgerState.deserialize(bytes) },
} as const;

describe("vendored ledger packages: the state root the node reports", () => {
  it("records a state root for each ledger version", () => {
    expect(new Set(states.map((s) => s.ledger))).toEqual(new Set(["v8", "v9"]));
  });

  for (const fixture of states) {
    it(`${fixture.ledger} on ${fixture.network}: stateRoot of the genesis state is the node's block-0 root, also after a reload`, { timeout: 120_000 }, async () => {
      const bytes = Uint8Array.from(readFileSync(new URL(fixture.file, fixtures)));
      expect(createHash("sha256").update(bytes).digest("hex")).toBe(fixture.sha256);
      const { api, path, deserialize } = packages[fixture.ledger];
      // The two packages declare structurally different classes; each `api` is only given states it deserialized.
      const pkg = api as typeof v9;
      const state = deserialize(bytes) as v9.LedgerState;

      pkg.flushNodes();
      expect(hex(pkg.stateRoot(state))).toBe(fixture.stateRoot);
      const key = pkg.stateKey(state);
      expect(`00${hex(key)}`).toBe(fixture.stateRoot);

      // The root node stateKey allocates is kept until the next flush, so the key is persisted before it.
      pkg.persistKey(key);
      const batch = pkg.flushNodes();
      const store = stores[fixture.ledger];
      for (const node of batch.inserts) {
        expect(hex(storedNodeKey(node.data, node.children))).toBe(hex(node.key));
        store.set(hex(node.key), node);
      }
      const loaded = await runInFreshInstance({ packagePath: path, op: "load", key, nodes: [...store.values()] });
      expect(loaded.error).toBeUndefined();
      expect(hex(loaded.stateRoot!)).toBe(fixture.stateRoot);
      expect(hex(loaded.serialized!)).toBe(hex(state.serialize()));
      free(state);
    });
  }
});
