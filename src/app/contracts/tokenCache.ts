import { Token } from "../tokenCache/token";
import { Guid } from "guid-typescript";

/**
 * A token cache.
 */
export interface ITokenCache {
    /**
     * Gets an access token.
     * @param guid Request Guid.
     */
    getToken(guid?: Guid): Promise<Token>;
}
