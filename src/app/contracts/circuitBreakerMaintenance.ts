import { CircuitBreakerState } from "../resilience/circuitBreakerState";

/**
 * Maintenance for circuit breakers.
 */
export interface ICircuitBreakerMaintenance {
    /**
     * Sets a new state for all circuit breakers.
     * @param state New state for the circuit breakers.
     */
    setState(state: CircuitBreakerState): void;

    /**
     * Sets the state to 'open' for all circuit breakers.
     */
    open(): void;

    /**
     * Sets the state to 'close' for all circuit breakers.
     */
    close(): void;

    /**
     * Reset error count to zero.
     */
    resetErrorCount(): void;
}
