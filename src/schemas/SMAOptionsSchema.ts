import { z } from 'zod';

/**
 * Schema for Simple Moving Average (SMA) calculation options
 */
export const SMAOptionsSchema = z.object({
  /**
   * Array of price values (typically closing prices)
   */
  prices: z.array(z.number()).min(1, 'Prices array must contain at least one value'),
  
  /**
   * Period for the moving average calculation
   * Must be positive and not exceed the length of prices array
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive')
});

export type SMAOptions = z.infer<typeof SMAOptionsSchema>;