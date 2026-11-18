/**
 * The two texts of the read view (`./read-view.ts`), each sent as one simple-protocol text: {@link OPEN} before the
 * view's first statement, {@link CLOSE} after its body settled. They are constants of their own module so that a
 * negative control can replace them.
 */

/**
 * Opens the view: a savepoint, made read-only, with every setting and the role back at the session's own (the outer
 * transaction's are restored by {@link CLOSE}).
 */
export const OPEN = "SAVEPOINT umbradb_read_view; SET TRANSACTION READ ONLY; RESET ALL; RESET ROLE";

/**
 * Closes the view: everything since {@link OPEN} undone, a failed statement's abort included, and the savepoint gone.
 * Both commands are needed: after a failure, the release alone is refused.
 */
export const CLOSE = "ROLLBACK TO SAVEPOINT umbradb_read_view; RELEASE SAVEPOINT umbradb_read_view";
