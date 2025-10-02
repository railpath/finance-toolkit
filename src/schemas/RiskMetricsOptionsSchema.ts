import { z } from 'zod';

export const RiskMetricsOptionsSchema = z.object({
  /**
   * Asset returns for each asset and period (asset x period matrix)
   */
  assetReturns: z.array(z.array(z.number())).min(1),
  
  /**
   * Benchmark returns for each period (optional for some metrics)
   */
  benchmarkReturns: z.array(z.number()).optional(),
  
  /**
   * Risk-free rate (optional, for beta calculation)
   */
  riskFreeRate: z.number().optional(),
  
  /**
   * Annualization factor (e.g., 252 for daily, 12 for monthly, 1 for annual)
   */
  annualizationFactor: z.number().positive().default(252),
  
  /**
   * Confidence level for downside deviation (e.g., 0.05 for 5%)
   */
  confidenceLevel: z.number().min(0).max(1).default(0.05),
});

export type RiskMetricsOptions = z.infer<typeof RiskMetricsOptionsSchema>;
