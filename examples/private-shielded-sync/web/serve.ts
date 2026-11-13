/**
 * Serves the step-by-step page on the loopback interface and passes its `/pss/v1/…` requests to the module's API:
 *
 *     node examples/private-shielded-sync/web/serve.ts [--port 10490] [--server http://127.0.0.1:10480]
 *       [--db-url postgres://postgres@127.0.0.1:58171/umbradb --db-password-file <file>] [--admin-secret-file <file>]
 *
 * - `/` and the built files from `web/dist/` (`./build.ts` first), cross-origin isolated (`Cross-Origin-Opener-Policy`
 *   and `Cross-Origin-Embedder-Policy`): the PIR library keeps the setup matrix in a `SharedArrayBuffer`;
 * - `/pss/v1/…` (not the admin routes) to `--server`, as the page's client would call the server itself;
 * - with `--db-url`, the debug routes the page uses to compare what it got with what UmbraDB stored (they read the
 *   server's database directly and are no part of the private protocol):
 *   `/debug/info`, `/debug/state?height=H` (first_free and root), `/debug/output?position=P` (the stored output),
 *   `/debug/spends?n=K&maxHeight=H` (stored spends, at random);
 * - with `--admin-secret-file`, the module's admin snapshot route with the secret added here (the page never holds
 *   it): `POST /debug/reload-snapshot` with `{}` (the module's indexed height) or `{"height": h}` builds a snapshot,
 *   waits for it and answers with the new snapshot (identifier, height, first_free) and the previous one;
 *   `POST /debug/snapshot` only starts a build and `GET /debug/snapshot` reports on builds. A height below the served
 *   snapshot's is refused by the module.
 */

import { createReadStream, existsSync, readFileSync, statSync } from "node:fs";
import { createServer, type IncomingMessage, type ServerResponse } from "node:http";
import { dirname, extname, join, normalize, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";

const HERE = dirname(fileURLToPath(import.meta.url));
const { values: opt } = parseArgs({
  options: {
    port: { type: "string", default: "10490" },
    server: { type: "string", default: "http://127.0.0.1:10480" },
    dir: { type: "string" },
    "db-url": { type: "string" },
    "db-password-file": { type: "string" },
    "admin-secret-file": { type: "string" },
  },
});
const dist = resolve(opt.dir ?? join(HERE, "dist"));
if (!existsSync(join(dist, "index.html"))) throw new Error(`no ${dist}/index.html: run node examples/private-shielded-sync/web/build.ts first`);
const upstream = new URL(opt.server);
const adminSecret = opt["admin-secret-file"] ? readFileSync(opt["admin-secret-file"], "utf8").trim() : null;

type Sql = { unsafe(q: string, p?: unknown[]): Promise<Record<string, unknown>[]> };
let sql: Sql | null = null;
if (opt["db-url"]) {
  if (!opt["db-password-file"]) throw new Error("--db-url needs --db-password-file");
  const { default: postgres } = (await import("postgres" as string)) as { default: (url: string, o: Record<string, unknown>) => Sql };
  sql = postgres(opt["db-url"], { password: readFileSync(opt["db-password-file"], "utf8").trim(), max: 4, onnotice: () => {} });
}

const TYPES: Record<string, string> = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".map": "application/json",
  ".wasm": "application/wasm",
  ".json": "application/json",
};
const hex = (v: unknown): string | null => (v === null || v === undefined ? null : Buffer.from(v as Uint8Array).toString("hex"));

function json(res: ServerResponse, status: number, body: unknown): void {
  const text = JSON.stringify(body, (_k, v) => (typeof v === "bigint" ? v.toString() : v));
  res.writeHead(status, { "Content-Type": "application/json", "Cache-Control": "no-store" });
  res.end(text);
}

async function readBody(req: IncomingMessage): Promise<Buffer> {
  const chunks: Buffer[] = [];
  for await (const chunk of req) chunks.push(chunk as Buffer);
  return Buffer.concat(chunks);
}

