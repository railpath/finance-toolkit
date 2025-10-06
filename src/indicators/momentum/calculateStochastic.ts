import { StochasticOptions, StochasticOptionsSchema } from '../../schemas/StochasticOptionsSchema';

import { StochasticResult } from '../../schemas/StochasticResultSchema';

/**
 * Calculate Stochastic Oscillator
 * 
 * The Stochastic Oscillator compares the closing price to the price range over a given period.
 * It consists of two lines:
 * 1. %K = ((Current Close - Lowest Low) / (Highest High - Lowest Low)) * 100
 * 2. %D = Simple Moving Average of %K
 * 
 * Values range from 0 to 100:
 * - Above 80: Overbought (potential sell signal)
 * - Below 20: Oversold (potential buy signal)
 * 
 * @param options - Stochastic calculation options
 * @returns Stochastic result with %K, %D, highest highs, lowest lows, and metadata
 * 
 * @example
 * ```typescript
 * const result = calculateStochastic({
 *   high: [102, 103, 101, 104, 105],
 *   low: [98, 99, 97, 100, 101],
 *   close: [100, 102, 100, 103, 104],
 *   kPeriod: 14,
 *   dPeriod: 3
 * });
 * 
 * console.log(result.percentK);  // %K values (0-100)
 * console.log(result.percentD);  // %D values (0-100)
 * ```
 */
export function calculateStochastic(options: StochasticOptions): StochasticResult {
  const validatedOptions = StochasticOptionsSchema.parse(options);
  const { high, low, close, kPeriod, dPeriod } = validatedOptions;

  // Ensure all arrays have the same length
  const minLength = Math.min(high.length, low.length, close.length);
  if (high.length !== minLength || low.length !== minLength || close.length !== minLength) {
    throw new Error('All price arrays (high, low, close) must have the same length');
  }

  // Validate minimum data requirement
  const minRequiredLength = Math.max(kPeriod, dPeriod);
  if (minLength < minRequiredLength) {
    throw new Error(`At least ${minRequiredLength} prices are required for Stochastic calculation`);
  }

  // Calculate %K values
  const percentK: number[] = [];
  const highestHigh: number[] = [];
  const lowestLow: number[] = [];
  const indices: number[] = [];

  for (let i = kPeriod - 1; i < minLength; i++) {
    // Get the window for this period
    const highWindow = high.slice(i - kPeriod + 1, i + 1);
    const lowWindow = low.slice(i - kPeriod + 1, i + 1);
    
    // Find highest high and lowest low in the period
    const currentHighestHigh = Math.max(...highWindow);
    const currentLowestLow = Math.min(...lowWindow);
    
    // Calculate %K
    const numerator = close[i] - currentLowestLow;
    const denominator = currentHighestHigh - currentLowestLow;
    
    // Handle edge case where high = low (no price movement)
    const percentKValue = denominator === 0 ? 50 : (numerator / denominator) * 100;
    
    percentK.push(Math.max(0, Math.min(100, percentKValue))); // Clamp between 0-100
    highestHigh.push(currentHighestHigh);
    lowestLow.push(currentLowestLow);
    indices.push(i);
  }

  // Calculate %D (SMA of %K)
  const percentD: number[] = [];
  
  for (let i = dPeriod - 1; i < percentK.length; i++) {
    const dWindow = percentK.slice(i - dPeriod + 1, i + 1);
    const dAverage = dWindow.reduce((sum, val) => sum + val, 0) / dPeriod;
    percentD.push(dAverage);
  }

  // Adjust arrays to match %D length
  const finalIndices = indices.slice(dPeriod - 1);
  const finalPercentK = percentK.slice(dPeriod - 1);
  const finalHighestHigh = highestHigh.slice(dPeriod - 1);
  const finalLowestLow = lowestLow.slice(dPeriod - 1);

  return {
    percentK: finalPercentK,
    percentD,
    highestHigh: finalHighestHigh,
    lowestLow: finalLowestLow,
    kPeriod,
    dPeriod,
    count: percentD.length,
    indices: finalIndices
  };
}
