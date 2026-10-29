import type { AdminStarter } from "../../src/admin/server.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import { ask, statusWhen } from "../admin/admin-harness.js";
import type { PrivateBackend } from "./backends.js";
import { adminOrigin, launchPrivate, launchPublicCore, type PrivateProcess, type PublicCore } from "./builds.js";

/**
 * What the core's `/status` shows of each private instance: only its id, whether it is connected, whether it is
 * lockstep, and its synced height. Keys are not checked here: they belong to a module, not the core. Shared by
 * `privacy.test.ts` and its negative control's file; imports nothing of Vitest. [A120, PP-9, AE-5, Q154]
 *
 * **The run** ({@link instancesRun}): a public core — its transport and admin endpoints on free ports, the instance
 * `keeper` in `lockstepInstances` (unless the run is independent) — and two private instances connected to its
 * transport, each with its admin endpoints: `keeper` and `other`, independent. On PostgreSQL each reads the public
 * database directly as a reader; on PGlite through the core. Once all three are at the head, each process's `/status`
 * is read when it shows where the processes are (the heartbeat publishes within a second).
 */

/** What the run read. */
export interface InstancesRun {
  readonly head: bigint;
  readonly lockstep: boolean;
  /** Where each process got to: the core's cursor, each instance's. */
  readonly cursors: { readonly core: bigint | null; readonly keeper: bigint | null; readonly other: bigint | null };
  /** The `/status` bodies at the end. */
  readonly status: Readonly<Record<"core" | "keeper" | "other", Record<string, unknown>>>;
}

/** Options of {@link instancesRun}. */
export interface InstancesOptions {
  /** The heights to process. */
  readonly head: bigint;
  /** Whether `keeper` is a lockstep instance. */
  readonly lockstep: boolean;
  /** A negative control's admin starter of the core. */
  readonly coreAdmin?: AdminStarter;
}

/** Waits for a process's admin origin (its log line). */
export async function originOf(lines: readonly string[], what: string): Promise<string> {
  const deadline = Date.now() + 120_000;
  for (;;) {
    const origin = adminOrigin(lines);
    if (origin !== null) return origin;
    if (Date.now() > deadline) throw new Error(`${what} never logged its admin endpoints' address: ${lines.join(" | ")}`);
    await new Promise((resolve) => setTimeout(resolve, 20));
  }
}

/** Runs the scenario (see the module comment) on `backend` and reads each process's `/status`. [A120] */
export async function instancesRun(backend: PrivateBackend, options: InstancesOptions): Promise<InstancesRun> {
  const { head, lockstep } = options;
  const publicDb = await backend.database("public");
  const core: PublicCore = launchPublicCore({
    database: publicDb.setting,
    head,
    extra: { listen: { transport: "127.0.0.1:0", admin: "127.0.0.1:0" }, ...(lockstep ? { lockstepInstances: ["keeper"] } : {}) },
    admin: options.coreAdmin === undefined ? true : options.coreAdmin,
  });
  const instances: PrivateProcess[] = [];
  try {
    await core.handle.started;
    const transport = await core.transportWithin(120_000);
    const lines = { keeper: [] as string[], other: [] as string[] };
    const reading = async (instanceId: "keeper" | "other") => {
      const db = await backend.database("private");
      return launchPrivate({
        database: db.setting,
        coreTransport: transport,
        ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as DatabaseParts } : {}),
        extra: { listen: { admin: "127.0.0.1:0" } },
        admin: true,
        instanceId,
        lines: lines[instanceId],
      });
    };
    const keeper = await reading("keeper");
    instances.push(keeper);
    // One start after the other: on PostgreSQL both provision the same cluster-wide module roles at startup, which two
    // starts at one instant race for (issue 00030-concurrent-role-provisioning).
    await keeper.handle.started;
    const other = await reading("other");
    instances.push(other);
    await other.handle.started;
    await core.advance(head);
    await keeper.reach(head);
    await other.reach(head);
    const origins = {
      core: await originOf(core.lines, "the core"),
      keeper: await originOf(lines.keeper, "keeper"),
      other: await originOf(lines.other, "other"),
    };
    type Shown = {
      readonly cursor: string | null;
      readonly privateInstances: readonly { readonly id: string; readonly height: string | null }[] | null;
      readonly public: { readonly cursor: string | null } | null;
    };
    // The core's view of both instances — keeper at the head when lockstep —, each instance's cursor and public cursor.
    await statusWhen(
      origins.core,
      (body) => {
        const known = (body as unknown as Shown).privateInstances ?? [];
        const keeperShown = known.find((instance) => instance.id === "keeper");
        const keeperKnown = keeperShown !== undefined && (!lockstep || keeperShown.height === String(head));
        return keeperKnown && known.some((instance) => instance.id === "other");
      },
      120_000,
    );
    for (const origin of [origins.keeper, origins.other]) {
      const shows = (body: unknown): boolean =>
        (body as Shown).cursor === String(head) && (body as Shown).public?.cursor === String(head);
      await statusWhen(origin, shows, 120_000);
    }
    const status = {
      core: JSON.parse((await ask(origins.core, "/status")).text) as Record<string, unknown>,
      keeper: JSON.parse((await ask(origins.keeper, "/status")).text) as Record<string, unknown>,
      other: JSON.parse((await ask(origins.other, "/status")).text) as Record<string, unknown>,
    };
    const cursors = { core: core.handle.status().cursor, keeper: keeper.handle.status().cursor, other: other.handle.status().cursor };
    return { head, lockstep, cursors, status };
  } finally {
    for (const instance of instances) await instance.stop();
    await core.stop();
  }
}

