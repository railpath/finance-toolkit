import { SortinoRatioOptions, SortinoRatioOptionsSchema } from '../schemas/SortinoRatioOptionsSchema';
import { SortinoRatioResult, SortinoRatioResultSchema } from '../schemas/SortinoRatioResultSchema';

/**
 * Calculate Sortino Ratio
 * 
 * Sortino = (Mean Return - Target Return) / Downside Deviation
 * 
 * Unlike Sharpe, only penalizes downside volatility (returns < target).
 * 
 * @param options - Returns, target return, risk-free rate, annualization
 * @returns Sortino Ratio and downside deviation metrics
 */
export function calculateSortinoRatio(
  options: SortinoRatioOptions
): SortinoRatioResult {
  const { returns, riskFreeRate, targetReturn, annualizationFactor } =
    SortinoRatioOptionsSchema.parse(options);

  // Mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Annualized return
  const annualizedReturn = meanReturn * annualizationFactor;

  // Downside deviation (only returns below target)
  const downsideReturns = returns.filter((r) => r < targetReturn);
  
  if (downsideReturns.length === 0) {
    // No downside → very high Sortino (cap at high value)
    return SortinoRatioResultSchema.parse({
      sortinoRatio: 999999, // Use large number instead of Infinity
      annualizedReturn,
      downsideDeviation: 0,
      annualizedDownsideDeviation: 0,
      excessReturn: annualizedReturn - riskFreeRate,
    });
  }

  const downsideVariance =
    downsideReturns.reduce(
      (sum, r) => sum + Math.pow(r - targetReturn, 2),
      0
    ) / returns.length; // Divide by total returns, not just downside

  const downsideDeviation = Math.sqrt(downsideVariance);

  // Annualized downside deviation
  const annualizedDownsideDeviation =
    downsideDeviation * Math.sqrt(annualizationFactor);

  // Excess return
  const excessReturn = annualizedReturn - riskFreeRate;

  // Sortino Ratio
  const sortinoRatio =
    annualizedDownsideDeviation !== 0
      ? excessReturn / annualizedDownsideDeviation
      : 0;

  return SortinoRatioResultSchema.parse({
    sortinoRatio,
    annualizedReturn,
    downsideDeviation,
    annualizedDownsideDeviation,
    excessReturn,
  });
}
