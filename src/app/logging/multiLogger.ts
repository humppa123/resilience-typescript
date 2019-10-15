import { LogLevel } from "./logLevel";
import { AbstractStringLogger } from "./abstractStringLogger";
import { ILogger } from "../..";
import { Guard } from "../utils/guard";
import { Guid } from "guid-typescript";

/**
 * A logger that is a container for other loggers.
 */
export class MultiLogger extends AbstractStringLogger {
    /**
     * Gets the internal loggers.
     */
    private readonly loggers: Array<ILogger<string>>;

    /**
     * Initializes a new instance of the @see ConsoleLogger class.
     * @param loggers Loggers this multi logger will contain.
     * @param minimumLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
     */
    constructor(loggers: Array<ILogger<string>>, minimumLevel?: LogLevel) {
        Guard.throwIfNullOrEmpty(loggers, "loggers");

        super(minimumLevel || LogLevel.Trace);

        this.loggers = loggers;
    }

    /**
     * The real handler for log entries.
     * @param logLevel Entry will be written on this level.
     * @param guid Guid of the request.
     * @param state The entry to be written. Can be also an object.
     * @param error The error related to this entry.
     * @param formatter Function to create a string message of the state and error.
     */
    protected logHandler(logLevel: LogLevel, guid: Guid, state: string, error: Error, formatter: (s: string, guid: Guid, e: Error) => string): void {
        for (const logger of this.loggers) {
            logger.log(logLevel, guid, state, error, formatter);
        }
    }
}
