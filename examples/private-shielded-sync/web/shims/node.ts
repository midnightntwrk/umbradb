/**
 * Stand-ins for the Node.js modules the client's files import but the page never calls (`../build.ts` aliases
 * `node:fs`, `node:url`, `node:path`, `node:events`, `node:os` and `node:worker_threads` here). A call that reaches one
 * of the file functions throws, so a missed path shows up as an error instead of a silent no-op.
 */

const unavailable = (name: string) => (): never => {
  throw new Error(`${name} is not available in the page`);
};

// node:fs
export const readFileSync = unavailable("fs.readFileSync");
export const writeFileSync = unavailable("fs.writeFileSync");
export const existsSync = (): boolean => false;
export const mkdirSync = unavailable("fs.mkdirSync");
export const renameSync = unavailable("fs.renameSync");
export const rmSync = unavailable("fs.rmSync");
export const chmodSync = unavailable("fs.chmodSync");
export const createWriteStream = unavailable("fs.createWriteStream");
export const statSync = unavailable("fs.statSync");
export const openSync = unavailable("fs.openSync");
export const readSync = unavailable("fs.readSync");
export const closeSync = unavailable("fs.closeSync");

// node:url — the kernel computes its file's path at import; the page never reads it.
export const fileURLToPath = (url: string | URL): string => String(url);

// node:path
export const join = (...parts: string[]): string => parts.join("/");
export const dirname = (p: string): string => p.replace(/\/[^/]*$/, "");
export const resolve = (...parts: string[]): string => parts.join("/");

// node:events
export const once = unavailable("events.once");

// node:os
export const availableParallelism = (): number => 1;
export const cpus = (): unknown[] => [{}];
export const tmpdir = (): string => "/tmp";

// node:worker_threads
export class Worker {
  constructor() {
    throw new Error("worker_threads is not available in the page");
  }
}
export const parentPort = null;
export const isMainThread = true;

export default {};
