import { existsSync, mkdtempSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { completenessProblems, readTapeFile, runTapeCommand, type TapeCommandIo } from "../../tools/tape/index.js";
import { ScriptedNode } from "./scripted-node.js";
import { syntheticChain } from "./synthetic-chain.js";

/**
 * The tape command's `range` and `boundaries` (`tools/tape/command.ts`; task 0.3): `range` records every IN-8 call of
 * every height of a range and a live window through the recording builder (`./range.ts`), checks the tape complete,
 * writes it and prints its SHA-256, size, request rate and the node version the node reports (`system_version`, read
 * outside the builder, so it is not on the tape); `boundaries` reads a network's genesis and runtime upgrades
 * (`./boundaries.ts`) and writes the record the built-in tables cite. Against synthetic chains on the scripted node.
 */

let directory = "";
beforeEach(() => {
  directory = mkdtempSync(join(tmpdir(), "umbradb-range-"));
});
afterEach(() => {
  rmSync(directory, { recursive: true, force: true });
});

function io(): TapeCommandIo & { readonly lines: string[]; readonly errors: string[] } {
  const lines: string[] = [];
  const errors: string[] = [];
  return {
    lines,
    errors,
    out: (line) => lines.push(line),
    err: (line) => errors.push(line),
    untilStopped: () => new Promise(() => undefined),
  };
}

async function withChain<T>(chain: ReturnType<typeof syntheticChain>, body: (node: ScriptedNode) => Promise<T>): Promise<T> {
  const node = await ScriptedNode.start(chain.script);
  try {
    return await body(node);
  } finally {
    await node.stop();
  }
}

describe("tape command: range", () => {
  it("records the range, checks it complete, writes it and prints its id, size, rate and the node's version", async () => {
    const chain = syntheticChain({ length: 20, upgrades: [{ height: 6, specVersion: 1_000_000 }], registrations: 1 });
    await withChain(chain, async (node) => {
      const out = join(directory, "range.tape.jsonl");
      const run = io();
      const argv = ["range", "--node", node.url, "--from", "0", "--to", "9", "--out", out, "--concurrency", "2", "--chunk", "4", "--live-seconds", "0"];
      expect(await runTapeCommand(argv, run)).toBe(0);
      expect(run.errors).toEqual([]);
      const tape = readTapeFile(out);
      expect(completenessProblems(tape.records, { from: 0, to: 9 })).toEqual([]);
      const bytes = readFileSync(out).length;
      expect(run.lines[0]).toBe("node version: 0.0.0-synthetic (system_version, not on the tape)");
      expect(run.lines).toContain(`${tape.id}  ${out}`);
      expect(run.lines.find((line) => line.startsWith(`${tape.records.length} records, ${bytes} bytes; `))).toMatch(
        /requests in [\d.]+ s \([\d.]+ requests\/s, concurrency 2\); 3 chunks, 0 recorded again$/,
      );
      expect(run.lines).toContain("runtimes (state spec_version from height): 0: 22000, 6: 1000000; metadata at 0, 6");
      expect(run.lines.at(-1)).toBe("complete: every IN-8 call of every height 0–9 is on the tape (Q123)");
      expect(run.lines.some((line) => line.includes(node.url))).toBe(false);
    });
  });

  it("says the node did not report its version, and records anyway", async () => {
    const chain = syntheticChain({ length: 5 });
    const script = chain.script;
    const quiet = { ...chain, script: (request: Parameters<typeof script>[0]) => (request.method === "system_version" ? [{ error: { code: -32601, message: "Method not found" } }] : script(request)) };
    await withChain(quiet, async (node) => {
      const out = join(directory, "quiet.tape.jsonl");
      const run = io();
      expect(await runTapeCommand(["range", "--node", node.url, "--from", "1", "--to", "2", "--out", out, "--live-seconds", "0"], run)).toBe(0);
      expect(run.lines[0]).toBe("node version: not reported (system_version: -32601 Method not found)");
    });
  });

  it("exits 1 naming the failure, writing nothing, when the recording fails", async () => {
    const chain = syntheticChain({ length: 5 });
    await withChain(chain, async (node) => {
      const out = join(directory, "never.tape.jsonl");
      const run = io();
      expect(await runTapeCommand(["range", "--node", node.url, "--from", "3", "--to", "9", "--out", out, "--live-seconds", "0"], run)).toBe(1);
      expect(run.errors.join("\n")).toMatch(/^heights 3–9: .*node-requirement/);
      expect(existsSync(out)).toBe(false);
    });
  });

  it("refuses bad arguments with its usage and exit 2", async () => {
    const out = join(directory, "x.tape.jsonl");
    const rows: readonly string[][] = [
      ["range", "--node", "ws://127.0.0.1:1", "--out", out],
      ["range", "--node", "ws://127.0.0.1:1", "--from", "0", "--out", out],
      ["range", "--node", "ws://127.0.0.1:1", "--from", "x", "--to", "1", "--out", out],
      ["range", "--node", "ws://127.0.0.1:1", "--from", "0", "--to", "1", "--out", out, "--concurrency", "0"],
      ["range", "--node", "ws://127.0.0.1:1", "--from", "0", "--to", "1", "--out", out, "--step", "1"],
      ["record", "--node", "ws://127.0.0.1:1", "--out", out, "--from", "1"],
    ];
    for (const argv of rows) {
      const run = io();
      expect(await runTapeCommand(argv, run), argv.join(" ")).toBe(2);
      expect(run.errors.join("\n")).toContain("usage: tsx tools/tape/main.ts record");
      expect(run.errors.join("\n")).toContain("tsx tools/tape/main.ts range --node <ws-url> --from <height> --to <height> --out <file>");
    }
    writeFileSync(out, "kept");
    const taken = io();
    expect(await runTapeCommand(["range", "--node", "ws://127.0.0.1:1", "--from", "0", "--to", "1", "--out", out], taken)).toBe(2);
    expect(taken.errors).toEqual([`the file ${out} exists: the tape tools do not write over a file`]);
  });
});

describe("tape command: boundaries", () => {
  it("writes the genesis, the boundaries and the node's answers as a record, and prints them", async () => {
    const chain = syntheticChain({ length: 120, upgrades: [{ height: 70, specVersion: 1_000_000 }] });
    await withChain(chain, async (node) => {
      const out = join(directory, "boundaries.json");
      const run = io();
      expect(await runTapeCommand(["boundaries", "--node", node.url, "--out", out, "--step", "25"], run)).toBe(0);
      const record = JSON.parse(readFileSync(out, "utf8")) as {
        description: string;
        recorded: string;
        node: string;
        nodeVersion: string;
        genesis: unknown;
        head: unknown;
        boundaries: unknown[];
        calls: { method: string; params: unknown[]; result: unknown }[];
      };
      expect(record.node).toBe(node.url);
      expect(record.nodeVersion).toBe("0.0.0-synthetic");
      expect(record.recorded).toMatch(/^\d{4}-\d{2}-\d{2}$/);
      expect(record.description).toContain("tools/tape/main.ts boundaries");
      expect(record.genesis).toEqual({ hash: chain.hashes[0], specVersion: 22_000 });
      expect(record.head).toEqual({ height: 119, hash: chain.hashes[119] });
      expect(record.boundaries).toEqual([
        {
          u: { height: 70, hash: chain.hashes[70], specVersion: 22_000 },
          f: { height: 71, hash: chain.hashes[71], specVersion: 1_000_000 },
        },
      ]);
      expect(record.calls.some((call) => call.method === "chain_getHeader" && call.params[0] === chain.hashes[71])).toBe(true);
      expect(run.lines).toEqual([
        "node version: 0.0.0-synthetic (system_version, not on the tape)",
        `genesis ${chain.hashes[0]} spec_version 22000; finalized head 119`,
        `boundary U 70 ${chain.hashes[70]} (22000) → F 71 ${chain.hashes[71]} (1000000)`,
        `${record.calls.length} answers written to ${out}`,
      ]);
    });
  });

  it("refuses bad arguments with its usage and exit 2, and exits 1 when the reading fails", async () => {
    const run = io();
    expect(await runTapeCommand(["boundaries", "--node", "ws://127.0.0.1:1", "--out", join(directory, "b.json"), "--step", "-1"], run)).toBe(2);
    expect(run.errors.join("\n")).toContain("--step must be an integer from 1, not -1");
    expect(run.errors.join("\n")).toContain("tsx tools/tape/main.ts boundaries --node <ws-url> --out <file>");
    const chain = syntheticChain({ length: 5, upgrades: [{ height: 0, specVersion: 1_000_000 }] });
    await withChain(chain, async (node) => {
      const failing = io();
      const out = join(directory, "b.json");
      expect(await runTapeCommand(["boundaries", "--node", node.url, "--out", out], failing)).toBe(1);
      expect(failing.errors.join("\n")).toContain("block 0's MNSV digest names spec_version 22000");
      expect(existsSync(out)).toBe(false);
    });
  });
});
