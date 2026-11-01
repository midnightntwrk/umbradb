/**
 * The module API's start, and the names of its two layers: the session logic every carrier shares
 * (`./api-session.ts`: the HTTP answering, the fetch-style handler, the subscription protocol over a WebSocket or a
 * host's channel) and the socket carrier (`./api-socket.ts`: the Node.js handlers and the listener on `listen.api`).
 * [RN-1, RN-15, RN-16, LM-4, LM-11; design §1, §8]
 *
 * {@link startModuleApi} runs startup's module API steps and gives the process every way to reach the module API: the
 * listener where the plan puts it, the Node.js handlers a library host mounts in its own server (made on their first
 * use, so a process that never mounts them — the browser's, which carries the socket carrier only as its build's stub —
 * never makes them), the fetch-style handler and the channel subscriptions the browser demo uses. The negative
 * controls' changes of the mounted handlers ({@link MountedApiSeams}) apply to all three mounted ways, never to the
 * listener.
 */

import type { PrivateLinkChannel } from "../library/channels.js";
import { coreHeaders } from "./api-answers.js";
import { connectChannel, connectionRules, type FetchHandler, moduleApiFetch, type ModuleApiLimits, type ServedConnection } from "./api-session.js";
import { listenModuleApi, type ModuleApiHandlers, moduleApiHandlers, type ModuleApiServer } from "./api-socket.js";
import { type ApiRoutes, type ApiStartup, ModuleApi, type ModuleApiOptions, registerModuleApis } from "./module-api.js";

export { CONFIG_HASH_HEADER, type NodeHttpHandler, type NodeUpgradeHandler, VERSION_HEADER } from "./api-answers.js";
export {
  CLOSE_TIMEOUT_MS,
  DEFAULT_MAX_BODY_BYTES,
  DEFAULT_MAX_MESSAGE_BYTES,
  type FetchHandler,
  MAX_BUFFERED_BYTES,
  type ModuleApiLimits,
  parseAddress,
} from "./api-session.js";
export {
  coreHeadersResponse,
  listenModuleApi,
  type ModuleApiHandlerOptions,
  type ModuleApiHandlers,
  moduleApiHandlers,
  type ModuleApiServer,
  type ModuleApiServerOptions,
  unreadableAnswer,
  VersionedResponse,
} from "./api-socket.js";

/**
 * The negative controls' changes of the mounted handlers only, never of the listener: their limits and error answers
 * ({@link ModuleApiLimits}), the core's headers left out, and the module API they answer through (one whose read is
 * not bounded, or whose errors carry a failure's text). A host's process takes none of them. [L24, L65, L68]
 */
export interface MountedApiSeams extends ModuleApiLimits {
  readonly coreHeaders?: "none";
  readonly moduleApi?: (routes: ApiRoutes, options: ModuleApiOptions) => ModuleApi;
}

/** What {@link startModuleApi} starts. */
export interface ModuleApiStart extends ApiStartup {
  /** The database each request reads (the core's, or its read-only item). */
  readonly db: ModuleApiOptions["db"];
  /** `listen.api`: none, no listener — `on-start-api` and its checks still run. [CF-4] */
  readonly address?: string;
  /** `apiReadTimeoutMs`. [CF-4, DB-15] */
  readonly apiReadTimeoutMs: number;
  readonly onError?: ModuleApiOptions["onError"];
  /** The routes to register into (a negative control's); new ones by default. */
  readonly routes?: ApiRoutes;
  /** The process's configuration hash, on every answer of the listener and the handlers; none unless given. [RN-16, Q147] */
  readonly configHash?: string;
  /** The negative controls' changes of the mounted handlers ({@link MountedApiSeams}); none unless given. */
  readonly mounted?: MountedApiSeams;
}

/** The module API started. */
export interface StartedModuleApi {
  readonly routes: ApiRoutes;
  readonly api: ModuleApi;
  /** Null without `listen.api`. */
  readonly server: ModuleApiServer | null;
  /**
   * The Node.js handlers a library host mounts in its own server (`moduleApiHandlers`, the core's headers set in their
   * own answers), made on the first call. [LM-4]
   */
  node(): ModuleApiHandlers;
  /** The fetch-style handler (the browser demo's `api.fetch`), with the core's headers. [LM-11] */
  readonly fetch: FetchHandler;
  /** Serves the subscription protocol on a host's channel (the browser demo's `api.connect`); throws nothing. [LM-11] */
  connect(channel: PrivateLinkChannel): void;
  /** Closes the listener, the Node.js handlers' WebSocket connections and the channels it serves. */
  close(): Promise<void>;
}

/**
 * The startup's module API steps: `on-start-api` and the duplicate check (`registerModuleApis`), then the listener on
 * `listen.api`, if one is configured, so a refused startup listens nowhere, and the handlers a host mounts. Rejects with
 * the first failure of either. [RN-1, RN-15, LM-4, LM-11]
 */
export async function startModuleApi(input: ModuleApiStart): Promise<StartedModuleApi> {
  const routes = await registerModuleApis(input, input.routes);
  const options: ModuleApiOptions = {
    db: input.db,
    timeoutMs: input.apiReadTimeoutMs,
    ...(input.onError === undefined ? {} : { onError: input.onError }),
  };
  const api = new ModuleApi(routes, options);
  const { configHash } = input;
  const server = input.address === undefined ? null : await listenModuleApi(api, input.address, configHash === undefined ? {} : { configHash });
  const { moduleApi, ...seams } = input.mounted ?? {};
  const mounted = moduleApi === undefined ? api : moduleApi(routes, options);
  const core = seams.coreHeaders === "none" ? null : coreHeaders(configHash);
  let node: ModuleApiHandlers | undefined;
  const channels = new Set<ServedConnection>();
  const rules = connectionRules(seams);
  return Object.freeze({
    routes,
    api,
    server,
    node: () => {
      node ??= moduleApiHandlers(mounted, { ...seams, ...(configHash === undefined ? {} : { configHash }) });
      return node;
    },
    fetch: moduleApiFetch(mounted, { ...(seams.maxBodyBytes === undefined ? {} : { maxBodyBytes: seams.maxBodyBytes }), core }),
    connect: (channel: PrivateLinkChannel) => {
      // A channel that fails while it is set up has ended before it is kept.
      let served: ServedConnection | undefined;
      let ended = false;
      served = connectChannel(channel, mounted, {
        rules,
        ...(seams.maxMessageBytes === undefined ? {} : { maxMessageBytes: seams.maxMessageBytes }),
        ended: () => {
          ended = true;
          if (served !== undefined) channels.delete(served);
        },
      });
      if (!ended) channels.add(served);
    },
    close: async () => {
      await server?.close();
      await node?.close();
      await Promise.all([...channels].map((served) => served.close()));
    },
  });
}
