import { z } from 'zod';

export const InformationRatioResultSchema = z.object({
  /**
   * Information ratio (annualized)
   */
  informationRatio: z.number().finite(),
  
  /**
   * Information ratio (period)
   */
  informationRatioPeriod: z.number().finite(),
  
  /**
   * Mean excess return (annualized)
   */
  meanExcessReturn: z.number(),
  
  /**
   * Mean excess return (period)
   */
  meanExcessReturnPeriod: z.number(),
  
  /**
   * Tracking error (annualized)
   */
  trackingError: z.number(),
  
  /**
   * Tracking error (period)
   */
  trackingErrorPeriod: z.number(),
  
  /**
   * Array of excess returns (portfolio - benchmark)
   */
  excessReturns: z.array(z.number()),
  
  /**
   * Number of periods
   */
  periods: z.number(),
  
  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),
  
  /**
   * Standard deviation method used
   */
  method: z.enum(['population', 'sample']),
});

export type InformationRatioResult = z.infer<typeof InformationRatioResultSchema>;
