// A configuration file whose evaluation waits at the hold `held-start` until the test releases it: a process
// `starting` before its configuration is loaded, whose mounted admin answers with nothing of it yet. [L25]

import { libraryData, PGLITE_MEMORY } from "../library-fixtures.js";
import { waitAtHold } from "./import-holds.js";

await waitAtHold("held-start");

export default libraryData(PGLITE_MEMORY);
