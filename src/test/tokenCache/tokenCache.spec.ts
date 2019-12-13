import chai = require('chai');
import * as TypeMoq from 'typemoq';
import chaiAsPromised = require('chai-as-promised');
import { TokenProvider } from '../../app/contracts/tokenProvider';
import { AzureActiveDirectoryAppRegistrationTokenProvider } from '../../app/tokenCache/azureAdAppRegistrationTokenProvider';
import { Token } from '../../app/tokenCache/token';
import { TokenCache } from '../../app/contracts/tokenCache';
import { DefaultTokenCache } from '../../app/tokenCache/defaultTokenCache';
import { NoLogger } from '../../app/logging/noLogger';
import { Guid } from 'guid-typescript';
chai.use(chaiAsPromised);
const expect = chai.expect;

describe('Resilence', () => {
  describe('Token Cache', () => {
    const logger = new NoLogger();
    it('Should query token provider for a token on first call', async () => {
      // Arrange
      const accessToken = 'This is the access token';
      const expires = new Date();
      const token = new Token(accessToken, expires);
      const mock = TypeMoq.Mock.ofType<TokenProvider>();
      mock
        .setup(d => d.getToken(TypeMoq.It.isAny()))
        .returns(() => Promise.resolve(token));
      const cache: TokenCache = new DefaultTokenCache(mock.object, logger);

      // Act
      const result = await cache.getToken(Guid.createEmpty());
      mock.verify(d => d.getToken(Guid.createEmpty()), TypeMoq.Times.once());

      // Assert
      expect(result.accessToken).to.equal(accessToken);
      expect(result.expires.toISOString()).to.equal(expires.toISOString());
    });
    it('Should not query token provider for a token on a third call', async () => {
      // Arrange
      const accessToken = 'This is the access token';
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() + 300);
      const token = new Token(accessToken, expires);
      const mockProvider = TypeMoq.Mock.ofType<TokenProvider>();
      mockProvider
        .setup(d => d.getToken(TypeMoq.It.isAny()))
        .returns(() => Promise.resolve(token));
      const cache: TokenCache = new DefaultTokenCache(
        mockProvider.object,
        logger
      );

      // Act
      let result = await cache.getToken(Guid.createEmpty());
      result = await cache.getToken(Guid.createEmpty());
      result = await cache.getToken(Guid.createEmpty());
      mockProvider.verify(
        d => d.getToken(Guid.createEmpty()),
        TypeMoq.Times.once()
      );

      // Assert
      expect(result.accessToken).to.equal(accessToken);
      expect(result.expires.toISOString()).to.equal(expires.toISOString());
    });
    it('Should query token provider for an expired token on a second call', async () => {
      // Arrange
      const accessToken = 'This is the access token';
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() - 30);
      const token = new Token(accessToken, expires);
      const mock = TypeMoq.Mock.ofType<TokenProvider>();
      mock
        .setup(d => d.getToken(TypeMoq.It.isAny()))
        .returns(() => Promise.resolve(token));
      const cache: TokenCache = new DefaultTokenCache(mock.object, logger);

      // Act
      let result = await cache.getToken(Guid.createEmpty());
      result = await cache.getToken(Guid.createEmpty());
      mock.verify(d => d.getToken(Guid.createEmpty()), TypeMoq.Times.atMost(2));

      // Assert
      expect(result.accessToken).to.equal(accessToken);
      expect(result.expires.toISOString()).to.equal(expires.toISOString());
    });
    it('Should query token provider for an expired token on a second call in edge case', async () => {
      // Arrange
      const accessToken = 'This is the access token';
      const expires = new Date();
      expires.setSeconds(expires.getSeconds() - 40);
      const token = new Token(accessToken, expires);
      const mock = TypeMoq.Mock.ofType<TokenProvider>();
      mock
        .setup(d => d.getToken(TypeMoq.It.isAny()))
        .returns(() => Promise.resolve(token));
      const cache: TokenCache = new DefaultTokenCache(mock.object, logger);

      // Act
      let result = await cache.getToken(Guid.createEmpty());
      result = await cache.getToken(Guid.createEmpty());
      mock.verify(d => d.getToken(Guid.createEmpty()), TypeMoq.Times.atMost(2));

      // Assert
      expect(result.accessToken).to.equal(accessToken);
      expect(result.expires.toISOString()).to.equal(expires.toISOString());
    });
  });
});
