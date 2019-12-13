/**
 * An error thrown if an argument passed to a function or constructor is null or empty.
 */
export class ArgumentNullError extends Error {
  /**
   * Name of the parameter that was null or empty.
   */
  readonly parameter: string;

  /**
   * Initializes a new instance of the @see ArgumentNullError class.
   * @param message Error message.
   * @param parameter Name of the parameter that was null or empty.
   */
  constructor(message?: string, parameter?: string) {
    super(message);
    this.parameter = parameter;
  }
}
