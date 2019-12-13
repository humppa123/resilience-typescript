import { CancelToken, ResponseType } from 'axios';

/**
 * An Axios request builder.
 */
export interface AxiosWebRequestBuilder<TRequestBody> {
  /**
   * Adds a custom header.
   * @param name Header name.
   * @param value Header value.
   * @returns The builder.
   */
  addHeader(name: string, value: string): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Adds a request body.
   * @param body Request body to add.
   * @returns The builder.
   */
  withBody(body: TRequestBody): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sets the URL.
   * @param url URL to use.
   * @returns The builder.
   */
  withUrl(url: string): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sets the maximum content length for the request.
   * @param value Maximum content length.
   * @returns The builder.
   */
  withMaxContentLength(value: number): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sets a cancel token for the request.
   * @param value Cancel token to use.
   * @returns The builder.
   */
  withCancelToken(value: CancelToken): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a DELETE request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  delete(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a GET request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  get(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a HEAD request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  head(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends an OPTIONS request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  options(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a PATCH request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  patch(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a POST request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  post(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sends a PUT request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  put(url?): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Sets a response type.
   * @param value Value to set.
   * @returns The builder.
   */
  withResponseType(value: ResponseType): AxiosWebRequestBuilder<TRequestBody>;

  /**
   * Adds a query parameter to the request.
   * @param name Name of the query paramter.
   * @param value Value of the query parameter.
   * @returns The builder.
   */
  addQueryParameter(
    name: string,
    value: string
  ): AxiosWebRequestBuilder<TRequestBody>;
}
