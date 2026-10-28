import { mkdtempSync, readdirSync, rmSync } from "node:fs";
import { open } from "node:fs/promises";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { afterAll, describe, expect, it, vi } from "vitest";
import { BACKUP_FILE_MODE, writeBackup } from "../../src/backup/backup.js";
import { openPglite } from "../../src/db/pglite.js";

/**
 * Task 17.5b (the mutation pass task 15.1b deferred): the backup's owner-only file in this process, without changing the
 * umask (`file-mode.test.ts` sets one, which a worker thread cannot, so a mutation run cannot run it): a `chmod` the
 * file system refuses fails the backup with that error, the temporary file removed and nothing written.
 */

const root = mkdtempSync(join(tmpdir(), "umbradb-owner-only-"));
afterAll(() => rmSync(root, { recursive: true, force: true }));

describe("ownerOnlyFile through writeBackup (task 17.5b)", () => {
  it("fails on a refused chmod with its error, the temporary file removed and nothing written", { timeout: 120_000 }, async () => {
    const dir = mkdtempSync(join(root, "refused-"));
    const out = join(dir, "refused.backup");
    const handle = await open(join(root, "prototype"), "w");
    const prototype = Object.getPrototypeOf(handle) as { chmod(mode: number): Promise<void> };
    await handle.close();
    const refused = Object.assign(new Error("EPERM: operation not permitted, fchmod"), { code: "EPERM" });
    const chmod = vi.spyOn(prototype, "chmod").mockRejectedValueOnce(refused);
    const db = await openPglite({ dataDir: "memory://", committedHeight: async () => 1n, developmentOptIn: true });
    try {
      await expect(writeBackup({ db, target: { backend: "pglite" }, out, optedOut: [], developmentOptIn: true })).rejects.toBe(refused);
      expect(chmod).toHaveBeenCalledWith(BACKUP_FILE_MODE);
    } finally {
      chmod.mockRestore();
      await db.close();
    }
    expect(readdirSync(dir)).toEqual([]);
  });
});
