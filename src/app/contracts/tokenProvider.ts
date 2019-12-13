import { Token } from '../tokenCache/token';
import { Guid } from 'guid-typescript';

/**
 * An access token provider.
 */
export interface TokenProvider {
  /**
   * Gets an access token.
   * @param Request Guid.
   * @returns An access token.
   */
  getToken(requestId?: Guid): Promise<Token>;
}
