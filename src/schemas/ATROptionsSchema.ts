import { z } from 'zod';

/**
 * Schema for Average True Range (ATR) calculation options
 */
export const ATROptionsSchema = z.object({
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
   * Period for the ATR calculation
   * Must be positive and not exceed the length of price arrays
   */
  period: z.number()
    .int('Period must be an integer')
    .positive('Period must be positive')
});

export type ATROptions = z.infer<typeof ATROptionsSchema>;