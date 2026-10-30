import { execFileSync } from "node:child_process";
import { randomInt } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";

/**
 * Test certificates for the process transport's mutual TLS. They are made when a test runs, with the `openssl` command
 * (as the probe `test/dependencies/ws-mutual-tls.test.ts` makes its own), in a temporary directory removed afterwards,
 * so no key is ever committed: a CA the core trusts, the core's server certificate (for `127.0.0.1`), a client
 * certificate that CA issued, and a stranger's, issued by another CA. Each is PEM text, as the `tls` setting takes them
 * (`certificate`, `key`, `trustedRoots`). Imports nothing of Vitest. [PP-11, A121, CF-4]
 */

/** One certificate and its key, PEM text. */
export interface Pem {
  readonly certificate: string;
  readonly key: string;
}

/** The test certificates (see the module comment). */
export interface TestCertificates {
  /** The CA the core and the private processes trust. */
  readonly ca: string;
  /** Another CA, which issued {@link stranger}. */
  readonly otherCa: string;
  readonly server: Pem;
  readonly client: Pem;
  readonly stranger: Pem;
  /** Removes the directory they were made in. */
  remove(): void;
}

/** Makes the test certificates (see the module comment). */
export function makeCertificates(): TestCertificates {
  const dir = mkdtempSync(join(tmpdir(), "umbradb-transport-tls-"));
  const file = (name: string) => join(dir, name);
  const openssl = (...args: string[]) => execFileSync("openssl", args, { stdio: ["ignore", "pipe", "pipe"] });
  const ca = (name: string) => {
    writeFileSync(
      file(`${name}.cnf`),
      [
        "[req]",
        "distinguished_name = dn",
        "prompt = no",
        "x509_extensions = v3_ca",
        "[dn]",
        `CN = ${name}`,
        "[v3_ca]",
        "basicConstraints = critical, CA:TRUE",
        "keyUsage = critical, keyCertSign, cRLSign",
        "subjectKeyIdentifier = hash",
        "",
      ].join("\n"),
    );
    openssl(
      "req", "-x509", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:P-256", "-nodes", "-sha256", "-days", "1",
      "-config", file(`${name}.cnf`), "-keyout", file(`${name}.key`), "-out", file(`${name}.crt`),
    );
  };
  const leaf = (name: string, issuer: string, extensions: readonly string[]): Pem => {
    writeFileSync(file(`${name}.cnf`), ["[req]", "distinguished_name = dn", "prompt = no", "[dn]", `CN = ${name}`, ""].join("\n"));
    writeFileSync(file(`${name}.ext`), [...extensions, ""].join("\n"));
    openssl(
      "req", "-new", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:P-256", "-nodes",
      "-config", file(`${name}.cnf`), "-keyout", file(`${name}.key`), "-out", file(`${name}.csr`),
    );
    openssl(
      "x509", "-req", "-sha256", "-days", "1", "-set_serial", String(randomInt(1, 2 ** 31)),
      "-in", file(`${name}.csr`), "-CA", file(`${issuer}.crt`), "-CAkey", file(`${issuer}.key`),
      "-extfile", file(`${name}.ext`), "-out", file(`${name}.crt`),
    );
    return { certificate: readFileSync(file(`${name}.crt`), "utf8"), key: readFileSync(file(`${name}.key`), "utf8") };
  };
  try {
    ca("umbradb-transport-ca");
    ca("umbradb-other-ca");
    const client = ["basicConstraints = CA:FALSE", "keyUsage = critical, digitalSignature", "extendedKeyUsage = clientAuth"];
    return {
      ca: readFileSync(file("umbradb-transport-ca.crt"), "utf8"),
      otherCa: readFileSync(file("umbradb-other-ca.crt"), "utf8"),
      server: leaf("umbradb-transport-core", "umbradb-transport-ca", [
        "basicConstraints = CA:FALSE",
        "keyUsage = critical, digitalSignature",
        "extendedKeyUsage = serverAuth",
        "subjectAltName = IP:127.0.0.1",
      ]),
      client: leaf("umbradb-transport-private", "umbradb-transport-ca", client),
      stranger: leaf("umbradb-stranger-private", "umbradb-other-ca", client),
      remove: () => rmSync(dir, { recursive: true, force: true }),
    };
  } catch (error) {
    rmSync(dir, { recursive: true, force: true });
    throw error;
  }
}
