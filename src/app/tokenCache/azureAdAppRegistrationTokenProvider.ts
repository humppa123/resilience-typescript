import { ITokenProvider } from "../contracts/tokenProvider";
import * as qs from "querystring";
import Axios from "axios";
import {AxiosRequestConfig } from "axios";
import { Token } from "./token";
import { Guard } from "../utils/guard";
import { AzureAdAppRegistrationToken } from "./azureAdAppRegistrationToken";
import { ILogger } from "../contracts/logger";
import { logFormatter } from "../resilience/utils";

/**
 * Token provider for an Azure Active Directory App Registration.
 */
export class AzureActiveDirectoryAppRegistrationTokenProvider implements ITokenProvider {
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
    private readonly logger: ILogger<string>;

    /**
     * Initializes a new instance of the @see AzureActiveDirectoryAppRegistrationTokenProvider class.
     * @param baseUrl The base URL for the token endpoint, e.g. 'https://login.microsoftonline.com'
     * @param clientId The Id of the application registration.
     * @param clientSecret The secret for the application registration.
     * @param tenantId  The Id of the Azure Active Directory tenant.
     * @param logger Logger to use.
     */
    constructor(baseUrl: string, clientId: string, clientSecret: string, tenantId: string, logger: ILogger<string>) {
        Guard.throwIfNullOrEmpty(baseUrl, "baseUrl");
        Guard.throwIfNullOrEmpty(clientId, "clientId");
        Guard.throwIfNullOrEmpty(clientSecret, "clientSecret");
        Guard.throwIfNullOrEmpty(tenantId, "tenantId");

        this.requestOptions = {} as AxiosRequestConfig;
        this.requestOptions.baseURL = baseUrl;
        this.requestOptions.headers = { "Content-Type": "application/x-www-form-urlencoded" };
        this.request = qs.stringify({
            client_id: clientId,
            scope: `${clientId}/.default`,
            client_secret: clientSecret,
            grant_type: "client_credentials",
        });

        this.tenantId = tenantId;
        this.clientId = clientId;
        this.logger = logger;
    }

    /**
     * Gets an access token.
     * @returns An access token.
     */
    public async getToken(): Promise<Token> {
        this.logger.trace(`Requesting token for Azure Ad App ${this.clientId} in Tenant ${this.tenantId}`, null, logFormatter);
        const response = await Axios.post<AzureAdAppRegistrationToken>(`${this.tenantId}/oauth2/v2.0/token`, this.request, this.requestOptions);
        const aadToken = response.data;
        const expires = new Date();
        expires.setSeconds(expires.getUTCSeconds() + aadToken.expires_in);
        this.logger.trace(`Token for Azure Ad App ${this.clientId} received, valid until ${expires.toUTCString()}`, null, logFormatter);
        return new Token(aadToken.access_token, expires);
    }
}
