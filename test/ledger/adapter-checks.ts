import { createHash } from "node:crypto";
import { readFileSync } from "node:fs";
import fc from "fast-check";
import { expect } from "vitest";
import { LEDGER_RELEASES } from "../../src/ledger/releases.js";
import type { LedgerPackage, StoredNode } from "../../src/ledger/types.js";
import {
  block,
  callTransaction,
  cellValue,
  contractFixture,
  hex,
  logProgram,
  NETWORK_ID,
  RAW,
  referenceReplay,
  type Ledger,
  wrappedLog,
} from "./adapter-fixtures.js";
import type { AdapterWorkerHost, LoadedState } from "./adapter-worker-host.js";

// Task 12.1 of `openspec/changes/core-arch`: A98's clauses that the committed negative controls
// (`adapter.negative-control.test.ts`) run against wrong adapters and the adapter test suite (`adapter-suite.ts`) runs
// against the real ones. Each check fails with an assertion error.

/** The fast-check seed of the v8 `decodeLogItem` property (Q54), reported in its test's title. */
export const DECODE_SEED = 20261026;
const DECODE_RUNS = 300;

interface Upstream {
  versionName: string;
  package: { name: string; version: string };
}

const vendored = (ledger: Ledger, file: string): URL =>
  new URL(`../../vendor/ledger/${ledger}/${file}`, import.meta.url);

/**
 * A98: `versionName` and `rawPackages()` return the recorded release and packages — the release name and package name
 * `vendor/ledger/<version>/upstream.json` records, the name and version the package's own `package.json` carries, and,
 * under that name, the very module loaded from `vendor/ledger/<version>/pkg/` (`raw`).
 */
export function expectRecordedRelease(adapter: LedgerPackage, ledger: Ledger, raw: object): void {
  const upstream = JSON.parse(readFileSync(vendored(ledger, "upstream.json"), "utf8")) as Upstream;
  const manifest = JSON.parse(readFileSync(vendored(ledger, "pkg/package.json"), "utf8")) as {
    name: string;
    version: string;
    upstream: { versionName: string };
  };
  expect(adapter.ledger).toBe(ledger);
  expect(adapter.versionName).toBe(upstream.versionName);
  expect(manifest.upstream.versionName).toBe(upstream.versionName);
  const packages = adapter.rawPackages();
  expect(Object.keys(packages)).toEqual([upstream.package.name]);
  expect(manifest.name).toBe(upstream.package.name);
  expect(packages[upstream.package.name]).toBe(raw);
  expect(Object.isFrozen(packages)).toBe(true);
  expect(LEDGER_RELEASES[ledger]).toEqual({
    versionName: upstream.versionName,
    // The package's identity (task 12.2): the SHA-256 of its manifest, which lists every file of the package.
    packages: [
      {
        name: manifest.name,
        version: manifest.version,
        sha256: `0x${createHash("sha256").update(readFileSync(vendored(ledger, "SHA256SUMS"))).digest("hex")}`,
      },
    ],
  });
  expect(manifest.version).toBe(upstream.package.version);
}

/**
 * A98 (owner decision Q55): a state under the ledger's 1,024-byte embedding limit — a blank one, whose state root is
 * the state itself, embedded, not a key — reloads in a fresh instance from the nodes a flush gave, by its `stateKey`.
 * `store` holds every node this test file's adapter flushed so far, as the database would.
 */
export async function expectSmallStateReloadsByKey(
  adapter: LedgerPackage,
  host: AdapterWorkerHost,
  store: Map<string, StoredNode>,
): Promise<void> {
  const state = adapter.emptyState();
  const root = adapter.stateRoot(state);
  expect(root[0], "a blank state's root embeds the state (ArenaKey::Direct)").toBe(1);
  const key = adapter.stateKey(state);
  expect(key).toHaveLength(32);
  adapter.persist(key);
  const batch = adapter.flush();
  for (const node of batch.inserts) store.set(hex(node.key), node);
  expect(batch.rootCounts.map((count) => [hex(count.key), count.delta])).toEqual([[hex(key), 1]]);
  const loaded = await host.run<LoadedState>({
    op: "load",
    ledger: adapter.ledger as Ledger,
    networkId: NETWORK_ID,
    key,
    nodes: [...store.values()],
  });
  expect(loaded.error).toBeUndefined();
  expect(hex(loaded.result!.stateRoot)).toBe(hex(root));
  expect(hex(loaded.result!.stateKey)).toBe(hex(key));
}

/** Serialized state values a `log` operation could take: what a v9 `decodeLogItem` decodes, and more. */
export function logValueInputs(): Uint8Array[] {
  const v9 = RAW.v9;
  const data = cellValue(Uint8Array.of(1, 2, 3));
  return [
    wrappedLog(1, 5, data),
    wrappedLog(7, 10, data),
    data,
    { tag: "null" as const },
    { tag: "array" as const, content: [] },
  ].map((encoded) => v9.serializeStateValue(v9.StateValue.decode(encoded)));
}

/**
 * A98 (owner decision Q54): the v8 adapter's `decodeLogItem` returns null for every input — arbitrary bytes (a
 * fast-check property with a pinned seed) and the serialized log values a v9 ledger decodes — and its `apply` returns
 * no `logs` for a block whose contract call runs the VM's `log` twice, though the v8 ledger itself emits a
 * `ContractLog` event for each (the reference replay of the same block with the package's published API, the oracle).
 */
export async function expectNoV8Logs(adapter: LedgerPackage): Promise<void> {
  const property = fc.check(
    fc.property(fc.uint8Array({ maxLength: 1_200 }), (bytes) => adapter.decodeLogItem(bytes) === null),
    { seed: DECODE_SEED, numRuns: DECODE_RUNS },
  );
  expect(property.failed, `decodeLogItem returned a log for ${String(property.counterexample)}`).toBe(false);
  for (const value of logValueInputs()) expect(adapter.decodeLogItem(value)).toBeNull();

  const contract = await contractFixture(RAW.v8);
  const logged = [cellValue(Uint8Array.of(9)), wrappedLog(1, 5, cellValue(Uint8Array.of(4)))];
  const call = callTransaction(RAW.v8, contract, logProgram(logged));
  const input = block([contract.deploy, call]);
  const reference = referenceReplay(RAW.v8, RAW.v8.LedgerState.blank(NETWORK_ID), input);
  expect(reference.events).toEqual([["ContractDeploy"], ["ContractLog", "ContractLog"]]);
  const { output } = adapter.apply(adapter.emptyState(), input);
  expect(output.results.map((result) => result.outcome)).toEqual(["success", "success"]);
  expect(output.logs).toEqual([]);
  expect(output.events.map((event) => [event.transaction, event.kind])).toEqual([[0, "contract-deploy"]]);
}
