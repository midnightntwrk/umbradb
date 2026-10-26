/**
 * The backbone part `core-health` (`./core-health.ts`, its declaration): `/health/live` and `/health/ready`
 * (`./endpoints.ts`), readiness in AE-4's order (`./readiness.ts`) (AE-1, AE-2, AE-4, Q70).
 */
export { CORE_HEALTH } from "./core-health.js";
export { CORE_HEALTH_ENDPOINTS } from "./endpoints.js";
export { NOT_READY_STATES, type ReadinessFacts, readinessOf } from "./readiness.js";
