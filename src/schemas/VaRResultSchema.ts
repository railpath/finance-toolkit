import { z } from 'zod';

/**
 * Zod schema for VaR calculation result
 */
export const VaRResultSchema = z.object({
  /** VaR value (absolute loss threshold) */
  value: z.number().nonnegative().describe('VaR value (absolute loss threshold)'),
  /** Confidence level used */
  confidenceLevel: z.number().min(0).max(1),
  /** Method used */
  method: z.string(),
  /** CVaR (Conditional VaR / Expected Shortfall) */
  cvar: z.number().nonnegative().optional(),
});

export type VaRResult = z.infer<typeof VaRResultSchema>;