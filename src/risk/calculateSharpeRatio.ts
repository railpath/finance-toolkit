import { SharpeRatioOptions, SharpeRatioOptionsSchema } from '../schemas/SharpeRatioOptionsSchema';
import { SharpeRatioResult, SharpeRatioResultSchema } from '../schemas/SharpeRatioResultSchema';

import { calculateStandardDeviation } from './calculateStandardDeviation';

/**
 * Calculate Sharpe Ratio
 * 
 * Sharpe = (Mean Return - Risk-Free Rate) / StdDev
 * 
 * @param options - Returns, risk-free rate, annualization factor
 * @returns Sharpe Ratio and related metrics
 */
export function calculateSharpeRatio(
  options: SharpeRatioOptions
): SharpeRatioResult {
  const { returns, riskFreeRate, annualizationFactor } =
    SharpeRatioOptionsSchema.parse(options);

  // Mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Annualized return
  const annualizedReturn = meanReturn * annualizationFactor;

  // Standard deviation
  const stdDev = calculateStandardDeviation(returns);

  // Annualized volatility
  const annualizedVolatility = stdDev * Math.sqrt(annualizationFactor);

  // Excess return
  const excessReturn = annualizedReturn - riskFreeRate;

  // Sharpe Ratio
  const sharpeRatio =
    annualizedVolatility !== 0 ? excessReturn / annualizedVolatility : 0;

  return SharpeRatioResultSchema.parse({
    sharpeRatio,
    annualizedReturn,
    annualizedVolatility,
    excessReturn,
  });
}
