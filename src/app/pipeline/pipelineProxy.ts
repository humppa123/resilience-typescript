import { ResilienceProxy } from '../contracts/resilienceProxy';
import { Guard } from '../utils/guard';
import { PipelineItem } from './PipelineItem';
import { Guid } from 'guid-typescript';

/**
 * A pipeline that combies multiple resilience proxies.
 */
export class PipelineProxy implements ResilienceProxy {
  /**
   * Gets the start element of the pipeline.
   */
  private readonly start: PipelineItem;

  /**
   * Initializes a new instance of the @see Pipeline class.
   * @param proxies A ordered list of proxies to create the pipeline from.
   */
  constructor(proxies: ResilienceProxy[]) {
    Guard.throwIfNullOrEmpty(proxies, 'proxies');

    this.start = this.generatePipeline(proxies);
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
    const result = await this.start.execute(func, requestId);
    return result;
  }

  /**
   * Generates the pipeline from the proxies.
   * @param proxies Proxies to use.
   * @returns A resilience pipeline.
   */
  private generatePipeline(proxies: ResilienceProxy[]): PipelineItem {
    const reversed = proxies.reverse();
    let previous: PipelineItem = null;
    for (const proxy of reversed) {
      const current = new PipelineItem(proxy, previous);
      previous = current;
    }

    return previous;
  }
}
