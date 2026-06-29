/**
 * Appends concise operational help to a Commander command.
 *
 * @param {import('commander').Command} command Commander command to extend
 * @param {string} text Help text appended after generated options
 * @returns {import('commander').Command} The same command for chaining
 */
export function addHelp(command, text) {
  return command.addHelpText('after', `\n${text.trim()}\n`);
}
