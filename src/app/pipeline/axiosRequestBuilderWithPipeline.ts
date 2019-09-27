import { AxiosRequestBuilder } from "../axiosRequestBuilder.impl";
import { IResilienceWebProxy } from "../contracts/resilienceWebProxy";
import { Guard } from "../utils/guard";
import axios = require("axios");
import { IResilienceFactoryProxy } from "../contracts/resilienceFactoryProxy";

/**
 * An Axios request builder with a pipeline.
 */
export class AxiosRequestBuilderWithPipeline extends AxiosRequestBuilder implements IResilienceFactoryProxy {
    /**
     * Gets or sets the pipeline.
     */
    private pipeline: IResilienceWebProxy;

    /**
     * Gets a new builder.
     * @returns The builder.
     */
    public static new(): AxiosRequestBuilderWithPipeline {
        return new AxiosRequestBuilderWithPipeline();
    }

    /**
     * Uses a pipeline.
     * @param pipeline Pipeline to use.
     * @returns The builder.
     */
    public usePipeline(pipeline: IResilienceWebProxy): AxiosRequestBuilderWithPipeline {
        Guard.throwIfNullOrEmpty(pipeline, "pipeline");

        this.pipeline = pipeline;

        return this;
    }

    /**
     * Sends the request.
     * @param cacheKey Optional key for the cache.
     * @returns Web response.
     */
    public async execute<TResult>(cacheKey?: string): Promise<axios.AxiosResponse<TResult>> {
        const request = this.build();
        const result = await this.pipeline.execute<TResult>(request, cacheKey);
        return result;
    }
}
