import { z } from 'zod';

/**
 * Schema for Stochastic Oscillator calculation result
 */
export const StochasticResultSchema = z.object({
  /**
   * Array of %K values (0-100)
   */
  percentK: z.array(z.number().min(0).max(100)),
  
  /**
   * Array of %D values (SMA of %K, 0-100)
   */
  percentD: z.array(z.number().min(0).max(100)),
  
  /**
   * Array of highest high values in the period
   */
  highestHigh: z.array(z.number()),
  
  /**
   * Array of lowest low values in the period
   */
  lowestLow: z.array(z.number()),
  
  /**
   * K period used
   */
  kPeriod: z.number(),
  
  /**
   * D period used
   */
  dPeriod: z.number(),
  
  /**
   * Number of Stochastic values calculated
   */
  count: z.number(),
  
  /**
   * Indices where Stochastic values correspond to original prices
   * percentK[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type StochasticResult = z.infer<typeof StochasticResultSchema>;
