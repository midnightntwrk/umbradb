import { describe, expect, it } from "vitest";
import { UNVALIDATED_CONFIG } from "../../src/admin/configuration.js";
import { ADMIN_ROUTES, answerAdmin } from "../../src/admin/routes.js";
import { snapshotOf } from "../../src/admin/snapshot.js";
import { Lockstep, type LockstepInstance } from "../../src/private/lockstep.js";
import { statusOf } from "../../src/runner/process.js";
import { schemaFile, validatorOf } from "../admin/json-schema.js";

/**
 * The core's view of its lockstep instances and its wait before each block's transaction (task 14.3; PP-6, PP-7, Q24;
 * `design.md` §8): `src/private/lockstep.ts`'s `Lockstep`, which the core's transport tells of each listed instance's
 * `hello`, `report` and close, and which the finalized loop awaits before `BEGIN` of h (`LoopInput.lockstep`). A listed
 * instance holds h while it is not connected — not seen since the core started included —, refused (`lockstep-behind`,
 * `report-hash-mismatch`) or its committed height below h − 1; the wait raises `waiting-for-lockstep` naming the
 * instances that hold it, which `/status` shows (its JSON schema, `test/backbone/core-status/status.schema.json`).
 * The process's own wait is `./lockstep-wait.test.ts`'s, the loop's `test/runner/lockstep-wait.test.ts`'s.
 */

const never = new AbortController().signal;

/** Whether `pending` settled within a turn of the event loop. */
async function settled(pending: Promise<unknown>): Promise<boolean> {
  let done = false;
  void pending.then(
    () => {
      done = true;
    },
    () => {
      done = true;
    },
  );
  await new Promise((resolve) => setTimeout(resolve, 20));
  return done;
}

const entry = (instance: string, rest: Partial<LockstepInstance> = {}): LockstepInstance => ({
  instance,
  connected: false,
  height: null,
  refused: null,
  ...rest,
});

describe("which listed instances hold a height (PP-6)", () => {
  it("one not seen since the core started holds every height, S included: the core cannot know where it is", () => {
    const lockstep = new Lockstep({ listed: ["a"] });
    expect(lockstep.holding(1n)).toEqual([entry("a")]);
    expect(lockstep.holding(1_000n)).toEqual([entry("a")]);
    expect(lockstep.instances()).toEqual([entry("a")]);
  });

  it("a connected one holds h until its committed height is h − 1 or more (hello, then reports)", () => {
    const lockstep = new Lockstep({ listed: ["a"] });
    // Before its first commit an instance says S − 1.
    lockstep.hello("a", 0n, null);
    expect(lockstep.holding(1n)).toEqual([]);
    expect(lockstep.holding(2n)).toEqual([entry("a", { connected: true, height: 0n })]);
    lockstep.reported("a", 1n);
    expect(lockstep.holding(2n)).toEqual([]);
    expect(lockstep.holding(3n)).toEqual([entry("a", { connected: true, height: 1n })]);
    // A report below what it said already counts for nothing.
    lockstep.reported("a", 0n);
    expect(lockstep.instances()).toEqual([entry("a", { connected: true, height: 1n })]);
  });

  it("a disconnected one holds every height, its last height kept; its next hello says where it is now", () => {
    const lockstep = new Lockstep({ listed: ["a"] });
    lockstep.hello("a", 5n, null);
    lockstep.disconnected("a");
    expect(lockstep.holding(6n)).toEqual([entry("a", { height: 5n })]);
    // A report while it is not connected is none.
    lockstep.reported("a", 6n);
    expect(lockstep.instances()).toEqual([entry("a", { height: 5n })]);
    // Its database replaced by an older one: the hello's height, not the higher one known.
    lockstep.hello("a", 2n, null);
    expect(lockstep.instances()).toEqual([entry("a", { connected: true, height: 2n })]);
  });

  it("one refused lockstep-behind or report-hash-mismatch holds every height, whatever it reports", () => {
    const lockstep = new Lockstep({ listed: ["behind", "mismatched"] });
    lockstep.hello("behind", 3n, "lockstep-behind");
    lockstep.reported("behind", 50n);
    lockstep.hello("mismatched", 9n, null);
    lockstep.mismatched("mismatched");
    lockstep.reported("mismatched", 10n);
    expect(lockstep.holding(4n)).toEqual([
      entry("behind", { connected: true, height: 3n, refused: "lockstep-behind" }),
      entry("mismatched", { connected: true, height: 9n, refused: "report-hash-mismatch" }),
    ]);
    lockstep.disconnected("mismatched");
    expect(lockstep.instances()[1]).toEqual(entry("mismatched", { height: 9n, refused: "report-hash-mismatch" }));
    // A new hello is judged again.
    lockstep.hello("mismatched", 9n, null);
    expect(lockstep.holding(10n)).toEqual([entry("behind", { connected: true, height: 3n, refused: "lockstep-behind" })]);
  });

  it("knows only the listed ids, each once, in the list's order", () => {
    const lockstep = new Lockstep({ listed: ["b", "a", "b"] });
    expect(lockstep.listed).toEqual(["b", "a"]);
    expect([lockstep.isListed("a"), lockstep.isListed("c")]).toEqual([true, false]);
    lockstep.hello("c", 9n, null);
    lockstep.reported("c", 9n);
    lockstep.mismatched("c");
    lockstep.disconnected("c");
    expect(lockstep.instances().map((one) => one.instance)).toEqual(["b", "a"]);
    expect(Object.isFrozen(lockstep.instances()[0])).toBe(true);
  });
});

