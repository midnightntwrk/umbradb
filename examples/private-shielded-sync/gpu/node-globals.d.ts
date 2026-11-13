// Node's global `Buffer` for `deno check`: `pir/matrix.ts` uses it without an import (Node's `tsc` sees it through
// `@types/node`). Deno provides the global at run time (`"unstable": ["node-globals"]` in `deno.json`).
import type { Buffer as NodeBuffer } from "node:buffer";

declare global {
  var Buffer: typeof NodeBuffer;
  type Buffer = NodeBuffer;
}

export {};
