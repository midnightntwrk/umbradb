/**
 * A private instance's id: the name it gives in its `hello`, a private process's `instanceId` and each of the core's
 * `lockstepInstances`. One rule for all three, so a configured id is always one a `hello` can carry and the reverse.
 *
 * The core writes the id into its log lines and shows it in `/status`. So it is 1 to {@link INSTANCE_ID_MAX} of the
 * ASCII letters, the digits, `.`, `_`, `:` and `-`: no space, line break or control character that could end a log
 * line and forge the next one, and no length that could fill each line and the status answer. A `hello` with any
 * other id fails its schema, which closes the connection, and a configuration naming one is refused at startup.
 * [PP-4, PP-9, CF-4]
 */

import { z } from "zod";

/** The longest instance id, in characters (each one byte, as all are ASCII). */
export const INSTANCE_ID_MAX = 128;

/** An instance id's characters and length. */
export const INSTANCE_ID = new RegExp(`^[A-Za-z0-9._:-]{1,${INSTANCE_ID_MAX}}$`);

/** The schema of an instance id. */
export const instanceIdSchema = () =>
  z.string().regex(INSTANCE_ID, {
    error: `expected an instance id: 1 to ${INSTANCE_ID_MAX} ASCII letters, digits, '.', '_', ':' or '-'`,
  });
