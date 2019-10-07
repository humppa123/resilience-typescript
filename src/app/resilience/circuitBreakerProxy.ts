import { CircuitBreakerState } from "./circuitBreakerState";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { CircuitBreakerError } from "./circuitBreakerError";
import { ILogger } from "../contracts/logger";
import { Guard } from "../utils/guard";
import { logFormatter } from "./utils";

/**
 * A circuit breaker to protect a caller from failing resources.
 */
export class CircuitBreakerProxy implements IResilienceProxy {
    /**
     * Gets a callback to invoke if internal state has changed.
     */
    private readonly stateChangedCallback: (state: CircuitBreakerState) => void;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;
    /**
     * Gets minimum time in milli seconds circuit breaker will stay in open state.
     */
    private readonly breakDurationMs: number;
    /**
     * Gets maximum failed calls before opening the circuit breaker.
     */
    private readonly maxFailedCalls: number;
    /**
     * Gets or sets the current internal state.
     */
    private state: CircuitBreakerState;
    /**
     * Gets or sets the count of current failed calls.
     */
    private currentFailedCalls: number;
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
     * @param logger Logger to use.
     * @param stateChangedCallback Callback to invoke if internal state has changed.
     * @param initialState The initial state of the circuit breaker.
     */
    constructor(breakDurationMs: number, maxFailedCalls: number, logger: ILogger<string>, stateChangedCallback?: (state: CircuitBreakerState) => void, initialState: CircuitBreakerState = CircuitBreakerState.Close) {
        Guard.throwIfNullOrEmpty(breakDurationMs, "breakDurationMs");
        Guard.throwIfNullOrEmpty(maxFailedCalls, "maxFailedCalls");
        Guard.throwIfNullOrEmpty(logger, "logger");

        this.breakDurationMs = breakDurationMs;
        this.stateChangedCallback = stateChangedCallback;
        this.maxFailedCalls = maxFailedCalls;
        this.logger = logger;

        this.state = initialState;
        this.currentFailedCalls = 0;
        this.openExpiration = new Date();
        // Set to past to have a valid initial state.
        this.openExpiration.setSeconds(this.openExpiration.getSeconds() - 5);
    }

    /**
     * Gets the current state of the circuit breaker.
     * @returns The current state of the circuit breaker.
     */
    public getState(): CircuitBreakerState {
        return this.state;
    }

    /**
     * Executes a function within a circuit breaker proxy.
     * @param func Function to execute within the circuit breaker proxy.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>): Promise<TResult> {
        this.logger.trace(`Calling Circuit Breaker in '${this.state}' state.`, null, logFormatter);
        switch (this.state) {
            case CircuitBreakerState.Close:
                const handleClose = await this.callFunc<TResult>(func, false);
                const successClose = handleClose[0];
                if (successClose) {
                    return handleClose[1];
                } else {
                    const error = this.handleError(handleClose[2], false);
                    this.currentError = error;
                    throw error;
                }

            case CircuitBreakerState.HalfOpen:
                const handleHalfOpen = await this.callFunc<TResult>(func, true);
                const successHalfOpen = handleHalfOpen[0];
                if (successHalfOpen) {
                    return handleHalfOpen[1];
                } else {
                    const error = this.handleError(handleHalfOpen[2], true);
                    this.currentError = error;
                    throw error;
                }

            case CircuitBreakerState.Open:
                const now = new Date().getTime();
                const exp = this.openExpiration.getTime();
                if (now > exp) {
                    this.openExpiration = new Date();
                    this.updateState(CircuitBreakerState.HalfOpen);
                    return await this.execute(func);
                } else {
                    const text = `Circuit Breaker is in open state. Func will be tried again after '${this.openExpiration}'.`;
                    this.logger.debug(text, null, logFormatter);
                    throw new CircuitBreakerError(text, this.currentError);
                }
        }
    }

    /**
     * Handles the call to the real function in the circuit breaker.
     * @param func The real func to call.
     * @param wasHalfOpen Flag if circuit breaker is currently in half open state.
     */
    private async callFunc<TResult>(func: (...args: any[]) => Promise<TResult>, wasHalfOpen: boolean): Promise<[boolean, TResult, Error]> {
        let result: TResult;
        let success: boolean;
        let error: Error;
        try {
            result = await func();
            success = true;
            this.currentFailedCalls = 0;
            this.logger.debug(`Func in Circuit Breaker called succesfully.`, null, logFormatter);
            if (wasHalfOpen) {
                this.updateState(CircuitBreakerState.Close);
            }
        } catch (e) {
            success = false;
            error = e;
            this.logger.debug(`Func in Circuit Breaker failed with '${error.message}'.`, null, logFormatter);
        }

        const response: [boolean, TResult, Error] = [success, result, error];
        return response;
    }

    /**
     * Handles the error if a func call failed.
     * @param error Error that has occured during the func call.
     * @param wasHalfOpen Flag if circuit breaker was currently half open.
     * @returns The error to return to the caller.
     */
    private handleError(error: Error, wasHalfOpen: boolean): Error {
        this.currentFailedCalls++;
        if (this.currentFailedCalls === this.maxFailedCalls || wasHalfOpen) {
            const expiration = new Date();
            expiration.setMilliseconds(expiration.getMilliseconds() + this.breakDurationMs);
            this.openExpiration = expiration;
            this.logger.debug(`Circuit Breaker expiration set to '${expiration}'.`, null, logFormatter);
            this.updateState(CircuitBreakerState.Open);
        }

        return new CircuitBreakerError("An error occured during execution of function in Circuit Breaker", error);
    }

    /**
     * Updates the internal state.
     * @param newState The new state.
     */
    private updateState(newState: CircuitBreakerState): void {
        this.logger.warning(`Circuit Breaker state changed from '${this.state}' to '${newState}'`, null, logFormatter);
        this.state = newState;
        if (this.stateChangedCallback) {
            this.stateChangedCallback(newState);
        }
    }
}
