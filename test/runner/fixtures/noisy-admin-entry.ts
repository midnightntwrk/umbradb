/**
 * An admin worker entry that writes one line to each of its standard streams, then runs UmbraDB's own entry: what the
 * admin thread writing to stdout and stderr looks like to the process. [L4, L55]
 */

process.stdout.write("noisy admin entry: a line on stdout\n");
process.stderr.write("noisy admin entry: a line on stderr\n");
await import("../../../src/admin/worker.js");
