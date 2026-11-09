import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { startUmbraDB } from "../../src/library/start-umbradb.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";
import { PROCESS_BACKENDS, type ProcessBackend } from "../runner/process-backends.js";
import { freePort } from "../runner/process-harness.js";
import { libraryData } from "./library-fixtures.js";
import { commandRefusalProblems, type Expected, listeningSockets, refusedProblems } from "./network-refusals.js";

/**
 * The schema case's committed negative control, through the criterion's own oracle (`./network-refusals.ts`), with
 * the fault put back in the schema itself — `../../src/config/core-settings.ts` replaced here: the public `core`
 * schema without its `transportReader` rule (a PostgreSQL database with `listen.privateLink` written needs a reader
 * login), its issue dropped and the settings otherwise validated as given. `startUmbraDB` with `publicSide: true` and
 * `umbradb run` on the same configuration are then not refused through the schema, and the oracle fails for both; with
 * the real schema, in the same file, it passes. On PostgreSQL 18 (Docker).
 */

const control = vi.hoisted(() => ({ withoutRule: false }));

vi.mock("../../src/config/core-settings.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/config/core-settings.js")>();
  type Parsed = ReturnType<typeof actual.PUBLIC_CORE_SCHEMA.safeParse>;
  /** The public schema's `safeParse` without the `transportReader` rule: its issue dropped, the rest as validated. */
  const withoutRule = (value: unknown): Parsed => {
    const parsed = actual.PUBLIC_CORE_SCHEMA.safeParse(value);
    if (parsed.success) return parsed;
    const others = parsed.error.issues.filter((issue) => issue.path.join(".") !== "transportReader");
    if (others.length > 0 || typeof value !== "object" || value === null) return parsed;
    // Only the rule refused it: the settings validated as they would be with a reader login, given back without one.
    const read = actual.PUBLIC_CORE_SCHEMA.safeParse({ ...value, transportReader: { user: "control" } });
    if (!read.success) return parsed;
    const { transportReader: _reader, ...data } = read.data;
    return { success: true, data } as Parsed;
  };
  const lenient = new Proxy(actual.PUBLIC_CORE_SCHEMA, {
    get: (target, key, receiver) => (key === "safeParse" ? withoutRule : Reflect.get(target, key, receiver)),
  });
  return {
    ...actual,
    coreSettingsSchema: (side: Parameters<typeof actual.coreSettingsSchema>[0]) =>
      control.withoutRule && side === "public" ? lenient : actual.coreSettingsSchema(side),
  };
});

describe("schema case: its negative control on PostgreSQL 18", () => {
  const backend = PROCESS_BACKENDS.find((one) => one.kind === "postgres") as ProcessBackend;
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  /** The oracle's problems for startUmbraDB and for umbradb run on the schema case, under {@link control}. */
  async function schemaCase(): Promise<{ readonly library: string[]; readonly command: string[] }> {
    const written = await freePort();
    const finding = "entries[0].config.transportReader";
    const expected: Expected = { code: "invalid-configuration", reason: null, finding, ports: [written] };
    const db = await backend.database();
    const sockets = listeningSockets();
    const handle = startUmbraDB({
      config: { data: libraryData(db.setting, [], { listen: { privateLink: `127.0.0.1:${written}` } }) },
      source: new InMemoryBlockSource({ head: 3n }),
      network: { privateLink: { publicSide: true } },
    });
    let library: string[];
    try {
      library = await refusedProblems(handle, db, expected, sockets, 5_000);
    } finally {
      await handle.stop();
      await handle.closed;
    }
    const command = await commandRefusalProblems((await backend.database()).setting, written, finding);
    return { library, command };
  }

  it("the schema without its transportReader rule lets both starts past it, and the oracle fails for each; the real schema passes", async () => {
    control.withoutRule = true;
    let faulted: Awaited<ReturnType<typeof schemaCase>>;
    try {
      faulted = await schemaCase();
    } finally {
      control.withoutRule = false;
    }
    expect(faulted.library.some((problem) => problem === "no finding at entries[0].config.transportReader" || problem.startsWith("refused with ") || problem === "startup completed"), faulted.library.join("; ")).toBe(true);
    expect(faulted.command, faulted.command.join("; ")).toContain("umbradb run logged no finding at entries[0].config.transportReader");
    expect(await schemaCase()).toEqual({ library: [], command: [] });
  }, 300_000);
});
