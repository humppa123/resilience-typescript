import chai = require('chai');
import chaiAsPromised = require('chai-as-promised');
import { LogLevel } from '../../app/logging/logLevel';
import { TestLogger } from '../../app/logging/testLogger';
import { Guid } from 'guid-typescript';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Resilence', () => {
  describe('Logger', () => {
    it("Should return log level correctly if minimum log level is 'None'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.None;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [LogLevel.None];
      const invalidLevels: LogLevel[] = [
        LogLevel.Trace,
        LogLevel.Debug,
        LogLevel.Information,
        LogLevel.Warning,
        LogLevel.Error,
        LogLevel.Critical,
      ];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Critical'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Critical;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [LogLevel.None, LogLevel.Critical];
      const invalidLevels: LogLevel[] = [
        LogLevel.Trace,
        LogLevel.Debug,
        LogLevel.Information,
        LogLevel.Warning,
        LogLevel.Error,
      ];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Error'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Error;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [
        LogLevel.None,
        LogLevel.Critical,
        LogLevel.Error,
      ];
      const invalidLevels: LogLevel[] = [
        LogLevel.Trace,
        LogLevel.Debug,
        LogLevel.Information,
        LogLevel.Warning,
      ];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Warning'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Warning;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [
        LogLevel.None,
        LogLevel.Critical,
        LogLevel.Error,
        LogLevel.Warning,
      ];
      const invalidLevels: LogLevel[] = [
        LogLevel.Trace,
        LogLevel.Debug,
        LogLevel.Information,
      ];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Information'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Information;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [
        LogLevel.None,
        LogLevel.Critical,
        LogLevel.Error,
        LogLevel.Warning,
        LogLevel.Information,
      ];
      const invalidLevels: LogLevel[] = [LogLevel.Trace, LogLevel.Debug];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Debug'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Debug;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [
        LogLevel.None,
        LogLevel.Critical,
        LogLevel.Error,
        LogLevel.Warning,
        LogLevel.Information,
        LogLevel.Debug,
      ];
      const invalidLevels: LogLevel[] = [LogLevel.Trace];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log level correctly if minimum log level is 'Trace'", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const logger = new TestLogger(minimumLogLevel);
      const validLevels: LogLevel[] = [
        LogLevel.None,
        LogLevel.Critical,
        LogLevel.Error,
        LogLevel.Warning,
        LogLevel.Information,
        LogLevel.Debug,
        LogLevel.Trace,
      ];
      const invalidLevels: LogLevel[] = [];

      // Act
      // Assert
      for (const logLevel of validLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(true);
      }

      for (const logLevel of invalidLevels) {
        const result = logger.isInLogLevel(logLevel);
        expect(result).to.equal(false);
      }
    });
    it("Should return log entry correctly on 'Trace' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Trace;
      const expectedState = 'This is the log state Trace';
      const expectedError = new Error('This is the error message Trace');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.trace(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'Debug' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Debug;
      const expectedState = 'This is the log state Debug';
      const expectedError = new Error('This is the error message Debug');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.debug(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'Information' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Information;
      const expectedState = 'This is the log state Information';
      const expectedError = new Error('This is the error message Information');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.information(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'Warning' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Warning;
      const expectedState = 'This is the log state Warning';
      const expectedError = new Error('This is the error message Warning');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.warning(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'Error' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Error;
      const expectedState = 'This is the log state Error';
      const expectedError = new Error('This is the error message Error');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.error(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'Critical' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.Critical;
      const expectedState = 'This is the log state Critical';
      const expectedError = new Error('This is the error message Critical');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.critical(expectedGuid, expectedState, expectedError, null);
    });
    it("Should return log entry correctly on 'None' level", () => {
      // Arrange
      const minimumLogLevel = LogLevel.Trace;
      const expectedLogLevel = LogLevel.None;
      const expectedState = 'This is the log state None';
      const expectedError = new Error('This is the error message None');
      const expectedGuid = Guid.create();
      const callback = (
        logLevel: LogLevel,
        guid: Guid,
        state: string,
        error: Error
      ) => {
        // Assert
        expect(logLevel).to.equal(expectedLogLevel);
        expect(state).to.equal(expectedState);
        expect(error.message).to.equal(expectedError.message);
        expect(guid.toString()).to.equal(expectedGuid.toString());
      };
      const logger = new TestLogger(minimumLogLevel, callback);

      // Act
      logger.none(expectedGuid, expectedState, expectedError, null);
    });
  });
});
