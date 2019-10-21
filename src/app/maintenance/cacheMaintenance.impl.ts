import { MemoryCache } from "../caching/memoryCache";
import axios = require("axios");
import { ICacheMaintenance } from "../contracts/cacheMaintenance";

/**
 * Cache maintenance.
 */
export class CacheMaintenance implements ICacheMaintenance {
    /**
     * Gets the cache to use for maintenance.
     */
    private readonly cache: MemoryCache<axios.AxiosResponse>;

    /**
     * Initializes a new instance of the @see CacheMaintenance class.
     * @param cache Cache to use for maintenance.
     */
    constructor(cache: MemoryCache<axios.AxiosResponse>) {
        this.cache = cache;
    }

    /**
     * Clears the memory cache.
     */
    public clear(): void {
        if (this.cache) {
            this.cache.clear();
        }
    }
}
