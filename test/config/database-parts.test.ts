import { describe, expect, it } from "vitest";
import { z } from "zod";
import { databaseSetting, PRIVATE_CORE_SCHEMA, PUBLIC_CORE_SCHEMA } from "../../src/config/core-settings.js";
import { databaseText, defaultSsl } from "../../src/config/database-parts.js";
import { coreEntry } from "../../src/config/entries.js";
import { configRedactor, REDACTED } from "../../src/config/redact.js";
import { fieldKinds, validateConfig } from "../../src/config/validate.js";
import { UmbraError } from "../../src/db/errors.js";
import { CORE_SETTINGS } from "./config-fixtures.js";
import { input, PRIVATE_SETTINGS } from "./validate-fixtures.js";

/**
 * A170's schema half and A177's `ssl` defaults (task 4.5; CF-4, CF-10; owner decisions Q167 A, Q175 A, Q182 B): the
 * `database` setting and a private process's `publicDatabase` are parts — PostgreSQL's `{ kind, host, port, user,
 * password, name, ssl }`, PGlite's `{ kind, path }` or `{ kind, memory: true }` —; a connection string in either is
 * refused by its schema with its path; `ssl` defaults to `disable` for a loopback host or a socket directory and to
 * `require` for another host; only `password` is secret, the other parts shown; `core.transportReader` is required on
 * PostgreSQL with `listen.transport` and refused on PGlite. The committed negative control is the last `describe`: a
 * `database` schema that also takes a URL (the setting before task 4.5) fails {@link connectionStringProblems}.
 */

/** The connection strings the setting took before task 4.5, and others a hand may write. */
const CONNECTION_STRINGS = [
  "postgres://umbradb:hunter2@db.internal:5432/indexer",
  "postgresql://db.internal/indexer?sslmode=require",
  "pglite:memory",
  "pglite:data/preview",
  "host=db.internal dbname=indexer",
];

/**
 * What is wrong with `schema` (a `database` setting's schema) as A170 wants it: each connection string it accepts, and
 * each refusal whose path is not the field's own or whose message does not say a connection string is refused.
 */
function connectionStringProblems(schema: z.ZodType): string[] {
  const problems: string[] = [];
  const field = z.strictObject({ database: schema });
  for (const text of CONNECTION_STRINGS) {
    const parsed = field.safeParse({ database: text });
    if (parsed.success) {
      problems.push(`accepted ${text}`);
      continue;
    }
    const [issue] = parsed.error.issues;
    if (JSON.stringify(issue?.path) !== '["database"]') problems.push(`${text}: refused at ${JSON.stringify(issue?.path)}`);
    if (!/connection string/.test(issue?.message ?? "")) problems.push(`${text}: refused as ${issue?.message}`);
  }
  return problems;
}

/** A PostgreSQL database's parts on `host`, with a password. */
const postgresOn = (host: string, rest: Record<string, unknown> = {}) => ({
  kind: "postgres",
  host,
  user: "umbradb",
  password: "hunter2-secret",
  name: "indexer",
  ...rest,
});

/** The findings of validating a public configuration whose `core` settings are `settings`, or [] when it passes. */
function findings(settings: Record<string, unknown>, side: "public" | "private" = "public") {
  try {
    validateConfig(input({ entries: [{ ...coreEntry({ start: 0, config: CORE_SETTINGS }), config: settings }] }, side));
    return [];
  } catch (error) {
    if (!(error instanceof UmbraError)) throw error;
    return (error.details as { findings: { path: string; message: string }[] }).findings.map(({ path, message }) => ({
      path,
      message,
    }));
  }
}

