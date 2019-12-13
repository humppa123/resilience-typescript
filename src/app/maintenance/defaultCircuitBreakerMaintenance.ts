import { AbstractMaintenanceItem } from './abstractMaintenanceItem';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { CircuitBreakerState } from '../resilience/circuitBreakerState';
import { CircuitBreakerProxy } from '../resilience/circuitBreakerProxy';
import { CircuitBreakerMaintenance } from '../contracts/circuitBreakerMaintenance';

/**
 * Maintenance for circuit breakers.
 */
export class DefaultCircuitBreakerMaintenance extends AbstractMaintenanceItem
  implements CircuitBreakerMaintenance {
  /**
   * Initializes a new instance of the @see CircuitBreakerMaintenance class.
   * @param proxies Proxies to use for maintenance.
   */
  constructor(proxies: ResilienceProxy[]) {
    super(proxies);
  }

  /**
   * Sets a new state for all circuit breakers.
   * @param state New state for the circuit breakers.
   */
  setState(state: CircuitBreakerState): void {
    for (const proxy of this.proxies) {
      const circuitBreaker = proxy as CircuitBreakerProxy;
      if (
        circuitBreaker &&
        typeof circuitBreaker.resetErrorCount === 'function'
      ) {
        circuitBreaker.setState(state);
      }
    }
  }

  /**
   * Sets the state to 'open' for all circuit breakers.
   */
  open(): void {
    this.setState(CircuitBreakerState.Open);
  }

  /**
   * Sets the state to 'close' for all circuit breakers.
   */
  close(): void {
    this.setState(CircuitBreakerState.Close);
  }

  /**
   * Reset error count to zero.
   */
  resetErrorCount(): void {
    for (const proxy of this.proxies) {
      const circuitBreaker = proxy as CircuitBreakerProxy;
      if (
        circuitBreaker &&
        typeof circuitBreaker.resetErrorCount === 'function'
      ) {
        circuitBreaker.resetErrorCount();
      }
    }
  }
}
