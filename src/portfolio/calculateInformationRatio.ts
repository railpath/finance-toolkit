import { InformationRatioOptions, InformationRatioOptionsSchema } from '../schemas/InformationRatioOptionsSchema';
import { InformationRatioResult, InformationRatioResultSchema } from '../schemas/InformationRatioResultSchema';

/**
 * Calculate Information Ratio
 * 
 * Information Ratio measures the efficiency of a portfolio manager's ability to generate
 * excess returns relative to a benchmark. It's the ratio of mean excess return to tracking error.
 * 
 * Formula:
 * - Excess Returns: r_excess = r_portfolio - r_benchmark
 * - Mean Excess Return: μ_excess = Σ(r_excess) / n
 * - Tracking Error: TE = √(Σ(r_excess - μ_excess)² / (n-1)) * √(annualization_factor)
 * - Information Ratio: IR = μ_excess / TE
 * 
 * Where:
 * - n = number of periods
 * - μ_excess = mean of excess returns
 * 
 * @param options - Portfolio returns, benchmark returns, and calculation parameters
 * @returns Information ratio result with period and annualized values
 * 
 * @example
 * ```typescript
 * const informationRatio = calculateInformationRatio({
 *   portfolioReturns: [0.05, 0.03, 0.07, 0.02],
 *   benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
 *   annualizationFactor: 252
 * });
 * ```
 */
export function calculateInformationRatio(
  options: InformationRatioOptions
): InformationRatioResult {
  const {
    portfolioReturns,
    benchmarkReturns,
    annualizationFactor,
    method
  } = InformationRatioOptionsSchema.parse(options);

  // Validate input arrays have same length
  if (portfolioReturns.length !== benchmarkReturns.length) {
    throw new Error('Portfolio and benchmark returns must have same length');
  }

  if (portfolioReturns.length < 2) {
    throw new Error('At least 2 periods required for information ratio calculation');
  }

  const periods = portfolioReturns.length;

  // Calculate excess returns: r_portfolio - r_benchmark
  const excessReturns: number[] = [];
  for (let i = 0; i < periods; i++) {
    excessReturns.push(portfolioReturns[i] - benchmarkReturns[i]);
  }

  // Calculate mean excess return (period)
  const meanExcessReturnPeriod = excessReturns.reduce((sum, excess) => sum + excess, 0) / periods;

  // Calculate tracking error (standard deviation of excess returns)
  let variance = 0;
  for (const excess of excessReturns) {
    variance += Math.pow(excess - meanExcessReturnPeriod, 2);
  }

  // Apply denominator based on method
  const denominator = method === 'sample' ? periods - 1 : periods;
  variance /= denominator;

  // Tracking error (period)
  const trackingErrorPeriod = Math.sqrt(variance);

  // Annualize mean excess return and tracking error
  const meanExcessReturn = meanExcessReturnPeriod * annualizationFactor;
  const trackingError = trackingErrorPeriod * Math.sqrt(annualizationFactor);

  // Calculate information ratio
  let informationRatio: number;
  let informationRatioPeriod: number;

  if (trackingErrorPeriod === 0) {
    // Handle case where tracking error is zero (perfect tracking)
    if (meanExcessReturnPeriod === 0) {
      informationRatio = 0;
      informationRatioPeriod = 0;
    } else {
      // For infinite information ratio, use a very large number instead
      informationRatio = meanExcessReturn > 0 ? 1e6 : -1e6;
      informationRatioPeriod = meanExcessReturnPeriod > 0 ? 1e6 : -1e6;
    }
  } else {
    informationRatioPeriod = meanExcessReturnPeriod / trackingErrorPeriod;
    informationRatio = meanExcessReturn / trackingError;
  }

  return InformationRatioResultSchema.parse({
    informationRatio,
    informationRatioPeriod,
    meanExcessReturn,
    meanExcessReturnPeriod,
    trackingError,
    trackingErrorPeriod,
    excessReturns,
    periods,
    annualizationFactor,
    method
  });
}
