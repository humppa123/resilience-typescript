export interface ICache {
    /**
     * Executes a function within a cache. If the value is in the cache and has not expired, it will be returned from the cache, else it will be queried from the func and added to the cache.
     * @param func Function to get the value if not in cache or has expired.
     * @param key The key to use for this value.
     */
    execute<TResult>(func: (...args: any[]) => Promise<TResult>, key?: string): Promise<TResult>;
}
