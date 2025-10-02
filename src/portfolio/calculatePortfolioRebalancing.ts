import { PortfolioRebalancingOptions, PortfolioRebalancingOptionsSchema } from '../schemas/PortfolioRebalancingOptionsSchema';
import { PortfolioRebalancingResult, PortfolioRebalancingResultSchema } from '../schemas/PortfolioRebalancingResultSchema';

/**
 * Calculate Portfolio Rebalancing
 * 
 * Portfolio rebalancing is the process of bringing portfolio weights back to their
 * target allocations. This can be done through proportional scaling or fixed rebalancing.
 * 
 * Methods:
 * - Proportional: Scale all weights proportionally while maintaining relative ratios
 * - Fixed: Rebalance to exact target weights
 * 
 * @param options - Current weights, target weights, portfolio value, and rebalancing parameters
 * @returns Rebalancing result with trade amounts and costs
 * 
 * @example
 * ```typescript
 * // Fixed rebalancing to target weights
 * const rebalancing = calculatePortfolioRebalancing({
 *   currentWeights: [0.6, 0.4],
 *   targetWeights: [0.5, 0.5],
 *   portfolioValue: 100000,
 *   method: 'fixed'
 * });
 * 
 * // Proportional rebalancing with transaction costs
 * const proportionalRebalancing = calculatePortfolioRebalancing({
 *   currentWeights: [0.55, 0.45],
 *   targetWeights: [0.5, 0.5],
 *   portfolioValue: 100000,
 *   method: 'proportional',
 *   transactionCosts: 0.001, // 0.1%
 *   includeTransactionCosts: true
 * });
 * ```
 */
export function calculatePortfolioRebalancing(
  options: PortfolioRebalancingOptions
): PortfolioRebalancingResult {
  const {
    currentWeights,
    targetWeights,
    portfolioValue,
    method,
    minTradeSize,
    transactionCosts,
    includeTransactionCosts
  } = PortfolioRebalancingOptionsSchema.parse(options);

  // Validate input arrays have same length
  if (currentWeights.length !== targetWeights.length) {
    throw new Error('Current and target weights must have same length');
  }

  if (currentWeights.length < 2) {
    throw new Error('At least 2 assets required for rebalancing');
  }

  // Validate weights sum to 1 (approximately)
  const currentSum = currentWeights.reduce((sum, weight) => sum + weight, 0);
  const targetSum = targetWeights.reduce((sum, weight) => sum + weight, 0);
  
  if (Math.abs(currentSum - 1) > 1e-6) {
    throw new Error(`Current weights sum to ${currentSum.toFixed(6)}, expected 1`);
  }
  
  if (Math.abs(targetSum - 1) > 1e-6) {
    throw new Error(`Target weights sum to ${targetSum.toFixed(6)}, expected 1`);
  }

  let newWeights: number[];
  let tradeAmounts: number[];

  if (method === 'proportional') {
    // Proportional rebalancing: scale all weights proportionally
    const totalCurrentWeight = currentWeights.reduce((sum, weight) => sum + weight, 0);
    const totalTargetWeight = targetWeights.reduce((sum, weight) => sum + weight, 0);
    const scaleFactor = totalTargetWeight / totalCurrentWeight;
    
    newWeights = currentWeights.map(weight => weight * scaleFactor);
    
    // Calculate trade amounts
    tradeAmounts = newWeights.map((newWeight, i) => {
      const currentValue = currentWeights[i] * portfolioValue;
      const newValue = newWeight * portfolioValue;
      return newValue - currentValue;
    });
  } else {
    // Fixed rebalancing: rebalance to exact target weights
    newWeights = [...targetWeights];
    
    // Calculate trade amounts
    tradeAmounts = newWeights.map((targetWeight, i) => {
      const currentValue = currentWeights[i] * portfolioValue;
      const targetValue = targetWeight * portfolioValue;
      return targetValue - currentValue;
    });
  }

  // Calculate trade percentages
  const tradePercentages = tradeAmounts.map(amount => amount / portfolioValue);

  // Filter out trades below minimum threshold
  const filteredTradeAmounts = tradeAmounts.map((amount, i) => {
    const tradePercentage = Math.abs(tradePercentages[i]);
    if (tradePercentage < minTradeSize) {
      return 0;
    }
    return amount;
  });

  // Recalculate weights after filtering
  const adjustedNewWeights = currentWeights.map((currentWeight, i) => {
    const tradeAmount = filteredTradeAmounts[i];
    const currentValue = currentWeight * portfolioValue;
    const newValue = currentValue + tradeAmount;
    return newValue / portfolioValue;
  });

  // Renormalize weights to sum to 1
  const adjustedSum = adjustedNewWeights.reduce((sum, weight) => sum + weight, 0);
  const finalWeights = adjustedNewWeights.map(weight => weight / adjustedSum);

  // Recalculate final trade amounts
  const finalTradeAmounts = finalWeights.map((finalWeight, i) => {
    const currentValue = currentWeights[i] * portfolioValue;
    const finalValue = finalWeight * portfolioValue;
    return finalValue - currentValue;
  });

  // Calculate transaction costs
  let totalTransactionCosts = 0;
  if (includeTransactionCosts && transactionCosts > 0) {
    totalTransactionCosts = finalTradeAmounts.reduce((total, amount) => {
      return total + Math.abs(amount) * transactionCosts;
    }, 0);
  }

  // Calculate portfolio value after costs
  const portfolioValueAfterCosts = portfolioValue - totalTransactionCosts;

  // Calculate total absolute trade amount
  const totalTradeAmount = finalTradeAmounts.reduce((total, amount) => {
    return total + Math.abs(amount);
  }, 0);

  // Calculate turnover (sum of absolute trades / 2 / portfolio value)
  const turnover = totalTradeAmount / 2 / portfolioValue;

  // Count assets that need rebalancing
  const assetsToRebalance = finalTradeAmounts.filter(amount => Math.abs(amount) > 0).length;

  // Check if rebalancing was needed
  const rebalancingNeeded = assetsToRebalance > 0;

  return PortfolioRebalancingResultSchema.parse({
    newWeights: finalWeights,
    tradeAmounts: finalTradeAmounts,
    tradePercentages: finalTradeAmounts.map(amount => amount / portfolioValue),
    totalTradeAmount,
    totalTransactionCosts,
    portfolioValueAfterCosts,
    assetsToRebalance,
    method,
    rebalancingNeeded,
    turnover
  });
}
