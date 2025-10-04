import { z } from 'zod';

export const SemideviationResultSchema = z.object({
  /**
   * Semideviation value (period-based)
   */
  semideviation: z.number(),

  /**
   * Annualized semideviation value
   */
  annualizedSemideviation: z.number(),

  /**
   * Number of downside returns (returns below threshold)
   */
  downsideCount: z.number().int().min(0),

  /**
   * Total number of returns
   */
  totalCount: z.number().int().positive(),

  /**
   * Percentage of returns that are downside returns
   */
  downsidePercentage: z.number().min(0).max(100),

  /**
   * Threshold used for calculation
   */
  threshold: z.number(),

  /**
   * Annualization factor used
   */
  annualizationFactor: z.number(),

  /**
   * Mean return of the dataset
   */
  meanReturn: z.number(),

  /**
   * Standard deviation of the dataset (for comparison)
   */
  standardDeviation: z.number(),
});

export type SemideviationResult = z.infer<typeof SemideviationResultSchema>;
