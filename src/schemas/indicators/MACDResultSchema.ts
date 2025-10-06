import { z } from 'zod';

/**
 * Schema for MACD (Moving Average Convergence Divergence) calculation result
 */
export const MACDResultSchema = z.object({
  /**
   * Array of MACD line values (fast EMA - slow EMA)
   */
  macdLine: z.array(z.number()),
  
  /**
   * Array of signal line values (EMA of MACD line)
   */
  signalLine: z.array(z.number()),
  
  /**
   * Array of histogram values (MACD line - signal line)
   */
  histogram: z.array(z.number()),
  
  /**
   * Fast EMA period used
   */
  fastPeriod: z.number(),
  
  /**
   * Slow EMA period used
   */
  slowPeriod: z.number(),
  
  /**
   * Signal EMA period used
   */
  signalPeriod: z.number(),
  
  /**
   * Number of MACD values calculated
   */
  count: z.number(),
  
  /**
   * Indices where MACD values correspond to original prices
   * macdLine[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type MACDResult = z.infer<typeof MACDResultSchema>;
