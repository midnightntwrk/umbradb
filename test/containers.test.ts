import { execFileSync } from "node:child_process";
import { randomUUID } from "node:crypto";
import { readFileSync } from "node:fs";
import { extname, join } from "node:path";
import { createInterface } from "node:readline";
import { setTimeout as sleep } from "node:timers/promises";
import { fileURLToPath } from "node:url";
import { PostgreSqlContainer, type StartedPostgreSqlContainer } from "@testcontainers/postgresql";
import type { GenericContainer } from "testcontainers";
import { describe, expect, it } from "vitest";
import { guardContainers, spawnChild } from "./child-processes.js";
import { LABEL_ATTEMPT, LABEL_PID, LABEL_REPOSITORY, START_ATTEMPTS, startContainer, startContainers } from "./containers.js";
import { POSTGRES_IMAGE } from "./postgres-image.js";

/**
 * How every test starts a container (`containers.ts`; core-arch task 0.5, A153): a start that Testcontainers gave up on
 * after its fixed 10 s wait for the ports is tried again, its container removed; every container carries the labels
 * that tell whose it is; and every test that starts one starts it this way.
 */

const REPOSITORY = fileURLToPath(new URL("..", import.meta.url));
const PORTS_NOT_BOUND = "Timed out after 10000ms while waiting for container ports to be bound to the host";

/**
 * A container whose `start` fails as `failures` says, in order, and then resolves with a started container that counts
 * its stops.
 */
function scripted(failures: readonly string[]): {
  readonly container: GenericContainer;
  readonly starts: () => number;
  readonly stops: () => number;
} {
  let starts = 0;
  let stops = 0;
  const started = {
    async stop() {
      stops++;
    },
  };
  const container = {
    withLabels() {
      return container;
    },
    async start() {
      const failure = failures[starts++];
      if (failure !== undefined) throw new Error(failure);
      return started;
    },
  };
  return { container: container as unknown as GenericContainer, starts: () => starts, stops: () => stops };
}

/** Docker's containers carrying `label` with `value`, running or not (full ids). */
function containersLabelled(label: string, value: string): string[] {
  const listed = execFileSync("docker", ["ps", "-a", "-q", "--no-trunc", "--filter", `label=${label}=${value}`], {
    encoding: "utf8",
  });
  return listed.split("\n").filter(Boolean);
}

describe("startContainer (A153)", () => {
  it("tries a start again after the ports wait gave up, up to START_ATTEMPTS starts in all", async () => {
    const twice = scripted([PORTS_NOT_BOUND, PORTS_NOT_BOUND]);
    expect(await startContainer(twice.container)).toHaveProperty("stop");
    expect(twice.starts()).toBe(3);
    const always = scripted(Array.from({ length: START_ATTEMPTS }, () => PORTS_NOT_BOUND));
    await expect(startContainer(always.container)).rejects.toThrow(PORTS_NOT_BOUND);
    expect(always.starts()).toBe(START_ATTEMPTS);
  });

  it("never tries again after any other error", async () => {
    const other = scripted(["Container exited with code 1", PORTS_NOT_BOUND]);
    await expect(startContainer(other.container)).rejects.toThrow("Container exited with code 1");
    expect(other.starts()).toBe(1);
  });

  it("starts several together; when one fails, stops the ones that started and rejects with the failure", async () => {
    const [one, two] = [scripted([]), scripted([])];
    const both = await startContainers([one.container, two.container]);
    expect(both).toHaveLength(2);
    expect([one.stops(), two.stops()]).toEqual([0, 0]);
    const [fine, failing, alsoFine] = [scripted([]), scripted(["Container exited with code 1"]), scripted([])];
    await expect(startContainers([fine.container, failing.container, alsoFine.container])).rejects.toThrow(
      "Container exited with code 1",
    );
    expect([fine.stops(), failing.stops(), alsoFine.stops()]).toEqual([1, 0, 1]);
  });

  it("removes the container of an attempt that failed for another reason before it rejects", async () => {
    let attempt: string | undefined;
    class FailsOnceStarted extends PostgreSqlContainer {
      override async start(): Promise<StartedPostgreSqlContainer> {
        const started = await super.start();
        attempt = started.getLabels()[LABEL_ATTEMPT];
        throw new Error("the test's own setup failed after the start");
      }
    }
    await expect(startContainer(new FailsOnceStarted(POSTGRES_IMAGE))).rejects.toThrow("the test's own setup failed");
    expect(attempt).toBeDefined();
    expect(containersLabelled(LABEL_ATTEMPT, attempt!)).toEqual([]);
  }, 240_000);

  it("removes the container a failed attempt left running, then starts another, with the labels", async () => {
    // The first attempt starts a real container and then fails as Testcontainers does when Docker is slow to report
    // the ports: the container is running, and nobody holds it.
    let first: StartedPostgreSqlContainer | undefined;
    class SlowToReportPorts extends PostgreSqlContainer {
      override async start(): Promise<StartedPostgreSqlContainer> {
        const started = await super.start();
        if (first !== undefined) return started;
        first = started;
        throw new Error(PORTS_NOT_BOUND);
      }
    }
    const second = await startContainer(new SlowToReportPorts(POSTGRES_IMAGE));
    try {
      const firstLabels = first!.getLabels();
      expect(containersLabelled(LABEL_ATTEMPT, firstLabels[LABEL_ATTEMPT]!)).toEqual([]);
      const labels = second.getLabels();
      expect(labels[LABEL_REPOSITORY]).toBe(REPOSITORY);
      expect(labels[LABEL_PID]).toBe(String(process.pid));
      expect(labels[LABEL_ATTEMPT]).not.toBe(firstLabels[LABEL_ATTEMPT]);
      expect(containersLabelled(LABEL_ATTEMPT, labels[LABEL_ATTEMPT]!)).toEqual([second.getId()]);
    } finally {
      await second.stop();
    }
  }, 240_000);
});

