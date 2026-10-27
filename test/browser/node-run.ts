import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { type BrowserRun, withDevelopmentOptIn } from "../../browser/src/configuration.js";
import { cursorHeight } from "../../src/backbone/core-block-commit/core-block-commit.js";
import { nodeSourceOf } from "../../src/backbone/core-block-fetch/node-source.js";
import { buildDeclarations, commandBuild } from "../../src/cli/build-modules.js";
import { contentsHash } from "../../src/determinism/contents-hash.js";
import { openPglite } from "../../src/db/pglite.js";
import { schemaPlan } from "../../src/modules/adapters.js";
import { NodeClient } from "../../src/node/client.js";
import { type TapeRecord, TapeNode } from "../../tools/tape/index.js";
import { startProcess } from "../runner/process-build.js";
import { PATIENCE_MS } from "./browser-harness.js";
import { coreConfiguration } from "./fixtures/configuration.js";

/**
 * A132's Node.js run (task 16.1; BR-4): the same tape and the same configuration as the page's, in Node.js on PGlite.
 * As the page does with a new database (BR-2), it first asks the node's finalized head on a connection of its own and
 * takes it as S; then it runs the process the page's core worker runs — the command's build with the configuration's
 * user modules (`commandBuild`), the configuration's data for that run (`coreConfiguration`, the module the page
 * bundles) with the development opt-in, the node's block source (`nodeSourceOf`) and a ledger worker thread — on a
 * PGlite database in a temporary directory, until its cursor is `to`; then stops it, opens the directory and reads its
 * contents hash (DT-3), with the tables its build declares `deterministic: false` named (none here).
 */

/** What a Node.js run gave: S, the height its contents hash was read at, and the hash (`0x` hex). */
export interface NodeRunResult {
  readonly start: number;
  readonly height: string | null;
  readonly hash: string;
  readonly lines: readonly string[];
}

const hex = (bytes: Uint8Array): string => `0x${Buffer.from(bytes).toString("hex")}`;

/** Runs the process over a tape node serving `records` to height `to` (see the module comment). */
export async function nodeRun(records: readonly TapeRecord[], params: Readonly<Record<string, string>>, to: bigint): Promise<NodeRunResult> {
  const node = await TapeNode.start({ records });
  const directory = mkdtempSync(join(tmpdir(), "umbradb-a132-"));
  const lines: string[] = [];
  try {
    const client = new NodeClient({ url: node.url });
    let start: number;
    try {
      start = Number((await client.header(await client.finalizedHead())).number);
    } finally {
      await client.close();
    }
    const run: BrowserRun = { node: node.url, storage: "memory", start, params };
    const { data, modules } = coreConfiguration(run);
    const entries = (withDevelopmentOptIn(data) as { entries: Record<string, unknown>[] }).entries.map((entry) =>
      entry.id === "core" ? { ...entry, config: { ...(entry.config as object), database: `pglite:${directory}` } } : entry,
    );
    const handle = startProcess({
      declarations: commandBuild(modules),
      config: { data: { entries } },
      source: nodeSourceOf,
      log: (line) => lines.push(line),
    });
    try {
      const deadline = Date.now() + PATIENCE_MS;
      for (;;) {
        const status = handle.status();
        if (status.cursor === to && status.state === "following") break;
        if (status.ended !== null || Date.now() > deadline) {
          throw new Error(`the Node.js run did not reach ${to}: ${status.state} at ${status.cursor}; log ${lines.join(" | ")}`);
        }
        await sleep(50);
      }
    } finally {
      await handle.stop();
    }
    const declarations = buildDeclarations(modules);
    const { optedOut } = schemaPlan([...declarations.backbone, ...declarations.core, ...declarations.user]);
    const db = await openPglite({ dataDir: directory, committedHeight: cursorHeight, developmentOptIn: true });
    try {
      return await db.read(async (read) => ({
        start,
        height: read.height === null ? null : `${read.height}`,
        hash: hex(await contentsHash(read, { optedOut })),
        lines,
      }));
    } finally {
      await db.close();
    }
  } finally {
    await node.close();
    rmSync(directory, { recursive: true, force: true });
  }
}
