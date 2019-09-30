import { ICache } from "../contracts/cache";
import axios = require("axios");
import { ITokenCache } from "../contracts/tokenCache";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import Axios from "axios";
import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";
import { ILogger } from "../contracts/logger";
import { getUrlFromAxisRequest } from "../logging/utils";
import { logFormatter } from "../resilience/utils";
import { timer } from "../utils/timer";

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
     * Gets the logger.
     */
    private readonly logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see WebPipelineProxy class.
     * @param pipeline The pipeline to use if any.
     * @param itemCache The item cache to use if any.
     * @param tokenCache The token cache to use if any.
     * @param baseUrl The base URL to use if any.
     * @param logger Logger to use if any.
     */
    constructor(pipeline: IResilienceProxy = null, itemCache: ICache<string, axios.AxiosResponse> = null, tokenCache: ITokenCache = null, baseUrl: string = null, logger: ILogger<string> = null) {
        this.pipeline = pipeline;
        this.tokenCache = tokenCache;
        this.itemCache = itemCache;
        this.baseUrl = baseUrl;
        this.logger = logger;
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
        if (this.logger) {
            this.logger.debug(`Requesting '${getUrlFromAxisRequest(request)}'`, null, logFormatter);
        }

        const durationTimer = timer();
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

        const milliseconds = durationTimer.milliSeconds;
        if (this.logger) {
            this.logger.debug(`Request '${getUrlFromAxisRequest(request)}' finished within ${milliseconds}ms`, null, logFormatter);
        }

        return result;
    }
}
