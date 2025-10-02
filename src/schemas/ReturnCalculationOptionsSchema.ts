import { z } from 'zod';

export const ReturnCalculationOptionsSchema = z.object({
  /**
   * Array of asset prices
   */
  prices: z.array(z.number().positive()).min(2),
  
  /**
   * Return calculation method
   * - 'simple': (P_t - P_{t-1}) / P_{t-1}
   * - 'log': ln(P_t / P_{t-1})
   */
  method: z.enum(['simple', 'log']).default('simple'),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly, 1 for annual)
   */
  annualizationFactor: z.number().positive().default(252),
  
  /**
   * Whether to annualize the returns
   */
  annualize: z.boolean().default(false),
});

export type ReturnCalculationOptions = z.infer<typeof ReturnCalculationOptionsSchema>;
