import { WilliamsROptions, WilliamsROptionsSchema } from '../../schemas/WilliamsROptionsSchema';

import { WilliamsRResult } from '../../schemas/WilliamsRResultSchema';

/**
 * Calculate Williams %R
 * 
 * Williams %R is a momentum oscillator that measures overbought/oversold levels.
 * It is similar to the Stochastic Oscillator but uses a different scale.
 * 
 * Formula: %R = ((Highest High - Current Close) / (Highest High - Lowest Low)) * -100
 * 
 * Values range from -100 to 0:
 * - Above -20: Overbought (potential sell signal)
 * - Below -80: Oversold (potential buy signal)
 * 
 * @param options - Williams %R calculation options
 * @returns Williams %R result with values, highest highs, lowest lows, and metadata
 * 
 * @example
 * ```typescript
 * const result = calculateWilliamsR({
 *   high: [102, 103, 101, 104, 105],
 *   low: [98, 99, 97, 100, 101],
 *   close: [100, 102, 100, 103, 104],
 *   period: 14
 * });
 * 
 * console.log(result.williamsR);  // Williams %R values (-100 to 0)
 * ```
 */
export function calculateWilliamsR(options: WilliamsROptions): WilliamsRResult {
  const validatedOptions = WilliamsROptionsSchema.parse(options);
  const { high, low, close, period } = validatedOptions;

  // Ensure all arrays have the same length
  const minLength = Math.min(high.length, low.length, close.length);
  if (high.length !== minLength || low.length !== minLength || close.length !== minLength) {
    throw new Error('All price arrays (high, low, close) must have the same length');
  }

  // Validate minimum data requirement
  if (minLength < period) {
    throw new Error(`At least ${period} prices are required for Williams %R calculation`);
  }

  // Calculate Williams %R values
  const williamsR: number[] = [];
  const highestHigh: number[] = [];
  const lowestLow: number[] = [];
  const indices: number[] = [];

  for (let i = period - 1; i < minLength; i++) {
    // Get the window for this period
    const highWindow = high.slice(i - period + 1, i + 1);
    const lowWindow = low.slice(i - period + 1, i + 1);
    
    // Find highest high and lowest low in the period
    const currentHighestHigh = Math.max(...highWindow);
    const currentLowestLow = Math.min(...lowWindow);
    
    // Calculate Williams %R
    const numerator = currentHighestHigh - close[i];
    const denominator = currentHighestHigh - currentLowestLow;
    
    // Handle edge case where high = low (no price movement)
    const williamsRValue = denominator === 0 ? -50 : (numerator / denominator) * -100;
    
    williamsR.push(Math.max(-100, Math.min(0, williamsRValue))); // Clamp between -100 and 0
    highestHigh.push(currentHighestHigh);
    lowestLow.push(currentLowestLow);
    indices.push(i);
  }

  return {
    williamsR,
    highestHigh,
    lowestLow,
    period,
    count: williamsR.length,
    indices
  };
}
