import { QueuePushResult } from '../caching/queuePushResult';
import { Guid } from 'guid-typescript';

/**
 * A queue with a defined maximum lenght.
 */
export interface Queue<T> {
  /**
   * The maximum length of the queue.
   */
  readonly maxLength: number;

  /**
   * Adds a new item to the beginning of the queue.
   * @param value The item to add at the beginning of thequeue.
   * @param requestId Request Guid.
   * @returns An object describing whether a pop was required to add the item to the queue.
   */
  push(value: string, requestId?: Guid): QueuePushResult<T>;

  /**
   * Removes the last item from the queue.
   * @param requestId Request Guid.
   * @returns The removed item of undefined.
   */
  pop(requestId: Guid): T | undefined;

  /**
   * Gets the current length of the queue.
   * @returns The current length of the queue.
   */
  length(): number;

  /**
   * Excplicitly removes one item from the queue.
   * @param value Item to remove.
   * @param requestId Request Guid.
   * @return Result of remove operation.
   */
  remove(value: T, requestId?: Guid): QueuePushResult<T>;

  /**
   * Clears the queue.
   */
  clear();
}
