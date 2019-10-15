import { LogLevel } from "./logLevel";
import { AbstractStringLogger } from "./abstractStringLogger";
import { Guid } from "guid-typescript";

/**
 * A logger that does nothing.
 */
export class NoLogger extends AbstractStringLogger {
    /**
     * Initializes a new instance of the @see NoLogger class.
     */
    constructor() {
        super(LogLevel.None);
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
        // Empty on purpose, as this logger shall do nothing.
    }
}
