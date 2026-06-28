/**
 * In-memory command history used by the interactive prompt.
 */
export default class History {
  /**
   * Creates an empty history buffer.
   */
  constructor() {
    this.history = [];
    this.current = 0;
  }

  /**
   * Adds one or more commands to history.
   *
   * @param {...string} args Commands to append
   * @returns {number} Current history length after trimming
   */
  add(...args) {
    this.current += 1;

    const len = this.history.push(...args);

    if (len > 500) {
      this.history.shift();

      return len - 1;
    }

    return len;
  }

  /**
   * Moves forward in history.
   *
   * @param {string} str Current prompt line used when no newer entry exists
   * @returns {string} Next history entry or the current prompt line
   */
  next(str) {
    if (this.history.length <= this.current + 1) {
      return str;
    }

    this.current += 1;

    return this.history[this.current];
  }

  /**
   * Moves backward in history.
   *
   * @param {string} str Current prompt line used when no older entry exists
   * @returns {string} Previous history entry or the current prompt line
   */
  back(str) {
    if (this.current < 1) {
      return str;
    }

    this.current -= 1;

    return this.history[this.current];
  }
}
