import { CircuitBreakerMaintenance } from '../contracts/circuitBreakerMaintenance';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { DefaultCircuitBreakerMaintenance } from './defaultCircuitBreakerMaintenance';
import { Maintance } from '../contracts/maintenance';
import { CacheMaintenance } from '../contracts/cacheMaintenance';
import { MemoryCache } from '../caching/memoryCache';
import axios = require('axios');
import { DefaultCacheMaintenance } from './defaultCacheMaintenance';

/**
 * Maintenance for resilience proxies.
 */
export class DefaultMaintenance implements Maintance {
  /**
   * Gets circuit breaker maintenance.
   */
  private readonly cb: CircuitBreakerMaintenance;
  /**
   * Gets cache maintenance.
   */
  private readonly c: CacheMaintenance;

  /**
   * Initializes a new instance of the @see Maintenance class.
   * @param proxies Proxies to use for maintenance.
   * @param cache Cache to use for maintenance.
   */
  constructor(
    proxies: ResilienceProxy[],
    cache: MemoryCache<axios.AxiosResponse>
  ) {
    this.cb = new DefaultCircuitBreakerMaintenance(proxies);
    this.c = new DefaultCacheMaintenance(cache);
  }

  /**
   * Gets circuit breaker maintenance.
   */
  circuitBreaker(): CircuitBreakerMaintenance {
    return this.cb;
  }

  /**
   * Gets cache maintanance.
   */
  cache(): CacheMaintenance {
    return this.c;
  }
}
