#!/usr/bin/env node
// Copies Swagger UI's browser bundle from the pinned `swagger-ui-dist` devDependency into vendor/swagger-ui, with
// SHA256SUMS and upstream.json. The package itself stays a devDependency: it pulls in an install-time telemetry script.
// `--check` changes nothing and fails if the vendored files differ from the installed package or from SHA256SUMS.

import { createHash } from "node:crypto";
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const ROOT = join(dirname(fileURLToPath(import.meta.url)), "..");
const SOURCE = join(ROOT, "node_modules", "swagger-ui-dist");
const TARGET = join(ROOT, "vendor", "swagger-ui");
const FILES = ["swagger-ui-bundle.js", "swagger-ui-bundle.js.LICENSE.txt", "swagger-ui.css", "LICENSE", "NOTICE"];

const sha256 = (bytes) => createHash("sha256").update(bytes).digest("hex");
const json = (path) => JSON.parse(readFileSync(path, "utf8"));

const pinned = json(join(ROOT, "package.json")).devDependencies["swagger-ui-dist"];
const locked = json(join(ROOT, "package-lock.json")).packages["node_modules/swagger-ui-dist"];
const installed = json(join(SOURCE, "package.json")).version;
if (pinned !== installed || locked.version !== installed) {
  console.error(`swagger-ui-dist: package.json pins ${pinned}, the lockfile ${locked.version}, node_modules has ${installed}`);
  process.exit(1);
}

const sums = FILES.map((name) => `${sha256(readFileSync(join(SOURCE, name)))}  ${name}`).join("\n") + "\n";
const upstream = `${JSON.stringify({ package: "swagger-ui-dist", version: installed, resolved: locked.resolved, integrity: locked.integrity }, null, 2)}\n`;

if (process.argv.includes("--check")) {
  const problems = [];
  const read = (name) => {
    try {
      return readFileSync(join(TARGET, name));
    } catch {
      problems.push(`${name} is missing`);
      return undefined;
    }
  };
  for (const name of FILES) {
    const vendored = read(name);
    if (vendored !== undefined && !vendored.equals(readFileSync(join(SOURCE, name)))) problems.push(`${name} differs from swagger-ui-dist ${installed}`);
  }
  if (read("SHA256SUMS")?.toString() !== sums) problems.push("SHA256SUMS does not match the files");
  if (read("upstream.json")?.toString() !== upstream) problems.push("upstream.json does not match the pinned package");
  if (problems.length > 0) {
    console.error(`vendor/swagger-ui: ${problems.join("; ")}. Run npm run vendor:swagger-ui.`);
    process.exit(1);
  }
  console.log(`vendor/swagger-ui matches swagger-ui-dist ${installed}`);
} else {
  mkdirSync(TARGET, { recursive: true });
  for (const name of FILES) writeFileSync(join(TARGET, name), readFileSync(join(SOURCE, name)));
  writeFileSync(join(TARGET, "SHA256SUMS"), sums);
  writeFileSync(join(TARGET, "upstream.json"), upstream);
  console.log(`vendored swagger-ui-dist ${installed} into vendor/swagger-ui`);
}
