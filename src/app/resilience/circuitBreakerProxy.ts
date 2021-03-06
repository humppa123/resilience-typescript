import { CircuitBreakerState } from './circuitBreakerState';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { CircuitBreakerError } from './circuitBreakerError';
import { Logger } from '../contracts/logger';
import { Guard } from '../utils/guard';
import { logFormatter } from './utils';
import { LeakingBucket } from './leakingBucket';
import { Guid } from 'guid-typescript';

/**
 * A circuit breaker to protect a caller from failing resources.
 */
export class CircuitBreakerProxy implements ResilienceProxy {
  /**
   * Gets a callback to invoke if internal state has changed.
   */
  private readonly stateChangedCallback: (state: CircuitBreakerState) => void;
  /**
   * The logger to use.
   */
  private readonly logger: Logger<string>;
  /**
   * Gets minimum time in milli seconds circuit breaker will stay in open state.
   */
  private readonly breakDurationMs: number;
  /**
   * Gets the leaking bucket.
   */
  private readonly bucket: LeakingBucket;
  /**
   * Gets or sets the current internal state.
   */
  private state: CircuitBreakerState;
  /**
   * Gets or sets date when open state has expired.
   */
  private openExpiration: Date;
  /**
   * Gets or sets the current error.
   */
  private currentError: Error;

  /**
   * Initializes a new instance of the @see CircuitBreaker class.
   * @param breakDurationMs Minimum time in milli seconds circuit breaker will stay in open state.
   * @param maxFailedCalls Maximum failed calls before opening the circuit breaker.
   * @param leakTimeSpanInMilliSeconds Timespan in milliseconds in within errors are counted against max failed calls.
   * @param logger Logger to use.
   * @param stateChangedCallback Callback to invoke if internal state has changed.
   * @param initialState The initial state of the circuit breaker.
   */
  constructor(
    breakDurationMs: number,
    maxFailedCalls: number,
    leakTimeSpanInMilliSeconds: number,
    logger: Logger<string>,
    stateChangedCallback?: (state: CircuitBreakerState) => void,
    initialState: CircuitBreakerState = CircuitBreakerState.Close
  ) {
    Guard.throwIfNullOrEmpty(breakDurationMs, 'breakDurationMs');
    Guard.throwIfNullOrEmpty(maxFailedCalls, 'maxFailedCalls');
    Guard.throwIfNullOrEmpty(
      leakTimeSpanInMilliSeconds,
      'leakTimeSpanInMilliSeconds'
    );
    Guard.throwIfNullOrEmpty(logger, 'logger');

    this.breakDurationMs = breakDurationMs;
    this.stateChangedCallback = stateChangedCallback;
    this.bucket = new LeakingBucket(leakTimeSpanInMilliSeconds, maxFailedCalls);
    this.logger = logger;

    this.state = initialState;
    this.openExpiration = new Date();
    // Set to past to have a valid initial state.
    this.openExpiration.setSeconds(this.openExpiration.getSeconds() - 5);
  }

  /**
   * Gets the current state of the circuit breaker.
   * @returns The current state of the circuit breaker.
   */
  getState(): CircuitBreakerState {
    return this.state;
  }

  /**
   * Updates the internal state.
   * @param newState The new state.
   * @param requestId Request Guid.
   */
  setState(newState: CircuitBreakerState, requestId?: Guid): void {
    this.logger.warning(
      requestId,
      `Circuit Breaker state changed from '${this.state}' to '${newState}'`,
      null,
      logFormatter
    );
    this.state = newState;
    if (this.stateChangedCallback) {
      this.stateChangedCallback(newState);
    }
  }

  /**
   * Reset error count to zero.
   */
  resetErrorCount(): void {
    this.logger.warning(
      null,
      'Maintenance: CircuitBreaker reset error count to zero',
      null,
      logFormatter
    );
    this.bucket.clear();
  }

  /**
   * Executes a function within a circuit breaker proxy.
   * @param func Function to execute within the circuit breaker proxy.
   * @param requestId Request Guid.
   */
  async execute<TResult>(
    func: (...args: any[]) => Promise<TResult>,
    requestId: Guid
  ): Promise<TResult> {
    this.logger.trace(
      requestId,
      `Circuit Breaker in '${this.state}' state.`,
      null,
      logFormatter
    );
    switch (this.state) {
      case CircuitBreakerState.Close:
        const handleClose = await this.callFunc<TResult>(
          func,
          false,
          requestId
        );
        const successClose = handleClose[0];
        if (successClose) {
          return handleClose[1];
        } else {
          const error = this.handleError(handleClose[2], false, requestId);
          this.currentError = error;
          throw error;
        }

      case CircuitBreakerState.HalfOpen:
        const handleHalfOpen = await this.callFunc<TResult>(
          func,
          true,
          requestId
        );
        const successHalfOpen = handleHalfOpen[0];
        if (successHalfOpen) {
          return handleHalfOpen[1];
        } else {
          const error = this.handleError(handleHalfOpen[2], true, requestId);
          this.currentError = error;
          throw error;
        }

      case CircuitBreakerState.Open:
        const now = new Date().getTime();
        const exp = this.openExpiration.getTime();
        if (now > exp) {
          this.openExpiration = new Date();
          this.setState(CircuitBreakerState.HalfOpen, requestId);
          return this.execute(func, requestId);
        } else {
          const text = `Circuit Breaker is in open state. ${requestId ||
            'Func'} will be tried again after '${this.openExpiration}'.`;
          this.logger.debug(requestId, text, null, logFormatter);
          throw new CircuitBreakerError(text, this.currentError);
        }
      default:
        throw new Error(`State '${this.state}' is unkown!`);
    }
  }

  /**
   * Handles the call to the real function in the circuit breaker.
   * @param func The real func to call.
   * @param wasHalfOpen Flag if circuit breaker is currently in half open state.
   * @param requestId Request Guid.
   */
  private async callFunc<TResult>(
    func: (...args: any[]) => Promise<TResult>,
    wasHalfOpen: boolean,
    requestId: Guid
  ): Promise<[boolean, TResult, Error]> {
    let result: TResult;
    let success: boolean;
    let error: Error;
    try {
      result = await func();
      success = true;
      this.logger.debug(
        requestId,
        ` in Circuit Breaker called succesfully.`,
        null,
        logFormatter
      );
      if (wasHalfOpen) {
        this.bucket.clear();
        this.setState(CircuitBreakerState.Close, requestId);
      }
    } catch (e) {
      success = false;
      error = e;
      this.logger.debug(
        requestId,
        ` in Circuit Breaker failed with '${error.message}'.`,
        null,
        logFormatter
      );
    }

    const response: [boolean, TResult, Error] = [success, result, error];
    return response;
  }

  /**
   * Handles the error if a func call failed.
   * @param error Error that has occured during the func call.
   * @param wasHalfOpen Flag if circuit breaker was currently half open.
   * @param requestId Request Guid.
   * @returns The error to return to the caller.
   */
  private handleError(
    error: Error,
    wasHalfOpen: boolean,
    requestId: Guid
  ): Error {
    this.bucket.insert(new Date());
    if (this.bucket.isFull() || wasHalfOpen) {
      const expiration = new Date();
      expiration.setMilliseconds(
        expiration.getMilliseconds() + this.breakDurationMs
      );
      this.openExpiration = expiration;
      this.logger.debug(
        requestId,
        `Circuit Breaker expiration set to '${expiration}'.`,
        null,
        logFormatter
      );
      this.setState(CircuitBreakerState.Open, requestId);
    }

    return new CircuitBreakerError(
      'An error occured during execution of function in Circuit Breaker',
      error
    );
  }
}
