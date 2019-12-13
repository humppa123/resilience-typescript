import { Token } from '../tokenCache/token';
import { Guid } from 'guid-typescript';

/**
 * A token cache.
 */
export interface TokenCache {
  /**
   * Gets an access token.
   * @param requestId Request Guid.
   */
  getToken(requestId?: Guid): Promise<Token>;
}
