import { ResilienceWebProxy } from '../contracts/resilienceWebProxy';
import { Guard } from '../utils/guard';
import { ResilienceFactoryProxy } from '../contracts/resilienceFactoryProxy';
import { AxiosRequestBuilderWithPipeline } from './axiosRequestBuilderWithPipeline';
import { Maintance } from '../contracts/maintenance';

/**
 * Factory for web requests within a resilient pipeline.
 */
export class FactoryWebPipelineProxy {
  /**
   * Gets the pipeline.
   */
  private readonly pipeline: ResilienceWebProxy;
  /**
   * Gets the maintenance.
   */
  private readonly maint: Maintance;

  /**
   * Initializes a new instance of the @see FactoryWebPipelineProxy class.
   * @param pipeline Pipeline to use.
   */
  constructor(pipeline: ResilienceWebProxy, maintenance: Maintance) {
    Guard.throwIfNullOrEmpty(pipeline, 'pipeline');
    Guard.throwIfNullOrEmpty(maintenance, 'maintenance');

    this.pipeline = pipeline;
    this.maint = maintenance;
  }

  /**
   * Gets a new request builder for web requests.
   * @returns A new request builder for web requests.
   */
  request<TRequestBody>(): ResilienceFactoryProxy<TRequestBody> {
    const builder = AxiosRequestBuilderWithPipeline.new();
    builder.usePipeline(this.pipeline);
    return builder;
  }

  /**
   * Gets the maintenance.
   * @returns Maintenance for the pipeline.
   */
  maintenance(): Maintance {
    return this.maint;
  }
}
