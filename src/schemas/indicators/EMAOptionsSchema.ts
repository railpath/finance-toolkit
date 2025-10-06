import { z } from 'zod';

/**
 * Schema for Exponential Moving Average (EMA) calculation options
 */
export const EMAOptionsSchema = z.object({
  /**
   * Array of price values (typically closing prices)
   */
  prices: z.array(z.number()).min(1, 'Prices array must contain at least one value'),
  
  /**
   * Period for the EMA calculation
   * Must be positive and not exceed the length of prices array
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive')
});

export type EMAOptions = z.infer<typeof EMAOptionsSchema>;