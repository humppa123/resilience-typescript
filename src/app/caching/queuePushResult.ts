/**
 * Result for a push operation on a queue.
 */
export class QueuePushResult<T> {
    /**
     * Gets a value indicating whether a pop was required to push the new item.
     */
    public readonly hasPoped: boolean;
    /**
     * Gets the poped item.
     */
    public readonly popedItem: T;

    /**
     * Initializes a new instance of the @see QueuePushResult class.
     * @param hasPoped A value indicating whether a pop was required to push the new item.
     * @param popedItem Item that was popped to push the new item.
     */
    constructor(hasPoped: boolean, popedItem: T) {
        this.hasPoped = hasPoped;
        this.popedItem = popedItem;
    }
}
