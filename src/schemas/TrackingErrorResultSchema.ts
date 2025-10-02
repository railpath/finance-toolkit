import { z } from 'zod';

export const TrackingErrorResultSchema = z.object({
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
   * Mean excess return
   */
  meanExcessReturn: z.number(),
  
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

export type TrackingErrorResult = z.infer<typeof TrackingErrorResultSchema>;

