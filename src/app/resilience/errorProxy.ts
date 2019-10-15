import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guid } from "guid-typescript";

/**
 * A proxy for testing that always throws an error.
 */
export class ErrorProxy implements IResilienceProxy {
    /**
     * Gets the message for the error to throw.
     */
    private readonly errorMessage: string;

    /**
     * Initializes a new instance of the @see ErrorProxy class.
     * @param errorMessage Message for the error to throw.
     */
    constructor(errorMessage: string) {
        this.errorMessage = errorMessage;
    }

    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @param guid Request Guid.
     * @returns The result of the executed function.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, guid: Guid): Promise<TResult> {
        throw new Error(this.errorMessage);
    }
}
