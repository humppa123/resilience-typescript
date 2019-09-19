import { IResilienceProxy } from "./resilience/resilienceProxy";
import { Guard } from "./utils/guard";
import { PipelineProxy } from "./pipeline/pipelineProxy";
import { ILogger } from "./logging/logger";
import { NoLogger } from "./logging/noLogger";
import { CircuitBreakerState } from "./resilience/circuitBreakerState";
import { CircuitBreakerProxy } from "./resilience/circuitBreakerProxy";
import { RetryProxy } from "./resilience/retryProxy";
import { TimeoutProxy } from "./resilience/timeoutProxy";

/**
 * Builder for a resilient pipeline.
 */
export class ResilientPipelineBuilder {
    /**
     * Gets the proxies for the pipeline.
     */
    private readonly proxies: { [id: number]: IResilienceProxy; };
    /**
     * Gets or sets a value indicating whether a circuit breaker proxy shall be included.
     */
    private circuitBreakerIncluded: boolean;
    /**
     * Gets or sets minimum time in milli seconds circuit breaker will stay in open state.
     */
    private circuitBreakerBreakDurationMs: number;
    /**
     * Gets or sets maximum failed calls before opening the circuit breaker.
     */
    private circuitBreakerMaxFailedCalls: number;
    /**
     * Gets or sets callback to invoke if internal state has changed.
     */
    private circuitBreakerStateChangedCallback: (state: CircuitBreakerState) => void;
    /**
     * Gets or sets the initial state of the circuit breaker.
     */
    private circuitBreakerInitialState: CircuitBreakerState;
    /**
     * Gets or sets the position of the circuit breaker proxy in the resilient pipeline.
     */
    private circuitBreakerPosition: number;
    /**
     * Gets or sets a value indicating whether a retry proxy shall be included.
     */
    private retryIncluded: boolean;
    /**
     * Gets or sets number of retries to execute.
     */
    private retryRetries: number;
    /**
     * Gets or sets the position of the retry proxy in the resilient pipeline.
     */
    private retryPosition: number;
    /**
     * Gets or sets a value indicating whether a timout proxy shall be included.
     */
    private timeoutIncluded: boolean;
    /**
     * Gets or sets timeout in milli seconds within function must succeed or else a timeout error is thrown.
     */
    private timeoutTimeoutMs: number;
    /**
     * Gets or sets the position of the timeout proxy in the pipeline.
     */
    private timeoutPosition: number;
    /**
     * Gets or sets the logger to use.
     */
    private logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see ResiliencePipelineBuilder class.
     */
    private constructor() {
        this.proxies = {};
        this.circuitBreakerIncluded = false;
        this.retryIncluded = false;
        this.timeoutIncluded = false;
        this.logger = new NoLogger();
    }

    /**
     * Gets a new builder.
     * @returns A new resilient pipleline builder.
     */
    public static New(): ResilientPipelineBuilder {
        return new ResilientPipelineBuilder();
    }

    /**
     * Adds a logger.
     * @param logger Logger to include.
     * @returns The builder.
     */
    public addLogger(logger: ILogger<string>): ResilientPipelineBuilder {
        Guard.throwIfNullOrEmpty(logger, "logger");

        this.logger = logger;
        return this;
    }

    /**
     * Adds a custom resilience proxy implementation.
     * @param position The position in the pipeline.
     * @param proxy Custom proxy to add.
     * @returns The builder.
     */
    public addProxy(position: number, proxy: IResilienceProxy): ResilientPipelineBuilder {
        Guard.throwIfNullOrEmpty(proxy, "proxy");

        if (!this.isPositionFree(position)) {
            throw new Error(`Position '${position}' is already in use in the pipeline!`);
        }

        this.proxies[position] = proxy;
        return this;
    }