describe("A170: database and publicDatabase are parts, never a connection string (CF-4, Q167)", () => {
  it("the public and the private schemas accept each kind of parts, defaults applied", () => {
    const parse = (database: unknown) => PUBLIC_CORE_SCHEMA.parse({ ...CORE_SETTINGS, database }).database;
    expect(parse(postgresOn("db.internal"))).toEqual({ ...postgresOn("db.internal"), port: 5432, ssl: "require" });
    expect(parse({ kind: "postgres", host: "db.internal", port: 6543, user: "u", name: "n", ssl: "verify-full" })).toEqual(
      { kind: "postgres", host: "db.internal", port: 6543, user: "u", name: "n", ssl: "verify-full" },
    );
    expect(parse({ kind: "pglite", path: "data/preview" })).toEqual({ kind: "pglite", path: "data/preview" });
    expect(parse({ kind: "pglite", memory: true })).toEqual({ kind: "pglite", memory: true });
    const privately = PRIVATE_CORE_SCHEMA.parse({ ...PRIVATE_SETTINGS, publicDatabase: postgresOn("db.internal") });
    expect(privately.publicDatabase).toEqual({ ...postgresOn("db.internal"), port: 5432, ssl: "require" });
  });

  it("a connection string in database or publicDatabase is refused by its schema, with its path", () => {
    expect(connectionStringProblems(PUBLIC_CORE_SCHEMA.shape.database)).toEqual([]);
    expect(connectionStringProblems(PRIVATE_CORE_SCHEMA.shape.publicDatabase)).toEqual([]);
    for (const text of CONNECTION_STRINGS) {
      expect(findings({ ...CORE_SETTINGS, database: text }).map((found) => found.path)).toEqual(["entries[0].config.database"]);
      const privately = findings({ ...PRIVATE_SETTINGS, publicDatabase: text }, "private");
      expect(privately.map((found) => found.path)).toEqual(["entries[0].config.publicDatabase"]);
      // The message never repeats the value (its password among it).
      expect(JSON.stringify(privately)).not.toContain("hunter2");
    }
  });

  it("wrong parts are refused with the part's path: a missing user, a port out of range, an unknown ssl, both PGlite forms", () => {
    const path = (database: unknown) => findings({ ...CORE_SETTINGS, database }).map((found) => found.path);
    expect(path({ kind: "postgres", host: "h", name: "n" })).toEqual(["entries[0].config.database.user"]);
    expect(path({ ...postgresOn("h"), port: 70_000 })).toEqual(["entries[0].config.database.port"]);
    expect(path({ ...postgresOn("h"), ssl: "prefer" })).toEqual(["entries[0].config.database.ssl"]);
    expect(path({ ...postgresOn("h"), url: "postgres://h/n" })).toEqual(["entries[0].config.database.url"]);
    expect(path({ kind: "pglite", path: "a", memory: true })).toEqual(["entries[0].config.database"]);
    expect(path({ kind: "pglite" })).toEqual(["entries[0].config.database"]);
    expect(path({ kind: "pglite", memory: false })).toEqual(["entries[0].config.database.memory"]);
    expect(path({ kind: "mysql", host: "h" })).toEqual(["entries[0].config.database.kind"]);
  });

  it("only the password is secret: /config shows the other parts, the log text hides the password", () => {
    expect(fieldKinds(PUBLIC_CORE_SCHEMA).database).toBe("operational");
    expect(fieldKinds(PUBLIC_CORE_SCHEMA).transportReader).toBe("operational");
    expect(fieldKinds(PRIVATE_CORE_SCHEMA).publicDatabase).toBe("operational");
    const settings = {
      ...CORE_SETTINGS,
      database: postgresOn("db.internal"),
      listen: { transport: "0.0.0.0:7000" },
      transportReader: { user: "umbradb_transport", password: "reader-secret" },
    };
    const checked = validateConfig(input({ entries: [coreEntry({ start: 0, config: settings as never })] }));
    const [core] = checked.entries;
    const redact = configRedactor(checked);
    const shown = redact.settings(core?.settings as never, core?.kinds as never);
    expect(shown.database).toEqual({
      kind: "postgres",
      host: "db.internal",
      port: 5432,
      user: "umbradb",
      password: REDACTED,
      name: "indexer",
      ssl: "require",
    });
    expect(shown.transportReader).toEqual({ user: "umbradb_transport", password: REDACTED });
    const line = redact.text(`opened ${databaseText(core?.settings?.database as never)} with hunter2-secret and reader-secret`);
    expect(line).toBe(`opened postgres umbradb@db.internal:5432/indexer (ssl require) with ${REDACTED} and ${REDACTED}`);
    expect(databaseText({ kind: "pglite", path: "data/preview" })).toBe("pglite data/preview");
    expect(databaseText({ kind: "pglite", memory: true })).toBe("pglite in memory");
  });
});

