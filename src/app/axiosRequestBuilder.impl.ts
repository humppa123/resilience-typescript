import { Method, CancelToken, AxiosRequestConfig } from "axios";
import { IAxiosRequestBuilder } from "./contracts/axiosRequestBuilder";

/**
 * An Axios request builder.
 */
export class AxiosRequestBuilder implements IAxiosRequestBuilder {
    /**
     * Gets the headers dictionary.
     */
    private readonly headers: { [id: string]: string; };
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
     * Initializes a new instance of the @see AxiosRequestBuilder class.
     */
    protected constructor() {
        this.headers = {};
        this.url = "";
        this.method = "GET";
        this.body = null;
        this.maxContentLength = 10 * 1024 * 1024; // 10MB
        this.cancelToken = null;
    }

    /**
     * Gets a new builder.
     * @returns The builder.
     */
    public static new(): AxiosRequestBuilder {
        return new AxiosRequestBuilder();
    }

    /**
     * Adds a custom header.
     * @param name Header name.
     * @param value Header value.
     * @returns The builder.
     */
    public addHeader(name: string, value: string): AxiosRequestBuilder {
        this.headers[name] = value;

        return this;
    }

    /**
     * Adds a request body.
     * @param body Request body to add.
     * @returns The builder.
     */
    public withBody(body: any): AxiosRequestBuilder {
        this.body = body;

        return this;
    }

    /**
     * Sets the URL.
     * @param url URL to use.
     * @returns The builder.
     */
    public withUrl(url: string): AxiosRequestBuilder {
        this.url = url;

        return this;
    }

    /**
     * Sets the maximum content length for the request.
     * @param value Maximum content length.
     * @returns The builder.
     */
    public withMaxContentLength(value: number): AxiosRequestBuilder {
        this.maxContentLength = value;

        return this;
    }

    /**
     * Sets a cancel token for the request.
     * @param value Cancel token to use.
     * @returns The builder.
     */
    public withCancelToken(value: CancelToken): AxiosRequestBuilder {
        this.cancelToken = value;

        return this;
    }

    /**
     * Sends a DELETE request.
     * @param url Optional URL to use.
     * @returns The builder.
     */
    public delete(url: string = null): AxiosRequestBuilder {
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
    public get(url: string = null): AxiosRequestBuilder {
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
    public head(url: string = null): AxiosRequestBuilder {
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
    public options(url: string = null): AxiosRequestBuilder {
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
    public patch(url: string = null): AxiosRequestBuilder {
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
    public post(url: string = null): AxiosRequestBuilder {
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
    public put(url: string = null): AxiosRequestBuilder {
        this.method = "PUT";
        if (url) {
            this.url = url;
        }

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

        return result;
    }
}
