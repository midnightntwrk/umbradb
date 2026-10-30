import { existsSync, mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, beforeAll, describe, expect, it, vi } from "vitest";
import { processOn, processProblems } from "./pglite-directory-fixtures.js";

/**
 * The committed negative control for creating the PGlite directory. A build whose `createPgliteDirectory`
 * (`src/db/pglite-lock.ts`) creates nothing, as the opening worked before missing directories were created, fails the
 * first check: `startProcess` on the PGlite path `<tmp>/a/b` with `<tmp>/a` missing refuses with `database-error`
 * (`open-failed`: the lock's file cannot sit beside a directory whose parent is missing), creates no directory and
 * commits nothing. The same build with the real `createPgliteDirectory` passes. The oracle is in
 * `./pglite-directory-fixtures.ts`. [A166, CF-4, Q163 A]
 */

const control = vi.hoisted(() => ({ createsNothing: true }));

vi.mock("../../src/db/pglite-lock.js", async (importOriginal) => {
  const actual = await importOriginal<typeof import("../../src/db/pglite-lock.js")>();
  return {
    ...actual,
    createPgliteDirectory: (dataDir: string) => (control.createsNothing ? null : actual.createPgliteDirectory(dataDir)),
  };
});

let tmp = "";

beforeAll(() => {
  tmp = mkdtempSync(join(tmpdir(), "umbradb-2-2c-control-"));
});

afterAll(() => {
  if (tmp !== "") rmSync(tmp, { recursive: true, force: true });
});

describe("negative control: a build that never creates a PGlite directory's missing parents fails A166", () => {
  it("startProcess on <tmp>/a/b is refused open-failed, creating nothing; the real creation passes", async () => {
    control.createsNothing = true;
    const refused = processProblems(await processOn(join(tmp, "a", "b")));
    expect(refused).toEqual([
      "startup refused (database-error open-failed)",
      "the directory was not created",
      "block S was not committed",
      "no writer lock file beside the directory",
      "no log line names the directory created",
    ]);
    expect(existsSync(join(tmp, "a"))).toBe(false);

    control.createsNothing = false;
    expect(processProblems(await processOn(join(tmp, "c", "d")))).toEqual([]);
  }, 600_000);
});
