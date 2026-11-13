/**
 * What the server observed (spec FR-154): the module logs one JSON line per request (FR-080: route, status, body and
 * answer lengths, range, milliseconds; never a body). The benchmark reads those lines — from a file of the process's
 * output (`run.log`, as `run/sync.mjs record` writes it), from `docker logs` of the run container, or handed over by a
 * test — and pairs each with the client's own record of the request.
 *
 * Pairing: a request's server line has the route's registered pattern (`GET /pss/v1/blob/:digest`) and the same
 * status; among the unused lines that do, within a few seconds of the time the client received the answer's headers
 * (allowing for a container's clock), one with the same body and answer lengths is preferred, then the one logged
 * closest to that time.
 */

import { execFile } from "node:child_process";
import { readFileSync } from "node:fs";
import type { RequestRecord } from "../client/http.ts";
import { ROUTES } from "../shared/index.ts";
import type { ObservedRequest } from "./bench-results.ts";

/** One request line of the module's log. */
export interface ServerRequestLine {
  readonly at: string;
  readonly atMs: number;
  readonly route: string;
  readonly status: number;
  readonly bodyBytes: number;
  readonly answerBytes: number;
  readonly range: string | null;
  readonly ms: number;
}

/** The module's request lines among `lines` (other lines, and lines with a `docker logs -t` prefix, are handled). */
export function parseServerLines(lines: Iterable<string>): ServerRequestLine[] {
  const out: ServerRequestLine[] = [];
  for (const line of lines) {
    const start = line.indexOf("{");
    if (start < 0) continue;
    let record: Record<string, unknown>;
    try {
      record = JSON.parse(line.slice(start)) as Record<string, unknown>;
    } catch {
      continue;
    }
    if (record.pss !== true || record.event !== "request" || typeof record.at !== "string") continue;
    const atMs = Date.parse(record.at);
    if (!Number.isFinite(atMs)) continue;
    out.push({
      at: record.at,
      atMs,
      route: String(record.route),
      status: Number(record.status),
      bodyBytes: Number(record.bodyBytes),
      answerBytes: Number(record.answerBytes),
      range: typeof record.range === "string" ? record.range : null,
      ms: Number(record.ms),
    });
  }
  return out.sort((a, b) => a.atMs - b.atMs);
}

/** The lines of a log file. */
export function logFileLines(path: string): string[] {
  return readFileSync(path, "utf8").split("\n");
}

/** `docker logs --since <since> -t <container>` (read only), both streams. */
export function dockerLogLines(container: string, since: Date): Promise<string[]> {
  if (!/^[A-Za-z0-9][A-Za-z0-9_.-]*$/.test(container)) throw new Error(`not a container name: ${container}`);
  return new Promise((resolve, reject) => {
    execFile("docker", ["logs", "--since", since.toISOString(), "-t", container], { maxBuffer: 512 * 1024 * 1024 }, (error, stdout, stderr) => {
      if (error !== null) reject(new Error(`docker logs ${container}: ${error.message}`));
      else resolve(`${stdout}\n${stderr}`.split("\n"));
    });
  });
}

/** The server's route pattern for a client request's path. */
export function routePattern(method: string, path: string): string {
  if (path.startsWith(ROUTES.blob)) return `${method} ${ROUTES.blob}:digest`;
  return `${method} ${path}`;
}

/** A path with an artifact's digest replaced by `<digest>` (what the report prints). */
export function printablePath(path: string): string {
  return path.startsWith(ROUTES.blob) ? `${ROUTES.blob}<digest>` : path;
}

/** Pairs each client request with a server line (see the module comment); lines taken are added to `used`. */
export function pairRequests(
  records: readonly RequestRecord[],
  answeredAt: readonly number[] | null,
  lines: readonly ServerRequestLine[],
  used: Set<ServerRequestLine>,
  toleranceMs = 5_000,
): ObservedRequest[] {
  return records.map((r, i) => {
    const pattern = routePattern(r.method, r.path);
    const when = answeredAt?.[i];
    let best: ServerRequestLine | null = null;
    let bestScore = Number.POSITIVE_INFINITY;
    if (when !== undefined) {
      for (const line of lines) {
        if (used.has(line) || line.route !== pattern || line.status !== r.status) continue;
        const distance = Math.abs(line.atMs - when);
        if (distance > toleranceMs) continue;
        // Two artifacts' requests a few milliseconds apart share a route: the lengths tell them apart.
        const score = distance + (line.bodyBytes === r.bodyBytes && line.answerBytes === r.answerBytes ? 0 : toleranceMs);
        if (score < bestScore) {
          best = line;
          bestScore = score;
        }
      }
    }
    if (best !== null) used.add(best);
    return {
      method: r.method,
      route: printablePath(r.path),
      status: r.status,
      bodyBytes: r.bodyBytes,
      answerBytes: r.answerBytes,
      clientMs: r.ms,
      server:
        best === null
          ? null
          : { route: best.route, status: best.status, bodyBytes: best.bodyBytes, answerBytes: best.answerBytes, range: best.range, ms: best.ms, at: best.at },
    };
  });
}
