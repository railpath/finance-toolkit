import { z } from 'zod';

export const TimeWeightedReturnResultSchema = z.object({
  /**
   * Time-weighted return (period)
   */
  twr: z.number(),
  
  /**
   * Annualized time-weighted return
   */
  annualizedTWR: z.number(),
  
  /**
   * Number of periods
   */
  periods: z.number(),
  
  /**
   * Individual period returns
   */
  periodReturns: z.array(z.number()),
});

export type TimeWeightedReturnResult = z.infer<typeof TimeWeightedReturnResultSchema>;

