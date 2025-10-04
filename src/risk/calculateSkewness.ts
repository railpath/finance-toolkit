/**
 * Calculate Skewness (Third Moment) of a dataset
 * 
 * Skewness measures the asymmetry of the distribution:
 * - Positive skewness: Distribution is skewed to the right (long right tail)
 * - Negative skewness: Distribution is skewed to the left (long left tail)
 * - Zero skewness: Symmetric distribution
 * 
 * Formula: Skewness = E[(X - μ)³] / σ³
 * Where:
 * - μ = mean
 * - σ = standard deviation
 * - E[(X - μ)³] = third central moment
 * 
 * @param data Array of numbers to calculate skewness for
 * @returns Skewness value
 * 
 * @example
 * ```typescript
 * const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01];
 * const skewness = calculateSkewness(returns);
 * console.log('Skewness:', skewness); // -0.234
 * ```
 */
export function calculateSkewness(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  if (data.length < 3) {
    throw new Error('At least 3 data points are required to calculate skewness');
  }

  // Calculate mean
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;

  // Calculate standard deviation
  const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
  const standardDeviation = Math.sqrt(variance);

  if (standardDeviation === 0) {
    return 0; // All values are the same, skewness is 0
  }

  // Calculate third central moment
  const thirdCentralMoment = data.reduce((sum, value) => sum + Math.pow(value - mean, 3), 0) / data.length;

  // Calculate skewness
  const skewness = thirdCentralMoment / Math.pow(standardDeviation, 3);

  return skewness;
}
