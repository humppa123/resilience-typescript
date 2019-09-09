/**
 * An error that occurs if timeout of a timeout proxy has exceeded.
 */
export class TimeoutError extends Error {
    /**
     * The inner error might has caused this timeout error.
     */
    public readonly innerError: Error;

    /**
     * Initializes a new instance of the @see TimeoutError class.
     * @param message The error message
     * @param innerError The inner error that might has caused this timeout error.
     */
    constructor(message?: string, innerError?: Error) {
        super(message);
        this.innerError = innerError;
    }
}
