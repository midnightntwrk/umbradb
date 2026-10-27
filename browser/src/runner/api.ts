/**
 * The module API in the browser build, in place of `src/runner/api-server.ts` (`openspec/changes/core-arch/specs/
 * runner/spec.md` RN-1, RN-15, RN-16; `design.md` §9.2; task 5.2a's note (h); task 16.1): a page has no HTTP listener,
 * so the module API is answered on the process worker's message channel (`browser/src/process-worker.ts`'s `api`,
 * `subscribe` and `unsubscribe` calls) by the same `ModuleApi` (`src/runner/module-api.ts`), transport-neutral: a
 * request is the method, path, query and body as an `ApiRequest`, the answer the handler's `ApiResponse` as the handler
 * gave it (the `X-Umbra-Version` header is the HTTP listener's, RN-16 names HTTP answers, task 5.2c's note (a));
 * subscriptions carry `ModuleApi.subscribe`'s values.
 *
 * Startup's steps are Node.js's: `on-start-api` and the duplicate check (`registerModuleApis`), then, with
 * `listen.api`, the module API answers on the channel (the listener's address is the channel's, reported as
 * `message-channel:0`); without it nothing answers. The worker also reads through the database the process hands its
 * module API — the contents hash and the page's reads (`./process-registry.ts`) —, which is the database the process
 * opened (DB-1).
 */

import { schemaPlan } from "../../../src/modules/adapters.js";
import {
  type ApiRoutes,
  type ApiStartup,
  ModuleApi,
  type ModuleApiOptions,
  registerModuleApis,
} from "../../../src/runner/module-api.js";
import { opened } from "./process-registry.js";

/** The module API "listener" of the browser: the worker's message channel. */
export interface ModuleApiServer {
  readonly host: string;
  readonly port: number;
  close(): Promise<void>;
}

/** What {@link startModuleApi} starts (as `src/runner/api-server.ts`'s). */
export interface ModuleApiStart extends ApiStartup {
  readonly db: ModuleApiOptions["db"];
  readonly address?: string;
  readonly apiReadTimeoutMs: number;
  readonly onError?: ModuleApiOptions["onError"];
  readonly routes?: ApiRoutes;
}

/** The module API started (as `src/runner/api-server.ts`'s). */
export interface StartedModuleApi {
  readonly routes: ApiRoutes;
  readonly api: ModuleApi;
  readonly server: ModuleApiServer | null;
  close(): Promise<void>;
}

/** `host:port`, as CF-4 writes addresses (`src/runner/api-server.ts`'s, which `src/admin/server.ts` imports). */
const ADDRESS = /^(?:\[([0-9A-Fa-f:.]+)\]|([^\s:/[\]@]+)):(\d{1,5})$/;

/** `address` as a host and a port; throws a `TypeError` for anything else. */
export function parseAddress(address: string): { readonly host: string; readonly port: number } {
  const match = typeof address === "string" ? ADDRESS.exec(address) : null;
  const port = Number(match?.[3]);
  if (match === null || port > 65_535) {
    throw new TypeError(`expected an address host:port, its port from 0 to 65535 (CF-4), not ${JSON.stringify(address)}`);
  }
  return { host: (match[1] ?? match[2]) as string, port };
}

/** The startup's module API steps (see the module comment). */
export async function startModuleApi(input: ModuleApiStart): Promise<StartedModuleApi> {
  const routes = await registerModuleApis(input, input.routes);
  const api = new ModuleApi(routes, {
    db: input.db,
    timeoutMs: input.apiReadTimeoutMs,
    ...(input.onError === undefined ? {} : { onError: input.onError }),
  });
  const listening = input.address !== undefined;
  const closeOpened = opened({
    db: input.db,
    optedOut: schemaPlan(input.graph.modules).optedOut,
    api: listening ? api : null,
  });
  const server: ModuleApiServer | null = listening
    ? Object.freeze({ host: "message-channel", port: 0, close: async () => undefined })
    : null;
  return Object.freeze({
    routes,
    api,
    server,
    close: async () => {
      closeOpened();
    },
  });
}
