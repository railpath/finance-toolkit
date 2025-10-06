import { z } from 'zod';

/**
 * Schema for Bollinger Bands calculation options
 */
export const BollingerBandsOptionsSchema = z.object({
  /**
   * Array of price values (typically closing prices)
   */
  prices: z.array(z.number()).min(1, 'Prices array must contain at least one value'),
  
  /**
   * Period for the moving average and standard deviation calculation
   * Must be positive and not exceed the length of prices array
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive'),
  
  /**
   * Standard deviation multiplier (typically 2)
   * Must be positive
   */
  stdDevMultiplier: z.number()
    .positive('Standard deviation multiplier must be positive')
    .default(2)
});

export type BollingerBandsOptions = z.infer<typeof BollingerBandsOptionsSchema>;