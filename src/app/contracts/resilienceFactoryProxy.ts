import axios = require('axios');
import { CancelToken, ResponseType } from 'axios';
import { Guid } from 'guid-typescript';

/**
 * Builder and executor for web requests with a resilient pipeline.
 */
export interface ResilienceFactoryProxy<TRequestBody> {
  /**
   * Sends the request.
   * @param cacheKey Optional key for the cache.
   * @returns Web response.
   */
  execute<TResult>(cacheKey?: string): Promise<axios.AxiosResponse<TResult>>;

  /**
   * Adds a custom header.
   * @param name Header name.
   * @param value Header value.
   * @returns The builder.
   */
  addHeader(name: string, value: string): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Uses a custom request Guid for request logging.
   * @param requestId Guid to use.
   */
  withRequestGuid(requestId: Guid): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Adds a request body.
   * @param body Request body to add.
   * @returns The builder.
   */
  withBody(body: TRequestBody): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sets the URL.
   * @param url URL to use.
   * @returns The builder.
   */
  withUrl(url: string): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sets the maximum content length for the request.
   * @param value Maximum content length.
   * @returns The builder.
   */
  withMaxContentLength(value: number): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sets a cancel token for the request.
   * @param value Cancel token to use.
   * @returns The builder.
   */
  withCancelToken(value: CancelToken): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a DELETE request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  delete(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a GET request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  get(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a HEAD request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  head(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends an OPTIONS request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  options(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a PATCH request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  patch(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a POST request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  post(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sends a PUT request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  put(url?): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Sets a response type.
   * @param value Value to set.
   * @returns The builder.
   */
  withResponseType(value: ResponseType): ResilienceFactoryProxy<TRequestBody>;

  /**
   * Adds a query parameter to the request.
   * @param name Name of the query paramter.
   * @param value Value of the query parameter.
   * @returns The builder.
   */
  addQueryParameter(
    name: string,
    value: string
  ): ResilienceFactoryProxy<TRequestBody>;
}
