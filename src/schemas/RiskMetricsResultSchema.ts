import { z } from 'zod';

export const RiskMetricsResultSchema = z.object({
  /**
   * Beta for each asset relative to benchmark (NaN if no benchmark or insufficient data)
   */
  betas: z.array(z.number()),
  
  /**
   * Correlation matrix between all assets (NaN if insufficient data)
   */
  correlationMatrix: z.array(z.array(z.number())),
  
  /**
   * Downside deviation for each asset
   */
  downsideDeviations: z.array(z.number()),
  
  /**
   * Annualized downside deviation for each asset
   */
  downsideDeviationsAnnualized: z.array(z.number()),
  
  /**
   * Number of assets
   */
  assets: z.number(),
  
  /**
   * Number of periods
   */
  periods: z.number(),
  
  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),
  
  /**
   * Confidence level used for downside deviation
   */
  confidenceLevel: z.number(),
  
  /**
   * Risk-free rate used (if provided)
   */
  riskFreeRate: z.number().optional(),
});

export type RiskMetricsResult = z.infer<typeof RiskMetricsResultSchema>;
