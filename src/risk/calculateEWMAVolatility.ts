/**
 * Exponentially Weighted Moving Average (EWMA) volatility
 * More weight on recent observations
 * 
 * @param returns Historical returns
 * @param lambda Decay factor (typically 0.94 for RiskMetrics)
 */
export function calculateEWMAVolatility(returns: number[], lambda: number): number {
  if (lambda <= 0 || lambda >= 1) {
    throw new Error('Lambda must be between 0 and 1');
  }

  let variance = Math.pow(returns[0], 2); // Initialize with first squared return

  for (let i = 1; i < returns.length; i++) {
    variance = lambda * variance + (1 - lambda) * Math.pow(returns[i], 2);
  }

  return Math.sqrt(variance);
}
