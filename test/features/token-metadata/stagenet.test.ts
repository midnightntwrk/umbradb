import { readFileSync } from "node:fs";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { candidatesOf } from "../../../src/features/token-metadata/apply.ts";
import { markJson, toAsciiJson } from "../../../src/features/token-metadata/api.ts";
import { servedGroups, servedIdentities } from "../../../src/features/token-metadata/read.ts";
import { COMMON_KEY_HEX, type IdentityState, isCommonKey, parseStandards } from "../../../src/features/token-metadata/state.ts";
import { TOKEN_METADATA } from "../../../src/features/token-metadata/token-metadata.ts";
import { defineModule, type ModuleDeclaration } from "../../../src/modules/declaration.js";
import { FAST_CORE } from "../../backbone/contract-data-checks.js";
import { committed, type Ingest, ingest } from "../../backbone/ingest-harness.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../../runner/process-backends.js";
import { findTape } from "../../tape/real/real-tapes.js";
import type { TapeRecord } from "../../../tools/tape/index.js";

/**
 * The stagenet tapes through `token-metadata` with `core-contract-logs-fast`, on PostgreSQL 18 and PGlite. [task 5.1]
 *
 * **M20** — every case of the proof of concept's fixtures as its `mip0018-cases.test.ts` compares it, with
 * `cases-umbradb/`'s amendments: each case at its own last block equals its expectation while every later case is
 * still absent (C09 equals C01; U1 at its last block); C06 after each step; the v1-named events of IDX and U1 equal
 * the reference index's (`index-summary.json`, with its differences); IDX's identity entries; the mark of every case
 * identity equals the mark rule applied to the expectations and the reference's rejections; no unresolved site.
 * The reference's mints, colors, deploys and activity belong to the activity change and are not compared here; the
 * `ignored` counts are those of the contract's other `Misc` logs, which the module does not store (TM-2), read from
 * `contract_logs.logs`.
 *
 * **M14** — the proof of concept's recorded answers (`test/fixtures/mip0018-answers/`) requested at the end of each
 * range: each body equals the recorded one byte for byte (both written by the same ASCII JSON writer) once TM-13's
 * differences are applied to the recorded one (see {@link expectedOf}).
 *
 * **S.** The tapes start mid-chain, at 714,485 and 715,402. Startup asks for the genesis block's hash and header, which
 * a mid-chain tape does not hold, so they are put before its records (`fixtures/stagenet-genesis.json`, from the
 * `stagenet-0-10000` tape); and the first block fetched needs its parent's runtime version, so each run starts one
 * block after the tape's first. Neither first block holds a MIP-0018 event (the reference
 * index's first events are at 714,501 and 715,433), so the state is the same; the answers' start height (`/v1/status`
 * `startHeight`, `/v1/lookup` `indexedRange.from`) is masked for it.
 */

const NET = "stagenet";
const FIXTURES = new URL("../../fixtures/mip0018/", import.meta.url);
const ANSWERS = new URL("../../fixtures/mip0018-answers/", import.meta.url);
const json = <T>(url: URL): T => JSON.parse(readFileSync(url, "utf8")) as T;
const norm = (h: string): string => h.replace(/^0x/, "").toLowerCase();
const hexOf = (b: Uint8Array): string => Buffer.from(b).toString("hex");
const dec = new TextDecoder();
const canon = (v: unknown): string =>
  JSON.stringify(v, (_k, x: unknown) =>
    x !== null && typeof x === "object" && !Array.isArray(x)
      ? Object.fromEntries(Object.keys(x).sort().map((k) => [k, (x as Record<string, unknown>)[k]]))
      : x,
  );

// ── The fixtures ────────────────────────────────────────────────────────────────────────────────────────────────

