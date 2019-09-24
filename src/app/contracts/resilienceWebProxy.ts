import axios = require("axios");

/**
 * A proxy for a cached web resiliency operation.
 */
export interface IResilienceWebProxy {
    /**
     * Executes a function within a web resilience proxy. Uses optionally a cache.
     * @param request Web request to send.
     * @param cacheKey Key for the cache if enabled.
     * @returns The result of the executed function.
     */
    execute<TResult>(request: axios.AxiosRequestConfig, cacheKey?: string): Promise<axios.AxiosResponse<TResult>>
}
