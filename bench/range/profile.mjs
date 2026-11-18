// Summarizes the .cpuprofile files a bench run wrote with NODE_FLAGS="--cpu-prof --cpu-prof-dir=<run folder>":
// self time by function and by file, for each thread.
//   node profile.mjs <run folder> [top]
import { readdirSync, readFileSync } from "node:fs";
const [dir, topArg] = process.argv.slice(2);
const top = Number(topArg ?? 25);
for (const name of readdirSync(dir).filter((f) => f.endsWith(".cpuprofile")).sort()) {
  const p = JSON.parse(readFileSync(`${dir}/${name}`, "utf8"));
  const dt = new Map();
  for (let i = 0; i < p.samples.length; i++) dt.set(p.samples[i], (dt.get(p.samples[i]) ?? 0) + (p.timeDeltas[i] ?? 0));
  const byId = new Map(p.nodes.map((n) => [n.id, n]));
  const self = new Map(), files = new Map();
  let total = 0;
  for (const [id, us] of dt) {
    const f = byId.get(id).callFrame;
    const file = f.url ? f.url.split("/").slice(-3).join("/") : f.functionName;
    const key = `${f.functionName || "(anon)"} ${file}:${f.lineNumber + 1}`;
    self.set(key, (self.get(key) ?? 0) + us);
    files.set(file, (files.get(file) ?? 0) + us);
    total += us;
  }
  const list = (m) => [...m].sort((a, b) => b[1] - a[1]).slice(0, top).map(([k, us]) => `${(us / 1000).toFixed(0).padStart(8)} ms ${((100 * us) / total).toFixed(1).padStart(5)}%  ${k.slice(0, 130)}`).join("\n");
  console.log(`\n== ${name}: ${(total / 1000).toFixed(0)} ms sampled\n-- by function (self)\n${list(self)}\n-- by file (self)\n${list(files)}`);
}
