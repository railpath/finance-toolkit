import { ATROptions, ATROptionsSchema } from '../../schemas/ATROptionsSchema';

import { ATRResult } from '../../schemas/ATRResultSchema';

/**
 * Calculate Average True Range (ATR)
 * 
 * ATR is a volatility indicator that measures the degree of price volatility.
 * It shows the average range of price movement over a specified period.
 * 
 * True Range is the greatest of:
 * 1. Current High - Current Low
 * 2. |Current High - Previous Close|
 * 3. |Current Low - Previous Close|
 * 
 * ATR is calculated as the moving average of True Range values.
 * 
 * @param options - ATR calculation options
 * @returns ATR calculation result
 * 
 * @example
 * ```typescript
 * const high = [12, 13, 14, 15, 16, 15, 14, 13, 12, 11];
 * const low = [10, 11, 12, 13, 14, 13, 12, 11, 10, 9];
 * const close = [11, 12, 13, 14, 15, 14, 13, 12, 11, 10];
 * const result = calculateATR({ high, low, close, period: 3 });
 * console.log(result.atr); // [1.33, 1.33, 1.33, 1.33, 1.33, 1.33, 1.33, 1.33]
 * ```
 */
export function calculateATR(options: ATROptions): ATRResult {
  // Validate input
  const validatedOptions = ATROptionsSchema.parse(options);
  const { high, low, close, period } = validatedOptions;

  // Ensure all arrays have the same length
  const minLength = Math.min(high.length, low.length, close.length);
  if (high.length !== minLength || low.length !== minLength || close.length !== minLength) {
    throw new Error('All price arrays (high, low, close) must have the same length');
  }

  // Additional validation
  if (period > minLength) {
    throw new Error('Period cannot exceed the length of price arrays');
  }

  const trueRange: number[] = [];
  const atr: number[] = [];
  const indices: number[] = [];

  // Calculate True Range for each period
  for (let i = 0; i < minLength; i++) {
    let tr: number;
    
    if (i === 0) {
      // First period: True Range = High - Low
      tr = high[i] - low[i];
    } else {
      // Subsequent periods: True Range = max of three values
      const hl = high[i] - low[i];
      const hc = Math.abs(high[i] - close[i - 1]);
      const lc = Math.abs(low[i] - close[i - 1]);
      tr = Math.max(hl, hc, lc);
    }
    
    trueRange.push(tr);
  }

  // Calculate ATR using exponential moving average of True Range
  // Initialize first ATR value with simple average of first period TR values
  let sum = 0;
  const initialPeriod = Math.min(period, trueRange.length);
  
  for (let i = 0; i < initialPeriod; i++) {
    sum += trueRange[i];
  }
  
  let currentATR = sum / initialPeriod;
  
  // Calculate ATR for each period
  for (let i = 0; i < trueRange.length; i++) {
    if (i < period) {
      // For initial periods, use simple average
      atr.push(currentATR);
    } else {
      // Use exponential smoothing for subsequent periods
      // ATR = (Previous ATR * (Period - 1) + Current TR) / Period
      currentATR = (currentATR * (period - 1) + trueRange[i]) / period;
      atr.push(currentATR);
    }
    
    indices.push(i);
  }

  return {
    trueRange,
    atr,
    period,
    count: atr.length,
    indices
  };
}
