import { AxiosRequestBuilder } from "../axiosRequestBuilder.impl";
import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";
import { Guard } from "../utils/guard";
import axios = require("axios");
import { IResilienceFactoryProxy } from "../contracts/resilienceFactoryProxy";
import { CancelToken, Method, AxiosRequestConfig, ResponseType } from "axios";

/**
 * An Axios request builder with a pipeline.
 */
export class AxiosRequestBuilderWithPipeline implements IResilienceFactoryProxy {
    /**
     * Gets the headers dictionary.
     */
    private readonly headers: { [id: string]: string; };
    /**
     * Gets the params.
     */
    private readonly params: { [name: string]: string};
    /**
     * Gets or sets the pipeline.
     */
    private pipeline: IResilienceWebProxy;
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
    private body: any;
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
        this.url = "";
        this.method = "GET";
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
    public static new(): AxiosRequestBuilderWithPipeline {
        return new AxiosRequestBuilderWithPipeline();
    }

    /**
     * Uses a pipeline.
     * @param pipeline Pipeline to use.
     * @returns The builder.
     */
    public usePipeline(pipeline: IResilienceWebProxy): AxiosRequestBuilderWithPipeline {
        Guard.throwIfNullOrEmpty(pipeline, "pipeline");

        this.pipeline = pipeline;

        return this;
    }

    /**
     * Sends the request.
     * @param cacheKey Optional key for the cache.
     * @returns Web response.
     */
    public async execute<TResult>(cacheKey?: string): Promise<axios.AxiosResponse<TResult>> {
        const request = this.build();
        const result = await this.pipeline.execute<TResult>(request, cacheKey);
        return result;
    }

    /**
     * Adds a custom header.
     * @param name Header name.
     * @param value Header value.
     * @returns The builder.
     */
    public addHeader(name: string, value: string): IResilienceFactoryProxy {
        this.headers[name] = value;

        return this;
    }

    /**
     * Adds a request body.
     * @param body Request body to add.
     * @returns The builder.
     */
    public withBody(body: any): IResilienceFactoryProxy {
        this.body = body;

        return this;
    }

    /**
     * Sets the URL.
     * @param url URL to use.
     * @returns The builder.
     */
    public withUrl(url: string): IResilienceFactoryProxy {
        this.url = url;

        return this;
    }

    /**
     * Sets the maximum content length for the request.
     * @param value Maximum content length.
     * @returns The builder.
     */
    public withMaxContentLength(value: number): IResilienceFactoryProxy {
        this.maxContentLength = value;

        return this;
    }

    /**
     * Sets a cancel token for the request.
     * @param value Cancel token to use.
     * @returns The builder.
     */
    public withCancelToken(value: CancelToken): IResilienceFactoryProxy {
        this.cancelToken = value;

        return this;
    }

    /**
     * Sends a DELETE request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    public delete(url: string = null): IResilienceFactoryProxy {
        this.method = "DELETE";
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
    public get(url: string = null): IResilienceFactoryProxy {
        this.method = "GET";
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
    public head(url: string = null): IResilienceFactoryProxy {
        this.method = "HEAD";
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
    public options(url: string = null): IResilienceFactoryProxy {
        this.method = "OPTIONS";
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
    public patch(url: string = null): IResilienceFactoryProxy {
        this.method = "PATCH";
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
    public post(url: string = null): IResilienceFactoryProxy {
        this.method = "POST";
        if (url) {
            this.url = url;
        }

        this.headers["Content-Type"] = "application/json";
        return this;
    }

    /**
     * Sends a PUT request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    public put(url: string = null): IResilienceFactoryProxy {
        this.method = "PUT";
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
    public withResponseType(value: ResponseType): IResilienceFactoryProxy {
        this.responseType = value;

        return this;
    }

    /**
     * Adds a query parameter to the request.
     * @param name Name of the query paramter.
     * @param value Value of the query parameter.
     * @returns The builder.
     */
    public addQueryParameter(name: string, value: string): IResilienceFactoryProxy {
        Guard.throwIfNullOrEmpty(name, "name");
        Guard.throwIfNullOrEmpty(value, "value");

        this.params[name] = value;

        return this;
    }

    /**
     * Builds the request.
     * @returns Axios request configuration.
     */
    public build(): AxiosRequestConfig {
        const result = { } as AxiosRequestConfig;

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
