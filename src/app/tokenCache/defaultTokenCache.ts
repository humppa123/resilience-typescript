import { ITokenCache } from "../contracts/tokenCache";
import { ITokenProvider } from "../contracts/tokenProvider";
import { Token } from "./token";
import { Guard } from "../utils/guard";
import { ILogger } from "../contracts/logger";
import { logFormatter } from "../resilience/utils";

/**
 * The default token cache implementation.
 */
export class DefaultTokenCache implements ITokenCache {
    /**
     * The provider to get new tokens from.
     */
    private readonly provider: ITokenProvider;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;
    /**
     * The current cached token.
     */
    private token: Token;

    /**
     * Initializes a new instance of the @see DefaultTokenCache class.
     * @param provider Provider for the tokens.
     * @param logger Logger to use.
     */
    constructor(provider: ITokenProvider, logger: ILogger<string>) {
        Guard.throwIfNullOrEmpty(provider, "provider");

        this.provider = provider;
        this.logger = logger;
    }

    /**
     * Gets an access token.
     */
    public async getToken(): Promise<Token> {
        this.logger.trace(`Requesting token from cache`, null, logFormatter);
        if (!this.token || this.hasExpired(this.token)) {
            this.logger.warning(`Token in cache empty or expired, requesting new from provider`, null, logFormatter);
            this.token = await this.provider.getToken();
        } else {
            this.logger.trace(`Using token from cache`, null, logFormatter);
        }

        return this.token;
    }

    /**
     * Gets a value indicating whether a token has already expired.
     * @param token Token to check if has expired.
     */
    public hasExpired(token: Token): boolean {
        const now = new Date().getTime();
        // We already get a new token if is less then a minute valid.
        const expires = new Date(token.expires);
        expires.setSeconds(expires.getSeconds() + 60);
        const expiresTime = expires.getTime();
        if (expiresTime > now) {
            return false;
        }

        return true;
    }
}
