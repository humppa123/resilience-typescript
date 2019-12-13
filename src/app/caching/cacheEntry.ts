import { Guard } from '../utils/guard';

/**
 * A entry for the a cache.
 */
export class CacheEntry<TKey, TValue> {
  /**
   * Gets or sets the expiration timestamp for this cache entry.
   */
  expiration: Date;
  /**
   * Gets or sets the key of the cache entry.
   */
  key: TKey;
  /**
   * Gets or sets the value of the cache entry.
   */
  value: TValue;

  /**
   * Initializes a new instance of the @see CacheEntry class.
   * @param key Key of the cache entry.
   * @param value Value of the cache entry.
   * @param expiration Expiraiton date for cache entry.
   */
  constructor(key: TKey, value: TValue, expiration: Date) {
    Guard.throwIfNullOrEmpty(key, 'key');
    Guard.throwIfNullOrEmpty(value, 'value');
    Guard.throwIfNullOrEmpty(expiration, 'expiration');

    this.expiration = expiration;
    this.key = key;
    this.value = value;
  }
}
