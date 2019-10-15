import { LogLevel } from "./logLevel";
import { ILogger } from "../contracts/logger";
import { Guid } from "guid-typescript";

/**
 * Base class for all string loggers.
 */
export abstract class AbstractStringLogger implements ILogger<string> {
    /**
     * The minimum log level this logger accepts for log messages.
     */
    protected readonly minimumLevel: LogLevel;

    /**
     * Initializes a new instance of the @see AbstractLogger class.
     * @param minimumLevel The minimum log level this logger accepts for log messages.
     */
    protected constructor(minimumLevel: LogLevel) {
        this.minimumLevel = minimumLevel;
    }

    /**
     * Writes a log entry.
     * @param logLevel Entry will be written on this level.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public log(logLevel: LogLevel, guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        if (this.isInLogLevel(logLevel)) {
            this.logHandler(logLevel, guid, state, error, formatter);
        }
    }

    /**
     * Writes a trace log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public trace(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Trace, guid, state, error, formatter);
    }

    /**
     * Writes a debug log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public debug(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Debug, guid, state, error, formatter);
    }

    /**
     * Writes an information log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public information(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Information, guid, state, error, formatter);
    }

    /**
     * Writes a warning log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public warning(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Warning, guid, state, error, formatter);
    }

    /**
     * Writes an error log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public error(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Error, guid, state, error, formatter);
    }

    /**
     * Writes a critical log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public critical(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.Critical, guid, state, error, formatter);
    }

    /**
     * Writes a none log entry.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    public none(guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        this.log(LogLevel.None, guid, state, error, formatter);
    }

    /**
     * Gets a value indicating whether a provided log level is above the current minimum level.
     * @param logLevel Log level to check if is above the current minimum level.
     * @returns True if provided log level is above the current minimum level, else false.
     */
    public isInLogLevel(logLevel: LogLevel): boolean {
        switch (this.minimumLevel) {
            case LogLevel.None:
                if (logLevel === LogLevel.None) {
                    return true;
                } else {
                    return false;
                }
            case LogLevel.Critical:
                if (logLevel === LogLevel.None ||
                    logLevel === LogLevel.Critical) {
                    return true;
                } else {
                    return false;
                }
            case LogLevel.Error:
                if (logLevel === LogLevel.None ||
                    logLevel === LogLevel.Critical ||
                    logLevel === LogLevel.Error) {
                    return true;
                } else {
                    return false;
                }
            case LogLevel.Warning:
                    if (logLevel === LogLevel.None ||
                        logLevel === LogLevel.Critical ||
                        logLevel === LogLevel.Error ||
                        logLevel === LogLevel.Warning) {
                        return true;
                    } else {
                        return false;
                    }
            case LogLevel.Information:
                    if (logLevel === LogLevel.None ||
                        logLevel === LogLevel.Critical ||
                        logLevel === LogLevel.Error ||
                        logLevel === LogLevel.Warning ||
                        logLevel === LogLevel.Information) {
                        return true;
                    } else {
                        return false;
                    }
            case LogLevel.Debug:
                    if (logLevel === LogLevel.None ||
                        logLevel === LogLevel.Critical ||
                        logLevel === LogLevel.Error ||
                        logLevel === LogLevel.Warning ||
                        logLevel === LogLevel.Information ||
                        logLevel === LogLevel.Debug) {
                        return true;
                    } else {
                        return false;
                    }
            case LogLevel.Trace:
                if (logLevel === LogLevel.None ||
                    logLevel === LogLevel.Critical ||
                    logLevel === LogLevel.Error ||
                    logLevel === LogLevel.Warning ||
                    logLevel === LogLevel.Information ||
                    logLevel === LogLevel.Debug ||
                    logLevel === LogLevel.Trace) {
                    return true;
                } else {
                    return false;
                }
            default:
                throw new Error(`LogLevel "${logLevel}" not found`);
        }
    }

    /**
     * The real handler for log entries.
     * @param logLevel Entry will be written on this level.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    protected abstract logHandler(logLevel: LogLevel, guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void;
}
