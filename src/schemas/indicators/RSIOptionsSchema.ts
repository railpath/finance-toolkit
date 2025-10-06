import { z } from 'zod';

/**
 * Schema for Relative Strength Index (RSI) calculation options
 */
export const RSIOptionsSchema = z.object({
  /**
   * Array of price values (typically closing prices)
   */
  prices: z.array(z.number()).min(1, 'Prices array must contain at least one value'),
  
  /**
   * Period for the RSI calculation
   * Must be positive and not exceed (prices.length - 1)
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive')
});

export type RSIOptions = z.infer<typeof RSIOptionsSchema>;