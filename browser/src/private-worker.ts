/**
 * A private worker of the browser build: one private instance, in a dedicated Web Worker with its own PGlite database,
 * reading public data through the core's transport over the page's message network (`./process-worker.ts`).
 */

import "./process-worker.js";
