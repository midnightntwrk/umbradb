// The orphan watcher of `test/child-processes.ts` (core-arch task 0.5): one per test process, started by it with a pipe
// as standard input, in a process group of its own (so that a Ctrl-C or a signal to the test process's group does not
// reach it). Each line it reads is `+<pid>` (a child the test process started), `-<pid>` (that child exited) or
// `#label=org.umbradb.test.<name>=<value>` (a Docker label filter naming the test process's containers, from
// `test/containers.ts`; the filters given are all required). When its input ends — the test process ended, however
// it ended, so the operating system closed the pipe — it kills every child still listed with SIGKILL, which also ends a
// stopped child or one whose event loop is blocked, then removes every container the filters match, and exits.
//
// Plain JavaScript, so that it starts without a loader.

import { spawnSync } from "node:child_process";

const listed = new Set();
const filters = new Set();

/** A child's pid, as a line names it: a positive integer above 1 (never 0, which would be this process's group). */
const LINE = /^([+-])([1-9][0-9]*)$/;
/** A filter of the test process's containers: one of the labels `test/containers.ts` gives them. */
const FILTER = /^#(label=org\.umbradb\.test\.[a-z]+=.+)$/;

let pending = "";
let ended = false;

function read(line) {
  const filter = FILTER.exec(line);
  if (filter !== null) filters.add(filter[1]);
  const match = LINE.exec(line);
  if (match === null) return;
  const pid = Number(match[2]);
  if (pid <= 1 || !Number.isSafeInteger(pid)) return;
  if (match[1] === "+") listed.add(pid);
  else listed.delete(pid);
}

// A line not ended by its newline when the input ends is dropped: it can only be a cut write, whose pid may be cut too.
function end() {
  if (ended) return;
  ended = true;
  for (const pid of listed) {
    try {
      process.kill(pid, "SIGKILL");
    } catch {
      // Already gone.
    }
  }
  if (filters.size > 0) removeContainers();
  process.exit(0);
}

/** Removes the containers every filter matches (none when the test process stopped its own); Docker's errors ignored. */
function removeContainers() {
  const args = ["ps", "-a", "-q", "--no-trunc", ...[...filters].flatMap((value) => ["--filter", value])];
  const found = spawnSync("docker", args, { encoding: "utf8", timeout: 120_000 });
  const ids = (found.stdout ?? "").split("\n").filter(Boolean);
  if (ids.length > 0) spawnSync("docker", ["rm", "-f", "-v", ...ids], { stdio: "ignore", timeout: 120_000 });
}

process.stdin.setEncoding("utf8");
process.stdin.on("data", (chunk) => {
  pending += chunk;
  let newline = pending.indexOf("\n");
  while (newline !== -1) {
    read(pending.slice(0, newline));
    pending = pending.slice(newline + 1);
    newline = pending.indexOf("\n");
  }
});
process.stdin.on("end", end);
process.stdin.on("close", end);
process.stdin.on("error", end);
