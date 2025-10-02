import type { ExpectedShortfallOptionsValidated } from '../schemas/ExpectedShortfallOptionsSchema';
import { calculateVolatility } from './calculateVolatility';
import { inverseErf } from '../utils/inverseErf';

/**
 * Calculate Expected Shortfall using parametric (normal distribution) method
 * 
 * @param returns Array of historical returns
 * @param options Calculation options
 * @returns Expected Shortfall value (negative = potential loss)
 */
export function calculateParametricExpectedShortfall(
  returns: number[],
  options: ExpectedShortfallOptionsValidated
): number {
  if (returns.length === 0) {
    throw new Error('Returns array cannot be empty');
  }

  const mean = returns.reduce((sum, val) => sum + val, 0) / returns.length;
  const volatilityResult = calculateVolatility(returns, { method: 'standard' });
  const sigma = volatilityResult.value;

  // Standard normal quantile function approximation
  const z = Math.sqrt(2) * inverseErf(2 * options.confidenceLevel - 1);

  // ES for normal distribution = μ - σ * φ(z) / (1 - α)
  // where φ is the standard normal PDF
  const phi = (1 / Math.sqrt(2 * Math.PI)) * Math.exp(-0.5 * z * z);
  return mean - (sigma * phi) / (1 - options.confidenceLevel);
}