interface CaseIndex {
  cases: Record<string, { contract?: string; heights: number[]; steps: { id: string; height?: number; txHash?: string; expectedAfter?: string }[] }>;
}
interface ExpectedField { valType: number; value_hex: string; usable?: boolean }
interface ExpectedIdentity { domainSep: string; kind: number; colored: boolean; common: Record<string, unknown>; fields?: Record<string, ExpectedField> }
interface ExpectedState {
  identities: ExpectedIdentity[];
  groups: { symbol: string; members: { domainSep: string; kind: number }[] }[];
  counts?: Record<string, number>;
}
interface RefEvent {
  block: { height: number; hash: string };
  txHash: string;
  txIndex: number;
  eventIndex: number;
  entryPoint: string;
  result: string;
  reason?: string;
  domainSep?: string;
  kind?: number;
}
interface IndexSummary { events: Record<string, RefEvent[]> }
interface Answer { path: string; status: number; headers: Record<string, string>; body: string }

/** Stagenet's genesis hash and header, which startup asks for and a mid-chain tape does not hold (see the fixture). */
const GENESIS = json<{ records: TapeRecord[] }>(new URL("./fixtures/stagenet-genesis.json", import.meta.url)).records;

const caseIndex = json<CaseIndex>(new URL("case-index.json", FIXTURES));
const contractOf = (c: string): string => caseIndex.cases[c]!.contract!;
const lastOf = (c: string): number => Math.max(...caseIndex.cases[c]!.heights);
const firstOf = (c: string): number => Math.min(...caseIndex.cases[c]!.heights);

/** A case expectation: UmbraDB's own file (`cases-umbradb/`) when it has one, else the reference copy. */
function expectation<T>(path: string): T {
  try {
    return json<T>(new URL(`cases-umbradb/${path}`, FIXTURES));
  } catch {
    return json<T>(new URL(`cases/${path}`, FIXTURES));
  }
}

/** A reference index summary with UmbraDB's differences applied (the proof of concept's `readIndexSummary`). */
function indexSummary(range: "IDX" | "U1"): IndexSummary {
  const summary = json<IndexSummary>(new URL(`cases/${range}/index-summary.json`, FIXTURES));
  let diff: { events: { contractAddress: string; height: number; txIndex: number; eventIndex: number; result: string; reason: string }[] };
  try {
    diff = json(new URL(`cases-umbradb/${range}/index-summary-differences.json`, FIXTURES));
  } catch {
    return summary;
  }
  for (const d of diff.events) {
    const e = (summary.events[d.contractAddress] ?? []).find((x) => x.block.height === d.height && x.txIndex === d.txIndex && x.eventIndex === d.eventIndex)!;
    e.result = d.result;
    e.reason = d.reason;
    if (d.result !== "accept") {
      delete e.domainSep;
      delete e.kind;
    }
  }
  return summary;
}

// ── A run over a tape, with snapshots of the served state ───────────────────────────────────────────────────────