    /**
     * Includes a circuit breaker proxy.
     * @param position Position of the circuit breaker in the pipeline.
     * @param breakDurationMs Minimum time in milli seconds circuit breaker will stay in open state.
     * @param maxFailedCalls Maximum failed calls before opening the circuit breaker.
     * @param stateChangedCallback Callback to invoke if internal state has changed.
     * @param initialState The initial state of the circuit breaker.
     * @returns The builder.
     */
    public useCircuitBreaker(position: number, breakDurationMs: number, maxFailedCalls: number, stateChangedCallback?: (state: CircuitBreakerState) => void, initialState: CircuitBreakerState = CircuitBreakerState.Close): ResilientPipelineBuilder {
        Guard.throwIfNullOrEmpty(breakDurationMs, "breakDurationMs");
        Guard.throwIfNullOrEmpty(maxFailedCalls, "maxFailedCalls");

        if (!this.isPositionFree(position)) {
            throw new Error(`Position '${position}' is already in use in the pipeline!`);
        }

        this.circuitBreakerIncluded = true;
        this.circuitBreakerPosition = position;
        this.circuitBreakerBreakDurationMs = breakDurationMs;
        this.circuitBreakerMaxFailedCalls = maxFailedCalls;
        this.circuitBreakerStateChangedCallback = stateChangedCallback;
        this.circuitBreakerInitialState = initialState;

        return this;
    }

    /**
     * Includes a retry proxy.
     * @param position Position in the pipeline.
     * @param retries Number of retries to execute.
     */
    public useRetry(position: number, retries: number): ResilientPipelineBuilder {
        Guard.throwIfNullOrEmpty(retries, "retries");

        if (!this.isPositionFree(position)) {
            throw new Error(`Position '${position}' is already in use in the pipeline!`);
        }

        this.retryIncluded = true;
        this.retryPosition = position;
        this.retryRetries = retries;

        return this;
    }

    /**
     * Includes a timeout into the pipeline.
     * @param position Position in the pipeline.
     * @param timeoutMs Timeout in MS within function must succeed or else a timeout error is thrown.
     * @returns The builder.
     */
    public useTimeout(position: number, timeoutMs: number): ResilientPipelineBuilder {
        Guard.throwIfNullOrEmpty(timeoutMs, "timeoutMs");

        if (!this.isPositionFree(position)) {
            throw new Error(`Position '${position}' is already in use in the pipeline!`);
        }

        this.timeoutIncluded = true;
        this.timeoutPosition = position;
        this.timeoutTimeoutMs = timeoutMs;

        return this;
    }

    /**
     * Builds the resilience pipeline.
     * @returns The resilience pipeline.
     */
    public build(): IResilienceProxy {
        if (this.circuitBreakerIncluded) {
            this.proxies[this.circuitBreakerPosition] = new CircuitBreakerProxy(this.circuitBreakerBreakDurationMs, this.circuitBreakerMaxFailedCalls, this.logger, this.circuitBreakerStateChangedCallback, this.circuitBreakerInitialState);
        }

        if (this.retryIncluded) {
            this.proxies[this.retryPosition] = new RetryProxy(this.retryRetries, this.logger);
        }

        if (this.timeoutIncluded) {
            this.proxies[this.timeoutPosition] = new TimeoutProxy(this.timeoutTimeoutMs, this.logger);
        }

        const keys: number[] = [];
        for (const key in this.proxies) {
            keys.push(Number.parseInt(key, 10));
        }

        const sortedKeys = keys.sort((n1, n2) => n1 - n2);
        const sortedProxies: IResilienceProxy[] = [];
        for (const key of sortedKeys) {
            sortedProxies.push(this.proxies[key]);
        }

        return new PipelineProxy(sortedProxies);
    }

    /**
     * Gets a value indicating whether a position in the pipeline is free.
     * @param position Position to check.
     * @returns True if the position is free, else false.
     */
    private isPositionFree(position: number): boolean {
        if (this.proxies[position]) {
            return false;
        }

        if (this.circuitBreakerIncluded && this.circuitBreakerPosition === position) {
            return false;
        }

        if (this.retryIncluded && this.retryPosition === position) {
            return false;
        }

        if (this.timeoutIncluded && this.timeoutPosition === position) {
            return false;
        }

        return true;
    }
}
