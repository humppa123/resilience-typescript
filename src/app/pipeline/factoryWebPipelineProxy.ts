import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";
import { Guard } from "../utils/guard";
import { IResilienceFactoryProxy } from "../contracts/resilienceFactoryProxy";
import { AxiosRequestBuilderWithPipeline } from "./axiosRequestBuilderWithPipeline";

/**
 * Factory for web requests within a resilient pipeline.
 */
export class FactoryWebPipelineProxy {
    /**
     * Gets the pipeline.
     */
    private readonly pipeline: IResilienceWebProxy;

    /**
     * Initializes a new instance of the @see FactoryWebPipelineProxy class.
     * @param pipeline Pipeline to use.
     */
    constructor(pipeline: IResilienceWebProxy) {
        Guard.throwIfNullOrEmpty(pipeline, "pipeline");

        this.pipeline = pipeline;
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
}
