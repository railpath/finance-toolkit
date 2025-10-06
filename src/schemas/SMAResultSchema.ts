import { z } from 'zod';

/**
 * Schema for Simple Moving Average (SMA) calculation result
 */
export const SMAResultSchema = z.object({
  /**
   * Array of SMA values (length: prices.length - period + 1)
   * First SMA value starts at index (period - 1)
   */
  sma: z.array(z.number()),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Number of SMA values calculated
   */
  count: z.number(),
  
  /**
   * Indices where SMA values correspond to original prices
   * sma[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type SMAResult = z.infer<typeof SMAResultSchema>;
