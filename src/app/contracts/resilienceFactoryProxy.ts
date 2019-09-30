import axios = require("axios");
import { IAxiosRequestBuilder } from "./axiosRequestBuilder";
import { CancelToken, ResponseType } from "axios";

/**
 * Builder and executor for web requests with a resilient pipeline.
 */
export interface IResilienceFactoryProxy {
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
    addHeader(name: string, value: string): IResilienceFactoryProxy;

    /**
     * Adds a request body.
     * @param body Request body to add.
     * @returns The builder.
     */
    withBody(body: any): IResilienceFactoryProxy;

    /**
     * Sets the URL.
     * @param url URL to use.
     * @returns The builder.
     */
    withUrl(url: string): IResilienceFactoryProxy;

    /**
     * Sets the maximum content length for the request.
     * @param value Maximum content length.
     * @returns The builder.
     */
    withMaxContentLength(value: number): IResilienceFactoryProxy;

    /**
     * Sets a cancel token for the request.
     * @param value Cancel token to use.
     * @returns The builder.
     */
    withCancelToken(value: CancelToken): IResilienceFactoryProxy;

    /**
     * Sends a DELETE request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    delete(url?): IResilienceFactoryProxy;

    /**
     * Sends a GET request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    get(url?): IResilienceFactoryProxy;

    /**
     * Sends a HEAD request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    head(url?): IResilienceFactoryProxy;

    /**
     * Sends an OPTIONS request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    options(url?): IResilienceFactoryProxy;

    /**
     * Sends a PATCH request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    patch(url?): IResilienceFactoryProxy;

    /**
     * Sends a POST request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    post(url?): IResilienceFactoryProxy;

    /**
     * Sends a PUT request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    put(url?): IResilienceFactoryProxy;

    /**
     * Sets a response type.
     * @param value Value to set.
     * @returns The builder.
     */
    withResponseType(value: ResponseType): IResilienceFactoryProxy;

    /**
     * Adds a query parameter to the request.
     * @param name Name of the query paramter.
     * @param value Value of the query parameter.
     * @returns The builder.
     */
    addQueryParameter(name: string, value: string): IResilienceFactoryProxy;
}
