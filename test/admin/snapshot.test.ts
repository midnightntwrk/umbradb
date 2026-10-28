import { describe, expect, it } from "vitest";
import { UNVALIDATED_CONFIG } from "../../src/admin/configuration.js";
import { ALLOWED_DETAILS, errorMessage, MAX_FINDINGS, sanitizedError } from "../../src/admin/errors.js";
import { earlyRedactor, shownSettings } from "../../src/admin/redaction.js";
import { DEFAULT_LIVENESS_TIMEOUT_MS, jsonReady, snapshotOf } from "../../src/admin/snapshot.js";
import { buildCoreVersion } from "../../src/config/build.js";
import { coreSettingsSchema, DEFAULT_ADMIN_ADDRESS } from "../../src/config/core-settings.js";
import { coreEntry } from "../../src/config/entries.js";
import { configRedactor, REDACTED, redactor } from "../../src/config/redact.js";
import { validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import type { DeclarationSet } from "../../src/modules/validation.js";
import { CallbackFailure } from "../../src/runner/dispatch.js";
import { reasonOf } from "../../src/runner/failures.js";
import { HeightFailure } from "../../src/runner/loop.js";
import { statusOf, type ProcessStatus, type StatusFacts } from "../../src/runner/process.js";

/**
 * The snapshot the runner publishes to the admin worker (task 8.1; AE-1, AE-3, AE-5, AE-6), and the helpers the
 * endpoints share: `status()` encoded for JSON — heights as decimal text, as JSON cannot hold a `bigint` (3.2's note
 * (d)) —, the reason as a sanitized error — its text built from the code and the reason's fields only, its details only
 * the allowlisted fields of the failure's own `UmbraError`, each text through the configuration's redaction (AE-6) —,
 * never `ended` (which holds the raw error); the settings as they may be shown (`/config`, 4.2's note (d)); the
 * redaction of a configuration not yet validated (what a process logs a refusal of its configuration through, task
 * 8.1b; Q127's admin address before the validation is gone with it, owner decision Q137 B).
 */

const PASSWORD = "pw-8-1-SECRET";
const DATABASE = `postgres://indexer:${PASSWORD}@db.example:5432/umbra`;
/** The same database as the `database` setting's parts (CF-4, owner decision Q167 A). */
const DATABASE_PARTS = { kind: "postgres", host: "db.example", port: 5432, user: "indexer", password: PASSWORD, name: "umbra" } as const;

/** `status()` from `facts` over a process that is `running` at 3. */
function status(facts: Partial<StatusFacts> = {}): ProcessStatus {
  return statusOf({
    phase: "running",
    start: 1n,
    cursor: 3n,
    head: 9n,
    followingThreshold: 3,
    readinessLag: null,
    conditions: [],
    ended: null,
    reason: null,
    ...facts,
  });
}

/** What a snapshot of a core process holds besides `status()` before startup resolved its parts (task 8.3). */
const FACTS = {
  redactor: null,
  config: UNVALIDATED_CONFIG,
  startedNs: 0n,
  side: "public" as const,
  instanceId: null,
  tipCap: 600,
  lastCommitMs: null,
  modules: null,
  digests: new Map(),
};

/** The build's declarations without modules. */
const NO_MODULES: DeclarationSet = { backbone: [], core: [], user: [] };

/** A validated configuration of one `core` revision on {@link DATABASE_PARTS}. */
function checked() {
  const entry = coreEntry({ start: 1, config: { network: "preprod", database: DATABASE_PARTS, node: "ws://node:9944" } });
  return validateConfig({ config: { data: { entries: [entry as never] } }, declarations: NO_MODULES as never, side: "public" });
}

describe("the snapshot of status() (AE-1, AE-3)", () => {
  it("holds the state, readiness, conditions, cursor, head and lag, heights as decimal text; never ended", () => {
    const upgrade = { code: "upgrade-required" as const, height: 50n, entries: [{ id: "m", start: 50, needed: "1.1.0", build: "1.0.0" }] };
    const retry = { code: "node-retrying" as const, attempts: 2, height: null };
    const given = status({ conditions: [upgrade, retry], ended: { kind: "failed", error: new Error(PASSWORD) } });
    const snapshot = snapshotOf(given, { ...FACTS, livenessTimeoutMs: 5_000, readinessLag: 12 });
    expect(snapshot).toEqual({
      livenessTimeoutMs: 5_000,
      readinessLag: 12,
      startedNs: "0",
      status: {
        state: "syncing",
        ready: true,
        conditions: [
          { code: "upgrade-required", height: "50", entries: [{ id: "m", start: 50, needed: "1.1.0", build: "1.0.0" }] },
          { code: "node-retrying", attempts: 2, height: null },
        ],
        cursor: "3",
        head: "9",
        lag: "6",
        reason: null,
        instance: { role: "core", id: null },
        lastCommitAt: null,
        node: { finalizedHead: "9", bestHead: null, connection: null, retries: 2, queueDepth: null, tipCap: 600, finalityStall: false },
        modules: null,
        ledger: null,
        privateInstances: null,
        public: null,
      },
      config: UNVALIDATED_CONFIG,
    });
    expect(JSON.stringify(snapshot)).not.toContain(PASSWORD);
    expect(Object.isFrozen(snapshot) && Object.isFrozen(snapshot.status) && Object.isFrozen(snapshot.status.conditions)).toBe(true);
    expect(Object.isFrozen(snapshot.status.conditions[0])).toBe(true);
    // A snapshot crosses to the worker as structured-clone data, and is JSON.
    expect(structuredClone(snapshot)).toEqual(snapshot);
    expect(JSON.parse(JSON.stringify(snapshot))).toEqual(snapshot);
  });

  it("before the first height: cursor, head and lag null", () => {
    const given = statusOf({ ...{ phase: "starting", start: null, cursor: null, head: null }, followingThreshold: 3, readinessLag: null, conditions: [], ended: null, reason: null });
    expect(snapshotOf(given, { ...FACTS, livenessTimeoutMs: 1, readinessLag: null }).status).toMatchObject({
      state: "starting",
      ready: false,
      conditions: [],
      cursor: null,
      head: null,
      lag: null,
      reason: null,
      lastCommitAt: null,
      modules: null,
    });
  });

  it("shows the reason as a sanitized error of the failure ended holds", () => {
    const failure = new HeightFailure(5n, new CallbackFailure("on-compute", "m", new Error(`failed with ${PASSWORD}`)), {
      point: "on-compute",
      module: "m",
      committed: false,
    });
    const reason = reasonOf(failure);
    const given = status({ phase: "halted", reason, ended: { kind: "failed", error: failure } });
    const snapshot = snapshotOf(given, { ...FACTS, livenessTimeoutMs: 1, readinessLag: null });
    expect(snapshot.status.reason).toEqual({
      code: "callback-error",
      height: "5",
      module: "m",
      point: "on-compute",
      message: "callback-error at height 5, module m, point on-compute",
      details: {},
    });
    expect(JSON.stringify(snapshot)).not.toContain(PASSWORD);
  });

  it("the liveness timeout before the configuration is validated is the core schemas' own default (CF-4, AE-2)", () => {
    for (const side of ["public", "private"] as const) {
      expect(DEFAULT_LIVENESS_TIMEOUT_MS).toBe(coreSettingsSchema(side).shape.livenessTimeoutMs.parse(undefined));
    }
    expect(DEFAULT_LIVENESS_TIMEOUT_MS).toBeGreaterThan(0);
  });

  it("jsonReady: bigints as decimal text at any depth, the rest as it is, frozen", () => {
    const ready = jsonReady({ a: 1n, b: [2n, { c: -3n }], d: "x", e: null, f: true, g: 1.5 });
    expect(ready).toEqual({ a: "1", b: ["2", { c: "-3" }], d: "x", e: null, f: true, g: 1.5 });
    expect(Object.isFrozen(ready) && Object.isFrozen((ready as { b: unknown[] }).b)).toBe(true);
    expect(jsonReady(12345678901234567890n)).toBe("12345678901234567890");
    expect(jsonReady(undefined)).toBe(null);
  });
});

describe("sanitized errors (AE-6: texts from codes and allowlisted fields only)", () => {
  const text = configRedactor(checked()).text;

  it("the message names the code and the reason's fields, nothing of the error's own message", () => {
    expect(errorMessage({ code: "migration-checksum-changed", height: null, module: "m", point: null })).toBe(
      "migration-checksum-changed, module m",
    );
    expect(errorMessage({ code: "listen-failed", height: null, module: null, point: null })).toBe("listen-failed");
    expect(errorMessage({ code: "callback-error", height: 0n, module: null, point: "on-start-db" })).toBe(
      "callback-error at height 0, point on-start-db",
    );
  });

  it("details: only the allowlisted fields of the failure's own UmbraError, each checked; the others dropped", () => {
    expect(ALLOWED_DETAILS.map((detail) => detail.name)).toEqual(["reason", "migration", "findings"]);
    const error = new UmbraError("migration-checksum-changed", `holds ${PASSWORD}`, {
      module: "m",
      migration: "001",
      position: 1,
      applied: "abc",
      build: "def",
      reason: "out-of-order",
      sql: `CREATE ROLE x PASSWORD '${PASSWORD}'`,
    });
    const shown = sanitizedError(reasonOf(error), error, redactor([PASSWORD]));
    expect(shown).toEqual({
      code: "migration-checksum-changed",
      height: null,
      module: "m",
      point: null,
      message: "migration-checksum-changed, module m",
      details: { reason: "out-of-order", migration: "001" },
    });
    expect(Object.isFrozen(shown) && Object.isFrozen(shown.details)).toBe(true);
    // A field whose value does not have its allowed form is dropped: free text never passes as a token or an id.
    const loose = new UmbraError("migration-missing", "x", { reason: `Free text with ${PASSWORD}`, migration: "001; DROP" });
    expect(sanitizedError(reasonOf(loose), loose, redactor([PASSWORD])).details).toEqual({});
  });

  it("details come from the error the reason's code is, inside the runner's wrappers, and need a redactor", () => {
    const inner = new UmbraError("truncate-not-allowed", "x", { reason: "truncate" });
    const wrapped = new HeightFailure(7n, new CallbackFailure("on-db-write", "m", inner), {
      point: "on-db-write",
      module: "m",
      committed: false,
    });
    expect(sanitizedError(reasonOf(wrapped), wrapped, redactor([])).details).toEqual({ reason: "truncate" });
    // Without a redactor (nothing yet knows the configuration's secrets) no detail is shown.
    expect(sanitizedError(reasonOf(wrapped), wrapped, null).details).toEqual({});
    // An error whose code is not the reason's gives none (a callback's own UmbraError of another code).
    const other = new CallbackFailure("on-compute", "m", new UmbraError("database-error", "x", { reason: "nested-call" }));
    expect(sanitizedError({ ...reasonOf(other), code: "callback-error" }, other, redactor([])).details).toEqual({});
    expect(sanitizedError(reasonOf(new Error("plain")), "not an error", redactor([])).details).toEqual({});
  });

  it("invalid-configuration's findings: path and message only, through the redaction, at most MAX_FINDINGS", () => {
    const findings = [
      { rule: "settings-schema", path: "entries[0].config.livenessTimeoutMs", message: `expected number (${DATABASE})`, field: "x" },
      { path: 3, message: "not a finding" },
      "not an object",
    ];
    const error = new UmbraError("invalid-configuration", "x", { file: "/home/u/umbradb.config.ts", reason: "invalid-entries", findings });
    const shown = sanitizedError(reasonOf(error), error, { text } as never);
    expect(shown.details).toEqual({
      reason: "invalid-entries",
      // The database's password is a secret of the configuration (CF-4, Q167 A), and a URL's userinfo is redacted.
      findings: [
        { path: "entries[0].config.livenessTimeoutMs", message: `expected number (postgres://${REDACTED}@db.example:5432/umbra)` },
      ],
    });
    expect(JSON.stringify(shown)).not.toContain(PASSWORD);
    const many = new UmbraError("invalid-configuration", "x", {
      findings: Array.from({ length: MAX_FINDINGS + 5 }, (_, index) => ({ path: `entries[${index}]`, message: "m" })),
    });
    expect((sanitizedError(reasonOf(many), many, redactor([])).details.findings as unknown[]).length).toBe(MAX_FINDINGS);
    expect(sanitizedError(reasonOf(error), new UmbraError("invalid-configuration", "x", { findings: "x" }), redactor([])).details).toEqual({});
    // The allowlist is the one given: none allowed, none shown.
    expect(sanitizedError(reasonOf(error), error, redactor([]), []).details).toEqual({});
  });
});

describe("the settings as they may be shown (4.2's note (d)), and the early redaction (Q127)", () => {
  it("a revision of the build's version: secret fields and parts redacted, the others' strings through the redaction", () => {
    const config = checked();
    const [entry] = config.entries;
    const shown = shownSettings(configRedactor(config), entry as never);
    expect(shown).toMatchObject({
      network: "preprod",
      database: { ...DATABASE_PARTS, password: REDACTED, ssl: "require" },
      node: REDACTED,
      listen: { admin: DEFAULT_ADMIN_ADDRESS },
    });
    expect(JSON.stringify(shown)).not.toContain(PASSWORD);
  });

  it("a versionEntry: every field redacted until its row was found equal to it, then shown as data", () => {
    const entry = { settings: { pollMs: 5, url: DATABASE }, kinds: null };
    expect(shownSettings(redactor([]), entry)).toEqual({ pollMs: REDACTED, url: REDACTED });
    expect(shownSettings(redactor([]), entry, true)).toEqual({ pollMs: 5, url: `postgres://${REDACTED}@db.example:5432/umbra` });
    expect(shownSettings(redactor([]), { settings: null, kinds: null })).toEqual({});
  });

  it("earlyRedactor: the configuration's secrets as the validation would read them; without one, URL credentials only", () => {
    const data = { entries: [{ id: "core", start: 1, version: buildCoreVersion(), config: { database: DATABASE_PARTS, node: "ws://n" } }] };
    const early = earlyRedactor({ config: { data }, declarations: NO_MODULES as never, side: "public" });
    expect(early.text(`password ${PASSWORD} and ${encodeURIComponent(PASSWORD)}`)).toBe(`password ${REDACTED} and ${REDACTED}`);
    expect(earlyRedactor(undefined).text(`see ${DATABASE}`)).toBe(`see postgres://${REDACTED}@db.example:5432/umbra`);
    expect(earlyRedactor(undefined).text(PASSWORD)).toBe(PASSWORD);
  });
});
