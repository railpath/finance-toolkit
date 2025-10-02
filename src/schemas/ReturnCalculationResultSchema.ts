import { z } from 'zod';

export const ReturnCalculationResultSchema = z.object({
  /**
   * Array of calculated returns
   */
  returns: z.array(z.number()),
  
  /**
   * Return calculation method used
   */
  method: z.enum(['simple', 'log']),
  
  /**
   * Number of returns calculated
   */
  periods: z.number(),
  
  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),
  
  /**
   * Whether returns are annualized
   */
  annualized: z.boolean(),
  
  /**
   * Mean return (period)
   */
  meanReturn: z.number(),
  
  /**
   * Mean return (annualized, if applicable)
   */
  meanReturnAnnualized: z.number().optional(),
  
  /**
   * Standard deviation of returns (period)
   */
  standardDeviation: z.number(),
  
  /**
   * Standard deviation of returns (annualized, if applicable)
   */
  standardDeviationAnnualized: z.number().optional(),
  
  /**
   * Total cumulative return (simple method only)
   */
  totalReturn: z.number().optional(),
  
  /**
   * Total cumulative return (log method only)
   */
  totalLogReturn: z.number().optional(),
});

export type ReturnCalculationResult = z.infer<typeof ReturnCalculationResultSchema>;
