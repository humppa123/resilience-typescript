import { Guid } from "guid-typescript";

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
 * Sleeps for a give time in milli seconds.
 * @param ms Milli seconds to sleep.
 */
export async function sleep(ms: number): Promise<unknown> {
    return new Promise(resolve => {
        setTimeout(resolve, ms);
    });
}

/**
 * Default log string formatter for resiliency proxies.
 * @param guid Guid of the request.
 * @param state Log state message if any.
 * @param error Error of log entry if any.
 */
export function logFormatter(state: string, guid: Guid, error: Error): string {
    if (guid && state && error && error.message) {
        return `${guid} ${state} with error "${error.message}"`;
    }

    if (state && error && error.message) {
        return `${state} with error "${error.message}"`;
    }

    if (guid && state) {
        return `${guid} ${state}`;
    }

    if (state) {
        return state;
    }

    if (guid && error && error.message) {
        return `${guid} ${error.message}`;
    }

    if (error && error.message) {
        return error.message;
    }

    throw new Error("Invalid inputs provided for log formatter");
}
