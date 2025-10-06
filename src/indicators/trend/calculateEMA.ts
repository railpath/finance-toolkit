import { EMAOptions, EMAOptionsSchema } from '../../schemas/EMAOptionsSchema';

import { EMAResult } from '../../schemas/EMAResultSchema';

/**
 * Calculate Exponential Moving Average (EMA)
 * 
 * EMA is a trend-following indicator that gives more weight to recent prices
 * and responds more quickly to price changes than SMA. It uses exponential
 * smoothing to reduce lag.
 * 
 * Formula: EMA = (Price - Previous EMA) * Smoothing Factor + Previous EMA
 * Smoothing Factor = 2 / (Period + 1)
 * 
 * @param options - EMA calculation options
 * @returns EMA calculation result
 * 
 * @example
 * ```typescript
 * const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
 * const result = calculateEMA({ prices, period: 3 });
 * console.log(result.ema); // [10, 11, 10.67, 11.83, 12.92, 12.46, 13.73, 14.87, 14.43, 13.72]
 * ```
 */
export function calculateEMA(options: EMAOptions): EMAResult {
  // Validate input
  const validatedOptions = EMAOptionsSchema.parse(options);
  const { prices, period } = validatedOptions;

  // Additional validation
  if (period > prices.length) {
    throw new Error('Period cannot exceed the length of prices array');
  }

  const ema: number[] = new Array(prices.length);
  const smoothingFactor = 2 / (period + 1);

  // Initialize first EMA value with the first price
  ema[0] = prices[0];

  // Calculate EMA for remaining values
  for (let i = 1; i < prices.length; i++) {
    ema[i] = (prices[i] - ema[i - 1]) * smoothingFactor + ema[i - 1];
  }

  return {
    ema,
    period,
    smoothingFactor,
    count: ema.length
  };
}
