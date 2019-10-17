import { ResilientPipelineBuilder } from "./resilientPipelineBuilder";
import { Guard } from "./utils/guard";
import { CircuitBreakerState } from "./resilience/circuitBreakerState";
import { ILogger } from "./contracts/logger";
import { ICache } from "./contracts/cache";
import axios = require("axios");
import { MemoryCache } from "./caching/memoryCache";
import { NoLogger } from "./logging/noLogger";
import { IResilienceWebProxy } from "./contracts/resilienceWebProxy";
import { IResilienceProxy } from "./contracts/resilienceProxy";
import { WebPipelineProxy } from "./pipeline/webPipelineProxy";
import { ArgumentError } from "./utils/argumentError";
import { ITokenCache } from "./contracts/tokenCache";
import { AzureActiveDirectoryAppRegistrationTokenProvider } from "./tokenCache/azureAdAppRegistrationTokenProvider";
import { DefaultTokenCache } from "./tokenCache/defaultTokenCache";
import { IResilienceCrudWebProxy } from "./contracts/resilienceCrudWebProxy";
import { CrudWebPipelineProxy } from "./pipeline/crudWebPipelineProxy";
import { FactoryWebPipelineProxy } from "./pipeline/factoryWebPipelineProxy";
import { MultiLogger } from "./logging/multiLogger";
import { LogLevel } from "./logging/logLevel";
import { ConsoleLogger } from "./logging/consoleLogger";
import { AppInsightsLogger } from "./logging/appInsightsLogger";
import { ICacheMaintenance } from "./contracts/cacheMaintenance";
import { CacheMaintenance } from "./maintenance/cacheMaintenance.impl";
import { PipelineProxy } from "./pipeline/pipelineProxy";
import { Maintenance } from "./maintenance/maintenance.impl";
import { IMaintance } from "./contracts/maintenance";

/**
 * A builder to create a resilient web pipeline.
 */
export class ResilientWebPipelineBuilder {
    /**
     * Gets the builder for the pipeline.
     */
    private readonly pipelineBuilder: ResilientPipelineBuilder;
    /**
     * Gets or sets a value indicating whether should build the pipeline.
     */
    private buildPipeline: boolean;
    /**
     * Gets or sets the base URL for every web request.
     */
    private baseUrl: string;
    /**
     * Gets or sets a value indicating whether should build memory cache or use a custom cache.
     */
    private buildMemoryCache: boolean;
    /**
     * Gets or sets a custom cache to use.
     */
    private customCache: ICache<string, axios.AxiosResponse>;
    /**
     * Gets or sets a value in milli seconds how long a value is valid in the cache.
     */
    private memoryCacheExpirationTimespanMs: number;
    /**
     * Gets or sets a value that specifies after how many requests to the cache the garbage collection will take place.
     */
    private memoryCacheGarbageCollectEveryXRequests: number;
    /**
     * Gets or sets number of maximum entries that can be stored at the same time in the memory cache.
     */
    private memoryCacheMaxEntryCount: number;
    /**
     * Gets or sets the loggers to use.
     */
    private loggers: Array<ILogger<string>>;
    /**
     * Gets or sets a value indicating whether Azure AD token provider should be built.
     */
    private buildAzureTokenProvider: boolean;
    /**
     * Gets or sets the custom token cache.
     */
    private customTokenCache: ITokenCache;
    /**
     * Gets or sets the base URL for the token endpoint, e.g. 'https://login.microsoftonline.com'.
     */
    private aadBaseUrl: string;
    /**
     * Gets or sets the Id of the application registration.
     */
    private aadClientId: string;
    /**
     * Gets or sets the secret for the application registration.
     */
    private aadClientSecret: string;
    /**
     * Gets or sets the Id of the Azure Active Directory tenant.
     */
    private aadTenantId: string;

    /**
     * Initializes a new instance of the @see ResilientWebPipelineBuilder class.
     */
    private constructor() {
        this.pipelineBuilder = ResilientPipelineBuilder.New();
        this.buildPipeline = false;
        this.baseUrl = null;
        this.buildMemoryCache = false;
        this.customCache = null;
        this.loggers = [];
        this.buildAzureTokenProvider = false;
    }

    /**
     * Gets a new builder.
     * @returns A new builder.
     */
    public static New(): ResilientWebPipelineBuilder {
        return new ResilientWebPipelineBuilder();
    }

    /**
     * Builds the web pipeline.
     * @returns The web pipeline.
     */
    public build(): IResilienceWebProxy {
        const logger = ResilientPipelineBuilder.prepareLoggers(this.loggers);
        const build = this.prepareBuild(logger);
        return new WebPipelineProxy(build[0], build[1], build[2], build[3], logger, build[4]);
    }

