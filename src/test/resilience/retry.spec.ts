import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { RetryProxy } from "../../app/resilience/retryProxy";
import { RetryError } from "../../app/resilience/retryError";
import { NoLogger } from "../../app/logging/noLogger";
import { Guid } from "guid-typescript";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Retry", () => {
        const logger = new NoLogger();
        it("Should throw retry exception if retry count is exceeded", async () => {
            // Arrange
            const errorMessage = "This is the inner exception";
            const retries = 7;
            const retry = new RetryProxy(retries, logger);
            const fails = async () => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(retry.execute(fails, Guid.createEmpty())).to.be.rejectedWith(RetryError);
        });
        it("Should succeed if last try is successful", async () => {
            // Arrange
            const errorMessage = "This is the inner exception";
            const successMessage = "This is a success!";
            const retries = 13;
            const retry = new RetryProxy(retries, logger);
            const expectedRetries = 11;
            let i = 0;
            const successOnLastTry = async () => {
                if (i < expectedRetries) {
                    i++;
                    throw new Error(errorMessage);
                }

                return successMessage;
            };

            // Act
            const result = await retry.execute(successOnLastTry, Guid.createEmpty());

            // Assert
            expect(result).to.equal(successMessage);
            expect(i).to.equal(expectedRetries);
        });
        it("Should succeed on first successful try", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const expectedRetries = 1;
            const retries = 1;
            let i = 0;
            const retry = new RetryProxy(retries, logger);
            const successOnFirstTry = async () => {
                i++;
                return successMessage;
            };

            // Act
            const result = await retry.execute(successOnFirstTry, Guid.createEmpty());

            // Assert
            expect(result).to.equal(successMessage);
            expect(retries).to.equal(expectedRetries);
        });
    });
});
