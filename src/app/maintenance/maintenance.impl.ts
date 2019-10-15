import { ICircuitBreakerMaintenance } from "../contracts/circuitBreakerMaintenance";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import { CircuitBreakerMaintenance } from "./circuitBreakerMaintenance.impl";
import { IMaintance } from "../contracts/maintenance";
import { ICacheMaintenance } from "../contracts/cacheMaintenance";
import { MemoryCache } from "../caching/memoryCache";
import axios = require("axios");
import { CacheMaintenance } from "./cacheMaintenance.impl";

/**
 * Maintenance for resilience proxies.
 */
export class Maintenance implements IMaintance {
    /**
     * Gets circuit breaker maintenance.
     */
    private readonly cb: ICircuitBreakerMaintenance;
    /**
     * Gets cache maintenance.
     */
    private readonly c: ICacheMaintenance;

    /**
     * Initializes a new instance of the @see Maintenance class.
     * @param proxies Proxies to use for maintenance.
     * @param cache Cache to use for maintenance.
     */
    constructor(proxies: IResilienceProxy[], cache: MemoryCache<axios.AxiosResponse>) {
        this.cb = new CircuitBreakerMaintenance(proxies);
        this.c = new CacheMaintenance(cache);
    }

    /**
     * Gets circuit breaker maintenance.
     */
    public circuitBreaker(): ICircuitBreakerMaintenance {
        return this.cb;
    }

    /**
     * Gets cache maintanance.
     */
    public cache(): ICacheMaintenance {
        return this.c;
    }
}
