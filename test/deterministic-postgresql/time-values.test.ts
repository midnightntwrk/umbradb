import { spawn } from "node:child_process";
import { fileURLToPath } from "node:url";
import { afterAll, beforeAll, describe, expect, it } from "vitest";
import type { Database } from "../../src/db/api.js";
import { BACKENDS } from "../db/backends.js";
import { MARKER } from "./time-values.worker.js";

/**
 * A139 [DIFF] (DB-2, owner decisions Q68 and Q81): on both backends, in processes whose time zone is `UTC`,
 * `America/New_York` and `Asia/Tokyo`, a `timestamptz` reads as RFC 3339 UTC text (`2025-05-21T14:30:00Z`, the fraction
 * only when there is one), a `timestamp` as the same text without `Z`, a `date` as `2025-05-21`, `infinity` and
 * `-infinity` as those words, arrays of them element by element with `NULL` as `null` — identical in every process.
 *
 * Each process is a child started with `node --import tsx` and its own `TZ` (`time-values.worker.ts`). On PostgreSQL
 * it opens the test database of this file through the API; on PGlite it creates its engine itself, in its own time
 * zone, from the same setup. Every child's values are compared with the values written out here by hand and with each
 * other, and with what this process reads.
 *
 * Committed controls: each child reports its time zone and its clock's offset, which differ, so the processes did run
 * in three zones; and each also applies the mapping task 2.1 shipped (`new Date(text)`) to the same values' text,
 * which gives a different instant for the `timestamp` in each zone and drops the microseconds, so this test fails a
 * `Date`-based mapping.
 */

const WORKER = fileURLToPath(new URL("./time-values.worker.ts", import.meta.url));
const REPOSITORY = fileURLToPath(new URL("../..", import.meta.url));
const TIME_ZONES = ["UTC", "America/New_York", "Asia/Tokyo"] as const;

const SETUP = `
  CREATE SCHEMA m;
  CREATE TABLE m.times (
    k integer PRIMARY KEY, tz timestamptz, ts timestamp, d date, tz_a timestamptz[], ts_a timestamp[], d_a date[]
  );
  INSERT INTO m.times VALUES
    (1, '2025-05-21 14:30:00+00', '2025-05-21 14:30:00', '2025-05-21',
        ARRAY['2025-05-21 14:30:00+00', NULL, 'infinity']::timestamptz[], ARRAY['2025-05-21 14:30:00.5', NULL]::timestamp[],
        ARRAY['2025-05-21', NULL, '-infinity']::date[]),
    (2, '2025-05-21 14:30:00.123456+00', '2025-05-21 14:30:00.123456', 'infinity',
        ARRAY[NULL]::timestamptz[], '{}', '{{2025-05-21},{2025-05-22}}'),
    (3, 'infinity', 'infinity', '-infinity', NULL, NULL, NULL),
    (4, '-infinity', '-infinity', NULL, '{}', ARRAY['-infinity']::timestamp[], NULL),
    (5, '2025-05-21 16:30:00.5+02', '0001-01-01 00:00:00', '9999-12-31', NULL, NULL, NULL);
`;

const QUERY = "SELECT *, tz::text AS tz_text, ts::text AS ts_text FROM m.times ORDER BY k";

/** What every process must read, written out by hand from DB-2 and A139. */
const EXPECTED = [
  {
    k: 1,
    tz: "2025-05-21T14:30:00Z",
    ts: "2025-05-21T14:30:00",
    d: "2025-05-21",
    tz_a: ["2025-05-21T14:30:00Z", null, "infinity"],
    ts_a: ["2025-05-21T14:30:00.5", null],
    d_a: ["2025-05-21", null, "-infinity"],
    tz_text: "2025-05-21 14:30:00+00",
    ts_text: "2025-05-21 14:30:00",
  },
  {
    k: 2,
    tz: "2025-05-21T14:30:00.123456Z",
    ts: "2025-05-21T14:30:00.123456",
    d: "infinity",
    tz_a: [null],
    ts_a: [],
    d_a: [["2025-05-21"], ["2025-05-22"]],
    tz_text: "2025-05-21 14:30:00.123456+00",
    ts_text: "2025-05-21 14:30:00.123456",
  },
  {
    k: 3,
    tz: "infinity",
    ts: "infinity",
    d: "-infinity",
    tz_a: null,
    ts_a: null,
    d_a: null,
    tz_text: "infinity",
    ts_text: "infinity",
  },
  {
    k: 4,
    tz: "-infinity",
    ts: "-infinity",
    d: null,
    tz_a: [],
    ts_a: ["-infinity"],
    d_a: null,
    tz_text: "-infinity",
    ts_text: "-infinity",
  },
  {
    k: 5,
    tz: "2025-05-21T14:30:00.5Z",
    ts: "0001-01-01T00:00:00",
    d: "9999-12-31",
    tz_a: null,
    ts_a: null,
    d_a: null,
    tz_text: "2025-05-21 14:30:00.5+00",
    ts_text: "0001-01-01 00:00:00",
  },
];

