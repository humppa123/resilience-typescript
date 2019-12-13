import { TokenProvider } from '../contracts/tokenProvider';
import * as qs from 'querystring';
import Axios from 'axios';
import { AxiosRequestConfig } from 'axios';
import { Token } from './token';
import { Guard } from '../utils/guard';
import { AzureAdAppRegistrationToken } from './azureAdAppRegistrationToken';
import { Logger } from '../contracts/logger';
import { logFormatter } from '../resilience/utils';
import { Guid } from 'guid-typescript';
import { TokenProviderError } from './tokenProviderError';

/**
 * Token provider for an Azure Active Directory App Registration.
 */
export class AzureActiveDirectoryAppRegistrationTokenProvider
  implements TokenProvider {
  /**
   * The web request options.
   */
  private readonly requestOptions: AxiosRequestConfig;
  /**
   * The stringified request forms parameter.
   */
  private readonly request: string;
  /**
   * The Id of the Azure Active Directory tenant.
   */
  private readonly tenantId: string;
  /**
   * The Id of the application registration.
   */
  private readonly clientId: string;
  /**
   * The logger to use.
   */
  private readonly logger: Logger<string>;

  /**
   * Initializes a new instance of the @see AzureActiveDirectoryAppRegistrationTokenProvider class.
   * @param baseUrl The base URL for the token endpoint, e.g. 'https://login.microsoftonline.com'.
   * @param clientId The Id of the application registration.
   * @param clientSecret The secret for the application registration.
   * @param tenantId  The Id of the Azure Active Directory tenant.
   * @param logger Logger to use.
   */
  constructor(
    baseUrl: string,
    clientId: string,
    clientSecret: string,
    tenantId: string,
    logger: Logger<string>
  ) {
    Guard.throwIfNullOrEmpty(baseUrl, 'baseUrl');
    Guard.throwIfNullOrEmpty(clientId, 'clientId');
    Guard.throwIfNullOrEmpty(clientSecret, 'clientSecret');
    Guard.throwIfNullOrEmpty(tenantId, 'tenantId');

    this.requestOptions = {} as AxiosRequestConfig;
    this.requestOptions.baseURL = baseUrl;
    this.requestOptions.headers = {
      'Content-Type': 'application/x-www-form-urlencoded',
    };
    this.request = qs.stringify({
      client_id: clientId,
      scope: `${clientId}/.default`,
      client_secret: clientSecret,
      grant_type: 'client_credentials',
    });

    this.tenantId = tenantId;
    this.clientId = clientId;
    this.logger = logger;
  }

  /**
   * Gets an access token.
   * @param requestId Request Guid.
   * @returns An access token.
   */
  async getToken(requestId?: Guid): Promise<Token> {
    this.logger.trace(
      requestId,
      `Requesting token for Azure Ad App ${this.clientId} in Tenant ${this.tenantId}`,
      null,
      logFormatter
    );
    try {
      const response = await Axios.post<AzureAdAppRegistrationToken>(
        `${this.tenantId}/oauth2/v2.0/token`,
        this.request,
        this.requestOptions
      );
      const aadToken = response.data;
      const expires = new Date();
      expires.setSeconds(expires.getUTCSeconds() + aadToken.expires_in);
      this.logger.trace(
        requestId,
        `Token for Azure Ad App ${
          this.clientId
        } received, valid until ${expires.toUTCString()}`,
        null,
        logFormatter
      );
      return new Token(aadToken.access_token, expires);
    } catch (e) {
      const message = `Error requesting Token for Azure Ad App ${this.clientId}`;
      this.logger.error(requestId, message, e, logFormatter);
      throw new TokenProviderError(message, e);
    }
  }
}
