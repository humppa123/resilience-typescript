import { CancelToken } from "axios";

/**
 * An Axios request builder.
 */
export interface IAxiosRequestBuilder {
    /**
     * Adds a custom header.
     * @param name Header name.
     * @param value Header value.
     * @returns The builder.
     */
    addHeader(name: string, value: string): IAxiosRequestBuilder;

    /**
     * Adds a request body.
     * @param body Request body to add.
     * @returns The builder.
     */
    withBody(body: any): IAxiosRequestBuilder;

    /**
     * Sets the URL.
     * @param url URL to use.
     * @returns The builder.
     */
    withUrl(url: string): IAxiosRequestBuilder;

    /**
     * Sets the maximum content length for the request.
     * @param value Maximum content length.
     * @returns The builder.
     */
    withMaxContentLength(value: number): IAxiosRequestBuilder;

    /**
     * Sets a cancel token for the request.
     * @param value Cancel token to use.
     * @returns The builder.
     */
    withCancelToken(value: CancelToken): IAxiosRequestBuilder;

    /**
     * Sends a DELETE request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    delete(url?): IAxiosRequestBuilder;

    /**
     * Sends a GET request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    get(url?): IAxiosRequestBuilder;

    /**
     * Sends a HEAD request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    head(url?): IAxiosRequestBuilder;

    /**
     * Sends an OPTIONS request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    options(url?): IAxiosRequestBuilder;

    /**
     * Sends a PATCH request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    patch(url?): IAxiosRequestBuilder;

    /**
     * Sends a POST request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    post(url?): IAxiosRequestBuilder;

    /**
     * Sends a PUT request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    put(url?): IAxiosRequestBuilder;
}
