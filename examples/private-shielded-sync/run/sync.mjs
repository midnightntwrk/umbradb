#!/usr/bin/env node
/**
 * Runs a long-lived UmbraDB process that syncs Midnight Preprod and keeps following it, for the private shielded
 * sync proof of concept. PostgreSQL 18 and `umbradb run` run in Docker on one network (from the host, every large
 * database answer through Docker Desktop's port costs ~14 ms, which would measure Docker Desktop rather than UmbraDB).
 *
 *     PSS_NODE_WS=<ws-url> node examples/private-shielded-sync/run/sync.mjs up --label <name> --out <dir>
 *       --build <checkout> [--api-port <p>] [--admin-port <p>]
 *       [--module <file.ts>#<export> --module-config <file.json> [--module-start <height>]]
 *     node examples/private-shielded-sync/run/sync.mjs down|record|destroy --label <name> --out <dir>
 *     PSS_NODE_WS=<ws-url> node examples/private-shielded-sync/run/sync.mjs config --label <name> --out <dir>
 *       --build <checkout> [--module <file.ts>#<export> --module-config <file.json> [--module-start <height>]]
 *
 * - `up` creates the network, the volume and the database when they do not exist (a new database starts at 0, an
 *   existing one resumes at its cursor), writes the configuration into `--out` and starts the run container,
 *   detached, with the build mounted read only and `--out` read-write at their own paths. The core entry has no stop.
 *   With `--module`, the module's entry starts at `--module-start` (default: the stored cursor + 1, so a module that
 *   owns no tables and declares `startsMidChain` can join a synced database).
 * - `config` writes the configuration file and the `umbradb` link into `--out`, as `up` does, and starts nothing (the
 *   module's start is `--module-start`, 0 unless given): for `umbradb config check` before an `up`.
 * - `down` stops the run container (SIGTERM; the height in progress finishes) and removes it; the database stays.
 * - `record` appends every changed `/status` sample to `status.jsonl` and the run's log to `run.log`, until killed.
 * - `destroy` removes the run container, the database, its volume and the network.
 *
 * The core modules are the ones the module needs: chain events, parsed blocks, transaction results, ledger state.
 * The database password is `<out>/pg-password` (mode 600), passed through the environment only.
 */

