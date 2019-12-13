import { Method, CancelToken, AxiosRequestConfig, ResponseType } from 'axios';
import { AxiosWebRequestBuilder } from './contracts/axiosWebRequestBuilder';
import { Guard } from './utils/guard';

/**
 * An Axios request builder.
 */
export class AxiosRequestBuilder<TRequestBody>
  implements AxiosWebRequestBuilder<TRequestBody> {
  /**
   * Gets the headers dictionary.
   */
  private readonly headers: { [id: string]: string };
  /**
   * Gets the params.
   */
  private readonly params: { [name: string]: string };
  /**
   * Gets or sets the URL.
   */
  private url: string;
  /**
   * Gets or sets the HTTP method / verb.
   */
  private method: Method;
  /**
   * Gets or sets the body to send.
   */
  private body: TRequestBody;
  /**
   * Gets or sets the max content length.
   */
  private maxContentLength: number;
  /**
   * Gets or sets the cancel token.
   */
  private cancelToken: CancelToken;
  /**
   * Gets or sets the response type.
   */
  private responseType?: ResponseType;

  /**
   * Initializes a new instance of the @see AxiosRequestBuilder class.
   */
  protected constructor() {
    this.headers = {};
    this.url = '';
    this.method = 'GET';
    this.body = null;
    this.maxContentLength = 10 * 1024 * 1024; // 10MB
    this.cancelToken = null;
    this.responseType = null;
    this.params = {};
  }

  /**
   * Gets a new builder.
   * @returns The builder.
   */
  static new<TRequestBody>(): AxiosRequestBuilder<TRequestBody> {
    return new AxiosRequestBuilder();
  }

  /**
   * Adds a custom header.
   * @param name Header name.
   * @param value Header value.
   * @returns The builder.
   */
  addHeader(name: string, value: string): AxiosRequestBuilder<TRequestBody> {
    this.headers[name] = value;

    return this;
  }

  /**
   * Adds a request body.
   * @param body Request body to add.
   * @returns The builder.
   */
  withBody(body: TRequestBody): AxiosRequestBuilder<TRequestBody> {
    this.body = body;

    return this;
  }

  /**
   * Sets the URL.
   * @param url URL to use.
   * @returns The builder.
   */
  withUrl(url: string): AxiosRequestBuilder<TRequestBody> {
    this.url = url;

    return this;
  }

  /**
   * Sets the maximum content length for the request.
   * @param value Maximum content length.
   * @returns The builder.
   */
  withMaxContentLength(value: number): AxiosRequestBuilder<TRequestBody> {
    this.maxContentLength = value;

    return this;
  }

  /**
   * Sets a cancel token for the request.
   * @param value Cancel token to use.
   * @returns The builder.
   */
  withCancelToken(value: CancelToken): AxiosRequestBuilder<TRequestBody> {
    this.cancelToken = value;

    return this;
  }

  /**
   * Sends a DELETE request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  delete(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'DELETE';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sends a GET request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  get(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'GET';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sends a HEAD request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  head(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'HEAD';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sends an OPTIONS request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  options(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'OPTIONS';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sends a PATCH request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  patch(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'PATCH';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sends a POST request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  post(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'POST';
    if (url) {
      this.url = url;
    }

    this.headers['Content-Type'] = 'application/json';
    return this;
  }

  /**
   * Sends a PUT request.
   * @param url Optional URL to use.
   * @returns The builder.
   */
  put(url: string = null): AxiosRequestBuilder<TRequestBody> {
    this.method = 'PUT';
    if (url) {
      this.url = url;
    }

    return this;
  }

  /**
   * Sets a response type.
   * @param value Value to set.
   * @returns The builder.
   */
  withResponseType(value: ResponseType): AxiosRequestBuilder<TRequestBody> {
    this.responseType = value;

    return this;
  }

  /**
   * Adds a query parameter to the request.
   * @param name Name of the query paramter.
   * @param value Value of the query parameter.
   * @returns The builder.
   */
  addQueryParameter(
    name: string,
    value: string
  ): AxiosRequestBuilder<TRequestBody> {
    Guard.throwIfNullOrEmpty(name, 'name');
    Guard.throwIfNullOrEmpty(value, 'value');

    this.params[name] = value;

    return this;
  }

  /**
   * Builds the request.
   * @returns Axios request configuration.
   */
  build(): AxiosRequestConfig {
    const result = {} as AxiosRequestConfig;

    result.cancelToken = this.cancelToken;
    result.data = this.body;
    result.headers = this.headers;
    result.maxContentLength = this.maxContentLength;
    result.method = this.method;
    result.url = this.url;
    result.responseType = this.responseType;
    if (Object.keys(this.params).length > 0) {
      result.params = this.params;
    }

    return result;
  }
}
