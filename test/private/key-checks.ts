import { createHash } from "node:crypto";
import { privateCursorHeight } from "../../src/backbone/core-private-source/index.js";
import type { ModuleDeclaration } from "../../src/modules/declaration.js";
import type { PrivateBackend, TestDatabase } from "./backends.js";
import { against } from "./determinism-checks.js";
import { launchPrivate, type PrivateOptions, privateModule, type PublicCore, refusalOf, startPrivate, startPublicCore } from "./builds.js";

/**
 * Test keys through the key registry (task 14.4; PP-8, CF-11; A119, A123), shared by `keys.test.ts`, its negative
 * control's file and the crash worker (`key-crash.worker.ts`). Imports nothing of Vitest.
 *
 * **The key module** `pk` ({@link keyModule}): task 14.1's private test module (its rows, the public block's hash read in
 * `on-fetch`) declaring the key kind `viewing`, whose `validateKey` takes keys of 4 bytes or more; it records, in order,
 * its `on-fetch` and `on-compute` heights, each `on-key` with the key's kind, id and bytes and its read's height, and
 * the keys `admitted-keys` holds at each `on-compute`.
 *
 * **The test keys** are made from fixed, obviously fake bytes — 0x5a, 0xa5 or 0x3c repeated —: no real key material.
 */

/** A test key of a private configuration (CF-11). */
export interface TestKeyConfig {
  readonly kind: string;
  readonly bytes: string;
  readonly start: number;
}

/** The kind `pk` declares. */
export const VIEWING = "viewing";

/** A test key of kind `viewing`: `byte` repeated 32 times, from `start`. */
export const viewingKey = (byte: number, start: number): TestKeyConfig => ({
  kind: VIEWING,
  bytes: `0x${byte.toString(16).padStart(2, "0").repeat(32)}`,
  start,
});

/** `0x` hex. */
export const hexOf = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** The key id of `key` (PP-8): SHA-256(UTF-8 kind ‖ bytes), as `0x` hex, computed here with Node.js's own hash. */
export function keyIdHex(key: Pick<TestKeyConfig, "kind" | "bytes">): string {
  const bytes = Buffer.from(key.bytes.slice(2), "hex");
  return `0x${createHash("sha256").update(Buffer.concat([Buffer.from(key.kind, "utf8"), bytes])).digest("hex")}`;
}

/** Where `pk` blocks inside a block transaction: its `on-db-write` at `height` tells `blocked` and never ends. */
export interface Blocking {
  readonly height: bigint;
  readonly blocked: () => void;
}

/** One call of `pk` (see the module comment). */
export type KeyCall =
  | { readonly point: "on-fetch"; readonly height: bigint }
  | { readonly point: "on-key"; readonly kind: string; readonly keyId: string; readonly bytes: string; readonly read: bigint | null }
  | { readonly point: "on-compute"; readonly height: bigint; readonly admitted: readonly AdmittedSeen[] | null };

/** A key `admitted-keys` held, as `pk` saw it. */
export interface AdmittedSeen {
  readonly keyId: string;
  readonly kind: string;
  readonly bytes: string;
  readonly arrivedHeight: bigint;
}

