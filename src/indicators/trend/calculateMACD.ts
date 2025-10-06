import { MACDOptions, MACDOptionsSchema } from '../../schemas/MACDOptionsSchema';

import { MACDResult } from '../../schemas/MACDResultSchema';

/**
 * Calculate MACD (Moving Average Convergence Divergence)
 * 
 * MACD is a trend-following momentum indicator that shows the relationship between two moving averages.
 * It consists of three components:
 * 1. MACD Line = Fast EMA - Slow EMA
 * 2. Signal Line = EMA of MACD Line
 * 3. Histogram = MACD Line - Signal Line
 * 
 * @param options - MACD calculation options
 * @returns MACD result with macdLine, signalLine, histogram, and metadata
 * 
 * @example
 * ```typescript
 * const result = calculateMACD({
 *   prices: [100, 102, 101, 103, 105, 104, 106, 108, 107, 109],
 *   fastPeriod: 12,
 *   slowPeriod: 26,
 *   signalPeriod: 9
 * });
 * 
 * console.log(result.macdLine);    // MACD line values
 * console.log(result.signalLine);  // Signal line values
 * console.log(result.histogram);   // Histogram values
 * ```
 */
export function calculateMACD(options: MACDOptions): MACDResult {
  const validatedOptions = MACDOptionsSchema.parse(options);
  const { prices, fastPeriod, slowPeriod, signalPeriod } = validatedOptions;

  // Validate that slowPeriod > fastPeriod
  if (slowPeriod <= fastPeriod) {
    throw new Error('Slow period must be greater than fast period');
  }

  // Validate minimum data requirement
  const minRequiredLength = slowPeriod + signalPeriod - 1;
  if (prices.length < minRequiredLength) {
    throw new Error(`At least ${minRequiredLength} prices are required for MACD calculation`);
  }

  // Calculate Fast EMA
  const fastEMA = calculateEMA(prices, fastPeriod);
  
  // Calculate Slow EMA
  const slowEMA = calculateEMA(prices, slowPeriod);
  
  // Calculate MACD Line (Fast EMA - Slow EMA)
  const macdLine: number[] = [];
  const macdIndices: number[] = [];
  
  // MACD line starts when both EMAs are available
  const startIndex = slowPeriod - 1; // Slow EMA starts later
  
  for (let i = startIndex; i < prices.length; i++) {
    const fastEMAValue = fastEMA[i];
    const slowEMAValue = slowEMA[i];
    macdLine.push(fastEMAValue - slowEMAValue);
    macdIndices.push(i);
  }
  
  // Calculate Signal Line (EMA of MACD Line)
  const signalLine = calculateEMA(macdLine, signalPeriod);
  
  // Calculate Histogram (MACD Line - Signal Line)
  const histogram: number[] = [];
  const resultIndices: number[] = [];
  
  // Histogram starts when signal line is available
  const histogramStartIndex = signalPeriod - 1;
  
  for (let i = histogramStartIndex; i < macdLine.length; i++) {
    histogram.push(macdLine[i] - signalLine[i]);
    resultIndices.push(macdIndices[i]);
  }
  
  // Prepare final MACD line and signal line arrays (same length as histogram)
  const finalMacdLine = macdLine.slice(histogramStartIndex);
  const finalSignalLine = signalLine.slice(histogramStartIndex);
  
  return {
    macdLine: finalMacdLine,
    signalLine: finalSignalLine,
    histogram,
    fastPeriod,
    slowPeriod,
    signalPeriod,
    count: histogram.length,
    indices: resultIndices
  };
}

/**
 * Helper function to calculate EMA
 */
function calculateEMA(prices: number[], period: number): number[] {
  const ema: number[] = new Array(prices.length);
  const smoothingFactor = 2 / (period + 1);
  
  // Initialize first EMA value with the first price
  ema[0] = prices[0];
  
  // Calculate EMA for subsequent prices
  for (let i = 1; i < prices.length; i++) {
    ema[i] = (prices[i] * smoothingFactor) + (ema[i - 1] * (1 - smoothingFactor));
  }
  
  return ema;
}
