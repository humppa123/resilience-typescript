/**
 * A timer function.
 */
export function timer() {
  const timeStart = new Date().getTime();
  return {
    /**
     * Gets seconds elapsed since start.
     */
    get seconds(): number {
      return Math.ceil(new Date().getTime() - timeStart / 1000);
    },

    /**
     * Gets milli seconds elapsed since start.
     */
    get milliSeconds(): number {
      return new Date().getTime() - timeStart;
    },
  };
}
