/**
 * An error that occurs if retries of a retry proxy have exceeded.
 */
export class RetryError extends Error {
    /**
     * The inner error that caused this retry error.
     */
    public readonly innerError: Error;

    /**
     * Initializes a new instance of the @see RetryError class.
     * @param message The error message
     * @param innerError The inner error that caused this retry error.
     */
    constructor(message?: string, innerError?: Error) {
        super(message);
        this.innerError = innerError;
    }
}
