import { z } from 'zod';

/**
 * Schema for Exponential Moving Average (EMA) calculation result
 */
export const EMAResultSchema = z.object({
  /**
   * Array of EMA values (same length as input prices)
   * First (period-1) values are calculated using SMA for initialization
   */
  ema: z.array(z.number()),
  
  /**
   * The period used for calculation
   */
  period: z.number(),
  
  /**
   * Smoothing factor (alpha) used in EMA calculation
   * alpha = 2 / (period + 1)
   */
  smoothingFactor: z.number(),
  
  /**
   * Number of EMA values calculated
   */
  count: z.number()
});

export type EMAResult = z.infer<typeof EMAResultSchema>;
