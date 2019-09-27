import axios = require("axios");
import { IAxiosRequestBuilder } from "./axiosRequestBuilder";

/**
 * Builder and executor for web requests with a resilient pipeline.
 */
export interface IResilienceFactoryProxy extends IAxiosRequestBuilder {
    /**
     * Sends the request.
     * @param cacheKey Optional key for the cache.
     * @returns Web response.
     */
    execute<TResult>(cacheKey?: string): Promise<axios.AxiosResponse<TResult>>;
}
