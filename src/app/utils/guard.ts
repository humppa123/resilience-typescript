import { ArgumentNullError } from "./argumentNullError";

/**
 * A guard for parameter checking.
 */
export class Guard {
    /**
     * Throws an @see ArgumentNullError if a passed in value is null or empty.
     * @param value Value to check for null or emptieness.
     * @param name Name of the parameter that is being checked.
     */
    public static throwIfNullOrEmpty(value: any, name: string): void {
        if (!value) {
            throw new ArgumentNullError(`Parameter ${name} is null or empty.`, name);
        }
    }
}
