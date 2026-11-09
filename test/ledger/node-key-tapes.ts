import { expect } from "vitest";
import { nodeKey, nodeKeys } from "../../src/ledger/node-key.js";
import type { LedgerName, StoredNode } from "../../src/ledger/types.js";
import type { AppliedState } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { committed, ingest } from "../backbone/ingest-harness.js";
import { cappedAt, devnetSettings, LEDGER_CORE } from "../backbone/ledger-restart.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { V8_PACKAGE_PATH, V9_PACKAGE_PATH, V9_RC3_PACKAGE_PATH } from "./ledger-states.js";
import { hex } from "./node-format.js";
import { byReference, walkInFreshInstance } from "./package-keys.js";

/**
 * `src/ledger/node-key.ts` on a recorded tape (`UMBRADB_TAPES`; the test skipped by name without its tape): every node
 * the ledger package writes from genesis to the tape's end, and every node embedded in those nodes, has the key the
 * package gives it. One test file per tape (`./node-key-tape-*.test.ts`), so that the three replays run side by side.
 *
 * The tape is replayed from genesis through the process on PGlite with the ledger's core modules (as the replays of
 * `test/backbone/ledger-state.test.ts` run it), its ledger worker's every flushed batch recorded. Then:
 *
 * - **every row the process writes**, each node of each batch, has the key the package flushed it under:
 *   `nodeKey(data, children)`; so do the rows of `core_ledger_state.nodes` at the tape's end, read back;
 * - **every node those rows embed** has the key the package gives it. A row's key, which the package gave, is SHA-256
 *   over its children's keys, so `nodeKey` gives every row the package's key only if it gives every node a row embeds,
 *   at any depth, the key the package gives it (short of a SHA-256 collision). And the package itself is asked: the rows
 *   go to a fresh instance of the package that wrote them with every embedded node moved out under the key `node-key.ts`
 *   gives it (`./package-keys.ts`), and it loads and serializes the state of each walked height, in order; it reads each
 *   node it does not hold from that store and refuses any node whose content does not hash to the key it asked for, so
 *   it accepts an embedded node only under its own key for it. A height's rows are nodes of its state (a flush takes the
 *   nodes the persisted state key reaches), so the walk reads every node embedded in a walked height's rows: every
 *   height of the devnet and preprod tapes, and every 10th height and the last of stagenet's ({@link WALK_EVERY});
 * - `nodeKeys`' embedded keys for the rows (what the contents hash takes into the node set) are the keys checked.
 *
 * On PGlite on this machine a replay took 294 s (preprod), 539 s (stagenet) and 10 s (devnet) (2026-11-03, the R21
 * measurement runs). Loading and serializing one state took about 130 ms on stagenet (1 MB serialized), 22 minutes for
 * its 10,001 states, hence its sample; preprod's 10,001 took about 60 s. The test logs how many nodes it checked
 * (shown with `--reporter=verbose --silent=false`).
 */

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

/** A replay of 10,001 heights and the checks after it, on a loaded machine. */
const REPLAY_MS = 3 * 3_600_000;

/** The tapes, and the walk's sample on each: every `n`th height and the last (see the module comment). */
const WALK_EVERY = { "stagenet-0-10000": 10n, "preprod-0-10000": 1n, "devnet-v8-v9-0-235": 1n } as const;

type NodeKeyTape = keyof typeof WALK_EVERY;

const PACKAGE_PATHS: Readonly<Record<Exclude<LedgerName, "v10">, string>> = {
  v8: V8_PACKAGE_PATH,
  "v9-rc3": V9_RC3_PACKAGE_PATH,
  v9: V9_PACKAGE_PATH,
};

/** What the replay's batches gave: the rows checked as they came, and the store and states the walk takes. */
class Written {
  rows = 0;
  embeddedOccurrences = 0;
  /** Rows whose key is not `nodeKey`'s, described. */
  readonly mismatches: string[] = [];
  /** Every row and every embedded node, each once, with its children by reference. */
  readonly store = new Map<string, StoredNode>();
  /** The keys `node-key.ts` gives the embedded nodes, through `byReference` and through `nodeKeys`. */
  readonly embedded = new Set<string>();
  readonly embeddedByNodeKeys = new Set<string>();
  /** Each height's state: the ledger that applied it and its key (a block applied again: the last). */
  readonly states = new Map<bigint, { readonly ledger: LedgerName; readonly key: Uint8Array }>();
  /** The keys of the nodes embedded in the rows of each walked height. */
  readonly embeddedAt = new Map<bigint, Set<string>>();

  constructor(readonly walked: (height: bigint) => boolean) {}

  add(applied: AppliedState): void {
    for (const node of applied.batch.inserts) {
      this.rows += 1;
      const keys = nodeKeys(node.data, node.children);
      if (hex(keys.key) !== hex(node.key)) this.mismatches.push(`${hex(node.key)} at ${applied.height}: nodeKey ${hex(keys.key)}`);
      for (const key of keys.embedded) this.embeddedByNodeKeys.add(hex(key));
    }
    const moved = byReference(applied.batch.inserts);
    for (const node of moved.nodes) this.store.set(hex(node.key), node);
    for (const key of moved.embedded) this.embedded.add(key);
    if (this.walked(applied.height)) {
      const at = this.embeddedAt.get(applied.height) ?? new Set<string>();
      for (const key of moved.embedded) at.add(key);
      this.embeddedAt.set(applied.height, at);
    }
    this.embeddedOccurrences += moved.occurrences;
    this.states.set(applied.height, { ledger: applied.ledger, key: applied.stateKey });
  }
}

