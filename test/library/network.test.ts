import { existsSync } from "node:fs";
import { createServer } from "node:net";
import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { coreEntry } from "../../src/config/entries.js";
import type { DatabaseParts } from "../../src/config/database-parts.js";
import type { PrivateLinkChannel } from "../../src/library/channels.js";
import { engineInputOf, handleOf, startUmbraDB, type UmbraDBHandle, type UmbraDBOptions } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { NETWORK_RULES, type NetworkRuleName } from "../../src/runner/resolve.js";
import { PROCESS_BACKENDS, type ProcessBackend, type ProcessDatabase } from "../runner/process-backends.js";
import { freePort } from "../runner/process-harness.js";
import { coreSettings, startProcess } from "../runner/process-build.js";
import { libraryData } from "./library-fixtures.js";

/**
 * The network plan's refusals through `startUmbraDB` `[CI][NEG]` (L15–L18): a host's request at odds with the
 * addresses the configuration writes is refused at startup's configuration step — `started` rejects with
 * `network-address-conflict` (`both`, `no-address`, `unused`) or `private-link-misconfigured` (`wrong-side`,
 * `reader-missing`), the process ends `refused` by itself (`closed` resolves), and nothing was opened: no listener (no
 * listening socket in this process, the addresses involved still free), no database (no PGlite directory, no schema on
 * PostgreSQL). On PostgreSQL 18 (Docker) and a PGlite directory. Each case's committed negative control starts the
 * engine with the facade's exact input but the plan without that rule (`networkRules`): the oracle then fails, for the
 * rule's own reason. The plan's every row is in `test/runner/network-plan.test.ts`. [LM-3, LM-10, L15–L18]
 */

/** How long a refused process may take to end by itself on a loaded machine. */
const ENDS_WITHIN_MS = 30_000;

/** How long a negative control's startup is given to settle: a class-A refusal takes well under it. */
const CONTROL_SETTLES_MS = 5_000;

/** The listening sockets of this process (each is a `TCPServerWrap`). */
const listeningSockets = (): number =>
  process.getActiveResourcesInfo().filter((resource) => resource === "TCPServerWrap").length;

/** Whether `port` on 127.0.0.1 is free: nothing listens there. */
function portFree(port: number): Promise<boolean> {
  return new Promise((resolve) => {
    const server = createServer();
    server.once("error", () => resolve(false));
    server.listen(port, "127.0.0.1", () => server.close(() => resolve(true)));
  });
}

/** A private process's configuration data on `database`: the tests' network, no `node`, `extra` settings. */
function privateData(database: DatabaseParts, extra: Readonly<Record<string, unknown>> = {}) {
  const { node: _node, ...settings } = coreSettings(database);
  return { entries: [coreEntry({ start: 1, config: { ...settings, instanceId: "network-private", ...extra } as never })] };
}

const connect = async (): Promise<PrivateLinkChannel> => {
  throw new Error("the plan's tests never connect");
};

/**
 * What a case expects: the refusal's code and reason (or, for the schema's refusal, the path of its finding), and the
 * ports it names, which must stay free.
 */
interface Expected {
  readonly code: "network-address-conflict" | "private-link-misconfigured" | "invalid-configuration";
  readonly reason: NetworkRuleName | null;
  readonly finding?: string;
  readonly ports: readonly number[];
}

/**
 * The oracle (see the module comment): every problem of `handle`, started on `db`, against `expected`; none when it was
 * refused so and opened nothing. `sockets` is this process's count of listening sockets before the start.
 */
