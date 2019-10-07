import { ICache } from "../contracts/cache";
import { ILogger } from "../contracts/logger";
import { Guard } from "../utils/guard";
import { logFormatter } from "../resilience/utils";
import { CacheError } from "./cacheError";
import { IQueue } from "../contracts/queue";
import { MemoryQueue } from "./memoryQueue";
import { ArgumentError } from "../utils/argumentError";
import { CacheEntry } from "./cacheEntry";

/**
 * A cache that stores its values in memory with a sliding expiration.
 */
export class MemoryCache<TResult> implements ICache<string, TResult> {
    /**
     * Value in milli seconds how long a value is valid in the cache.
     */
    private readonly expirationTimespanMs: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;
    /**
     * Dictionary for the cache entries.
     */
    private readonly entries: { [id: string]: CacheEntry<string, TResult> } = {};
    /**
     * Specifies after how many requests to the cache the garbage collection will take place.
     */
    private readonly garbageCollectEveryXRequests: number;
    /**
     * Data field for the queue.
     */
    private readonly queue: IQueue<string>;
    /**
     * The current counter for the garbage collection.
     */
    private garbageCounter: number;

    /**
     * Initializes a new instance of the @see MemoryCache class.
     * @param expirationTimespanMs Value in milli seconds how long a value is valid in the cache.
     * @param logger The logger to use.
     * @param garbageCollectEveryXRequests Specifies after how many requests to the cache the garbage collection will take place.
     * @param maxEntryCount Number of maximum entries that can be stored at the same time in the memory cache.
     */
    constructor(expirationTimespanMs: number, logger: ILogger<string>, garbageCollectEveryXRequests: number = 50, maxEntryCount: number = 1000) {
        Guard.throwIfNullOrEmpty(expirationTimespanMs, "expirationTimespanMs");
        Guard.throwIfNullOrEmpty(logger, "logger");
        Guard.throwIfNullOrEmpty(garbageCollectEveryXRequests, "garbageCollectEveryXRequests");
        Guard.throwIfNullOrEmpty(maxEntryCount, "maxEntryCount");

        if (garbageCollectEveryXRequests <= 0) {
            throw new ArgumentError("'garbageCollectEveryXRequests' must be greater than zero.", "garbageCollectEveryXRequests");
        }

        if (maxEntryCount <= 0) {
            throw new ArgumentError("'maxEntryCount' must be greater than zero.", "maxEntryCount");
        }

        this.expirationTimespanMs = expirationTimespanMs;
        this.logger = logger;
        this.garbageCollectEveryXRequests = garbageCollectEveryXRequests;
        this.garbageCounter = 1;
        this.queue = new MemoryQueue(maxEntryCount, logger);
    }

    /**
     * Executes a function within a cache. If the value is in the cache and has not expired, it will be returned from the cache, else it will be queried from the func and added to the cache.
     * @param func Function to get the value if not in cache or has expired.
     * @param key The key to use for this value.
     * @returns The result of the provided function.
     */
    public async execute(func: (...args: any[]) => Promise<TResult>, key?: string): Promise<TResult> {
        this.garbageCounter++;
        this.garbageCollect();
        if (!key) {
            const error = new CacheError(`MemoryCache called with 'key' null or empty`);
            this.logger.error(null, error, logFormatter);
            throw error;
        }

        this.logger.trace(`Starting MemoryCache for key '${key}'`, null, logFormatter);
        if (this.isAlreadyInCache(key) && !this.hasExpired(key)) {
            const result = this.retrieve(key);
            return result;
        } else {
            try {
                const result = await func();
                const expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + this.expirationTimespanMs);
                this.insert(key, result, expires);
                this.logger.debug(`Returning value for key '${key}' in MemoryCache.`, null, logFormatter);
                return result;
            } catch (e) {
                const error = new CacheError(`Error in MemoryCache occured calling func. See 'innerError' for more details.`, e);
                this.logger.error(null, error, logFormatter);
                throw error;
            }
        }
    }

    /**
     * Gets the length of items currently stored in the cache.
     */
    public length(): number {
        let i = 0;
        for (const item in this.entries) {
            if (this.entries[item] && this.entries[item].value) {
                i++;
            }
        }

        return i;
    }

    /**
     * Inserts a value into the cache.
     * @param key Key in the cache for new value.
     * @param value Value to insert.
     * @param expires Exipration timestamp for new cache entry.
     */
    public insert(key: string, value: TResult, expires: Date): void {
        this.entries[key] = new CacheEntry<string, TResult>(key, value, expires);
        this.logger.debug(`Storing value for key '${key}' in MemoryCache with expiration '${expires.toISOString()}'.`, null, logFormatter);
        const queueResult = this.queue.push(key);
        if (queueResult.hasPoped) {
            this.remove(queueResult.popedItem, false);
        }
    }

    /**
     * Retrieves a value from the cache.
     * @param key Key of value to get.
     * @returns The value for a key.
     */
    public retrieve(key: string): TResult {
        this.logger.debug(`Returning value for key '${key}' in MemoryCache.`, null, logFormatter);
        const result = this.entries[key].value;
        return result;
    }

    /**
     * Gets a value indicating whether a key is already included.
     * @param key Key to check for.
     * @returns True if a key is already in the cache, else false.
     */
    public isAlreadyInCache(key: string): boolean {
        if (this.entries[key] && this.entries[key].value) {
            return true;
        } else {
            this.logger.debug(`Key '${key}' is not in MemoryCache`, null, logFormatter);
            return false;
        }
    }

    /**
     * Gets a value indicating whether a key has already expired.
     * @param key Key to check for.
     * @returns True if a key has already expired, else false.
     */
    public hasExpired(key: string): boolean {
        const now = new Date().getTime();
        const value = this.entries[key].expiration;
        const expires = value.getTime();
        if (expires < now) {
            this.logger.debug(`Key '${key}' in MemoryCache has already expired on '${value.toISOString()}'`, null, logFormatter);
            return true;
        } else {
            return false;
        }
    }

    /**
     * Removes all items from the cache that have already expired.
     * @returns Number of items removed from the cache.
     */
    public garbageCollect(): number {
        if (this.garbageCounter % this.garbageCollectEveryXRequests === 0) {
            this.logger.trace(`Starting garbage collection for MemoryCache.`, null, logFormatter);
            const toRemove: string[] = [];
            for (const key in this.entries) {
                if (this.hasExpired(key)) {
                    toRemove.push(key);
                }
            }

            for (const key of toRemove) {
                this.remove(key, true);
            }

            this.logger.trace(`MemoryCache garbage collection removed '${toRemove.length}' items from the cache.`, null, logFormatter);
            this.garbageCounter = 1;
            return toRemove.length;
        }

        return 0;
    }

    /**
     * Removes an item from the cache.
     * @param key Key of the item to remove from the cache.
     * @param removeFromQueue Flag if value should also be removed from the queue.
     */
    private remove(key: string, removeFromQueue: boolean): void {
        this.logger.trace(`Removing key '${key}' from MemoryCache.`, null, logFormatter);
        this.entries[key] = null;
        if (removeFromQueue) {
            this.queue.remove(key);
        }
    }
}
