import chai = require("chai");
import chaiAsPromised = require("chai-as-promised");
import { TestLogger } from "../../app/logging/testLogger";
import { LogLevel } from "../../app/logging/logLevel";
import { ILogger } from "../../app/logging/logger";
import { ITokenProvider } from "../../app/tokenCache/tokenProvider";
import { AzureActiveDirectoryAppRegistrationTokenProvider } from "../../app/tokenCache/azureAdAppRegistrationTokenProvider";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Token Cache", () => {
        it("Should return a proper AAD token", async () => {
            // Arrange
            const baseUrl = "https://login.microsoftonline.com";
            const clientId = "b8aa2950-7bfe-41c4-bba0-4b134f755378";
            const clientSecret = "EzKAq4WTcyIkLzxr4wjPuKc7LQMPIZfjdlHcw7lKsVo=";
            const tenantId = "0c38f499-ffed-49dc-a319-60b30fb03e68";
            const logger: ILogger<string> = new TestLogger(LogLevel.Trace);
            const provider: ITokenProvider = new AzureActiveDirectoryAppRegistrationTokenProvider(baseUrl, clientId, clientSecret, tenantId, logger);

            // Act
            const result = await provider.getToken();

            // Assert
            expect(result.accessToken).to.not.equal("");
            expect(result.expires).to.not.equal(0);
        });
    });
});
