import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { versionEntry } from "../../src/config/entries.js";
import { type HistoryOptions, recordedData } from "../../src/config/history.js";
import { UmbraError } from "../../src/db/errors.js";
import { defineModule, type ModuleDeclaration, type PointName } from "../../src/modules/declaration.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { chainDataHeaders, readChainDataView } from "../../src/runner/envelope.js";
import { FinalizedLoop, type LoopInput } from "../../src/runner/loop.js";
import type { ProcessingEnd, ProcessStatus } from "../../src/runner/process.js";
import { cursorIn, PROCESS_BACKENDS, type ProcessDatabase } from "./process-backends.js";
import { core, entryOf, loggingModule, settle, startProcess, testBuild } from "./process-build.js";

/**
 * The upgrade boundary. A build carrying module `m` 1.0.0 at cursor 20 records
 * `versionEntry({ id: "m", start: 50, version: "1.1.0" })` without configuration. The runner commits 49, completes
 * 49's `on-after-db-write` and `on-stop-height`, and enters `stopped` with `upgrade-required` (entry, needed, build),
 * ready and serving reads at 49. A build carrying 1.1.0 writes that revision with `m.entry`, validated against its
 * schema and recorded, and continues from 50. No secret or operational field of that revision was ever stored.
 * [A47, RN-12, CF-3, CF-8, Q43]
 */

const SECRET = "s3cret-token-a47";
type Version = "1.0.0" | "1.1.0";

/** Module `m` at `version`: `k` (data), `pollMs` (operational), `token` (secret); 1.1.0's rows also hold the version. */
function moduleM(version: Version, log: string[]) {
  const logged = loggingModule("m", log, ["on-fetch", "on-start-height", "on-after-db-write", "on-stop-height"]);
  const migrations = [{ id: "001", sql: "CREATE TABLE m.rows (height bigint PRIMARY KEY, k integer NOT NULL)" }];
  if (version === "1.1.0") migrations.push({ id: "002", sql: "ALTER TABLE m.rows ADD COLUMN version text" });
  const insert =
    version === "1.0.0"
      ? "INSERT INTO m.rows (height, k) VALUES ($1, $2)"
      : "INSERT INTO m.rows (height, k, version) VALUES ($1, $2, '1.1.0')";
  return defineModule({
    id: "m",
    version,
    side: "public",
    requires: ["block-header"],
    provides: [{ name: "m-rows", lifetimes: ["table"], table: { schema: "m", tables: ["rows"], kind: "append-only" } }],
    startsMidChain: true,
    configSchema: z.object({
      k: z.number().int().meta({ kind: "data" }),
      pollMs: z.number().int().default(1).meta({ kind: "operational" }),
      token: z.string().optional().meta({ kind: "secret" }),
    }),
    migrations,
    points: {
      ...logged.points,
      async "on-db-write"(_p, b, w) {
        log.push(`m on-db-write@${b.height} k=${String(b.settings.k)}`);
        // A revision with no settings here (the scheduled one, run only by a negative control) writes -1.
        await w.execute(insert, [b.height, b.settings.k ?? -1]);
      },
      async "on-start-api"(_p, api) {
        // The module states its height itself, with the envelope's helpers. [RN-16]
        api.http("GET", "/height", async (_request, read) => ({
          status: 200,
          headers: chainDataHeaders(await readChainDataView(read)),
          body: { height: read.height },
        }));
      },
    },
  });
}

/** Module `n`, which stops at 49: it shows the boundary's height completing its `on-stop-height`. */
const moduleN = (log: string[]): ModuleDeclaration =>
  loggingModule("n", log, ["on-db-write", "on-after-db-write", "on-stop-height"] as PointName[]);

/** The build carrying `version` of `m`, and `n`, logging into `log`. */
const buildOf = (version: Version) => (log: string[]) => [moduleM(version, log) as ModuleDeclaration, moduleN(log)];

/** One startup of the process: what it showed. */
interface Phase {
  readonly log: readonly string[];
  readonly ended: ProcessingEnd | "waiting" | { readonly refused: unknown };
  readonly status: ProcessStatus;
  /** The module API's `X-Umbra-Height` once processing stopped or waited. */
  readonly servedHeight: string | null;
  readonly cursor: number | null;
  /** `m`'s rows of `core_chain.config` once the process stopped: `m from <start>: <version>, <data>[, hashed]`. */
  readonly history: readonly string[];
}