/** `host`, every block it applies (block 0 included) given to `written` (the other calls passed through). */
function recording(host: LedgerHost, written: Written): LedgerHost {
  return new Proxy(host, {
    get(target, property) {
      if (property === "genesis") {
        const genesis: LedgerHost["genesis"] = async (input, read) => {
          const applied = await target.genesis(input, read);
          written.add(applied);
          return applied;
        };
        return genesis;
      }
      if (property === "apply") {
        const apply: LedgerHost["apply"] = async (input, read) => {
          const applied = await target.apply(input, read);
          written.add(applied);
          return applied;
        };
        return apply;
      }
      const value: unknown = Reflect.get(target, property, target);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

/** Replays `found` from genesis to its end and checks every node's key against the package's (see the module comment). */
async function checkTape(found: FoundTape, settings: Readonly<Record<string, unknown>>, every: bigint): Promise<void> {
  const to = BigInt(found.tape.to);
  const written = new Written((height) => height % every === 0n || height === to);
  await backend.start();
  try {
    const db = await backend.database();
    const process = await ingest(db, cappedAt(found.read().records, to), {
      start: 0n,
      stop: to,
      core: LEDGER_CORE,
      settings,
      ledgerWorker: () => recording(startLedgerWorker(), written),
    });
    try {
      await committed(process, to, REPLAY_MS);
      expect(process.handle.status()).toMatchObject({ cursor: to, reason: null });
    } finally {
      await process.close();
    }

    // Every row written has the key it was flushed under; so has every row stored at the end.
    expect(written.mismatches).toEqual([]);
    expect(written.states.size).toBe(Number(to) + 1);
    const stored = await db.query(
      "SELECT encode(node_key, 'hex') AS k, encode(data, 'hex') AS d, encode(children, 'hex') AS c FROM core_ledger_state.nodes",
    );
    expect(stored.length).toBeGreaterThan(0);
    const bytes = (text: unknown): Uint8Array => Uint8Array.from(Buffer.from(text as string, "hex"));
    expect(stored.filter((row) => hex(nodeKey(bytes(row.d), bytes(row.c))) !== row.k).map((row) => row.k)).toEqual([]);
    for (const row of stored) {
      for (const key of nodeKeys(bytes(row.d), bytes(row.c)).embedded) expect(written.embedded.has(hex(key))).toBe(true);
    }
  } finally {
    await backend.stop();
  }

  // The embedded keys nodeKeys gives (the node set's) are the ones the walk checks.
  expect(written.embedded.size).toBeGreaterThan(0);
  expect(written.embeddedByNodeKeys).toEqual(written.embedded);

  // The walked heights' states, in height order, each run of one ledger in a fresh instance of that ledger's package.
  const heights = [...written.states.keys()].filter((height) => written.walked(height)).sort((a, b) => (a < b ? -1 : a > b ? 1 : 0));
  expect(heights.length).toBe(Number(to / every) + (to % every === 0n ? 1 : 2));
  const runs: { ledger: LedgerName; keys: Uint8Array[] }[] = [];
  for (const height of heights) {
    const { ledger, key } = written.states.get(height) as { readonly ledger: LedgerName; readonly key: Uint8Array };
    if (runs.at(-1)?.ledger !== ledger) runs.push({ ledger, keys: [] });
    runs.at(-1)?.keys.push(key);
  }
  const nodes = [...written.store.values()];
  const requested = new Set<string>();
  for (const run of runs) {
    const packagePath = PACKAGE_PATHS[run.ledger as Exclude<LedgerName, "v10">];
    expect(packagePath, run.ledger).toBeDefined();
    const walk = await walkInFreshInstance({ packagePath, keys: run.keys, nodes });
    expect({ ledger: run.ledger, error: walk.error, last: walk.error === undefined ? null : walk.last }).toEqual({
      ledger: run.ledger,
      error: undefined,
      last: null,
    });
    expect(walk.walked).toBe(run.keys.length);
    for (const key of walk.requested) requested.add(key);
  }
  // Every node embedded in a walked height's rows was read, and accepted, under node-key.ts's key.
  const unread = [...written.embeddedAt].flatMap(([height, keys]) => [...keys].filter((key) => !requested.has(key)).map((key) => `${key} at ${height}`));
  expect(unread.length, `embedded nodes the package never read, e.g. ${unread.slice(0, 3).join(", ")}`).toBe(0);
  const confirmed = [...written.embedded].filter((key) => requested.has(key)).length;
  if (every === 1n) expect(confirmed).toBe(written.embedded.size);
  console.info(
    `R29 node-key on ${found.tape.name}: ${written.rows} rows written over ${written.states.size} heights, each with ` +
      `nodeKey's key; ${written.embeddedOccurrences} embedded nodes in them, ${written.embedded.size} distinct; ` +
      `${runs.map((run) => `${run.keys.length} states walked with ${run.ledger}`).join(", ")}: ${requested.size} nodes ` +
      `read by the package, ${confirmed} of the distinct embedded nodes among them`,
  );
}

/** Registers the test of tape `name` (see the module comment). */
export function nodeKeyTapeTest(name: NodeKeyTape): void {
  const devnet = name === "devnet-v8-v9-0-235";
  tapeTest(
    name,
    `on ${name}, every row written from genesis${devnet ? " across the v8 → v9 upgrade" : ""}, and every node embedded in one, has the key the package gives it`,
    (found) => checkTape(found, devnet ? devnetSettings(found) : { network: found.tape.network }, WALK_EVERY[name]),
    { timeoutMs: REPLAY_MS + 1_800_000 },
  );
}
