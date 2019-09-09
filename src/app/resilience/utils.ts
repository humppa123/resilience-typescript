/**
 * Sleeps for a given timespan in MS and rejects
 * @param timeSpan Timespan in MS before rejecting the resulting promise.
 */
export async function sleepAndReject<TResult>(timeSpan: number): Promise<TResult> {
    return await new Promise<TResult>((resolve, reject) => {
        const id = setTimeout(() => {
            clearTimeout(id);
            reject(`Timeout exceeded after ${timeSpan}ms`);
            resolve(null);
        }, timeSpan);
    });
}

/**
 * Default log string formatter for resiliency proxies.
 * @param state Log state message if any.
 * @param error Error of log entry if any.
 */
export function logFormatter(state: string, error: Error): string {
    if (state && error && error.message) {
        return `${state} with error "${error.message}"`;
    }

    if (state) {
        return state;
    }

    if (error && error.message) {
        return error.message;
    }

    throw new Error("Invalid inputs provided for log formatter");
}
