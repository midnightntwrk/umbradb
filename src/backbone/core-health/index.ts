/**
 * The backbone part `core-health`: its declaration (`./core-health.ts`), `/health/live` and `/health/ready`
 * (`./endpoints.ts`), and the readiness rules (`./readiness.ts`). [AE-1, AE-2, AE-4, Q70]
 */
export { CORE_HEALTH } from "./core-health.js";
export { CORE_HEALTH_ENDPOINTS } from "./endpoints.js";
export { NOT_READY_STATES, type ReadinessFacts, readinessOf } from "./readiness.js";
