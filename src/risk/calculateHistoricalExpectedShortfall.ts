import { ExpectedShortfallOptionsValidated } from '../schemas/ExpectedShortfallOptionsSchema';

/**
 * Calculate Expected Shortfall using historical method
 * 
 * @param returns Array of historical returns
 * @param options Calculation options
 * @returns Expected Shortfall value (negative = potential loss)
 */
export function calculateHistoricalExpectedShortfall(
  returns: number[],
  options: ExpectedShortfallOptionsValidated
): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }

  const sorted = [...returns].sort((a, b) => a - b);
  const cutoffIndex = Math.floor(returns.length * (1 - options.confidenceLevel));
  const tailLosses = sorted.slice(0, cutoffIndex);

  if (tailLosses.length === 0) {
    return sorted[0];
  }

  return tailLosses.reduce((sum, val) => sum + val, 0) / tailLosses.length;
}
