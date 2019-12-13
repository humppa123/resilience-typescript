import { Logger } from '../contracts/logger';
import { QueuePushResult } from './queuePushResult';
import { Queue } from '../contracts/queue';
import { logFormatter } from '../resilience/utils';
import { Guid } from 'guid-typescript';

/**
 * A memory queue.
 */
export class MemoryQueue implements Queue<string> {
  /**
   * The maximum length of the queue.
   */
  readonly maxLength: number;
  /**
   * The logger to use.
   */
  private readonly logger: Logger<string>;
  /**
   * Dictionary for the items.
   */
  private readonly items: string[];

  /**
   * Initializes a new instance of the @see MemoryQueue class.
   * @param maxLength The maximum length for the queue.
   * @param logger The logger to use.
   */
  constructor(maxLength: number, logger: Logger<string>) {
    this.maxLength = maxLength;
    this.logger = logger;
    this.items = [];
  }

  /**
   * Gets the current length of the queue.
   * @returns The current length of the queue.
   */
  length(): number {
    this.logger.trace(
      null,
      `Getting length from MemoryQueue.`,
      null,
      logFormatter
    );
    return this.items.length;
  }

  /**
   * Adds a new item to the beginning of the queue.
   * @param value The item to add at the beginning of thequeue.
   * @param requestId Request Guid.
   * @returns An object describing whether a pop was required to add the item to the queue.
   */
  push(value: string, requestId?: Guid): QueuePushResult<string> {
    this.logger.trace(
      requestId,
      `Pushing '${value}' to MemoryQueue.`,
      null,
      logFormatter
    );
    let hasPoped = false;
    let popedItem: string = null;
    if (this.items.length >= this.maxLength) {
      hasPoped = true;
      popedItem = this.pop(requestId);
      this.logger.information(
        requestId,
        `MemoryQueue reached size limit of '${this.maxLength}', poped '${popedItem}' to push '${value}'.`,
        null,
        logFormatter
      );
    }

    this.items.push(value);
    this.logger.debug(
      requestId,
      `Pushed value '${value}' to MemoryQueue.`,
      null,
      logFormatter
    );
    this.logger.debug(
      requestId,
      `New size of MemoryQueue: ${this.items.length}/${this.maxLength}`,
      null,
      logFormatter
    );
    return new QueuePushResult(hasPoped, popedItem);
  }

  /**
   * Removes the last item from the queue.
   * @param requestId Request Guid.
   * @returns The removed item of undefined.
   */
  pop(requestId?: Guid): string | undefined {
    this.logger.trace(
      requestId,
      `Poping from MemoryQueue.`,
      null,
      logFormatter
    );
    const result = this.items.shift();
    this.logger.debug(
      requestId,
      `Poped value '${result}' from MemoryQueue.`,
      null,
      logFormatter
    );
    return result;
  }

  /**
   * Excplicitly removes one item from the queue.
   * @param value Item to remove.
   * @param requestId Request Guid.
   * @return Result of remove operation.
   */
  remove(value: string, requestId?: Guid): QueuePushResult<string> {
    this.logger.trace(
      requestId,
      `Explicitly removing '${value}' from MemoryQueue.`,
      null,
      logFormatter
    );
    const index = this.items.indexOf(value, 0);
    if (index > -1) {
      this.items.splice(index, 1);
      this.logger.debug(
        requestId,
        `Explicitly removed value '${value}' from MemoryQueue.`,
        null,
        logFormatter
      );
      return new QueuePushResult(true, value);
    }

    return new QueuePushResult(false, undefined);
  }

  /**
   * Clears the queue.
   */
  clear(): void {
    this.logger.warning(
      null,
      'Maintenance: MemoryQueue cleared.',
      null,
      logFormatter
    );
    this.items.length = 0;
  }
}
