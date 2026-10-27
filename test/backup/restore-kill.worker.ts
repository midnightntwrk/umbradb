import { runRestore } from "../../src/cli/restore.js";
import { InMemoryBlockSource } from "../../src/runner/in-memory-source.js";

/**
 * A restore for A127's tests (task 15.2; BK-3), started by `restore-kill.test.ts` and its negative control with `node
 * --import tsx` and one JSON argument ({@link RestoreJob}): `umbradb restore`'s own work (`runRestore`) with the chain an
 * in-memory one, which holds for ever once `killAt` statements of the file ran — inside the restore's one transaction,
 * or, for the negative control, after that many statements each committed on its own — and says so with one line on
 * stdout (`loading <n>`); the test then kills it with SIGKILL. It exits by itself once its parent is no longer the
 * test's, since it would otherwise hold for ever.
 */

export interface RestoreJob {
  readonly file: string;
  readonly config: string;
  readonly cwd: string;
  readonly head: number;
  readonly killAt: number;
  readonly statementByStatement?: boolean;
}

const job = JSON.parse(process.argv[2] as string) as RestoreJob;
const parent = process.ppid;
const orphanGuard = setInterval(() => {
  if (process.ppid !== parent) process.exit(4);
}, 500);

const outcome = await runRestore(
  { file: job.file, config: job.config, cwd: job.cwd },
  {
    source: () => new InMemoryBlockSource({ head: BigInt(job.head) }),
    restore: {
      ...(job.statementByStatement === true ? { statementByStatement: true } : {}),
      async statementRan(count) {
        if (count !== job.killAt) return;
        process.stdout.write(`loading ${count}\n`);
        await new Promise<never>(() => undefined);
      },
    },
  },
);
process.stdout.write(`${JSON.stringify({ restored: outcome.restored, line: outcome.line })}\n`);
clearInterval(orphanGuard);
