/**
 * @param {string} input
 * @param {string} suffix
 * @returns {string}
 */
export function ensureEndsWith(input, suffix) {
  if (!input || !suffix) {
    return input;
  }

  return input.endsWith(suffix) ? input : input + suffix;
}
