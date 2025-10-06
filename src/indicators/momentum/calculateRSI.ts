import { RSIOptions, RSIOptionsSchema } from '../../schemas/RSIOptionsSchema';

import { RSIResult } from '../../schemas/RSIResultSchema';

/**
 * Calculate Relative Strength Index (RSI)
 * 
 * RSI is a momentum oscillator that measures the speed and magnitude of price changes.
 * It oscillates between 0 and 100 and is used to identify overbought (>70) and 
 * oversold (<30) conditions.
 * 
 * Formula:
 * 1. Calculate price changes: change = price[i] - price[i-1]
 * 2. Separate gains and losses: gain = max(change, 0), loss = max(-change, 0)
 * 3. Calculate average gains and losses using exponential smoothing
 * 4. Calculate RS = averageGain / averageLoss
 * 5. Calculate RSI = 100 - (100 / (1 + RS))
 * 
 * @param options - RSI calculation options
 * @returns RSI calculation result
 * 
 * @example
 * ```typescript
 * const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
 * const result = calculateRSI({ prices, period: 3 });
 * console.log(result.rsi); // [100, 33.33, 66.67, 75, 25, 66.67, 75, 25, 33.33]
 * ```
 */
export function calculateRSI(options: RSIOptions): RSIResult {
  // Validate input
  const validatedOptions = RSIOptionsSchema.parse(options);
  const { prices, period } = validatedOptions;

  // Additional validation
  if (prices.length < 2) {
    throw new Error('At least 2 prices are required for RSI calculation');
  }
  
  if (period > prices.length - 1) {
    throw new Error('Period cannot exceed (prices.length - 1)');
  }

  const priceChanges: number[] = [];
  const gains: number[] = [];
  const losses: number[] = [];
  const averageGains: number[] = [];
  const averageLosses: number[] = [];
  const rsi: number[] = [];
  const indices: number[] = [];

  // Calculate price changes
  for (let i = 1; i < prices.length; i++) {
    const change = prices[i] - prices[i - 1];
    priceChanges.push(change);
    gains.push(Math.max(change, 0));
    losses.push(Math.max(-change, 0));
  }

  // Calculate initial average gain and loss (simple average)
  let avgGain = 0;
  let avgLoss = 0;
  
  for (let i = 0; i < period && i < gains.length; i++) {
    avgGain += gains[i];
    avgLoss += losses[i];
  }
  
  avgGain /= Math.min(period, gains.length);
  avgLoss /= Math.min(period, losses.length);

  // Calculate RSI for each period
  for (let i = 0; i < gains.length; i++) {
    if (i < period) {
      // Use simple average for initial periods
      averageGains.push(avgGain);
      averageLosses.push(avgLoss);
    } else {
      // Use exponential smoothing for subsequent periods
      avgGain = (avgGain * (period - 1) + gains[i]) / period;
      avgLoss = (avgLoss * (period - 1) + losses[i]) / period;
      averageGains.push(avgGain);
      averageLosses.push(avgLoss);
    }

    // Calculate RSI
    if (averageLosses[i] === 0) {
      rsi.push(100); // All gains, no losses
    } else {
      const rs = averageGains[i] / averageLosses[i];
      rsi.push(100 - (100 / (1 + rs)));
    }
    
    indices.push(i + 1); // RSI[i] corresponds to prices[i + 1]
  }

  return {
    rsi,
    priceChanges,
    gains,
    losses,
    averageGains,
    averageLosses,
    period,
    count: rsi.length,
    indices
  };
}
