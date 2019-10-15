import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { IResilienceProxy } from "../../app/contracts/resilienceProxy";
import { PassThroughProxy } from "../../app/resilience/passThroughProxy";
import { PipelineProxy } from "../../app/pipeline/pipelineProxy";
import { ErrorProxy } from "../../app/resilience/errorProxy";
import { Guid } from "guid-typescript";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Pipeline", () => {
        it("Should return func result if all proxies succeed", async () => {
            // Arrange
            const proxies: IResilienceProxy[] = [];
            proxies.push(new PassThroughProxy());
            proxies.push(new PassThroughProxy());
            proxies.push(new PassThroughProxy());
            const successMessage = "This is a success!";
            const pipeline = new PipelineProxy(proxies);
            const func = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await pipeline.execute(func, Guid.createEmpty());

            // Assert
            expect(result).to.equal(successMessage);
        });
        it("Should throw error if func rejects on last proxy.", async () => {
            // Arrange
            const errorMessage = "This is an error message!";
            const proxies: IResilienceProxy[] = [];
            proxies.push(new PassThroughProxy());
            proxies.push(new PassThroughProxy());
            proxies.push(new ErrorProxy(errorMessage));
            const pipeline = new PipelineProxy(proxies);
            const func = async (): Promise<string> => {
                return errorMessage;
            };

            // Act
            // Assert
            await expect(pipeline.execute(func, Guid.createEmpty())).to.be.rejectedWith(Error);
        });
        it("Should throw error if func rejects on any proxy.", async () => {
            // Arrange
            const errorMessage = "This is an error message!";
            const proxies: IResilienceProxy[] = [];
            proxies.push(new PassThroughProxy());
            proxies.push(new ErrorProxy(errorMessage));
            proxies.push(new PassThroughProxy());
            const pipeline = new PipelineProxy(proxies);
            const func = async (): Promise<string> => {
                return errorMessage;
            };

            // Act
            // Assert
            await expect(pipeline.execute(func, Guid.createEmpty())).to.be.rejectedWith(Error);
        });
        it("Should throw error if func rejects on first proxy.", async () => {
            // Arrange
            const errorMessage = "This is an error message!";
            const proxies: IResilienceProxy[] = [];
            proxies.push(new ErrorProxy(errorMessage));
            proxies.push(new PassThroughProxy());
            proxies.push(new PassThroughProxy());
            const pipeline = new PipelineProxy(proxies);
            const func = async (): Promise<string> => {
                return errorMessage;
            };

            // Act
            // Assert
            await expect(pipeline.execute(func, Guid.createEmpty())).to.be.rejectedWith(Error);
        });
    });
});
