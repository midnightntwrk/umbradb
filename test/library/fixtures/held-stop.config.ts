// A configuration file whose evaluation waits at the hold `held-stop` until the test releases it: a slow `{ file }`
// import, during which the test stops the process. [L32]

import { libraryData, PGLITE_MEMORY } from "../library-fixtures.js";
import { waitAtHold } from "./import-holds.js";

await waitAtHold("held-stop");

export default libraryData(PGLITE_MEMORY);
