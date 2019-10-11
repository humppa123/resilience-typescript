import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { NoLogger } from "../../app/logging/noLogger";
import { TimeSpansInMilliSeconds } from "../../app/utils/timespans";
import { CircuitBreakerProxy } from "../../app/resilience/circuitBreakerProxy";
import { CircuitBreakerState } from "../../app/resilience/circuitBreakerState";
import { CircuitBreakerError } from "../../app/resilience/circuitBreakerError";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Circuit Breaker", () => {
        const logger = new NoLogger();
        it("Should return func result if func resolves and state is closed", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 5;
            const initialState = CircuitBreakerState.Close;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await circuitBreaker.execute(func);

            // Assert
            expect(result).to.equal(successMessage);
        });
        it("Should return func result if func resolves and state is half open", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 5;
            const initialState = CircuitBreakerState.HalfOpen;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await circuitBreaker.execute(func);

            // Assert
            expect(result).to.equal(successMessage);
            expect(circuitBreaker.getState()).to.equal(CircuitBreakerState.Close);
        });
        it("Should return error if func rejects and state is open and max fails reached", async () => {
            // Arrange
            const errorMessage = "This is an error!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 1;
            const initialState = CircuitBreakerState.Open;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(circuitBreaker.execute(func)).to.be.rejectedWith(CircuitBreakerError);
            expect(circuitBreaker.getState()).to.equal(CircuitBreakerState.Open);
        });
        it("Should return error if func rejects and state is half open", async () => {
            // Arrange
            const errorMessage = "This is an error!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 5;
            const initialState = CircuitBreakerState.HalfOpen;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(circuitBreaker.execute(func)).to.be.rejectedWith(CircuitBreakerError);
            expect(circuitBreaker.getState()).to.equal(CircuitBreakerState.Open);
        });
        it("Should return error if func rejects and state is open", async () => {
            // Arrange
            const errorMessage = "This is an error!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 5;
            const initialState = CircuitBreakerState.Open;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                throw new Error(errorMessage);
            };

            // Act
            // Assert
            await expect(circuitBreaker.execute(func)).to.be.rejectedWith(CircuitBreakerError);
            expect(circuitBreaker.getState()).to.equal(CircuitBreakerState.Open);
        });
        it("Should return result if func resolves and state is open", async () => {
            // Arrange
            const successMessage = "This is a success!";
            const breakDuration = TimeSpansInMilliSeconds.OneSecond;
            const maxFailedCalls = 5;
            const initialState = CircuitBreakerState.Open;
            const leakTimeSpanInMilliSeconds = TimeSpansInMilliSeconds.TenMinutes;
            const circuitBreaker = new CircuitBreakerProxy(breakDuration, maxFailedCalls, leakTimeSpanInMilliSeconds, logger, null, initialState);
            const func = async (): Promise<string> => {
                return successMessage;
            };

            // Act
            const result = await circuitBreaker.execute(func);

            // Assert
            expect(result).to.equal(successMessage);
            expect(circuitBreaker.getState()).to.equal(CircuitBreakerState.Close);
        });
    });
});
