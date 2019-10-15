import { QueuePushResult } from "../caching/queuePushResult";

/**
 * A queue with a defined maximum lenght.
 */
export interface IQueue<T> {
    /**
     * The maximum length of the queue.
     */
    readonly maxLength: number;

    /**
     * Adds a new item to the beginning of the queue.
     * @param value The item to add at the beginning of thequeue.
     * @returns An object describing whether a pop was required to add the item to the queue.
     */
    push(value: string): QueuePushResult<T>;

    /**
     * Removes the last item from the queue.
     * @returns The removed item of undefined.
     */
    pop(): T | undefined;

    /**
     * Gets the current length of the queue.
     * @returns The current length of the queue.
     */
    length(): number;

    /**
     * Excplicitly removes one item from the queue.
     * @param value Item to remove.
     * @return Result of remove operation.
     */
    remove(value: T): QueuePushResult<T>;

    /**
     * Clears the queue.
     */
    clear();
}