// ── a container outlives no test process ─────────────────────────────────────────────────────────────────────────

const PARENT = fileURLToPath(new URL("./containers.parent.ts", import.meta.url));
/** How long the watcher may take to remove a dead process's container: Docker's two commands, on a loaded machine. */
const CONTAINER_GONE_MS = 60_000;

/** Starts `containers.parent.ts` and resolves with it and the id of the container it started. */
async function parentWithContainer(guarded: boolean, fixture: string) {
  const parent = spawnChild(process.execPath, ["--import", "tsx", PARENT, JSON.stringify({ guarded, fixture })], {
    cwd: REPOSITORY,
    env: { ...process.env, TESTCONTAINERS_RYUK_DISABLED: "true" },
    stdio: ["ignore", "pipe", "ignore"],
  });
  const exited = new Promise<void>((resolve) => parent.once("exit", () => resolve()));
  const lines = createInterface({ input: parent.stdout! });
  const line = await new Promise<string>((resolve, reject) => {
    lines.once("line", resolve);
    lines.once("close", () => reject(new Error("the parent ended before it reported its container")));
  });
  return { parent, exited, id: (JSON.parse(line) as { id: string }).id };
}

describe("a container outlives no test process (A153)", () => {
  it("is given only the labels' filters: guardContainers refuses anything else", () => {
    for (const filter of ["label=other=1", "org.umbradb.test.pid=1", "label=org.umbradb.test.pid=", "id=abc"]) {
      expect(() => guardContainers([filter]), filter).toThrow(/not a label filter/);
    }
  });

  it("is removed when the process that started it is killed; one started without the guard stays (negative control)", async () => {
    const fixture = randomUUID();
    // This process's own watcher removes both fixture containers if this test dies before its cleanup.
    guardContainers([`label=org.umbradb.test.fixture=${fixture}`]);
    // A container of a process that is still alive, labelled with this repository like the guarded one: it must stay.
    const [guarded, plain, bystander] = await Promise.all([
      parentWithContainer(true, fixture),
      parentWithContainer(false, fixture),
      startContainer(new PostgreSqlContainer(POSTGRES_IMAGE)),
    ]);
    try {
      expect(containersLabelled("org.umbradb.test.fixture", fixture).sort()).toEqual([guarded.id, plain.id].sort());
      guarded.parent.kill("SIGKILL");
      plain.parent.kill("SIGKILL");
      await Promise.all([guarded.exited, plain.exited]);
      const killed = Date.now();
      while (containersLabelled("org.umbradb.test.fixture", fixture).includes(guarded.id)) {
        if (Date.now() - killed > CONTAINER_GONE_MS) break;
        await sleep(250);
      }
      expect(containersLabelled("org.umbradb.test.fixture", fixture), "after the guarded parent died").not.toContain(
        guarded.id,
      );
      await sleep(Math.max(0, killed + CONTAINER_GONE_MS - Date.now()));
      expect(containersLabelled("org.umbradb.test.fixture", fixture), "the same time after").toEqual([plain.id]);
      expect(containersLabelled(LABEL_ATTEMPT, bystander.getLabels()[LABEL_ATTEMPT]!)).toEqual([bystander.getId()]);
    } finally {
      // Docker's forced removal, each container on its own, so that one that fails keeps none of the others: the
      // bystander's Testcontainers `stop` once failed here on a loaded machine ("container is running", HTTP 409).
      for (const id of [guarded.id, plain.id, bystander.getId()]) {
        try {
          execFileSync("docker", ["rm", "-f", "-v", id], { stdio: "ignore" });
        } catch {
          // Already removed.
        }
      }
    }
  }, CONTAINER_GONE_MS + 240_000);
});

