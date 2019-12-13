import axios = require('axios');
import { Maintance } from './maintenance';

/**
 * A basic CRUD web resilience proxy.
 */
export interface ResilienceCrudWebProxy<T> {
  /**
   * Adds a new item.
   * @param item Item to add.
   * @returns Web response.
   */
  add(item: T): Promise<axios.AxiosResponse<T>>;

  /**
   * Deletes an item.
   * @param id Id of item to delete.
   * @returns Web response.
   */
  delete(id: string): Promise<axios.AxiosResponse>;

  /**
   * Gets an item by its Id.
   * @param id Id of item to get.
   * @param cacheKey Optional cache key for item.
   * @returns Web response.
   */
  get(id: string, cacheKey?: string): Promise<axios.AxiosResponse<T>>;

  /**
   * Gets all items.
   * @param cacheKey Optional cache key for items.
   * @returns Web response.
   */
  list(cacheKey?: string): Promise<axios.AxiosResponse<T[]>>;

  /**
   * Updates an item.
   * @param id Id of item to update.
   * @param item Item to update.
   * @returns Web response.
   */
  update(id: string, item: T): Promise<axios.AxiosResponse<T>>;

  /**
   * Gets the maintenance.
   * @returns Maintenance for the pipeline.
   */
  maintenance(): Maintance;
}
