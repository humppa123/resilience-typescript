import { Token } from "./token";

/**
 * An access token provider.
 */
export interface ITokenProvider {
    /**
     * Gets an access token.
     * @returns An access token.
     */
    getToken(): Promise<Token>;
}
