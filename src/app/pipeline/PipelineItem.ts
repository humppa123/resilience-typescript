import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Guid } from 'guid-typescript';

/**
 * An item in the resilience pipeline.
 */
export class PipelineItem implements ResilienceProxy {
  /**
   * Gets the reference to the previous pipeline item.
   */
  private readonly previous: PipelineItem;
  /**
   * Gets the resilience proxy of the current pipeline item.
   */
  private readonly proxy: ResilienceProxy;

  /**
   * Initializes a new instance of the @see PipelineItem class.
   * @param proxy The resilience proxy for the current pipeline item.
   * @param previous The reference to the previous pipeline item. Can be null to indicate the first item in the chain.
   */
  constructor(proxy: ResilienceProxy, previous: PipelineItem) {
    this.proxy = proxy;
    this.previous = previous;
  }

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
    if (this.previous) {
      const previousResult = async () => this.previous.execute(func, requestId);
      const result = await this.proxy.execute(previousResult, requestId);
      return result;
    } else {
      const result = await this.proxy.execute(func, requestId);
      return result;
    }
  }
}
