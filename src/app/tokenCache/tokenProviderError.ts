/**
 * An error that occurs in a token provider.
 */
export class TokenProviderError extends Error {
    /**
     * The inner error that caused this token provider error.
     */
    public readonly innerError: Error;

    /**
     * Initializes a new instance of the @see TokenProviderError class.
     * @param message The error message
     * @param innerError The inner error that caused this token provider error.
     */
    constructor(message?: string, innerError?: Error) {
        super(message);
        this.innerError = innerError;
    }
}
