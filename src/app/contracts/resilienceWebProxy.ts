import axios = require('axios');
import { Maintance } from './maintenance';
import { Guid } from 'guid-typescript';

/**
 * A proxy for a cached web resiliency operation.
 */
export interface ResilienceWebProxy {
  /**
   * Executes a function within a web resilience proxy. Uses optionally a cache.
   * @param request Web request to send.
   * @param cacheKey Key for the cache if enabled.
   * @param requestId Request Guid.
   * @returns The result of the executed function.
   */
  execute<TResult>(
    request: axios.AxiosRequestConfig,
    cacheKey?: string,
    requestId?: Guid
  ): Promise<axios.AxiosResponse<TResult>>;

  /**
   * Gets the maintenance.
   * @returns Maintenance for the pipeline.
   */
  maintenance(): Maintance;
}
