/**
 * The client's requests to the module's routes (spec §5.7). Every request is recorded (method, path, body and answer
 * lengths, time), which the benchmark and the request-shape test read; the record never holds a body.
 *
 * A request carries nothing that depends on the wallet beyond what PIR hides: the manifest, the same artifacts for
 * every wallet, the tail, and query calls of exactly `queriesPerCall` vectors.
 */

import { createHash } from "node:crypto";
import { createWriteStream, renameSync, rmSync } from "node:fs";
import { once } from "node:events";
import { OCTET_STREAM, ROUTES } from "../shared/index.ts";

/** One request as the server sees it, without its body. */
export interface RequestRecord {
  readonly method: "GET" | "POST";
  readonly path: string;
  readonly bodyBytes: number;
  readonly status: number;
  readonly answerBytes: number;
  /** From the request to the last byte of the answer. */
  readonly ms: number;
}

export type FetchLike = (url: string, init: RequestInit) => Promise<Response>;

/** An answer that is not a success. */
export class HttpError extends Error {
  readonly status: number;
  readonly code: string | null;
  constructor(status: number, code: string | null, message: string) {
    super(message);
    this.status = status;
    this.code = code;
  }
}

/** The server replaced the snapshot a call named (409): the client starts again from the new manifest. */
export class SnapshotReplaced extends HttpError {
  readonly snapshot: string | null;
  constructor(message: string, snapshot: string | null) {
    super(409, "snapshot-replaced", message);
    this.snapshot = snapshot;
  }
}

export class PssHttp {
  readonly origin: string;
  readonly records: RequestRecord[] = [];
  readonly #fetch: FetchLike;

  constructor(origin: string, options: { fetch?: FetchLike } = {}) {
    const url = new URL(origin);
    if (url.protocol !== "http:" && url.protocol !== "https:") throw new Error(`server URL must be http or https: ${origin}`);
    this.origin = url.origin;
    this.#fetch = options.fetch ?? ((u, init) => fetch(u, init));
  }

  async #request(method: "GET" | "POST", path: string, body?: Uint8Array): Promise<{ response: Response; started: number }> {
    const started = performance.now();
    const init: RequestInit =
      body === undefined
        ? { method }
        : { method, headers: { "Content-Type": OCTET_STREAM }, body: body as Uint8Array<ArrayBuffer> };
    let response: Response;
    try {
      response = await this.#fetch(`${this.origin}${path}`, init);
    } catch (cause) {
      throw new Error(`the server at ${this.origin} is unreachable (${method} ${path})`, { cause });
    }
    if (!response.ok) {
      const text = await response.text().catch(() => "");
      this.#record(method, path, body?.length ?? 0, response.status, Buffer.byteLength(text), started);
      let parsed: { error?: { code?: string; message?: string }; snapshot?: string } = {};
      try {
        parsed = JSON.parse(text) as typeof parsed;
      } catch {
        // not JSON
      }
      const message = `${method} ${path}: ${response.status} ${parsed.error?.message ?? text.slice(0, 200)}`;
      if (response.status === 409 && parsed.error?.code === "snapshot-replaced") throw new SnapshotReplaced(message, parsed.snapshot ?? null);
      throw new HttpError(response.status, parsed.error?.code ?? null, message);
    }
    return { response, started };
  }

  #record(method: "GET" | "POST", path: string, bodyBytes: number, status: number, answerBytes: number, started: number): void {
    this.records.push({ method, path, bodyBytes, status, answerBytes, ms: performance.now() - started });
  }

  async #bytes(method: "GET" | "POST", path: string, body?: Uint8Array): Promise<{ bytes: Uint8Array; headers: Headers }> {
    const { response, started } = await this.#request(method, path, body);
    const bytes = new Uint8Array(await response.arrayBuffer());
    this.#record(method, path, body?.length ?? 0, response.status, bytes.length, started);
    return { bytes, headers: response.headers };
  }

  /** `GET /manifest`: its bytes and the identifier the server names (checked by the caller against their SHA-256). */
  async manifest(): Promise<{ bytes: Uint8Array; servedId: string | null }> {
    const { bytes, headers } = await this.#bytes("GET", ROUTES.manifest);
    return { bytes, servedId: headers.get("pss-snapshot-id") };
  }

  /** `GET /tail`. */
  async tail(): Promise<Uint8Array> {
    return (await this.#bytes("GET", ROUTES.tail)).bytes;
  }

  /** `POST /query/read` or `/query/nullifier` with an encoded query body; the answer body. */
  async query(table: "read" | "nullifier", body: Uint8Array): Promise<Uint8Array> {
    return (await this.#bytes("POST", table === "read" ? ROUTES.queryRead : ROUTES.queryNullifier, body)).bytes;
  }

  /**
   * `GET /blob/<digest>` streamed into `path` (through a temporary file), checking its SHA-256 and size; the bytes
   * written.
   */
  async blobToFile(digest: string, size: number, path: string): Promise<number> {
    const route = `${ROUTES.blob}${digest}`;
    const { response, started } = await this.#request("GET", route);
    const partial = `${path}.partial-${process.pid}`;
    const out = createWriteStream(partial, { mode: 0o600 });
    const hash = createHash("sha256");
    let written = 0;
    try {
      if (response.body === null) throw new Error(`GET ${route}: no body`);
      for await (const chunk of response.body as unknown as AsyncIterable<Uint8Array>) {
        hash.update(chunk);
        written += chunk.length;
        if (!out.write(chunk)) await once(out, "drain");
      }
      out.end();
      await once(out, "close");
      const got = hash.digest("hex");
      if (got !== digest || written !== size) throw new Error(`GET ${route}: got ${written} bytes with SHA-256 ${got}, expected ${size} bytes`);
      renameSync(partial, path);
    } catch (error) {
      out.destroy();
      rmSync(partial, { force: true });
      throw error;
    } finally {
      this.#record("GET", route, 0, response.status, written, started);
    }
    return written;
  }
}
