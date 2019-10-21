import { LogLevel } from "./logLevel";
import { AbstractStringLogger } from "./abstractStringLogger";
import appInsights = require("applicationinsights");
import { TraceTelemetry, SeverityLevel } from "applicationinsights/out/Declarations/Contracts";
import { ArgumentError } from "../utils/argumentError";
import { Guid } from "guid-typescript";
import { Guard } from "../utils/guard";

/**
 * Logger that logs to Azure Application Insights
 */
export class AppInsightsLogger extends AbstractStringLogger {
    /**
     * Gets the application insights client.
     */
    private readonly client: appInsights.TelemetryClient;

    /**
     * Initializes a new instance of the @see ConsoleLogger class.
     * @param minimumLevel The minimum log level this logger accepts for log messages. If not set, LogLevel.Trace will be used.
     */
    constructor(client: appInsights.TelemetryClient, minimumLevel?: LogLevel, ) {
        super(minimumLevel || LogLevel.Trace);
        Guard.throwIfNullOrEmpty(client, "client");

        this.client = client;
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
        const telemetry: TraceTelemetry = {
            message: formatter(state, guid, error),
            severity: AppInsightsLogger.logLevelToSeverityLevel(logLevel)
        };

        this.client.trackTrace(telemetry);
    }

    /**
     * Converts an internal log level to an Application Insights severity level.
     * @param logLevel Log level to convert.
     * @returns Application Insights severity level.
     */
    private static logLevelToSeverityLevel(logLevel: LogLevel): SeverityLevel {
        switch (logLevel) {
            case LogLevel.None:
            case LogLevel.Trace:
                return SeverityLevel.Verbose;
            case LogLevel.Debug:
                return SeverityLevel.Verbose;
            case LogLevel.Information:
                return SeverityLevel.Information;
            case LogLevel.Warning:
                return SeverityLevel.Warning;
            case LogLevel.Error:
            case LogLevel.Critical:
                return SeverityLevel.Error;
            default:
                throw new ArgumentError("Unkown log level", "logLevel");
        }
    }
}