/** Options of {@link phase}: the negative controls' loop and recording. */
interface Controls {
  readonly loop?: new (input: LoopInput) => FinalizedLoop;
  readonly history?: HistoryOptions;
}

/** Runs one startup on `db` — the modules `user` makes, the configuration `entries` — to `head`, observes, stops it. */
async function phase(
  db: ProcessDatabase,
  user: (log: string[]) => ModuleDeclaration[],
  entries: readonly unknown[],
  head: bigint,
  controls: Controls = {},
): Promise<Phase> {
  const log: string[] = [];
  const build = testBuild(user(log), { log, ...(controls.history === undefined ? {} : { history: controls.history }) });
  const source = new InMemoryBlockSource({ head });
  const handle = startProcess({
    declarations: build.declarations,
    config: { data: { entries } },
    source,
    log: () => undefined,
    ...(controls.loop === undefined ? {} : { loop: controls.loop }),
  });
  let ended: Phase["ended"];
  let servedHeight: string | null = null;
  try {
    ended = await settle(handle, source, head);
    const { api } = await handle.started;
    servedHeight = (await fetch(`http://${api!.host}:${api!.port}/height`)).headers.get("x-umbra-height");
  } catch (error) {
    ended = { refused: error };
  }
  const status = handle.status();
  await handle.stop();
  const rows = await db.query(
    "SELECT start::int AS start, version, data::text AS data, data_hash IS NOT NULL AS hashed " +
      "FROM core_chain.config WHERE entry_id = 'm' ORDER BY start",
  );
  const history = rows.map((row) => `m from ${row.start}: ${row.version}, ${row.data}${row.hashed === true ? ", hashed" : ""}`);
  return { log, ended, status, servedHeight, cursor: await cursorIn(db), history };
}

/** The three startups on `db`: 1.0.0 to cursor 20; with the scheduled revision, to the boundary; 1.1.0 to 60. [A47] */
async function a47Run(db: ProcessDatabase, controls: Controls = {}) {
  const listen = { extra: { listen: { api: "127.0.0.1:0" } } };
  const m10 = moduleM("1.0.0", []);
  const m11 = moduleM("1.1.0", []);
  const n = moduleN([]);
  const old = [core(db.setting, 1, listen), m10.entry({ start: 1, config: { k: 1 } }), entryOf(n, 1, {}, 49)];
  const scheduled = versionEntry({ id: "m", start: 50, version: "1.1.0" });
  const upgraded = [
    core(db.setting, 1, listen),
    versionEntry({ id: "m", start: 1, version: "1.0.0", config: { k: 1 } }),
    m11.entry({ start: 50, config: { k: 2, pollMs: 7, token: SECRET } }),
    entryOf(n, 1, {}, 49),
  ];
  return {
    first: await phase(db, buildOf("1.0.0"), old, 20n),
    boundary: await phase(db, buildOf("1.0.0"), [...old, scheduled], 60n, controls.loop === undefined ? {} : { loop: controls.loop }),
    upgraded: await phase(db, buildOf("1.1.0"), upgraded, 60n, controls.history === undefined ? {} : { history: controls.history }),
  };
}

type A47Observation = Awaited<ReturnType<typeof a47Run>>;

/** `JSON.stringify`'s replacer for bigints. */
const big = (_key: string, value: unknown): unknown => (typeof value === "bigint" ? `${value}n` : value);

const BOUNDARY = { height: 50n, entries: [{ id: "m", start: 50, needed: "1.1.0", build: "1.0.0" }] };

