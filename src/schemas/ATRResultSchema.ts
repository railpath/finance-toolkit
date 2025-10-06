import { z } from 'zod';

/**
 * Schema for Average True Range (ATR) calculation result
 */
export const ATRResultSchema = z.object({
  /**
   * Array of True Range values
   * Length: min(high.length, low.length, close.length)
   */
  trueRange: z.array(z.number().min(0)),
  
  /**
   * Array of ATR values
   * Length: min(high.length, low.length, close.length)
   */
  atr: z.array(z.number().min(0)),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Number of ATR values calculated
   */
  count: z.number(),
  
  /**
   * Indices where ATR values correspond to original prices
   * atr[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type ATRResult = z.infer<typeof ATRResultSchema>;