/** The stored root (SCALE compact: 0x73, then 32 bytes little-endian) as the manifest writes it (32 bytes hex). */
const rootHex = (stored: unknown): string | null => {
  const b = Buffer.from(stored as Uint8Array);
  return b.length === 33 && b[0] === 0x73 ? b.subarray(1).toString("hex") : null;
};

/** `{}` → undefined (the module's indexed height), `{"height": h}` → h, anything else → null. */
function requestedHeight(body: Buffer): number | undefined | null {
  if (body.length === 0) return undefined;
  try {
    const parsed = JSON.parse(body.toString("utf8")) as { height?: unknown };
    if (parsed.height === undefined || parsed.height === null || parsed.height === "") return undefined;
    const h = Number(parsed.height);
    return Number.isSafeInteger(h) && h >= 0 ? h : null;
  } catch {
    return null;
  }
}

/** The module's admin snapshot route, with the secret added here. */
async function admin(method: "GET" | "POST", height?: number): Promise<{ status: number; body: Record<string, unknown> }> {
  const r = await fetch(new URL("/pss/v1/admin/snapshot", upstream), {
    method,
    headers: { Authorization: `Bearer ${adminSecret}`, ...(method === "POST" ? { "Content-Type": "application/json" } : {}) },
    ...(method === "POST" ? { body: JSON.stringify(height === undefined ? {} : { height }) } : {}),
  });
  return { status: r.status, body: (await r.json()) as Record<string, unknown> };
}

/**
 * Builds a snapshot (at `height`, or the module's indexed height) and waits for it: the new snapshot's identifier,
 * height, first_free and build time, or why it did not build. The server then serves it, and keeps the previous one.
 */
async function reloadSnapshot(height?: number): Promise<[number, Record<string, unknown>]> {
  const started = performance.now();
  const before = (await admin("GET")).body.current as Record<string, unknown> | null;
  const start = await admin("POST", height);
  if (start.status !== 202) return [start.status, { error: start.body.error ?? start.body, current: before }];
  const building = start.body.building as { height: number };
  for (let waited = 0; waited < 600_000; waited += 300) {
    await new Promise((r) => setTimeout(r, 300));
    const s = (await admin("GET")).body;
    if (s.building !== null) continue;
    const last = s.last as { height?: number; ok?: boolean } | null;
    const current = s.current as { id: string; height: number; firstFree: number } | null;
    if (last?.height !== building.height || !last.ok || current === null) return [500, { error: "the build failed", last, current }];
    return [200, { snapshot: current, previous: before, last, ms: Math.round(performance.now() - started) }];
  }
  return [504, { error: `the build at ${building.height} did not finish in 10 minutes` }];
}

async function debug(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  const route = url.pathname.slice("/debug/".length);
  if (route === "snapshot" || route === "reload-snapshot") {
    if (adminSecret === null) return json(res, 404, { error: "start serve.ts with --admin-secret-file" });
    const height = req.method === "POST" ? requestedHeight(await readBody(req)) : undefined;
    if (height === null) return json(res, 400, { error: 'the body is {} or {"height": <integer>}' });
    if (route === "snapshot") {
      const r = await admin(req.method === "POST" ? "POST" : "GET", height);
      return json(res, r.status, r.body);
    }
    if (req.method !== "POST") return json(res, 405, { error: "POST /debug/reload-snapshot" });
    return json(res, ...(await reloadSnapshot(height)));
  }
  if (route === "info") return json(res, 200, { database: sql !== null, snapshotBuilds: adminSecret !== null, cursor: sql === null ? null : (await sql.unsafe("SELECT max(height) AS h FROM core_block_commit.blocks"))[0]?.h });
  if (sql === null) return json(res, 404, { error: "start serve.ts with --db-url and --db-password-file" });
  if (route === "state") {
    const height = Number(url.searchParams.get("height"));
    const [row] = await sql.unsafe("SELECT zswap_first_free, zswap_root FROM core_ledger_state.states WHERE height = $1::bigint", [height]);
    if (row === undefined) return json(res, 404, { error: `no state row at ${height}` });
    return json(res, 200, { height, firstFree: Number(row.zswap_first_free), root: rootHex(row.zswap_root) });
  }
  if (route === "output") {
    const position = Number(url.searchParams.get("position"));
    const [row] = await sql.unsafe(
      "SELECT height, tx_index, commitment, ciphertext, evidence FROM core_ledger_state.events WHERE kind = 'zswap-output' AND tree_index = $1::bigint",
      [position],
    );
    if (row === undefined) return json(res, 404, { error: `no stored output at ${position}` });
    return json(res, 200, { position, height: Number(row.height), txIndex: Number(row.tx_index), commitment: hex(row.commitment), ciphertext: hex(row.ciphertext), evidence: row.evidence });
  }
  if (route === "spends") {
    const n = Math.min(100, Math.max(1, Number(url.searchParams.get("n") ?? "5")));
    const maxHeight = Number(url.searchParams.get("maxHeight") ?? Number.MAX_SAFE_INTEGER);
    const rows = await sql.unsafe(
      "SELECT nullifier, height, tx_index FROM core_ledger_state.events WHERE kind = 'zswap-input' AND height <= $1::bigint ORDER BY random() LIMIT $2",
      [maxHeight, n],
    );
    return json(res, 200, { spends: rows.map((r) => ({ nullifier: hex(r.nullifier), height: Number(r.height), txIndex: Number(r.tx_index) })) });
  }
  return json(res, 404, { error: `no debug route ${route}` });
}

