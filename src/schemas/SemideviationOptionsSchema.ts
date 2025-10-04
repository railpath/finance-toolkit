import { z } from 'zod';

export const SemideviationOptionsSchema = z.object({
  /**
   * Array of returns to calculate semideviation for
   */
  returns: z.array(z.number()).min(2, 'At least 2 returns are required'),

  /**
   * Threshold for downside returns (default: 0 for zero threshold)
   */
  threshold: z.number().optional().default(0),

  /**
   * Annualization factor for converting to annualized values (default: 252 for daily data)
   */
  annualizationFactor: z.number().positive().optional().default(252),

  /**
   * Whether to return annualized semideviation (default: true)
   */
  annualized: z.boolean().optional().default(true),
});

export type SemideviationOptions = z.infer<typeof SemideviationOptionsSchema>;
