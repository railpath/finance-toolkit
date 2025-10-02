import { z } from 'zod';

export const InformationRatioOptionsSchema = z.object({
  /**
   * Array of portfolio returns
   */
  portfolioReturns: z.array(z.number()).min(2),
  
  /**
   * Array of benchmark returns (must match portfolio returns length)
   */
  benchmarkReturns: z.array(z.number()).min(2),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly, 1 for annual)
   */
  annualizationFactor: z.number().positive().default(252),
  
  /**
   * Method for calculating standard deviation
   * - 'population': Use population standard deviation (N)
   * - 'sample': Use sample standard deviation (N-1)
   */
  method: z.enum(['population', 'sample']).default('sample'),
});

export type InformationRatioOptions = z.infer<typeof InformationRatioOptionsSchema>;

