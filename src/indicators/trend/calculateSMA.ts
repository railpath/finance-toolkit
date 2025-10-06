import { SMAOptions, SMAOptionsSchema } from '../../schemas/SMAOptionsSchema';

import { SMAResult } from '../../schemas/SMAResultSchema';

/**
 * Calculate Simple Moving Average (SMA)
 * 
 * SMA is a trend-following indicator that smooths price data by creating
 * a constantly updated average price over a specified time period.
 * 
 * @param options - SMA calculation options
 * @returns SMA calculation result
 * 
 * @example
 * ```typescript
 * const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
 * const result = calculateSMA({ prices, period: 3 });
 * console.log(result.sma); // [11, 12, 12.67, 13, 13.67, 14.33, 15, 14.33]
 * ```
 */
export function calculateSMA(options: SMAOptions): SMAResult {
  // Validate input
  const validatedOptions = SMAOptionsSchema.parse(options);
  const { prices, period } = validatedOptions;

  // Additional validation
  if (period > prices.length) {
    throw new Error('Period cannot exceed the length of prices array');
  }

  const sma: number[] = [];
  const indices: number[] = [];

  // Calculate SMA for each possible window
  for (let i = period - 1; i < prices.length; i++) {
    // Calculate sum of prices in the window
    let sum = 0;
    for (let j = i - period + 1; j <= i; j++) {
      sum += prices[j];
    }
    
    // Calculate average
    const average = sum / period;
    sma.push(average);
    indices.push(i);
  }

  return {
    sma,
    period,
    count: sma.length,
    indices
  };
}
