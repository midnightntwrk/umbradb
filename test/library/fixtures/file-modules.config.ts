// A configuration file of a library host: its default export the configuration, its `modules` export the user
// module it runs, whose callbacks note each height in `SEEN`. [LM-7, CF-1]

import { libraryData, PGLITE_MEMORY, rowsModule } from "../library-fixtures.js";

/** What `from-file` noted: `from-file <height>`. */
export const SEEN: string[] = [];

const fromFile = rowsModule("from-file", SEEN);

export const modules = [fromFile];

export default libraryData(PGLITE_MEMORY, [fromFile]);
