/**
 * Calculates the percentage of two numbers.
 *
 * This function takes two parameters, `part` and `total`, and calculates
 * the percentage of `part` with respect to `total`. The result is returned
 * as a number. If the total is zero, the function will return 0 to avoid
 * division by zero.
 *
 * @param {number} part - The part value for which the percentage is calculated.
 * @param {number} total - The total value against which the percentage is calculated.
 * @returns {number} - The percentage of `part` with respect to `total`,
 *                     or 0 if `total` is zero.
 */
export function calculatePercentage(part: number, total: number): number {
  if (total === 0) {
    return 0; // Avoid division by zero
  }
  return (part / total) * 100;
}