async function proxy(req: IncomingMessage, res: ServerResponse, url: URL): Promise<void> {
  if (url.pathname.startsWith("/pss/v1/admin")) return json(res, 403, { error: "the page does not call the admin routes (use /debug/snapshot)" });
  const body = req.method === "GET" || req.method === "HEAD" ? undefined : await readBody(req);
  const headers: Record<string, string> = {};
  for (const h of ["content-type", "range", "if-none-match"]) {
    const v = req.headers[h];
    if (typeof v === "string") headers[h] = v;
  }
  const r = await fetch(new URL(url.pathname + url.search, upstream), { method: req.method, headers, ...(body === undefined ? {} : { body }) });
  const out: Record<string, string> = { "Cache-Control": "no-store" };
  for (const h of ["content-type", "content-length", "content-range", "etag", "pss-snapshot-id", "accept-ranges"]) {
    const v = r.headers.get(h);
    if (v !== null) out[h] = v;
  }
  res.writeHead(r.status, out);
  res.end(Buffer.from(await r.arrayBuffer()));
}

function file(res: ServerResponse, pathname: string): void {
  const path = normalize(join(dist, pathname === "/" ? "index.html" : pathname));
  if (!path.startsWith(dist) || !existsSync(path) || !statSync(path).isFile()) {
    res.writeHead(404, { "Content-Type": "text/plain" });
    res.end("not found");
    return;
  }
  res.writeHead(200, { "Content-Type": TYPES[extname(path)] ?? "application/octet-stream", "Cache-Control": "no-store" });
  createReadStream(path).pipe(res);
}

const server = createServer((req, res) => {
  // Cross-origin isolation: the PIR setup matrix is a SharedArrayBuffer, which a page has only when isolated.
  res.setHeader("Cross-Origin-Opener-Policy", "same-origin");
  res.setHeader("Cross-Origin-Embedder-Policy", "require-corp");
  const url = new URL(req.url ?? "/", "http://localhost");
  const handle = url.pathname.startsWith("/pss/v1/") ? proxy(req, res, url) : url.pathname.startsWith("/debug/") ? debug(req, res, url) : (file(res, url.pathname), Promise.resolve());
  handle.catch((error: unknown) => {
    if (!res.headersSent) json(res, 502, { error: error instanceof Error ? error.message : String(error) });
    else res.end();
  });
});
server.listen(Number(opt.port), "127.0.0.1", () => {
  process.stdout.write(
    `serving ${dist} on http://127.0.0.1:${opt.port}/ — API ${upstream.origin}` +
      `${sql === null ? "" : ", database debug routes on"}${adminSecret === null ? "" : ", snapshot builds on"}\n`,
  );
});