interface Report {
  readonly timeZone: string;
  readonly offsetMinutes: number;
  readonly rows: unknown;
  readonly dateMapping: readonly Record<string, string | null>[];
}

/** Runs the worker in a child process whose time zone is `zone` and returns its report. */
function inTimeZone(zone: string, job: Record<string, unknown>): Promise<Report> {
  return new Promise((resolve, reject) => {
    const child = spawn(process.execPath, ["--import", "tsx", WORKER, JSON.stringify(job)], {
      cwd: REPOSITORY,
      env: { ...process.env, TZ: zone },
      stdio: ["ignore", "pipe", "pipe"],
    });
    let out = "";
    let err = "";
    child.stdout.on("data", (chunk: Buffer) => {
      out += chunk.toString();
    });
    child.stderr.on("data", (chunk: Buffer) => {
      err += chunk.toString();
    });
    child.on("error", reject);
    child.on("close", (code) => {
      const line = out.split("\n").find((candidate) => candidate.startsWith(MARKER));
      if (code !== 0 || line === undefined) {
        reject(new Error(`the ${zone} worker exited with ${code}: ${err || out}`));
        return;
      }
      resolve(JSON.parse(line.slice(MARKER.length)) as Report);
    });
  });
}

for (const backend of BACKENDS) {
  describe(`A139 (DB-2, Q68) — date and time values read the same in every time zone, on ${backend.name}`, () => {
    let db: Database;
    let url: string | undefined;
    const reports = new Map<string, Report>();

    beforeAll(async () => {
      await backend.start();
      ({ db, url } = await backend.database(SETUP));
      const job = {
        backend: url === undefined ? "PGlite" : "PostgreSQL",
        url,
        setup: url === undefined ? SETUP : undefined,
        sql: QUERY,
        textColumns: ["tz_text", "ts_text"],
      };
      const results = await Promise.all(TIME_ZONES.map((zone) => inTimeZone(zone, job)));
      TIME_ZONES.forEach((zone, index) => reports.set(zone, results[index] as Report));
    }, 180_000);

    afterAll(async () => {
      await backend.stop();
    }, 60_000);

    it("reads RFC 3339 text in this process", async () => {
      expect(await db.read((read) => read.query(QUERY))).toEqual(EXPECTED);
    });

    it("reads the same values, as strings, in processes whose time zone is UTC, America/New_York and Asia/Tokyo", () => {
      for (const zone of TIME_ZONES) {
        // Tagged JSON: a Date or a bigint would show as an object here, never equal to these strings.
        expect(reports.get(zone)?.rows, zone).toEqual(EXPECTED);
      }
    });

    it("control: the three processes ran in three time zones", () => {
      expect(TIME_ZONES.map((zone) => reports.get(zone)?.timeZone)).toEqual([...TIME_ZONES]);
      // 2025-05-21 14:30 local time: UTC, EDT (UTC-4), JST (UTC+9).
      expect(TIME_ZONES.map((zone) => reports.get(zone)?.offsetMinutes)).toEqual([0, 240, -540]);
    });

    it("control: the Date-based mapping task 2.1 shipped differs between the processes and drops microseconds", () => {
      const timestamp = TIME_ZONES.map((zone) => reports.get(zone)?.dateMapping[0]?.ts_text);
      // `2025-05-21 14:30:00` without a zone is read in the process's own: three different instants.
      expect(timestamp).toEqual(["2025-05-21T14:30:00.000Z", "2025-05-21T18:30:00.000Z", "2025-05-21T05:30:00.000Z"]);
      for (const zone of TIME_ZONES) {
        expect(reports.get(zone)?.dateMapping[1]?.tz_text, zone).toBe("2025-05-21T14:30:00.123Z");
        expect(reports.get(zone)?.dateMapping[2]?.tz_text, zone).toBe("Invalid Date");
      }
    });
  });
}