/** The private module `pk` (see the module comment); its `on-db-write` blocks at `blocking`'s height when given. */
export function keyModule(calls: KeyCall[], blocking?: Blocking): ModuleDeclaration {
  const base = privateModule("pk", []);
  const points = base.points;
  return {
    ...base,
    keyKinds: [VIEWING],
    validateKey: (_kind, bytes) => bytes.length >= 4,
    points: {
      ...points,
      async "on-fetch"(p, b, out, read) {
        calls.push({ point: "on-fetch", height: b.height });
        await points["on-fetch"]?.(p, b, out, read);
      },
      async "on-key"(_p, key, read) {
        calls.push({ point: "on-key", kind: key.kind, keyId: hexOf(key.keyId), bytes: hexOf(key.bytes), read: read.height });
      },
      async "on-compute"(_p, b) {
        const keys = b.items.get("admitted-keys") as readonly { keyId: Uint8Array; kind: string; bytes: Uint8Array; arrivedHeight: bigint }[] | undefined;
        const admitted =
          keys === undefined
            ? null
            : keys.map((key) => ({ keyId: hexOf(key.keyId), kind: key.kind, bytes: hexOf(key.bytes), arrivedHeight: key.arrivedHeight }));
        calls.push({ point: "on-compute", height: b.height, admitted });
      },
      async "on-db-write"(p, b, w) {
        if (blocking !== undefined && b.height === blocking.height) {
          blocking.blocked();
          await new Promise<never>(() => undefined);
        }
        await points["on-db-write"]?.(p, b, w);
      },
    },
  };
}

/** `pk`'s entry from `start`. */
export const keyEntry = (start = 1) => ({ id: "pk", start, version: "1.0.0", config: { salt: 0 } });

/** One row of `core_key_registry.keys`. */
export interface KeyRow {
  readonly keyId: string;
  readonly kind: string;
  readonly bytes: string;
  readonly arrivedHeight: bigint;
}

/** `core_key_registry.keys` and the private cursor of a private database (read once no process holds it). */
export async function registryOf(db: TestDatabase): Promise<{ readonly rows: readonly KeyRow[]; readonly cursor: bigint | null }> {
  return db.read(
    async (read) => ({
      rows: (await read.query("SELECT key_id, kind, key_bytes, arrived_height FROM core_key_registry.keys ORDER BY key_id")).map((row) => ({
        keyId: hexOf(row.key_id as Uint8Array),
        kind: String(row.kind),
        bytes: hexOf(row.key_bytes as Uint8Array),
        arrivedHeight: row.arrived_height as bigint,
      })),
      cursor: read.height,
    }),
    privateCursorHeight,
  );
}

// ── A119: admitted at its start ───────────────────────────────────────────────────────────────────────────────────

/** The key of A119's admission: `0x5a` × 32 from 4. */
export const A119_KEY = viewingKey(0x5a, 4);

/** What A119's admission saw: `pk`'s calls and the registry once the private process reached the core's head. */
export interface Admission {
  readonly key: TestKeyConfig;
  readonly head: bigint;
  readonly calls: readonly KeyCall[];
  readonly rows: readonly KeyRow[];
  readonly cursor: bigint | null;
}

/** Runs a core to 8 and a private process with {@link A119_KEY} to it. */
export async function a119Admission(backend: PrivateBackend): Promise<Admission> {
  const head = 8n;
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head });
  try {
    const privateDb = await backend.database("private");
    const calls: KeyCall[] = [];
    const running = await startPrivate(
      against(backend, publicDb, core, { database: privateDb.setting, modules: [keyModule(calls)], entries: [keyEntry()], testKeys: [A119_KEY] }),
    );
    try {
      await running.reach(head);
    } finally {
      await running.stop();
    }
    return { key: A119_KEY, head, calls, ...(await registryOf(privateDb)) };
  } finally {
    await core.stop();
  }
}

/**
 * A119's admission oracle (PP-8): every problem, none when `on-key` fired once for the key, with its kind, id and bytes
 * and a read at h − 1, after h's `on-fetch` (the key became pending as h was processed, not before) and before h's
 * `on-compute`; `admitted-keys` held exactly that key with `arrived_height` h at h and nothing at every other height;
 * and the registry holds it, alone, with `arrived_height` h, once `from` .. head committed.
 */