describe("A177: ssl defaults to disable on a loopback host or socket, require on another (CF-4, Q182 B)", () => {
  it("each host's default, and an ssl given is kept", () => {
    const ssl = (host: string, given?: string) =>
      (PUBLIC_CORE_SCHEMA.parse({ ...CORE_SETTINGS, database: postgresOn(host, given === undefined ? {} : { ssl: given }) })
        .database as { ssl: string }).ssl;
    expect(["localhost", "127.0.0.1", "::1", "/var/run/postgresql"].map((host) => ssl(host))).toEqual([
      "disable",
      "disable",
      "disable",
      "disable",
    ]);
    expect(["db.internal", "10.0.0.5", "::2", "localhost.example", "127.0.0.2"].map((host) => ssl(host))).toEqual([
      "require",
      "require",
      "require",
      "require",
      "require",
    ]);
    expect([ssl("localhost", "verify-full"), ssl("db.internal", "disable")]).toEqual(["verify-full", "disable"]);
    expect(["localhost", "/tmp", "db"].map(defaultSsl)).toEqual(["disable", "disable", "require"]);
  });
});

describe("A177: core.transportReader is required on PostgreSQL with listen.transport, refused on PGlite (Q175 A)", () => {
  const transport = { listen: { transport: "0.0.0.0:7000" } };
  const reader = { transportReader: { user: "umbradb_transport", password: "p" } };

  it("PostgreSQL with listen.transport and no transportReader is refused with its path", () => {
    const found = findings({ ...CORE_SETTINGS, database: postgresOn("db.internal"), ...transport });
    expect(found.map((one) => one.path)).toEqual(["entries[0].config.transportReader"]);
    expect(found[0]?.message).toContain(
      "a PostgreSQL database with listen.transport needs transportReader { user, password }, a login that may only " +
        "read, which the transport's reads run as (CF-4, owner decision Q175)",
    );
  });

  it("PostgreSQL with both, and PostgreSQL without listen.transport, pass", () => {
    expect(findings({ ...CORE_SETTINGS, database: postgresOn("db.internal"), ...transport, ...reader })).toEqual([]);
    expect(findings({ ...CORE_SETTINGS, database: postgresOn("db.internal") })).toEqual([]);
  });

  it("PGlite with a transportReader is refused with its path; PGlite with listen.transport alone passes", () => {
    const pglite = { database: { kind: "pglite", memory: true }, developmentOptIn: true };
    const found = findings({ ...CORE_SETTINGS, ...pglite, ...transport, ...reader });
    expect(found.map((one) => one.path)).toEqual(["entries[0].config.transportReader"]);
    // The reader's password, "p", is redacted wherever it appears in the message: its words without a "p" are checked.
    expect(found[0]?.message).toContain("is refused on PGlite: its database has one session, the writer's, which the");
    expect(found[0]?.message).toContain("reads share (CF-4, owner decision Q175)");
    expect(findings({ ...CORE_SETTINGS, ...pglite, ...transport })).toEqual([]);
  });

  it("a private process has no transportReader", () => {
    const found = findings({ ...PRIVATE_SETTINGS, ...reader }, "private");
    expect(found.map((one) => one.path)).toEqual(["entries[0].config.transportReader"]);
  });

  it("transportReader is strict: a user is required and nothing else is taken", () => {
    const base = { ...CORE_SETTINGS, database: postgresOn("db.internal"), ...transport };
    expect(findings({ ...base, transportReader: { password: "p" } }).map((one) => one.path)).toEqual([
      "entries[0].config.transportReader.user",
    ]);
    expect(findings({ ...base, transportReader: { user: "u", host: "other" } }).map((one) => one.path)).toEqual([
      "entries[0].config.transportReader.host",
    ]);
  });
});

describe("A170's negative control (committed): a database schema that also takes a URL", () => {
  it("fails the oracle: the URLs are accepted", () => {
    const before = z.union([z.string().regex(/^(?:postgres(?:ql)?:\/\/\S+|pglite:\S.*)$/), databaseSetting()]);
    const problems = connectionStringProblems(before);
    expect(problems).toContain("accepted postgres://umbradb:hunter2@db.internal:5432/indexer");
    expect(problems).toContain("accepted pglite:memory");
  });
});
