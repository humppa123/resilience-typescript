/**
 * An error that occurs during cache operations.
 */
export class CacheError extends Error {
  /**
   * The inner error that caused this error.
   */
  readonly innerError: Error;

  /**
   * Initializes a new instance of the @see CacheError class.
   * @param message The error message
   * @param innerError The inner error that caused this error.
   */
  constructor(message?: string, innerError?: Error) {
    super(message);
    this.innerError = innerError;
  }
}
