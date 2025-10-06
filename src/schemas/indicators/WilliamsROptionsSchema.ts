import { z } from 'zod';

/**
 * Schema for Williams %R calculation options
 */
export const WilliamsROptionsSchema = z.object({
  /**
   * Array of high prices
   */
  high: z.array(z.number()).min(1, 'High prices array must contain at least one value'),
  
  /**
   * Array of low prices
   */
  low: z.array(z.number()).min(1, 'Low prices array must contain at least one value'),
  
  /**
   * Array of closing prices
   */
  close: z.array(z.number()).min(1, 'Close prices array must contain at least one value'),
  
  /**
   * Period for Williams %R calculation (typically 14)
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive')
    .default(14)
});

export type WilliamsROptions = z.input<typeof WilliamsROptionsSchema>;
