/**
 * Calculate Kurtosis (Fourth Moment) of a dataset
 * 
 * Kurtosis measures the "tailedness" of the distribution:
 * - Excess Kurtosis > 0: Heavy tails (leptokurtic) - more extreme values than normal distribution
 * - Excess Kurtosis < 0: Light tails (platykurtic) - fewer extreme values than normal distribution
 * - Excess Kurtosis = 0: Normal distribution (mesokurtic)
 * 
 * This function returns the excess kurtosis (kurtosis - 3), which is commonly used in finance.
 * 
 * Formula: Excess Kurtosis = E[(X - μ)⁴] / σ⁴ - 3
 * Where:
 * - μ = mean
 * - σ = standard deviation
 * - E[(X - μ)⁴] = fourth central moment
 * - The -3 makes excess kurtosis = 0 for normal distribution
 * 
 * @param data Array of numbers to calculate kurtosis for
 * @returns Excess kurtosis value
 * 
 * @example
 * ```typescript
 * const returns = [0.01, 0.02, -0.01, 0.03, -0.02, -0.05, 0.01];
 * const kurtosis = calculateKurtosis(returns);
 * console.log('Excess Kurtosis:', kurtosis); // 2.45 (fat tails)
 * ```
 */
export function calculateKurtosis(data: number[]): number {
  if (data.length === 0) {
    throw new Error('Data array cannot be empty');
  }

  if (data.length < 4) {
    throw new Error('At least 4 data points are required to calculate kurtosis');
  }

  // Calculate mean
  const mean = data.reduce((sum, value) => sum + value, 0) / data.length;

  // Calculate standard deviation
  const variance = data.reduce((sum, value) => sum + Math.pow(value - mean, 2), 0) / data.length;
  const standardDeviation = Math.sqrt(variance);

  if (standardDeviation === 0) {
    return -3; // All values are the same, excess kurtosis is -3
  }

  // Calculate fourth central moment
  const fourthCentralMoment = data.reduce((sum, value) => sum + Math.pow(value - mean, 4), 0) / data.length;

  // Calculate kurtosis
  const kurtosis = fourthCentralMoment / Math.pow(standardDeviation, 4);

  // Return excess kurtosis (kurtosis - 3)
  return kurtosis - 3;
}
