import { Guid } from "guid-typescript";

export interface ICache<TKey, TResult> {
    /**
     * Executes a function within a cache. If the value is in the cache and has not expired, it will be returned from the cache, else it will be queried from the func and added to the cache.
     * @param func Function to get the value if not in cache or has expired.
     * @param key The key to use for this value.
     * @param guid Request Guid.
     */
    execute(func: (...args: any[]) => Promise<TResult>, key?: TKey, guid?: Guid): Promise<TResult>;
}
