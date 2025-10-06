import { z } from 'zod';

/**
 * Schema for Stochastic Oscillator calculation options
 */
export const StochasticOptionsSchema = z.object({
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
   * Period for %K calculation (typically 14)
   */
  kPeriod: z.number()
    .int('K period must be an integer')
    .positive('K period must be positive')
    .default(14),
  
  /**
   * Period for %D calculation (typically 3)
   */
  dPeriod: z.number()
    .int('D period must be an integer')
    .positive('D period must be positive')
    .default(3)
});

export type StochasticOptions = z.infer<typeof StochasticOptionsSchema>;