/** A probe reading the served identities inside the block transactions of `heights`, after `token-metadata`. */
function probe(heights: ReadonlySet<number>, seen: Map<number, IdentityState[]>): ModuleDeclaration {
  return defineModule({
    id: "token-metadata-stagenet-probe",
    version: "1.0.0",
    side: "public",
    requires: ["token-metadata-state"],
    provides: [{ name: "token-metadata-stagenet-probe-rows", lifetimes: ["table"], table: { schema: "token_metadata_stagenet_probe", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({}),
    migrations: [{ id: "001", sql: "CREATE TABLE token_metadata_stagenet_probe.rows (height bigint PRIMARY KEY)" }],
    points: {
      async "on-db-write"(_p, b, w) {
        if (heights.has(Number(b.height))) seen.set(Number(b.height), await servedIdentities(w, NET));
      },
    },
  }) as ModuleDeclaration;
}

interface Replay {
  readonly run: Ingest;
  readonly db: ProcessDatabase;
  readonly origin: string;
  readonly states: Map<number, IdentityState[]>;
}

/** Replays `tape` from its first block + 1 to its last with the module and the probe, its API on a free port. */
async function replay(backend: ProcessBackend, tape: string, from: number, to: number, heights: readonly number[]): Promise<Replay> {
  const found = findTape(tape);
  if (!found.found) throw new Error(found.reason);
  const db = await backend.database();
  const states = new Map<number, IdentityState[]>();
  const run = await ingest(db, [...GENESIS, ...found.read().records], {
    start: BigInt(from + 1),
    stop: BigInt(to),
    core: FAST_CORE,
    user: [TOKEN_METADATA as ModuleDeclaration, probe(new Set([...heights, to]), states)],
    settings: { network: NET, listen: { api: "127.0.0.1:0" } },
  });
  await committed(run, BigInt(to), 600_000);
  const api = run.handle.listening().api!;
  return { run, db, origin: `http://${api.host.includes(":") ? `[${api.host}]` : api.host}:${api.port}`, states };
}

// ── The proof of concept's comparison of a case (`caseDifferences`) ─────────────────────────────────────────────

/** Usable common values in the expected-state shape. */
function commonOf(id: IdentityState): Record<string, unknown> {
  const c: Record<string, unknown> = {};
  for (const [name, keyHex] of Object.entries(COMMON_KEY_HEX)) {
    const f = id.fields.get(keyHex);
    if (f === undefined || f.usable !== true) continue;
    if (name === "decimals") c.decimals = f.integer! <= BigInt(Number.MAX_SAFE_INTEGER) ? Number(f.integer) : f.integer!.toString();
    else if (name === "standards") c.standards = parseStandards(f.value)!.join(" ");
    else c[name] = dec.decode(f.value);
  }
  return c;
}

/** One contract's event counts up to `height`: its stored events, and its other `Misc` logs as `ignored`. */
async function countsOf(db: ProcessDatabase, contract: string, height: number): Promise<Record<string, number>> {
  const [row] = await db.query(
    `SELECT count(*) FILTER (WHERE classification = 'accept')::int AS accepted, count(*) FILTER (WHERE classification = 'reject')::int AS rejected,
       count(*) FILTER (WHERE classification = 'unresolved')::int AS unresolved
     FROM token_metadata.events WHERE contract_address = '\\x${contract}'::bytea AND height <= ${height}`,
  );
  const logs = await db.query(
    `SELECT height::text AS height, tx_index::int AS tx_index, log_index::int AS log_index, contract_address, log_version::int AS version,
       event_type, data FROM contract_logs.logs WHERE contract_address = '\\x${contract}'::bytea AND height <= ${height} ORDER BY height, tx_index, log_index`,
  );
  const candidates = logs.filter((l) => {
    const log = { transaction: l.tx_index as number, index: l.log_index as number, address: l.contract_address as Uint8Array, entryPoint: new Uint8Array(), logicalSegment: 0, version: l.version as number, eventType: l.event_type as "Misc", data: l.data as Uint8Array };
    return candidatesOf(BigInt(l.height as string), [log]).length > 0;
  }).length;
  const misc = logs.filter((l) => l.event_type === "Misc").length;
  const accepted = row!.accepted as number;
  const rejected = row!.rejected as number;
  expect(candidates, `${contract}: candidates among its logs`).toBe(accepted + rejected);
  return { events: misc, accepted, rejected, ignored: misc - candidates, unresolved: row!.unresolved as number };
}

/** UmbraDB's state of one contract at `height` against an expectation ([] when equal). */
async function caseDifferences(r: Replay, height: number, contract: string, expected: ExpectedState): Promise<string[]> {
  const d: string[] = [];
  const state = r.states.get(height);
  if (state === undefined) throw new Error(`no snapshot at ${height}`);
  const ids = state.filter((i) => i.contractAddress === contract);
  const got = new Map(ids.map((i) => [`${i.domainSep}/${i.kind}`, i]));
  const want = new Map(expected.identities.map((e) => [`${norm(e.domainSep)}/${e.kind}`, e]));
  for (const k of want.keys()) if (!got.has(k)) d.push(`identity ${k} expected, absent`);
  for (const k of got.keys()) if (!want.has(k)) d.push(`identity ${k} present, not expected`);
  for (const [k, e] of want) {
    const g = got.get(k);
    if (g === undefined) continue;
    if (e.colored !== (g.kind !== 3)) d.push(`identity ${k}: colored`);
    if (canon(commonOf(g)) !== canon(e.common)) d.push(`identity ${k}: common ${canon(commonOf(g))}, expected ${canon(e.common)}`);
    if (e.fields !== undefined) {
      const gf = Object.fromEntries(
        [...g.fields].map(([key, f]) => [key, { valType: f.valType, value_hex: hexOf(f.value), ...(e.fields![key]?.usable === undefined ? {} : { usable: f.usable }) }]),
      );
      const ef = Object.fromEntries(
        Object.entries(e.fields)
          .filter(([key]) => isCommonKey(key))
          .map(([key, f]) => [key, { valType: f.valType, value_hex: f.value_hex, ...(f.usable === undefined ? {} : { usable: f.usable }) }]),
      );
      if (canon(gf) !== canon(ef)) d.push(`identity ${k}: fields ${canon(gf)}, expected ${canon(ef)}`);
    }
  }
  const multi = (gs: { symbol: string; members: string[] }[]): string =>
    canon(gs.filter((g) => g.members.length >= 2).map((g) => ({ ...g, members: [...g.members].sort() })).sort((a, b) => (a.symbol < b.symbol ? -1 : 1)));
  const gotGroups = servedGroups(ids).map((g) => ({ symbol: dec.decode(Buffer.from(g.symbol, "hex")), members: g.members.map((m) => `${m.domainSep}/${m.kind}`) }));
  const wantGroups = expected.groups.map((g) => ({ symbol: g.symbol, members: g.members.map((m) => `${norm(m.domainSep)}/${m.kind}`) }));
  if (multi(gotGroups) !== multi(wantGroups)) d.push(`groups ${multi(gotGroups)}, expected ${multi(wantGroups)}`);
  if (expected.counts !== undefined) {
    const { unresolved, ...c } = await countsOf(r.db, contract, height);
    if (unresolved !== 0) d.push(`unresolved ${unresolved}`);
    if (canon(c) !== canon(expected.counts)) d.push(`counts ${canon(c)}, expected ${canon(expected.counts)}`);
  }
  return d;
}

// ── TM-13's differences applied to a recorded answer (M14) ──────────────────────────────────────────────────────

const MASKED = "<TM-13>";
/** Fields TM-13 serves differently everywhere they appear. */
const MASKED_KEYS = new Set(["minted", "firstSeen", "evidence", "color", "image", "segment", "phase", "seen"]);

function mask(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(mask);
  if (value === null || typeof value !== "object") return value;
  return Object.fromEntries(Object.entries(value).map(([k, v]) => [k, MASKED_KEYS.has(k) ? MASKED : mask(v)]));
}

type Json = Record<string, any>;
const notFound = (message: string) => ({ status: 404, body: { error: { code: "NOT_FOUND", message } } });
const described = (item: Json): boolean => item.source !== "seen" && !(item.source === "identity" && item.described === false);

/**
 * The answer TM-13 expects for a recorded one: identities known only from a mint (never described) and `seen` rows are
 * not served, so a list drops them, an identity or a color only they give is 404, and a lookup that resolved to one is
 * `not-minted-in-indexed-range`; a contract the module saw no MIP-0018 event or field of is 404; the status's
 * `scanner` and the start height (see the module comment) are masked.
 */
function expectedOf(a: Answer, eventsOf: (contract: string) => Json | undefined): { status: number; body: unknown } {
  const body = JSON.parse(a.body) as Json;
  const route = a.path.split("?")[0]!;
  if (route === "/v1/status") return { status: a.status, body: { ...body, startHeight: MASKED, scanner: MASKED } };
  if (route === "/v1/tokens") return { status: a.status, body: { ...body, items: body.items.filter(described) } };
  if (route.startsWith("/v1/identities/") && body.described === false) return notFound("no such token identity");
  if (route.startsWith("/v1/tokens/") && body.builtin === null) {
    const identities = body.identities.filter((i: Json) => i.described);
    if (identities.length === 0 && body.related.length === 0) return notFound("no token with this color in the indexed range");
    return { status: a.status, body: { ...body, identities } };
  }
  if (route.startsWith("/v1/lookup/")) {
    const range = { ...body, indexedRange: body.indexedRange === null ? null : { ...body.indexedRange, from: MASKED } };
    if (body.result === "identity" && body.identity?.described !== true) {
      return { status: a.status, body: { ...range, found: false, result: "not-minted-in-indexed-range", identity: null } };
    }
    return { status: a.status, body: range };
  }
  if (route.startsWith("/v1/contracts/")) {
    const items = body.items.filter(described);
    const contract = route.split("/")[3]!;
    if (items.length === 0 && (eventsOf(contract)?.items.length ?? 0) === 0) return notFound("no such contract in the indexed range");
    return { status: a.status, body: { ...body, items } };
  }
  return { status: a.status, body };
}

/** Our answer in the comparable form: masked as {@link expectedOf} masks. */
function oursOf(path: string, status: number, body: Json): { status: number; body: unknown } {
  const route = path.split("?")[0]!;
  if (route === "/v1/status") return { status, body: { ...body, startHeight: MASKED, scanner: MASKED } };
  if (route.startsWith("/v1/lookup/")) return { status, body: { ...body, indexedRange: body.indexedRange === null ? null : { ...body.indexedRange, from: MASKED } } };
  return { status, body };
}

// ── The tests ───────────────────────────────────────────────────────────────────────────────────────────────────

/**
 * The recorded answers TM-13 changes beyond masking, all from the module having no mint table: the routes of the one
 * token minted in the range and never described (contract `7771c9e5…`, color `e5afe273…`, minted at 714,802; no
 * case's), and the lookups of a color held as a kind that was minted but never described, which the proof of concept
 * answers with that undescribed identity and TM-13 with `not-minted-in-indexed-range`.
 */
const EXPECTED_CHANGES: string[] = [
  "idx /v1/contracts/7771c9e5/tokens 200->404",
  "idx /v1/identities/7771c9e5/953ecfdd/1 200->404",
  "idx /v1/lookup/81db4eef?held=unshielded 200->200",
  "idx /v1/lookup/8c74ec4a?held=unshielded 200->200",
  "idx /v1/lookup/8e01e392?held=shielded 200->200",
  "idx /v1/lookup/be34ef4b?held=unshielded 200->200",
  "idx /v1/lookup/e5afe273?held=shielded 200->200",
  "idx /v1/lookup/e5afe273?held=unshielded 200->200",
  "idx /v1/tokens/e5afe273 200->404",
  "idx /v1/tokens?limit=500 200->200",
  "u1 /v1/lookup/89a55592?held=unshielded 200->200",
];

const IDX_CASES = ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C10"].sort((a, b) => lastOf(a) - lastOf(b));
const C06_STEPS = caseIndex.cases.C06!.steps.filter((s) => s.expectedAfter !== undefined);
const TAPES_PRESENT = findTape("stagenet-714485-715183").found && findTape("stagenet-715402-715433").found;

(TAPES_PRESENT ? describe : describe.skip).each(PROCESS_BACKENDS)("the stagenet tapes through token-metadata on $name", (backend: ProcessBackend) => {
  const replays = {} as Record<"idx" | "u1", Replay>;

  beforeAll(async () => {
    await backend.start();
    replays.idx = await replay(backend, "stagenet-714485-715183", 714485, 715183, [...IDX_CASES.map(lastOf), ...C06_STEPS.map((s) => s.height!)]);
    replays.u1 = await replay(backend, "stagenet-715402-715433", 715402, 715433, [lastOf("U1")]);
  }, 1_200_000);
  afterAll(async () => {
    await replays.idx?.run.close();
    await replays.u1?.run.close();
    await backend.stop();
  }, 120_000);

  it("M20: each case at its own last block equals its expectation while every later case is absent; C09 = C01; U1", async () => {
    const r = replays.idx;
    let checked = 0;
    for (const stop of IDX_CASES) {
      const last = lastOf(stop);
      for (const c of IDX_CASES) {
        if (lastOf(c) <= last) {
          expect(await caseDifferences(r, last, contractOf(c), expectation<ExpectedState>(`${c}/expected.json`)), `${c} at ${stop}'s last block ${last}`).toEqual([]);
          checked++;
        } else {
          expect(firstOf(c) > last, `${c} overlaps ${stop}`).toBe(true);
          expect(r.states.get(last)!.filter((i) => i.contractAddress === contractOf(c)), `${c} before its first block`).toEqual([]);
          expect((await countsOf(r.db, contractOf(c), last)).events, `${c} before its first block`).toBe(0);
        }
      }
    }
    expect(checked).toBe(45);
    // [NEG] The comparison sees a wrong expectation: another case's, an earlier C06 step's.
    expect(await caseDifferences(r, 715183, contractOf("C02"), expectation<ExpectedState>("C03/expected.json"))).not.toEqual([]);
    expect(await caseDifferences(r, 715183, contractOf("C06"), expectation<ExpectedState>("C06/expected-after-withdraw.json"))).not.toEqual([]);
    // C09: a refused call, no transaction: C01's state and C01's one event.
    expect(contractOf("C09")).toBe(contractOf("C01"));
    expect(await caseDifferences(r, 715183, contractOf("C09"), expectation<ExpectedState>("C01/expected.json"))).toEqual([]);
    expect(await countsOf(r.db, contractOf("C09"), 715183)).toEqual({ events: 1, accepted: 1, rejected: 0, ignored: 0, unresolved: 0 });
    // U1 at its last block.
    expect(await caseDifferences(replays.u1, lastOf("U1"), contractOf("U1"), expectation<ExpectedState>("U1/expected.json"))).toEqual([]);
  });

  it("M20: C06 after each step of its lifecycle equals that step's expectation", async () => {
    expect(C06_STEPS.map((s) => s.id)).toEqual(["publish", "rename", "withdraw", "withdraw-again", "revive"]);
    for (const s of C06_STEPS) {
      expect(await caseDifferences(replays.idx, s.height!, contractOf("C06"), expectation<ExpectedState>(`C06/${s.expectedAfter!}`)), s.id).toEqual([]);
    }
  });

  it("M20: the v1-named events of IDX and U1 equal the reference index's, with their block, transaction and entry point; no unresolved site", async () => {
    for (const [range, r] of [["IDX", replays.idx], ["U1", replays.u1]] as const) {
      const ref = indexSummary(range);
      const rows = await r.db.query(
        `SELECT e.height::int AS height, encode(b.hash, 'hex') AS block_hash, encode(e.tx_hash, 'hex') AS tx_hash, e.tx_index, e.event_index,
           encode(e.contract_address, 'hex') AS contract, e.entry_point, e.classification, e.reason, encode(e.domain_sep, 'hex') AS domain_sep, e.kind
         FROM token_metadata.events e JOIN core_block_commit.blocks b ON b.height = e.height ORDER BY e.height, e.tx_index, e.event_index`,
      );
      const ours: Record<string, RefEvent[]> = {};
      for (const e of rows) {
        (ours[e.contract as string] ??= []).push({
          block: { height: e.height as number, hash: e.block_hash as string },
          txHash: e.tx_hash as string,
          txIndex: Number(e.tx_index),
          eventIndex: Number(e.event_index),
          entryPoint: dec.decode(e.entry_point as Uint8Array),
          result: e.classification as string,
          ...(e.reason === null ? {} : { reason: e.reason as string }),
          ...(e.domain_sep === null ? {} : { domainSep: e.domain_sep as string, kind: Number(e.kind) }),
        });
      }
      const pick = (events: Record<string, RefEvent[]>) =>
        Object.fromEntries(
          Object.entries(events).map(([c, es]) => [
            c,
            es.map((e) => ({
              block: { height: e.block.height, hash: norm(e.block.hash) },
              txHash: norm(e.txHash),
              txIndex: e.txIndex,
              eventIndex: e.eventIndex,
              entryPoint: e.entryPoint,
              result: e.result,
              ...(e.reason === undefined ? {} : { reason: e.reason }),
              ...(e.domainSep === undefined ? {} : { domainSep: norm(e.domainSep), kind: e.kind }),
            })),
          ]),
        );
      expect(pick(ours), range).toEqual(pick(ref.events));
      expect(rows.filter((e) => e.classification === "unresolved"), range).toEqual([]);
    }
    expect(Object.values(indexSummary("IDX").events).flat()).toHaveLength(35);
  });

  it("M20: IDX's identity entries (expected.json) equal the module's identities at the range end", async () => {
    const entries = json<{ colors: { case: string; domainSep: string; kind: number; identity: ExpectedIdentity }[] }>(new URL("cases/IDX/expected.json", FIXTURES)).colors;
    expect(entries).toHaveLength(7);
    const state = replays.idx.states.get(715183)!;
    for (const e of entries) {
      const id = state.find((i) => i.contractAddress === contractOf(e.case) && i.domainSep === norm(e.domainSep) && i.kind === e.kind);
      expect(id, `${e.case} ${e.domainSep}/${e.kind}`).toBeDefined();
      expect({ domainSep: `0x${id!.domainSep}`, kind: id!.kind, colored: id!.kind !== 3, common: commonOf(id!) }).toEqual(e.identity);
    }
  });

  it("M20: every case identity's mark equals the mark rule on the expectations and the reference's rejections; C06 step by step", async () => {
    const refs = [indexSummary("IDX"), indexSummary("U1")];
    const rejections = (contract: string): string[] =>
      refs.flatMap((r) => r.events[contract] ?? []).filter((e) => e.result === "reject").map((e) => e.reason!);
    const oracle = (e: ExpectedIdentity, contract: string) => {
      const missing = (["name", "symbol", "decimals"] as const).filter((k) => e.common[k] === undefined);
      const reasons = rejections(contract);
      const tags = typeof e.common.standards === "string" ? [...new Set(e.common.standards.split(" "))] : [];
      return { mark: reasons.length > 0 ? "incorrect" : missing.length === 0 ? "ok" : "partial", reasons, missing, tags };
    };
    const marksOf = async (r: Replay, height: number, contract: string, expected: ExpectedState) => {
      const state = r.states.get(height)!;
      const events = await r.db.query(
        `SELECT reason FROM token_metadata.events WHERE contract_address = '\\x${contract}'::bytea AND classification = 'reject' AND height <= ${height}
         ORDER BY height, tx_index, event_index`,
      );
      const summary = { count: events.length, reasons: events.map((e) => e.reason as string), unresolved: { count: 0, positions: [] } };
      const got: Record<string, unknown> = {};
      const want: Record<string, unknown> = {};
      for (const e of expected.identities) {
        const id = state.find((i) => i.contractAddress === contract && i.domainSep === norm(e.domainSep) && i.kind === e.kind);
        const { mark, reasons, missing, tags } = markJson(id === undefined ? undefined : { described: true, fields: new Map(id.fields) }, summary);
        got[`${norm(e.domainSep)}/${e.kind}`] = { mark, reasons, missing, tags };
        want[`${norm(e.domainSep)}/${e.kind}`] = oracle(e, contract);
      }
      return { got, want };
    };
    const summary: Record<string, string[]> = {};
    for (const c of ["C01", "C02", "C03", "C04", "C05", "C06", "C07", "C08", "C09", "C10", "U1"]) {
      const r = c === "U1" ? replays.u1 : replays.idx;
      const { got, want } = await marksOf(r, c === "U1" ? 715433 : 715183, contractOf(c), expectation<ExpectedState>(c === "C09" ? "C01/expected.json" : `${c}/expected.json`));
      expect(got, c).toEqual(want);
      summary[c] = Object.values(got as Record<string, { mark: string; tags: string[] }>).map((m) => m.mark + (m.tags.length > 0 ? `+${m.tags.join(",")}` : ""));
    }
    expect(summary).toEqual({
      C01: ["ok"], C02: ["ok"], C03: ["ok"], C04: ["ok", "ok", "ok"], C05: ["ok", "ok", "ok"], C06: ["ok+mip-0004"],
      C07: ["incorrect"], C08: ["incorrect"], C09: ["ok"], C10: ["ok+mip-0004"], U1: ["ok"],
    });
    const seen: string[] = [];
    for (const s of C06_STEPS) {
      const { got, want } = await marksOf(replays.idx, s.height!, contractOf("C06"), expectation<ExpectedState>(`C06/${s.expectedAfter!}`));
      expect(got, s.id).toEqual(want);
      seen.push(`${s.id}:${Object.values(got as Record<string, { mark: string; missing: string[] }>).map((m) => m.mark + (m.missing.length > 0 ? `(${m.missing.join(",")})` : "")).join()}`);
    }
    expect(seen).toEqual(["publish:ok", "rename:ok", "withdraw:partial(name)", "withdraw-again:partial(name)", "revive:ok"]);
  });

  it("M14: the recorded answers, with TM-13's differences, equal the module's byte for byte", async () => {
    const differences: string[] = [];
    const changed: string[] = [];
    let compared = 0;
    for (const [file, r] of [["idx", replays.idx], ["u1", replays.u1]] as const) {
      const answers = json<{ answers: Answer[] }>(new URL(`${file}.json`, ANSWERS)).answers;
      const events = new Map(answers.filter((a) => a.path.startsWith("/v1/events?contract=")).map((a) => [a.path.slice(20, 84), JSON.parse(a.body) as Json]));
      // The token list in pages of 2: page boundaries move with the rows TM-13 drops, so the pages are compared joined.
      const recordedPages = answers.filter((a) => a.path.startsWith("/v1/tokens?limit=2"));
      const ourPages: Json[] = [];
      let cursor: string | null = null;
      do {
        const page: Json = await (await fetch(`${r.origin}/v1/tokens?limit=2${cursor === null ? "" : `&cursor=${cursor}`}`)).json();
        ourPages.push(...page.items);
        cursor = page.nextCursor;
      } while (cursor !== null);
      const recordedItems = recordedPages.flatMap((a) => (JSON.parse(a.body) as Json).items).filter(described);
      if (toAsciiJson(mask(ourPages)) !== toAsciiJson(mask(recordedItems))) differences.push(`${file}: /v1/tokens in pages of 2`);
      for (const a of answers) {
        if (a.path.startsWith("/v1/tokens?limit=2")) continue;
        const want = expectedOf(a, (c) => events.get(c));
        const recorded = JSON.parse(a.body) as Json;
        const lookupChanged = a.path.startsWith("/v1/lookup/") && (want.body as Json).result !== recorded.result;
        const bodyChanged = a.path.split("?")[0] !== "/v1/status" && !a.path.startsWith("/v1/lookup/") && toAsciiJson(want.body) !== toAsciiJson(recorded);
        if (want.status !== a.status || lookupChanged || bodyChanged) changed.push(`${file} ${a.path.replace(/[0-9a-f]{64}/g, (h) => h.slice(0, 8))} ${a.status}->${want.status}`);
        const response = await fetch(r.origin + a.path);
        const text = await response.text();
        const got = oursOf(a.path, response.status, JSON.parse(text) as Json);
        const [w, g] = [toAsciiJson(mask(want)), toAsciiJson(mask(got))];
        compared++;
        if (w !== g) differences.push(`${file} ${a.path}\n  recorded ${w.slice(0, 600)}\n  ours     ${g.slice(0, 600)}`);
        for (const [name, value] of Object.entries(a.headers)) if (response.headers.get(name) !== value) differences.push(`${file} ${a.path}: header ${name}`);
      }
    }
    expect(differences).toEqual([]);
    expect(compared).toBe(89 + 12);
    // What TM-13 changed in the recorded answers: the minted-only identity's own routes and its color's.
    expect(changed.sort()).toEqual(EXPECTED_CHANGES);
    // [NEG] A recorded answer with one changed byte of a name is not ours.
    const answer = json<{ answers: Answer[] }>(new URL("idx.json", ANSWERS)).answers.find((a) => a.path.startsWith("/v1/identities/"))!;
    const tampered = { ...answer, body: answer.body.replace(/"name":"(.)/, (_m, c: string) => `"name":"${c === "X" ? "Y" : "X"}`) };
    expect(tampered.body).not.toBe(answer.body);
    const ours = await (await fetch(replays.idx.origin + answer.path)).json();
    expect(toAsciiJson(mask(expectedOf(tampered, () => undefined)))).not.toBe(toAsciiJson(mask(oursOf(answer.path, 200, ours))));
    expect(toAsciiJson(mask(expectedOf(answer, () => undefined)))).toBe(toAsciiJson(mask(oursOf(answer.path, 200, ours))));
  });
});
