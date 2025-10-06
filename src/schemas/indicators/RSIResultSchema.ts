import { z } from 'zod';

/**
 * Schema for Relative Strength Index (RSI) calculation result
 */
export const RSIResultSchema = z.object({
  /**
   * Array of RSI values (length: prices.length - 1)
   * RSI values start from index 1 (no RSI for first price)
   * Values range from 0 to 100
   */
  rsi: z.array(z.number().min(0).max(100)),
  
  /**
   * Array of price changes (gains and losses)
   * Length: prices.length - 1
   */
  priceChanges: z.array(z.number()),
  
  /**
   * Array of gains (positive price changes)
   * Length: prices.length - 1
   */
  gains: z.array(z.number().min(0)),
  
  /**
   * Array of losses (absolute value of negative price changes)
   * Length: prices.length - 1
   */
  losses: z.array(z.number().min(0)),
  
  /**
   * Array of average gains (smoothed)
   * Length: prices.length - 1
   */
  averageGains: z.array(z.number().min(0)),
  
  /**
   * Array of average losses (smoothed)
   * Length: prices.length - 1
   */
  averageLosses: z.array(z.number().min(0)),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Number of RSI values calculated
   */
  count: z.number(),
  
  /**
   * Indices where RSI values correspond to original prices
   * rsi[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type RSIResult = z.infer<typeof RSIResultSchema>;
