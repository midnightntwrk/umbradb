/**
 * The tape node's port: a random free port at or above 10000 on the loopback interface, as the workspace's tests use
 * (the machine is shared, so a fixed port may be taken).
 */

import { randomInt } from "node:crypto";
import type { Server } from "node:net";

/** How many ports are tried before giving up. */
export const PORT_ATTEMPTS = 20;

/** A random port from 10000 to 59999. */
export function randomPort(): number {
  return randomInt(10_000, 60_000);
}

/**
 * Makes `server` listen on `127.0.0.1` at a port `pick` gives, trying another while the port is taken
 * (`EADDRINUSE`), up to {@link PORT_ATTEMPTS} times; any other error fails at once. Resolves with the port.
 */
export async function listenOnRandomPort(server: Server, pick: () => number = randomPort): Promise<number> {
  for (let attempt = 0; attempt < PORT_ATTEMPTS; attempt++) {
    const port = pick();
    const listening = await new Promise<boolean>((resolve, reject) => {
      const onError = (error: NodeJS.ErrnoException): void => {
        server.off("listening", onListening);
        if (error.code === "EADDRINUSE") resolve(false);
        else reject(error);
      };
      const onListening = (): void => {
        server.off("error", onError);
        resolve(true);
      };
      server.once("error", onError);
      server.once("listening", onListening);
      server.listen(port, "127.0.0.1");
    });
    if (listening) return port;
  }
  throw new Error(`the tape node found no free port at or above 10000 in ${PORT_ATTEMPTS} attempts`);
}