describe("the wait before BEGIN of h (PP-6, Q24)", () => {
  it("resolves at once when nothing holds h: no condition, no log", async () => {
    const lines: string[] = [];
    const lockstep = new Lockstep({ listed: ["a"], log: (line) => lines.push(line) });
    lockstep.hello("a", 4n, null);
    expect(await lockstep.wait(5n, never)).toBe(true);
    expect(await new Lockstep({ listed: [] }).wait(1n, never)).toBe(true);
    expect([lockstep.condition(), lines]).toEqual([null, []]);
  });

  it("waits while an instance holds h, raising waiting-for-lockstep naming it, and resumes when it reports", async () => {
    const lines: string[] = [];
    const lockstep = new Lockstep({ listed: ["a", "b"], log: (line) => lines.push(line) });
    lockstep.hello("a", 3n, null);
    const waiting = lockstep.wait(5n, never);
    expect(await settled(waiting)).toBe(false);
    expect(lockstep.condition()).toEqual({
      code: "waiting-for-lockstep",
      height: 5n,
      instances: [entry("a", { connected: true, height: 3n }), entry("b")],
    });
    expect(lines).toEqual(["lockstep: height 5 waits for b (not connected)"]);
    lockstep.hello("b", 4n, null);
    expect(await settled(waiting)).toBe(false);
    // The condition is live: only what still holds h.
    expect(lockstep.condition()?.instances).toEqual([entry("a", { connected: true, height: 3n })]);
    lockstep.reported("a", 4n);
    expect(await waiting).toBe(true);
    expect(lockstep.condition()).toBeNull();
    expect(lines).toEqual(["lockstep: height 5 waits for b (not connected)", "lockstep: height 5 resumes: every lockstep instance has committed 4"]);
  });

  it("logs only an instance that is down or refused, once per change, never one that is processing h − 1", async () => {
    const lines: string[] = [];
    const lockstep = new Lockstep({ listed: ["a"], log: (line) => lines.push(line) });
    lockstep.hello("a", 8n, null);
    const rhythm = lockstep.wait(10n, never);
    lockstep.reported("a", 9n);
    expect(await rhythm).toBe(true);
    expect(lines).toEqual([]);
    const down = lockstep.wait(11n, never);
    lockstep.disconnected("a");
    expect(await settled(down)).toBe(false);
    lockstep.hello("a", 9n, "lockstep-behind");
    expect(await settled(down)).toBe(false);
    lockstep.mismatched("a");
    expect(await settled(down)).toBe(false);
    lockstep.hello("a", 10n, null);
    expect(await down).toBe(true);
    expect(lines).toEqual([
      "lockstep: height 11 waits for a (not connected, last at 9)",
      "lockstep: height 11 waits for a (lockstep-behind at 9)",
      "lockstep: height 11 waits for a (report-hash-mismatch at 9)",
      "lockstep: height 11 resumes: every lockstep instance has committed 10",
    ]);
  });

  it("ends with false when its signal aborts, before or during the wait, the condition cleared", async () => {
    const lockstep = new Lockstep({ listed: ["a"] });
    const before = new AbortController();
    before.abort();
    expect(await lockstep.wait(1n, before.signal)).toBe(false);
    expect(lockstep.condition()).toBeNull();
    const during = new AbortController();
    const waiting = lockstep.wait(1n, during.signal);
    expect(await settled(waiting)).toBe(false);
    expect(lockstep.condition()?.height).toBe(1n);
    during.abort();
    expect(await waiting).toBe(false);
    expect(lockstep.condition()).toBeNull();
    // A wait already past its condition when the signal aborts resolves as it found it.
    lockstep.hello("a", 0n, null);
    expect(await lockstep.wait(1n, never)).toBe(true);
  });

  it("counts, for the negative controls, only the instances its filter keeps", async () => {
    const lockstep = new Lockstep({ listed: ["seen", "unseen"] });
    lockstep.hello("seen", 0n, null);
    expect(await lockstep.wait(1n, never, (instance) => instance.height !== null)).toBe(true);
    expect(await settled(lockstep.wait(1n, never))).toBe(false);
  });
});

