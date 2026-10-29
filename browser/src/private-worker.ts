/**
 * A private worker of the browser build: one private instance, in a dedicated Web Worker with its own PGlite database,
 * reading public data through the core's transport over the page's message network (`./process-worker.ts`).
 * [BR-1, PP-1, PP-4; design §9.2]
 */

import "./process-worker.js";
