import { execFileSync } from "node:child_process";
import { randomInt } from "node:crypto";
import { mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { createServer, type Server } from "node:https";
import { tmpdir } from "node:os";
import { join } from "node:path";
import type { TLSSocket } from "node:tls";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { WebSocket, WebSocketServer } from "ws";

// A characterization test of the pinned `ws` 8.22.0 as the process transport's opt-in mutual TLS: a WebSocket server
// over `https` that requires client certificates (`requestCert`, `rejectUnauthorized`). A client holding a certificate
// issued by the trusted CA connects; a client without a certificate, or with one from another CA, is refused before any
// WebSocket connection exists. The certificates are generated at test time with the `openssl` command into a temporary
// directory that is deleted afterwards; no key is committed. [A121; design §8, §14]

let dir: string;
let server: Server;
let wss: WebSocketServer;
let port: number;
let connections = 0;
const tlsClientErrors: string[] = [];

const file = (name: string) => join(dir, name);
const read = (name: string) => readFileSync(file(name));

function openssl(...args: string[]): void {
  execFileSync("openssl", args, { stdio: ["ignore", "pipe", "pipe"] });
}

/** A self-signed CA certificate and key, `<name>.crt` and `<name>.key`. */
function makeCa(name: string): void {
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
}

/** A leaf certificate and key signed by `ca`, with the given X.509 v3 extensions. */
function makeLeaf(name: string, ca: string, extensions: string[]): void {
  writeFileSync(file(`${name}.cnf`), ["[req]", "distinguished_name = dn", "prompt = no", "[dn]", `CN = ${name}`, ""].join("\n"));
  writeFileSync(file(`${name}.ext`), [...extensions, ""].join("\n"));
  openssl(
    "req", "-new", "-newkey", "ec", "-pkeyopt", "ec_paramgen_curve:P-256", "-nodes",
    "-config", file(`${name}.cnf`), "-keyout", file(`${name}.key`), "-out", file(`${name}.csr`),
  );
  openssl(
    "x509", "-req", "-sha256", "-days", "1", "-set_serial", String(randomInt(1, 2 ** 31)),
    "-in", file(`${name}.csr`), "-CA", file(`${ca}.crt`), "-CAkey", file(`${ca}.key`),
    "-extfile", file(`${name}.ext`), "-out", file(`${name}.crt`),
  );
}

/** Listens on a random free port at or above 10000 on the loopback interface. */
async function listenOnRandomPort(target: Server): Promise<number> {
  for (let attempt = 0; attempt < 20; attempt++) {
    const candidate = randomInt(10_000, 60_000);
    const listening = await new Promise<boolean>((resolve, reject) => {
      const onError = (error: NodeJS.ErrnoException) => {
        target.off("listening", onListening);
        if (error.code === "EADDRINUSE") resolve(false);
        else reject(error);
      };
      const onListening = () => {
        target.off("error", onError);
        resolve(true);
      };
      target.once("error", onError);
      target.once("listening", onListening);
      target.listen(candidate, "127.0.0.1");
    });
    if (listening) return candidate;
  }
  throw new Error("no free port at or above 10000 after 20 attempts");
}

type Attempt = { opened: boolean; message?: unknown; error?: string };

/** Opens a WebSocket to the server with the given client credentials and reports what happened. */
function connect(credentials: { cert?: Buffer; key?: Buffer }): Promise<Attempt> {
  return new Promise((resolve) => {
    let opened = false;
    const socket = new WebSocket(`wss://127.0.0.1:${port}`, { ca: read("umbradb-test-ca.crt"), ...credentials });
    socket.on("open", () => {
      opened = true;
    });
    socket.on("message", (data) => {
      resolve({ opened, message: JSON.parse(data.toString()) });
      socket.close();
    });
    socket.on("error", (error: NodeJS.ErrnoException) => resolve({ opened, error: error.code }));
    socket.on("close", () => resolve({ opened }));
  });
}

beforeAll(async () => {
  dir = mkdtempSync(join(tmpdir(), "umbradb-ws-mtls-"));
  makeCa("umbradb-test-ca");
  makeCa("umbradb-other-ca");
  makeLeaf("umbradb-test-server", "umbradb-test-ca", [
    "basicConstraints = CA:FALSE",
    "keyUsage = critical, digitalSignature",
    "extendedKeyUsage = serverAuth",
    "subjectAltName = IP:127.0.0.1",
  ]);
  const clientExtensions = ["basicConstraints = CA:FALSE", "keyUsage = critical, digitalSignature", "extendedKeyUsage = clientAuth"];
  makeLeaf("umbradb-test-client", "umbradb-test-ca", clientExtensions);
  makeLeaf("umbradb-stranger-client", "umbradb-other-ca", clientExtensions);

  server = createServer({
    key: read("umbradb-test-server.key"),
    cert: read("umbradb-test-server.crt"),
    ca: [read("umbradb-test-ca.crt")],
    requestCert: true,
    rejectUnauthorized: true,
  });
  server.on("tlsClientError", (error: NodeJS.ErrnoException) => tlsClientErrors.push(error.code ?? error.message));
  wss = new WebSocketServer({ server });
  wss.on("connection", (socket, request) => {
    connections += 1;
    const tlsSocket = request.socket as TLSSocket;
    socket.send(JSON.stringify({ peer: tlsSocket.getPeerCertificate().subject.CN, authorized: tlsSocket.authorized }));
  });
  port = await listenOnRandomPort(server);
});

afterAll(async () => {
  for (const client of wss?.clients ?? []) client.terminate();
  await new Promise<void>((resolve) => (wss ? wss.close(() => resolve()) : resolve()));
  await new Promise<void>((resolve) => (server?.listening ? server.close(() => resolve()) : resolve()));
  if (dir) rmSync(dir, { recursive: true, force: true });
});

describe("ws 8.22.0 — WebSocket server over https requiring client certificates", () => {
  it("listens on a port at or above 10000", () => {
    expect(port).toBeGreaterThanOrEqual(10_000);
  });

  it("accepts a client whose certificate the trusted CA issued", async () => {
    const before = connections;
    const attempt = await connect({ cert: read("umbradb-test-client.crt"), key: read("umbradb-test-client.key") });
    expect(attempt).toEqual({ opened: true, message: { peer: "umbradb-test-client", authorized: true } });
    expect(connections).toBe(before + 1);
  });

  it("refuses a client without a certificate with CERTIFICATE_REQUIRED, before any WebSocket connection", async () => {
    const before = { connections, errors: tlsClientErrors.length };
    const attempt = await connect({});
    expect(attempt).toEqual({ opened: false, error: "ERR_SSL_TLSV13_ALERT_CERTIFICATE_REQUIRED" });
    await vi.waitFor(() => expect(tlsClientErrors.length).toBe(before.errors + 1));
    expect(tlsClientErrors.at(-1)).toBe("ERR_SSL_PEER_DID_NOT_RETURN_A_CERTIFICATE");
    expect(connections).toBe(before.connections);
  });

  it("refuses a client whose certificate another CA issued, before any WebSocket connection", async () => {
    const before = { connections, errors: tlsClientErrors.length };
    const attempt = await connect({
      cert: read("umbradb-stranger-client.crt"),
      key: read("umbradb-stranger-client.key"),
    });
    expect(attempt.opened).toBe(false);
    expect(attempt.error).toBeDefined();
    await vi.waitFor(() => expect(tlsClientErrors.length).toBe(before.errors + 1));
    expect(connections).toBe(before.connections);
  });
});
