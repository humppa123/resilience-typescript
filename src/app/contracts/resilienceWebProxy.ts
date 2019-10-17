import axios = require("axios");
import { IMaintance } from "./maintenance";
import { Guid } from "guid-typescript";

/**
 * A proxy for a cached web resiliency operation.
 */
export interface IResilienceWebProxy {
    /**
     * Executes a function within a web resilience proxy. Uses optionally a cache.
     * @param request Web request to send.
     * @param cacheKey Key for the cache if enabled.
     * @param guid Request Guid.
     * @returns The result of the executed function.
     */
    execute<TResult>(request: axios.AxiosRequestConfig, cacheKey?: string, guid?: Guid): Promise<axios.AxiosResponse<TResult>>;

    /**
     * Gets the maintenance.
     * @returns Maintenance for the pipeline.
     */
    maintenance(): IMaintance;
}
