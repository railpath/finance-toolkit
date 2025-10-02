import { ReturnCalculationOptions, ReturnCalculationOptionsSchema } from '../schemas/ReturnCalculationOptionsSchema';
import { ReturnCalculationResult, ReturnCalculationResultSchema } from '../schemas/ReturnCalculationResultSchema';

/**
 * Calculate Returns from Price Data
 * 
 * Calculates either simple returns or logarithmic returns from a series of asset prices.
 * 
 * Simple Returns:
 * - Formula: r_t = (P_t - P_{t-1}) / P_{t-1}
 * - Additive property: Total return = (1 + r_1) * (1 + r_2) * ... * (1 + r_n) - 1
 * - Used for: Portfolio performance, benchmark comparisons, money-weighted returns
 * 
 * Logarithmic Returns:
 * - Formula: r_t = ln(P_t / P_{t-1})
 * - Additive property: Total return = r_1 + r_2 + ... + r_n
 * - Used for: Statistical analysis, volatility calculations, risk models
 * 
 * @param options - Price data, calculation method, and annualization parameters
 * @returns Calculated returns with statistics
 * 
 * @example
 * ```typescript
 * // Simple returns for portfolio performance
 * const simpleReturns = calculateReturns({
 *   prices: [100, 105, 110, 108, 115],
 *   method: 'simple',
 *   annualize: true,
 *   annualizationFactor: 252
 * });
 * 
 * // Log returns for volatility analysis
 * const logReturns = calculateReturns({
 *   prices: [100, 105, 110, 108, 115],
 *   method: 'log',
 *   annualize: true,
 *   annualizationFactor: 252
 * });
 * ```
 */
export function calculateReturns(
  options: ReturnCalculationOptions
): ReturnCalculationResult {
  const {
    prices,
    method,
    annualizationFactor,
    annualize
  } = ReturnCalculationOptionsSchema.parse(options);

  if (prices.length < 2) {
    throw new Error('At least 2 prices required for return calculation');
  }

  const periods = prices.length - 1;
  const returns: number[] = [];

  // Calculate returns based on method
  for (let i = 1; i < prices.length; i++) {
    const currentPrice = prices[i];
    const previousPrice = prices[i - 1];

    if (previousPrice <= 0) {
      throw new Error(`Invalid price at index ${i - 1}: ${previousPrice}. Prices must be positive.`);
    }

    if (method === 'simple') {
      // Simple return: (P_t - P_{t-1}) / P_{t-1}
      const simpleReturn = (currentPrice - previousPrice) / previousPrice;
      returns.push(simpleReturn);
    } else {
      // Log return: ln(P_t / P_{t-1})
      const logReturn = Math.log(currentPrice / previousPrice);
      returns.push(logReturn);
    }
  }

  // Calculate statistics
  const meanReturn = returns.reduce((sum, return_) => sum + return_, 0) / periods;

  // Calculate standard deviation
  const variance = returns.reduce((sum, return_) => sum + Math.pow(return_ - meanReturn, 2), 0) / periods;
  const standardDeviation = Math.sqrt(variance);

  // Annualize if requested
  let meanReturnAnnualized: number | undefined;
  let standardDeviationAnnualized: number | undefined;

  if (annualize) {
    if (method === 'simple') {
      // For simple returns: (1 + mean_return) ^ periods_per_year - 1
      meanReturnAnnualized = Math.pow(1 + meanReturn, annualizationFactor) - 1;
    } else {
      // For log returns: mean_return * periods_per_year
      meanReturnAnnualized = meanReturn * annualizationFactor;
    }
    
    // Standard deviation annualization: std_dev * sqrt(periods_per_year)
    standardDeviationAnnualized = standardDeviation * Math.sqrt(annualizationFactor);
  }

  // Calculate total returns
  let totalReturn: number | undefined;
  let totalLogReturn: number | undefined;

  if (method === 'simple') {
    // Total simple return: (1 + r_1) * (1 + r_2) * ... * (1 + r_n) - 1
    totalReturn = returns.reduce((product, return_) => product * (1 + return_), 1) - 1;
  } else {
    // Total log return: r_1 + r_2 + ... + r_n
    totalLogReturn = returns.reduce((sum, return_) => sum + return_, 0);
  }

  return ReturnCalculationResultSchema.parse({
    returns,
    method,
    periods,
    annualizationFactor,
    annualized: annualize,
    meanReturn,
    meanReturnAnnualized,
    standardDeviation,
    standardDeviationAnnualized,
    totalReturn,
    totalLogReturn
  });
}
