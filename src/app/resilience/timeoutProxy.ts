import { IResilienceProxy } from "../contracts/resilienceProxy";
import { TimeoutError } from "./timeoutError";
import { Guard } from "../utils/guard";
import { ILogger } from "../contracts/logger";
import { logFormatter } from "./utils";
import { Guid } from "guid-typescript";

/**
 * A resiliency proxy that checks if a function returns in a given time or throws a timeout error.
 */
export class TimeoutProxy implements IResilienceProxy {
    /**
     * Timeout in milli seconds within function must succeed or else a timeout error is thrown.
     */
    private readonly timeoutMs: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see TimeoutProxy class.
     * @param timeoutMs Timeout in milli seconds within function must succeed or else a timeout error is thrown.
     * @param logger Logger to use.
     */
    constructor(timeoutMs: number, logger: ILogger<string>) {
        Guard.throwIfNullOrEmpty(timeoutMs, "timeoutMs");
        Guard.throwIfNullOrEmpty(logger, "logger");

        this.timeoutMs = timeoutMs;
        this.logger = logger;
    }

    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @param guid Request Guid.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, guid: Guid): Promise<TResult> {
        let id: NodeJS.Timeout;

        this.logger.trace(guid, `Starting Timeout`, null, logFormatter);
        return Promise.race<TResult>([
            func(),
            new Promise<TResult>((resolve, reject) => {
            id = setTimeout(() => {
                const timeoutError = new TimeoutError(`Timeout occurred after ${this.timeoutMs}ms`);
                this.logger.error(guid, null, timeoutError, logFormatter);
                reject(timeoutError);
            }, this.timeoutMs);
            }),
        ]).then((v) => {
            clearTimeout(id);
            this.logger.trace(guid, `Timeout successful`, null, logFormatter);
            return v;
        }, (err) => {
            clearTimeout(id);
            this.logger.error(guid, `Timeout failed`, err, logFormatter);
            throw new TimeoutError(`Timeout failed`, err);
        });
    }
}
