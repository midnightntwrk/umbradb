/**
 * Serves `ipir-browser-page.ts`, bundled by the repository's esbuild into one self-contained page, so that the IPIR+SP
 * GPU kernels can be timed in a browser's WebGPU:
 *
 *     node examples/private-shielded-sync/gpu/ipir-browser.ts [--port N] [--out FILE]
 *
 * Listens on 127.0.0.1 (port N, or a random one above 10,000) and prints the page's address; open
 * `http://127.0.0.1:<port>/?rows=4096&cols=12288&runs=9` in the browser. The page writes its result as JSON into the
 * element `#result` and posts it back; with `--out`, each result is appended to FILE as one line. Stop with Ctrl-C.
 */

import { appendFileSync } from "node:fs";
import { createServer } from "node:http";
import { fileURLToPath } from "node:url";
import { parseArgs } from "node:util";
import { build } from "esbuild";

const { values } = parseArgs({ options: { port: { type: "string" }, out: { type: "string" } } });
const bundle = await build({
  entryPoints: [fileURLToPath(new URL("./ipir-browser-page.ts", import.meta.url))],
  bundle: true,
  format: "esm",
  platform: "browser",
  target: "es2022",
  write: false,
});
const script = bundle.outputFiles[0]!.text.replaceAll("</script", "<\\/script");
const page = `<!doctype html>
<html lang="en">
<head><meta charset="utf-8"><title>IPIR+SP GPU kernels</title></head>
<body>
<h1>IPIR+SP GPU kernels</h1>
<pre id="status">starting</pre>
<pre id="result"></pre>
<script type="module">${script}</script>
</body>
</html>
`;
const server = createServer((request, response) => {
  if (request.method === "POST" && request.url === "/result") {
    const parts: Buffer[] = [];
    request.on("data", (part: Buffer) => parts.push(part));
    request.on("end", () => {
      const text = Buffer.concat(parts).toString("utf8");
      JSON.parse(text);
      if (values.out) appendFileSync(values.out, `${text}\n`);
      console.log(`result: ${text.length} bytes${values.out ? ` appended to ${values.out}` : ""}`);
      response.writeHead(204).end();
    });
    return;
  }
  if ((request.url ?? "/").startsWith("/favicon")) {
    response.writeHead(404).end();
    return;
  }
  response.writeHead(200, { "content-type": "text/html; charset=utf-8", "cache-control": "no-store" }).end(page);
});
const port = values.port ? Number(values.port) : 10_000 + 1 + Math.floor(Math.random() * 50_000);
server.listen(port, "127.0.0.1", () => console.log(`http://127.0.0.1:${port}/?rows=4096&cols=12288&runs=9`));
