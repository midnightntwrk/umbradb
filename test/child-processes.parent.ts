import { spawn } from "node:child_process";
import { createInterface } from "node:readline";
import { spawnChild } from "./child-processes.js";

/**
 * The parent process of `child-processes.test.ts`, started with `node --import tsx` and one JSON argument ({@link
 * ParentJob}): it starts one child — with {@link spawnChild}, or with plain `spawn` for the negative control — waits
 * until the child is ready, reports `{"child": <pid>}` as one JSON line on stdout, and then lives until it is killed,
 * so that the test can orphan the child on purpose. With `child: "exits"` it waits for the child to exit, reports
 * `{"exited": true}` and holds nothing open, so that it ends by itself if the guard keeps nothing alive.
 *
 * This file starts a child with plain `spawn` (the negative control's); the test lists the child with its own guard.
 */

export interface ParentJob {
  readonly guarded: boolean;
  /** `running`: ignores SIGTERM and waits; `blocked`: its event loop never returns; `exits`: exits at once. */
  readonly child: "running" | "blocked" | "exits";
}

const CHILDREN: Record<ParentJob["child"], string> = {
  running: 'process.on("SIGTERM", () => undefined); process.stdout.write("ready\\n"); setInterval(() => undefined, 1 << 30);',
  blocked: 'process.stdout.write("ready\\n", () => { for (;;); });',
  exits: 'process.stdout.write("ready\\n", () => process.exit(0));',
};

const job = JSON.parse(process.argv[2] as string) as ParentJob;
const start = job.guarded ? spawnChild : spawn;
const child = start(process.execPath, ["--no-warnings", "-e", CHILDREN[job.child]], { stdio: ["ignore", "pipe", "ignore"] });
const exited = new Promise<void>((resolve) => child.once("exit", () => resolve()));
const lines = createInterface({ input: child.stdout! });
lines.once("line", () => {
  lines.close();
  process.stdout.write(`${JSON.stringify({ child: child.pid })}\n`);
  if (job.child === "exits") {
    void exited.then(() => process.stdout.write(`${JSON.stringify({ exited: true })}\n`));
    return;
  }
  child.stdout!.destroy();
  setInterval(() => undefined, 1 << 30);
});
