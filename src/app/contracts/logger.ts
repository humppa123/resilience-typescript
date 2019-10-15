import { LogLevel } from "../logging/logLevel";
import { Guid } from "guid-typescript";

/**
 * Represents a type used to perform logging.
 * @template TState Type of the entry to be written.
 */
export interface ILogger<TState> {
    /**
     * Writes a log entry.
     * @param logLevel Entry will be written on this level.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    log(logLevel: LogLevel, guid: Guid, state: TState, error: Error, formatter: (s: TState, guid: Guid, e: Error) => string): void;

    /**
     * Writes a trace log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    trace(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes a debug log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    debug(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes an information log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    information(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes a warning log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    warning(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes an error log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    error(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes a critical log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    critical(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;

    /**
     * Writes a none log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    none(guid: Guid, state: TState, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;
}
