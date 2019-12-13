import { ResilienceProxy } from './contracts/resilienceProxy';
import { Guard } from './utils/guard';
import { PipelineProxy } from './pipeline/pipelineProxy';
import { Logger } from './contracts/logger';
import { NoLogger } from './logging/noLogger';
import { CircuitBreakerState } from './resilience/circuitBreakerState';
import { CircuitBreakerProxy } from './resilience/circuitBreakerProxy';
import { RetryProxy } from './resilience/retryProxy';
import { TimeoutProxy } from './resilience/timeoutProxy';
import { MultiLogger } from './logging/multiLogger';
import { LogLevel } from './logging/logLevel';
import { ConsoleLogger } from './logging/consoleLogger';
import { AppInsightsLogger } from './logging/appInsightsLogger';
import { BaselineProxy } from './resilience/baselineProxy';
import { TelemetryClient } from 'applicationinsights';

/**
 * Builder for a resilient pipeline.
 */
export class ResilientPipelineBuilder {
  /**
   * Gets the proxies for the pipeline.
   */
  private readonly proxies: { [id: number]: ResilienceProxy };
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
  private circuitBreakerStateChangedCallback: (
    state: CircuitBreakerState
  ) => void;
  /**
   * Gets or sets the initial state of the circuit breaker.
   */
  private circuitBreakerInitialState: CircuitBreakerState;
  /**
   * Gets or sets the position of the circuit breaker proxy in the resilient pipeline.
   */
  private circuitBreakerPosition: number;
  /**
   * Gets or sets timespan in milliseconds in within errors are counted against max failed calls.
   */
  private circuitBreakerLeakTimeSpanInMilliSeconds: number;
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
   * Gets or sets the loggers to use.
   */
  private loggers: Array<Logger<string>>;
  /**
   * Gets or sets a value indicating whether baseline is included.
   */
  private baselineIncluded: boolean;
  /**
   * Gets or sets a timespan after when sampling should start. Use this if server needs a longer time to start.
   */
  private baselineStartSamplingAfter: number;
  /**
   * Gets or sets a timespan within samples should be gathered after sampling start.
   */
  private baselineMaxSampleDuration: number;
  /**
   * Gets or sets the maximum number of samples.
   */
  private baselineMaxSamplesCount: number;

  /**
   * Initializes a new instance of the @see ResiliencePipelineBuilder class.
   */
  private constructor() {
    this.proxies = {};
    this.circuitBreakerIncluded = false;
    this.retryIncluded = false;
    this.timeoutIncluded = false;
    this.baselineIncluded = false;
    this.loggers = [];
  }

  /**
   * Gets a new builder.
   * @returns A new resilient pipleline builder.
   */
  static New(): ResilientPipelineBuilder {
    return new ResilientPipelineBuilder();
  }

  /**
   * Prepares the loggers.
   * @returns The loggers.
   */
  static prepareLoggers(loggers: Array<Logger<string>>): Logger<string> {
    let logger: Logger<string> = null;
    switch (loggers.length) {
      case 0:
        logger = new NoLogger();
        break;
      case 1:
        logger = loggers[0];
        break;
      default:
        logger = new MultiLogger(loggers);
        break;
    }

    return logger;
  }

  /**
   * Uses baseline measurement and log warning.
   * @param startSamplingAfter A timespan after when sampling should start. Use this if server needs a longer time to start.
   * @param maxSampleDuration A timespan within samples should be gathered after sampling start.
   * @param maxSamplesCount The maximum number of samples.
   * @returns The builder.
   */
  useBaseline(
    startSamplingAfter: number,
    maxSampleDuration: number,
    maxSamplesCount: number
  ): ResilientPipelineBuilder {
    Guard.throwIfNullOrNegative(startSamplingAfter, 'startSamplingAfter');
    Guard.throwIfNullOrNegative(maxSampleDuration, 'maxSampleDuration');
    Guard.throwIfNullOrNegative(maxSamplesCount, 'maxSamplesCount');

    this.baselineIncluded = true;
    this.baselineMaxSampleDuration = maxSampleDuration;
    this.baselineMaxSamplesCount = maxSamplesCount;
    this.baselineStartSamplingAfter = startSamplingAfter;
    return this;
  }

  /**
   * Adds a logger.
   * @param logger Logger to include.
   * @returns The builder.
   */
  useCustomLogger(logger: Logger<string>): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(logger, 'logger');

