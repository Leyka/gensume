/**
 * @param {string} str
 * @param {string} suffix
 * @returns {string}
 */
export function ensureEndsWith(str, suffix) {
  if (!str || !suffix) {
    return str;
  }

  return str.endsWith(suffix) ? str : str + suffix;
}