async function refusedProblems(
  handle: UmbraDBHandle,
  db: ProcessDatabase,
  expected: Expected,
  sockets: number,
  settlesMs = ENDS_WITHIN_MS,
): Promise<string[]> {
  const problems: string[] = [];
  const settled = await Promise.race([
    handle.started.then(
      () => ({ error: null }),
      (error: unknown) => ({ error }),
    ),
    sleep(settlesMs, "pending" as const),
  ]);
  if (settled === "pending") problems.push(`startup did not settle within ${settlesMs} ms`);
  else if (settled.error === null) problems.push("startup completed");
  else {
    const error = settled.error as { code?: unknown; details?: { reason?: unknown; findings?: readonly { path?: unknown }[] } };
    if (error.code !== expected.code) problems.push(`refused with ${String(error.code)}, not ${expected.code}`);
    else if (expected.reason !== null && error.details?.reason !== expected.reason) {
      problems.push(`refused for ${String(error.details?.reason)}, not ${expected.reason}`);
    }
    if (expected.finding !== undefined && !(error.details?.findings ?? []).some((one) => one.path === expected.finding)) {
      problems.push(`no finding at ${expected.finding}`);
    }
  }
  const during = listeningSockets();
  if (during !== sockets) problems.push(`${during - sockets} listening socket(s) while it ran`);
  for (const port of expected.ports) if (!(await portFree(port))) problems.push(`port ${port} is bound`);
  // Only a refusal of the configuration step ends the process by itself: one that started, or was refused later, is
  // given a moment only, its problem already found.
  const patience = problems.length === 0 ? ENDS_WITHIN_MS : 500;
  if (settled === "pending" || !(await Promise.race([handle.closed.then(() => true), sleep(patience, false)]))) {
    problems.push("the process did not end by itself");
  }
  const status = handle.status();
  if (status.state !== "refused") problems.push(`the process is ${status.state}, not refused`);
  if (status.reason?.code !== expected.code) problems.push(`its reason is ${status.reason?.code ?? "none"}`);
  const { listening } = status;
  if (listening.api !== null || listening.admin !== null || listening.privateLink !== null) {
    problems.push(`listening ${JSON.stringify(listening)}`);
  }
  if (db.directory !== undefined && existsSync(db.directory)) problems.push("its database directory exists");
  if (db.directory === undefined) {
    const [row] = await db.query("SELECT to_regnamespace('core_chain') IS NULL AS fresh");
    if (row?.fresh !== true) problems.push("its PostgreSQL database was migrated");
  }
  return problems;
}

/** The facade over the engine started with `options`' exact input but the network plan without `rule`. [L15–L18] */
function startWithout(rule: NetworkRuleName, options: UmbraDBOptions): UmbraDBHandle {
  const { input, log } = engineInputOf(options);
  return handleOf(startProcess({ ...input, networkRules: NETWORK_RULES.filter((one) => one.name !== rule) }), log);
}

/** Runs the oracle on `startUmbraDB(options)` and, with `rule` removed, on its negative control. */
async function judged(
  backend: ProcessBackend,
  options: (db: ProcessDatabase) => UmbraDBOptions,
  expected: Expected,
  rule: NetworkRuleName | null,
): Promise<{ readonly problems: string[]; readonly control: string[] | null }> {
  const db = await backend.database();
  const sockets = listeningSockets();
  const handle = startUmbraDB(options(db));
  let problems: string[];
  try {
    problems = await refusedProblems(handle, db, expected, sockets);
  } finally {
    await handle.stop();
  }
  if (rule === null) return { problems, control: null };
  const other = await backend.database();
  const controlSockets = listeningSockets();
  const control = startWithout(rule, options(other));
  try {
    return { problems, control: await refusedProblems(control, other, expected, controlSockets, CONTROL_SETTLES_MS) };
  } finally {
    await control.stop();
    await control.closed;
  }
}

