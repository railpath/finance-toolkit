import { TrackingErrorOptions, TrackingErrorOptionsSchema } from '../schemas/TrackingErrorOptionsSchema';
import { TrackingErrorResult, TrackingErrorResultSchema } from '../schemas/TrackingErrorResultSchema';

/**
 * Calculate Tracking Error
 * 
 * Tracking Error measures the standard deviation of excess returns (portfolio return - benchmark return).
 * It quantifies how much a portfolio's returns deviate from its benchmark over time.
 * 
 * Formula:
 * - Excess Returns: r_excess = r_portfolio - r_benchmark
 * - Tracking Error: TE = √(Σ(r_excess - μ_excess)² / (n-1)) * √(annualization_factor)
 * 
 * Where:
 * - μ_excess = mean of excess returns
 * - n = number of periods
 * 
 * @param options - Portfolio returns, benchmark returns, and calculation parameters
 * @returns Tracking error result with period and annualized values
 * 
 * @example
 * ```typescript
 * const trackingError = calculateTrackingError({
 *   portfolioReturns: [0.05, 0.03, 0.07, 0.02],
 *   benchmarkReturns: [0.04, 0.03, 0.06, 0.02],
 *   annualizationFactor: 252
 * });
 * ```
 */
export function calculateTrackingError(
  options: TrackingErrorOptions
): TrackingErrorResult {
  const {
    portfolioReturns,
    benchmarkReturns,
    annualizationFactor,
    method
  } = TrackingErrorOptionsSchema.parse(options);

  // Validate input arrays have same length
  if (portfolioReturns.length !== benchmarkReturns.length) {
    throw new Error('Portfolio and benchmark returns must have same length');
  }

  if (portfolioReturns.length < 2) {
    throw new Error('At least 2 periods required for tracking error calculation');
  }

  const periods = portfolioReturns.length;

  // Calculate excess returns: r_portfolio - r_benchmark
  const excessReturns: number[] = [];
  for (let i = 0; i < periods; i++) {
    excessReturns.push(portfolioReturns[i] - benchmarkReturns[i]);
  }

  // Calculate mean excess return
  const meanExcessReturn = excessReturns.reduce((sum, excess) => sum + excess, 0) / periods;

  // Calculate tracking error (standard deviation of excess returns)
  let variance = 0;
  for (const excess of excessReturns) {
    variance += Math.pow(excess - meanExcessReturn, 2);
  }

  // Apply denominator based on method
  const denominator = method === 'sample' ? periods - 1 : periods;
  variance /= denominator;

  // Tracking error (period)
  const trackingErrorPeriod = Math.sqrt(variance);

  // Annualize tracking error
  const trackingError = trackingErrorPeriod * Math.sqrt(annualizationFactor);

  return TrackingErrorResultSchema.parse({
    trackingError,
    trackingErrorPeriod,
    excessReturns,
    meanExcessReturn,
    periods,
    annualizationFactor,
    method
  });
}

