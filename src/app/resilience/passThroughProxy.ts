import { IResilienceProxy } from "./resilienceProxy";

/**
 * A proxy for testing that passes the func only through.
 */
export class PassThroughProxy implements IResilienceProxy {
    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @returns The result of the executed function.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>): Promise<TResult> {
        const result = await func();
        return result;
    }
}
