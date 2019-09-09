import { RetryError } from "./retryError";
import { IResilienceProxy } from "./resilienceProxy";
import { Guard } from "../utils/guard";
import { ILogger } from "../logging/logger";
import { logFormatter } from "./utils";

/**
 * A resiliency proxy that tries a function n times before failing with a retry error.
 */
export class RetryProxy implements IResilienceProxy {
    /**
     * Number of retries to execute.
     */
    private readonly retries: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see RetryProxy class.
     * @param retries Number of retries to execute.
     * @param logger Logger to use.
     */
    constructor(retries: number, logger: ILogger<string>) {
        Guard.throwIfNullOrEmpty(retries, "retries");
        Guard.throwIfNullOrEmpty(logger, "logger");

        this.retries = retries;
        this.logger = logger;
    }

    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>): Promise<TResult> {
        let innerError: Error;
        for (let i = 0; i < this.retries; i++) {
            try {
                this.logger.trace(`Starting Retry ${i}`, null, logFormatter);
                const result = await func();
                this.logger.trace(`Retry ${i} successful`, null, logFormatter);
                return result;
            } catch (error) {
                this.logger.debug(`Retry ${i} failed`, error, logFormatter);
                innerError = error;
            }
        }

        this.logger.error(`Retry failed after ${this.retries} times`, innerError, logFormatter);
        throw new RetryError(`Retries exceeded after ${this.retries} tries`, innerError);
    }
}
