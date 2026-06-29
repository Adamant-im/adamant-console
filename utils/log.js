import chalk from 'chalk';

/**
 * Formats an object as pretty JSON.
 *
 * @param {object} obj Object to serialize
 * @returns {string} Pretty JSON string
 */
const stringify = (obj = {}) => JSON.stringify(obj, null, 2);

/**
 * Matches the syntactic tokens of pretty-printed JSON: a string (optionally a
 * key when followed by a colon), a boolean, `null`, or a number.
 */
const JSON_TOKEN =
  /("(?:\\.|[^"\\])*")(\s*:)?|\b(true|false)\b|\bnull\b|(-?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)/g;

/**
 * Colorizes a pretty-printed JSON string for terminal output.
 *
 * Coloring is applied per token (keys, strings, numbers, booleans, `null`); the
 * JSON payload itself is unchanged. When stdout is not a TTY or color is
 * disabled (e.g. `NO_COLOR`), `chalk` emits no escape codes, so piped or
 * redirected output stays plain and machine-parseable.
 *
 * @param {string} json Pretty JSON produced by `stringify`
 * @returns {string} The same JSON with ANSI color codes added where applicable
 */
const highlight = (json) =>
  json.replace(JSON_TOKEN, (match, str, colon, bool, num) => {
    if (str !== undefined) {
      return colon !== undefined ? chalk.cyan(str) + colon : chalk.green(str);
    }

    if (bool !== undefined) {
      return chalk.yellow(bool);
    }

    if (num !== undefined) {
      return chalk.magenta(num);
    }

    return chalk.gray(match);
  });

/**
 * Writes merged objects as pretty, syntax-highlighted JSON to stdout.
 *
 * @param {...object} args Objects to merge into one JSON response
 * @returns {void}
 */
export const log = (...args) => {
  const res = Object.assign({}, ...args);

  console.log(highlight(stringify(res)));
};

/**
 * Writes an error response to stdout using the Console JSON shape.
 *
 * @param {...unknown} args Error message fragments or Error objects
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
 * @param {...unknown} args Error message fragments or Error objects
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
