import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { TimeoutError } from "../../app/resilience/timeoutError";
import { sleepAndReject } from "../../app/resilience/utils";
import { TimeoutProxy } from "../../app/resilience/timeoutProxy";
import { NoLogger } from "../../app/logging/noLogger";
import { TimeSpansInMilliSeconds } from "../../app/utils/timespans";
import { Guid } from "guid-typescript";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Timeout", () => {
        const logger = new NoLogger();
        it("Should throw timeout exception if timeout is faster than func", async () => {
            // Arrange
            const timeSpan = TimeSpansInMilliSeconds.TwoHundredMilliSeconds;
            const timeout = new TimeoutProxy(timeSpan, logger);
            const sleep = TimeSpansInMilliSeconds.OneHundredMilliSeconds;

            // Act
            // Assert
            await expect(timeout.execute(() => sleepAndReject(sleep), Guid.createEmpty())).to.be.rejectedWith(TimeoutError);
        });
        it("Should succeed if func is faster than timeout", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const timeSpan = TimeSpansInMilliSeconds.FiveHundredMilliSeconds;
            const timeout = new TimeoutProxy(timeSpan, logger);
            const fasterHarderScooter = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await timeout.execute(fasterHarderScooter, Guid.createEmpty());

            // Assert
            expect(result).to.equal(successMessage);
        });
        it("Should throw TimeoutException if func crashed", async () => {
            // Arrange
            const errorMessage = "This is an error!";
            const timeSpan = TimeSpansInMilliSeconds.FiveHundredMilliSeconds;
            const timeout = new TimeoutProxy(timeSpan, logger);
            const fasterHarderScooter = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(timeout.execute(fasterHarderScooter, Guid.createEmpty())).to.be.rejectedWith(TimeoutError);
        });
    });
});
