#!/usr/bin/env node
/**
 * The local preprod runs: one sync of an UmbraDB build from genesis against Midnight preprod's archive node on the
 * owner's LAN, which no CI reaches. Their results are manual evidence for the pull request: this is not a test file,
 * and nothing of it is in the required-test manifest. [R23, R24, R25; ledger-refcount design §12]
 *
 * **The node.** `UMBRADB_LOCAL_NODE` holds the node's WebSocket URL (`ws://<host>:<port>`). It is checked before
 * anything else: unset, empty or not a WebSocket URL, the script exits 2 naming it, having started and written
 * nothing. [ledger-refcount design §12.1]
 *
 * **Usage.**
 *
 *     UMBRADB_LOCAL_NODE=ws://<host>:<port> node scripts/local-preprod-sync.mjs \
 *       --label <name> --stop <height> --out <dir> [--build <dir>] [--sweep on|off] [--keep]
 *
 * - `--label`: names the run's Docker objects (`umbradb-lp-<label>-net`, `-pgdata`, `-pg`, `-run`); lowercase letters,
 *   digits and `-`. None of them may exist yet.
 * - `--stop`: the `core` entry's `stop`, the last height the run commits.
 * - `--out`: the run's folder, new or empty: its configuration and its records (below).
 * - `--build`: the UmbraDB checkout whose `umbradb run` runs, built (`npm ci`, `npm run build`); this repository by
 *   default. A comparison of two builds runs each from its own checkout.
 * - `--sweep`: the `core` entry's `sweep`, `on` by default; `off` also sets `developmentOptIn`, which it needs.
 * - `--keep`: keeps the database container, its volume and the network after the run, for reads after it.
 *
 * **What runs.** A PostgreSQL 18 container — the repository's one PostgreSQL image, `postgres:18-alpine` pinned by
 * digest in `test/postgres-image.ts` — with a volume of its own, on a Docker network of the run's own, and the build's
 * `umbradb run` in a `node:24.9.0-alpine` container on the same network, which reaches the database as
 * `<container>:5432`: from the host, through Docker Desktop's port, every database answer over ~8–16 KB costs ~14 ms,
 * which would measure Docker Desktop rather than UmbraDB. The build (read only) and the folder are mounted at their
 * own paths. Every core module but `core-contract-logs-fast` runs from 0; the configuration's `umbradb` import
 * resolves through the folder's `node_modules/umbradb`, a link to the build. The database's password is the
 * folder's `pg-password` (mode 600) while the database exists, given to both containers through their environment,
 * never on a command line. The admin listener and the database are published on 127.0.0.1, on ports Docker picks
 * (`run.json`), so the database can be read during the run. The run ends at its stop height (`stopped`), at a halt or
 * a refusal, or when its container ends; the script then stops the container (SIGTERM: the height in progress
 * finishes) and removes what it created but, with `--keep`, the database, its volume and the network. A SIGINT or
 * SIGTERM to the script ends the run the same way; a second one ends the script at once, naming what is left.
 * [ledger-refcount design §12.1]
 *
 * **What it records.** Every `/status` sample that changed (`status.jsonl`: the time, the state, the cursor, the
 * last commit's wall-clock time, a halt's or refusal's reason); the run's log (`run.log`); and per 1,000-height window
 * — heights 1,000·w to 1,000·w + 999, from the commit of the height before it to the commit of its last, each commit's
 * time interpolated linearly between the `/status` samples around it (the admin snapshot changes about once a
 * second) — its wall time, its heights per second, and the stored row count of `core_ledger_state.nodes`, read once
 * the window ends, with the height it was read at (`windows.jsonl`, as each window ends). The first window counts
 * from the first commit seen, the last ends at the stop height; either is marked `partial` when it holds fewer than
 * 1,000 heights. [R23, R24; ledger-refcount design §12.1]
 *
 * **The probe.** Beside the run, once a second, it asks the node for `state_getRuntimeVersion` at the run's latest
 * block (the `/status` cursor's hash, from `chain_getBlockHash`) and records each answer's time (`probe.jsonl`); no
 * call is sent while one is unanswered. A window is marked slow when a call slower than 1 s overlapped the run's pass
 * through it: the performance comparison leaves such a window out of both runs'. The windows' times are the run
 * container's wall clock (`lastCommitAt`), the probe's the host's. [R23; ledger-refcount design §12.3]
 *
 * At the end `windows.json` holds every window with its row count and its probe mark, and `summary.json` the run: its
 * build and commit, its settings, the images' digests, how it ended, the slow windows. The comparison's band ratios
 * are computed from two runs' `windows.json`, not here.
 *
 * Exit codes: 0 when the run committed its stop height; 1 when it ended otherwise or could not start; 2 for a usage
 * error, the node's variable included.
 */

