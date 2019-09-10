import { ICache } from "./cache";
import { ILogger } from "../logging/logger";
import { Guard } from "../utils/guard";
import { logFormatter } from "../resilience/utils";
import { CacheError } from "./cacheError";

/**
 * A cache that stores its values in memory with a sliding expiration.
 */
export class MemoryCache implements ICache {
    /**
     * Value in milli seconds how long a value is valid in the cache.
     */
    private readonly expirationTimespanMs: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;
    /**
     * Dictionary for the memory cache values.
     */
    private readonly cacheValues: { [id: string]: any; } = {};
    /**
     * Dictionary for the expiration dates in the memory cache.
     */
    private readonly cacheExpirations: { [id: string]: Date; } = {};
    /**
     * Specifies after how many requests to the cache the garbage collection will take place.
     */
    private readonly garbageCollectEveryXRequests: number;
    /**
     * The current counter for the garbage collection.
     */
    private garbageCounter: number;

    /**
     * Initializes a new instance of the @see MemoryCache class.
     * @param expirationTimespanMs Value in milli seconds how long a value is valid in the cache.
     * @param logger The logger to use.
     * @param garbageCollectEveryXRequests Specifies after how many requests to the cache the garbage collection will take place.
     */
    constructor(expirationTimespanMs: number, logger: ILogger<string>, garbageCollectEveryXRequests: number = 50) {
        Guard.throwIfNullOrEmpty(expirationTimespanMs, "expirationTimespanMs");
        Guard.throwIfNullOrEmpty(logger, "logger");
        Guard.throwIfNullOrEmpty(garbageCollectEveryXRequests, "garbageCollectEveryXRequests");

        this.expirationTimespanMs = expirationTimespanMs;
        this.logger = logger;
        this.garbageCollectEveryXRequests = garbageCollectEveryXRequests;
        this.garbageCounter = 1;
    }

    /**
     * Executes a function within a cache. If the value is in the cache and has not expired, it will be returned from the cache, else it will be queried from the func and added to the cache.
     * @param func Function to get the value if not in cache or has expired.
     * @param key The key to use for this value.
     */
    public async execute<TResult>(func: (...args: any[]) => Promise<TResult>, key?: string): Promise<TResult> {
        this.garbageCounter++;
        this.garbageCollect();
        if (!key) {
            const error = new CacheError(`MemoryCache called with 'key' null or empty`);
            this.logger.error(null, error, logFormatter);
            throw error;
        }

        this.logger.trace(`Starting MemoryCache for key '${key}'`, null, logFormatter);
        if (this.isAlreadyInCache(key) && !!this.hasExpired(key)) {
            this.logger.debug(`Returning value for key '${key}' in MemoryCache.`, null, logFormatter);
            const result = this.cacheValues.key;
            return result;
        } else {
            try {
                const result = await func();
                const expires = new Date();
                expires.setMilliseconds(expires.getMilliseconds() + this.expirationTimespanMs);
                this.cacheExpirations.key = expires;
                this.cacheValues.key = result;
                this.logger.debug(`Storing value for key '${key}' in MemoryCache with expiration '${expires.toISOString()}'.`, null, logFormatter);
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
     * Gets a value indicating whether a key is already included.
     * @param key Key to check for.
     */
    public isAlreadyInCache(key: string): boolean {
        if (this.cacheValues.key && this.cacheExpirations.key) {
            return true;
        } else {
            this.logger.debug(`Key '${key}' is not in MemoryCache`, null, logFormatter);
            return false;
        }
    }

    /**
     * Gets a value indicating whether a key has already expired.
     * @param key Key to check for.
     */
    public hasExpired(key: string): boolean {
        const now = new Date().getTime();
        const value = this.cacheExpirations.key;
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
     */
    public garbageCollect(): void {
        if (this.garbageCounter % this.garbageCollectEveryXRequests === 0) {
            this.logger.trace(`Starting garbage collection for MemoryCache.`, null, logFormatter);
            const toRemove: string[] = [];
            for (const key in this.cacheExpirations) {
                if (this.hasExpired(key)) {
                    toRemove.push(key);
                }
            }

            for (const key of toRemove) {
                this.logger.trace(`Removing key '${key}' from MemoryCache.`, null, logFormatter);
                this.cacheExpirations.key = null;
                this.cacheValues.key = null;
            }

            this.garbageCounter = 1;
        }
    }
}
