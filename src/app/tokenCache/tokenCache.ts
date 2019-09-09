import { Token } from "./token";

/**
 * A token cache.
 */
export interface ITokenCache {
    /**
     * Gets an access token.
     */
    getToken(): Promise<Token>;
}
