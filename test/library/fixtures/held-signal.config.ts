// A configuration file whose evaluation waits at the hold `held-signal` until the test releases it: a slow `{ file }`
// import, during which the test aborts the host's signal.

import { libraryData, PGLITE_MEMORY } from "../library-fixtures.js";
import { waitAtHold } from "./import-holds.js";

await waitAtHold("held-signal");

export default libraryData(PGLITE_MEMORY);