export function admissionProblems(observed: Admission, from = 1n): string[] {
  const { key, calls, rows } = observed;
  const h = BigInt(key.start);
  const problems: string[] = [];
  const id = keyIdHex(key);
  const fired = calls.filter((call) => call.point === "on-key");
  const expected = { point: "on-key", kind: key.kind, keyId: id, bytes: key.bytes, read: h - 1n };
  if (fired.length !== 1 || JSON.stringify(fired[0], jsonText) !== JSON.stringify(expected, jsonText)) {
    problems.push(`on-key fired ${JSON.stringify(fired, jsonText)}, not once for the key with a read at ${h - 1n}`);
  }
  const keyAt = calls.findIndex((call) => call.point === "on-key");
  const fetchAt = calls.findIndex((call) => call.point === "on-fetch" && call.height === h);
  const computeAt = calls.findIndex((call) => call.point === "on-compute" && call.height === h);
  if (keyAt < 0 || fetchAt < 0 || computeAt < 0 || !(fetchAt < keyAt && keyAt < computeAt)) {
    problems.push(`on-key was not between ${h}'s on-fetch and its on-compute (at ${keyAt}, ${fetchAt}, ${computeAt})`);
  }
  for (const call of calls) {
    if (call.point !== "on-compute") continue;
    const want = call.height === h ? [{ keyId: id, kind: key.kind, bytes: key.bytes, arrivedHeight: h }] : [];
    if (JSON.stringify(call.admitted, jsonText) !== JSON.stringify(want, jsonText)) {
      problems.push(`admitted-keys at ${call.height} held ${JSON.stringify(call.admitted, jsonText)}`);
    }
  }
  const computed = calls.filter((call) => call.point === "on-compute").map((call) => (call as { height: bigint }).height);
  const all = Array.from({ length: Number(observed.head - from + 1n) }, (_, index) => from + BigInt(index));
  if (JSON.stringify(computed, jsonText) !== JSON.stringify(all, jsonText)) problems.push(`on-compute ran at ${computed.join(",")}`);
  const row = { keyId: id, kind: key.kind, bytes: key.bytes, arrivedHeight: h };
  if (JSON.stringify(rows, jsonText) !== JSON.stringify([row], jsonText)) {
    problems.push(`core_key_registry.keys holds ${JSON.stringify(rows, jsonText)}, not the key with arrived_height ${h}`);
  }
  if (observed.cursor !== observed.head) problems.push(`the private cursor is ${observed.cursor}, not ${observed.head}`);
  return problems;
}