/** The four fields `/status` shows of an instance on the core. [PP-9] */
const INSTANCE_FIELDS = ["connected", "height", "id", "lockstep"];

/**
 * The oracle: every problem. There is none when every process reached the head and:
 * - the core's `/status` shows each instance with exactly its id, connection, lockstep flag and synced height
 *   (`keeper` lockstep at the head, `other` connected and independent);
 * - each instance's `/status` shows its public cursor and lockstep flag, and no instances of its own.
 * [A120]
 */
export function instancesProblems(run: InstancesRun): string[] {
  const problems: string[] = [];
  const { head } = run;
  for (const [name, cursor] of Object.entries(run.cursors)) if (cursor !== head) problems.push(`${name} stopped at ${cursor}, not ${head}`);
  const instances = run.status.core.privateInstances as readonly Record<string, unknown>[] | null;
  if (!Array.isArray(instances)) {
    problems.push(`the core's /status shows privateInstances ${JSON.stringify(instances)}, not a list`);
  } else {
    for (const instance of instances) {
      if (JSON.stringify(Object.keys(instance).sort()) !== JSON.stringify(INSTANCE_FIELDS)) {
        problems.push(`the core's /status shows ${JSON.stringify(instance)} of an instance: other fields than id, connected, lockstep, height`);
      }
    }
    if (JSON.stringify(instances.map((instance) => instance.id).sort()) !== JSON.stringify(["keeper", "other"])) {
      problems.push(`the core's /status shows the instances ${JSON.stringify(instances.map((instance) => instance.id))}`);
    }
    const keeper = instances.find((instance) => instance.id === "keeper");
    const other = instances.find((instance) => instance.id === "other");
    if (run.lockstep && JSON.stringify(keeper) !== JSON.stringify({ id: "keeper", connected: true, lockstep: true, height: String(head) })) {
      problems.push(`the core's /status shows keeper as ${JSON.stringify(keeper)}`);
    }
    if (!run.lockstep && (keeper?.connected !== true || keeper.lockstep !== false)) {
      problems.push(`the core's /status shows keeper as ${JSON.stringify(keeper)}`);
    }
    if (other?.connected !== true || other.lockstep !== false) problems.push(`the core's /status shows other as ${JSON.stringify(other)}`);
  }
  for (const [name, lockstep] of [
    ["keeper", run.lockstep],
    ["other", false],
  ] as const) {
    const shown = run.status[name];
    const wanted = JSON.stringify({ cursor: String(head), lockstep });
    if (JSON.stringify(shown.public) !== wanted) problems.push(`${name}'s /status shows public ${JSON.stringify(shown.public)}, not ${wanted}`);
    if (shown.privateInstances !== null) problems.push(`${name}'s /status shows privateInstances ${JSON.stringify(shown.privateInstances)}`);
  }
  return problems;
}
