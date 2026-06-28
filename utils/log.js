/**
 * Formats an object as pretty JSON.
 *
 * @param {object} obj Object to serialize
 * @returns {string} Pretty JSON string
 */
const stringify = (obj = {}) => JSON.stringify(obj, null, 2);

/**
 * Writes merged objects as pretty JSON to stdout.
 *
 * @param {...object} args Objects to merge into one JSON response
 * @returns {void}
 */
export const log = (...args) => {
  const res = Object.assign({}, ...args);

  console.log(stringify(res));
};

/**
 * Writes an error response to stdout using the Console JSON shape.
 *
 * @param {...string} args Error message fragments
 * @returns {void}
 */
export const warn = (...args) => {
  const output = args.join(' ');

  log({
    success: false,
    error: output,
  });
};

/**
 * Alias for `warn` kept for callers that prefer error terminology.
 *
 * @param {...string} args Error message fragments
 * @returns {void}
 */
export const error = (...args) => warn(...args);

/**
 * Wraps an async API function and logs either its output or a JSON error.
 *
 * @param {Function} func API function to invoke
 * @param {...unknown} callArgs Arguments prepended before runtime arguments
 * @returns {Function} Async action handler for Commander commands
 */
export const call = (func, ...callArgs) => {
  return async (...args) => {
    try {
      const output = await func(...callArgs, ...args);

      log(output);
    } catch (error) {
      warn(error);
    }
  };
};