/** JSON's replacer for `bigint`s. */
export const jsonText = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}n` : value);

// ── A119: refused at startup ──────────────────────────────────────────────────────────────────────────────────────

/** What a refused start with one bad test key saw. */
export interface KeyRefusal {
  readonly name: string;
  readonly code: string | null;
  readonly state: string;
  readonly paths: readonly string[];
  readonly message: string;
  /** Whether the private database was touched: a PostgreSQL session of the private process, or a PGlite directory. */
  readonly touched: boolean;
}

/** A119's bad keys: a kind `pk` does not declare, and bytes its `validateKey` rejects (2 bytes). */
export const A119_BAD_KEYS: readonly { readonly name: string; readonly key: TestKeyConfig; readonly path: string }[] = [
  { name: "an undeclared kind", key: { ...viewingKey(0x5a, 4), kind: "spending" }, path: "entries[0].config.testKeys[0].kind" },
  { name: "bytes validateKey rejects", key: { kind: VIEWING, bytes: "0x5a5a", start: 4 }, path: "entries[0].config.testKeys[0].bytes" },
];

/** Starts a private process with each of {@link A119_BAD_KEYS} against a core, and keeps what each refusal showed. */
export async function a119Refusals(backend: PrivateBackend, touched: (db: TestDatabase) => Promise<boolean>): Promise<KeyRefusal[]> {
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head: 2n });
  try {
    const found: KeyRefusal[] = [];
    for (const { name, key } of A119_BAD_KEYS) {
      const privateDb = await backend.database("private");
      const options = against(backend, publicDb, core, { database: privateDb.setting, modules: [keyModule([])], entries: [keyEntry()], testKeys: [key] });
      const refusal = await refusalOf(options);
      const error = refusal.error as { message: string; details?: { findings?: readonly { path: string }[] } };
      found.push({
        name,
        code: refusal.code,
        state: refusal.state,
        paths: (error.details?.findings ?? []).map((finding) => finding.path),
        message: error.message,
        touched: await touched(privateDb),
      });
    }
    return found;
  } finally {
    await core.stop();
  }
}

/** A119's refusal oracle (CF-11): every problem, none when each bad key refused startup before the database opened. */
export function refusalProblems(found: readonly KeyRefusal[]): string[] {
  const problems: string[] = [];
  for (const [index, { name, key, path }] of A119_BAD_KEYS.entries()) {
    const refusal = found[index];
    if (refusal === undefined) {
      problems.push(`${name}: no refusal`);
      continue;
    }
    if (refusal.code !== "invalid-configuration" || refusal.state !== "refused") {
      problems.push(`${name}: ${refusal.state} with ${refusal.code}, not refused with invalid-configuration`);
    }
    if (!refusal.paths.includes(path)) problems.push(`${name}: no finding at ${path} (${refusal.paths.join(", ")})`);
    if (refusal.message.includes(key.bytes.slice(2))) problems.push(`${name}: the refusal's message holds the key's bytes`);
    if (refusal.touched) problems.push(`${name}: the private database was opened`);
  }
  return problems;
}

// ── A123: a restart keeps arrived_height; another start refuses ──────────────────────────────────────────────────

/** A123's key: `0xa5` × 32 from 3. */
export const A123_KEY = viewingKey(0xa5, 3);

/** What A123's restarts saw. */
export interface Restarts {
  /** The registry after the first run (to 6), the restart with the same key (to 9), and the one without it (to 10). */
  readonly first: readonly KeyRow[];
  readonly same: readonly KeyRow[];
  readonly removed: readonly KeyRow[];
  /** `pk`'s `on-key` calls in the restart with the same key, and the keys `admitted-keys` held there. */
  readonly sameKeys: readonly KeyCall[];
  readonly sameAdmitted: readonly KeyCall[];
  /** The restart with the key at another start, and one with a new key whose start is at or below the cursor. */
  readonly moved: { readonly code: string | null; readonly state: string; readonly reason: unknown; readonly after: readonly KeyRow[]; readonly cursor: bigint | null };
  readonly passed: { readonly code: string | null; readonly state: string; readonly reason: unknown };
}

/** Runs A123's restarts on a core at 6, then 9, then 10, with `registry` (the real `core-key-registry` unless given). */
export async function a123Restarts(backend: PrivateBackend, registry?: ModuleDeclaration): Promise<Restarts> {
  const publicDb = await backend.database("public");
  const core = await startPublicCore({ database: publicDb.setting, head: 6n });
  try {
    const privateDb = await backend.database("private");
    const options = (calls: KeyCall[], testKeys: readonly TestKeyConfig[]): PrivateOptions =>
      against(backend, publicDb, core, {
        database: privateDb.setting,
        modules: [keyModule(calls)],
        entries: [keyEntry()],
        testKeys,
        ...(registry === undefined ? {} : { registry }),
      });
    const run = async (calls: KeyCall[], testKeys: readonly TestKeyConfig[], to: bigint): Promise<readonly KeyRow[]> => {
      const running = await startPrivate(options(calls, testKeys));
      try {
        await running.reach(to);
      } finally {
        await running.stop();
      }
      return (await registryOf(privateDb)).rows;
    };
    const first = await run([], [A123_KEY], 6n);
    await core.advance(9n);
    const sameCalls: KeyCall[] = [];
    const same = await run(sameCalls, [A123_KEY], 9n);
    /** A start expected to refuse: its code, state and `details.reason`; a start that was not refused, as such. */
    const refused = async (testKeys: readonly TestKeyConfig[]) => {
      try {
        const refusal = await refusalOf(options([], testKeys));
        return { code: refusal.code, state: refusal.state, reason: detailReason(refusal.error) };
      } catch {
        return { code: null, state: "started", reason: undefined };
      }
    };
    const moved = await refused([{ ...A123_KEY, start: 5 }]);
    const afterMoved = await registryOf(privateDb);
    const passed = await refused([A123_KEY, viewingKey(0x3c, 9)]);
    await core.advance(10n);
    const removed = await run([], [], 10n);
    return {
      first,
      same,
      removed,
      sameKeys: sameCalls.filter((call) => call.point === "on-key"),
      sameAdmitted: sameCalls.filter((call) => call.point === "on-compute" && (call.admitted?.length ?? 0) > 0),
      moved: { ...moved, after: afterMoved.rows, cursor: afterMoved.cursor },
      passed,
    };
  } finally {
    await core.stop();
  }
}

/**
 * A123's oracle (CF-11): every problem, none when the key admitted at its start 3 keeps `arrived_height` 3 through a
 * restart with the same key (no `on-key`, no `admitted-keys` again), the same key with start 5 refuses startup with
 * `test-key-conflict` (`start-changed`), the database unchanged, a new key whose start is at or below the cursor too
 * (`start-passed`), and removing the key from the list leaves it admitted.
 */
export function restartProblems(observed: Restarts): string[] {
  const problems: string[] = [];
  const row = JSON.stringify([{ keyId: keyIdHex(A123_KEY), kind: VIEWING, bytes: A123_KEY.bytes, arrivedHeight: 3n }], jsonText);
  for (const [name, rows] of [
    ["the first run", observed.first],
    ["the restart with the same key", observed.same],
    ["the refused restart with another start", observed.moved.after],
    ["the restart without the key", observed.removed],
  ] as const) {
    if (JSON.stringify(rows, jsonText) !== row) problems.push(`after ${name} the registry holds ${JSON.stringify(rows, jsonText)}, not the key at 3`);
  }
  if (observed.sameKeys.length > 0) problems.push(`the restart fired on-key again: ${JSON.stringify(observed.sameKeys, jsonText)}`);
  if (observed.sameAdmitted.length > 0) problems.push(`the restart admitted keys again: ${JSON.stringify(observed.sameAdmitted, jsonText)}`);
  const { moved, passed } = observed;
  if (moved.code !== "test-key-conflict" || moved.state !== "refused" || moved.reason !== "start-changed") {
    problems.push(`the key with another start gave ${moved.state} ${moved.code} (${String(moved.reason)}), not test-key-conflict`);
  }
  if (moved.cursor !== 9n) problems.push(`the refused restart left the private cursor at ${moved.cursor}`);
  if (passed.code !== "test-key-conflict" || passed.state !== "refused" || passed.reason !== "start-passed") {
    problems.push(`a new key starting at the cursor gave ${passed.state} ${passed.code} (${String(passed.reason)}), not test-key-conflict`);
  }
  return problems;
}

/**
 * The `details.reason` of the refusal in `error`'s cause chain (a part's `on-start-db` refusal arrives wrapped in the
 * runner's `CallbackFailure`, its point and module).
 */
function detailReason(error: unknown): unknown {
  let current = error;
  for (let depth = 0; depth < 8 && current instanceof Error; depth++) {
    const details = (current as { details?: { reason?: unknown } }).details;
    if (details !== undefined) return details.reason;
    current = current.cause;
  }
  return undefined;
}

/** A private process launched with `pk` and `testKeys` against `core`'s public database (the crash restart's). */
export function launchWithKeys(
  backend: PrivateBackend,
  publicDb: TestDatabase,
  core: PublicCore,
  privateDb: TestDatabase,
  calls: KeyCall[],
  testKeys: readonly TestKeyConfig[],
  rest: Partial<PrivateOptions> = {},
) {
  return launchPrivate({
    ...against(backend, publicDb, core, { database: privateDb.setting, modules: [keyModule(calls)], entries: [keyEntry()], testKeys }),
    ...rest,
  });
}
