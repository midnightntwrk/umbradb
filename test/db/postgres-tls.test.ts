import { getCACertificates, setDefaultCACertificates } from "node:tls";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { UmbraError } from "../../src/db/errors.js";
import { driverConnectionOptions, openPostgres, type PostgresConnection } from "../../src/db/postgres.js";
import { startTlsPostgres, type TlsPostgres } from "./postgres-tls-server.js";

/**
 * `ssl` reaches the PostgreSQL driver (task 4.5; CF-4; owner decisions Q182 B, Q183 A; the threat model's gap 2): the
 * database API's PostgreSQL backend hands `postgres` 3.4.9 the mode as the driver reads it — `disable` as `false` (the
 * driver would read the text `"disable"` as a request for TLS), `require` as `"require"` (TLS, the certificate not
 * checked: `src/connection.js` sets `rejectUnauthorized: false` for it), `verify-full` as Node.js's TLS options that
 * check the certificate against the default roots and the host name (`rejectUnauthorized: true` and the host, which
 * Node.js's `checkServerIdentity` compares with the certificate's names; for an IP address the driver gives no
 * `servername`). Against a PostgreSQL 18.6 server that serves TLS only (`./postgres-tls-server.ts`): `require` connects
 * over TLS (`pg_stat_ssl`); `disable` is refused by the server (SQLSTATE 28000); `verify-full` is refused for a CA
 * that is not among Node.js's roots, connects once it is (`tls.setDefaultCACertificates`, the test's stand-in for a
 * CA among the built-in roots) and is refused for a host name the certificate does not name. The committed negative
 * control (the last test): a mapping that drops `ssl`, as the backend did before task 4.5, fails the `require` test.
 */

const noHeight = async () => null;

/** Whether the session of a read on `db` is over TLS, from the server's own view. */
async function sessionSsl(db: Database): Promise<boolean> {
  const [row] = await db.read((read) => read.query("SELECT ssl FROM pg_stat_ssl WHERE pid = pg_backend_pid()"));
  return row?.ssl === true;
}

/** The error a read on `connection` fails with, or null when it connects. */
async function readError(connection: PostgresConnection): Promise<UmbraError | null> {
  const db = openPostgres({ connection, committedHeight: noHeight, readConnections: 1, connectTimeoutSeconds: 20 });
  try {
    await db.read((read) => read.query("SELECT 1"));
    return null;
  } catch (error) {
    if (error instanceof UmbraError) return error;
    throw error;
  } finally {
    await db.close();
  }
}

describe("ssl's mapping to the driver's options (postgres 3.4.9)", () => {
  const parts = { host: "db.internal", port: 5432, user: "u", password: "p", name: "n" } as const;

  it("disable is false, require is the driver's own mode, verify-full checks the roots and the host", () => {
    expect(driverConnectionOptions({ ...parts, ssl: "disable" })).toEqual({
      host: ["db.internal"],
      port: [5432],
      user: "u",
      pass: "p",
      database: "n",
      ssl: false,
    });
    expect(driverConnectionOptions({ ...parts, ssl: "require" }).ssl).toBe("require");
    expect(driverConnectionOptions({ ...parts, ssl: "verify-full" }).ssl).toEqual({
      rejectUnauthorized: true,
      host: "db.internal",
    });
  });

  it("an IPv6 host is kept whole; a socket directory is the driver's path, with the port", () => {
    expect(driverConnectionOptions({ ...parts, host: "::1", ssl: "disable" }).host).toEqual(["::1"]);
    expect(driverConnectionOptions({ ...parts, host: "/var/run/postgresql", ssl: "disable" }).path).toBe(
      "/var/run/postgresql/.s.PGSQL.5432",
    );
    expect(driverConnectionOptions({ ...parts, ssl: "disable" })).not.toHaveProperty("path");
  });

  it("no password: none passed, so the driver's own default (PGPASSWORD) applies", () => {
    const { password: _password, ...rest } = parts;
    expect(driverConnectionOptions({ ...rest, ssl: "disable" })).not.toHaveProperty("pass");
  });
});

describe("ssl against a PostgreSQL 18.6 server serving TLS only", () => {
  let server: TlsPostgres;
  beforeAll(async () => {
    server = await startTlsPostgres();
  });
  afterAll(() => server?.stop());

  it("require: the session is encrypted, the certificate not checked", async () => {
    const db = openPostgres({ connection: server.connection("require"), committedHeight: noHeight, readConnections: 1 });
    try {
      expect(await sessionSsl(db)).toBe(true);
    } finally {
      await db.close();
    }
  });

  it("disable: the server, which admits TLS only, refuses the login", async () => {
    const error = await readError(server.connection("disable"));
    expect(error?.code).toBe("database-error");
    expect(error?.details).toMatchObject({ sqlstate: "28000" });
  });

  it("verify-full: a certificate whose CA is not among Node.js's roots is refused", async () => {
    const error = await readError(server.connection("verify-full"));
    expect(error?.code).toBe("database-error");
    expect(String((error?.details as { cause?: unknown }).cause)).toMatch(/CERT|SIGNATURE|ISSUER/);
  });

  describe("with the test's CA among the default roots", () => {
    const roots = getCACertificates("default");
    beforeAll(() => setDefaultCACertificates([...roots, server.ca]));
    afterAll(() => setDefaultCACertificates(roots));

    it("verify-full: connects over TLS to the host the certificate names", async () => {
      const db = openPostgres({ connection: server.connection("verify-full"), committedHeight: noHeight, readConnections: 1 });
      try {
        expect(await sessionSsl(db)).toBe(true);
      } finally {
        await db.close();
      }
    });

    it("verify-full: refused for a host name the certificate does not name (127.0.0.1, the certificate names localhost)", async () => {
      const error = await readError(server.connection("verify-full", "127.0.0.1"));
      expect(error?.code).toBe("database-error");
      expect((error?.details as { cause?: unknown }).cause).toBe("ERR_TLS_CERT_ALTNAME_INVALID");
    });
  });

  it("negative control (committed): a driver mapping that drops ssl fails the require test", async () => {
    const dropped = (connection: PostgresConnection) => ({ ...driverConnectionOptions(connection), ssl: false as const });
    const db = openPostgres({
      connection: server.connection("require"),
      committedHeight: noHeight,
      readConnections: 1,
      driverOptions: dropped,
    });
    try {
      // The session the require test asserts encrypted is refused by the server: no TLS was asked for.
      const error = await sessionSsl(db).then(
        () => null,
        (failure: unknown) => failure,
      );
      expect(error).toBeInstanceOf(UmbraError);
      expect((error as UmbraError).details).toMatchObject({ sqlstate: "28000" });
    } finally {
      await db.close();
    }
  });
});
