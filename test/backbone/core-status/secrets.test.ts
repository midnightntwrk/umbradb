import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { z } from "zod";
import { ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { adminCore, type AdminRun, mainThreadAdmin, observe, startWithAdmin, statusWhen } from "../../admin/admin-harness.js";
import { SECRET_FORMS, SECRET_NODE, SECRET_TEXT, secretDatabase, secretProblems } from "../../admin/secrets.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { entryOf, loggingModule } from "../../runner/process-build.js";

/**
 * A67 (task 8.3; AE-6): a halt caused by an error whose message contains a secret shows the error code, height, module
 * and point, and the secret appears nowhere in the response — through the process on PostgreSQL 18 and PGlite. The
 * secret (`test/admin/secrets.ts`) is a real secret of the configuration, in each of its six forms: the `node` URL's
 * password (a secret field, CF-4), a user module's `secret` setting, and on PostgreSQL the `database` URL's password (a
 * login role of the test's own). The callback that halts throws a message holding every form; the full bodies of the
 * four endpoints and every captured log line are searched for each, and the halt's log line shows the redaction.
 *
 * Committed negative control: a `/status` that adds the exception's own message (as an endpoint built from raw
 * exception messages would) shows the secret, and the same search finds it: every form, the decoded one JSON-escaped.
 */

/** Module `f`: a `secret` setting `apiKey`; at height 2 its `on-compute` throws a message holding the secret's forms. */
function failing(): ModuleDeclaration {
  const base = loggingModule("f", [], ["on-db-write"]);
  return {
    ...base,
    configSchema: z.object({ apiKey: z.string().meta({ kind: "secret" }) }),
    points: {
      ...base.points,
      async "on-compute"(_p, b) {
        if (b.height === 2n) throw new Error(`apiKey ${b.settings.apiKey as string} ${SECRET_TEXT}`);
      },
    },
  };
}

/** A process on `database` with the secret in its `node` and in `f`'s `apiKey`, `f` halting at 2. */
function halting(database: string, starter?: Parameters<typeof startWithAdmin>[0]["starter"]): AdminRun {
  const f = failing();
  return startWithAdmin({
    database,
    user: [f],
    entries: [
      adminCore(database, 1, { extra: { node: SECRET_NODE, listen: { admin: "127.0.0.1:0" } } }),
      entryOf(f, 1, { apiKey: SECRET_FORMS[0] }),
    ],
    ...(starter === undefined ? {} : { starter }),
  });
}

describe.each(PROCESS_BACKENDS)("A67: a halt whose error holds a secret, on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A67: /status shows the code, height, module and point; the secret is in no response and no log line", async () => {
    const database = await secretDatabase(await backend.database());
    const run = halting(database);
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.state === "halted", 60_000);
    const seen = await observe(origin);
    expect(seen.status.json).toMatchObject({
      state: "halted",
      reason: { code: "callback-error", height: "2", module: "f", point: "on-compute", details: {} },
    });
    // The error the halt came from does hold the secret, in every form.
    const ended = run.handle.status().ended as { kind: string; error: Error };
    expect(ended.kind).toBe("failed");
    const raw = String((ended.error as Error & { cause?: { cause?: Error } }).cause?.cause?.message ?? ended.error.message);
    for (const form of SECRET_FORMS) expect(raw, form).toContain(form);
    const texts = {
      "/health/live": seen.live.text,
      "/health/ready": seen.ready.text,
      "/status": seen.status.text,
      "/config": seen.config.text,
      logs: run.lines.join("\n"),
    };
    expect(secretProblems(texts)).toEqual([]);
    // The halt was logged, its message through the configuration's redaction.
    const halt = run.lines.find((line) => line.startsWith("processing halted (callback-error)"));
    expect(halt).toContain("[redacted]");
    if (backend.kind === "postgres") expect(database).toContain(SECRET_FORMS[1]);
    await run.handle.stop();
  }, 120_000);

  it("negative control: a /status that adds the exception's message shows the secret, and the search finds it", async () => {
    const database = await secretDatabase(await backend.database());
    const run: AdminRun = halting(
      database,
      mainThreadAdmin((method, url, view) => {
        const answer = answerAdmin(ADMIN_ROUTES, method, url, view);
        const ended = run.handle.status().ended;
        if (url !== "/status" || ended?.kind !== "failed") return answer;
        return { ...answer, body: { ...(answer.body as object), message: (ended.error as Error).message } };
      }),
    );
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.state === "halted", 60_000);
    const seen = await observe(origin);
    // A JSON body writes the decoded form JSON-escaped (form 5); every other form appears as it is.
    expect(secretProblems({ "/status": seen.status.text })).toEqual(
      SECRET_FORMS.slice(1).map((_, index) => `/status holds form ${index + 1} of the secret`),
    );
    await run.handle.stop();
  }, 120_000);
});
