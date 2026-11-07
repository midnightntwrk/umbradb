import { join } from "node:path";
import { REPOSITORY } from "../config/config-fixtures.js";
import { spawnChild } from "../child-processes.js";

/**
 * The checks of `npm run web`'s server: the headers a cross-origin isolated page needs, and `node browser/serve.ts` run
 * in a child process.
 */

export { REPOSITORY };

/** What a page needs from its server to be cross-origin isolated, by header (lowercase) and value. */
export const ISOLATION: Readonly<Record<string, string>> = Object.freeze({
  "cross-origin-opener-policy": "same-origin",
  "cross-origin-embedder-policy": "require-corp",
});

/** Each isolation header an answer lacks or gives another value. */
export function isolationProblems(headers: Headers): string[] {
  return Object.entries(ISOLATION)
    .filter(([name, value]) => headers.get(name) !== value)
    .map(([name, value]) => `${name}: ${headers.get(name) ?? "(none)"}, not ${value}`);
}

/** A running `node browser/serve.ts`: its origin, what it printed, and its stop (SIGTERM; resolves its exit status). */
export interface Served {
  readonly origin: string;
  readonly output: string;
  stop(): Promise<number | null>;
}

/** Starts `node browser/serve.ts …args` and resolves once it printed its address. */
export function serveCommand(args: readonly string[]): Promise<Served> {
  const child = spawnChild(process.execPath, [join(REPOSITORY, "browser", "serve.ts"), ...args], {
    cwd: REPOSITORY,
    stdio: ["ignore", "pipe", "pipe"],
  });
  let output = "";
  const exited = new Promise<number | null>((resolve) => child.on("close", (code) => resolve(code)));
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => {
      child.kill("SIGKILL");
      reject(new Error(`browser/serve.ts printed no address within 30 s:\n${output}`));
    }, 30_000);
    const take = (chunk: string): void => {
      output += chunk;
      const origin = /serving .* on (http:\/\/127\.0\.0\.1:\d+)/.exec(output)?.[1];
      if (origin === undefined) return;
      clearTimeout(timer);
      resolve({
        origin,
        get output() {
          return output;
        },
        stop: async () => {
          if (child.exitCode === null && child.signalCode === null) child.kill("SIGTERM");
          return exited;
        },
      });
    };
    child.stdout.setEncoding("utf8").on("data", take);
    child.stderr.setEncoding("utf8").on("data", take);
    void exited.then((code) => {
      clearTimeout(timer);
      reject(new Error(`browser/serve.ts exited ${code}:\n${output}`));
    });
  });
}