// ── every test starts its containers with startContainer ─────────────────────────────────────────────────────────

interface SourceFile {
  readonly path: string;
  readonly text: string;
}

/** A Testcontainers container constructed. */
const CONSTRUCTED = /new\s+(?:PostgreSqlContainer|GenericContainer)\s*\(/g;
/** One started directly: a construction whose chain ends in `.start()`. */
const STARTED_DIRECTLY = /new\s+(?:PostgreSqlContainer|GenericContainer)\s*\([^)]*\)(?:\s*\.with\w+\((?:[^()]|\([^()]*\))*\))*\s*\.start\(\)/g;
/** This file and the A148 test plant constructions in their negative controls. */
const PLANTERS = new Set(["test/containers.test.ts", "test/dependencies/postgres-image.test.ts"]);

/** Every way the files start a container other than with `startContainer`. */
function directStarts(files: readonly SourceFile[]): string[] {
  const found: string[] = [];
  for (const file of files) {
    if (PLANTERS.has(file.path)) continue;
    const text = file.text
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line))
      .join("\n");
    const constructed = [...text.matchAll(CONSTRUCTED)].length;
    if (constructed === 0) continue;
    for (const _ of text.matchAll(STARTED_DIRECTLY)) found.push(`${file.path}: starts a container without startContainer`);
    const started = [...text.matchAll(/\bstartContainers?\(/g)].length;
    if (started === 0) found.push(`${file.path}: constructs ${constructed} container(s), never given to startContainer`);
  }
  return found;
}

const SOURCE = new Set([".ts", ".mts", ".cts", ".js", ".mjs", ".cjs"]);

function testFiles(): SourceFile[] {
  const listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z", "--", "test"], {
    cwd: REPOSITORY,
    encoding: "utf8",
  });
  return listed
    .split("\0")
    .filter((path) => path !== "" && SOURCE.has(extname(path)) && path !== "test/smoke/pack-install.mjs")
    .flatMap((path) => {
      try {
        return [{ path, text: readFileSync(join(REPOSITORY, path), "utf8") }];
      } catch {
        return [];
      }
    });
}

describe("every test container is started with startContainer", () => {
  const files = testFiles();

  it("finds no other start under test/ (the pack smoke test starts its container with Docker's own command)", () => {
    expect(files.length).toBeGreaterThan(200);
    expect(directStarts(files)).toEqual([]);
  });

  it("reads the files that start containers", () => {
    const starters = files.filter((file) => /\bstartContainers?\(/.test(file.text)).map((file) => file.path);
    expect(starters).toEqual(expect.arrayContaining(["test/db/postgres-server.ts", "test/postgres/setup.ts"]));
  });

  it("negative controls: a container started directly, or constructed and never given to startContainer", () => {
    const planted = [
      "const c = await new PostgreSqlContainer(POSTGRES_IMAGE).start();",
      'const c = await new PostgreSqlContainer(POSTGRES_IMAGE)\n  .withCommand(["postgres", "-c", "fsync=off"])\n  .start();',
      'const c = await new GenericContainer("redis").withExposedPorts(6379).start();',
      "const base = new PostgreSqlContainer(POSTGRES_IMAGE);\nawait base.start();",
    ];
    for (const text of planted) expect(directStarts([{ path: "test/planted.ts", text }]), text).not.toEqual([]);
    const harmless = [
      "const c = await startContainer(new PostgreSqlContainer(POSTGRES_IMAGE));",
      'const c = await startContainer(new PostgreSqlContainer(POSTGRES_IMAGE).withCommand(["postgres"]));',
      "await backend.start();",
    ];
    for (const text of harmless) expect(directStarts([{ path: "test/planted.ts", text }]), text).toEqual([]);
  });
});
