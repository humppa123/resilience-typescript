import { TimeSpansInMilliSeconds } from "../utils/timespans";
import { Guard } from "../utils/guard";

/**
 * A bucket that leaks its content within time.
 */
export class LeakingBucket {
    /**
     * Gets time span in milliseconds how long failures shall be saved.
     */
    private readonly timespanInMilliSeconds: number;
    /**
     * Gets maximum count of entries until bucket is full.
     */
    private readonly maxEntries: number;
    /**
     * Gets or sets the list of current entries.
     */
    private entries: Date[];

    /**
     * Initializes a new instance of the @see LeakingBucket class.
     * @param timespanInMilliSeconds Time span in milliseconds how long failures shall be saved.
     * @param maxEntries Maximum count of entries until bucket is full.
     */
    constructor(timespanInMilliSeconds: number = TimeSpansInMilliSeconds.TenMinutes, maxEntries: number = 50) {
        this.timespanInMilliSeconds = timespanInMilliSeconds;
        this.maxEntries = maxEntries;
        this.entries = [];
    }

    /**
     * Gets the current count of entries in the bucket.
     * @returns The current count of entries in the bucket.
     */
    public length(): number {
        return this.entries.length;
    }

    /**
     * Adds a new item into the bucket.
     * @param timeStamp Time stamp to include into the bucket.
     * @returns True if the bucket is full, else false.
     */
    public insert(timeStamp: Date): boolean {
        Guard.throwIfNullOrEmpty(timeStamp, "timeStamp");

        this.leak();
        if (timeStamp.getTime() > this.getEpoch()) {
            this.entries.push(timeStamp);
        }

        return this.isFull();
    }

    /**
     * Gets a value indicating whether the bucket is full.
     * @returns A value indicating whether the bucket is full.
     */
    public isFull(): boolean {
        if (this.entries.length >= this.maxEntries) {
            return true;
        }

        return false;
    }

    /**
     * Clears all items from the bucket.
     */
    public clear() {
        this.entries = [];
    }

    /**
     * Leaks expired items from the bucket.
     */
    public leak() {
        const epoch = this.getEpoch();
        const result: Date[] = [];
        for (const item of this.entries) {
            if (item.getTime() > epoch) {
                result.push(item);
            }
        }

        this.entries = result;
    }

    /**
     * Gets the timestamp that marks older entries as leaked.
     * @returns The timestamp that marks older entries as leaked.
     */
    public getEpoch(): number {
        return new Date(Date.now() - this.timespanInMilliSeconds).getTime();
    }
}
