import { z } from 'zod';

export const PerformanceAttributionOptionsSchema = z.object({
  /**
   * Portfolio returns for each period
   */
  portfolioReturns: z.array(z.number()).min(1),
  
  /**
   * Benchmark returns for each period
   */
  benchmarkReturns: z.array(z.number()).min(1),
  
  /**
   * Asset returns for each asset and period (asset x period matrix)
   */
  assetReturns: z.array(z.array(z.number())).min(1),
  
  /**
   * Portfolio weights for each asset and period (asset x period matrix)
   */
  portfolioWeights: z.array(z.array(z.number())).min(1),
  
  /**
   * Benchmark weights for each asset and period (asset x period matrix)
   */
  benchmarkWeights: z.array(z.array(z.number())).min(1),
  
  /**
   * Attribution method
   * - 'brinson': Brinson attribution model
   * - 'arithmetic': Arithmetic attribution
   */
  method: z.enum(['brinson', 'arithmetic']).default('brinson'),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly, 1 for annual)
   */
  annualizationFactor: z.number().positive().default(252),
});

export type PerformanceAttributionOptions = z.infer<typeof PerformanceAttributionOptionsSchema>;
