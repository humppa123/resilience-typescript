import { LogLevel } from '../logging/logLevel';
import { Guid } from 'guid-typescript';

/**
 * Represents a type used to perform logging.
 * @template TState Type of the entry to be written.
 */
export interface Logger<TState> {
  /**
   * Writes a log entry.
   * @param logLevel Entry will be written on this level.
   * @param request Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  log(
    logLevel: LogLevel,
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: TState, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes a trace log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  trace(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes a debug log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  debug(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes an information log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  information(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes a warning log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  warning(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes an error log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  error(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes a critical log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  critical(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;

  /**
   * Writes a none log entry.
   * @param requestId Guid of the request.
   * @param state The entry to be written. Can be also an object.
   * @param error The error related to this entry.
   * @param formatter Function to create a string message of the state and error.
   */
  none(
    requestId: Guid,
    state: TState,
    error: Error,
    formatter: (s: string, requestId: Guid, e: Error) => string
  ): void;
}
