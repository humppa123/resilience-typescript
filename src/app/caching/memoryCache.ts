import { Cache } from '../contracts/cache';
import { Logger } from '../contracts/logger';
import { Guard } from '../utils/guard';
import { logFormatter } from '../resilience/utils';
import { CacheError } from './cacheError';
import { Queue } from '../contracts/queue';
import { MemoryQueue } from './memoryQueue';
import { ArgumentError } from '../utils/argumentError';
import { CacheEntry } from './cacheEntry';
import { Guid } from 'guid-typescript';

/**
 * A cache that stores its values in memory with a sliding expiration.
 */
export class MemoryCache<TResult> implements Cache<string, TResult> {
  /**
   * Value in milli seconds how long a value is valid in the cache.
   */
  private readonly expirationTimespanMs: number;
  /**
   * The logger to use.
   */
  private readonly logger: Logger<string>;
  /**
   * Dictionary for the cache entries.
   */
  private readonly entries: {
    [id: string]: CacheEntry<string, TResult>;
  } = {};
  /**
   * Specifies after how many requests to the cache the garbage collection will take place.
   */
  private readonly garbageCollectEveryXRequests: number;
  /**
   * Data field for the queue.
   */
  private readonly queue: Queue<string>;
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
  constructor(
    expirationTimespanMs: number,
    logger: Logger<string>,
    garbageCollectEveryXRequests = 50,
    maxEntryCount = 1000
  ) {
    Guard.throwIfNullOrEmpty(expirationTimespanMs, 'expirationTimespanMs');
    Guard.throwIfNullOrEmpty(logger, 'logger');
    Guard.throwIfNullOrEmpty(
      garbageCollectEveryXRequests,
      'garbageCollectEveryXRequests'
    );
    Guard.throwIfNullOrEmpty(maxEntryCount, 'maxEntryCount');

    if (garbageCollectEveryXRequests <= 0) {
      throw new ArgumentError(
        "'garbageCollectEveryXRequests' must be greater than zero.",
        'garbageCollectEveryXRequests'
      );
    }

    if (maxEntryCount <= 0) {
      throw new ArgumentError(
        "'maxEntryCount' must be greater than zero.",
        'maxEntryCount'
      );
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
   * @param requestId Request Guid.
   * @returns The result of the provided function.
   */
  async execute(
    func: (...args: any[]) => Promise<TResult>,
    key?: string,
    requestId?: Guid
  ): Promise<TResult> {
    this.garbageCounter++;
    this.garbageCollect();
    if (!key) {
      const error = new CacheError(
        `MemoryCache called with 'key' null or empty`
      );
      this.logger.error(requestId, null, error, logFormatter);
      throw error;
    }

    this.logger.trace(
      requestId,
      `Starting MemoryCache for key '${key}'`,
      null,
      logFormatter
    );
    if (
      this.isAlreadyInCache(key, requestId) &&
      !this.hasExpired(key, requestId)
    ) {
      const result = this.retrieve(key, requestId);
      return result;
    } else {
      try {
        const result = await func();
        const expires = new Date();
        expires.setMilliseconds(
          expires.getMilliseconds() + this.expirationTimespanMs
        );
        this.insert(key, result, expires, requestId);
        this.logger.debug(
          requestId,
          `Returning value for key '${key}' in MemoryCache.`,
          null,
          logFormatter
        );
        return result;
      } catch (e) {
        const error = new CacheError(
          `Error in MemoryCache occured calling func. See 'innerError' for more details.`,
          e
        );
        this.logger.error(requestId, null, error, logFormatter);
        throw error;
      }
    }
  }

  /**
   * Gets the length of items currently stored in the cache.
   */
  length(): number {
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
   * @param requestId Request Guid.
   */
  insert(key: string, value: TResult, expires: Date, requestId?: Guid): void {
    this.entries[key] = new CacheEntry<string, TResult>(key, value, expires);
    this.logger.debug(
      requestId,
      `Storing value for key '${key}' in MemoryCache with expiration '${expires.toISOString()}'.`,
      null,
      logFormatter
    );
    const queueResult = this.queue.push(key, requestId);
    if (queueResult.hasPoped) {
      this.remove(queueResult.popedItem, false, requestId);
    }
  }

  /**
   * Retrieves a value from the cache.
   * @param key Key of value to get.
   * @param requestId Request Guid.
   * @returns The value for a key.
   */
  retrieve(key: string, requestId?: Guid): TResult {
    this.logger.debug(
      requestId,
      `Returning value for key '${key}' in MemoryCache.`,
      null,
      logFormatter
    );
    const result = this.entries[key].value;
    return result;
  }

  /**
   * Gets a value indicating whether a key is already included.
   * @param key Key to check for.
   * @param requestId Request Guid.
   * @returns True if a key is already in the cache, else false.
   */
  isAlreadyInCache(key: string, requestId?: Guid): boolean {
    if (this.entries[key] && this.entries[key].value) {
      return true;
    } else {
      this.logger.debug(
        requestId,
        `Key '${key}' is not in MemoryCache`,
        null,
        logFormatter
      );
      return false;
    }
  }

  /**
   * Gets a value indicating whether a key has already expired.
   * @param key Key to check for.
   * @param requestId Request Guid.
   * @returns True if a key has already expired, else false.
   */
  hasExpired(key: string, requestId?: Guid): boolean {
    const now = new Date().getTime();
    const value = this.entries[key].expiration;
    const expires = value.getTime();
    if (expires < now) {
      this.logger.debug(
        requestId,
        `Key '${key}' in MemoryCache has already expired on '${value.toISOString()}'`,
        null,
        logFormatter
      );
      return true;
    } else {
      return false;
    }
  }

  /**
   * Removes all items from the cache that have already expired.
   * @returns Number of items removed from the cache.
   */
  garbageCollect(): number {
    if (this.garbageCounter % this.garbageCollectEveryXRequests === 0) {
      this.logger.trace(
        null,
        `Starting garbage collection for MemoryCache.`,
        null,
        logFormatter
      );
      const toRemove: string[] = [];
      for (const key in this.entries) {
        if (this.hasExpired(key)) {
          toRemove.push(key);
        }
      }

      for (const key of toRemove) {
        this.remove(key, true);
      }

      this.logger.trace(
        null,
        `MemoryCache garbage collection removed '${toRemove.length}' items from the cache.`,
        null,
        logFormatter
      );
      this.garbageCounter = 1;
      return toRemove.length;
    }

    return 0;
  }

  /**
   * Clears the memory cache.
   */
  clear(): void {
    this.logger.warning(
      null,
      'Maintenance: MemoryCache cleared.',
      null,
      logFormatter
    );
    for (const prop in this.entries) {
      if (this.entries.hasOwnProperty(prop)) {
        delete this.entries[prop];
      }
    }

    this.garbageCounter = 1;
    this.queue.clear();
  }

  /**
   * Removes an item from the cache.
   * @param key Key of the item to remove from the cache.
   * @param removeFromQueue Flag if value should also be removed from the queue.
   * @param requestId Request Guid.
   */
  private remove(
    key: string,
    removeFromQueue: boolean,
    requestId?: Guid
  ): void {
    this.logger.trace(
      requestId,
      `Removing key '${key}' from MemoryCache.`,
      null,
      logFormatter
    );
    this.entries[key] = null;
    if (removeFromQueue) {
      this.queue.remove(key, requestId);
    }
  }
}
