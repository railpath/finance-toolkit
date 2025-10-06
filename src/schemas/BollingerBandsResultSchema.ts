import { z } from 'zod';

/**
 * Schema for Bollinger Bands calculation result
 */
export const BollingerBandsResultSchema = z.object({
  /**
   * Array of upper band values
   * Length: prices.length - period + 1
   */
  upperBand: z.array(z.number()),
  
  /**
   * Array of middle band values (SMA)
   * Length: prices.length - period + 1
   */
  middleBand: z.array(z.number()),
  
  /**
   * Array of lower band values
   * Length: prices.length - period + 1
   */
  lowerBand: z.array(z.number()),
  
  /**
   * Array of bandwidth values (upper - lower)
   * Length: prices.length - period + 1
   */
  bandwidth: z.array(z.number()),
  
  /**
   * Array of %B values (position of price relative to bands)
   * Length: prices.length - period + 1
   * %B = (Price - Lower Band) / (Upper Band - Lower Band)
   */
  percentB: z.array(z.number()),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Standard deviation multiplier used
   */
  stdDevMultiplier: z.number(),
  
  /**
   * Number of band values calculated
   */
  count: z.number(),
  
  /**
   * Indices where band values correspond to original prices
   * bands[i] corresponds to prices[indices[i]]
   */
  indices: z.array(z.number())
});

export type BollingerBandsResult = z.infer<typeof BollingerBandsResultSchema>;
