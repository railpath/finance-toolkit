import { SemideviationOptions, SemideviationOptionsSchema } from '../schemas/SemideviationOptionsSchema';
import { SemideviationResult, SemideviationResultSchema } from '../schemas/SemideviationResultSchema';
import { calculateStandardDeviation } from './calculateStandardDeviation';

/**
 * Calculate Semideviation (Downside Deviation)
 * 
 * Semideviation measures the volatility of returns below a specified threshold.
 * It's a key risk metric that focuses only on downside risk, ignoring positive volatility.
 * 
 * Formula: σ⁻ = √(Σ(min(ri - threshold, 0)²) / n)
 * Where:
 * - ri = individual return
 * - threshold = minimum acceptable return (typically 0 or mean)
 * - n = total number of observations
 * 
 * @param options - Returns, threshold, annualization factor
 * @returns Semideviation metrics including period and annualized values
 * 
 * @example
 * ```typescript
 * const semideviation = calculateSemideviation({
 *   returns: [0.01, -0.02, 0.03, -0.01, -0.05, 0.02],
 *   threshold: 0, // Zero threshold
 *   annualizationFactor: 252
 * });
 * 
 * console.log('Semideviation:', semideviation.semideviation);
 * console.log('Annualized:', semideviation.annualizedSemideviation);
 * console.log('Downside %:', semideviation.downsidePercentage); // 50%
 * ```
 */
export function calculateSemideviation(
  options: SemideviationOptions
): SemideviationResult {
  const { returns, threshold, annualizationFactor, annualized } = 
    SemideviationOptionsSchema.parse(options);

  if (returns.length < 2) {
    throw new Error('At least 2 returns are required to calculate semideviation');
  }

  // Calculate mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Calculate standard deviation for comparison
  const standardDeviation = calculateStandardDeviation(returns);

  // Filter downside returns (returns below threshold)
  const downsideReturns = returns.filter(r => r < threshold);
  const downsideCount = downsideReturns.length;
  const totalCount = returns.length;
  const downsidePercentage = (downsideCount / totalCount) * 100;

  // Calculate semideviation
  let semideviation = 0;
  
  if (downsideCount > 0) {
    // Sum of squared deviations below threshold
    const downsideVariance = downsideReturns.reduce(
      (sum, r) => sum + Math.pow(r - threshold, 2), 
      0
    ) / totalCount; // Divide by total count, not downside count (population variance)
    
    semideviation = Math.sqrt(downsideVariance);
  }

  // Calculate annualized semideviation
  const annualizedSemideviation = annualized 
    ? semideviation * Math.sqrt(annualizationFactor)
    : semideviation;

  return SemideviationResultSchema.parse({
    semideviation,
    annualizedSemideviation,
    downsideCount,
    totalCount,
    downsidePercentage,
    threshold,
    annualizationFactor,
    meanReturn,
    standardDeviation,
  });
}
