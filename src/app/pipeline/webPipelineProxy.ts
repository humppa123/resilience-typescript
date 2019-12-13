import { Cache } from '../contracts/cache';
import axios = require('axios');
import { TokenCache } from '../contracts/tokenCache';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Guard } from '../utils/guard';
import Axios from 'axios';
import { ResilienceWebProxy } from '../contracts/resilienceWebProxy';
import { Logger } from '../contracts/logger';
import { getUrlFromAxisRequest } from '../logging/utils';
import { logFormatter } from '../resilience/utils';
import { timer } from '../utils/timer';
import { Maintance } from '../contracts/maintenance';
import { Guid } from 'guid-typescript';

/**
 * A web pipeline proxy.
 */
export class WebPipelineProxy implements ResilienceWebProxy {
  /**
   * Gets the item cache.
   */
  private readonly itemCache: Cache<string, axios.AxiosResponse>;
  /**
   * Gets the token cache.
   */
  private readonly tokenCache: TokenCache;
  /**
   * Gets the pipeline.
   */
  private readonly pipeline: ResilienceProxy;
  /**
   * Gets the optional base URL.
   */
  private readonly baseUrl: string;
  /**
   * Gets the logger.
   */
  private readonly logger: Logger<string>;
  /**
   * Gets the maintenance.
   */
  private readonly maint: Maintance;

  /**
   * Initializes a new instance of the @see WebPipelineProxy class.
   * @param pipeline The pipeline to use if any.
   * @param itemCache The item cache to use if any.
   * @param tokenCache The token cache to use if any.
   * @param baseUrl The base URL to use if any.
   * @param logger Logger to use if any.
   * @param maintenance Maintenance for pipepline.
   */
  constructor(
    pipeline: ResilienceProxy = null,
    itemCache: Cache<string, axios.AxiosResponse> = null,
    tokenCache: TokenCache = null,
    baseUrl: string = null,
    logger: Logger<string> = null,
    maintenance: Maintance = null
  ) {
    this.pipeline = pipeline;
    this.tokenCache = tokenCache;
    this.itemCache = itemCache;
    this.baseUrl = baseUrl;
    this.logger = logger;
    this.maint = maintenance;
  }

  /**
   * Sends a web request through the pipeline.
   * @param request Request to send.
   * @param cacheKey Optional cache key.
   * @param requestId Request Guid.
   * @returns Web response.
   */
  async execute<TResult>(
    request: axios.AxiosRequestConfig,
    cacheKey?: string,
    requestId?: Guid
  ): Promise<axios.AxiosResponse<TResult>> {
    Guard.throwIfNullOrEmpty(request, 'request');

    if (this.itemCache) {
      Guard.throwIfNullOrEmpty(cacheKey, 'cacheKey');
    }

    if (this.baseUrl) {
      request.baseURL = this.baseUrl;
    }

    if (!requestId) {
      requestId = Guid.create();
    }

    if (this.tokenCache) {
      const token = await this.tokenCache.getToken(requestId);
      if (request.headers) {
        request.headers.Authorization = `Bearer ${token.accessToken}`;
      } else {
        request.headers = {
          Authorization: `Bearer ${token.accessToken}`,
        };
      }
    }

    let result: axios.AxiosResponse<TResult>;
    if (this.logger) {
      this.logger.information(
        requestId,
        `start ${request.method.toUpperCase()} '${getUrlFromAxisRequest(
          request
        )}'`,
        null,
        logFormatter
      );
    }

    const durationTimer = timer();
    if (this.itemCache && cacheKey && this.pipeline) {
      result = await this.itemCache.execute(
        () => this.pipeline.execute(() => Axios(request), requestId),
        cacheKey
      );
    } else {
      if (this.itemCache && cacheKey && !this.pipeline) {
        result = await this.itemCache.execute(() => Axios(request), cacheKey);
      } else {
        if (this.pipeline) {
          result = await this.pipeline.execute(() => Axios(request), requestId);
        } else {
          result = await Axios(request);
        }
      }
    }

    const milliseconds = durationTimer.milliSeconds;
    if (this.logger) {
      this.logger.information(
        requestId,
        `end ${result.status} in ${milliseconds}ms`,
        null,
        logFormatter
      );
    }

    return result;
  }

  /**
   * Gets the maintenance.
   * @returns Maintenance for the pipeline.
   */
  maintenance(): Maintance {
    Guard.throwIfNullOrEmpty(this.maint, 'this.maint');

    return this.maint;
  }
}