    this.loggers.push(logger);
    return this;
  }

  /**
   * Adds a console logger.
   * @param logLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
   */
  useConsoleLogger(logLevel?: LogLevel): ResilientPipelineBuilder {
    this.loggers.push(new ConsoleLogger(logLevel));

    return this;
  }

  /**
   * Adds an Azure Application Insights logger.
   * @param client Application Insights client to use.
   * @param logLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
   */
  useAppInsightsLogger(
    client: TelemetryClient,
    logLevel?: LogLevel
  ): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(client, 'client');

    this.loggers.push(new AppInsightsLogger(client, logLevel));

    return this;
  }

  /**
   * Adds a custom resilience proxy implementation.
   * @param position The position in the pipeline.
   * @param proxy Custom proxy to add.
   * @returns The builder.
   */
  addProxy(position: number, proxy: ResilienceProxy): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(proxy, 'proxy');

    if (!this.isPositionFree(position)) {
      throw new Error(
        `Position '${position}' is already in use in the pipeline!`
      );
    }

    this.proxies[position] = proxy;
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
  useCircuitBreaker(
    position: number,
    breakDurationMs: number,
    maxFailedCalls: number,
    leakTimeSpanInMilliSeconds: number,
    stateChangedCallback?: (state: CircuitBreakerState) => void,
    initialState: CircuitBreakerState = CircuitBreakerState.Close
  ): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(breakDurationMs, 'breakDurationMs');
    Guard.throwIfNullOrEmpty(maxFailedCalls, 'maxFailedCalls');
    Guard.throwIfNullOrEmpty(
      leakTimeSpanInMilliSeconds,
      'leakTimeSpanInMilliSeconds'
    );

    if (!this.isPositionFree(position)) {
      throw new Error(
        `Position '${position}' is already in use in the pipeline!`
      );
    }

    this.circuitBreakerIncluded = true;
    this.circuitBreakerPosition = position;
    this.circuitBreakerBreakDurationMs = breakDurationMs;
    this.circuitBreakerMaxFailedCalls = maxFailedCalls;
    this.circuitBreakerStateChangedCallback = stateChangedCallback;
    this.circuitBreakerInitialState = initialState;
    this.circuitBreakerLeakTimeSpanInMilliSeconds = leakTimeSpanInMilliSeconds;

    return this;
  }

  /**
   * Includes a retry proxy.
   * @param position Position in the pipeline.
   * @param retries Number of retries to execute.
   */
  useRetry(position: number, retries: number): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(retries, 'retries');

    if (!this.isPositionFree(position)) {
      throw new Error(
        `Position '${position}' is already in use in the pipeline!`
      );
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
  useTimeout(position: number, timeoutMs: number): ResilientPipelineBuilder {
    Guard.throwIfNullOrEmpty(timeoutMs, 'timeoutMs');

    if (!this.isPositionFree(position)) {
      throw new Error(
        `Position '${position}' is already in use in the pipeline!`
      );
    }

    this.timeoutIncluded = true;
    this.timeoutPosition = position;
    this.timeoutTimeoutMs = timeoutMs;

    return this;
  }

  /**
   * Builds to list of proxies.
   * @returns List of proxies.
   */
  buildToList(): ResilienceProxy[] {
    const logger = ResilientPipelineBuilder.prepareLoggers(this.loggers);
    if (this.circuitBreakerIncluded) {
      this.proxies[this.circuitBreakerPosition] = new CircuitBreakerProxy(
        this.circuitBreakerBreakDurationMs,
        this.circuitBreakerMaxFailedCalls,
        this.circuitBreakerLeakTimeSpanInMilliSeconds,
        logger,
        this.circuitBreakerStateChangedCallback,
        this.circuitBreakerInitialState
      );
    }

    if (this.retryIncluded) {
      this.proxies[this.retryPosition] = new RetryProxy(
        this.retryRetries,
        logger
      );
    }

    if (this.timeoutIncluded) {
      this.proxies[this.timeoutPosition] = new TimeoutProxy(
        this.timeoutTimeoutMs,
        logger
      );
    }

    const keys: number[] = [];
    for (const key in this.proxies) {
      if (this.proxies.hasOwnProperty(key)) {
        keys.push(Number.parseInt(key, 10));
      }
    }

    const sortedKeys = keys.sort((n1, n2) => n1 - n2);
    const sortedProxies: ResilienceProxy[] = [];
    for (const key of sortedKeys) {
      sortedProxies.push(this.proxies[key]);
    }

    if (this.baselineIncluded) {
      const baseline = new BaselineProxy(
        this.baselineStartSamplingAfter,
        this.baselineMaxSampleDuration,
        this.baselineMaxSamplesCount,
        logger
      );
      sortedProxies.push(baseline);
    }

    return sortedProxies;
  }

  /**
   * Builds the resilience pipeline.
   * @returns The resilience pipeline.
   */
  build(): ResilienceProxy {
    const sortedProxies = this.buildToList();
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

    if (
      this.circuitBreakerIncluded &&
      this.circuitBreakerPosition === position
    ) {
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
