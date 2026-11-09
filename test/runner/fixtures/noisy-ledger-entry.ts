/**
 * A ledger worker entry that writes one line to each of its standard streams, then runs UmbraDB's own entry: what a
 * ledger package or a user module writing to stdout and stderr looks like to the process.
 */

process.stdout.write("noisy ledger entry: a line on stdout\n");
process.stderr.write("noisy ledger entry: a line on stderr\n");
await import("../../../src/ledger/worker/entry.js");
