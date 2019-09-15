import { ILogger } from "../logging/logger";
import { QueuePushResult } from "./queuePushResult";
import { IQueue } from "./queue";
import { logFormatter } from "../resilience/utils";

/**
 * A memory queue.
 */
export class MemoryQueue implements IQueue<string> {
    /**
     * The maximum length of the queue.
     */
    public readonly maxLength: number;
    /**
     * The logger to use.
     */
    private readonly logger: ILogger<string>;
    /**
     * Dictionary for the items.
     */
    private readonly items: string[];

    /**
     * Initializes a new instance of the @see MemoryQueue class.
     * @param maxLength The maximum length for the queue.
     * @param logger The logger to use.
     */
    constructor(maxLength: number, logger: ILogger<string>) {
        this.maxLength = maxLength;
        this.logger = logger;
        this.items = [];
    }

    /**
     * Gets the current length of the queue.
     * @returns The current length of the queue.
     */
    public length(): number {
        this.logger.trace(`Getting length from MemoryQueue.`, null, logFormatter);
        return this.items.length;
    }

    /**
     * Adds a new item to the beginning of the queue.
     * @param value The item to add at the beginning of thequeue.
     * @returns An object describing whether a pop was required to add the item to the queue.
     */
    public push(value: string): QueuePushResult<string> {
        this.logger.trace(`Pushing '${value}' to MemoryQueue.`, null, logFormatter);
        let hasPoped = false;
        let popedItem: string = null;
        if (this.items.length >= this.maxLength) {
            hasPoped = true;
            popedItem = this.pop();
            this.logger.debug(`MemoryQueue reached size limit of '${this.maxLength}', poped '${popedItem}' to push '${value}'.`, null, logFormatter);
        }

        this.items.push(value);
        this.logger.debug(`Pushed value '${value}' to MemoryQueue.`, null, logFormatter);
        this.logger.debug(`New size of MemoryQueue: ${this.items.length}/${this.maxLength}`, null, logFormatter);
        return new QueuePushResult(hasPoped, popedItem);
    }

    /**
     * Removes the last item from the queue.
     * @returns The removed item of undefined.
     */
    public pop(): string | undefined {
        this.logger.trace(`Poping from MemoryQueue.`, null, logFormatter);
        const result = this.items.shift();
        this.logger.debug(`Poped value '${result}' from MemoryQueue.`, null, logFormatter);
        return result;
    }

    /**
     * Excplicitly removes one item from the queue.
     * @param value Item to remove.
     * @return Result of remove operation.
     */
    public remove(value: string): QueuePushResult<string> {
        this.logger.trace(`Explicitly removing '${value}' from MemoryQueue.`, null, logFormatter);
        const index = this.items.indexOf(value, 0);
        if (index > -1) {
            this.items.splice(index, 1);
            this.logger.debug(`Explicitly removed value '${value}' from MemoryQueue.`, null, logFormatter);
            return new QueuePushResult(true, value);
        }

        return new QueuePushResult(false, undefined);
    }
}
