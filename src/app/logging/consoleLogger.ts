import { LogLevel } from "./logLevel";
import { getUtcDateTimeString } from "./utils";
import { AbstractStringLogger } from "./abstractStringLogger";

/**
 * A logger that logs to the default console.
 */
export class ConsoleLogger extends AbstractStringLogger {
    /**
     * Initializes a new instance of the @see ConsoleLogger class.
     * @param minimumLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
     */
    constructor(minimumLevel?: LogLevel) {
        super(minimumLevel || LogLevel.Trace);
    }

    /**
     * The real handler for log entries.
     * @param logLevel Entry will be written on this level.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    protected logHandler(logLevel: LogLevel, state: string, error: Error, formatter: (s: string, e: Error) => string): void {
        console.log(`${getUtcDateTimeString()} ${logLevel} ${formatter(state, error)}`);
    }
}