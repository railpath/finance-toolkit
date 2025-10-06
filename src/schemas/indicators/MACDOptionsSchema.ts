import { z } from 'zod';

/**
 * Schema for MACD (Moving Average Convergence Divergence) calculation options
 */
export const MACDOptionsSchema = z.object({
  /**
   * Array of price values (typically closing prices)
   */
  prices: z.array(z.number()).min(1, 'Prices array must contain at least one value'),
  
  /**
   * Fast EMA period (typically 12)
   */
  fastPeriod: z.number()
    .int('Fast period must be an integer')
    .positive('Fast period must be positive')
    .default(12),
  
  /**
   * Slow EMA period (typically 26)
   */
  slowPeriod: z.number()
    .int('Slow period must be an integer')
    .positive('Slow period must be positive')
    .default(26),
  
  /**
   * Signal line EMA period (typically 9)
   */
  signalPeriod: z.number()
    .int('Signal period must be an integer')
    .positive('Signal period must be positive')
    .default(9)
});

export type MACDOptions = z.infer<typeof MACDOptionsSchema>;
