import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { ADMIN_ROUTES, answerAdmin } from "../../../src/admin/routes.js";
import type { ModuleDeclaration } from "../../../src/modules/declaration.js";
import { type AdminRun, mainThreadAdmin, observe, startWithAdmin, statusWhen } from "../../admin/admin-harness.js";
import { SECRET_FORMS, secretDatabase, secretProblems } from "../../admin/secrets.js";
import { PROCESS_BACKENDS } from "../../runner/process-backends.js";
import { loggingModule } from "../../runner/process-build.js";

/**
 * A29 (task 8.4; CF-4, AE-6): with a password in `database`, the password appears in neither `/config`, `/status` nor
 * the captured logs — through the process on PostgreSQL 18, whose `database` URL holds a password (a PGlite setting is
 * a directory and has none): a login role of the test's own whose password is `test/admin/secrets.ts`'s secret, every
 * character URL encodings treat differently. To give the logs a line that would carry it, a callback at height 2 throws
 * an error holding the `database` URL as written (as a driver's error may) and the password in each of its six forms;
 * the process halts and logs it through the configuration's redaction. The full bodies of the four endpoints and every
 * captured line are searched for each form.
 *
 * Committed negative control: a `/config` that shows the process revision's settings without the redaction shows the
 * password, and the same search finds it.
 */

const POSTGRES = PROCESS_BACKENDS.filter((backend) => backend.kind === "postgres");

/** Module `d`: at height 2 its `on-compute` throws an error holding `database` and every form of the secret. */
function leaking(database: string): ModuleDeclaration {
  const base = loggingModule("d", [], ["on-db-write"]);
  return {
    ...base,
    points: {
      ...base.points,
      async "on-compute"(_p, b) {
        if (b.height === 2n) throw new Error(`could not connect to ${database}: ${SECRET_FORMS.join(" | ")}`);
      },
    },
  };
}

describe.each(POSTGRES)("A29: a password in database on $name", (backend) => {
  beforeAll(() => backend.start(), 180_000);
  afterAll(() => backend.stop(), 60_000);

  it("A29: the password is in neither /config, /status nor the captured logs", async () => {
    const database = await secretDatabase(await backend.database());
    const run = startWithAdmin({ database, user: [leaking(database)] });
    const origin = await run.origin();
    const { core } = await run.handle.started;
    // The process runs on that database: its settings hold the password, as written.
    expect(String(core.settings?.database)).toContain(SECRET_FORMS[1]);
    await statusWhen(origin, (body) => body.state === "halted", 60_000);
    const seen = await observe(origin);
    expect(seen.config.json).toMatchObject({ core: { settings: { database: "[redacted]" } }, database: { backend: "postgres", writerLock: true } });
    const texts = {
      "/health/live": seen.live.text,
      "/health/ready": seen.ready.text,
      "/status": seen.status.text,
      "/config": seen.config.text,
      logs: run.lines.join("\n"),
    };
    expect(secretProblems(texts)).toEqual([]);
    // The logs did carry a line built from the URL and the password, redacted.
    const halt = run.lines.find((line) => line.startsWith("processing halted (callback-error)"));
    expect(halt).toMatch(/could not connect to .*\[redacted\]/);
    await run.handle.stop();
  }, 120_000);

  it("negative control: a /config showing the settings without the redaction shows the password, and the search finds it", async () => {
    const database = await secretDatabase(await backend.database());
    const run: AdminRun = startWithAdmin({
      database,
      starter: mainThreadAdmin(async (method, url, view) => {
        if (method !== "GET" || url !== "/config") return answerAdmin(ADMIN_ROUTES, method, url, view);
        const { core } = await run.handle.started;
        return { status: 200, body: { ...view.snapshot.config, core: { start: core.start, settings: core.settings } } as never };
      }),
    });
    const origin = await run.origin();
    await statusWhen(origin, (body) => body.cursor === "3", 60_000);
    const seen = await observe(origin);
    expect(secretProblems({ "/config": seen.config.text })).toContain("/config holds form 1 of the secret");
    await run.handle.stop();
  }, 120_000);
});
