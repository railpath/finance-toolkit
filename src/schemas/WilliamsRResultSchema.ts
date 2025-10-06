import { z } from 'zod';

/**
 * Schema for Williams %R calculation result
 */
export const WilliamsRResultSchema = z.object({
  /**
   * Array of Williams %R values (-100 to 0)
   */
  williamsR: z.array(z.number().min(-100).max(0)),
  
  /**
   * Array of highest high values in the period
   */
  highestHigh: z.array(z.number()),
  
  /**
   * Array of lowest low values in the period
   */
  lowestLow: z.array(z.number()),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Number of Williams %R values calculated
   */
  count: z.number(),
  
  /**
   * Indices where Williams %R values correspond to original prices
   * williamsR[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type WilliamsRResult = z.infer<typeof WilliamsRResultSchema>;
