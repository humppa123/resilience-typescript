/**
 * A token issued for an Azure Active Directory App Registration.
 */
export class AzureAdAppRegistrationToken {
    /**
     * Indicates the token type value. The only type that Azure AD supports is Bearer
     */
    public token_type: string;
    /**
     * How long the access token is valid (in seconds).
     */
    public expires_in: number;
    /**
     * The requested access token. The app can use this token to authenticate to the secured resource, such as a web API.
     */
    public access_token: string;
}
