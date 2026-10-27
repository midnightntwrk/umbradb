import { setTimeout as sleep } from "node:timers/promises";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mutualTlsOptions, startCoreTransport } from "../../src/private/core-transport.js";
import { PRIVATE_BACKENDS, type PrivateBackend, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPrivate, type PublicCore, startPublicCore } from "./builds.js";
import { makeCertificates, type TestCertificates } from "./certificates.js";
import { endedWithin, hello, rawClient } from "./raw-client.js";

/**
 * A121 `[CI]` (task 14.2; PP-11, owner decision Q34: opt-in): with the `core` entry's `tls` set, the core's process
 * transport requires mutual TLS — a private process without a certificate is refused by the core, and one with a
 * certificate a trusted root issued is accepted. The certificates are made by the test (`./certificates.ts`, the
 * `openssl` command, a temporary directory), never committed. Through raw clients (the TLS handshake itself) and through
 * private processes on PostgreSQL 18.6 and PGlite 0.5.10, with the committed negative control: a core that accepts a
 * client without a certificate under `tls` fails the oracle.
 */

let certs: TestCertificates;
beforeAll(() => {
  certs = makeCertificates();
});
afterAll(() => certs?.remove());

/** The `tls` setting of the core: its server certificate, trusting the test CA. */
const coreTls = () => ({ certificate: certs.server.certificate, key: certs.server.key, trustedRoots: [certs.ca] });

/** The `tls` setting of a private process with the test CA's client certificate. */
const privateTls = () => ({ certificate: certs.client.certificate, key: certs.client.key, trustedRoots: [certs.ca] });

/**
 * A121's oracle against the transport at `address` (see the module comment): every problem, none when a client without a
 * certificate, one with a stranger's and a plain WebSocket are refused before any WebSocket exists, and one with a
 * trusted certificate is answered.
 */
export async function tlsProblems(address: string): Promise<string[]> {
  const problems: string[] = [];
  const refusedBefore = async (what: string, client: ReturnType<typeof rawClient>) => {
    const end = await endedWithin(client, 20_000).catch(() => null);
    if (end === null) problems.push(`${what}: still connected`);
    else if (end.opened) problems.push(`${what}: its WebSocket opened`);
  };
  await refusedBefore("a client without a certificate", rawClient(`wss://${address}/`, { ca: certs.ca }));
  await refusedBefore(
    "a client with a certificate no trusted root issued",
    rawClient(`wss://${address}/`, { ca: certs.ca, cert: certs.stranger.certificate, key: certs.stranger.key }),
  );
  await refusedBefore("a plain WebSocket", rawClient(`ws://${address}/`));
  const trusted = rawClient(`wss://${address}/`, { ca: certs.ca, cert: certs.client.certificate, key: certs.client.key });
  try {
    await trusted.opened;
    trusted.send(hello("trusted"));
    const ack = await trusted.next("hello-ack", 20_000);
    if (ack.refused !== null) problems.push(`the trusted client's hello was refused: ${ack.refused}`);
  } catch (error) {
    problems.push(`the trusted client was not answered: ${(error as Error).message}`);
  } finally {
    trusted.close();
  }
  return problems;
}

describe("A121: with tls set, the core's transport requires mutual TLS (raw clients)", () => {
  const backend = PRIVATE_BACKENDS.find((one) => one.kind === "pglite") as PrivateBackend;
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("a client without a certificate, or with a stranger's, is refused; one with a trusted certificate is answered", async () => {
    const db = await backend.database("public");
    const core = await startPublicCore({
      database: db.setting,
      head: 2n,
      extra: { listen: { transport: "127.0.0.1:0" }, tls: coreTls() },
    });
    try {
      expect(core.lines.join("\n")).toMatch(/transport listening on 127\.0\.0\.1:\d+ \(mutual TLS\)/);
      expect(await tlsProblems(core.transport())).toEqual([]);
    } finally {
      await core.stop();
    }
  }, TEST_TIMEOUT_MS);

  it("negative control (committed): a core that does not require a client certificate under tls fails the oracle", async () => {
    const control = await startCoreTransport({
      address: "127.0.0.1:0",
      tls: coreTls(),
      serverTls: (tls) => ({ ...mutualTlsOptions(tls), requestCert: false, rejectUnauthorized: false }),
      db: { read: async () => Promise.reject(new Error("no reads")) },
      genesis: new Uint8Array(32),
      start: 1n,
      cursor: () => null,
      lockstepInstances: [],
      readTimeoutMs: 30_000,
      log: () => undefined,
    });
    try {
      const problems = await tlsProblems(`127.0.0.1:${control.port}`);
      expect(problems).toContain("a client without a certificate: still connected");
    } finally {
      await control.close();
    }
  }, TEST_TIMEOUT_MS);
});

describe.each(PRIVATE_BACKENDS)("A121: private processes and a core with tls on $name", (backend: PrivateBackend) => {
  beforeAll(() => backend.start(), START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  let core: PublicCore;
  let publicDb: Awaited<ReturnType<PrivateBackend["database"]>>;
  beforeAll(async () => {
    publicDb = await backend.database("public");
    core = await startPublicCore({
      database: publicDb.setting,
      head: 4n,
      extra: { listen: { transport: "127.0.0.1:0" }, tls: coreTls() },
    });
  }, START_TIMEOUT_MS);
  afterAll(() => core?.stop(), START_TIMEOUT_MS);

  /** A private process against `core` through its transport; on PostgreSQL its public reads go directly. */
  const privateOn = async (instanceId: string, tls?: ReturnType<typeof privateTls>) => {
    const privateDb = await backend.database("private");
    const lines: string[] = [];
    return {
      lines,
      running: launchPrivate({
        database: privateDb.setting,
        instanceId,
        coreTransport: core.transport(),
        ...(tls === undefined ? {} : { tls }),
        ...(backend.kind === "postgres" ? { publicDatabase: publicDb.readerSetting as string } : {}),
        lines,
      }),
    };
  };

  it("a private process with a trusted certificate is accepted, and processes the public heights", async () => {
    const { running, lines } = await privateOn("with-certificate", privateTls());
    try {
      await running.reach(4n);
      await core.advance(6n);
      await running.reach(6n);
      expect(lines.join("\n")).toContain("transport: connected to the core at");
      expect(core.lines.join("\n")).toContain("transport: instance with-certificate connected");
    } finally {
      await running.stop();
    }
  }, TEST_TIMEOUT_MS);

  it("a private process without a certificate is refused by the core: never connected, its connection retried", async () => {
    const { running, lines } = await privateOn("without-certificate");
    try {
      const deadline = Date.now() + 60_000;
      while (!lines.some((line) => line.includes("connecting again in")) && Date.now() < deadline) await sleep(50);
      expect(lines.join("\n")).toMatch(/transport: .*connecting again in \d+ ms \(attempt 1\)/);
      expect(lines.join("\n")).not.toContain("transport: connected to the core");
      expect(core.lines.join("\n")).not.toContain("instance without-certificate connected");
    } finally {
      await running.stop();
    }
  }, TEST_TIMEOUT_MS);
});