import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import {
  appendFileSync, createWriteStream, existsSync, mkdirSync, readdirSync, readFileSync, rmSync, statSync, symlinkSync,
  writeFileSync,
} from "node:fs";
import { dirname, join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { POSTGRES_IMAGE } from "../test/postgres-image.ts";

/** The variable that names the node; nothing runs without it. [ledger-refcount design §12.1] */
const VARIABLE = "UMBRADB_LOCAL_NODE";

const NODE_URL = (process.env[VARIABLE] ?? "").trim();
if (!/^wss?:\/\/\S+$/.test(NODE_URL)) {
  const found = NODE_URL === "" ? "it is not set" : "it holds no ws:// or wss:// URL"; // nosemgrep: javascript.lang.security.detect-insecure-websocket.detect-insecure-websocket
  process.stderr.write(
    `${VARIABLE} must hold the local archive node's WebSocket URL (ws://<host>:<port>), and ${found}. ` + // nosemgrep: javascript.lang.security.detect-insecure-websocket.detect-insecure-websocket
      "These runs need that node, on the owner's LAN only: nothing was started.\n",
  );
  process.exit(2);
}

const REPOSITORY = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const NODE_IMAGE = "node:24.9.0-alpine";
const DATABASE = "umbradb";
const ADMIN_PORT = 8081;
/** Heights per window. */
const WINDOW = 1000;
/** A probe answer slower than this marks the windows its call overlapped. [R23] */
const SLOW_MS = 1000;
const STATUS_EVERY_MS = 250;
const PROBE_EVERY_MS = 1000;
/** How long `docker stop` lets the run finish its height before it kills it. */
const STOP_TIMEOUT_S = 300;
const DATABASE_READY_MS = 120_000;
const ADMIN_ANSWERS_MS = 600_000;
/** Every core module but `core-contract-logs-fast`, from 0. [R23, R24] */
const CORE_MODULES = Object.freeze([
  "CORE_CHAIN_EVENTS", "CORE_BLOCK_PARSED", "CORE_TX_RESULTS", "CORE_LEDGER_STATE", "CORE_CONTRACT_STATES",
  "CORE_CONTRACT_LOGS_FULL",
]);
/** The stored node count and the height it is read at, in one statement, so one snapshot. */
const NODE_COUNT_SQL =
  "SELECT (SELECT max(height) FROM core_block_commit.blocks), (SELECT count(*) FROM core_ledger_state.nodes)";

const USAGE =
  `usage: ${VARIABLE}=ws://<host>:<port> node scripts/local-preprod-sync.mjs --label <name> --stop <height> ` + // nosemgrep: javascript.lang.security.detect-insecure-websocket.detect-insecure-websocket
  "--out <dir> [--build <dir>] [--sweep on|off] [--keep]";

/** Ends the script with a usage error. */
function usage(message) {
  process.stderr.write(`${message}\n${USAGE}\n`);
  process.exit(2);
}

/** The command line, checked. */
function settings() {
  let values;
  try {
    ({ values } = parseArgs({
      options: {
        label: { type: "string" },
        stop: { type: "string" },
        out: { type: "string" },
        build: { type: "string" },
        sweep: { type: "string" },
        keep: { type: "boolean" },
      },
      strict: true,
      allowPositionals: false,
    }));
  } catch (error) {
    usage(error instanceof Error ? error.message : String(error));
  }
  const label = values.label ?? usage("--label is required");
  if (!/^[a-z0-9][a-z0-9-]{0,39}$/.test(label)) usage("--label takes lowercase letters, digits and -, at most 40");
  const stop = Number(values.stop ?? usage("--stop is required"));
  if (!Number.isSafeInteger(stop) || stop < 1) usage("--stop takes a height above 0");
  const out = resolve(values.out ?? usage("--out is required"));
  if (existsSync(out) && (!statSync(out).isDirectory() || readdirSync(out).length > 0)) {
    usage(`--out ${out} is not an empty folder`);
  }
  const sweep = values.sweep ?? "on";
  if (sweep !== "on" && sweep !== "off") usage("--sweep takes on or off");
  const build = resolve(values.build ?? REPOSITORY);
  const main = join(build, "dist", "cli", "main.js");
  if (!existsSync(main)) usage(`${main} does not exist: run npm ci and npm run build in ${build}`);
  const manifest = JSON.parse(readFileSync(join(build, "package.json"), "utf8"));
  if (manifest.name !== "umbradb") usage(`${build} is no UmbraDB checkout (its package.json names ${manifest.name})`);
  return { label, stop, out, sweep, build, main, keep: values.keep === true };
}

/** Runs `docker` with `args` and returns its standard output; throws naming the command when it fails. */
function docker(args, env = process.env) {
  const result = spawnSync("docker", args, { encoding: "utf8", env });
  if (result.error !== undefined) throw new Error(`docker ${args[0]}: ${result.error.message}`);
  if (result.status !== 0) throw new Error(`docker ${args.join(" ")} exited ${result.status}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}

/** `docker` without blocking the script: resolves with its standard output, rejects naming the command. */
function dockerLater(args, env = process.env) {
  return new Promise((done, failed) => {
    const child = spawn("docker", args, { stdio: ["ignore", "pipe", "pipe"], env });
    let stdout = "";
    let stderr = "";
    child.stdout.setEncoding("utf8").on("data", (data) => (stdout += data));
    child.stderr.setEncoding("utf8").on("data", (data) => (stderr += data));
    child.on("error", failed);
    child.on("close", (code) => {
      if (code === 0) done(stdout.trim());
      else failed(new Error(`docker ${args.join(" ")} exited ${code}: ${stderr.trim()}`));
    });
  });
}

/** Whether a Docker object of `kind` (`container`, `network`, `volume`) is named `name`. */
function dockerHas(kind, name) {
  return spawnSync("docker", [kind, "inspect", name], { stdio: "ignore" }).status === 0;
}

/** The image's repository digests, pulled first when it is not here. */
function imageDigests(image) {
  if (spawnSync("docker", ["image", "inspect", image], { stdio: "ignore" }).status !== 0) docker(["pull", image]);
  return JSON.parse(docker(["image", "inspect", "-f", "{{json .RepoDigests}}", image]));
}

/** The host port Docker published `port` of `container` on. */
function publishedPort(container, port) {
  const first = docker(["port", container, `${port}/tcp`]).split("\n")[0] ?? "";
  const match = /:(\d+)$/.exec(first);
  if (match === null) throw new Error(`docker port ${container} ${port}/tcp gave no port: ${first}`);
  return Number(match[1]);
}

/** The build's commit, and whether its tracked files differ from it; null outside a git checkout. */
function commitOf(build) {
  const head = spawnSync("git", ["-C", build, "rev-parse", "HEAD"], { encoding: "utf8" });
  if (head.status !== 0) return { commit: null, dirty: null };
  const status = spawnSync("git", ["-C", build, "status", "--porcelain", "--untracked-files=no"], { encoding: "utf8" });
  return { commit: head.stdout.trim(), dirty: status.status === 0 ? status.stdout.trim() !== "" : null };
}

/** The configuration the run loads: the `core` entry and every core module but `-fast`, from 0. [R23, R24, R25] */
function configText({ stop, sweep, host }) {
  const core = {
    network: "preprod",
    node: NODE_URL,
    database: { kind: "postgres", host, port: 5432, user: "postgres", name: DATABASE, ssl: "disable" },
    listen: { admin: `0.0.0.0:${ADMIN_PORT}` },
    sweep,
    ...(sweep === "off" ? { developmentOptIn: true } : {}),
  };
  return [
    "// Written by scripts/local-preprod-sync.mjs. The password is PGPASSWORD in the run's environment.",
    `import { ${[...CORE_MODULES, "coreEntry", "defineConfig"].join(", ")} } from "umbradb";`,
    "",
    "export default defineConfig({",
    "  entries: [",
    `    coreEntry({ start: 0, stop: ${stop}, config: ${JSON.stringify(core)} }),`,
    ...CORE_MODULES.map((name) => `    ${name}.entry({ start: 0, config: {} }),`),
    "  ],",
    "});",
    "",
  ].join("\n");
}

/** `/status`, or undefined while the admin listener does not answer. */
async function statusOf(port) {
  try {
    const response = await fetch(`http://127.0.0.1:${port}/status`, { signal: AbortSignal.timeout(5_000) });
    return response.ok ? await response.json() : undefined;
  } catch {
    return undefined;
  }
}

/** A JSON-RPC client of the node over one WebSocket, opened again after the node closes it, until it is closed. */
function nodeRpc(url) {
  let socket;
  let opened;
  let next = 1;
  let closed = false;
  const waiting = new Map();
  const open = () => {
    const current = new WebSocket(url);
    socket = current;
    opened = new Promise((done, failed) => {
      current.addEventListener("open", () => done(), { once: true });
      const unreachable = () => failed(new Error(`the node at ${url} cannot be reached`));
      current.addEventListener("error", unreachable, { once: true });
    });
    opened.catch(() => undefined);
    current.addEventListener("message", (event) => {
      let message;
      try {
        message = JSON.parse(String(event.data));
      } catch {
        return;
      }
      const waiter = waiting.get(message.id);
      if (waiter === undefined) return;
      waiting.delete(message.id);
      if (message.error !== undefined) waiter.failed(new Error(`${message.error.code}: ${message.error.message}`));
      else waiter.done(message.result);
    });
    current.addEventListener("close", () => {
      for (const waiter of waiting.values()) waiter.failed(new Error("the node closed the connection"));
      waiting.clear();
      if (socket === current) socket = undefined;
    });
  };
  return {
    async call(method, params) {
      if (closed) throw new Error("the probe has ended");
      if (socket === undefined) open();
      const current = socket;
      await opened;
      if (closed) throw new Error("the probe has ended");
      const id = next++;
      return new Promise((done, failed) => {
        waiting.set(id, { done, failed });
        current.send(JSON.stringify({ jsonrpc: "2.0", id, method, params }));
      });
    },
    close() {
      closed = true;
      socket?.close();
    },
  };
}

/**
 * The windows, from the commits `/status` shows: each commit point is a height and its commit's wall-clock time, and
 * a window's ends between two points are interpolated linearly. [R23; ledger-refcount design §12.1]
 */
function windowClock(closed) {
  let previous;
  let open;
  const endOf = (height) => Math.floor(height / WINDOW) * WINDOW + WINDOW - 1;
  const close = (end, at) => {
    const heights = end - open.height;
    const ms = at - open.ms;
    closed({
      window: Math.floor(end / WINDOW),
      fromHeight: open.height,
      toHeight: end,
      heights,
      partial: heights !== WINDOW,
      startMs: open.ms,
      endMs: at,
      ms,
      heightsPerSecond: ms > 0 ? Math.round((heights * 1_000_000) / ms) / 1000 : null,
    });
    open = { height: end, ms: at };
  };
  return {
    commit(height, ms) {
      if (previous !== undefined && height <= previous.height) return;
      if (previous === undefined) open = { height, ms };
      else {
        const perHeight = (ms - previous.ms) / (height - previous.height);
        for (let end = endOf(previous.height + 1); end <= height; end += WINDOW) {
          close(end, Math.round(previous.ms + perHeight * (end - previous.height)));
        }
      }
      previous = { height, ms };
    },
    /** Closes the window the run stopped in, at the last commit, when it holds any height. */
    finish() {
      if (previous === undefined || open === undefined || previous.height <= open.height) return;
      close(previous.height, previous.ms);
    },
  };
}

/** The probe's mark of a window: the calls that overlapped it, the slowest, and whether one was slower than 1 s. */
function probeMark(window, calls, endedMs) {
  let count = 0;
  let maxMs = null;
  for (const call of calls) {
    if (call.sentMs === undefined) continue;
    const until = call.answeredMs ?? call.failedMs ?? endedMs;
    if (call.sentMs > window.endMs || until < window.startMs) continue;
    count += 1;
    maxMs = Math.max(maxMs ?? 0, until - call.sentMs);
  }
  return { calls: count, maxMs, slow: maxMs !== null && maxMs > SLOW_MS };
}

async function main() {
  const run = settings();
  const names = {
    network: `umbradb-lp-${run.label}-net`,
    volume: `umbradb-lp-${run.label}-pgdata`,
    database: `umbradb-lp-${run.label}-pg`,
    run: `umbradb-lp-${run.label}-run`,
  };
  try {
    docker(["version", "--format", "{{.Server.Version}}"]);
  } catch (error) {
    process.stderr.write(`Docker does not answer: ${error.message}\n`);
    return 1;
  }
  for (const [kind, name] of [["network", names.network], ["volume", names.volume], ["container", names.database],
    ["container", names.run]]) {
    if (dockerHas(kind, name)) {
      process.stderr.write(`the ${kind} ${name} exists already: choose another --label, or remove it\n`);
      return 1;
    }
  }

  // A first signal ends the run as its stop does; a second ends the script at once, leaving the containers.
  let interrupted;
  for (const signal of ["SIGINT", "SIGTERM"]) {
    process.on(signal, () => {
      if (interrupted === undefined) {
        interrupted = signal;
        return;
      }
      process.stderr.write(`${signal} again: ended at once; docker rm -f ${names.run} ${names.database} && ` +
        `docker volume rm ${names.volume} && docker network rm ${names.network} removes what is left\n`);
      process.exit(130);
    });
  }

  const file = (name) => join(run.out, name);
  const startedAt = new Date().toISOString();
  const images = { node: { image: NODE_IMAGE, digests: imageDigests(NODE_IMAGE) },
    postgres: { image: POSTGRES_IMAGE, digests: imageDigests(POSTGRES_IMAGE) } };
  const { commit, dirty } = commitOf(run.build);
  const password = randomBytes(24).toString("hex");
  const secretEnv = { ...process.env, POSTGRES_PASSWORD: password, PGPASSWORD: password };

  mkdirSync(join(run.out, "node_modules"), { recursive: true });
  symlinkSync(run.build, join(run.out, "node_modules", "umbradb"), "dir");
  writeFileSync(file("package.json"), `${JSON.stringify({ type: "module", private: true })}\n`);
  writeFileSync(file("umbradb.config.ts"), configText({ stop: run.stop, sweep: run.sweep, host: names.database }));
  writeFileSync(file("pg-password"), `${password}\n`, { mode: 0o600 });

  const calls = [];
  const windows = [];
  let outcome;
  let ports;
  let logs;
  let logWritten = Promise.resolve();
  let probeTimer;
  const rpc = nodeRpc(NODE_URL);
  let counts = Promise.resolve();
  try {
    docker(["network", "create", names.network]);
    docker(["volume", "create", names.volume]);
    docker(["run", "-d", "--name", names.database, "--network", names.network, "-v",
      `${names.volume}:/var/lib/postgresql`, "-e", "POSTGRES_PASSWORD", "-e", `POSTGRES_DB=${DATABASE}`, "-p",
      "127.0.0.1::5432", POSTGRES_IMAGE], secretEnv);
    const readyBy = Date.now() + DATABASE_READY_MS;
    while (spawnSync("docker", ["exec", names.database, "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d",
      DATABASE], { stdio: "ignore" }).status !== 0) {
      if (interrupted !== undefined) throw new Error(`interrupted by ${interrupted} before the run started`);
      if (Date.now() > readyBy) throw new Error(`${names.database} was not ready within ${DATABASE_READY_MS / 1000} s`);
      await sleep(500);
    }

    const configFile = file("umbradb.config.ts");
    docker(["run", "-d", "--name", names.run, "--init", "--network", names.network, "--stop-timeout",
      String(STOP_TIMEOUT_S), "-v", `${run.build}:${run.build}:ro`, "-v", `${run.out}:${run.out}`, "-w", run.out, "-e",
      "PGPASSWORD", "-p", `127.0.0.1::${ADMIN_PORT}`, NODE_IMAGE, "node", run.main, "run", "--config", configFile],
    secretEnv);
    const runStartedAt = Date.now();
    const log = createWriteStream(file("run.log"));
    logWritten = new Promise((done) => log.on("close", done));
    logs = spawn("docker", ["logs", "-f", "-t", names.run], { stdio: ["ignore", "pipe", "pipe"] });
    logs.stdout.pipe(log, { end: false });
    logs.stderr.pipe(log, { end: false });
    logs.on("close", () => log.end());
    let exited;
    dockerLater(["wait", names.run]).then((code) => (exited = Number(code)), () => (exited = null));

    ports = { admin: publishedPort(names.run, ADMIN_PORT), database: publishedPort(names.database, 5432) };
    writeFileSync(file("run.json"), `${JSON.stringify({ label: run.label, node: NODE_URL, build: run.build, commit,
      dirty, sweep: run.sweep, stop: run.stop, images, names, ports, startedAt }, null, 2)}\n`);
    process.stdout.write(`${names.run}: admin on 127.0.0.1:${ports.admin}, database on 127.0.0.1:${ports.database}` +
      ` (password in ${file("pg-password")}); records in ${run.out}\n`);

    const clock = windowClock((window) => {
      windows.push(window);
      counts = counts.then(async () => {
        try {
          const text = await dockerLater(["exec", "-e", "PGPASSWORD", names.database, "psql", "-U", "postgres", "-d",
            DATABASE, "-AtX", "-c", NODE_COUNT_SQL], secretEnv);
          const [height, count] = text.split("|");
          window.nodes = { height: Number(height), count: Number(count) };
        } catch (error) {
          window.nodes = { error: error.message };
        }
        appendFileSync(file("windows.jsonl"), `${JSON.stringify(window)}\n`);
      });
    });

    let latest;
    let inFlight = false;
    probeTimer = setInterval(() => {
      if (inFlight || latest === undefined) return;
      inFlight = true;
      const call = { height: latest };
      calls.push(call);
      void (async () => {
        try {
          const hash = await rpc.call("chain_getBlockHash", [call.height]);
          call.sentMs = Date.now();
          await rpc.call("state_getRuntimeVersion", [hash]);
          call.answeredMs = Date.now();
          call.ms = call.answeredMs - call.sentMs;
        } catch (error) {
          call.failedMs = Date.now();
          call.error = error instanceof Error ? error.message : String(error);
        }
        appendFileSync(file("probe.jsonl"), `${JSON.stringify(call)}\n`);
        inFlight = false;
      })();
    }, PROBE_EVERY_MS);

    let seen;
    let answered = false;
    while (outcome === undefined) {
      if (interrupted !== undefined) {
        outcome = { ended: "interrupted", signal: interrupted };
        break;
      }
      if (exited !== undefined) {
        outcome = { ended: "container-exited", exitCode: exited };
        break;
      }
      const status = await statusOf(ports.admin);
      if (status === undefined) {
        if (!answered && Date.now() - runStartedAt > ADMIN_ANSWERS_MS) {
          outcome = { ended: "no-admin", message: `the admin listener did not answer in ${ADMIN_ANSWERS_MS / 1000} s` };
        }
      } else {
        answered = true;
        const sample = { state: status.state, cursor: status.cursor, lastCommitAt: status.lastCommitAt,
          reason: status.reason };
        const key = JSON.stringify(sample);
        if (key !== seen) {
          seen = key;
          appendFileSync(file("status.jsonl"), `${JSON.stringify({ at: Date.now(), ...sample })}\n`);
        }
        if (status.cursor !== null && status.lastCommitAt !== null) {
          latest = Number(status.cursor);
          clock.commit(latest, Date.parse(status.lastCommitAt));
        }
        if (status.state === "stopped" || status.state === "halted" || status.state === "refused") {
          outcome = { ended: status.state, cursor: status.cursor === null ? null : Number(status.cursor),
            reason: status.reason };
          if (status.state === "stopped") clock.finish();
        }
      }
      if (outcome === undefined) await sleep(STATUS_EVERY_MS);
    }
  } catch (error) {
    outcome = { ended: "error", message: error instanceof Error ? error.message : String(error) };
  }

  clearInterval(probeTimer);
  const endedMs = Date.now();
  await counts;
  if (dockerHas("container", names.run)) {
    await dockerLater(["stop", "-t", String(STOP_TIMEOUT_S), names.run]).catch(() => undefined);
    // `docker logs -f` ends with the container; the log is whole once its file is closed.
    if (logs !== undefined && logs.exitCode === null && logs.signalCode === null) {
      await Promise.race([new Promise((done) => logs.on("close", done)), sleep(10_000)]);
      if (logs.exitCode === null && logs.signalCode === null) logs.kill();
    }
    await Promise.race([logWritten, sleep(10_000)]);
    await dockerLater(["rm", "-f", names.run]).catch(() => undefined);
  }
  rpc.close();
  for (const window of windows) window.probe = probeMark(window, calls, endedMs);
  writeFileSync(file("windows.json"), `${JSON.stringify(windows, null, 2)}\n`);

  const removed = [];
  if (!run.keep) {
    for (const [args, name] of [[["rm", "-f", names.database], names.database], [["volume", "rm", names.volume],
      names.volume], [["network", "rm", names.network], names.network]]) {
      const kind = args[0] === "rm" ? "container" : args[0];
      if (!dockerHas(kind, name)) continue;
      await dockerLater(args).then(() => removed.push(name), (error) => process.stderr.write(`${error.message}\n`));
    }
    // The password opens nothing once its database is gone.
    if (!dockerHas("container", names.database)) rmSync(file("pg-password"), { force: true });
  }
  const reached = outcome.ended === "stopped" && outcome.cursor === run.stop;
  const summary = {
    label: run.label,
    node: NODE_URL,
    build: run.build,
    commit,
    dirty,
    sweep: run.sweep,
    stop: run.stop,
    images,
    names,
    ports: ports ?? null,
    startedAt,
    endedAt: new Date(endedMs).toISOString(),
    outcome,
    reachedStop: reached,
    windows: windows.length,
    slowWindows: windows.filter((window) => window.probe.slow).map((window) => window.window),
    windowsWithoutProbe: windows.filter((window) => window.probe.calls === 0).map((window) => window.window),
    kept: run.keep ? [names.database, names.volume, names.network] : [],
    removed,
    clocks: "window times: the run container's wall clock (lastCommitAt); probe times: this host's",
  };
  writeFileSync(file("summary.json"), `${JSON.stringify(summary, null, 2)}\n`);
  process.stdout.write(`${names.run}: ${outcome.ended}${outcome.cursor === undefined ? "" : ` at ${outcome.cursor}`}` +
    `, ${windows.length} windows (${summary.slowWindows.length} slow); ${file("summary.json")}\n`);
  if (run.keep) {
    process.stdout.write(`kept: docker rm -f ${names.database} && docker volume rm ${names.volume} && ` +
      `docker network rm ${names.network} removes them\n`);
  }
  if (logs !== undefined && logs.exitCode === null && logs.signalCode === null) logs.kill();
  return reached ? 0 : 1;
}

process.exit(
  await main().catch((error) => {
    process.stderr.write(`${error instanceof Error ? error.stack : String(error)}\n`);
    return 1;
  }),
);
