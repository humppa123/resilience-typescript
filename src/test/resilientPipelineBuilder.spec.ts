import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { ResilientPipelineBuilder } from "../app/resilientPipelineBuilder";
import { NoLogger } from "../app/logging/noLogger";
import { RetryProxy } from "../app/resilience/retryProxy";
import { TimeSpansInMilliSeconds } from "../app/utils/timespans";
import { Guid } from "guid-typescript";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Resilient Pipeline Builder", () => {
        it("Should return func result if all proxies succeed", async () => {
            // Arrange
            const pipeline = ResilientPipelineBuilder
                .New()
                .addProxy(1, new RetryProxy(2, new NoLogger()))
                .useCircuitBreaker(2, TimeSpansInMilliSeconds.TenMinutes, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(3, 3)
                .useTimeout(4, TimeSpansInMilliSeconds.OneHundredMilliSeconds)
                .build();
            const successMessage = "This is a success!";
            const func = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await pipeline.execute(func, Guid.createEmpty());

            // Assert
            expect(result).to.equal(successMessage);
        });
        it("Should throw error if func throws", async () => {
            // Arrange
            const pipeline = ResilientPipelineBuilder
                .New()
                .useCustomLogger(new NoLogger())
                .addProxy(1, new RetryProxy(2, new NoLogger()))
                .useCircuitBreaker(2, TimeSpansInMilliSeconds.TenMinutes, TimeSpansInMilliSeconds.TenMinutes, 10)
                .useRetry(3, 3)
                .useTimeout(4, TimeSpansInMilliSeconds.OneHundredMilliSeconds)
                .build();
            const errorMessage = "This is an error!";
            const func = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(pipeline.execute(func, Guid.createEmpty())).to.be.rejectedWith(Error);
        });
        it("Should throw error on doubled positions in circuit breaker", (done) => {
            // Arrange
            const doubledPosition = 13;
            const pipeline = ResilientPipelineBuilder
                .New()
                .useCustomLogger(new NoLogger())
                .addProxy(doubledPosition, new RetryProxy(2, new NoLogger()));

            // Act
            // Assert
            expect(() => pipeline.useCircuitBreaker(doubledPosition, TimeSpansInMilliSeconds.OneHundredMilliSeconds, TimeSpansInMilliSeconds.TenMinutes, 5)).to.throw();

            // Cleanup
            done();
        });
        it("Should throw error on doubled positions in retry", (done) => {
            // Arrange
            const doubledPosition = 13;
            const pipeline = ResilientPipelineBuilder
                .New()
                .useCustomLogger(new NoLogger())
                .addProxy(doubledPosition, new RetryProxy(2, new NoLogger()));

            // Act
            // Assert
            expect(() => pipeline.useRetry(doubledPosition, 5)).to.throw();

            // Cleanup
            done();
        });
        it("Should throw error on doubled positions in timeout", (done) => {
            // Arrange
            const doubledPosition = 13;
            const pipeline = ResilientPipelineBuilder
                .New()
                .useCustomLogger(new NoLogger())
                .addProxy(doubledPosition, new RetryProxy(2, new NoLogger()));

            // Act
            // Assert
            expect(() => pipeline.useTimeout(doubledPosition, TimeSpansInMilliSeconds.OneHundredMilliSeconds)).to.throw();

            // Cleanup
            done();
        });
        it("Should throw error on doubled positions in custom proxy", (done) => {
            // Arrange
            const doubledPosition = 13;
            const pipeline = ResilientPipelineBuilder
                .New()
                .useCustomLogger(new NoLogger())
                .useTimeout(doubledPosition, TimeSpansInMilliSeconds.OneHundredMilliSeconds);

            // Act
            // Assert
            expect(() => pipeline.addProxy(doubledPosition, new RetryProxy(2, new NoLogger()))).to.throw();

            // Cleanup
            done();
        });
    });
});
