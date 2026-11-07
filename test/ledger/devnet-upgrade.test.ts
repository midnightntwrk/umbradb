import { describe, expect } from "vitest";
import type { ApplyInput, LedgerName } from "../../src/ledger/types.js";
import type { LedgerTable } from "../../src/ledger/version-table.js";
import { selectLedgerVersion } from "../../src/ledger/version-table.js";
import type { ApplyBlock } from "../../src/ledger/worker/engine.js";
import { type LedgerHost, startLedgerWorker } from "../../src/ledger/worker/host.js";
import { hashAnswer, headerAnswer } from "../../src/node/decode.js";
import { committed, halted, ingest } from "../backbone/ingest-harness.js";
import { cappedAt, LEDGER_CORE } from "../backbone/ledger-restart.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { type FoundTape, tapeTest } from "../tape/real/real-tapes.js";
import { RAW, referenceReplay } from "./adapter-fixtures.js";
import { runInFreshInstance, type StoredNode } from "./fresh-instance.js";
import { V8_PACKAGE_PATH, V9_PACKAGE_PATH } from "./ledger-states.js";
import { TapeAnswers } from "./version-checks.js";

/**
 * The recorded devnet upgrade tape (`devnet-v8-v9-0-235`: runtime 1_000_000 on ledger v8 until U = 102 enacts
 * 2_001_000 on ledger v9; F = 103) replayed through the process on PGlite with the ledger's core modules, for two
 * checks that need a real upgrade; each test is skipped by name when the tape is absent.
 *
 * - **The conversion's root matches the node's at F**: the v8 state at U as the process
 *   stored it, loaded in a fresh instance of the vendored v8 package, has the node's root at U; the vendored v9
 *   package's `convertFromV8` run on it in a fresh instance (twice: the same state), with F applied to the result by
 *   the reference replay (`./adapter-fixtures.ts`, written from the official indexer's algorithm, not the adapters),
 *   gives the node's root at F (`midnight_ledgerStateRoot`), as the node converts at its upgrade and then executes F.
 *   F's inputs are the ones the process gave its ledger worker; neither the conversion nor F's application here goes
 *   through the worker's engine or the adapters. The node reports no root between the conversion and F, so the
 *   converted state alone is compared with none: its root, and the root after an F without its transactions, are
 *   checked to differ from the node's at F, so that only the conversion followed by F's transactions matches.
 * - **A configured table on a real devnet**, a network with no built-in table: the configuration's table "every
 *   `spec_version` → v8" selects v8 for every block of the devnet, and the process parses and applies every block its
 *   v8 runtime built (0 to U) with v8, each root the node's. At F, the first block runtime 2.1 built on ledger v9, the
 *   v8 parse of its v9 transactions fails and the process halts there (`callback-error` at `core-block-parsed`'s
 *   `on-parse`): the configured table, not the chain, decides the ledger of every block. [A95 CI, LG-3]
 */

const TAPE = "devnet-v8-v9-0-235";
/** A replay of the devnet's 236 blocks on a loaded machine, with the fresh-instance runs. */
const REPLAY_MS = 900_000;

const backend = PROCESS_BACKENDS.find((candidate) => candidate.kind === "pglite") as ProcessBackend;

interface Side {
  readonly height: number;
  readonly hash: string;
  readonly specVersion: number;
}

/** The devnet's U and F as the tape's manifest records them. */
function boundaryOf(found: FoundTape): { readonly u: Side; readonly f: Side } {
  const boundary = (found.tape.notes as { readonly boundaries: readonly { readonly u: Side; readonly f: Side }[] }).boundaries[0];
  expect(boundary).toMatchObject({ u: { height: 102, specVersion: 1_000_000 }, f: { height: 103, specVersion: 2_001_000 } });
  return boundary as { readonly u: Side; readonly f: Side };
}

