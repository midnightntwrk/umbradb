import { execFileSync } from "node:child_process";
import { randomInt } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { PostgresConnection } from "../../src/db/postgres.js";
import { startContainer } from "../containers.js";
import { POSTGRES_IMAGE } from "../postgres-image.js";

/**
 * A PostgreSQL 18.6 server that serves TLS only, for the tests of the `ssl` setting. [CF-4, Q182 B, Q183 A]
 *
 * - It runs the repository's one image through Testcontainers (its `withSSL`, which hands the key to the server's
 *   user).
 * - Its certificate is issued by a CA made when the test runs, with the `openssl` command in a temporary directory
 *   that is removed once the server has started. This is how `test/private/certificates.ts` makes the transport's
 *   certificates: no key is ever committed.
 * - The certificate names `DNS:localhost` only (not `127.0.0.1`), so a connection to the IP address fails the host
 *   name check of `verify-full`.
 * - Its `pg_hba.conf` admits TCP connections over TLS only (`hostnossl … reject`), so a client that sends no TLS
 *   request is refused (SQLSTATE 28000).
 */

/** The server's `pg_hba.conf`: the socket for the image's own setup, TCP over TLS only. */
const HBA = ["local all all trust", "hostssl all all all scram-sha-256", "hostnossl all all all reject", ""].join("\n");

/** Where the `pg_hba.conf` is in the container. */
const HBA_PATH = "/etc/umbradb-test-pg_hba.conf";

/** The TLS server and its CA. */
export interface TlsPostgres {
  readonly container: StartedPostgreSqlContainer;
  /** The CA that issued the server's certificate, PEM text (not among Node.js's roots). */
  readonly ca: string;
  /** The server's parts with `ssl` as given; host `localhost` (the certificate's name) unless given. */
  connection(ssl: PostgresConnection["ssl"], host?: string): PostgresConnection;
  stop(): Promise<void>;
}

/** Makes the CA and the server's certificate for `localhost` in `dir` with `openssl`; returns the files. */
function makeCertificates(dir: string): { readonly ca: string; readonly cert: string; readonly key: string } {
  const file = (name: string) => join(dir, name);
  const openssl = (...args: string[]) => execFileSync("openssl", args, { stdio: ["ignore", "pipe", "pipe"] });
  writeFileSync(
    file("ca.cnf"),
    [
      "[req]",
      "distinguished_name = dn",
      "prompt = no",
      "x509_extensions = v3_ca",
      "[dn]",
      "CN = umbradb-test-database-ca",
      "[v3_ca]",
      "basicConstraints = critical, CA:TRUE",
      "keyUsage = critical, keyCertSign, cRLSign",
      "subjectKeyIdentifier = hash",
      "",
    ].join("\n"),
  );
  openssl(
    "req", "-x509", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:P-256", "-nodes", "-sha256", "-days", "1",
    "-config", file("ca.cnf"), "-keyout", file("ca.key"), "-out", file("ca.crt"),
  );
  writeFileSync(file("server.cnf"), ["[req]", "distinguished_name = dn", "prompt = no", "[dn]", "CN = localhost", ""].join("\n"));
  writeFileSync(
    file("server.ext"),
    [
      "basicConstraints = CA:FALSE",
      "keyUsage = critical, digitalSignature",
      "extendedKeyUsage = serverAuth",
      "subjectAltName = DNS:localhost",
      "",
    ].join("\n"),
  );
  openssl(
    "req", "-new", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:P-256", "-nodes",
    "-config", file("server.cnf"), "-keyout", file("server.key"), "-out", file("server.csr"),
  );
  openssl(
    "x509", "-req", "-sha256", "-days", "1", "-set_serial", String(randomInt(1, 2 ** 31)),
    "-in", file("server.csr"), "-CA", file("ca.crt"), "-CAkey", file("ca.key"),
    "-extfile", file("server.ext"), "-out", file("server.crt"),
  );
  return { ca: file("ca.crt"), cert: file("server.crt"), key: file("server.key") };
}

/** Starts the TLS server (see the module comment). */
export async function startTlsPostgres(): Promise<TlsPostgres> {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-postgres-tls-"));
  try {
    const files = makeCertificates(dir);
    const ca = readFileSync(files.ca, "utf8");
    const container = await startContainer(
      new PostgreSqlContainer(POSTGRES_IMAGE)
        .withSSL(files.cert, files.key)
        .withCopyContentToContainer([{ content: HBA, target: HBA_PATH, mode: 0o644 }])
        .withCommand(["postgres", "-c", `hba_file=${HBA_PATH}`]),
    );
    return {
      container,
      ca,
      connection: (ssl, host = "localhost") => ({
        host,
        port: container.getPort(),
        user: container.getUsername(),
        password: container.getPassword(),
        name: container.getDatabase(),
        ssl,
      }),
      stop: () => container.stop().then(() => undefined),
    };
  } finally {
    rmSync(dir, { recursive: true, force: true });
  }
}
