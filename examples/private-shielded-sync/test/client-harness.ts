/**
 * The module in UmbraDB's real process over the synthetic chain's tape (`./server-chain.ts`), its routes on a loopback
 * server at a random port ≥ 10000, for the client's tests. The same arrangement as `server-module.test.ts`.
 */

import { createServer, type Server } from "node:http";
import { setTimeout as sleep } from "node:timers/promises";
import { nodeSourceOf } from "../../../src/backbone/core-block-fetch/node-source.js";
import type { ProcessHandle } from "../../../src/runner/process.js";
import { chainDeclarations } from "../../../test/backbone/chain-build.js";
import { genesisOf } from "../../../test/backbone/ingest-harness.js";
import { LEDGER_CORE } from "../../../test/backbone/ledger-restart.js";
import type { ProcessDatabase } from "../../../test/runner/process-backends.js";
import { core, entryOf, startProcess } from "../../../test/runner/process-build.js";
import { TapeNode } from "../../../tools/tape/index.js";
import { listenOnRandomPort } from "../../../tools/tape/port.js";
import { ROUTES } from "../shared/index.ts";
import { pssDeclaration } from "../server/declaration.ts";
import type { PssServer } from "../server/server.ts";
import type { LedgerScenario } from "../../../test/backbone/ledger-tapes.js";

export const ADMIN_SECRET = "pss-client-test-admin-secret-0123";

export interface ModuleRun {
  readonly handle: ProcessHandle;
  readonly origin: string;
  readonly logs: string[];
  readonly lines: string[];
  server(): PssServer;
  close(): Promise<void>;
}

/** Starts the core, the ledger modules and the module over the chain's tape, stopping at `stop`. */
export async function startModule(chain: { readonly scenario: LedgerScenario }, db: ProcessDatabase, options: { stop: number; config: Record<string, unknown> }): Promise<ModuleRun> {
  const records = chain.scenario.records;
  const node = await TapeNode.start({ records });
  const logs: string[] = [];
  const lines: string[] = [];
  let server: PssServer | undefined;
  const pss = pssDeclaration({ log: (line) => logs.push(line), observe: (s) => (server = s) });
  const extra = { node: node.url, genesisHash: genesisOf(records) };
  const entries = [core(db.setting, 0, { extra, stop: options.stop }), ...LEDGER_CORE.map((module) => entryOf(module, 0)), entryOf(pss, 0, options.config)];
  const handle = startProcess({
    declarations: chainDeclarations([pss], { core: LEDGER_CORE }),
    config: { data: { entries } },
    source: (entry, shared) => nodeSourceOf(entry, shared),
    log: (line) => lines.push(line),
  });
  const http: Server = createServer((request, response) => handle.api.http(request, response));
  const port = await listenOnRandomPort(http);
  return {
    handle,
    origin: `http://127.0.0.1:${port}`,
    logs,
    lines,
    server: () => {
      if (server === undefined) throw new Error("the module has not started");
      return server;
    },
    async close() {
      try {
        await handle.stop();
        await handle.closed;
      } finally {
        await server?.close();
        await new Promise<void>((resolve) => http.close(() => resolve()));
        await node.close();
      }
    },
  };
}

/** Waits until the process stopped at `height`. */
export async function stoppedAt(r: ModuleRun, height: number): Promise<void> {
  await r.handle.started;
  const end = await Promise.race([r.handle.ended, sleep(240_000).then(() => null)]);
  if (end === null || end.kind !== "stopped" || end.height !== BigInt(height)) {
    throw new Error(`the process did not stop at ${height}: ${JSON.stringify(end, (_k, v) => (typeof v === "bigint" ? v.toString() : v))}\n${r.lines.join("\n")}`);
  }
}

const auth = { Authorization: `Bearer ${ADMIN_SECRET}` };

export async function adminStatus(r: ModuleRun): Promise<Record<string, any>> {
  const answer = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, { headers: auth });
  if (answer.status !== 200) throw new Error(`admin status ${answer.status}`);
  return (await answer.json()) as Record<string, any>;
}

/** Waits until no build runs and the last build is at `height`. */
export async function builtAt(r: ModuleRun, height: number): Promise<Record<string, any>> {
  for (let waited = 0; waited < 240_000; waited += 50) {
    const s = await adminStatus(r);
    if (s.building === null && s.last?.height === height) {
      if (s.last.ok !== true) throw new Error(`the build at ${height} failed: ${JSON.stringify(s.last)}`);
      return s;
    }
    await sleep(50);
  }
  throw new Error(`no build at ${height} finished: ${r.logs.join("\n")}`);
}

/** Asks for a build at `height` and waits for it. */
export async function buildAt(r: ModuleRun, height: number): Promise<void> {
  const answer = await fetch(`${r.origin}${ROUTES.adminSnapshot}`, {
    method: "POST",
    headers: { ...auth, "Content-Type": "application/json" },
    body: JSON.stringify({ height }),
  });
  if (answer.status !== 202) throw new Error(`build request ${answer.status}: ${await answer.text()}`);
  await builtAt(r, height);
}
