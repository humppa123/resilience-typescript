import { WebPipelineProxy } from './webPipelineProxy';
import axios = require('axios');
import { AxiosRequestBuilder } from '../axiosRequestBuilder';
import { Guard } from '../utils/guard';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Cache } from '../contracts/cache';
import { TokenCache } from '../contracts/tokenCache';
import { ResilienceCrudWebProxy } from '../contracts/resilienceCrudWebProxy';
import { Logger } from '../contracts/logger';
import { Maintance } from '../contracts/maintenance';

/**
 * A basic CRUD web pipeline proxy.
 */
export class CrudWebPipelineProxy<T> extends WebPipelineProxy
  implements ResilienceCrudWebProxy<T> {
  /**
   * Initializes a new instance of the @see CrudWebPipelineProxy class.
   * @param pipeline Pipeline to use if any.
   * @param itemCache Item cache to use if any.
   * @param tokenCache Token cache to use if any.
   * @param baseUrl Base URL to use. Must be set.
   * @param logger Logger to use if any.
   * @param maintenance Maintenance to use if any.
   */
  constructor(
    pipeline: ResilienceProxy = null,
    itemCache: Cache<string, axios.AxiosResponse> = null,
    tokenCache: TokenCache = null,
    baseUrl: string = null,
    logger: Logger<string> = null,
    maintenance: Maintance = null
  ) {
    Guard.throwIfNullOrEmpty(baseUrl, 'baseUrl');
    super(pipeline, itemCache, tokenCache, baseUrl, logger, maintenance);
  }

  /**
   * Adds a new item.
   * @param item Item to add.
   * @returns Web response.
   */
  async add(item: T): Promise<axios.AxiosResponse<T>> {
    const request = AxiosRequestBuilder.new<T>()
      .post()
      .withBody(item)
      .build();
    return this.execute<T>(request);
  }

  /**
   * Deletes an item.
   * @param id Id of item to delete.
   * @returns Web response.
   */
  async delete(id: string): Promise<axios.AxiosResponse> {
    Guard.throwIfNullOrEmpty(id, 'id');
    const request = AxiosRequestBuilder.new<T>()
      .delete(`/${id}`)
      .build();
    return this.execute(request);
  }

  /**
   * Gets an item by its Id.
   * @param id Id of item to get.
   * @param cacheKey Optional cache key for item.
   * @returns Web response.
   */
  async get(id: string, cacheKey?: string): Promise<axios.AxiosResponse<T>> {
    Guard.throwIfNullOrEmpty(id, 'id');
    const request = AxiosRequestBuilder.new<T>()
      .get(`/${id}`)
      .build();
    return this.execute<T>(request, cacheKey);
  }

  /**
   * Gets all items.
   * @param cacheKey Optional cache key for items.
   * @returns Web response.
   */
  async list(cacheKey?: string): Promise<axios.AxiosResponse<T[]>> {
    const request = AxiosRequestBuilder.new<T>()
      .get()
      .build();
    return this.execute<T[]>(request, cacheKey);
  }

  /**
   * Updates an item.
   * @param id Id of item to update.
   * @param item Item to update.
   * @returns Web response.
   */
  async update(id: string, item: T): Promise<axios.AxiosResponse<T>> {
    Guard.throwIfNullOrEmpty(id, 'id');
    const request = AxiosRequestBuilder.new<T>()
      .put(`/${id}`)
      .withBody(item)
      .build();
    return this.execute<T>(request);
  }
}