    /**
     * Builds a CRUD web pipeline.
     * @returns A CRUD web pipeline.
     */
    public buildToCrud<TItem>(): IResilienceCrudWebProxy<TItem> {
        const logger = ResilientPipelineBuilder.prepareLoggers(this.loggers);
        const build = this.prepareBuild(logger);
        return new CrudWebPipelineProxy(build[0], build[1], build[2], build[3], logger, build[4]);
    }

    /**
     * Builds a web request factory.
     * @returns A web request factory.
     */
    public builtToRequestFactory(): FactoryWebPipelineProxy {
        const logger = ResilientPipelineBuilder.prepareLoggers(this.loggers);
        const build = this.prepareBuild(logger);
        const proxy = new WebPipelineProxy(build[0], build[1], build[2], build[3], logger);
        return new FactoryWebPipelineProxy(proxy, build[4]);
    }

    /**
     * Uses a custom token cache.
     * @param tokenCache Custom token cache to use.
     * @returns The builder.
     */
    public useTokenCache(tokenCache: ITokenCache): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(tokenCache, "tokenCache");

        this.customTokenCache = tokenCache;
        this.buildAzureTokenProvider = false;

        return this;
    }

    /**
     * Uses an Azure Active Directory App Registration token provider in a default token cache.
     * @param baseUrl The base URL for the token endpoint, e.g. 'https://login.microsoftonline.com'.
     * @param clientId The Id of the application registration.
     * @param clientSecret The secret for the application registration.
     * @param tenantId The Id of the Azure Active Directory tenant.
     * @returns This builder.
     */
    public useAzureAdTokenProvider(baseUrl: string, clientId: string, clientSecret: string, tenantId: string): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(baseUrl, "baseUrl");
        Guard.throwIfNullOrEmpty(clientId, "clientId");
        Guard.throwIfNullOrEmpty(clientSecret, "clientSecret");
        Guard.throwIfNullOrEmpty(tenantId, "tenantId");

        this.aadBaseUrl = baseUrl;
        this.aadClientId = clientId;
        this.aadClientSecret = clientSecret;
        this.aadTenantId = tenantId;
        this.buildAzureTokenProvider = true;

        return this;
    }

    /**
     * Uses an in memory response cache.
     * @param expirationTimespanMs Value in milli seconds how long a value is valid in the cache.
     * @param garbageCollectEveryXRequests Specifies after how many requests to the cache the garbage collection will take place.
     * @param maxEntryCount Number of maximum entries that can be stored at the same time in the memory cache.
     * @returns The builder.
     */
    public useMemoryCache(expirationTimespanMs: number, garbageCollectEveryXRequests: number = 50, maxEntryCount: number = 1000): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(expirationTimespanMs, "expirationTimespanMs");
        Guard.throwIfNullOrEmpty(garbageCollectEveryXRequests, "garbageCollectEveryXRequests");
        Guard.throwIfNullOrEmpty(maxEntryCount, "maxEntryCount");

        if (garbageCollectEveryXRequests <= 0) {
            throw new ArgumentError("'garbageCollectEveryXRequests' must be greater than zero.", "garbageCollectEveryXRequests");
        }

        if (maxEntryCount <= 0) {
            throw new ArgumentError("'maxEntryCount' must be greater than zero.", "maxEntryCount");
        }

        this.memoryCacheExpirationTimespanMs = expirationTimespanMs;
        this.memoryCacheGarbageCollectEveryXRequests = garbageCollectEveryXRequests;
        this.memoryCacheMaxEntryCount = maxEntryCount;

        this.buildMemoryCache = true;

        return this;
    }

    /**
     * Uses a custom cache for response items.
     * @param cache Cache to use.
     * @returns The builder.
     */
    public useCache(cache: ICache<string, axios.AxiosResponse>): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(cache, "cache");

        this.customCache = cache;

        this.buildMemoryCache = false;

        return this;
    }

    /**
     * Uses a base URL for all web requests.
     * @param value The base URL for all web requests.
     * @returns The builder.
     */
    public useBaseUrl(value: string): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(value, "value");

        this.baseUrl = value;

        return this;
    }

    /**
     * Uses baseline measurement and log warning.
     * @param startSamplingAfter A timespan after when sampling should start. Use this if server needs a longer time to start.
     * @param maxSampleDuration A timespan within samples should be gathered after sampling start.
     * @param maxSamplesCount The maximum number of samples.
     * @returns The builder.
     */
    public useBaseline(startSamplingAfter: number, maxSampleDuration: number, maxSamplesCount: number): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrNegative(startSamplingAfter, "startSamplingAfter");
        Guard.throwIfNullOrNegative(maxSampleDuration, "maxSampleDuration");
        Guard.throwIfNullOrNegative(maxSamplesCount, "maxSamplesCount");

        this.pipelineBuilder.useBaseline(startSamplingAfter, maxSampleDuration, maxSamplesCount);
        return this;
    }

    /**
     * Adds a custom logger.
     * @param logger Logger to include.
     * @returns The builder.
     */
    public useCustomLogger(logger: ILogger<string>): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(logger, "logger");

        this.loggers.push(logger);
        return this;
    }

    /**
     * Adds a console logger.
     * @param logLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
     */
    public useConsoleLogger(logLevel?: LogLevel): ResilientWebPipelineBuilder {
        this.loggers.push(new ConsoleLogger(logLevel));

        return this;
    }

    /**
     * Adds an Azure Application Insights logger.
     * @param logLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
     */
    public useAppInsightsLogger(logLevel?: LogLevel): ResilientWebPipelineBuilder {
        this.loggers.push(new AppInsightsLogger(logLevel));

        return this;
    }

    /**
     * Includes a circuit breaker proxy.
     * @param position Position of the circuit breaker in the pipeline.
     * @param breakDurationMs Minimum time in milli seconds circuit breaker will stay in open state.
     * @param maxFailedCalls Maximum failed calls before opening the circuit breaker.
     * @param leakTimeSpanInMilliSeconds Timespan in milliseconds in within errors are counted against max failed calls.
     * @param stateChangedCallback Callback to invoke if internal state has changed.
     * @param initialState The initial state of the circuit breaker.
     * @returns The builder.
     */
    public useCircuitBreaker(position: number, breakDurationMs: number, maxFailedCalls: number, leakTimeSpanInMilliSeconds: number, stateChangedCallback?: (state: CircuitBreakerState) => void, initialState: CircuitBreakerState = CircuitBreakerState.Close): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(breakDurationMs, "breakDurationMs");
        Guard.throwIfNullOrEmpty(maxFailedCalls, "maxFailedCalls");

        this.buildPipeline = true;
        this.pipelineBuilder.useCircuitBreaker(position, breakDurationMs, maxFailedCalls, leakTimeSpanInMilliSeconds, stateChangedCallback, initialState);

        return this;
    }

    /**
     * Includes a retry proxy.
     * @param position Position in the pipeline.
     * @param retries Number of retries to execute.
     */
    public useRetry(position: number, retries: number): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(retries, "retries");

        this.buildPipeline = true;
        this.pipelineBuilder.useRetry(position, retries);

        return this;
    }

    /**
     * Includes a timeout into the pipeline.
     * @param position Position in the pipeline.
     * @param timeoutMs Timeout in MS within function must succeed or else a timeout error is thrown.
     * @returns The builder.
     */
    public useTimeout(position: number, timeoutMs: number): ResilientWebPipelineBuilder {
        Guard.throwIfNullOrEmpty(timeoutMs, "timeoutMs");

        this.buildPipeline = true;
        this.pipelineBuilder.useTimeout(position, timeoutMs);

        return this;
    }

    /**
     * Builds the web pipeline.
     * @param logger Logger to use.
     * @returns The web pipeline.
     */
    private prepareBuild(logger: ILogger<string>): [IResilienceProxy, ICache<string, axios.AxiosResponse>, ITokenCache, string, IMaintance] {
        let pipeline: IResilienceProxy;
        let proxies: IResilienceProxy[];
        if (this.buildPipeline) {
            this.pipelineBuilder.useCustomLogger(logger);
            proxies = this.pipelineBuilder.buildToList();
            pipeline = new PipelineProxy(proxies);
        }

        let cache: ICache<string, axios.AxiosResponse>;
        let cacheMaintenance: MemoryCache<axios.AxiosResponse>;
        if (this.buildMemoryCache) {
            cacheMaintenance = new MemoryCache<axios.AxiosResponse>(this.memoryCacheExpirationTimespanMs, logger, this.memoryCacheGarbageCollectEveryXRequests, this.memoryCacheMaxEntryCount);
            cache = cacheMaintenance;
        } else {
            cache = this.customCache;
        }

        let tokenCache: ITokenCache;
        if (this.buildAzureTokenProvider) {
            const provider = new AzureActiveDirectoryAppRegistrationTokenProvider(this.aadBaseUrl, this.aadClientId, this.aadClientSecret, this.aadTenantId, logger);
            tokenCache = new DefaultTokenCache(provider, logger);
        } else {
            tokenCache = this.customTokenCache;
        }

        const maintenance = new Maintenance(proxies, cacheMaintenance);

        return [pipeline, cache, tokenCache, this.baseUrl, maintenance];
    }
}
