import { WebPipelineProxy } from "./webPipelineProxy";
import axios = require("axios");
import { AxiosRequestBuilder } from "../axiosRequestBuilder.impl";
import { Guard } from "../utils/guard";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { ICache } from "../contracts/cache";
import { ITokenCache } from "../contracts/tokenCache";
import { IResilienceCrudWebProxy } from "../contracts/resilienceCrudWebProxy";
import { ConsoleLogger } from "../logging/consoleLogger";
import { ILogger } from "../contracts/logger";

/**
 * A basic CRUD web pipeline proxy.
 */
export class CrudWebPipelineProxy<T> extends WebPipelineProxy implements IResilienceCrudWebProxy<T> {
    /**
     * Initializes a new instance of the @see CrudWebPipelineProxy class.
     * @param pipeline Pipeline to use if any.
     * @param itemCache Item cache to use if any.
     * @param tokenCache Token cache to use if any.
     * @param baseUrl Base URL to use. Must be set.
     * @param logger Logger to use if any.
     */
    constructor(pipeline: IResilienceProxy = null, itemCache: ICache<string, axios.AxiosResponse> = null, tokenCache: ITokenCache = null, baseUrl: string = null, logger: ILogger<string> = null) {
        Guard.throwIfNullOrEmpty(baseUrl, "baseUrl");
        super(pipeline, itemCache, tokenCache, baseUrl, logger);
    }

    /**
     * Adds a new item.
     * @param item Item to add.
     * @returns Web response.
     */
    public async add(item: T): Promise<axios.AxiosResponse<T>> {
        const request = AxiosRequestBuilder
            .new()
            .post()
            .withBody(item)
            .build();
        return await this.execute<T>(request);
    }

    /**
     * Deletes an item.
     * @param id Id of item to delete.
     * @returns Web response.
     */
    public async delete(id: string): Promise<axios.AxiosResponse> {
        Guard.throwIfNullOrEmpty(id, "id");
        const request = AxiosRequestBuilder
            .new()
            .delete(`/${id}`)
            .build();
        return await this.execute<any>(request);
    }

    /**
     * Gets an item by its Id.
     * @param id Id of item to get.
     * @param cacheKey Optional cache key for item.
     * @returns Web response.
     */
    public async get(id: string, cacheKey?: string): Promise<axios.AxiosResponse<T>> {
        Guard.throwIfNullOrEmpty(id, "id");
        const request = AxiosRequestBuilder
            .new()
            .get(`/${id}`)
            .build();
        return await this.execute<T>(request, cacheKey);
    }

    /**
     * Gets all items.
     * @param cacheKey Optional cache key for items.
     * @returns Web response.
     */
    public async list(cacheKey?: string): Promise<axios.AxiosResponse<T[]>> {
        const request = AxiosRequestBuilder
            .new()
            .get()
            .build();
        return await this.execute<T[]>(request, cacheKey);
    }

    /**
     * Updates an item.
     * @param id Id of item to update.
     * @param item Item to update.
     * @returns Web response.
     */
    public async update(id: string, item: T): Promise<axios.AxiosResponse<T>> {
        Guard.throwIfNullOrEmpty(id, "id");
        const request = AxiosRequestBuilder
            .new()
            .put(`/${id}`)
            .withBody(item)
            .build();
        return await this.execute<T>(request);
    }
}
