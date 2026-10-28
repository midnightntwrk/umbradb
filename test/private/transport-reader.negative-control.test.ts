import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { canWriteFindings, type TransportReaderFacts } from "../../src/private/transport-reader.js";
import { PRIVATE_BACKENDS, START_TIMEOUT_MS, TEST_TIMEOUT_MS } from "./backends.js";
import { launchPublicCore } from "./builds.js";
import { PUB, PUB_ENTRY } from "./read-confinement-checks.js";

/**
 * A177's committed negative control (task 4.5; CF-4, owner decision Q175 A): a `transportReader` check that accepts a
 * superuser — the startup check with its superuser rule removed, given through the process's test seam
 * `transportReaderCheck` — lets a core whose transport reader is a superuser start, which A177's oracle refuses
 * (`transport-reader.test.ts`: such a core refuses startup with `transport-reader-can-write`). The same login is
 * refused with the check as built, in the same run.
 */

const POSTGRES = PRIVATE_BACKENDS.find((backend) => backend.kind === "postgres");
if (POSTGRES === undefined) throw new Error("no PostgreSQL backend");

const SUPER = "a177nc_super";

/** The check as built, except that a superuser is accepted. */
const acceptsSuperuser = (facts: TransportReaderFacts) => (facts.superuser ? [] : canWriteFindings(facts));

describe("A177's negative control: a transportReader check that accepts a superuser", () => {
  const backend = POSTGRES;
  beforeAll(async () => {
    await backend.start();
    const db = await backend.database("public");
    await db.exec?.(`CREATE ROLE ${SUPER} LOGIN SUPERUSER PASSWORD '${SUPER}';`);
  }, START_TIMEOUT_MS);
  afterAll(() => backend.stop(), START_TIMEOUT_MS);

  it("negative control (committed): the superuser's core starts, failing A177's refusal", async () => {
    const extra = { listen: { transport: "127.0.0.1:0" }, transportReader: { user: SUPER, password: SUPER } };
    const options = { head: 3n, modules: [PUB], entries: [PUB_ENTRY], extra };
    const control = launchPublicCore({
      ...options,
      database: (await backend.database("public")).setting,
      transportReaderCheck: acceptsSuperuser,
    });
    try {
      await expect(control.handle.started).resolves.toBeDefined();
    } finally {
      await control.stop();
    }
    const built = launchPublicCore({ ...options, database: (await backend.database("public")).setting });
    try {
      await expect(built.handle.started).rejects.toMatchObject({ code: "transport-reader-can-write" });
    } finally {
      await built.stop();
    }
  }, TEST_TIMEOUT_MS);
});
