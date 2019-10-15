import { IResilienceProxy } from "../contracts/resilienceProxy";
import { Guid } from "guid-typescript";

/**
 * An item in the resilience pipeline.
 */
export class PipelineItem implements IResilienceProxy {
    /**
     * Gets the reference to the previous pipeline item.
     */
    private readonly previous: PipelineItem;
    /**
     * Gets the resilience proxy of the current pipeline item.
     */
    private readonly proxy: IResilienceProxy;

    /**
     * Initializes a new instance of the @see PipelineItem class.
     * @param proxy The resilience proxy for the current pipeline item.
     * @param previous The reference to the previous pipeline item. Can be null to indicate the first item in the chain.
     */
    constructor(proxy: IResilienceProxy, previous: PipelineItem) {
        this.proxy = proxy;
        this.previous = previous;
    }

    /**
     * Executes a function within a resilience proxy.
     * @param func Function to execute within the resilience proxy.
     * @param guid Request Guid.
     * @returns The result of the executed function.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, guid: Guid): Promise<TResult> {
        if (this.previous) {
            const previousResult = async () => this.previous.execute(func, guid);
            const result = await this.proxy.execute(previousResult, guid);
            return result;
        } else {
            const result = await this.proxy.execute(func, guid);
            return result;
        }
    }
}
