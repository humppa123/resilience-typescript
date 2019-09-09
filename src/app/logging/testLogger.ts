import { AbstractStringLogger } from "./abstractStringLogger";
import { LogLevel } from "./logLevel";

/**
 * A logger for unit tests, providing a callback to verify logged messages.
 */
export class TestLogger extends AbstractStringLogger {
    private readonly callback: (logLevel: LogLevel, state: string, error: Error) => void;
    /**
     * Initializes a new instance of the @see TestLogger class.
     * @param minimumLevel The minimum log level this logger accepts for log messages.
     * @param callback Callback used to return log entry.
     */
    constructor(minimumLevel: LogLevel, callback?: (logLevel: LogLevel, state: string, error: Error) => void) {
        super(minimumLevel);
        this.callback = callback;
    }

    /**
     * The real handler for log entries.
     * @param logLevel Entry will be written on this level.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    protected logHandler(logLevel: LogLevel, state: string, error: Error, formatter: (s: string, e: Error) => string): void {
        if (this.callback) {
            this.callback(logLevel, state, error);
        }
    }
}
