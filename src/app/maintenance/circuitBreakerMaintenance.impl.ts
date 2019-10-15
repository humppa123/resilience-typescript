import { AbstractMaintenanceItem } from "./abstractMaintenanceItem";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import { CircuitBreakerState } from "../resilience/circuitBreakerState";
import { CircuitBreakerProxy } from "../resilience/circuitBreakerProxy";
import { ICircuitBreakerMaintenance } from "../contracts/circuitBreakerMaintenance";

/**
 * Maintenance for circuit breakers.
 */
export class CircuitBreakerMaintenance extends AbstractMaintenanceItem implements ICircuitBreakerMaintenance {
    /**
     * Initializes a new instance of the @see CircuitBreakerMaintenance class.
     * @param proxies Proxies to use for maintenance.
     */
    constructor(proxies: IResilienceProxy[]) {
        super(proxies);
    }

    /**
     * Sets a new state for all circuit breakers.
     * @param state New state for the circuit breakers.
     */
    public setState(state: CircuitBreakerState): void {
        for (const proxy of this.proxies) {
            const circuitBreaker = proxy as CircuitBreakerProxy;
            if (circuitBreaker) {
                circuitBreaker.setState(state);
            }
        }
    }

    /**
     * Sets the state to 'open' for all circuit breakers.
     */
    public open(): void {
        this.setState(CircuitBreakerState.Open);
    }

    /**
     * Sets the state to 'close' for all circuit breakers.
     */
    public close(): void {
        this.setState(CircuitBreakerState.Close);
    }

    /**
     * Reset error count to zero.
     */
    public resetErrorCount(): void {
        for (const proxy of this.proxies) {
            const circuitBreaker = proxy as CircuitBreakerProxy;
            if (circuitBreaker) {
                circuitBreaker.bucketClear();
            }
        }
    }
}
