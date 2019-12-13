/**
 * A token issued for an Azure Active Directory App Registration.
 */
export class AzureAdAppRegistrationToken {
  /**
   * Indicates the token type value. The only type that Azure AD supports is Bearer
   */
  // tslint:disable-next-line:variable-name
  token_type: string;
  /**
   * How long the access token is valid (in seconds).
   */
  // tslint:disable-next-line:variable-name
  expires_in: number;
  /**
   * The requested access token. The app can use this token to authenticate to the secured resource, such as a web API.
   */
  // tslint:disable-next-line:variable-name
  access_token: string;
}
