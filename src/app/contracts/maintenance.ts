import { ICircuitBreakerMaintenance } from "./circuitBreakerMaintenance";
import { ICacheMaintenance } from "./cacheMaintenance";

/**
 * Maintenance for resilience proxies.
 */
export interface IMaintance {
    /**
     * Gets circuit breaker maintenance.
     */
    circuitBreaker(): ICircuitBreakerMaintenance;

    /**
     * Gets cache maintanance.
     */
    cache(): ICacheMaintenance;
}
