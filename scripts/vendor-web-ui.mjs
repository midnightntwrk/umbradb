#!/usr/bin/env node
// Vendors the API docs' browser UIs (Swagger UI, AsyncAPI's renderer) into vendor/<dir>. Each package is pinned by
// version and sha512 below; only its own tarball is fetched (`npm pack`, no dependencies, no scripts) and checked
// against the pin before any file is taken from it. Writes SHA256SUMS and upstream.json beside the files.
// `--check` vendors into a temporary directory and fails if the result differs from what is committed.

import { execFileSync } from "node:child_process";
import { createHash } from "node:crypto";
import { mkdirSync, mkdtempSync, readdirSync, readFileSync, rmSync, writeFileSync } from "node:fs";
import { tmpdir } from "node:os";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const PACKAGES = [
  {
    dir: "swagger-ui",
    name: "swagger-ui-dist",
    version: "5.35.0",
    integrity: "sha512-U06rpMtW9V3XPGOBeamTUSr0Z09jMX4IJuANpE/EZbAhw0G8CgwrzU4YmXkn/h0wCDNsXdGarTNNHC3sU8yVUQ==",
    // vendored name: path in the package. Not "LICENSE": CODEOWNERS gives that name, at any depth, to the root license's owners.
    files: {
      "swagger-ui-bundle.js": "swagger-ui-bundle.js",
      "swagger-ui-bundle.js.LICENSE.txt": "swagger-ui-bundle.js.LICENSE.txt",
      "swagger-ui.css": "swagger-ui.css",
      "LICENSE.upstream": "LICENSE",
      NOTICE: "NOTICE",
    },
  },
  {
    dir: "asyncapi-react",
    name: "@asyncapi/react-component",
    version: "3.2.3",
    integrity: "sha512-/hnh4xIKo78/uuklIVu55sbDIw4aLOyJeSaoy//FnMtEZzEGAbl29fq46yyXqP/MpFnj+Tq8rDk3P1oT/QUKGw==",
    files: {
      "asyncapi-standalone.js": "browser/standalone/index.js",
      "asyncapi-standalone.js.LICENSE.txt": "browser/standalone/index.js.LICENSE.txt",
      "asyncapi.css": "styles/default.min.css",
      "LICENSE.upstream": "LICENSE",
    },
  },
];

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");

/** Fetches `pkg`'s tarball into `work`, checks it against the pin and writes its files, sums and upstream to `target`. */
function vendor(pkg, work, target) {
  const spec = `${pkg.name}@${pkg.version}`;
  execFileSync("npm", ["pack", spec, "--silent", "--ignore-scripts", "--pack-destination", work], { cwd: work, stdio: ["ignore", "ignore", "inherit"] });
  const [tarball] = readdirSync(work).filter((name) => name.endsWith(".tgz"));
  if (tarball === undefined) throw new Error(`npm pack ${spec} gave no tarball`);
  const bytes = readFileSync(join(work, tarball));
  const integrity = `sha512-${createHash("sha512").update(bytes).digest("base64")}`;
  if (integrity !== pkg.integrity) throw new Error(`${spec}: the tarball's integrity is ${integrity}, not the pinned ${pkg.integrity}`);
  // Only the listed files come out of the archive.
  const inside = Object.values(pkg.files).map((path) => `package/${path}`);
  execFileSync("tar", ["-xzf", join(work, tarball), "-C", work, "--", ...inside]);
  mkdirSync(target, { recursive: true });
  const sums = [];
  for (const [name, path] of Object.entries(pkg.files)) {
    const file = readFileSync(join(work, "package", path));
    writeFileSync(join(target, name), file);
    sums.push(`${sha256(file)}  ${name}`);
  }
  writeFileSync(join(target, "SHA256SUMS"), `${sums.join("\n")}\n`);
  const upstream = { package: pkg.name, version: pkg.version, integrity: pkg.integrity, files: pkg.files };
  writeFileSync(join(target, "upstream.json"), `${JSON.stringify(upstream, null, 2)}\n`);
}

const check = process.argv.includes("--check");
const scratch = mkdtempSync(join(tmpdir(), "vendor-web-ui-"));
const problems = [];
try {
  for (const pkg of PACKAGES) {
    const work = join(scratch, "work", pkg.dir);
    mkdirSync(work, { recursive: true });
    const committed = join(ROOT, "vendor", pkg.dir);
    const target = check ? join(scratch, "out", pkg.dir) : committed;
    vendor(pkg, work, target);
    if (!check) {
      console.log(`vendored ${pkg.name}@${pkg.version} into vendor/${pkg.dir}`);
      continue;
    }
    for (const name of [...Object.keys(pkg.files), "SHA256SUMS", "upstream.json"]) {
      let ours;
      try {
        ours = readFileSync(join(committed, name));
      } catch {
        problems.push(`vendor/${pkg.dir}/${name} is missing`);
        continue;
      }
      if (!ours.equals(readFileSync(join(target, name)))) problems.push(`vendor/${pkg.dir}/${name} differs from ${pkg.name}@${pkg.version}`);
    }
    const extra = readdirSync(committed).filter((name) => !(name in pkg.files) && name !== "SHA256SUMS" && name !== "upstream.json");
    for (const name of extra) problems.push(`vendor/${pkg.dir}/${name} is not a file of ${pkg.name}`);
  }
} finally {
  rmSync(scratch, { recursive: true, force: true });
}
if (problems.length > 0) {
  console.error(`${problems.join("\n")}\nRun npm run vendor:web-ui.`);
  process.exit(1);
}
if (check) console.log("vendor/ matches the pinned UI packages");
