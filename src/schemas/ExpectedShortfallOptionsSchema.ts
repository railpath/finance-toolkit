import { z } from 'zod';

/**
 * Zod schema for Expected Shortfall calculation options
 */
export const ExpectedShortfallOptionsSchema = z.object({
  /** Confidence level (e.g., 0.95 for 95%) */
  confidenceLevel: z.number().min(0).max(1).describe('Confidence level between 0 and 1'),
  /** Method to use for calculation */
  method: z.enum(['historical', 'parametric', 'monteCarlo']).optional().default('historical'),
  /** Number of simulations for Monte Carlo (if applicable) */
  simulations: z.number().int().positive().optional().default(10000),
});

export type ExpectedShortfallOptions = z.input<typeof ExpectedShortfallOptionsSchema>;
export type ExpectedShortfallOptionsValidated = z.output<typeof ExpectedShortfallOptionsSchema>;