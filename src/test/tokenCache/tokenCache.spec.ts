import chai = require("chai");
import * as TypeMoq from "typemoq";
import chaiAsPromised = require("chai-as-promised");
import { ITokenProvider } from "../../app/tokenCache/tokenProvider";
import { AzureActiveDirectoryAppRegistrationTokenProvider } from "../../app/tokenCache/azureAdAppRegistrationTokenProvider";
import { Token } from "../../app/tokenCache/token";
import { ITokenCache } from "../../app/tokenCache/tokenCache";
import { DefaultTokenCache } from "../../app/tokenCache/defaultTokenCache";
import { NoLogger } from "../../app/logging/noLogger";
chai.use(chaiAsPromised);
const expect = chai.expect;

describe("Resilence", () => {
    describe("Token Cache", () => {
        const logger = new NoLogger();
        it("Should return a proper AAD token", async () => {
            // Arrange
            const baseUrl = "https://login.microsoftonline.com";
            const clientId = "b8aa2950-7bfe-41c4-bba0-4b134f755378";
            const clientSecret = "EzKAq4WTcyIkLzxr4wjPuKc7LQMPIZfjdlHcw7lKsVo=";
            const tenantId = "0c38f499-ffed-49dc-a319-60b30fb03e68";
            const provider: ITokenProvider = new AzureActiveDirectoryAppRegistrationTokenProvider(baseUrl, clientId, clientSecret, tenantId, logger);

            // Act
            const result = await provider.getToken();

            // Assert
            expect(result.accessToken).to.not.equal("");
            expect(result.expires).to.not.equal(0);
        });

        it("Should query token provider for a token on first call", async () => {
            // Arrange
            const accessToken = "This is the access token";
            const expires = new Date();
            const token = new Token(accessToken, expires);
            const mock = TypeMoq.Mock.ofType<ITokenProvider>();
            mock.setup(d => d.getToken()).returns(() => Promise.resolve(token));
            const cache: ITokenCache = new DefaultTokenCache(mock.object, logger);

            // Act
            const result = await cache.getToken();
            mock.verify(d => d.getToken(), TypeMoq.Times.once());

            // Assert
            expect(result.accessToken).to.equal(accessToken);
            expect(result.expires.toISOString()).to.equal(expires.toISOString());
        });
        it("Should not query token provider for a token on a third call", async () => {
            // Arrange
            const accessToken = "This is the access token";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() - 300);
            const token = new Token(accessToken, expires);
            const mock = TypeMoq.Mock.ofType<ITokenProvider>();
            mock.setup(d => d.getToken()).returns(() => Promise.resolve(token));
            const cache: ITokenCache = new DefaultTokenCache(mock.object, logger);

            // Act
            let result = await cache.getToken();
            result = await cache.getToken();
            mock.verify(d => d.getToken(), TypeMoq.Times.once());

            // Assert
            expect(result.accessToken).to.equal(accessToken);
            expect(result.expires.toISOString()).to.equal(expires.toISOString());
        });
        it("Should query token provider for an expired token on a second call", async () => {
            // Arrange
            const accessToken = "This is the access token";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() - 30);
            const token = new Token(accessToken, expires);
            const mock = TypeMoq.Mock.ofType<ITokenProvider>();
            mock.setup(d => d.getToken()).returns(() => Promise.resolve(token));
            const cache: ITokenCache = new DefaultTokenCache(mock.object, logger);

            // Act
            let result = await cache.getToken();
            result = await cache.getToken();
            mock.verify(d => d.getToken(), TypeMoq.Times.atMost(2));

            // Assert
            expect(result.accessToken).to.equal(accessToken);
            expect(result.expires.toISOString()).to.equal(expires.toISOString());
        });
        it("Should query token provider for an expired token on a second call in edge case", async () => {
            // Arrange
            const accessToken = "This is the access token";
            const expires = new Date();
            expires.setSeconds(expires.getSeconds() - 40);
            const token = new Token(accessToken, expires);
            const mock = TypeMoq.Mock.ofType<ITokenProvider>();
            mock.setup(d => d.getToken()).returns(() => Promise.resolve(token));
            const cache: ITokenCache = new DefaultTokenCache(mock.object, logger);

            // Act
            let result = await cache.getToken();
            result = await cache.getToken();
            mock.verify(d => d.getToken(), TypeMoq.Times.atMost(2));

            // Assert
            expect(result.accessToken).to.equal(accessToken);
            expect(result.expires.toISOString()).to.equal(expires.toISOString());
        });
    });
});
