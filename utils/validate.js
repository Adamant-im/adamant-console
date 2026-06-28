/**
 * Throws a standard missing-parameter error for default argument guards.
 *
 * @param {string} name Missing parameter name
 * @throws {Error} Always throws with the missing parameter name
 * @returns {never}
 */
export const requiredParam = (name) => {
  throw new Error(`Missing parameter '${name}'`);
};