/** The oracle: every problem with what was observed, none when the upgrade boundary holds. [A47] */
function a47Problems({ first, boundary, upgraded }: A47Observation): string[] {
  const problems: string[] = [];
  if (first.cursor !== 20) problems.push(`the first startup ended at cursor ${first.cursor}, not 20`);
  const end = JSON.stringify(boundary.ended, big);
  if (end !== JSON.stringify({ kind: "stopped", height: 49n, core: false, upgrade: BOUNDARY }, big)) {
    problems.push(`the 1.0.0 build's processing ended ${end}`);
  }
  if (boundary.status.state !== "stopped" || !boundary.status.ready) {
    problems.push(`the 1.0.0 build was ${boundary.status.state}${boundary.status.ready ? "" : ", not ready"} at the boundary`);
  }
  const conditions = JSON.stringify(boundary.status.conditions, big);
  if (conditions !== JSON.stringify([{ code: "upgrade-required", ...BOUNDARY }], big)) {
    problems.push(`the 1.0.0 build's conditions were ${conditions}`);
  }
  if (boundary.servedHeight !== "49") problems.push(`the 1.0.0 build served reads at ${boundary.servedHeight}, not 49`);
  if (boundary.cursor !== 49) problems.push(`the 1.0.0 build committed up to ${boundary.cursor}, not 49`);
  if (boundary.log.some((line) => line.includes("@50"))) problems.push("the 1.0.0 build ran a callback at 50");
  for (const line of ["m on-after-db-write@49", "n on-after-db-write@49", "n on-stop-height@49"]) {
    if (!boundary.log.includes(line)) problems.push(`the 1.0.0 build did not complete ${line} before stopping`);
  }
  if (!boundary.history.includes("m from 50: 1.1.0, null")) {
    problems.push(`after the 1.0.0 build the history held ${boundary.history.join("; ")}`);
  }
  if (typeof upgraded.ended === "object" && "refused" in upgraded.ended) {
    problems.push(`the 1.1.0 build refused to start: ${String(upgraded.ended.refused)}`);
  } else if (upgraded.ended !== "waiting") {
    problems.push(`the 1.1.0 build's processing ended ${JSON.stringify(upgraded.ended, big)}`);
  }
  if (upgraded.cursor !== 60) problems.push(`the 1.1.0 build ended at cursor ${upgraded.cursor}, not 60`);
  const writes = upgraded.log.filter((line) => line.startsWith("m on-db-write@")).join(",");
  const wanted = Array.from({ length: 11 }, (_, index) => `m on-db-write@${50 + index} k=2`).join(",");
  if (writes !== wanted) problems.push(`the 1.1.0 build wrote ${writes || "nothing"}`);
  if (upgraded.log.some((line) => line.startsWith("m on-start-height"))) {
    problems.push("the 1.1.0 build fired on-start-height for m, which continues at 50");
  }
  if (!upgraded.history.includes('m from 50: 1.1.0, {"k": 2}, hashed')) {
    problems.push(`after the 1.1.0 build the history held ${upgraded.history.join("; ")}`);
  }
  for (const [name, observed] of [
    ["1.0.0", boundary],
    ["1.1.0", upgraded],
  ] as const) {
    for (const text of ["pollMs", "token", SECRET]) {
      if (observed.history.some((row) => row.includes(text))) problems.push(`after the ${name} build the history stored ${text}`);
    }
  }
  return problems;
}

/** A negative control's loop: it processes the boundary height too. */
class CommitsTheBoundary extends FinalizedLoop {
  protected override lastHeight(): bigint | null {
    return this.input.boundary ?? super.lastHeight();
  }
}

/** A negative control's recording: the 1.1.0 build records its revision of `m` with every setting it has. */
const EVERY_SETTING: HistoryOptions = {
  recordedData: (entry) => (entry.id === "m" && entry.buildVersion ? entry.settings : recordedData(entry)),
};

