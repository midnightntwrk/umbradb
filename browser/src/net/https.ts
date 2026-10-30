/**
 * `node:https` in the browser build: the process transport's mutual TLS (the `core` entry's `tls`) has no place on the
 * page's message network, which never leaves the page (`./network.ts`). A core configured with `tls` fails to start its
 * transport, and startup refuses. [PP-11]
 */

export type ServerOptions = Readonly<Record<string, unknown>>;

export function createServer(_options: ServerOptions): never {
  throw Object.assign(new Error("the browser build's process transport has no TLS: the page's message channels never leave the page"), {
    code: "ERR_TLS_UNAVAILABLE",
  });
}
