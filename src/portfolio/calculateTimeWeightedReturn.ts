import { TimeWeightedReturnOptions, TimeWeightedReturnOptionsSchema } from '../schemas/TimeWeightedReturnOptionsSchema';
import { TimeWeightedReturnResult, TimeWeightedReturnResultSchema } from '../schemas/TimeWeightedReturnResultSchema';

/**
 * Calculate Time-Weighted Return (TWR)
 * 
 * TWR measures portfolio performance independent of cash flows.
 * It eliminates the impact of timing and size of contributions/withdrawals.
 * 
 * Formula: TWR = ∏(1 + r_i) - 1
 * where r_i = (V_i - V_{i-1} - CF_i) / (V_{i-1} + CF_i)
 * 
 * @param options - Portfolio values, cash flows, and annualization factor
 * @returns TWR result with period and annualized returns
 * 
 * @example
 * ```typescript
 * const twr = calculateTimeWeightedReturn({
 *   portfolioValues: [1000, 1100, 1200, 1150],
 *   cashFlows: [0, 100, -50, 0],
 *   annualizationFactor: 252
 * });
 * ```
 */
export function calculateTimeWeightedReturn(
  options: TimeWeightedReturnOptions
): TimeWeightedReturnResult {
  const { portfolioValues, cashFlows, annualizationFactor } =
    TimeWeightedReturnOptionsSchema.parse(options);

  if (portfolioValues.length !== cashFlows.length) {
    throw new Error('Portfolio values and cash flows must have same length');
  }

  if (portfolioValues.length < 2) {
    throw new Error('At least 2 periods required for TWR calculation');
  }

  const periodReturns: number[] = [];
  
  // Calculate period returns
  for (let i = 1; i < portfolioValues.length; i++) {
    const currentValue = portfolioValues[i];
    const previousValue = portfolioValues[i - 1];
    const cashFlow = cashFlows[i];
    
    // TWR formula: r_i = (V_i - V_{i-1} - CF_i) / (V_{i-1} + CF_i)
    const numerator = currentValue - previousValue - cashFlow;
    const denominator = previousValue + cashFlow;
    
    if (denominator <= 0) {
      throw new Error(`Invalid denominator for period ${i}: ${denominator}. Check cash flows.`);
    }
    
    const periodReturn = numerator / denominator;
    periodReturns.push(periodReturn);
  }

  // Calculate TWR: ∏(1 + r_i) - 1
  const twr = periodReturns.reduce((product, return_) => product * (1 + return_), 1) - 1;
  
  // Annualize TWR
  const periods = periodReturns.length;
  const annualizedTWR = Math.pow(1 + twr, annualizationFactor / periods) - 1;

  return TimeWeightedReturnResultSchema.parse({
    twr,
    annualizedTWR,
    periods,
    periodReturns,
  });
}
