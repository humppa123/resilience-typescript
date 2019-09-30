import { AxiosRequestConfig } from "axios";
import { Guard } from "../utils/guard";
import * as helpers from "axios/lib/helpers/buildURL";

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

/**
 * Returns URL from an Axios request.
 * @param request Axios request to use.
 */
export function getUrlFromAxisRequest(request: AxiosRequestConfig) {
    Guard.throwIfNullOrEmpty(request, "request");

    let url: string = "";
    if (request.baseURL && request.url) {
        url = `${request.baseURL}${request.url}`;
    } else {
        if (request.baseURL) {
            url = request.baseURL;
        }

        if (request.url) {
            url = request.url;
        }
    }

    if (request.params && Object.keys(request.params).length > 0) {
        url = helpers(url, request.params, null);
    }

    return url;
}
