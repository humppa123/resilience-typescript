import { ICache } from "../contracts/cache";
import axios = require("axios");
import { ITokenCache } from "../contracts/tokenCache";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import Axios from "axios";
import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";

/**
 * A web pipeline proxy.
 */
export class WebPipelineProxy implements IResilienceWebProxy {
    /**
     * Gets the item cache.
     */
    private readonly itemCache: ICache<string, axios.AxiosResponse>;
    /**
     * Gets the token cache.
     */
    private readonly tokenCache: ITokenCache;
    /**
     * Gets the pipeline.
     */
    private readonly pipeline: IResilienceProxy;
    /**
     * Gets the optional base URL.
     */
    private readonly baseUrl: string;

    /**
     * Initializes a new instance of the @see WebPipelineProxy class.
     * @param pipeline The pipeline to use if any.
     * @param itemCache The item cache to use if any.
     * @param tokenCache The token cache to use if any.
     * @param baseUrl The base URL to use if any.
     */
    constructor(pipeline: IResilienceProxy = null, itemCache: ICache<string, axios.AxiosResponse> = null, tokenCache: ITokenCache = null, baseUrl: string = null) {
        this.pipeline = pipeline;
        this.tokenCache = tokenCache;
        this.itemCache = itemCache;
        this.baseUrl = baseUrl;
    }

    /**
     * Sends a web request through the pipeline.
     * @param request Request to send.
     * @param cacheKey Optional cache key.
     * @returns Web response.
     */
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
        if ((this.itemCache && cacheKey) && this.pipeline) {
            result = await this.itemCache.execute(() => this.pipeline.execute(() => Axios(request)), cacheKey);
        } else {
            if ((this.itemCache && cacheKey) && !this.pipeline) {
                result = await this.itemCache.execute(() => Axios(request), cacheKey);
            } else {
                if (this.pipeline) {
                    result = await this.pipeline.execute(() => Axios(request));
                } else {
                    result = await Axios(request);
                }
            }
        }

        return result;
    }
}
