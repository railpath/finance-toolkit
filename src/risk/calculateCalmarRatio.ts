import { CalmarRatioOptions, CalmarRatioOptionsSchema } from '../schemas/CalmarRatioOptionsSchema';
import { CalmarRatioResult, CalmarRatioResultSchema } from '../schemas/CalmarRatioResultSchema';

import { calculateMaxDrawdown } from './calculateMaxDrawdown';

/**
 * Calculate Calmar Ratio
 * 
 * Calmar = Annualized Return / Max Drawdown
 * 
 * Measures return per unit of downside risk (drawdown).
 * Higher is better; typically calculated over 36 months.
 * 
 * @param options - Prices, returns, annualization factor
 * @returns Calmar Ratio and components
 */
export function calculateCalmarRatio(
  options: CalmarRatioOptions
): CalmarRatioResult {
  const { prices, returns, annualizationFactor } =
    CalmarRatioOptionsSchema.parse(options);

  // Mean return
  const meanReturn = returns.reduce((sum, r) => sum + r, 0) / returns.length;

  // Annualized return
  const annualizedReturn = meanReturn * annualizationFactor;

  // Max Drawdown
  const { maxDrawdownPercent } = calculateMaxDrawdown({ prices });

  // Calmar Ratio (use absolute value of drawdown)
  const calmarRatio =
    maxDrawdownPercent !== 0 ? annualizedReturn / Math.abs(maxDrawdownPercent) : 0;

  return CalmarRatioResultSchema.parse({
    calmarRatio,
    annualizedReturn,
    maxDrawdownPercent,
  });
}
