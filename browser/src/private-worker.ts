/**
 * A private worker of the browser build (`openspec/changes/core-arch/specs/browser/spec.md` BR-1; `specs/
 * private-processes/spec.md` PP-1, PP-4; `design.md` §9.2; task 16.1): one private instance, in a dedicated Web Worker
 * with its own PGlite database, reading public data through the core's transport over the page's message network
 * (`./process-worker.ts`).
 */

import "./process-worker.js";