describe.each(PROCESS_BACKENDS)("A47: the upgrade boundary (RN-12, CF-3, CF-8) on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A47: 1.0.0 records the scheduled 1.1.0 revision without configuration, commits 49, stops with upgrade-required, ready; 1.1.0 records the revision's data fields and continues from 50", async () => {
    const observed = await a47Run(await backend.database());
    expect(a47Problems(observed)).toEqual([]);
    // The 1.1.0 build delivered 49's on-after-db-write and n's on-stop-height again, then went on at 50. [RN-11]
    expect(observed.upgraded.log.slice(0, 4)).toEqual([
      "m on-after-db-write@49",
      "n on-after-db-write@49",
      "n on-stop-height@49",
      "m on-fetch@50",
    ]);
    const { log } = observed.boundary;
    expect(log.indexOf("n on-stop-height@49")).toBeGreaterThan(log.indexOf("n on-after-db-write@49"));
    expect(log.indexOf("n on-after-db-write@49")).toBeGreaterThan(log.indexOf("m on-db-write@49 k=1"));
  }, 300_000);

  it("refuses the 1.0.0 build at a restart once the cursor is at the boundary (CF-8)", async () => {
    const db = await backend.database();
    const m10 = moduleM("1.0.0", []);
    const entries = [
      core(db.setting),
      m10.entry({ start: 1, config: { k: 1 } }),
      entryOf(moduleN([]), 1, {}, 49),
      versionEntry({ id: "m", start: 50, version: "1.1.0" }),
    ];
    expect((await phase(db, buildOf("1.0.0"), entries, 60n)).cursor).toBe(49);
    const again = await phase(db, buildOf("1.0.0"), entries, 60n);
    const refusal = (again.ended as { refused: unknown }).refused;
    expect(refusal).toBeInstanceOf(UmbraError);
    expect(refusal).toMatchObject({ code: "upgrade-required", details: { height: 50n } });
    expect(again.log).toEqual([]);
    expect(again.cursor).toBe(49);
  }, 300_000);

  it("ends at the lower of the core's stop and the height before the boundary, at both when they are one height", async () => {
    const run = async (db: ProcessDatabase, stop: number) => {
      const m10 = moduleM("1.0.0", []);
      const entries = [
        core(db.setting, 1, { stop, extra: { listen: { api: "127.0.0.1:0" } } }),
        m10.entry({ start: 1, config: { k: 1 } }),
        entryOf(moduleN([]), 1, {}, 49),
        versionEntry({ id: "m", start: 50, version: "1.1.0" }),
      ];
      return phase(db, buildOf("1.0.0"), entries, 60n);
    };
    const db = await backend.database();
    const early = await run(db, 30);
    expect(early.ended).toEqual({ kind: "stopped", height: 30n, core: true, upgrade: null });
    expect(early.status.conditions).toEqual([]);
    expect(early.log).toContain("core-chain on-stop-height@30 core");
    // Raised to 49, the height before the boundary: the core stops and the boundary is reached at once.
    const both = await run(db, 49);
    expect(both.ended).toEqual({ kind: "stopped", height: 49n, core: true, upgrade: BOUNDARY });
    expect(both.status.conditions).toEqual([{ code: "upgrade-required", ...BOUNDARY }]);
    expect(both.log.slice(-2)).toEqual(["n on-stop-height@49", "core-chain on-stop-height@49 core"]);
    const late = await run(await backend.database(), 60);
    expect(late.ended).toEqual({ kind: "stopped", height: 49n, core: false, upgrade: BOUNDARY });
    expect(late.log).not.toContain("core-chain on-stop-height@49 core");
  }, 300_000);

  it("refuses a 1.1.0 that requires a resync on the database 1.0.0 wrote, with requires-resync (DB-10)", async () => {
    const db = await backend.database();
    const m10 = moduleM("1.0.0", []);
    const entries = [
      core(db.setting),
      m10.entry({ start: 1, config: { k: 1 } }),
      entryOf(moduleN([]), 1, {}, 49),
      versionEntry({ id: "m", start: 50, version: "1.1.0" }),
    ];
    expect((await phase(db, buildOf("1.0.0"), entries, 60n)).cursor).toBe(49);
    const resync = (log: string[]) => [{ ...moduleM("1.1.0", log), requiresResync: true } as ModuleDeclaration, moduleN(log)];
    const upgraded = [
      core(db.setting),
      versionEntry({ id: "m", start: 1, version: "1.0.0", config: { k: 1 } }),
      moduleM("1.1.0", []).entry({ start: 50, config: { k: 2 } }),
      entryOf(moduleN([]), 1, {}, 49),
    ];
    const refused = await phase(db, resync, upgraded, 60n);
    expect((refused.ended as { refused: unknown }).refused).toMatchObject({ code: "requires-resync" });
    expect(refused.cursor).toBe(49);
  }, 300_000);

  it("negative control: a loop that commits the boundary height fails A47", async () => {
    const problems = a47Problems(await a47Run(await backend.database(), { loop: CommitsTheBoundary }));
    expect(problems).toContain("the 1.0.0 build committed up to 50, not 49");
    expect(problems).toContain("the 1.0.0 build ran a callback at 50");
    expect(problems).toContain(
      'the 1.0.0 build\'s processing ended {"kind":"stopped","height":"50n","core":false,"upgrade":null}',
    );
  }, 300_000);

  it("negative control: recording the 1.1.0 revision with its operational and secret settings fails A47", async () => {
    const problems = a47Problems(await a47Run(await backend.database(), { history: EVERY_SETTING }));
    expect(problems).toEqual([
      `after the 1.1.0 build the history held m from 1: 1.0.0, {"k": 1}, hashed; m from 50: 1.1.0, {"k": 2, "token": "${SECRET}", "pollMs": 7}, hashed`,
      "after the 1.1.0 build the history stored pollMs",
      "after the 1.1.0 build the history stored token",
      `after the 1.1.0 build the history stored ${SECRET}`,
    ]);
  }, 300_000);
});
