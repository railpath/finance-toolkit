import { BollingerBandsOptions, BollingerBandsOptionsSchema } from '../../schemas/indicators/BollingerBandsOptionsSchema';

import { BollingerBandsResult } from '../../schemas/indicators/BollingerBandsResultSchema';

/**
 * Calculate Bollinger Bands
 * 
 * Bollinger Bands consist of three lines:
 * - Middle Band: Simple Moving Average (SMA)
 * - Upper Band: SMA + (Standard Deviation × Multiplier)
 * - Lower Band: SMA - (Standard Deviation × Multiplier)
 * 
 * Bollinger Bands are used to identify:
 * - Overbought conditions (price near upper band)
 * - Oversold conditions (price near lower band)
 * - Volatility expansion/contraction (bandwidth changes)
 * 
 * @param options - Bollinger Bands calculation options
 * @returns Bollinger Bands calculation result
 * 
 * @example
 * ```typescript
 * const prices = [10, 12, 11, 13, 14, 12, 15, 16, 14, 13];
 * const result = calculateBollingerBands({ prices, period: 3, stdDevMultiplier: 2 });
 * console.log(result.upperBand); // [14.16, 15.16, 16.16, ...]
 * console.log(result.middleBand); // [11, 12, 13, ...]
 * console.log(result.lowerBand); // [7.84, 8.84, 9.84, ...]
 * ```
 */
export function calculateBollingerBands(options: BollingerBandsOptions): BollingerBandsResult {
  // Validate input with defaults
  const validatedOptions = BollingerBandsOptionsSchema.parse(options);
  const { prices, period, stdDevMultiplier } = validatedOptions;

  // Additional validation
  if (period > prices.length) {
    throw new Error('Period cannot exceed the length of prices array');
  }

  const upperBand: number[] = [];
  const middleBand: number[] = [];
  const lowerBand: number[] = [];
  const bandwidth: number[] = [];
  const percentB: number[] = [];
  const indices: number[] = [];

  // Calculate Bollinger Bands for each possible window
  for (let i = period - 1; i < prices.length; i++) {
    // Get price window for current period
    const priceWindow = prices.slice(i - period + 1, i + 1);
    
    // Calculate SMA (middle band)
    const sum = priceWindow.reduce((acc, price) => acc + price, 0);
    const sma = sum / period;
    
    // Calculate standard deviation
    const variance = priceWindow.reduce((acc, price) => acc + Math.pow(price - sma, 2), 0) / period;
    const stdDev = Math.sqrt(variance);
    
    // Calculate bands
    const upper = sma + (stdDev * stdDevMultiplier);
    const lower = sma - (stdDev * stdDevMultiplier);
    
    // Calculate %B for current price
    const currentPrice = prices[i];
    const percentBValue = (upper - lower) === 0 ? 1 : (currentPrice - lower) / (upper - lower);
    
    upperBand.push(upper);
    middleBand.push(sma);
    lowerBand.push(lower);
    bandwidth.push(upper - lower);
    percentB.push(percentBValue);
    indices.push(i);
  }

  return {
    upperBand,
    middleBand,
    lowerBand,
    bandwidth,
    percentB,
    period,
    stdDevMultiplier,
    count: upperBand.length,
    indices
  };
}