/** The node's root at block `height` (`midnight_ledgerStateRoot` at its hash), as hex without `0x`. */
function nodeRootAt(answers: TapeAnswers, height: number): string {
  const root = answers.answer("midnight_ledgerStateRoot", answers.hashAt(height));
  if (!Array.isArray(root)) throw new Error(`the tape holds no ledger state root for ${height}`);
  return Buffer.from(root as number[]).toString("hex");
}

const hexOf = (bytes: Uint8Array): string => Buffer.from(bytes).toString("hex");
const bytesOf = (text: string): Uint8Array => Uint8Array.from(Buffer.from(text, "hex"));

/** What the process asked its ledger worker: each block's parse (with the ledger and the bytes) and each apply. */
interface Asked {
  readonly parses: { readonly height: bigint; readonly ledger: LedgerName; readonly transactions: Uint8Array[] }[];
  readonly applies: ApplyBlock[];
}

/** `host`, recording into `asked` a copy of every parse and apply it is asked for (the rest passed through). */
function recording(host: LedgerHost, asked: Asked): LedgerHost {
  return new Proxy(host, {
    get(target, property) {
      if (property === "parse") {
        const parse: LedgerHost["parse"] = (ledger, block, transactions) => {
          asked.parses.push({ height: block.height, ledger, transactions: transactions.map((bytes) => Uint8Array.from(bytes)) });
          return target.parse(ledger, block, transactions);
        };
        return parse;
      }
      if (property === "apply") {
        const apply: LedgerHost["apply"] = (input, read) => {
          asked.applies.push(structuredClone(input));
          return target.apply(input, read);
        };
        return apply;
      }
      const value: unknown = Reflect.get(target, property, target);
      return typeof value === "function" ? (value as (...args: unknown[]) => unknown).bind(target) : value;
    },
  });
}

/**
 * Replays the devnet from genesis on a new PGlite database with the ledger's core modules and `settings` (a custom
 * network: the tape's genesis, the table given), its finalized head at `to`, until it commits `to` or halts; then runs
 * `after` on the database. The backend is stopped (its directory removed) after.
 */
async function replay(
  found: FoundTape,
  to: number,
  settings: Readonly<Record<string, unknown>>,
  asked: Asked,
  after: (db: ProcessDatabase, status: unknown) => Promise<void>,
  expectHalt = false,
): Promise<void> {
  await backend.start();
  try {
    const db = await backend.database();
    const process = await ingest(db, cappedAt(found.read().records, BigInt(to)), {
      start: 0n,
      stop: BigInt(to),
      core: LEDGER_CORE,
      settings: {
        network: "custom",
        genesisHash: (found.tape.notes as { readonly genesis: { readonly hash: string } }).genesis.hash,
        ...settings,
      },
      ledgerWorker: () => recording(startLedgerWorker(), asked),
    });
    let status: unknown;
    try {
      if (expectHalt) await halted(process);
      else await committed(process, BigInt(to), REPLAY_MS);
      status = process.handle.status();
    } finally {
      await process.close();
    }
    await after(db, status);
  } finally {
    await backend.stop();
  }
}

/** Every stored state root (height → hex) of `db`. */
async function storedRoots(db: ProcessDatabase): Promise<Map<number, string>> {
  const rows = await db.query("SELECT height::int AS h, encode(state_root, 'hex') AS root FROM core_ledger_state.states ORDER BY height");
  return new Map(rows.map((row) => [row.h as number, row.root as string]));
}

