/**
 * Enumeration with all states a circuit breaker can be in.
 */
export enum CircuitBreakerState {
  /**
   * The circuit breaker is open, all requests will fail with a CircuitBreakerError.
   */
  Open = 'Open',
  /**
   * One request will be allowed to pass the circuit breaker to determine if the depended resource is available.
   */
  HalfOpen = 'HalfOpen',
  /**
   * The circuit breaker is open, requests are executed.
   */
  Close = 'Close',
}