describe.each(PROCESS_BACKENDS)("the network plan's refusals through startUmbraDB on $name (L15–L18)", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("L15: listen.api written and api: { port } in code is refused network-address-conflict (both); no port opened", async () => {
    const written = await freePort();
    const given = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting, [], { listen: { api: `127.0.0.1:${written}` } }) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { api: { port: given } },
      }),
      { code: "network-address-conflict", reason: "both", ports: [written, given] },
      "both",
    );
    expect(problems).toEqual([]);
    // Without the rule the address given in code wins: the process starts and listens there.
    expect(control).toEqual(expect.arrayContaining(["startup completed", `port ${given} is bound`]));
  }, 240_000);

  it("L15: a private process's privateLink written and privateSide: { port } in code is refused network-address-conflict (both)", async () => {
    const written = await freePort();
    const given = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: privateData(db.setting, { privateLink: `127.0.0.1:${written}` }) },
        network: { privateLink: { privateSide: { port: given } } },
      }),
      { code: "network-address-conflict", reason: "both", ports: [written, given] },
      "both",
    );
    expect(problems).toEqual([]);
    // Without the rule it connects to the address in code, where no core listens: its startup waits there.
    expect(control).toContain(`startup did not settle within ${CONTROL_SETTLES_MS} ms`);
  }, 240_000);

  it("L16: admin: true with no listen.admin written is refused network-address-conflict (no-address); no admin thread", async () => {
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { admin: true },
      }),
      { code: "network-address-conflict", reason: "no-address", ports: [] },
      "no-address",
    );
    expect(problems).toEqual([]);
    expect(control).toContain("startup completed");
  }, 240_000);

  it("L17: listen.api written and api not requested is refused network-address-conflict (unused)", async () => {
    const written = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting, [], { listen: { api: `127.0.0.1:${written}` } }) },
        source: new InMemoryBlockSource({ head: 3n }),
      }),
      { code: "network-address-conflict", reason: "unused", ports: [written] },
      "unused",
    );
    expect(problems).toEqual([]);
    expect(control).toContain("startup completed");
  }, 240_000);

  it("L17: listen.privateLink written while publicSide is { channels: true } is refused network-address-conflict (unused)", async () => {
    const written = await freePort();
    const reader = backend.kind === "postgres" ? { transportReader: { user: "reader", password: "reader" } } : {};
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting, [], { listen: { privateLink: `127.0.0.1:${written}` }, ...reader }) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { privateLink: { publicSide: { channels: true } } },
      }),
      { code: "network-address-conflict", reason: "unused", ports: [written] },
      "unused",
    );
    expect(problems).toEqual([]);
    expect(control).toContain("startup completed");
  }, 240_000);

  it("L17: a private process's privateLink written while privateSide is { connect } is refused network-address-conflict (unused)", async () => {
    const written = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: privateData(db.setting, { privateLink: `127.0.0.1:${written}` }) },
        network: { privateLink: { privateSide: { connect } } },
      }),
      { code: "network-address-conflict", reason: "unused", ports: [written] },
      "unused",
    );
    expect(problems).toEqual([]);
    expect(control?.some((problem) => problem.startsWith("refused with ") || problem.startsWith("startup did not"))).toBe(true);
  }, 240_000);

  it("L18: privateSide on a public process is refused private-link-misconfigured (wrong-side)", async () => {
    const given = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { privateLink: { privateSide: { port: given } } },
      }),
      { code: "private-link-misconfigured", reason: "wrong-side", ports: [given] },
      "wrong-side",
    );
    expect(problems).toEqual([]);
    expect(control).toContain("startup completed");
  }, 240_000);

  it("L18: publicSide on a private process is refused private-link-misconfigured (wrong-side)", async () => {
    const given = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: privateData(db.setting) },
        network: { privateLink: { publicSide: { port: given } } },
      }),
      { code: "private-link-misconfigured", reason: "wrong-side", ports: [given] },
      "wrong-side",
    );
    expect(problems).toEqual([]);
    // Without the rule the request is not read: the process has no link, so the refusal is its public side's.
    expect(control).toEqual(expect.arrayContaining(["refused with invalid-configuration, not private-link-misconfigured"]));
  }, 240_000);
});

describe("the reader login of a public link given in the request, on PostgreSQL 18 (L18, N5)", () => {
  const backend = PROCESS_BACKENDS.find((one) => one.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("L18: publicSide: { channels: true } without transportReader is refused private-link-misconfigured (reader-missing)", async () => {
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { privateLink: { publicSide: { channels: true } } },
      }),
      { code: "private-link-misconfigured", reason: "reader-missing", ports: [] },
      "reader-missing",
    );
    expect(problems).toEqual([]);
    expect(control).toContain("startup completed");
  }, 240_000);

  it("L18: publicSide: { host, port } without transportReader is refused private-link-misconfigured (reader-missing)", async () => {
    const given = await freePort();
    const { problems, control } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { privateLink: { publicSide: { host: "127.0.0.1", port: given } } },
      }),
      { code: "private-link-misconfigured", reason: "reader-missing", ports: [given] },
      "reader-missing",
    );
    expect(problems).toEqual([]);
    // Without the rule the link has no reader login to read as: startup fails later, not with this refusal.
    expect(control?.some((problem) => problem.startsWith("refused with ") || problem === "startup completed")).toBe(true);
  }, 240_000);

  it("L18: publicSide: true with listen.privateLink written and no transportReader is refused by the schema, as umbradb run is (A177)", async () => {
    const written = await freePort();
    const { problems } = await judged(
      backend,
      (db) => ({
        config: { data: libraryData(db.setting, [], { listen: { privateLink: `127.0.0.1:${written}` } }) },
        source: new InMemoryBlockSource({ head: 3n }),
        network: { privateLink: { publicSide: true } },
      }),
      { code: "invalid-configuration", reason: null, finding: "entries[0].config.transportReader", ports: [written] },
      null,
    );
    expect(problems).toEqual([]);
  }, 240_000);
});
