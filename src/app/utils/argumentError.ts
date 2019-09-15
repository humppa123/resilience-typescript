/**
 * An error thrown if an argument passed to a function or constructor is not valid.
 */
export class ArgumentError extends Error {
    /**
     * Name of the parameter that was not valid.
     */
    public readonly parameter: string;

    /**
     * Initializes a new instance of the @see ArgumentError class.
     * @param message Error message.
     * @param parameter Name of the parameter that was not valid.
     */
    constructor(message?: string, parameter?: string) {
        super(message);
        this.parameter = parameter;
    }
}
