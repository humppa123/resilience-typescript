import { RetryError } from './retryError';
import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Guard } from '../utils/guard';
import { Logger } from '../contracts/logger';
import { logFormatter } from './utils';
import { Guid } from 'guid-typescript';

/**
 * A resiliency proxy that tries a function n times before failing with a retry error.
 */
export class RetryProxy implements ResilienceProxy {
  /**
   * Number of retries to execute.
   */
  private readonly retries: number;
  /**
   * The logger to use.
   */
  private readonly logger: Logger<string>;

  /**
   * Initializes a new instance of the @see RetryProxy class.
   * @param retries Number of retries to execute.
   * @param logger Logger to use.
   */
  constructor(retries: number, logger: Logger<string>) {
    Guard.throwIfNullOrEmpty(retries, 'retries');
    Guard.throwIfNullOrEmpty(logger, 'logger');

    this.retries = retries;
    this.logger = logger;
  }

  /**
   * Executes a function within a resilience proxy.
   * @param func Function to execute within the resilience proxy.
   * @param requestId Request Guid.
   */
  async execute<TResult>(
    func: (...args: any[]) => Promise<TResult>,
    requestId: Guid
  ): Promise<TResult> {
    let innerError: Error;
    for (let i = 0; i < this.retries; i++) {
      try {
        this.logger.trace(
          requestId,
          `Starting Retry ${i}/${this.retries}`,
          null,
          logFormatter
        );
        const result = await func();
        this.logger.trace(
          requestId,
          `Retry ${i}/${this.retries} successful`,
          null,
          logFormatter
        );
        return result;
      } catch (error) {
        this.logger.warning(
          requestId,
          `Retry ${i}/${this.retries} failed`,
          error,
          logFormatter
        );
        innerError = error;
      }
    }

    const errorMessage = `Retries exceeded after ${this.retries} times`;
    this.logger.error(requestId, errorMessage, innerError, logFormatter);
    throw new RetryError(errorMessage, innerError);
  }
}
