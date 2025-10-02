/**
 * Standard deviation (classic volatility)
 */
export function calculateStandardDeviation(returns: number[]): number {
  const n = returns.length;
  const mean = returns.reduce((sum, r) => sum + r, 0) / n;
  const variance = returns.reduce((sum, r) => sum + Math.pow(r - mean, 2), 0) / (n - 1);
  return Math.sqrt(variance);
}
