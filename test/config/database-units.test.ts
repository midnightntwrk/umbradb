import { describe, expect, it } from "vitest";
import { pgDumpChildEnvironment } from "../../src/backup/backup.js";
import { databaseText, isMemoryDatabase } from "../../src/config/database-parts.js";
import { REDACTED, redactor, secretStrings } from "../../src/config/redact.js";
import { refuseWritingReader, type TransportReaderFacts } from "../../src/private/transport-reader.js";

/**
 * Task 17.5b (the mutation pass task 4.5 deferred): `pg_dump`'s environment (each of libpq's connection variables of
 * the caller's replaced or dropped, the password and the system's roots only when they apply), the memory database and
 * an IPv6 host as the log names them, a `password` part next to a null one, and the transport reader's refusal listing
 * ten of its findings.
 */

const LIBPQ = ["PGHOST", "PGHOSTADDR", "PGPORT", "PGUSER", "PGDATABASE", "PGPASSWORD", "PGPASSFILE", "PGSERVICE",
  "PGSERVICEFILE", "PGSSLMODE", "PGSSLROOTCERT", "PGREQUIRESSL", "PGSSLCERT", "PGSSLKEY"];

describe("pg_dump's environment (task 17.5b)", () => {
  const caller = { ...Object.fromEntries(LIBPQ.map((name) => [name, `caller-${name}`])), PATH: "/bin", UNSET: undefined };
  const connection = { host: "db.internal", port: 5433, user: "umbradb", name: "indexer", ssl: "require" as const };

  it("drops every libpq connection variable of the caller's, and sets only the parts'", () => {
    // Strictly: a variable present with no value would reach pg_dump's environment too.
    expect(pgDumpChildEnvironment(caller, connection)).toStrictEqual({
      PATH: "/bin",
      PGHOST: "db.internal",
      PGPORT: "5433",
      PGUSER: "umbradb",
      PGDATABASE: "indexer",
      PGSSLMODE: "require",
      PGAPPNAME: "umbradb-backup",
    });
  });

  it("adds the password when the parts hold one, and the system's roots for verify-full only", () => {
    const full = pgDumpChildEnvironment({}, { ...connection, password: "secret", ssl: "verify-full" });
    expect(full).toMatchObject({ PGPASSWORD: "secret", PGSSLMODE: "verify-full", PGSSLROOTCERT: "system" });
    expect(Object.keys(pgDumpChildEnvironment({}, { ...connection, ssl: "disable" }))).not.toContain("PGSSLROOTCERT");
  });
});

describe("database parts as the log names them (task 17.5b)", () => {
  it("tells a memory database, and brackets an IPv6 host", () => {
    expect(isMemoryDatabase({ kind: "pglite", memory: true })).toBe(true);
    expect(isMemoryDatabase({ kind: "pglite", path: "data" })).toBe(false);
    expect(isMemoryDatabase({ kind: "postgres", host: "h", port: 1, user: "u", name: "n", ssl: "disable" } as never)).toBe(false);
    expect(databaseText({ kind: "postgres", host: "::1", port: 5432, user: "u", name: "n", ssl: "disable" } as never)).toBe(
      "postgres u@[::1]:5432/n (ssl disable)",
    );
  });
});

describe("password parts beside null values (task 17.5b)", () => {
  it("finds and redacts the password of an operational field holding null and lists", () => {
    const settings = { database: { password: "p1", cert: null, replicas: [{ password: "p2" }, null, 3] } };
    expect(secretStrings(settings, { database: "operational" })).toEqual(["p1", "p2"]);
    expect(redactor([]).settings(settings, { database: "operational" })).toEqual({
      database: { password: REDACTED, cert: null, replicas: [{ password: REDACTED }, null, 3] },
    });
  });
});

describe("the transport reader's refusal (task 17.5b)", () => {
  const facts = (count: number): TransportReaderFacts => ({
    user: "reader",
    writer: "umbradb",
    superuser: false,
    createRole: false,
    createDb: false,
    bypassRls: false,
    memberOfWriter: false,
    privileges: Array.from({ length: count }, (_v, i) => ({ kind: "table", object: `pub.t${i}`, privilege: "INSERT" })),
  });
  const message = (count: number): string => {
    try {
      refuseWritingReader(facts(count));
    } catch (error) {
      return (error as Error).message;
    }
    return "none";
  };
  const tail =
    ": the transport's reads need a login that may only read — SELECT on the public tables and USAGE on their schemas, " +
    "such as a member of pg_read_all_data and nothing more (CF-4, owner decision Q175)";

  it("lists ten findings and counts the rest", () => {
    expect(message(0)).toBe("none");
    const ten = Array.from({ length: 10 }, (_v, i) => `holds INSERT on table pub.t${i}`).join(", ");
    expect(message(10)).toBe(`the transportReader login "reader" ${ten}${tail}`);
    expect(message(12)).toBe(`the transportReader login "reader" ${ten}, and 2 more${tail}`);
  });
});
