import { z } from 'zod';

export const TimeWeightedReturnOptionsSchema = z.object({
  /**
   * Array of portfolio values at the end of each period
   */
  portfolioValues: z.array(z.number().positive()).min(2),
  
  /**
   * Array of cash flows (positive for inflows, negative for outflows)
   * Must have same length as portfolioValues
   */
  cashFlows: z.array(z.number()).min(2),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly)
   */
  annualizationFactor: z.number().positive().default(252),
});

export type TimeWeightedReturnOptions = z.infer<typeof TimeWeightedReturnOptionsSchema>;

