import { RetryError } from "./retryError";
import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guard } from "../utils/guard";
import { ILogger } from "../contracts/logger";
import { logFormatter } from "./utils";
import { Guid } from "guid-typescript";

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
     * @param guid Request Guid.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, guid: Guid): Promise<TResult> {
        let innerError: Error;
        for (let i = 0; i < this.retries; i++) {
            try {
                this.logger.trace(guid, `Starting Retry ${i}/${this.retries}`, null, logFormatter);
                const result = await func();
                this.logger.trace(guid, `Retry ${i}/${this.retries} successful`, null, logFormatter);
                return result;
            } catch (error) {
                this.logger.warning(guid, `Retry ${i}/${this.retries} failed`, error, logFormatter);
                innerError = error;
            }
        }

        const errorMessage = `Retries exceeded after ${this.retries} times`;
        this.logger.error(guid, errorMessage, innerError, logFormatter);
        throw new RetryError(errorMessage, innerError);
    }
}
