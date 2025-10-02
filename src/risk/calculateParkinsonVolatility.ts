/**
 * Parkinson volatility estimator
 * Uses high-low range, more efficient than close-to-close
 * 
 * Parkinson, M. (1980). "The Extreme Value Method for Estimating the Variance of the Rate of Return"
 */
export function calculateParkinsonVolatility(highPrices: number[], lowPrices: number[]): number {
  if (highPrices.length !== lowPrices.length) {
    throw new Error('High and low price arrays must have equal length');
  }

  const n = highPrices.length;
  let sum = 0;

  for (let i = 0; i < n; i++) {
    if (lowPrices[i] <= 0 || highPrices[i] <= 0) {
      throw new Error('Prices must be positive');
    }
    const ratio = Math.log(highPrices[i] / lowPrices[i]);
    sum += Math.pow(ratio, 2);
  }

  // Parkinson constant: 1 / (4 * ln(2))
  const variance = sum / (n * 4 * Math.log(2));
  return Math.sqrt(variance);
}