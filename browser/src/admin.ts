/**
 * The admin endpoints in the browser build (`openspec/changes/core-arch/specs/browser/spec.md` BR-3; `specs/
 * admin-endpoints/spec.md` AE-1 to AE-6; `design.md` §9.2; task 8.1's note (f); task 16.1): calls on the process
 * worker's message channel, answered by the same backbone parts' endpoints as in Node.js (`answerAdmin` over
 * `ADMIN_ROUTES`: `/health/live`, `/health/ready`, `/status`, `/config`) from the snapshot the process publishes and
 * the age of its heartbeat's last tick. The process gets {@link messageAdmin} as its admin starter
 * (`ProcessInput.admin`), so the runner's own side of them (`ProcessAdmin`: the heartbeat, the snapshots, the
 * redaction) runs unchanged; the "listener" is the channel. Before the process's `core` revision is known, and after a
 * refusal of the configuration itself ended the process (Q137 B), nothing answers, as no listener exists in Node.js
 * then.
 */

import { ADMIN_ROUTES, answerAdmin } from "../../src/admin/routes.js";
import type { AdminServer, AdminStarter } from "../../src/admin/server.js";
import type { AdminAnswer, AdminSnapshot } from "../../src/admin/types.js";
import { tickAgeMs } from "../../src/runner/heartbeat.js";

/** The channel's "address", as the process logs it. */
export const ADMIN_CHANNEL = "message-channel";

let serving: { snapshot: AdminSnapshot; readonly beat: SharedArrayBuffer } | null = null;

/** The admin starter of a browser process (see the module comment). */
export const messageAdmin: AdminStarter = async ({ beat, snapshot }) => {
  const state = { snapshot, beat };
  serving = state;
  const server: AdminServer = {
    host: ADMIN_CHANNEL,
    port: 0,
    threadId: null,
    publish(next) {
      state.snapshot = next;
    },
    async close() {
      if (serving === state) serving = null;
    },
  };
  return server;
};

/** The answer to `GET <path>` now, or null while no admin endpoint is served (see the module comment). */
export function adminAnswer(method: string, path: string): AdminAnswer | null {
  if (serving === null) return null;
  return answerAdmin(ADMIN_ROUTES, method, path, {
    snapshot: serving.snapshot,
    beatAgeMs: tickAgeMs(serving.beat),
    nowNs: process.hrtime.bigint(),
  });
}