import { spawn, spawnSync } from "node:child_process";
import { randomBytes } from "node:crypto";
import { appendFileSync, createWriteStream, existsSync, mkdirSync, readFileSync, symlinkSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { setTimeout as sleep } from "node:timers/promises";
import { parseArgs } from "node:util";

const NODE_IMAGE = "node:24.9.0-alpine";
const POSTGRES_IMAGE =
  "postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873";
const DATABASE = "umbradb";
const ADMIN_PORT = 8081;
const API_PORT = 8080;
const STOP_TIMEOUT_S = 300;
const CORE_MODULES = ["CORE_CHAIN_EVENTS", "CORE_BLOCK_PARSED", "CORE_TX_RESULTS", "CORE_LEDGER_STATE"];

const [command, ...rest] = process.argv.slice(2);
const { values } = parseArgs({
  args: rest,
  options: {
    label: { type: "string" },
    out: { type: "string" },
    build: { type: "string" },
    "api-port": { type: "string" },
    "admin-port": { type: "string" },
    module: { type: "string" },
    "module-config": { type: "string" },
    "module-start": { type: "string" },
  },
});
const fail = (message) => {
  process.stderr.write(`${message}\n`);
  process.exit(2);
};
if (!["up", "config", "down", "record", "destroy"].includes(command ?? "")) fail("usage: sync.mjs up|config|down|record|destroy --label <name> --out <dir> ...");
const label = values.label ?? fail("--label is required");
if (!/^[a-z0-9-]+$/.test(label)) fail("--label takes lowercase letters, digits and -");
const out = resolve(values.out ?? fail("--out is required"));
const names = {
  network: `pss-${label}-net`,
  volume: `pss-${label}-pgdata`,
  database: `pss-${label}-pg`,
  run: `pss-${label}-run`,
};

function docker(args, env = process.env) {
  const result = spawnSync("docker", args, { encoding: "utf8", env });
  if (result.status !== 0) throw new Error(`docker ${args.slice(0, 3).join(" ")} … exited ${result.status}: ${result.stderr.trim()}`);
  return result.stdout.trim();
}
const has = (kind, name) => spawnSync("docker", [kind, "inspect", name], { stdio: "ignore" }).status === 0;
const running = (name) =>
  spawnSync("docker", ["inspect", "-f", "{{.State.Running}}", name], { encoding: "utf8" }).stdout.trim() === "true";

function password() {
  const file = join(out, "pg-password");
  if (!existsSync(file)) writeFileSync(file, `${randomBytes(24).toString("hex")}\n`, { mode: 0o600 });
  return readFileSync(file, "utf8").trim();
}

function cursorOf(secretEnv) {
  const sql = "SELECT coalesce(max(height), -1) FROM core_block_commit.blocks";
  const result = spawnSync("docker", ["exec", "-e", "PGPASSWORD", names.database, "psql", "-U", "postgres", "-d", DATABASE,
    "-tAc", sql], { encoding: "utf8", env: secretEnv });
  return result.status === 0 ? BigInt(result.stdout.trim() || "-1") : -1n;
}

function configText({ moduleSpec, moduleConfig, moduleStart }) {
  const node = process.env.PSS_NODE_WS ?? fail("PSS_NODE_WS is required (the node's WebSocket URL)");
  const core = {
    network: "preprod",
    node,
    database: { kind: "postgres", host: names.database, port: 5432, user: "postgres", name: DATABASE, ssl: "disable" },
    listen: { admin: `0.0.0.0:${ADMIN_PORT}`, api: `0.0.0.0:${API_PORT}` },
    sweep: "on",
  };
  const lines = [
    "// Written by examples/private-shielded-sync/run/sync.mjs. The password is PGPASSWORD in the run's environment.",
    `import { ${[...CORE_MODULES, "coreEntry", "defineConfig"].join(", ")} } from "umbradb";`,
  ];
  let moduleEntry = "";
  if (moduleSpec !== undefined) {
    const [file, exportName] = moduleSpec.split("#");
    lines.push(`import { ${exportName} } from ${JSON.stringify(resolve(file))};`, "", `export const modules = [${exportName}];`);
    moduleEntry = `    ${exportName}.entry({ start: ${moduleStart}, config: ${moduleConfig} }),`;
  }
  lines.push(
    "",
    "export default defineConfig({",
    "  entries: [",
    `    coreEntry({ start: 0, config: ${JSON.stringify(core)} }),`,
    ...CORE_MODULES.map((name) => `    ${name}.entry({ start: 0, config: {} }),`),
    ...(moduleEntry === "" ? [] : [moduleEntry]),
    "  ],",
    "});",
    "",
  );
  return lines.join("\n");
}

/** Writes `<out>/umbradb.config.ts` and the `umbradb` link to the build; returns the file. */
function writeConfig(build, moduleStart) {
  const moduleSpec = values.module;
  const moduleConfig =
    moduleSpec === undefined || values["module-config"] === undefined ? "{}" : readFileSync(resolve(values["module-config"]), "utf8").trim();
  const link = join(out, "node_modules", "umbradb");
  if (!existsSync(link)) {
    mkdirSync(join(out, "node_modules"), { recursive: true });
    symlinkSync(build, link, "dir");
  }
  const configFile = join(out, "umbradb.config.ts");
  writeFileSync(configFile, configText({ moduleSpec, moduleConfig, moduleStart }));
  return configFile;
}

async function config() {
  const build = resolve(values.build ?? fail("--build is required (a built UmbraDB checkout)"));
  mkdirSync(out, { recursive: true });
  process.stdout.write(`${writeConfig(build, values["module-start"] ?? "0")}\n`);
}

async function up() {
  const build = resolve(values.build ?? fail("--build is required (a built UmbraDB checkout)"));
  if (!existsSync(join(build, "dist", "cli", "main.js"))) fail(`no ${build}/dist/cli/main.js: npm ci && npm run build there`);
  if (has("container", names.run)) fail(`${names.run} exists: run down first`);
  mkdirSync(out, { recursive: true });
  const pw = password();
  const secretEnv = { ...process.env, POSTGRES_PASSWORD: pw, PGPASSWORD: pw };
  if (!has("network", names.network)) docker(["network", "create", names.network]);
  if (!has("volume", names.volume)) docker(["volume", "create", names.volume]);
  if (!has("container", names.database)) {
    docker(["run", "-d", "--name", names.database, "--network", names.network, "-v", `${names.volume}:/var/lib/postgresql`,
      "-e", "POSTGRES_PASSWORD", "-e", `POSTGRES_DB=${DATABASE}`, "-p", "127.0.0.1::5432", "--shm-size", "1g",
      POSTGRES_IMAGE, "-c", "max_connections=200", "-c", "shared_buffers=2GB"], secretEnv);
  } else if (!running(names.database)) {
    docker(["start", names.database]);
  }
  for (let waited = 0; ; waited += 1000) {
    const ready = spawnSync("docker", ["exec", names.database, "pg_isready", "-h", "127.0.0.1", "-U", "postgres", "-d", DATABASE]);
    if (ready.status === 0) break;
    if (waited > 120_000) throw new Error("the database did not become ready in 120 s");
    await sleep(1000);
  }
  const moduleSpec = values.module;
  const moduleStart = moduleSpec === undefined ? "0" : (values["module-start"] ?? String(cursorOf(secretEnv) + 1n));
  const configFile = writeConfig(build, moduleStart);
  const apiPort = values["api-port"] ?? "";
  const adminPort = values["admin-port"] ?? "";
  docker(["run", "-d", "--name", names.run, "--init", "--network", names.network, "--stop-timeout", String(STOP_TIMEOUT_S),
    "-v", `${build}:${build}:ro`, "-v", `${out}:${out}`, "-w", out, "-e", "PGPASSWORD",
    "-p", `127.0.0.1:${adminPort}:${ADMIN_PORT}`, "-p", `127.0.0.1:${apiPort}:${API_PORT}`,
    NODE_IMAGE, "node", join(build, "dist", "cli", "main.js"), "run", "--config", configFile], secretEnv);
  const port = (p) => docker(["port", names.run, `${p}/tcp`]).split("\n")[0];
  const info = { label, out, build, admin: port(ADMIN_PORT), api: port(API_PORT), database: docker(["port", names.database, "5432/tcp"]).split("\n")[0], moduleStart: moduleSpec === undefined ? null : moduleStart, startedAt: new Date().toISOString() };
  appendFileSync(join(out, "runs.jsonl"), `${JSON.stringify(info)}\n`);
  process.stdout.write(`${JSON.stringify(info)}\n`);
}

async function down() {
  if (!has("container", names.run)) return;
  docker(["stop", "-t", String(STOP_TIMEOUT_S), names.run]);
  docker(["rm", names.run]);
}

async function record() {
  const admin = docker(["port", names.run, `${ADMIN_PORT}/tcp`]).split("\n")[0];
  const log = createWriteStream(join(out, "run.log"), { flags: "a" });
  const logs = spawn("docker", ["logs", "-f", "-t", "--since", new Date().toISOString(), names.run], { stdio: ["ignore", "pipe", "pipe"] });
  logs.stdout.pipe(log);
  logs.stderr.pipe(log);
  let last = "";
  for (;;) {
    try {
      const status = await (await fetch(`http://${admin}/status`)).json();
      const sample = { state: status.state, cursor: status.cursor, head: status.head, reason: status.reason ?? null };
      const key = JSON.stringify(sample);
      if (key !== last) {
        appendFileSync(join(out, "status.jsonl"), `${JSON.stringify({ at: Date.now(), ...sample })}\n`);
        last = key;
      }
    } catch {
      if (!running(names.run)) break;
    }
    await sleep(1000);
  }
  logs.kill();
}

async function destroy() {
  for (const [kind, name] of [["container", names.run], ["container", names.database], ["volume", names.volume], ["network", names.network]]) {
    if (!has(kind, name)) continue;
    if (kind === "container") docker(["rm", "-f", name]);
    else docker([kind, "rm", name]);
  }
}

await { up, config, down, record, destroy }[command]();
