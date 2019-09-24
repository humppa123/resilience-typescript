import { Method, CancelToken, AxiosRequestConfig } from "axios";

export class AxiosRequestBuilder {
    private readonly headers: { [id: string]: string; };
    private url: string;
    private method: Method;
    private body: any;
    private maxContentLength: number;
    private cancelToken: CancelToken;

    constructor() {
        this.headers = {};
        this.url = "";
        this.method = "GET";
        this.body = null;
        this.maxContentLength = null;
        this.cancelToken = null;
    }

    public addHeader(key: string, value: string) {
        this.headers[key] = value;
    }

    public withBody(body: any): AxiosRequestBuilder {
        this.body = body;

        return this;
    }

    public withUrl(url: string): AxiosRequestBuilder {
        this.url = url;

        return this;
    }

    public withMaxContentLength(value: number): AxiosRequestBuilder {
        this.maxContentLength = value;

        return this;
    }

    public withCancelToken(value: CancelToken): AxiosRequestBuilder {
        this.cancelToken = value;

        return this;
    }

    public delete(url: string = null): AxiosRequestBuilder {
        this.method = "DELETE";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public get(url: string = null): AxiosRequestBuilder {
        this.method = "GET";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public head(url: string = null): AxiosRequestBuilder {
        this.method = "HEAD";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public options(url: string = null): AxiosRequestBuilder {
        this.method = "OPTIONS";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public patch(url: string = null): AxiosRequestBuilder {
        this.method = "PATCH";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public post(url: string = null): AxiosRequestBuilder {
        this.method = "POST";
        if (url) {
            this.url = url;
        }

        return this;
    }

    public put(url: string = null): AxiosRequestBuilder {
        this.method = "PUT";
        if (url) {
            this.url = url;
        }

        return this;
    }

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
