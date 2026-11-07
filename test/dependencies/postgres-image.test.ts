import { execFileSync } from "node:child_process";
import { readFileSync } from "node:fs";
import { basename, extname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { describe, expect, it } from "vitest";
import { POSTGRES_IMAGE } from "../postgres-image.js";

// Every PostgreSQL image the repository pins is one `postgres:18-alpine` pin — the tests, the Testcontainers helpers,
// the benchmarks, the pack smoke test and the supply-chain gate's image-pin agreement check. The pin lives in
// `test/postgres-image.ts`; this file holds the same value, so moving it is a reviewed change of three files.
// [Q82, A148 STATIC]

/** The pin: PostgreSQL 18.6 on Alpine 3.24.2, the `18-alpine` index of 2026-09-21 (see `test/postgres-image.ts`). */
const PINNED = "postgres:18-alpine@sha256:77f585114c32fbca283dc835b0596f4e52b51b4c6662d7810b2f4084f60a1873";

const ROOT = fileURLToPath(new URL("../..", import.meta.url));

/**
 * A reference to the official `postgres` image: `postgres:<tag>`, `postgres@sha256:<digest>` or both, optionally after
 * a registry path (`docker.io/library/postgres:18`). A tag starts with a digit or is `latest`, `alpine…` or a Debian
 * release name, so `postgres:postgres` (a user in `chown` or in a URL) and `postgres:5432/db` (a host and port) are
 * not references; a bare `postgres` (the server command, a database name) is dropped below.
 */
const IMAGE_REFERENCE =
  /(?<![\w.@-])postgres(?::(?:\d[\w.-]*|latest|alpine[\w.-]*|bookworm|bullseye|trixie)(?![\w./-]))?(?:@sha256:[0-9a-f]{64})?/g;

/** Every Testcontainers PostgreSQL container and the expression it is started from. */
const CONTAINER_START = /new\s+PostgreSqlContainer\s*\(\s*([^),]*?)\s*[,)]/g;

const SCRIPT = new Set([".ts", ".mts", ".cts", ".js", ".mjs", ".cjs"]);
const HASH_COMMENTED = new Set([".yml", ".yaml", ".sh", ".nix", ".toml"]);

/**
 * Files that may name a PostgreSQL image without pinning one, as a record of a run. None since the 0.9.5 benchmark
 * baseline (measured on PostgreSQL 17.10, before the PostgreSQL 18 pin) was retired with its workloads.
 * [Q82; design §13]
 */
const RECORDS = new Set<string>();

interface RepositoryFile {
  readonly path: string;
  readonly text: string;
}

