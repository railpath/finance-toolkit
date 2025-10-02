import { PortfolioMetricsOptions, PortfolioMetricsOptionsSchema } from '../schemas/PortfolioMetricsOptionsSchema';
import { PortfolioMetricsResult, PortfolioMetricsResultSchema } from '../schemas/PortfolioMetricsResultSchema';

import { calculateParametricExpectedShortfall } from '../risk/calculateParametricExpectedShortfall';
import { calculateParametricVaR } from '../risk/calculateParametricVaR';
import { calculateStandardDeviation } from '../risk/calculateStandardDeviation';

/**
 * Calculate Portfolio-Level Metrics
 * 
 * Calculates comprehensive portfolio performance and risk metrics:
 * 
 * 1. Total Return: (Final Value - Initial Value) / Initial Value
 * 2. CAGR: Compound Annual Growth Rate
 * 3. Max Drawdown: Largest peak-to-trough decline
 * 4. Sharpe Ratio: (Mean Return - Risk-Free Rate) / Volatility
 * 5. Sortino Ratio: (Mean Return - Risk-Free Rate) / Downside Deviation
 * 6. Value at Risk (VaR): Potential loss at confidence level
 * 7. Expected Shortfall: Expected loss beyond VaR
 * 8. Volatility: Annualized standard deviation of returns
 * 
 * @param options - Portfolio values, dates, cash flows, and calculation parameters
 * @returns Comprehensive portfolio metrics
 * 
 * @example
 * ```typescript
 * const metrics = calculatePortfolioMetrics({
 *   portfolioValues: [100000, 105000, 108000, 102000, 110000],
 *   dates: [new Date('2023-01-01'), new Date('2023-02-01'), new Date('2023-03-01'), new Date('2023-04-01'), new Date('2023-05-01')],
 *   riskFreeRate: 0.02,
 *   annualizationFactor: 12 // Monthly data
 * });
 * ```
 */
export function calculatePortfolioMetrics(
  options: PortfolioMetricsOptions
): PortfolioMetricsResult {
  const {
    portfolioValues,
    riskFreeRate,
    annualizationFactor,
    confidenceLevel
  } = PortfolioMetricsOptionsSchema.parse(options);

  const periods = portfolioValues.length;
  const initialValue = portfolioValues[0];
  const finalValue = portfolioValues[periods - 1];

  // Calculate period returns
  const returns: number[] = [];
  for (let i = 1; i < periods; i++) {
    returns.push((portfolioValues[i] - portfolioValues[i - 1]) / portfolioValues[i - 1]);
  }

  // Calculate total return
  const totalReturn = (finalValue - initialValue) / initialValue;

  // Calculate CAGR
  const years = (periods - 1) / annualizationFactor;
  const cagr = years > 0 ? Math.pow(1 + totalReturn, 1 / years) - 1 : 0;

  // Calculate max drawdown
  let maxDrawdown = 0;
  let maxDrawdownPercent = 0;
  let peak = portfolioValues[0];

  for (let i = 0; i < periods; i++) {
    if (portfolioValues[i] > peak) {
      peak = portfolioValues[i];
    }
    
    const drawdown = peak - portfolioValues[i];
    const drawdownPercent = drawdown / peak;
    
    if (drawdown > maxDrawdown) {
      maxDrawdown = drawdown;
      maxDrawdownPercent = drawdownPercent;
    }
  }

  // Calculate current drawdown
  const currentPeak = Math.max(...portfolioValues);
  const currentDrawdown = currentPeak - finalValue;
  const currentDrawdownPercent = currentDrawdown / currentPeak;

  // Calculate return statistics
  const meanReturnPeriod = returns.reduce((sum, r) => sum + r, 0) / returns.length;
  const meanReturn = meanReturnPeriod * annualizationFactor;
  
  const volatility = returns.length > 1 ? calculateStandardDeviation(returns) * Math.sqrt(annualizationFactor) : 0;

  // Calculate Sharpe ratio
  const sharpeRatio = volatility > 0 ? (meanReturn - riskFreeRate) / volatility : 0;

  // Calculate Sortino ratio (downside deviation)
  const downsideReturns = returns.filter(r => r < 0);
  const downsideDeviation = downsideReturns.length > 0 
    ? calculateStandardDeviation(downsideReturns) * Math.sqrt(annualizationFactor)
    : 0;
  
  const sortinoRatio = downsideDeviation > 0 ? (meanReturn - riskFreeRate) / downsideDeviation : 0;

  // Calculate VaR and Expected Shortfall (only if we have enough returns)
  let varValue = 0;
  let esValue = 0;
  
  if (returns.length >= 2) {
    try {
      const varResult = calculateParametricVaR(returns, confidenceLevel);
      const esResult = calculateParametricExpectedShortfall(returns, {
        confidenceLevel,
        method: 'parametric' as const,
        simulations: 10000
      });
      varValue = -varResult.value; // VaR is typically negative
      esValue = isNaN(esResult) ? 0 : -esResult; // ES is typically negative, handle NaN
    } catch (error) {
      // If calculation fails, use default values
      varValue = 0;
      esValue = 0;
    }
  }

  return PortfolioMetricsResultSchema.parse({
    totalReturn,
    cagr,
    maxDrawdown,
    maxDrawdownPercent,
    currentDrawdown,
    currentDrawdownPercent,
    sharpeRatio,
    sortinoRatio,
    valueAtRisk: varValue,
    expectedShortfall: esValue,
    volatility,
    meanReturn,
    periods,
    years,
    annualizationFactor,
    riskFreeRate,
    confidenceLevel
  });
}
