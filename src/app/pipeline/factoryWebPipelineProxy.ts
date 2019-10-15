import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";
import { Guard } from "../utils/guard";
import { IResilienceFactoryProxy } from "../contracts/resilienceFactoryProxy";
import { AxiosRequestBuilderWithPipeline } from "./axiosRequestBuilderWithPipeline";
import { IMaintance } from "../contracts/maintenance";

/**
 * Factory for web requests within a resilient pipeline.
 */
export class FactoryWebPipelineProxy {
    /**
     * Gets the pipeline.
     */
    private readonly pipeline: IResilienceWebProxy;
    /**
     * Gets the maintenance.
     */
    private readonly maint: IMaintance;

    /**
     * Initializes a new instance of the @see FactoryWebPipelineProxy class.
     * @param pipeline Pipeline to use.
     */
    constructor(pipeline: IResilienceWebProxy, maintenance: IMaintance) {
        Guard.throwIfNullOrEmpty(pipeline, "pipeline");
        Guard.throwIfNullOrEmpty(maintenance, "maintenance");

        this.pipeline = pipeline;
        this.maint = maintenance;
    }

    /**
     * Gets a new request builder for web requests.
     * @returns A new request builder for web requests.
     */
    public request(): IResilienceFactoryProxy {
        const builder = AxiosRequestBuilderWithPipeline.new();
        builder.usePipeline(this.pipeline);
        return builder;
    }

    /**
     * Gets the maintenance.
     * @returns Maintenance for the pipeline.
     */
    public maintenance(): IMaintance {
        return this.maint;
    }
}