/** The lines of a file that can pin an image: comments dropped, as the supply-chain gate's agreement check does. */
function code(file: RepositoryFile): string {
  const extension = extname(file.path);
  if (SCRIPT.has(extension)) {
    return file.text
      .split("\n")
      .filter((line) => !/^\s*(\/\/|\/\*|\*)/.test(line))
      .join("\n");
  }
  if (HASH_COMMENTED.has(extension) || basename(file.path) === "Dockerfile") {
    return file.text
      .split("\n")
      .filter((line) => !/^\s*#/.test(line))
      .map((line) => line.replace(/\s#.*$/, ""))
      .join("\n");
  }
  return file.text;
}

/** Whether a file can hold an image pin (code and configuration; prose such as Markdown cannot). */
function canPin(path: string): boolean {
  const extension = extname(path);
  return SCRIPT.has(extension) || HASH_COMMENTED.has(extension) || extension === ".json" || basename(path) === "Dockerfile";
}

/**
 * Every way the files fail the image pin: an image other than the pin, or a container started from anything but the
 * constant. [A148 STATIC]
 */
function pinViolations(files: readonly RepositoryFile[], pin: string): string[] {
  const violations: string[] = [];
  for (const file of files) {
    if (!canPin(file.path) || RECORDS.has(file.path)) continue;
    const lines = code(file);
    for (const match of lines.matchAll(IMAGE_REFERENCE)) {
      const reference = match[0].replace(/^.*\//, "");
      if (reference === "postgres") continue;
      if (reference !== pin) violations.push(`${file.path}: names ${reference}`);
    }
    for (const match of lines.matchAll(CONTAINER_START)) {
      if (match[1] !== "POSTGRES_IMAGE") violations.push(`${file.path}: starts a container from ${match[1]}`);
    }
  }
  return violations;
}

/** This file: it holds the check's expected value and plants other pins in its negative controls. */
const SELF = "test/dependencies/postgres-image.test.ts";

/**
 * Every file in the working tree that git tracks or would track (untracked files included, ignored ones not) and that
 * can pin an image, but this one and the knowledge graph's generated output.
 */
function repositoryFiles(): RepositoryFile[] {
  const listed = execFileSync("git", ["ls-files", "--cached", "--others", "--exclude-standard", "-z"], {
    cwd: ROOT,
    encoding: "utf8",
  });
  return listed
    .split("\0")
    .filter((path) => path !== "" && path !== SELF && !path.startsWith("graphify-out/") && canPin(path))
    .flatMap((path) => {
      try {
        return [{ path, text: readFileSync(join(ROOT, path), "utf8") }];
      } catch {
        return []; // listed by git but deleted in the working tree
      }
    });
}

const files = repositoryFiles();

describe("A148 — one PostgreSQL image, postgres:18-alpine pinned by digest (Q82)", () => {
  it("pins postgres:18-alpine by the digest of its index, in test/postgres-image.ts", () => {
    expect(POSTGRES_IMAGE).toBe(PINNED);
    expect(POSTGRES_IMAGE).toMatch(/^postgres:18-alpine@sha256:[0-9a-f]{64}$/);
  });

  it("names no other PostgreSQL image, and starts every Testcontainers PostgreSQL container from the pin", () => {
    expect(pinViolations(files, POSTGRES_IMAGE)).toEqual([]);
  });

  it("is enforced by the supply-chain gate's image-pin agreement check, with the same pin", () => {
    const workflow = readFileSync(join(ROOT, ".github/workflows/supply-chain.yml"), "utf8");
    expect(workflow).toContain(`EXP_POSTGRES="${POSTGRES_IMAGE}"`);
    expect(workflow).toContain("test/postgres-image.ts");
  });

  it("reads every place that starts PostgreSQL: the helpers, the benchmarks and the pack smoke test", () => {
    expect(files.length).toBeGreaterThan(300);
    const starters = files
      .filter((file) => [...code(file).matchAll(CONTAINER_START)].length > 0)
      .map((file) => file.path);
    expect(starters).toEqual(
      expect.arrayContaining([
        "bench/environment.ts",
        "test/db/postgres-server.ts",
        "test/postgres/setup.ts",
        "test/smoke/pack-install.mjs",
      ]),
    );
  });

  describe("negative controls: a planted second pin fails the check", () => {
    const otherDigest = POSTGRES_IMAGE.replace(/[0-9a-f]{64}$/, "0".repeat(64));
    const tagOnly = POSTGRES_IMAGE.slice(0, POSTGRES_IMAGE.indexOf("@"));
    const older = tagOnly.replace(":18-", ":17-");
    const plant = (path: string, text: string): RepositoryFile[] => [...files, { path, text }];

    it("a second digest, an older major version, a tag without a digest, a registry path, a digest without a tag", () => {
      const planted: [string, string][] = [
        ["test/planted-digest.ts", `export const IMAGE = "${otherDigest}";`],
        ["test/planted-older.mjs", `await new GenericContainer("${older}").start();`],
        ["scripts/planted-tag.sh", `docker run --rm ${tagOnly} postgres --version`],
        ["bench/planted-registry.ts", `const image = "docker.io/library/${older}";`],
        ["test/planted-bare.ts", `const image = "postgres@sha256:${"1".repeat(64)}";`],
      ];
      for (const [path, text] of planted) {
        expect(pinViolations(plant(path, text), POSTGRES_IMAGE), path).toEqual([
          expect.stringMatching(new RegExp(`^${path}: names postgres`)),
        ]);
      }
    });

    it("a Testcontainers container started from anything but the constant, even the pin's own text", () => {
      for (const argument of [`"${POSTGRES_IMAGE}"`, "image", `"${older}"`]) {
        const violations = pinViolations(
          plant("test/planted-start.ts", `const c = await new PostgreSqlContainer(${argument}).start();`),
          POSTGRES_IMAGE,
        );
        expect(violations, argument).toContain(`test/planted-start.ts: starts a container from ${argument}`);
      }
    });

    it("a different pin in the supply-chain workflow", () => {
      const workflow = files.find((file) => file.path === ".github/workflows/supply-chain.yml");
      expect(workflow).toBeDefined();
      const changed = workflow!.text.replace(`EXP_POSTGRES="${POSTGRES_IMAGE}"`, `EXP_POSTGRES="${otherDigest}"`);
      expect(changed).not.toBe(workflow!.text);
      const others = files.filter((file) => file !== workflow);
      expect(pinViolations([...others, { path: workflow!.path, text: changed }], POSTGRES_IMAGE)).toEqual([
        `.github/workflows/supply-chain.yml: names ${otherDigest}`,
      ]);
    });

    it("controls: comments, prose, the server command, a user name and a host:port are not pins", () => {
      const harmless: [string, string][] = [
        ["test/c.ts", `// checked on ${older}\n/* ${older} */\n * ${older}\nconst ok = 1;`],
        ["scripts/c.sh", `# ${older}\nchown postgres:postgres server.key # ${older}`],
        ["docs/c.md", `Run \`docker run ${older}\`.`],
        ["test/d.ts", `const args = ["postgres", "-c", "fsync=off"]; const url = "postgres://postgres:postgres@db:5432/x";`],
        ["test/e.ts", `const url = "postgresql://u:p@postgres:5432/postgres";`],
      ];
      for (const [path, text] of harmless) {
        expect(pinViolations([{ path, text }], POSTGRES_IMAGE), path).toEqual([]);
      }
      // No file is exempt as a record since the 0.9.5 benchmark baseline was retired: one naming an older image
      // is caught like any other configuration file.
      const baseline = "bench/baseline.1.0.0-perf-baseline.1.json";
      expect(pinViolations([{ path: baseline, text: `{"postgresImage": "${older}"}` }], POSTGRES_IMAGE)).toEqual([
        `${baseline}: names ${older}`,
      ]);
      // The same reference on a code line after those comments is caught.
      expect(pinViolations([{ path: "test/c.ts", text: `// ${older}\nconst image = "${older}";` }], POSTGRES_IMAGE)).toEqual([
        `test/c.ts: names ${older}`,
      ]);
    });
  });
});
