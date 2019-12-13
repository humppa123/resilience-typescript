import { Guid } from 'guid-typescript';

/**
 * A proxy for a resiliency operation.
 */
export interface ResilienceProxy {
  /**
   * Executes a function within a resilience proxy.
   * @param func Function to execute within the resilience proxy.
   * @param requestId Request Guid.
   * @returns The result of the executed function.
   */
  execute<TResult>(
    func: (...args: any[]) => Promise<TResult>,
    requestId: Guid
  ): Promise<TResult>;
}
