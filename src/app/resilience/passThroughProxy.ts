import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Guid } from 'guid-typescript';

/**
 * A proxy for testing that passes the func only through.
 */
export class PassThroughProxy implements ResilienceProxy {
  /**
   * Executes a function within a resilience proxy.
   * @param func Function to execute within the resilience proxy.
   * @param requestId Request Guid.
   * @returns The result of the executed function.
   */
  async execute<TResult>(
    func: (...args: any[]) => Promise<TResult>,
    requestId: Guid
  ): Promise<TResult> {
    const result = await func();
    return result;
  }
}
