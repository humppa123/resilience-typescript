import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { TimeoutError } from "../../app/resilience/timeoutError";
import { sleepAndReject } from "../../app/resilience/utils";
import { TimeoutProxy } from "../../app/resilience/timeoutProxy";
import { NoLogger } from "../../app/logging/noLogger";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Timeout", () => {
        it("Should throw timeout exception if timeout is faster than func", async () => {
            // Arrange
            const timeSpan = 200;
            const timeout = new TimeoutProxy(timeSpan, new NoLogger());
            const sleep = 100;

            // Act
            // Assert
            await expect(timeout.execute(() => sleepAndReject(sleep))).to.be.rejectedWith(TimeoutError);
        });
        it("Should succeed if func is faster than timeout", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const timeSpan = 500;
            const timeout = new TimeoutProxy(timeSpan, new NoLogger());
            const fasterHarderScooter = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await timeout.execute(fasterHarderScooter);

            // Assert
            expect(result).to.equal(successMessage);
        });
        it("Should throw TimeoutException if func crashed", async () => {
            // Arrange
            const errorMessage = "This is an error!";
            const timeSpan = 500;
            const timeout = new TimeoutProxy(timeSpan, new NoLogger());
            const fasterHarderScooter = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(timeout.execute(fasterHarderScooter)).to.be.rejectedWith(TimeoutError);
        });
    });
});
