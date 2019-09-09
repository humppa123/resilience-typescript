import { IResilienceProxy } from "./resilienceProxy";
import { TimeoutError } from "./timeoutError";
import { Guard } from "../utils/guard";
import { ILogger } from "../logging/logger";
import { logFormatter } from "./utils";

/**
 * A resiliency proxy that checks if a function returns in a given time or throws a timeout error.
 */
export class TimeoutProxy implements IResilienceProxy {
    /**
     * Timeout in MS within function must succeed or else a timeout error is thrown.
     */
    private readonly timeoutMs: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see TimeoutProxy class.
     * @param retries Timeout in MS within function must succeed or else a timeout error is thrown.
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
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>): Promise<TResult> {
        let id: NodeJS.Timeout;

        this.logger.trace(`Starting Timeout`, null, logFormatter);
        return Promise.race<TResult>([
            func(),
            new Promise<TResult>((resolve, reject) => {
            id = setTimeout(() => {
                const timeoutError = new TimeoutError(`Timeout occurred after ${this.timeoutMs}ms`);
                this.logger.error(null, timeoutError, logFormatter);
                reject(timeoutError);
            }, this.timeoutMs);
            }),
        ]).then((v) => {
            clearTimeout(id);
            this.logger.trace(`Timeout successful`, null, logFormatter);
            return v;
        }, (err) => {
            clearTimeout(id);
            this.logger.error(`Function provided in Timeout failed`, err, logFormatter);
            throw new TimeoutError(`Function provided in Timeout failed`, err);
        });
    }
}
