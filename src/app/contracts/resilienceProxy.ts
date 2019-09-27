/**
 * A proxy for a resiliency operation.
 */
export interface IResilienceProxy {
    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @returns The result of the executed function.
     */
    execute<TResult>(func: (...args: any[]) => Promise<TResult>): Promise<TResult>;
}