describe("/status shows the condition (AE-3, AE-5)", () => {
  const schema = validatorOf(schemaFile(new URL("../backbone/core-status/status.schema.json", import.meta.url)));

  /** `/status`'s body for a core process raising `conditions`. */
  function body(conditions: Parameters<typeof statusOf>[0]["conditions"]): Record<string, unknown> {
    const status = statusOf({
      phase: "running",
      start: 1n,
      cursor: 3n,
      head: 9n,
      followingThreshold: 3,
      readinessLag: null,
      conditions,
      ended: null,
      reason: null,
    });
    const snapshot = snapshotOf(status, {
      livenessTimeoutMs: 30_000,
      readinessLag: null,
      redactor: null,
      config: UNVALIDATED_CONFIG,
      startedNs: 0n,
      side: "public",
      instanceId: null,
      tipCap: 600,
      lastCommitMs: null,
      modules: null,
      digests: new Map(),
    });
    const answer = answerAdmin(ADMIN_ROUTES, "GET", "/status", { snapshot, beatAgeMs: 0, nowNs: 0n });
    return JSON.parse(JSON.stringify(answer.body)) as Record<string, unknown>;
  }

  it("waiting-for-lockstep validates against /status's schema, each instance with its connection, height and refusal", () => {
    const lockstep = new Lockstep({ listed: ["a", "b", "c"] });
    lockstep.hello("a", 2n, null);
    lockstep.hello("b", 1n, "lockstep-behind");
    void lockstep.wait(4n, never);
    const condition = lockstep.condition();
    if (condition === null) throw new Error("no condition while waiting");
    const shown = body([condition]);
    expect(schema.problems(shown)).toEqual([]);
    expect(shown.conditions).toEqual([
      {
        code: "waiting-for-lockstep",
        height: "4",
        instances: [
          { instance: "a", connected: true, height: "2", refused: null },
          { instance: "b", connected: true, height: "1", refused: "lockstep-behind" },
          { instance: "c", connected: false, height: null, refused: null },
        ],
      },
    ]);
  });

  it("negative control (committed): a condition without its instances, or with a refusal no core gives, fails the schema", () => {
    const without = body([{ code: "waiting-for-lockstep", height: 4n } as never]);
    expect(schema.problems(without)).not.toEqual([]);
    const other = body([
      { code: "waiting-for-lockstep", height: 4n, instances: [{ instance: "a", connected: true, height: 1n, refused: "busy" }] } as never,
    ]);
    expect(schema.problems(other)).not.toEqual([]);
  });
});