describe("task 0.3's devnet upgrade tape through the process (task 0.2's conversion, A95; skipped by name without the tape)", () => {
  tapeTest(
    TAPE,
    "0.2: the vendored v9 package's conversion of the v8 state at U (102), with F (103) applied to it, gives the node's root at F; the v8 state at U has the node's root",
    async (found) => {
      const { u, f } = boundaryOf(found);
      const answers = new TapeAnswers(found.read().records);
      const asked: Asked = { parses: [], applies: [] };
      let keyAtU = "";
      let nodes: StoredNode[] = [];
      let storedAtF = "";
      await replay(
        found,
        f.height,
        {
          // The devnet's own table, as a custom network sets it: runtime 1.0 → v8, 2.x → v9.
          ledgerTable: {
            rows: [
              { specVersionMin: 1_000_000, specVersionMax: 1_999_999, ledger: "v8" },
              { specVersionMin: 2_000_000, specVersionMax: 2_999_999, ledger: "v9" },
            ],
          },
          // The state at U stays in the window at cursor F, so the sweep keeps its nodes. [LG-12]
          retainStates: 1,
        },
        asked,
        async (db, status) => {
          expect(status).toMatchObject({ cursor: BigInt(f.height), reason: null });
          const rows = await db.query(
            `SELECT s.height::int AS h, encode(s.state_key, 'hex') AS key, encode(s.state_root, 'hex') AS root,
                    b.ledger_version AS ledger
               FROM core_ledger_state.states s JOIN core_block_commit.blocks b USING (height)
              WHERE s.height IN (${u.height}, ${f.height}) ORDER BY s.height`,
          );
          expect(rows.map((row) => [row.h, row.ledger])).toEqual([
            [u.height, "v8"],
            [f.height, "v9"],
          ]);
          keyAtU = rows[0]!.key as string;
          storedAtF = rows[1]!.root as string;
          const stored = await db.query(
            "SELECT encode(node_key, 'hex') AS k, encode(data, 'hex') AS d, encode(children, 'hex') AS c FROM core_ledger_state.nodes",
          );
          nodes = stored.map((row) => ({ key: bytesOf(row.k as string), data: bytesOf(row.d as string), children: bytesOf(row.c as string) }));
        },
      );
      const rootAtU = nodeRootAt(answers, u.height);
      const rootAtF = nodeRootAt(answers, f.height);
      expect(storedAtF).toBe(rootAtF);

      // The v8 state at U, from the stored nodes alone, in a fresh v8 instance: the node's root at U.
      const v8AtU = await runInFreshInstance({ packagePath: V8_PACKAGE_PATH, op: "load", key: bytesOf(keyAtU), nodes });
      expect(v8AtU.error).toBeUndefined();
      expect(hexOf(v8AtU.stateRoot as Uint8Array)).toBe(rootAtU);

      // The conversion in a fresh v9 instance, twice: the same converted state.
      const converted = await runInFreshInstance({ packagePath: V9_PACKAGE_PATH, op: "convert", key: bytesOf(keyAtU), nodes });
      expect(converted.error).toBeUndefined();
      const again = await runInFreshInstance({ packagePath: V9_PACKAGE_PATH, op: "convert", key: bytesOf(keyAtU), nodes });
      expect([hexOf(again.stateRoot as Uint8Array), hexOf(again.stateKey as Uint8Array), hexOf(again.serialized as Uint8Array)]).toEqual([
        hexOf(converted.stateRoot as Uint8Array),
        hexOf(converted.stateKey as Uint8Array),
        hexOf(converted.serialized as Uint8Array),
      ]);

      // F as the process gave it to its worker: v9, the node's three DUST reapply system transactions.
      const parsed = asked.parses.filter((parse) => parse.height === BigInt(f.height));
      expect(parsed.map((parse) => [parse.ledger, parse.transactions.length])).toEqual([["v9", 3]]);
      const applied = asked.applies.filter((apply) => apply.height === BigInt(f.height));
      expect(applied.map((apply) => apply.ledger)).toEqual(["v9"]);
      const block = applied[0]!;
      const input: ApplyInput = {
        transactions: parsed[0]!.transactions,
        ...(block.outcomes === undefined ? {} : { outcomes: block.outcomes }),
        height: block.height,
        hash: block.hash,
        parentHash: block.parentHash,
        timestampMs: block.timestampMs,
        parentTimestampMs: block.parentTimestampMs,
        firstRegularAtParentTime: block.firstRegularAtParentTime,
      };
      expect(hexOf(input.hash)).toBe(f.hash.slice(2));
      expect(hexOf(input.parentHash)).toBe(u.hash.slice(2));

      // F applied to the converted state by the reference replay: the node's root at F.
      const convertedState = () => RAW.v9.LedgerState.deserialize(converted.serialized as Uint8Array);
      const reference = referenceReplay(RAW.v9, convertedState(), input);
      expect(reference.types).toEqual(["system", "system", "system"]);
      expect(hexOf(RAW.v9.stateRoot(reference.state))).toBe(rootAtF);

      // Neither the converted state alone nor an F without its transactions has the node's root at F.
      expect(hexOf(converted.stateRoot as Uint8Array)).not.toBe(rootAtF);
      const { outcomes: _outcomes, ...withoutOutcomes } = input;
      const empty = referenceReplay(RAW.v9, convertedState(), { ...withoutOutcomes, transactions: [] });
      expect(hexOf(RAW.v9.stateRoot(empty.state))).not.toBe(rootAtF);
    },
    { timeoutMs: REPLAY_MS },
  );

  tapeTest(
    TAPE,
    'A95 [CI]: a configured table "every spec_version → v8" parses and applies every block of the devnet\'s v8 runtime (0–102) with v8, each root the node\'s, and halts at F (103), whose v9 transactions v8 cannot parse',
    async (found) => {
      const { u, f } = boundaryOf(found);
      const answers = new TapeAnswers(found.read().records);
      const everyV8 = { specVersionMin: 0, specVersionMax: 4_294_967_295, ledger: "v8" as const };
      // The selection: v8 for every block of the devnet, runtime 1.0's and 2.1's alike, since the rows alone choose.
      // [LG-2]
      const table: LedgerTable = { rows: [everyV8], pins: [] };
      const versions = new Map<number, number>();
      for (let h = 0; h <= found.tape.to; h++) {
        const text = answers.hashAt(h);
        const header = headerAnswer("chain_getHeader", "result", answers.answer("chain_getHeader", text));
        const selection = selectLedgerVersion(table, { height: header.number, hash: hashAnswer("chain_getBlockHash", "result", text), digest: header.digest });
        expect(selection.ledger, `block ${h}`).toBe("v8");
        versions.set(h, selection.specVersion);
      }
      expect([...new Set(versions.values())]).toEqual([u.specVersion, f.specVersion]);

      const asked: Asked = { parses: [], applies: [] };
      await replay(
        found,
        found.tape.to,
        { ledgerTable: { rows: [everyV8] } },
        asked,
        async (db, status) => {
          expect(status).toMatchObject({
            state: "halted",
            cursor: BigInt(u.height),
            reason: { code: "callback-error", height: BigInt(f.height), module: "core-block-parsed", point: "on-parse" },
          });
          const blocks = await db.query(
            "SELECT count(*)::int AS n, min(height)::int AS low, max(height)::int AS high, array_agg(DISTINCT ledger_version) AS ledgers, array_agg(DISTINCT spec_version) AS versions FROM core_block_commit.blocks",
          );
          expect(blocks).toEqual([{ n: u.height + 1, low: 0, high: u.height, ledgers: ["v8"], versions: [u.specVersion] }]);
          // Every block's transactions parsed with v8 (and only with v8, F's included), as many as were stored.
          const [{ n: stored } = { n: -1 }] = await db.query("SELECT count(*)::int AS n FROM core_block_parsed.transactions");
          const parsedUpToU = asked.parses.filter((parse) => parse.height <= BigInt(u.height));
          expect(new Set(asked.parses.map((parse) => parse.ledger))).toEqual(new Set(["v8"]));
          expect(parsedUpToU.reduce((sum, parse) => sum + parse.transactions.length, 0)).toBe(stored);
          expect(stored as number).toBeGreaterThan(0);
          expect(asked.parses.some((parse) => parse.height === BigInt(f.height))).toBe(true);
          // Every state from genesis to U applied with v8 is the node's.
          const roots = await storedRoots(db);
          expect(roots.size).toBe(u.height + 1);
          const differing = [...roots].filter(([h, root]) => root !== nodeRootAt(answers, h)).map(([h]) => h);
          expect(differing).toEqual([]);
        },
        true,
      );
    },
    { timeoutMs: REPLAY_MS },
  );
});
