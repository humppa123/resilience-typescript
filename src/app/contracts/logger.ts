import { LogLevel } from "../logging/logLevel";

/**
 * Represents a type used to perform logging.
 * @template TState Type of the entry to be written.
 */
export interface ILogger<TState> {
    /**
     * Writes a log entry.
     * @param logLevel Entry will be written on this level.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    log(logLevel: LogLevel, state: TState, error: Error, formatter: (s: TState, e: Error) => string): void;

    /**
     * Writes a trace log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    trace(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes a debug log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    debug(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes an information log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    information(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes a warning log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    warning(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes an error log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    error(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes a critical log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    critical(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;

    /**
     * Writes a none log entry.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    none(state: TState, error: Error, formatter: (s: string, e: Error) => string): void;
}
