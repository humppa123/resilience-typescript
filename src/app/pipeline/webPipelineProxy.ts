import { ICache } from "../contracts/cache";
import axios = require("axios");
import { ITokenCache } from "../contracts/tokenCache";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import Axios from "axios";
import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";

export class WebPipelineProxy implements IResilienceWebProxy {
    private readonly itemCache: ICache<string, axios.AxiosResponse>;
    private readonly tokenCache: ITokenCache;
    private readonly pipeline: IResilienceProxy;
    private readonly baseUrl: string;

    constructor(pipeline: IResilienceProxy = null, itemCache: ICache<string, axios.AxiosResponse> = null, tokenCache: ITokenCache = null, baseUrl: string = null) {
        this.pipeline = pipeline;
        this.tokenCache = tokenCache;
        this.itemCache = itemCache;
        this.baseUrl = baseUrl;
    }

    public async execute<TResult>(request: axios.AxiosRequestConfig, cacheKey?: string): Promise<axios.AxiosResponse<TResult>> {
        Guard.throwIfNullOrEmpty(request, "request");

        if (this.itemCache) {
            Guard.throwIfNullOrEmpty(cacheKey, "cacheKey");
        }

        if (this.baseUrl) {
            request.baseURL = this.baseUrl;
        }

        if (this.tokenCache) {
            const token = await this.tokenCache.getToken();
            if (request.headers) {
                request.headers.Authorization = `Bearer ${token.accessToken}`;
            } else {
                request.headers = { Authorization: `Bearer ${token.accessToken}`};
            }
        }

        let result: axios.AxiosResponse<TResult>;
        if (this.itemCache && this.pipeline) {
            result = await this.itemCache.execute(() => this.pipeline.execute(() => Axios(request)), cacheKey);
        } else {
            if (this.itemCache && !this.pipeline) {
                result = await this.itemCache.execute(() => Axios(request), cacheKey);
            } else {
                if (!this.itemCache && this.pipeline) {
                    result = await this.pipeline.execute(() => Axios(request));
                } else {
                    result = await Axios(request);
                }
            }
        }

        return result;
    }
}
