/**
 * An error that occurs in a circuit breaker.
 */
export class CircuitBreakerError extends Error {
  /**
   * The inner error that caused this circuit breaker error.
   */
  readonly innerError: Error;

  /**
   * Initializes a new instance of the @see CircuitBreaker class.
   * @param message The error message
   * @param innerError The inner error that caused this circuit breaker error.
   */
  constructor(message?: string, innerError?: Error) {
    super(message);
    this.innerError = innerError;
  }
}
