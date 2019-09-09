/**
 * A bearer token for authentication on a web resource.
 */
export class Token {
    /**
     * The access token for a resource.
     */
    public readonly accessToken: string;
    /**
     * Expiration timestamp for this token.
     */
    public readonly expires: Date;

    /**
     * Initializes a new instance of the @see Token class.
     * @param accessToken The access token for a resource.
     * @param expires Expiration timestamp for this token.
     */
    constructor(accessToken: string, expires: Date) {
        this.accessToken = accessToken;
        this.expires = expires;
    }
}
