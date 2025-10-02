import { z } from 'zod';

/**
 * Zod schema for VaR calculation options
 */
export const VaROptionsSchema = z.object({
  /** Confidence level (e.g., 0.95 for 95%) */
  confidenceLevel: z.number().min(0).max(1).describe('Confidence level between 0 and 1'),
  /** Method to use for calculation */
  method: z.enum(['historical', 'parametric', 'monteCarlo']).optional().default('historical'),
  /** Number of simulations for Monte Carlo (if applicable) */
  simulations: z.number().int().positive().optional().default(10000),
});

/**
 * Input type for VaR calculation options (user-provided)
 * Only confidenceLevel is required; method and simulations have defaults
 */
export type VaROptions = z.input<typeof VaROptionsSchema>;

/**
 * Validated type after parsing with defaults applied
 * All properties are guaranteed to exist
 */
export type VaROptionsValidated = z.output<typeof VaROptionsSchema>;
