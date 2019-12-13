import { CircuitBreakerMaintenance } from './circuitBreakerMaintenance';
import { CacheMaintenance } from './cacheMaintenance';

/**
 * Maintenance for resilience proxies.
 */
export interface Maintance {
  /**
   * Gets circuit breaker maintenance.
   */
  circuitBreaker(): CircuitBreakerMaintenance;

  /**
   * Gets cache maintanance.
   */
  cache(): CacheMaintenance;
}
