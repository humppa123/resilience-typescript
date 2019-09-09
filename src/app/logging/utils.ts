/**
 * Gets the current UTC timestamp in a readable string.
 * @returns The current UTC timestamp in a readable string.
 */
export function getUtcDateTimeString(): string {
    const d = new Date();
    return  d.getFullYear() + "-" +
            ("0" + (d.getUTCMonth() + 1)).slice(-2) + "-" +
            ("0" + d.getUTCDate()).slice(-2) + " " +
            ("0" + d.getUTCHours()).slice(-2) + ":" +
            ("0" + d.getUTCMinutes()).slice(-2) + ":" +
            ("0" + d.getUTCSeconds()).slice(-2) + "." +
            ("0" + d.getUTCMilliseconds()).slice(-3);
}
